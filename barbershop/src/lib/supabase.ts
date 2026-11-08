// lib/supabase.ts
import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    "EXPO_PUBLIC_SUPABASE_URL dan " +
      "EXPO_PUBLIC_SUPABASE_ANON_KEY wajib diisi di .env",
  );
}

// Saat static rendering di Node (web), tidak ada `window`, jadi AsyncStorage
// tidak boleh disentuh. Di perangkat/browser nilainya tetap seperti biasa.
const isServer = typeof window === "undefined";

export const supabase = createClient(url, anonKey, {
  auth: {
    ...(isServer ? {} : { storage: AsyncStorage }),
    autoRefreshToken: !isServer,
    persistSession: !isServer,
    detectSessionInUrl: false,
  },
});