import { useSyncExternalStore } from "react";

export type LocalAccount = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type LocalUser = Pick<LocalAccount, "name" | "email" | "phone">;

// Prototype only: accounts live in memory and are cleared when the app restarts.
// Akun demo selalu tersedia walau app di-reload.
const accounts = new Map<string, LocalAccount>([
  [
    "demo@corte.com",
    {
      name: "Demo User",
      email: "demo@corte.com",
      phone: "081234567890",
      password: "Demo12345",
    },
  ],
]);
let currentUser: LocalUser | null = null;
let registrationNotice = false;

// Listener supaya komponen (misal avatar di Home) ikut update saat user berubah
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useCurrentUser(): LocalUser | null {
  return useSyncExternalStore(
    subscribe,
    () => currentUser,
    () => currentUser,
  );
}

export function registerLocalAccount(account: LocalAccount): string | null {
  const email = account.email.trim().toLowerCase();
  if (accounts.has(email)) return "Email ini sudah terdaftar.";
  accounts.set(email, { ...account, email });
  registrationNotice = true;
  return null;
}

export function consumeRegistrationNotice(): boolean {
  const didRegister = registrationNotice;
  registrationNotice = false;
  return didRegister;
}

export function signInLocalAccount(email: string, password: string): LocalAccount | null {
  const account = accounts.get(email.trim().toLowerCase());
  if (!account || account.password !== password) return null;

  currentUser = { name: account.name, email: account.email, phone: account.phone };
  notify();
  return account;
}

export function getCurrentUser(): LocalUser | null {
  return currentUser;
}

// Dipanggil saat profil diedit: update user aktif + data akunnya
export function updateCurrentUser(patch: Partial<Pick<LocalUser, "name" | "phone">>) {
  if (!currentUser) return;

  currentUser = { ...currentUser, ...patch };

  const account = accounts.get(currentUser.email);
  if (account) accounts.set(currentUser.email, { ...account, ...patch });

  notify();
}

export function signOutLocalAccount() {
  currentUser = null;
  notify();
}

// Prototype only: kredensial admin hardcoded. Ganti dengan backend/auth asli nanti.
const ADMIN_EMAIL = "admin@corte.com";
const ADMIN_PASSWORD = "admin12345";

export function signInAdmin(email: string, password: string): boolean {
  if (email.trim().toLowerCase() !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) return false;
  currentUser = { name: "Admin Corte", email: ADMIN_EMAIL, phone: "-" };
  notify();
  return true;
}