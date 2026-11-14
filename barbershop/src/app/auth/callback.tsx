import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import {
  consumeRecovery,
  exchangeSessionFromUrl,
  syncUserFromSession,
} from "@/data/auth";

// Rute ini menerima kembalinya pengguna dari:
//  - login Google di WEB (halaman diarahkan balik ke /auth/callback?code=...)
//  - tautan "lupa kata sandi" di email (web maupun HP)
// Login Google di HP diselesaikan langsung oleh signInWithGoogle(), tanpa rute ini.
export default function AuthCallback() {
  const params = useLocalSearchParams<{
    code?: string;
    error?: string;
    error_description?: string;
  }>();
  const [error, setError] = useState("");
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return; // cegah proses ganda (kode hanya sekali pakai)
    handled.current = true;

    async function run() {
      if (params.error || params.error_description) {
        setError(String(params.error_description ?? params.error));
        return;
      }
      if (!params.code) {
        // Tidak ada kode: mungkin sesi sudah terbentuk, lanjut saja
        const user = await syncUserFromSession();
        router.replace(user ? "/" : "/login");
        return;
      }
      const url = `https://callback.local/?code=${encodeURIComponent(String(params.code))}`;
      const exchangeError = await exchangeSessionFromUrl(url);
      if (exchangeError) {
        setError(exchangeError);
        return;
      }
      if (consumeRecovery()) {
        router.replace("/reset-password");
        return;
      }
      const user = await syncUserFromSession();
      if (!user) {
        setError("Gagal memuat profil. Coba masuk lagi.");
        return;
      }
      router.replace(user.role === "admin" ? "/admin" : "/(tabs)");
    }

    void run();
  }, [params.code, params.error, params.error_description]);

  return (
    <View style={styles.root}>
      {error ? (
        <>
          <Text style={styles.title}>Login belum berhasil</Text>
          <Text style={styles.message}>{error}</Text>
          <Pressable style={styles.button} onPress={() => router.replace("/login")}>
            <Text style={styles.buttonText}>Kembali ke halaman masuk</Text>
          </Pressable>
        </>
      ) : (
        <>
          <ActivityIndicator color="#C9824A" />
          <Text style={styles.message}>Memproses login...</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F7F4EF", alignItems: "center", justifyContent: "center", padding: 28 },
  title: { color: "#242321", fontSize: 20, fontWeight: "800" },
  message: { color: "#8C8781", fontSize: 14, marginTop: 12, textAlign: "center", lineHeight: 21 },
  button: { backgroundColor: "#C9824A", borderRadius: 14, paddingVertical: 14, paddingHorizontal: 22, marginTop: 24 },
  buttonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 14 },
});
