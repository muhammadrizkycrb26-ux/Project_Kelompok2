import { Link, router } from "expo-router";
import { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { registerLocalAccount } from "@/data/auth";

const C = { bg: "#F7F4EF", ink: "#242321", muted: "#8C8781", orange: "#C9824A", white: "#FFFFFF", border: "#EAE4DC", danger: "#B42318", green: "#287A52" };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[0-9][0-9\s-]{8,17}$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formError, setFormError] = useState("");

  const errors = {
    name: name.length === 0 && submitted ? "Nama wajib diisi." : name.length > 0 && name.trim().length < 3 ? "Nama minimal 3 karakter." : "",
    email: email.length === 0 && submitted ? "Email wajib diisi." : email.length > 0 && !emailPattern.test(email.trim()) ? "Masukkan alamat email yang valid." : "",
    phone: phone.length === 0 && submitted ? "Nomor HP wajib diisi." : phone.length > 0 && !phonePattern.test(phone.trim()) ? "Masukkan nomor HP yang valid (9–18 digit)." : "",
    password: password.length === 0 && submitted ? "Kata sandi wajib diisi." : password.length > 0 && !passwordPattern.test(password) ? "Gunakan minimal 8 karakter, huruf besar, huruf kecil, dan angka." : "",
    confirmation: confirmation.length === 0 && submitted ? "Konfirmasi kata sandi wajib diisi." : confirmation.length > 0 && confirmation !== password ? "Konfirmasi kata sandi belum sama." : "",
  };
  const canSubmit = useMemo(() => name.trim().length >= 3 && emailPattern.test(email.trim()) && phonePattern.test(phone.trim()) && passwordPattern.test(password) && confirmation === password, [name, email, phone, password, confirmation]);

  function saveAccount() {
    setSubmitted(true);
    setFormError("");
    if (!canSubmit) return;
    const duplicateError = registerLocalAccount({ name: name.trim(), email: email.trim(), phone: phone.trim(), password });
    if (duplicateError) { setFormError(duplicateError); return; }
    router.replace("/login");
  }

  function update(setter: (value: string) => void, value: string) { setter(value); setFormError(""); }
  function field(nameLabel: string, value: string, setter: (value: string) => void, error: string, placeholder: string, options: { keyboardType?: "default" | "email-address" | "phone-pad"; secure?: boolean; show?: boolean; toggle?: () => void; autoCapitalize?: "none" | "words" } = {}) {
    const touched = submitted || value.length > 0;
    const valid = touched && !error && value.length > 0;
    return <>
      <Text style={styles.label}>{nameLabel}</Text>
      <View style={[styles.inputWrap, touched && error ? styles.inputError : null, valid ? styles.inputValid : null]}>
        <TextInput style={styles.input} value={value} onChangeText={(next) => update(setter, next)} placeholder={placeholder} placeholderTextColor="#A49D95" keyboardType={options.keyboardType ?? "default"} secureTextEntry={options.secure && !options.show} autoCapitalize={options.autoCapitalize ?? "none"} autoCorrect={false} accessibilityLabel={nameLabel} />
        {options.toggle ? <Pressable onPress={options.toggle} accessibilityRole="button"><Text style={styles.showPassword}>{options.show ? "Sembunyikan" : "Lihat"}</Text></Pressable> : null}
      </View>
      {touched && error ? <Text style={styles.error}>{error}</Text> : valid ? <Text style={styles.valid}>Sudah memenuhi syarat.</Text> : null}
    </>;
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.brandMark}><Text style={styles.brandMarkText}>C</Text></View>
        <Text style={styles.eyebrow}>CORTE BARBERSHOP</Text>
        <Text style={styles.title}>Buat akun{`\n`}baru.</Text>
        <Text style={styles.subtitle}>Daftar sekali untuk booking layanan dan menemukan produk grooming favoritmu.</Text>

        <View style={styles.form}>
          {field("Nama lengkap", name, setName, errors.name, "Nama kamu", { autoCapitalize: "words" })}
          {field("Email", email, setEmail, errors.email, "nama@email.com", { keyboardType: "email-address" })}
          {field("Nomor HP", phone, setPhone, errors.phone, "Contoh: 081234567890", { keyboardType: "phone-pad" })}
          {field("Kata sandi", password, setPassword, errors.password, "Min. 8 karakter", { secure: true, show: showPassword, toggle: () => setShowPassword((value) => !value) })}
          {field("Konfirmasi kata sandi", confirmation, setConfirmation, errors.confirmation, "Ulangi kata sandi", { secure: true, show: showConfirmation, toggle: () => setShowConfirmation((value) => !value) })}
          {formError ? <Text style={styles.formError}>{formError}</Text> : null}
          <Pressable style={[styles.primaryButton, !canSubmit && styles.disabledButton]} onPress={saveAccount} accessibilityRole="button"><Text style={styles.primaryText}>Buat Akun</Text></Pressable>
        </View>

        <View style={styles.footer}><Text style={styles.footerText}>Sudah punya akun? </Text><Link href="/login" asChild><Pressable><Text style={styles.link}>Masuk</Text></Pressable></Link></View>
        <Text style={styles.note}>Akun demo hanya aktif selama aplikasi terbuka.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg }, content: { flexGrow: 1, paddingHorizontal: 26, paddingVertical: 28, maxWidth: 560, width: "100%", alignSelf: "center" },
  brandMark: { width: 46, height: 46, borderRadius: 14, backgroundColor: C.ink, alignItems: "center", justifyContent: "center", marginBottom: 17 }, brandMarkText: { color: C.white, fontSize: 25, fontWeight: "800" }, eyebrow: { color: C.orange, fontSize: 11, fontWeight: "800", letterSpacing: 2 }, title: { color: C.ink, fontSize: 30, lineHeight: 35, fontWeight: "800", marginTop: 8 }, subtitle: { color: C.muted, fontSize: 14, lineHeight: 21, marginTop: 9 },
  form: { marginTop: 22 }, label: { color: C.ink, fontSize: 12, fontWeight: "700", marginTop: 14, marginBottom: 6 }, inputWrap: { minHeight: 48, borderWidth: 1, borderColor: C.border, borderRadius: 12, backgroundColor: C.white, paddingHorizontal: 13, flexDirection: "row", alignItems: "center" }, input: { flex: 1, minHeight: 46, fontSize: 14, color: C.ink }, inputError: { borderColor: C.danger }, inputValid: { borderColor: C.green }, showPassword: { color: C.orange, fontWeight: "700", fontSize: 11, marginLeft: 8 }, error: { color: C.danger, fontSize: 11, marginTop: 4, lineHeight: 16 }, valid: { color: C.green, fontSize: 11, marginTop: 4 }, formError: { color: C.danger, backgroundColor: "#FCE8E6", padding: 11, borderRadius: 10, marginTop: 14, fontSize: 12 },
  primaryButton: { minHeight: 51, backgroundColor: C.orange, borderRadius: 13, alignItems: "center", justifyContent: "center", marginTop: 21 }, disabledButton: { opacity: 0.58 }, primaryText: { color: C.white, fontSize: 14, fontWeight: "800" }, footer: { flexDirection: "row", justifyContent: "center", marginTop: 21 }, footerText: { color: C.muted, fontSize: 13 }, link: { color: C.orange, fontSize: 13, fontWeight: "800" }, note: { textAlign: "center", color: C.muted, fontSize: 10, marginTop: 22 },
});
