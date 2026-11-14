import { useSyncExternalStore } from "react";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
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

// Wajib untuk alur OAuth di Expo: menyelesaikan sesi browser saat kembali ke app
WebBrowser.maybeCompleteAuthSession();

let state: AuthState = { user: null, ready: false };
let recoveryPending = false; // true bila sesi berasal dari tautan "lupa password"
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
  // Satu pesan generik untuk semua kegagalan login (anti user enumeration):
  // tidak membedakan "email tidak terdaftar" dan "password salah".
  if (message.includes("Invalid login credentials")) {
    return "Email atau kata sandi salah.";
  }
  if (message.includes("Email not confirmed")) {
    return "Email belum dikonfirmasi. Cek kotak masuk email Anda.";
  }
  if (message.includes("already registered")) {
    return "Email ini sudah terdaftar. Gunakan email lain atau masuk.";
  }
  if (message.includes("rate limit") || message.includes("security purposes")) {
    return "Terlalu banyak percobaan. Tunggu beberapa menit lalu coba lagi.";
  }
  if (message.includes("provider is not enabled")) {
    return "Login Google belum diaktifkan di Supabase (Authentication > Providers > Google).";
  }
  if (message.includes("same password")) {
    return "Kata sandi baru harus berbeda dari yang lama.";
  }
  if (
    message.includes("Failed to fetch") ||
    message.includes("Network request failed")
  ) {
    return "Tidak bisa terhubung ke Supabase. Periksa koneksi internet dan .env.";
  }
  return "Terjadi kesalahan. Coba lagi.";
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
    // Dipicu saat pengguna membuka tautan reset password dari email
    if (event === "PASSWORD_RECOVERY") recoveryPending = true;
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

/* ---------------- Google OAuth (Authorization Code + PKCE) ---------------- */

/** Alamat tujuan kembali setelah login Google / membuka tautan email. */
export function getAuthRedirectUrl(): string {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    return `${window.location.origin}/auth/callback`;
  }
  // Mengikuti `scheme` di app.json. Di Expo Go berbentuk exp://..., di
  // development build berbentuk <scheme>://auth/callback
  return Linking.createURL("auth/callback");
}

/** Menukar authorization code dari URL dengan sesi Supabase (langkah PKCE). */
export async function exchangeSessionFromUrl(url: string): Promise<string | null> {
  const parsed = Linking.parse(url);
  const params = parsed.queryParams ?? {};
  const oauthError = params.error_description ?? params.error;
  if (oauthError) return String(oauthError);
  const code = params.code;
  if (!code || Array.isArray(code)) return "Kode login tidak ditemukan.";
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  return error ? translateAuthError(error) : null;
}

/** Membaca sesi yang sedang aktif -> mengisi state pengguna (dipakai setelah OAuth). */
export async function syncUserFromSession(): Promise<LocalUser | null> {
  try {
    const { data } = await supabase.auth.getSession();
    if (!data.session) return null;
    const user = await fetchProfile(
      data.session.user.id,
      data.session.user.email ?? "",
    );
    setState({ user, ready: true });
    return user;
  } catch (e) {
    console.warn("[auth] gagal membaca sesi:", e);
    return null;
  }
}

/**
 * Login dengan Google. Mengembalikan { user, error }.
 * - HP: membuka browser sistem, lalu kembali lewat redirect URL.
 * - Web: seluruh halaman diarahkan ke Google, lalu kembali ke /auth/callback
 *   (user bernilai null; sesi dipulihkan oleh halaman callback).
 */
export async function signInWithGoogle(): Promise<{
  user: LocalUser | null;
  error: string | null;
}> {
  try {
    const redirectTo = getAuthRedirectUrl();
    console.log("[auth] redirectTo =", redirectTo);

    if (Platform.OS === "web") {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      return { user: null, error: error ? translateAuthError(error) : null };
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo, skipBrowserRedirect: true },
    });
    if (error || !data.url) {
      return { user: null, error: translateAuthError(error) };
    }

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    if (result.type !== "success") {
      return { user: null, error: null }; // dibatalkan pengguna
    }
    const exchangeError = await exchangeSessionFromUrl(result.url);
    if (exchangeError) return { user: null, error: exchangeError };

    const user = await syncUserFromSession();
    if (!user) return { user: null, error: "Gagal memuat profil. Coba lagi." };
    return { user, error: null };
  } catch (e) {
    return { user: null, error: translateAuthError(e) };
  }
}

/* ---------------- Lupa & ganti password ---------------- */

/**
 * Mengirim tautan reset. Sengaja SELALU berhasil dari sisi tampilan, agar tidak
 * membocorkan apakah sebuah email terdaftar (materi slide 15). Hanya masalah
 * jaringan / batas percobaan yang dilaporkan.
 */
export async function requestPasswordReset(email: string): Promise<string | null> {
  const { error } = await supabase.auth.resetPasswordForEmail(
    email.trim().toLowerCase(),
    { redirectTo: getAuthRedirectUrl() },
  );
  if (error) {
    const msg = translateAuthError(error);
    const reportable =
      msg.includes("Terlalu banyak") || msg.includes("terhubung");
    if (reportable) return msg;
  }
  return null;
}

/** true sekali saja bila sesi saat ini berasal dari tautan reset password. */
export function consumeRecovery(): boolean {
  const pending = recoveryPending;
  recoveryPending = false;
  return pending;
}

export async function updatePassword(newPassword: string): Promise<string | null> {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  return error ? translateAuthError(error) : null;
}
