import type { ReactNode } from "react";
import { Modal, StyleSheet, View } from "react-native";

import { AppText } from "@/components/atoms";
import { Palette } from "@/constants/palette";

type CenterDialogProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  /** Ikon/penanda di atas judul. */
  icon?: ReactNode;
  children?: ReactNode;
  /** Baris tombol di bagian bawah, rata kanan. */
  actions?: ReactNode;
};

export function CenterDialog({
  visible,
  onClose,
  title,
  subtitle,
  icon,
  children,
  actions,
}: CenterDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {icon}
          <AppText variant="sectionTitle" style={styles.title}>
            {title}
          </AppText>
          {subtitle ? (
            <AppText variant="body" color={Palette.muted} style={styles.subtitle}>
              {subtitle}
            </AppText>
          ) : null}

          {children}

          {actions ? <View style={styles.actions}>{actions}</View> : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: Palette.overlay,
    justifyContent: "center",
    alignItems: "center",
    padding: 22,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: Palette.surface,
    borderRadius: 23,
    padding: 22,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  title: { fontSize: 21 },
  subtitle: { lineHeight: 19, marginTop: 8 },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
    marginTop: 23,
  },
});
