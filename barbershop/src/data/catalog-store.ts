import { useSyncExternalStore } from "react";

import { supabase } from "@/lib/supabase";
import { products as seedProducts, type Product } from "./products";
import type { Service } from "./services"; // seedServices tidak dipakai lagi

/* ---------------- Langganan (pub/sub) ---------------- */

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/* ---------------- Produk (masih di memori, Tahap 2) ---------------- */

// Prototype only: data produk disimpan di memori, kembali ke data awal saat app di-reload.
let productList: Product[] = [...seedProducts];

export type ProductInput = Omit<Product, "id">;

export function useProducts() {
  return useSyncExternalStore(
    subscribe,
    () => productList,
    () => productList,
  );
}

export function addProduct(input: ProductInput): Product {
  const lastNumber = productList.reduce(
    (max, item) => Math.max(max, Number(item.id.replace(/\D/g, "")) || 0),
    0,
  );
  const product: Product = {
    ...input,
    id: `P${String(lastNumber + 1).padStart(3, "0")}`,
  };
  productList = [...productList, product];
  notify();
  return product;
}

export function updateProduct(id: string, input: ProductInput) {
  productList = productList.map((item) =>
    item.id === id ? { ...input, id } : item,
  );
  notify();
}

export function deleteProduct(id: string) {
  productList = productList.filter((item) => item.id !== id);
  notify();
}

/* ---------------- Layanan (Supabase) ---------------- */

const BUCKET = "layanan";
const COLUMNS =
  "id, nama, deskripsi, kategori, harga, harga_pendek, harga_sedang, foto_url, created_at";
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800";
const MARKER = `/storage/v1/object/public/${BUCKET}/`;

export type ServiceInput = Omit<Service, "id">;

type ServiceRow = {
  id: string;
  nama: string;
  deskripsi: string;
  kategori: string;
  harga: number | null;
  harga_pendek: number | null;
  harga_sedang: number | null;
  foto_url: string | null;
  created_at: string;
};

type ServiceStatus = { loading: boolean; error: string | null };

let serviceList: Service[] = [];
let serviceStatus: ServiceStatus = { loading: false, error: null };

function setServiceStatus(patch: Partial<ServiceStatus>) {
  // objek baru supaya useSyncExternalStore terpicu
  serviceStatus = { ...serviceStatus, ...patch };
  notify();
}

export function useServices() {
  return useSyncExternalStore(
    subscribe,
    () => serviceList,
    () => serviceList,
  );
}

export function useServiceStatus() {
  return useSyncExternalStore(
    subscribe,
    () => serviceStatus,
    () => serviceStatus,
  );
}

export const getServiceError = () => serviceStatus.error;

/* ---- pemetaan baris database <-> tipe Service ---- */

function fromRow(r: ServiceRow): Service {
  const base = {
    id: r.id,
    name: r.nama,
    description: r.deskripsi,
    category: r.kategori,
    image: r.foto_url ?? DEFAULT_IMAGE,
  };
  return r.harga_pendek !== null && r.harga_sedang !== null
    ? { ...base, prices: { short: r.harga_pendek, medium: r.harga_sedang } }
    : { ...base, price: r.harga ?? undefined };
}

function toRow(input: ServiceInput, fotoUrl: string | null) {
  return {
    nama: input.name,
    deskripsi: input.description,
    kategori: input.category,
    harga: input.prices ? null : (input.price ?? null),
    harga_pendek: input.prices?.short ?? null,
    harga_sedang: input.prices?.medium ?? null,
    foto_url: fotoUrl,
  };
}

// URL bawaan form (placeholder) tidak perlu disimpan ke database
const keepUrl = (input: ServiceInput) =>
  input.image === DEFAULT_IMAGE ? null : input.image;

function translateError(e: unknown): string {
  console.warn("[catalog-store] error:", e); // lihat Metro terminal / Console browser
  const err = e as { message?: string };
  if (
    err?.message?.includes("Failed to fetch") ||
    err?.message?.includes("Network request failed")
  ) {
    return "Tidak bisa terhubung ke Supabase. Periksa EXPO_PUBLIC_SUPABASE_URL di .env, koneksi internet, lalu restart dengan npx expo start -c.";
  }
  if (err?.message?.includes("row-level security")) {
    return "Akses ditolak RLS. Periksa policy tabel layanan dan bucket layanan.";
  }
  return err?.message ?? "Terjadi kesalahan tak terduga.";
}

/* ---- foto: upload dulu, simpan URL kemudian ---- */

const MIME_BY_EXT: Record<string, string> = {
  png: "image/png",
  webp: "image/webp",
  jpg: "image/jpeg",
};

