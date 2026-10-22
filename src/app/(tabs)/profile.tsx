import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

const C = {
  background: "#F7F4EF",
  dark: "#242321",
  orange: "#C9824A",
  muted: "#77736E",
  white: "#FFFFFF",
  border: "#EAE4DC",
  softOrange: "#F5E7D9",
  red: "#B23B35",
};

type DialogType = "logout" | "info" | null;

export default function ProfileScreen() {
  // Data contoh profil. Ganti dengan data dari sistem login jika tersedia.
  const [name, setName] = useState("Tanu Hasyim");
  const [phone, setPhone] = useState("081234567890");

  const [editVisible, setEditVisible] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [draftPhone, setDraftPhone] = useState(phone);

  const [settingsVisible, setSettingsVisible] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const [dialog, setDialog] = useState<DialogType>(null);

  function openEditProfile() {
    setDraftName(name);
    setDraftPhone(phone);
    setEditVisible(true);
  }

  function saveProfile() {
    if (!draftName.trim()) {
      showMessage("Nama wajib diisi", "Silakan masukkan nama lengkap.");
      return;
    }

    if (!draftPhone.trim()) {
      showMessage("Nomor HP wajib diisi", "Silakan masukkan nomor HP.");
      return;
    }

    setName(draftName.trim());
    setPhone(draftPhone.trim());
    setEditVisible(false);
    showMessage("Profil diperbarui", "Data profil berhasil diperbarui.");
  }

  function showMessage(title: string, message: string) {
    if (Platform.OS === "web") {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  }

  function confirmLogout() {
    setDialog(null);

    // Simulasi logout karena autentikasi belum dihubungkan.
    showMessage(
      "Logout belum terhubung",
      "Tampilan profil ini belum memakai sistem login. Hubungkan fungsi logout ke autentikasi aplikasi agar sesi pengguna benar-benar berakhir.",
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>BARBERSHOP EXPERIENCE</Text>
            <Text style={styles.title}>Profil Saya</Text>
            <Text style={styles.subtitle}>
              Kelola informasi dan preferensi akunmu.
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Text style={styles.scissors}>✂</Text>
          </View>
        </View>

        {/* Kartu profil */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {name.trim().charAt(0).toUpperCase() || "U"}
            </Text>
          </View>

          <Text style={styles.profileName}>{name}</Text>
          <Text style={styles.profilePhone}>{phone}</Text>

          <View style={styles.memberBadge}>
            <Text style={styles.memberBadgeText}>PELANGGAN BARBERSHOP</Text>
          </View>
        </View>

        {/* Data diri */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Data Diri</Text>
          <Pressable onPress={openEditProfile} hitSlop={8}>
            <Text style={styles.editText}>Edit Profil</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Text style={styles.infoIconText}>♙</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Nama lengkap</Text>
              <Text style={styles.infoValue}>{name}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Text style={styles.infoIconText}>☎</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Nomor HP</Text>
              <Text style={styles.infoValue}>{phone}</Text>
            </View>
          </View>
        </View>

        {/* Pengaturan */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pengaturan</Text>
        </View>

        <View style={styles.card}>
          <Pressable
            style={styles.menuRow}
            onPress={() => setSettingsVisible(true)}
          >
            <View style={styles.menuIcon}>
              <Text style={styles.menuIconText}>⚙</Text>
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Preferensi aplikasi</Text>
              <Text style={styles.menuSubtitle}>
                Notifikasi dan tampilan aplikasi
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>

          <View style={styles.divider} />

          <Pressable
            style={styles.menuRow}
            onPress={() =>
              showMessage(
                "Tentang Barbershop",
                "Aplikasi untuk booking layanan dan membeli produk Barbershop.",
              )
            }
          >
            <View style={styles.menuIcon}>
              <Text style={styles.menuIconText}>ⓘ</Text>
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Tentang aplikasi</Text>
              <Text style={styles.menuSubtitle}>
                Informasi aplikasi Barbershop
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        </View>

        {/* Logout */}
        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.pressed,
          ]}
          onPress={() => setDialog("logout")}
        >
          <Text style={styles.logoutIcon}>⇥</Text>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>

        <Text style={styles.footerText}>BARBERSHOP EXPERIENCE · 2026</Text>
      </ScrollView>

      {/* Modal edit profil */}
      <Modal
        visible={editVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditVisible(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Profil</Text>
            <Text style={styles.modalSubtitle}>
              Perbarui informasi data dirimu.
            </Text>

            <Text style={styles.inputLabel}>Nama lengkap</Text>
            <TextInput
              style={styles.input}
              value={draftName}
              onChangeText={setDraftName}
              placeholder="Masukkan nama"
              placeholderTextColor="#A49D95"
              autoCapitalize="words"
              maxLength={80}
            />

            <Text style={styles.inputLabel}>Nomor HP</Text>
            <TextInput
              style={styles.input}
              value={draftPhone}
              onChangeText={setDraftPhone}
              placeholder="Contoh: 081234567890"
              placeholderTextColor="#A49D95"
              keyboardType="phone-pad"
              maxLength={20}
            />

            <View style={styles.modalActions}>
              <Pressable
                style={styles.secondaryButton}
                onPress={() => setEditVisible(false)}
              >
                <Text style={styles.secondaryText}>Batal</Text>
              </Pressable>

              <Pressable style={styles.primaryButton} onPress={saveProfile}>
                <Text style={styles.primaryText}>Simpan</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal pengaturan */}
      <Modal
        visible={settingsVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSettingsVisible(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Preferensi Aplikasi</Text>
            <Text style={styles.modalSubtitle}>
              Atur pengalaman penggunaan aplikasi.
            </Text>

            <View style={styles.settingRow}>
              <View style={styles.settingContent}>
                <Text style={styles.menuTitle}>Notifikasi</Text>
                <Text style={styles.menuSubtitle}>
                  Aktifkan pengingat dan informasi
                </Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: "#D7D0C7", true: C.orange }}
                thumbColor={C.white}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingContent}>
                <Text style={styles.menuTitle}>Mode gelap</Text>
                <Text style={styles.menuSubtitle}>
                  Preferensi tampilan (demo)
                </Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: "#D7D0C7", true: C.orange }}
                thumbColor={C.white}
              />
            </View>

            <Text style={styles.hint}>
              Pengaturan ini masih bersifat lokal dan belum tersimpan permanen.
              Mode gelap belum mengubah tema seluruh halaman.
            </Text>

            <Pressable
              style={[styles.primaryButton, styles.fullButton]}
              onPress={() => setSettingsVisible(false)}
            >
              <Text style={styles.primaryText}>Selesai</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal konfirmasi logout */}
      <Modal
        visible={dialog === "logout"}
        transparent
        animationType="fade"
        onRequestClose={() => setDialog(null)}
      >
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            <View style={styles.logoutMark}>
              <Text style={styles.logoutMarkText}>!</Text>
            </View>

            <Text style={styles.modalTitle}>Konfirmasi Logout</Text>
            <Text style={styles.modalSubtitle}>
              Apakah kamu yakin ingin keluar dari akun?
            </Text>

            <View style={styles.modalActions}>
              <Pressable
                style={styles.secondaryButton}
                onPress={() => setDialog(null)}
              >
                <Text style={styles.secondaryText}>Batal</Text>
              </Pressable>

              <Pressable style={styles.dangerButton} onPress={confirmLogout}>
                <Text style={styles.primaryText}>Ya, Logout</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background,
  },
  scrollContent: {
    paddingBottom: 35,
  },
  header: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eyebrow: {
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: "800",
    color: C.orange,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: C.dark,
    marginTop: 6,
  },
  subtitle: {
    fontSize: 12,
    color: C.muted,
    marginTop: 5,
  },
  headerIcon: {
    width: 49,
    height: 49,
    borderRadius: 16,
    backgroundColor: C.softOrange,
    alignItems: "center",
    justifyContent: "center",
  },
  scissors: {
    fontSize: 25,
    color: C.orange,
  },
  profileCard: {
    marginHorizontal: 18,
    borderRadius: 22,
    backgroundColor: C.dark,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: C.softOrange,
    borderWidth: 3,
    borderColor: "#D99B6B",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 33,
    fontWeight: "900",
    color: C.orange,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "900",
    color: C.white,
    marginTop: 14,
  },
  profilePhone: {
    fontSize: 12,
    color: "#D0C8BF",
    marginTop: 6,
  },
  memberBadge: {
    marginTop: 15,
    backgroundColor: "#3B3732",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  memberBadgeText: {
    color: "#F0B47F",
    fontSize: 9,
    letterSpacing: 1,
    fontWeight: "800",
  },
  sectionHeader: {
    marginHorizontal: 20,
    marginTop: 27,
    marginBottom: 13,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    color: C.dark,
    fontSize: 17,
    fontWeight: "900",
  },
  editText: {
    color: C.orange,
    fontSize: 12,
    fontWeight: "800",
  },
  card: {
    marginHorizontal: 18,
    borderRadius: 17,
    backgroundColor: C.white,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: C.border,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: C.softOrange,
    alignItems: "center",
    justifyContent: "center",
  },
  infoIconText: {
    fontSize: 21,
    color: C.orange,
  },
  infoContent: {
    flex: 1,
    marginLeft: 13,
  },
  infoLabel: {
    fontSize: 11,
    color: C.muted,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "800",
    color: C.dark,
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: C.border,
  },
  menuRow: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: C.softOrange,
    alignItems: "center",
    justifyContent: "center",
  },
  menuIconText: {
    fontSize: 21,
    color: C.orange,
  },
  menuContent: {
    flex: 1,
    marginLeft: 12,
  },
  menuTitle: {
    color: C.dark,
    fontSize: 13,
    fontWeight: "800",
  },
  menuSubtitle: {
    color: C.muted,
    fontSize: 11,
    marginTop: 4,
  },
  chevron: {
    color: C.muted,
    fontSize: 25,
    paddingHorizontal: 5,
  },
  logoutButton: {
    marginHorizontal: 18,
    marginTop: 27,
    minHeight: 53,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8B8B4",
    backgroundColor: "#FFF9F8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },
  logoutIcon: {
    color: C.red,
    fontSize: 20,
    fontWeight: "900",
  },
  logoutText: {
    color: C.red,
    fontSize: 13,
    fontWeight: "900",
  },
  footerText: {
    textAlign: "center",
    color: "#A39B92",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginTop: 24,
  },
  pressed: {
    opacity: 0.75,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(24,22,20,0.58)",
    justifyContent: "center",
    alignItems: "center",
    padding: 22,
  },
  modalCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: C.white,
    borderRadius: 23,
    padding: 22,
    borderWidth: 1,
    borderColor: C.border,
  },
  modalTitle: {
    color: C.dark,
    fontSize: 21,
    fontWeight: "900",
  },
  modalSubtitle: {
    color: C.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
  },
  inputLabel: {
    color: C.dark,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 18,
    marginBottom: 8,
  },
  input: {
    height: 47,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    color: C.dark,
    backgroundColor: "#FCFBF9",
    fontSize: 13,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
    marginTop: 23,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  secondaryText: {
    color: C.dark,
    fontSize: 12,
    fontWeight: "800",
  },
  primaryButton: {
    backgroundColor: C.orange,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryText: {
    color: C.white,
    fontSize: 12,
    fontWeight: "900",
  },
  dangerButton: {
    backgroundColor: C.red,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  fullButton: {
    marginTop: 23,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 16,
  },
  settingContent: {
    flex: 1,
  },
  hint: {
    color: C.muted,
    fontSize: 10,
    lineHeight: 16,
    marginTop: 12,
  },
  logoutMark: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: "#FBE1DF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  logoutMarkText: {
    color: C.red,
    fontSize: 24,
    fontWeight: "900",
  },
});
