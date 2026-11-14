import { Link, router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { requestPasswordReset } from "@/data/auth";

const C = { bg: "#F7F4EF", ink: "#242321", muted: "#8C8781", orange: "#C9824A", white: "#FFFFFF", border: "#EAE4DC", danger: "#B42318", green: "#287A52" };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const valid = emailPattern.test(email.trim());
  const emailError = email.length > 0 && !valid ? "Masukkan alamat email yang valid." : "";

  async function submit() {
    if (loading || !valid) return;
    setLoading(true);
    setError("");
    const problem = await requestPasswordReset(email);
    setLoading(false);
    if (problem) {
      setError(problem);
      return;
    }
    setSent(true);
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.eyebrow}>CORTE BARBERSHOP</Text>
        <Text style={styles.title}>Lupa kata sandi?</Text>
        <Text style={styles.subtitle}>Masukkan email akun Anda. Kami kirim tautan untuk membuat kata sandi baru.</Text>

        {sent ? (
          // Pesan sama untuk email terdaftar maupun tidak (anti user enumeration)
          <Text style={styles.success}>Jika email tersebut terdaftar, tautan reset kata sandi sudah dikirim. Cek kotak masuk (dan folder spam), lalu buka tautannya di perangkat ini.</Text>
        ) : (
          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput style={[styles.input, emailError ? styles.inputError : null]} value={email} onChangeText={(v) => { setEmail(v); setError(""); }} placeholder="nama@email.com" placeholderTextColor="#A49D95" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} onSubmitEditing={submit} />
            {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
            {error ? <Text style={styles.formError}>{error}</Text> : null}
            <Pressable style={[styles.primaryButton, (!valid || loading) && styles.disabled]} onPress={submit} disabled={loading} accessibilityRole="button">
              {loading ? <ActivityIndicator color={C.white} /> : <Text style={styles.primaryText}>Kirim tautan reset</Text>}
            </Pressable>
          </View>
        )}

        <View style={styles.footer}>
          <Link href="/login" asChild><Pressable onPress={() => router.replace("/login")}><Text style={styles.link}>Kembali ke halaman masuk</Text></Pressable></Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  content: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 26, paddingVertical: 36, maxWidth: 560, width: "100%", alignSelf: "center" },
  eyebrow: { color: C.orange, fontSize: 11, fontWeight: "800", letterSpacing: 2 },
  title: { color: C.ink, fontSize: 30, lineHeight: 36, fontWeight: "800", marginTop: 10 },
  subtitle: { color: C.muted, fontSize: 15, lineHeight: 23, marginTop: 12 },
  form: { marginTop: 28 },
  label: { color: C.ink, fontSize: 13, fontWeight: "700", marginBottom: 8 },
  input: { minHeight: 52, borderWidth: 1, borderColor: C.border, borderRadius: 13, backgroundColor: C.white, paddingHorizontal: 15, fontSize: 15, color: C.ink },
  inputError: { borderColor: C.danger },
  error: { color: C.danger, fontSize: 12, marginTop: 6 },
  formError: { color: C.danger, backgroundColor: "#FCE8E6", padding: 12, borderRadius: 10, marginTop: 16, lineHeight: 19, fontSize: 13 },
  success: { color: C.green, backgroundColor: "#E7F4EC", padding: 14, borderRadius: 10, marginTop: 24, lineHeight: 20, fontSize: 13 },
  primaryButton: { minHeight: 53, backgroundColor: C.orange, borderRadius: 14, alignItems: "center", justifyContent: "center", marginTop: 22 },
  disabled: { opacity: 0.58 },
  primaryText: { color: C.white, fontSize: 15, fontWeight: "800" },
  footer: { alignItems: "center", marginTop: 28 },
  link: { color: C.orange, fontSize: 14, fontWeight: "800" },
});
