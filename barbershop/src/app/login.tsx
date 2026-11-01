import { router, Link } from "expo-router";
import { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { consumeRegistrationNotice, signInLocalAccount } from "@/data/auth";

const C = { bg: "#F7F4EF", ink: "#242321", muted: "#8C8781", orange: "#C9824A", white: "#FFFFFF", border: "#EAE4DC", danger: "#B42318", green: "#287A52" };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registeredNotice] = useState(() => consumeRegistrationNotice());
  const emailError = email.length === 0 && submitted ? "Email wajib diisi." : email.length > 0 && !emailPattern.test(email.trim()) ? "Masukkan alamat email yang valid." : "";
  const passwordError = password.length === 0 && submitted ? "Kata sandi wajib diisi." : password.length > 0 && password.length < 8 ? "Kata sandi minimal 8 karakter." : "";
  const emailTouched = submitted || email.length > 0;
  const passwordTouched = submitted || password.length > 0;
  const canSubmit = useMemo(() => emailPattern.test(email.trim()) && password.length >= 8, [email, password]);

  function handleLogin() {
    setSubmitted(true);
    setMessage("");
    if (!canSubmit) return;
    const account = signInLocalAccount(email, password);
    if (!account) {
      setMessage("Email atau kata sandi belum cocok. Jika belum punya akun, silakan daftar dulu.");
      return;
    }
    router.replace("/(tabs)");
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.brandMark}><Text style={styles.brandMarkText}>C</Text></View>
        <Text style={styles.eyebrow}>CORTE BARBERSHOP</Text>
        <Text style={styles.title}>Selamat datang{`\n`}kembali.</Text>
        <Text style={styles.subtitle}>Masuk untuk melanjutkan booking dan belanja kebutuhan grooming.</Text>

        {registeredNotice ? <Text style={styles.successMessage}>Registrasi berhasil. Silakan masuk dengan email dan kata sandi yang baru dibuat.</Text> : null}

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={[styles.input, emailTouched && emailError ? styles.inputError : null, emailTouched && !emailError && email ? styles.inputValid : null]} value={email} onChangeText={(value) => { setEmail(value); setMessage(""); }} placeholder="nama@email.com" placeholderTextColor="#A49D95" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} textContentType="emailAddress" accessibilityLabel="Email" />
          {emailTouched && emailError ? <Text style={styles.error}>{emailError}</Text> : emailTouched && email ? <Text style={styles.valid}>Format email sudah benar.</Text> : null}

          <View style={styles.labelRow}><Text style={styles.label}>Kata sandi</Text></View>
          <View style={[styles.passwordWrap, passwordTouched && passwordError ? styles.inputError : null, passwordTouched && !passwordError && password ? styles.inputValid : null]}>
            <TextInput style={styles.passwordInput} value={password} onChangeText={(value) => { setPassword(value); setMessage(""); }} placeholder="Masukkan kata sandi" placeholderTextColor="#A49D95" secureTextEntry={!showPassword} autoCapitalize="none" textContentType="password" accessibilityLabel="Kata sandi" onSubmitEditing={handleLogin} returnKeyType="go" />
            <Pressable onPress={() => setShowPassword((value) => !value)} accessibilityRole="button"><Text style={styles.showPassword}>{showPassword ? "Sembunyikan" : "Lihat"}</Text></Pressable>
          </View>
          {passwordTouched && passwordError ? <Text style={styles.error}>{passwordError}</Text> : passwordTouched && password ? <Text style={styles.valid}>Panjang kata sandi memenuhi syarat.</Text> : null}
          {message ? <Text style={styles.formError}>{message}</Text> : null}

          <Pressable style={[styles.primaryButton, !canSubmit && styles.disabledButton]} onPress={handleLogin} accessibilityRole="button"><Text style={styles.primaryText}>Masuk</Text></Pressable>
        </View>

        <View style={styles.footer}><Text style={styles.footerText}>Belum punya akun? </Text><Link href="/register" asChild><Pressable><Text style={styles.link}>Daftar sekarang</Text></Pressable></Link></View>
        <Text style={styles.note}>Akun demo tersimpan sementara selama aplikasi terbuka.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg }, content: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 26, paddingVertical: 36, maxWidth: 560, width: "100%", alignSelf: "center" },
  brandMark: { width: 52, height: 52, borderRadius: 16, backgroundColor: C.ink, alignItems: "center", justifyContent: "center", marginBottom: 22 }, brandMarkText: { color: C.white, fontSize: 28, fontWeight: "800" },
  eyebrow: { color: C.orange, fontSize: 11, fontWeight: "800", letterSpacing: 2 }, title: { color: C.ink, fontSize: 34, lineHeight: 40, fontWeight: "800", marginTop: 10 }, subtitle: { color: C.muted, fontSize: 15, lineHeight: 23, marginTop: 12, maxWidth: 410 },
  form: { marginTop: 32 }, label: { color: C.ink, fontSize: 13, fontWeight: "700", marginBottom: 8 }, labelRow: { marginTop: 19 }, input: { minHeight: 52, borderWidth: 1, borderColor: C.border, borderRadius: 13, backgroundColor: C.white, paddingHorizontal: 15, fontSize: 15, color: C.ink }, passwordWrap: { minHeight: 52, borderWidth: 1, borderColor: C.border, borderRadius: 13, backgroundColor: C.white, paddingLeft: 15, paddingRight: 13, flexDirection: "row", alignItems: "center" }, passwordInput: { flex: 1, height: 50, fontSize: 15, color: C.ink }, inputError: { borderColor: C.danger }, inputValid: { borderColor: C.green }, error: { color: C.danger, fontSize: 12, marginTop: 6 }, valid: { color: C.green, fontSize: 12, marginTop: 6 }, showPassword: { color: C.orange, fontWeight: "700", fontSize: 12 }, formError: { color: C.danger, backgroundColor: "#FCE8E6", padding: 12, borderRadius: 10, marginTop: 16, lineHeight: 19, fontSize: 13 },
  successMessage: { color: C.green, backgroundColor: "#E7F4EC", padding: 12, borderRadius: 10, marginTop: 18, lineHeight: 19, fontSize: 13 }, primaryButton: { minHeight: 53, backgroundColor: C.orange, borderRadius: 14, alignItems: "center", justifyContent: "center", marginTop: 24 }, disabledButton: { opacity: 0.58 }, primaryText: { color: C.white, fontSize: 15, fontWeight: "800" }, footer: { flexDirection: "row", justifyContent: "center", marginTop: 26 }, footerText: { color: C.muted, fontSize: 14 }, link: { color: C.orange, fontSize: 14, fontWeight: "800" }, note: { textAlign: "center", color: C.muted, fontSize: 11, marginTop: 28 },
});
