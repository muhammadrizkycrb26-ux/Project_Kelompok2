import { useSyncExternalStore } from "react";

import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "./auth";
import { loadProducts } from "./catalog-store";

export type OrderStatus =
  | "Menunggu Proses"
  | "Sedang Dikirim"
  | "Selesai"
  | "Batal";

export type BookingOrder = {
  id: string; // kode booking, mis. BK-1A2B3C4D
  type: "booking";
  customerName: string;
  serviceName: string;
  date: string; // tanggal panjang untuk ditampilkan
  dateKey: string; // YYYY-MM-DD
  time: string; // "09.30"
  durationMinutes: number;
  price: number;
  status: OrderStatus;
  createdAt: string;
};

export type PaymentMethod = "Transfer Bank" | "E-Wallet" | "Debit";

export type ProductOrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type ProductOrder = {
  id: string; // kode pesanan, mis. PR-1A2B3C4D
  type: "product";
  items: ProductOrderItem[];
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
};

export type Order = BookingOrder | ProductOrder;

export type NewBooking = {
  customerName: string;
  serviceName: string;
  dateKey: string;
  time: string;
  durationMinutes: number;
  price: number;
};

/* ---------------- Langganan (pub/sub) ---------------- */

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/* ---------------- State ---------------- */

type Slot = { dateKey: string; start: number; end: number };
type Status = { loading: boolean; error: string | null };

let orders: Order[] = [];
let bookedSlots: Slot[] = [];
let status: Status = { loading: false, error: null };

function setStatus(patch: Partial<Status>) {
  status = { ...status, ...patch };
  notify();
}

export function useOrders() {
  return useSyncExternalStore(
    subscribe,
    () => orders,
    () => orders,
  );
}

/** Slot jam yang sudah terisi (semua pelanggan). Dipakai halaman Booking. */
export function useBookedSlots() {
  return useSyncExternalStore(
    subscribe,
    () => bookedSlots,
    () => bookedSlots,
  );
}

export function useOrderStatus() {
  return useSyncExternalStore(
    subscribe,
    () => status,
    () => status,
  );
}

export const getOrderError = () => status.error;

/* ---------------- Pemetaan baris database <-> tipe Order ---------------- */

type BookingRow = {
  kode: string;
  nama_pelanggan: string;
  layanan_nama: string;
  tanggal: string;
  jam_mulai: number;
  durasi: number;
  harga: number;
  status: OrderStatus;
  created_at: string;
};

type PesananRow = {
  kode: string;
  metode_bayar: PaymentMethod;
  total: number;
  status: OrderStatus;
  created_at: string;
  item_pesanan: {
    produk_id: string | null;
    nama: string;
    harga: number;
    jumlah: number;
  }[];
};

const BOOKING_COLUMNS =
  "kode, nama_pelanggan, layanan_nama, tanggal, jam_mulai, durasi, harga, status, created_at";
const PESANAN_COLUMNS =
  "kode, metode_bayar, total, status, created_at, item_pesanan(produk_id, nama, harga, jumlah)";

