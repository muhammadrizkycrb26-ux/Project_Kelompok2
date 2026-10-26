import { StyleSheet, View } from "react-native";

import { AppText, Button } from "@/components/atoms";
import { CenterDialog } from "@/components/molecules";
import { Palette } from "@/constants/palette";

type LogoutDialogProps = { visible: boolean; onClose: () => void; onConfirm: () => void };

export function LogoutDialog({ visible, onClose, onConfirm }: LogoutDialogProps) {
  return (
    <CenterDialog
      visible={visible}
      onClose={onClose}
      title="Konfirmasi Logout"
      subtitle="Apakah kamu yakin ingin keluar dari akun?"
      icon={
        <View style={styles.mark}>
          <AppText color={Palette.danger} style={styles.markText}>
            !
          </AppText>
        </View>
      }
      actions={
        <>
          <Button variant="outline" label="Batal" onPress={onClose} />
          <Button variant="danger" label="Ya, Logout" onPress={onConfirm} />
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  mark: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: Palette.dangerSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  markText: { fontSize: 24, fontWeight: "900" },
});