// Ekstensi tidak boleh diambil mentah dari uri: di web uri berbentuk
// "blob:http://..." atau "data:image/...", sehingga menghasilkan nama file
// yang tidak valid dan upload ditolak.
function detectExt(uri: string, headerMime: string | null): "jpg" | "png" | "webp" {
  const fromUri = uri.split("?")[0].match(/\.(jpe?g|png|webp)$/i)?.[1]?.toLowerCase();
  if (fromUri === "png" || fromUri === "webp") return fromUri;
  if (fromUri) return "jpg";
  const mime = (headerMime ?? "") || (uri.startsWith("data:") ? uri.slice(5, 30) : "");
  if (mime.includes("png")) return "png";
  if (mime.includes("webp")) return "webp";
  return "jpg";
}

async function uploadPhoto(uri: string): Promise<string> {
  // File lokal diubah ke ArrayBuffer dulu: upload langsung dari uri
  // tidak andal di React Native.
  let res: Response;
  try {
    res = await fetch(uri);
  } catch {
    throw new Error("Gagal membaca file foto dari perangkat. Pilih foto lagi.");
  }
  const buffer = await res.arrayBuffer();
  const ext = detectExt(uri, res.headers.get("content-type"));
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: MIME_BY_EXT[ext],
  });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

// Tidak pernah melempar error: gagal hapus file tidak boleh membatalkan operasi utama.
async function removePhoto(url: string): Promise<void> {
  const i = url.indexOf(MARKER);
  if (i === -1) return; // foto bawaan (Unsplash), bukan milik bucket kita
  try {
    await supabase.storage
      .from(BUCKET)
      .remove([decodeURIComponent(url.slice(i + MARKER.length))]);
  } catch {
    // diabaikan
  }
}

/* ---- CRUD ---- */

export async function loadServices(): Promise<void> {
  setServiceStatus({ loading: true, error: null });
  const { data, error } = await supabase
    .from("layanan")
    .select(COLUMNS)
    .order("created_at", { ascending: true })
    .order("nama", { ascending: true });
  if (error) {
    setServiceStatus({ loading: false, error: translateError(error) });
    return;
  }
  serviceList = (data as ServiceRow[]).map(fromRow);
  setServiceStatus({ loading: false });
}

export async function addService(
  input: ServiceInput,
  photoUri?: string | null,
): Promise<boolean> {
  setServiceStatus({ loading: true, error: null });
  let uploaded: string | null = null;
  try {
    uploaded = photoUri ? await uploadPhoto(photoUri) : null;
    const { data, error } = await supabase
      .from("layanan")
      .insert(toRow(input, uploaded ?? keepUrl(input)))
      .select(COLUMNS)
      .single();
    if (error) throw error;
    serviceList = [...serviceList, fromRow(data as ServiceRow)];
    setServiceStatus({ loading: false });
    return true;
  } catch (e) {
    // insert gagal -> jangan tinggalkan file yatim di bucket
    if (uploaded) await removePhoto(uploaded);
    setServiceStatus({ loading: false, error: translateError(e) });
    return false;
  }
}

export async function updateService(
  id: string,
  input: ServiceInput,
  photoUri?: string | null,
): Promise<boolean> {
  setServiceStatus({ loading: true, error: null });
  const old = serviceList.find((s) => s.id === id);
  let uploaded: string | null = null;
  try {
    uploaded = photoUri ? await uploadPhoto(photoUri) : null;
    const { data, error } = await supabase
      .from("layanan")
      .update(toRow(input, uploaded ?? keepUrl(input)))
      .eq("id", id)
      .select(COLUMNS)
      .single();
    if (error) throw error;
    serviceList = serviceList.map((s) =>
      s.id === id ? fromRow(data as ServiceRow) : s,
    );
    setServiceStatus({ loading: false });
  } catch (e) {
    if (uploaded) await removePhoto(uploaded);
    setServiceStatus({ loading: false, error: translateError(e) });
    return false;
  }
  // Di luar try: database sudah berhasil, jadi foto lama dibuang setelah yang baru aman.
  if (uploaded && old) await removePhoto(old.image);
  return true;
}

export async function deleteService(id: string): Promise<boolean> {
  setServiceStatus({ loading: true, error: null });
  const old = serviceList.find((s) => s.id === id);
  const { error } = await supabase.from("layanan").delete().eq("id", id);
  if (error) {
    setServiceStatus({ loading: false, error: translateError(error) });
    return false;
  }
  serviceList = serviceList.filter((s) => s.id !== id);
  setServiceStatus({ loading: false });
  if (old) await removePhoto(old.image); // baris dan file ikut terhapus
  return true;
}