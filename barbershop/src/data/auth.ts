import { useSyncExternalStore } from "react";
import { AppState, Platform } from "react-native";

import { supabase } from "@/lib/supabase";

export type Role = "user" | "admin";

export type LocalAccount = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type LocalUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
};

type AuthState = { user: LocalUser | null; ready: boolean };

let state: AuthState = { user: null, ready: false };
let registrationNotice = false;
let started = false;

/* ---------------- Langganan (pub/sub) ---------------- */

const listeners = new Set<() => void>();

function setState(patch: Partial<AuthState>) {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useCurrentUser(): LocalUser | null {
  return useSyncExternalStore(
    subscribe,
    () => state.user,
    () => state.user,
  );
}

/** false selama sesi login tersimpan masih diperiksa (saat app baru dibuka). */
export function useAuthReady(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => state.ready,
    () => state.ready,
  );
}

export function getCurrentUser(): LocalUser | null {
  return state.user;
}

/* ---------------- Pesan error ---------------- */

function translateAuthError(e: unknown): string {
  console.warn("[auth] error:", e);
  const message = (e as { message?: string })?.message ?? "";
  if (message.includes("Invalid login credentials")) {
    return "Email atau kata sandi belum cocok. Jika belum punya akun, silakan daftar dulu.";
  }
  if (message.includes("Email not confirmed")) {
    return "Email belum dikonfirmasi. Cek email Anda, atau matikan 'Confirm email' di Supabase (Authentication > Providers > Email).";
  }
  if (message.includes("already registered")) {
    return "Email ini sudah terdaftar.";
  }
  if (message.includes("rate limit")) {
    return "Terlalu banyak percobaan. Tunggu beberapa menit lalu coba lagi.";
  }
  if (
    message.includes("Failed to fetch") ||
    message.includes("Network request failed")
  ) {
    return "Tidak bisa terhubung ke Supabase. Periksa koneksi internet dan .env.";
  }
  return message || "Terjadi kesalahan tak terduga.";
}

/* ---------------- Profil ---------------- */

type ProfileRow = {
  id: string;
  nama: string;
  email: string;
  telepon: string;
  role: Role;
};

async function fetchProfile(
  id: string,
  fallbackEmail: string,
): Promise<LocalUser> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, nama, email, telepon, role")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  const row = data as ProfileRow | null;
  // Baris profil belum ada (mis. akun dibuat sebelum trigger dipasang):
  // tetap anggap pengguna biasa supaya app tidak macet.
  return {
    id,
    name: row?.nama ?? "",
    email: row?.email || fallbackEmail,
    phone: row?.telepon ?? "",
    role: row?.role ?? "user",
  };
}

/* ---------------- Sesi ---------------- */

/** Panggil sekali saat app dibuka: memulihkan sesi login yang tersimpan. */
export async function initAuth(): Promise<void> {
  if (started) return;
  started = true;

  supabase.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_OUT") setState({ user: null });
  });

  // Di perangkat, token hanya diperbarui saat app sedang aktif.
  if (Platform.OS !== "web") {
    AppState.addEventListener("change", (status) => {
      if (status === "active") supabase.auth.startAutoRefresh();
      else supabase.auth.stopAutoRefresh();
    });
  }

  try {
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    if (session) {
      const user = await fetchProfile(session.user.id, session.user.email ?? "");
      setState({ user, ready: true });
      return;
    }
  } catch (e) {
    console.warn("[auth] gagal memulihkan sesi:", e);
  }
  setState({ user: null, ready: true });
}

/** Mengembalikan pesan error, atau null bila berhasil. */
export async function registerAccount(
  account: LocalAccount,
): Promise<string | null> {
  const { data, error } = await supabase.auth.signUp({
    email: account.email.trim().toLowerCase(),
    password: account.password,
    options: { data: { nama: account.name, telepon: account.phone } },
  });
  if (error) return translateAuthError(error);

  // Bila "Confirm email" menyala, email yang sudah terdaftar tidak memberi error
  // melainkan user tanpa identitas.
  if (data.user && data.user.identities?.length === 0) {
    return "Email ini sudah terdaftar.";
  }

  // Alur aplikasi: setelah daftar, pengguna diarahkan ke halaman Masuk.
  if (data.session) await supabase.auth.signOut();
  registrationNotice = true;
  return null;
}

export function consumeRegistrationNotice(): boolean {
  const didRegister = registrationNotice;
  registrationNotice = false;
  return didRegister;
}

export async function signIn(
  email: string,
  password: string,
): Promise<{ user: LocalUser | null; error: string | null }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) return { user: null, error: translateAuthError(error) };
    const user = await fetchProfile(data.user.id, data.user.email ?? "");
    setState({ user, ready: true });
    return { user, error: null };
  } catch (e) {
    return { user: null, error: translateAuthError(e) };
  }
}

export async function signOut(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch (e) {
    console.warn("[auth] signOut gagal:", e);
  }
  setState({ user: null });
}

/** Menyimpan perubahan profil ke tabel profiles. Mengembalikan pesan error atau null. */
export async function updateCurrentUser(
  patch: Partial<Pick<LocalUser, "name" | "phone">>,
): Promise<string | null> {
  const current = state.user;
  if (!current) return "Silakan masuk terlebih dahulu.";

  const next = { ...current, ...patch };
  const { data, error } = await supabase
    .from("profiles")
    .update({ nama: next.name, telepon: next.phone })
    .eq("id", current.id)
    .select("id");
  if (error) return translateAuthError(error);
  // RLS yang menolak update tidak memberi error, hanya 0 baris berubah
  if (!data || data.length === 0) {
    return "Profil tidak ditemukan di database. Jalankan SQL Bagian A (trigger profiles).";
  }

  setState({ user: next });
  return null;
}
