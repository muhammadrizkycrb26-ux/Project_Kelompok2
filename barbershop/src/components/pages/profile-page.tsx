import { useState } from "react";
import { StyleSheet } from "react-native";

import { AppText, Button, IconBox } from "@/components/atoms";
import { PageHeader } from "@/components/molecules";
import {
  EditProfileDialog,
  LogoutDialog,
  PreferencesDialog,
  ProfileCard,
  ProfileDetails,
  SettingsMenu,
} from "@/components/organisms";
import { ScreenTemplate } from "@/components/templates";
import { showMessage } from "@/utils/alert";

export default function ProfilePage() {
  // Data contoh profil. Ganti dengan data dari sistem login jika tersedia.
  const [name, setName] = useState("Kelompok 2");
  const [phone, setPhone] = useState("081234567890");

  const [editVisible, setEditVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  function saveProfile(draftName: string, draftPhone: string) {
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

  function confirmLogout() {
    setLogoutVisible(false);

    // Simulasi logout karena autentikasi belum dihubungkan.
    showMessage(
      "Logout belum terhubung",
      "Tampilan profil ini belum memakai sistem login. Hubungkan fungsi logout ke autentikasi aplikasi agar sesi pengguna benar-benar berakhir.",
    );
  }

  return (
    <ScreenTemplate contentStyle={styles.content}>
      <PageHeader
        eyebrow="BARBERSHOP EXPERIENCE"
        title="Profil Saya"
        subtitle="Kelola informasi dan preferensi akunmu."
        trailing={<IconBox symbol="✂" size={49} radius={16} fontSize={25} />}
        style={styles.header}
      />

      <ProfileCard name={name} phone={phone} />

      <ProfileDetails name={name} phone={phone} onEdit={() => setEditVisible(true)} />

      <SettingsMenu
        onOpenPreferences={() => setSettingsVisible(true)}
        onOpenAbout={() =>
          showMessage(
            "Tentang Barbershop",
            "Aplikasi untuk booking layanan dan membeli produk Barbershop.",
          )
        }
      />

      <Button
        variant="dangerOutline"
        size="lg"
        label="⇥  Logout"
        onPress={() => setLogoutVisible(true)}
        style={styles.logout}
      />

      <AppText variant="micro" color="#A39B92" style={styles.footer}>
        BARBERSHOP EXPERIENCE · 2026
      </AppText>

      <EditProfileDialog
        visible={editVisible}
        name={name}
        phone={phone}
        onClose={() => setEditVisible(false)}
        onSave={saveProfile}
      />

      <PreferencesDialog
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        notifications={notifications}
        onNotificationsChange={setNotifications}
        darkMode={darkMode}
        onDarkModeChange={setDarkMode}
      />

      <LogoutDialog
        visible={logoutVisible}
        onClose={() => setLogoutVisible(false)}
        onConfirm={confirmLogout}
      />
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 35 },
  header: { paddingBottom: 22 },
  logout: { marginHorizontal: 18, marginTop: 27 },
  footer: { textAlign: "center", fontSize: 9, fontWeight: "700", letterSpacing: 1.5, marginTop: 24 },
});
