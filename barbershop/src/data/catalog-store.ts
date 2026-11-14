import { useSyncExternalStore } from "react";

import { supabase } from "@/lib/supabase";
import type { Product } from "./products";
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

/* ---------------- Layanan (Supabase) ---------------- */

const BUCKET = "layanan";
const COLUMNS =
  "id, nama, deskripsi, kategori, harga, harga_pendek, harga_sedang, foto_url, created_at";
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800";

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
  const err = e as { message?: string; code?: string };
  if (
    err?.message?.includes("Failed to fetch") ||
    err?.message?.includes("Network request failed")
  ) {
    return "Tidak bisa terhubung ke Supabase. Periksa EXPO_PUBLIC_SUPABASE_URL di .env, koneksi internet, lalu restart dengan npx expo start -c.";
  }
  if (err?.message?.includes("row-level security")) {
    return "Akses ditolak. Hanya admin yang boleh mengubah data ini: pastikan Anda masuk sebagai admin.";
  }
  if (err?.code === "23505") {
    return "Data dengan nama yang sama sudah ada.";
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

async function uploadPhoto(bucket: string, uri: string): Promise<string> {
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
  const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
    contentType: MIME_BY_EXT[ext],
  });
  if (error) throw error;
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

// Tidak pernah melempar error: gagal hapus file tidak boleh membatalkan operasi utama.
async function removePhoto(bucket: string, url: string): Promise<void> {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const i = url.indexOf(marker);
  if (i === -1) return; // foto bawaan (Unsplash/situs lain), bukan milik bucket kita
  try {
    await supabase.storage
      .from(bucket)
      .remove([decodeURIComponent(url.slice(i + marker.length))]);
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
    uploaded = photoUri ? await uploadPhoto(BUCKET, photoUri) : null;
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
    if (uploaded) await removePhoto(BUCKET, uploaded);
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
  let oldPhotoToRemove: string | null = null;
  try {
    uploaded = photoUri ? await uploadPhoto(BUCKET, photoUri) : null;
    const { data, error } = await supabase
      .from("layanan")
      .update(toRow(input, uploaded ?? keepUrl(input)))
      .eq("id", id)
      .select(COLUMNS)
      .single();
    if (error) throw error;
    const saved = fromRow(data as ServiceRow);
    serviceList = serviceList.map((s) => (s.id === id ? saved : s));
    setServiceStatus({ loading: false });
    // Foto lama dibuang bila fotonya diganti ATAU dihapus (alamat berubah).
    if (old && old.image !== saved.image) oldPhotoToRemove = old.image;
  } catch (e) {
    if (uploaded) await removePhoto(BUCKET, uploaded);
    setServiceStatus({ loading: false, error: translateError(e) });
    return false;
  }
  // Di luar try: database sudah berhasil, jadi gagal hapus file tidak boleh
  // membatalkan hasil simpan.
  if (oldPhotoToRemove) await removePhoto(BUCKET, oldPhotoToRemove);
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
  if (old) await removePhoto(BUCKET, old.image); // baris dan file ikut terhapus
  return true;
}

/**
 * Pencarian di sisi server (ilike). Tidak mengubah daftar utama (serviceList),
 * jadi Home dan Booking tidak ikut terfilter.
 * Mengembalikan null bila kata kunci kosong (artinya: pakai daftar penuh).
 */
export async function searchServices(query: string): Promise<Service[] | null> {
  const q = query.trim();
  if (!q) return null;
  // karakter khusus LIKE (\ % _) di-escape supaya dicari apa adanya
  const pattern = `%${q.replace(/[\\%_]/g, "\\$&")}%`;
  const { data, error } = await supabase
    .from("layanan")
    .select(COLUMNS)
    .ilike("nama", pattern)
    .order("created_at", { ascending: true })
    .order("nama", { ascending: true });
  if (error) throw new Error(translateError(error));
  return (data as ServiceRow[]).map(fromRow);
}

/* ---------------- Produk (Supabase) ---------------- */

const PRODUCT_BUCKET = "produk";
const PRODUCT_COLUMNS =
  "id, nama, kategori, deskripsi, harga, stok, emoji, populer, foto_url, created_at";

export type ProductInput = Omit<Product, "id">;

type ProductRow = {
  id: string;
  nama: string;
  kategori: string;
  deskripsi: string;
  harga: number;
  stok: number;
  emoji: string;
  populer: boolean;
  foto_url: string | null;
  created_at: string;
};

let productList: Product[] = [];
let productStatus: ServiceStatus = { loading: false, error: null };

function setProductStatus(patch: Partial<ServiceStatus>) {
  productStatus = { ...productStatus, ...patch };
  notify();
}

export function useProducts() {
  return useSyncExternalStore(
    subscribe,
    () => productList,
    () => productList,
  );
}

export function useProductStatus() {
  return useSyncExternalStore(
    subscribe,
    () => productStatus,
    () => productStatus,
  );
}

export const getProductError = () => productStatus.error;

function fromProductRow(r: ProductRow): Product {
  return {
    id: r.id,
    name: r.nama,
    category: r.kategori,
    description: r.deskripsi,
    price: r.harga,
    stock: r.stok,
    emoji: r.emoji,
    popular: r.populer,
    image: r.foto_url ?? undefined,
  };
}

function toProductRow(input: ProductInput, fotoUrl: string | null) {
  return {
    nama: input.name,
    kategori: input.category,
    deskripsi: input.description,
    harga: input.price,
    stok: input.stock,
    emoji: input.emoji,
    populer: input.popular ?? false,
    foto_url: fotoUrl,
  };
}

export async function loadProducts(): Promise<void> {
  setProductStatus({ loading: true, error: null });
  const { data, error } = await supabase
    .from("produk")
    .select(PRODUCT_COLUMNS)
    .order("created_at", { ascending: true })
    .order("nama", { ascending: true });
  if (error) {
    setProductStatus({ loading: false, error: translateError(error) });
    return;
  }
  productList = (data as ProductRow[]).map(fromProductRow);
  setProductStatus({ loading: false });
}

export async function addProduct(
  input: ProductInput,
  photoUri?: string | null,
): Promise<boolean> {
  setProductStatus({ loading: true, error: null });
  let uploaded: string | null = null;
  try {
    uploaded = photoUri ? await uploadPhoto(PRODUCT_BUCKET, photoUri) : null;
    const { data, error } = await supabase
      .from("produk")
      .insert(toProductRow(input, uploaded ?? (input.image || null)))
      .select(PRODUCT_COLUMNS)
      .single();
    if (error) throw error;
    productList = [...productList, fromProductRow(data as ProductRow)];
    setProductStatus({ loading: false });
    return true;
  } catch (e) {
    if (uploaded) await removePhoto(PRODUCT_BUCKET, uploaded);
    setProductStatus({ loading: false, error: translateError(e) });
    return false;
  }
}

export async function updateProduct(
  id: string,
  input: ProductInput,
  photoUri?: string | null,
): Promise<boolean> {
  setProductStatus({ loading: true, error: null });
  const old = productList.find((p) => p.id === id);
  let uploaded: string | null = null;
  let oldPhotoToRemove: string | null = null;
  try {
    uploaded = photoUri ? await uploadPhoto(PRODUCT_BUCKET, photoUri) : null;
    const { data, error } = await supabase
      .from("produk")
      .update(toProductRow(input, uploaded ?? (input.image || null)))
      .eq("id", id)
      .select(PRODUCT_COLUMNS)
      .single();
    if (error) throw error;
    const saved = fromProductRow(data as ProductRow);
    productList = productList.map((p) => (p.id === id ? saved : p));
    setProductStatus({ loading: false });
    if (old?.image && old.image !== saved.image) oldPhotoToRemove = old.image;
  } catch (e) {
    if (uploaded) await removePhoto(PRODUCT_BUCKET, uploaded);
    setProductStatus({ loading: false, error: translateError(e) });
    return false;
  }
  // Di luar try: database sudah berhasil, gagal hapus file lama tidak membatalkannya.
  if (oldPhotoToRemove) await removePhoto(PRODUCT_BUCKET, oldPhotoToRemove);
  return true;
}

export async function deleteProduct(id: string): Promise<boolean> {
  setProductStatus({ loading: true, error: null });
  const old = productList.find((p) => p.id === id);
  const { error } = await supabase.from("produk").delete().eq("id", id);
  if (error) {
    setProductStatus({ loading: false, error: translateError(error) });
    return false;
  }
  productList = productList.filter((p) => p.id !== id);
  setProductStatus({ loading: false });
  if (old?.image) await removePhoto(PRODUCT_BUCKET, old.image);
  return true;
}
