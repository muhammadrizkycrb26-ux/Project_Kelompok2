// Pengambil deret penjualan harian dari Supabase (Corte Barbershop).
//
// Dua jenis permintaan:
//  - "produk"  : jumlah unit produk terjual per hari
//                (tabel pesanan + item_pesanan, tanggal = pesanan.created_at,
//                 pesanan berstatus "Batal" dibuang)
//  - "layanan" : jumlah booking per hari
//                (tabel booking, tanggal = booking.tanggal, status "Batal" dibuang)
//
// Hari tanpa transaksi diisi 0. Deret selalu menaik dan berakhir HARI INI.
// Hanya admin yang bisa membaca semua baris (RLS) — layar ini hanya untuk admin.
import { supabase } from "@/lib/supabase";

export type JenisPermintaan = "produk" | "layanan";

export interface BarisTransaksi {
  tgl: string; // YYYY-MM-DD (waktu lokal perangkat)
  nama: string;
  qty: number;
}

/* ---------------- Fungsi murni (mudah diuji) ---------------- */

export function keSlug(nama: string): string {
  return nama
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function kunciTanggal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const t = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${t}`;
}

/** Kolom `date` ("2026-11-02") dipakai apa adanya; timestamp diubah ke tanggal lokal. */
export function tanggalKeKunci(v: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  return kunciTanggal(new Date(v));
}

/** `hari` tanggal terakhir (menaik), berakhir pada `sekarang`. */
export function daftarTanggal(hari: number, sekarang: Date = new Date()): string[] {
  const out: string[] = [];
  for (let i = hari - 1; i >= 0; i--) {
    out.push(kunciTanggal(new Date(sekarang.getFullYear(), sekarang.getMonth(), sekarang.getDate() - i)));
  }
  return out;
}

/** Susun deret harian satu item dari baris transaksi. */
export function susunSeri(baris: BarisTransaksi[], nama: string, tanggal: string[]): { tanggal: string; qty: number }[] {
  const target = nama.trim().toLowerCase();
  const per: Record<string, number> = Object.fromEntries(tanggal.map((t) => [t, 0]));
  for (const b of baris) {
    if (b.nama.trim().toLowerCase() !== target) continue;
    if (b.tgl in per) per[b.tgl] += b.qty;
  }
  return tanggal.map((t) => ({ tanggal: t, qty: per[t] }));
}

export function hitungHariTransaksi(baris: BarisTransaksi[], tanggal: string[]): number {
  const valid = new Set(tanggal);
  return new Set(baris.filter((b) => valid.has(b.tgl)).map((b) => b.tgl)).size;
}

/* ---------------- Akses Supabase ---------------- */

const HALAMAN = 1000; // batas baris default PostgREST

async function ambilSemua<T>(buat: (dari: number, sampai: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>): Promise<T[]> {
  const hasil: T[] = [];
  for (let dari = 0; ; dari += HALAMAN) {
    const { data, error } = await buat(dari, dari + HALAMAN - 1);
    if (error) throw new Error(error.message);
    hasil.push(...(data ?? []));
    if (!data || data.length < HALAMAN) break;
  }
  return hasil;
}

async function ambilProduk(tanggal: string[]): Promise<BarisTransaksi[]> {
  // margin 1 hari terhadap zona waktu; disaring ulang lewat daftar tanggal lokal
  const dari = new Date(new Date(tanggal[0] + "T00:00:00").getTime() - 24 * 3600 * 1000).toISOString();
  type Row = { created_at: string; item_pesanan: { nama: string; jumlah: number }[] };
  const rows = await ambilSemua<Row>((a, b) =>
    supabase
      .from("pesanan")
      .select("created_at, item_pesanan(nama, jumlah)")
      .neq("status", "Batal")
      .gte("created_at", dari)
      .order("created_at", { ascending: true })
      .range(a, b) as unknown as PromiseLike<{ data: Row[] | null; error: { message: string } | null }>,
  );
  const valid = new Set(tanggal);
  const out: BarisTransaksi[] = [];
  for (const r of rows) {
    const tgl = tanggalKeKunci(r.created_at);
    if (!valid.has(tgl)) continue;
    for (const it of r.item_pesanan ?? []) out.push({ tgl, nama: it.nama, qty: Number(it.jumlah) || 0 });
  }
  return out;
}

async function ambilLayanan(tanggal: string[]): Promise<BarisTransaksi[]> {
  type Row = { tanggal: string; layanan_nama: string };
  const rows = await ambilSemua<Row>((a, b) =>
    supabase
      .from("booking")
      .select("tanggal, layanan_nama")
      .neq("status", "Batal")
      .gte("tanggal", tanggal[0])
      .lte("tanggal", tanggal[tanggal.length - 1])
      .order("tanggal", { ascending: true })
      .range(a, b) as unknown as PromiseLike<{ data: Row[] | null; error: { message: string } | null }>,
  );
  return rows.map((r) => ({ tgl: tanggalKeKunci(r.tanggal), nama: r.layanan_nama, qty: 1 }));
}

// Cache singkat supaya ganti chip tidak mengulang query; "Hitung ulang" memaksa muat ulang.
const TTL_MS = 30_000;
const cache = new Map<string, { waktu: number; baris: BarisTransaksi[] }>();

async function muatTransaksi(jenis: JenisPermintaan, hari: number, paksa: boolean): Promise<{ baris: BarisTransaksi[]; tanggal: string[] }> {
  const tanggal = daftarTanggal(hari);
  const kunci = `${jenis}:${hari}:${tanggal[tanggal.length - 1]}`;
  const ada = cache.get(kunci);
  if (!paksa && ada && Date.now() - ada.waktu < TTL_MS) return { baris: ada.baris, tanggal };
  const baris = jenis === "produk" ? await ambilProduk(tanggal) : await ambilLayanan(tanggal);
  cache.set(kunci, { waktu: Date.now(), baris });
  return { baris, tanggal };
}

/** Jumlah tanggal berbeda yang punya transaksi (gerbang fallback). */
export async function getJumlahHariTransaksi(jenis: JenisPermintaan, hari: number, paksa = false): Promise<number> {
  const { baris, tanggal } = await muatTransaksi(jenis, hari, paksa);
  return hitungHariTransaksi(baris, tanggal);
}

/** Deret harian `hari` hari (menaik) untuk satu produk/layanan; hari kosong = 0. */
export async function getSeriHarian(jenis: JenisPermintaan, nama: string, hari: number, paksa = false) {
  const { baris, tanggal } = await muatTransaksi(jenis, hari, paksa);
  return susunSeri(baris, nama, tanggal);
}

/** Daftar nama produk / layanan dari tabel katalog. */
export async function getDaftarItem(jenis: JenisPermintaan): Promise<string[]> {
  const { data, error } = await supabase
    .from(jenis === "produk" ? "produk" : "layanan")
    .select("nama")
    .order("nama", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((r: { nama: string }) => r.nama);
}
