import { StyleSheet } from "react-native";

import { AppText, Button, Divider } from "@/components/atoms";
import { CenterDialog, SettingToggleRow } from "@/components/molecules";

type PreferencesDialogProps = {
  visible: boolean;
  onClose: () => void;
  notifications: boolean;
  onNotificationsChange: (value: boolean) => void;
  darkMode: boolean;
  onDarkModeChange: (value: boolean) => void;
};

export function PreferencesDialog({
  visible,
  onClose,
  notifications,
  onNotificationsChange,
  darkMode,
  onDarkModeChange,
}: PreferencesDialogProps) {
  return (
    <CenterDialog
      visible={visible}
      onClose={onClose}
      title="Preferensi Aplikasi"
      subtitle="Atur pengalaman penggunaan aplikasi."
    >
      <SettingToggleRow
        title="Notifikasi"
        subtitle="Aktifkan pengingat dan informasi"
        value={notifications}
        onValueChange={onNotificationsChange}
      />
      <Divider />
      <SettingToggleRow
        title="Mode gelap"
        subtitle="Preferensi tampilan (demo)"
        value={darkMode}
        onValueChange={onDarkModeChange}
      />

      <AppText variant="micro" style={styles.hint}>
        Pengaturan ini masih bersifat lokal dan belum tersimpan permanen. Mode gelap belum mengubah
        tema seluruh halaman.
      </AppText>

      <Button label="Selesai" fullWidth onPress={onClose} style={styles.done} />
    </CenterDialog>
  );
}

const styles = StyleSheet.create({
  hint: { lineHeight: 16, marginTop: 12 },
  done: { marginTop: 23 },
});
