import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { signOut, updatePassword } from "@/data/auth";

const C = { bg: "#F7F4EF", ink: "#242321", muted: "#8C8781", orange: "#C9824A", white: "#FFFFFF", border: "#EAE4DC", danger: "#B42318", green: "#287A52" };
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

// Dibuka setelah pengguna menekan tautan reset di email (lihat auth/callback.tsx).
export default function ResetPasswordScreen() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const passwordError = password.length > 0 && !passwordPattern.test(password) ? "Gunakan minimal 8 karakter, huruf besar, huruf kecil, dan angka." : "";
  const confirmError = confirmation.length > 0 && confirmation !== password ? "Konfirmasi kata sandi belum sama." : "";
  const canSubmit = passwordPattern.test(password) && confirmation === password;

  async function submit() {
    if (loading || !canSubmit) return;
    setLoading(true);
    setError("");
    const problem = await updatePassword(password);
    if (problem) {
      setLoading(false);
      setError(problem);
      return;
    }
    // Keluar dulu supaya pengguna masuk ulang dengan kata sandi baru
    await signOut();
    setLoading(false);
    setDone(true);
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.eyebrow}>CORTE BARBERSHOP</Text>
        <Text style={styles.title}>Buat kata sandi baru</Text>

        {done ? (
          <>
            <Text style={styles.success}>Kata sandi berhasil diganti. Silakan masuk dengan kata sandi baru.</Text>
            <Pressable style={styles.primaryButton} onPress={() => router.replace("/login")}><Text style={styles.primaryText}>Ke halaman masuk</Text></Pressable>
          </>
        ) : (
          <View style={styles.form}>
            <Text style={styles.label}>Kata sandi baru</Text>
            <View style={[styles.wrap, passwordError ? styles.inputError : null]}>
              <TextInput style={styles.input} value={password} onChangeText={(v) => { setPassword(v); setError(""); }} placeholder="Minimal 8 karakter" placeholderTextColor="#A49D95" secureTextEntry={!show} autoCapitalize="none" />
              <Pressable onPress={() => setShow((v) => !v)}><Text style={styles.toggle}>{show ? "Sembunyikan" : "Lihat"}</Text></Pressable>
            </View>
            {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

            <Text style={[styles.label, { marginTop: 18 }]}>Ulangi kata sandi baru</Text>
            <View style={[styles.wrap, confirmError ? styles.inputError : null]}>
              <TextInput style={styles.input} value={confirmation} onChangeText={(v) => { setConfirmation(v); setError(""); }} placeholder="Ketik ulang" placeholderTextColor="#A49D95" secureTextEntry={!show} autoCapitalize="none" onSubmitEditing={submit} />
            </View>
            {confirmError ? <Text style={styles.error}>{confirmError}</Text> : null}

            {error ? <Text style={styles.formError}>{error}</Text> : null}
            <Pressable style={[styles.primaryButton, (!canSubmit || loading) && styles.disabled]} onPress={submit} disabled={loading} accessibilityRole="button">
              {loading ? <ActivityIndicator color={C.white} /> : <Text style={styles.primaryText}>Simpan kata sandi</Text>}
            </Pressable>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  content: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 26, paddingVertical: 36, maxWidth: 560, width: "100%", alignSelf: "center" },
  eyebrow: { color: C.orange, fontSize: 11, fontWeight: "800", letterSpacing: 2 },
  title: { color: C.ink, fontSize: 30, lineHeight: 36, fontWeight: "800", marginTop: 10 },
  form: { marginTop: 28 },
  label: { color: C.ink, fontSize: 13, fontWeight: "700", marginBottom: 8 },
  wrap: { minHeight: 52, borderWidth: 1, borderColor: C.border, borderRadius: 13, backgroundColor: C.white, paddingLeft: 15, paddingRight: 13, flexDirection: "row", alignItems: "center" },
  input: { flex: 1, height: 50, fontSize: 15, color: C.ink },
  inputError: { borderColor: C.danger },
  toggle: { color: C.orange, fontWeight: "700", fontSize: 12 },
  error: { color: C.danger, fontSize: 12, marginTop: 6 },
  formError: { color: C.danger, backgroundColor: "#FCE8E6", padding: 12, borderRadius: 10, marginTop: 16, lineHeight: 19, fontSize: 13 },
  success: { color: C.green, backgroundColor: "#E7F4EC", padding: 14, borderRadius: 10, marginTop: 24, lineHeight: 20, fontSize: 13 },
  primaryButton: { minHeight: 53, backgroundColor: C.orange, borderRadius: 14, alignItems: "center", justifyContent: "center", marginTop: 24 },
  disabled: { opacity: 0.58 },
  primaryText: { color: C.white, fontSize: 15, fontWeight: "800" },
});
