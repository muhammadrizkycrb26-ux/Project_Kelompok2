import styles from "../../styles/screens/profile.styles";
import AppButton from "@/components/atomic/AppButton";
import SectionHeader from "@/components/atomic/SectionHeader";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
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
        <SectionHeader title="Pengaturan" style={{ marginHorizontal: 0, marginTop: 28 }} />

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
        <AppButton
          title="Logout"
          onPress={() => setDialog("logout")}
          style={[styles.logoutButton, { alignSelf: "stretch", marginTop: 22 }]}
        >
          <Text style={styles.logoutIcon}>⇥</Text>
          <Text style={styles.logoutText}>Logout</Text>
        </AppButton>

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

              <AppButton title="Simpan" onPress={saveProfile} style={[styles.primaryButton, { marginTop: 0 }]}>
                <Text style={styles.primaryText}>Simpan</Text>
              </AppButton>
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