function formatLongDate(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function minutesToTime(minutes: number): string {
  const hour = String(Math.floor(minutes / 60)).padStart(2, "0");
  const minute = String(minutes % 60).padStart(2, "0");
  return `${hour}.${minute}`;
}

function timeToMinutes(time: string) {
  const [hour, minute] = time.split(".").map(Number);
  return hour * 60 + minute;
}

function bookingFromRow(r: BookingRow): BookingOrder {
  return {
    id: r.kode,
    type: "booking",
    customerName: r.nama_pelanggan,
    serviceName: r.layanan_nama,
    date: formatLongDate(r.tanggal),
    dateKey: r.tanggal,
    time: minutesToTime(r.jam_mulai),
    durationMinutes: r.durasi,
    price: r.harga,
    status: r.status,
    createdAt: r.created_at,
  };
}

function productOrderFromRow(r: PesananRow): ProductOrder {
  return {
    id: r.kode,
    type: "product",
    items: r.item_pesanan.map((i) => ({
      productId: i.produk_id ?? "",
      name: i.nama,
      price: i.harga,
      quantity: i.jumlah,
    })),
    total: r.total,
    paymentMethod: r.metode_bayar,
    status: r.status,
    createdAt: r.created_at,
  };
}

function translateError(e: unknown): string {
  console.warn("[orders-store] error:", e);
  const err = e as { message?: string; code?: string };
  // 23P01 = exclusion violation: jam yang sama baru saja diambil orang lain
  if (err?.code === "23P01") {
    return "Jadwal itu baru saja diambil pelanggan lain. Silakan pilih jam lain.";
  }
  if (
    err?.message?.includes("Failed to fetch") ||
    err?.message?.includes("Network request failed")
  ) {
    return "Tidak bisa terhubung ke Supabase. Periksa koneksi internet.";
  }
  if (err?.message?.includes("row-level security")) {
    return "Akses ditolak. Pastikan Anda sudah masuk dan punya izin untuk aksi ini.";
  }
  return err?.message ?? "Terjadi kesalahan tak terduga.";
}

const byNewest = (a: Order, b: Order) =>
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

/* ---------------- Memuat data ---------------- */

async function loadSlots(): Promise<void> {
  const { data, error } = await supabase.rpc("booking_terisi");
  if (error) throw error;
  bookedSlots = (
    data as { tanggal: string; jam_mulai: number; durasi: number }[]
  ).map((r) => ({
    dateKey: r.tanggal,
    start: r.jam_mulai,
    end: r.jam_mulai + r.durasi,
  }));
}

/**
 * Memuat pesanan milik pengguna yang sedang login (admin: semua pesanan,
 * karena RLS yang menentukan) dan slot booking yang sudah terisi.
 */
export async function loadOrders(): Promise<void> {
  if (!getCurrentUser()) {
    clearOrders();
    return;
  }
  setStatus({ loading: true, error: null });
  try {
    const [bookings, pesanan] = await Promise.all([
      supabase
        .from("booking")
        .select(BOOKING_COLUMNS)
        .order("created_at", { ascending: false }),
      supabase
        .from("pesanan")
        .select(PESANAN_COLUMNS)
        .order("created_at", { ascending: false }),
      loadSlots(),
    ]);

    if (bookings.error) throw bookings.error;
    if (pesanan.error) throw pesanan.error;

    orders = [
      ...(bookings.data as BookingRow[]).map(bookingFromRow),
      ...(pesanan.data as unknown as PesananRow[]).map(productOrderFromRow),
    ].sort(byNewest);
    setStatus({ loading: false });
  } catch (e) {
    setStatus({ loading: false, error: translateError(e) });
  }
}

/** Dipanggil saat logout: kosongkan data supaya tidak bocor ke akun lain. */
export function clearOrders() {
  orders = [];
  bookedSlots = [];
  status = { loading: false, error: null };
  notify();
}

/* ---------------- Booking ---------------- */

export function isBookingSlotAvailable(
  dateKey: string,
  time: string,
  durationMinutes: number,
) {
  const start = timeToMinutes(time);
  const end = start + durationMinutes;
  return !bookedSlots.some(
    (slot) => slot.dateKey === dateKey && start < slot.end && slot.start < end,
  );
}

/** Mengembalikan booking yang tersimpan, atau null (alasannya di getOrderError()). */
export async function addBookingOrder(
  data: NewBooking,
): Promise<BookingOrder | null> {
  if (!getCurrentUser()) {
    setStatus({ error: "Silakan masuk terlebih dahulu untuk booking." });
    return null;
  }
  setStatus({ loading: true, error: null });
  const { data: row, error } = await supabase
    .from("booking")
    .insert({
      nama_pelanggan: data.customerName,
      layanan_nama: data.serviceName,
      tanggal: data.dateKey,
      jam_mulai: timeToMinutes(data.time),
      durasi: data.durationMinutes,
      harga: data.price,
    })
    .select(BOOKING_COLUMNS)
    .single();

  if (error) {
    setStatus({ loading: false, error: translateError(error) });
    // slot mungkin sudah berubah: segarkan supaya pilihan jam ikut diperbarui
    loadSlots()
      .then(notify)
      .catch(() => {});
    return null;
  }

  const order = bookingFromRow(row as BookingRow);
  orders = [order, ...orders];
  bookedSlots = [
    ...bookedSlots,
    {
      dateKey: order.dateKey,
      start: timeToMinutes(order.time),
      end: timeToMinutes(order.time) + order.durationMinutes,
    },
  ];
  setStatus({ loading: false });
  return order;
}

/* ---------------- Pesanan produk ---------------- */

export async function addProductOrder(
  items: ProductOrderItem[],
  paymentMethod: PaymentMethod,
): Promise<ProductOrder | null> {
  if (items.length === 0) return null;
  if (!getCurrentUser()) {
    setStatus({ error: "Silakan masuk terlebih dahulu untuk berbelanja." });
    return null;
  }
  setStatus({ loading: true, error: null });

  // Harga dan stok dihitung ulang di server (fungsi buat_pesanan).
  const { data, error } = await supabase.rpc("buat_pesanan", {
    p_items: items.map((i) => ({ produk_id: i.productId, jumlah: i.quantity })),
    p_metode: paymentMethod,
  });
  if (error) {
    setStatus({ loading: false, error: translateError(error) });
    void loadProducts(); // stok mungkin sudah berubah
    return null;
  }

  const kode = (data as { o_id: string; o_kode: string }[])[0]?.o_kode;
  const { data: row, error: readError } = await supabase
    .from("pesanan")
    .select(PESANAN_COLUMNS)
    .eq("kode", kode)
    .single();
  if (readError) {
    setStatus({ loading: false, error: translateError(readError) });
    return null;
  }

  const order = productOrderFromRow(row as unknown as PesananRow);
  orders = [order, ...orders];
  setStatus({ loading: false });
  void loadProducts(); // stok di halaman Shop ikut berkurang
  return order;
}

/* ---------------- Ubah status ---------------- */

function patchLocalStatus(id: string, next: OrderStatus) {
  orders = orders.map((order) =>
    order.id === id ? { ...order, status: next } : order,
  );
  if (next === "Batal") {
    const cancelled = orders.find((o) => o.id === id);
    if (cancelled?.type === "booking") {
      const start = timeToMinutes(cancelled.time);
      const end = start + cancelled.durationMinutes;
      bookedSlots = bookedSlots.filter(
        (s) =>
          !(
            s.dateKey === cancelled.dateKey &&
            s.start === start &&
            s.end === end
          ),
      );
    }
  }
  notify();
}

/** Pelanggan membatalkan pesanannya sendiri (hanya saat "Menunggu Proses"). */
export async function cancelOrder(id: string): Promise<boolean> {
  const order = orders.find((o) => o.id === id);
  if (!order) return false;
  setStatus({ error: null });
  const { error } = await supabase.rpc(
    order.type === "booking" ? "batalkan_booking" : "batalkan_pesanan",
    { p_kode: id },
  );
  if (error) {
    setStatus({ error: translateError(error) });
    return false;
  }
  patchLocalStatus(id, "Batal");
  if (order.type === "product") void loadProducts(); // stok dikembalikan
  return true;
}

/** Khusus admin (RLS menolak pengguna biasa). */
export async function updateOrderStatus(
  id: string,
  next: OrderStatus,
): Promise<boolean> {
  const order = orders.find((o) => o.id === id);
  if (!order) return false;
  setStatus({ error: null });
  const { data, error } = await supabase
    .from(order.type === "booking" ? "booking" : "pesanan")
    .update({ status: next })
    .eq("kode", id)
    .select("kode");
  if (error) {
    setStatus({ error: translateError(error) });
    return false;
  }
  // RLS yang menolak update tidak memberi error, hanya 0 baris berubah
  if (!data || data.length === 0) {
    setStatus({ error: "Status tidak berubah. Pastikan Anda masuk sebagai admin." });
    return false;
  }
  patchLocalStatus(id, next);
  if (next === "Batal" && order.type === "product") void loadProducts();
  return true;
}
