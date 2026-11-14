// lib/supabase.ts
import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const rawUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
if (!rawUrl || !anonKey) {
  throw new Error(
    "EXPO_PUBLIC_SUPABASE_URL dan " +
      "EXPO_PUBLIC_SUPABASE_ANON_KEY wajib diisi di .env",
  );
}
// Hanya origin (https://xxxx.supabase.co) supaya path tambahan tidak merusak endpoint
const url = new URL(rawUrl.trim()).origin;

// Render statis web berjalan di Node (tanpa `window`): jangan sentuh storage di sana
const isServer = typeof window === "undefined";

/**
 * Penyimpanan sesi.
 * - HP (Android/iOS): SecureStore = Keychain/Keystore. Token sesi TIDAK disimpan
 *   di AsyncStorage yang tidak terenkripsi (materi Pertemuan 10, slide 11).
 * - Web: SecureStore tidak tersedia, pakai localStorage bawaan browser.
 *
 * SecureStore membatasi ukuran satu nilai (~2 KB), sedangkan sesi Supabase
 * (JSON berisi access + refresh token) sering lebih besar. Karena itu nilainya
 * dipecah menjadi potongan kecil: key.0, key.1, ... dan key.n (jumlah potongan).
 */
const CHUNK_SIZE = 1500;

const secureStoreAdapter = {
  async getItem(key: string): Promise<string | null> {
    const count = await SecureStore.getItemAsync(`${key}.n`);
    if (count === null) return null;
    let value = "";
    for (let i = 0; i < Number(count); i++) {
      const part = await SecureStore.getItemAsync(`${key}.${i}`);
      if (part === null) return null; // data rusak -> anggap tidak ada sesi
      value += part;
    }
    return value;
  },
  async setItem(key: string, value: string): Promise<void> {
    await secureStoreAdapter.removeItem(key);
    const count = Math.max(1, Math.ceil(value.length / CHUNK_SIZE));
    for (let i = 0; i < count; i++) {
      await SecureStore.setItemAsync(
        `${key}.${i}`,
        value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE),
      );
    }
    await SecureStore.setItemAsync(`${key}.n`, String(count));
  },
  async removeItem(key: string): Promise<void> {
    const count = await SecureStore.getItemAsync(`${key}.n`);
    if (count !== null) {
      for (let i = 0; i < Number(count); i++) {
        await SecureStore.deleteItemAsync(`${key}.${i}`);
      }
    }
    await SecureStore.deleteItemAsync(`${key}.n`);
  },
};

const storage = isServer
  ? undefined
  : Platform.OS === "web"
    ? undefined // supabase-js otomatis memakai localStorage di browser
    : secureStoreAdapter;

export const supabase = createClient(url, anonKey.trim(), {
  auth: {
    ...(storage ? { storage } : {}),
    autoRefreshToken: !isServer,
    persistSession: !isServer,
    detectSessionInUrl: false,
    // PKCE: Supabase mengembalikan authorization code (?code=), bukan token di URL
    flowType: "pkce",
  },
});
