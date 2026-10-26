import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { AppText } from "@/components/atoms";
import { Palette } from "@/constants/palette";

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  /** Tampilkan dalam kartu putih berborder. */
  boxed?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function EmptyState({ icon, title, description, action, boxed, style }: EmptyStateProps) {
  return (
    <View style={[styles.container, boxed && styles.boxed, style]}>
      {icon}
      <AppText variant="sectionTitle" style={styles.title}>
        {title}
      </AppText>
      <AppText variant="body" color={Palette.muted} style={styles.description}>
        {description}
      </AppText>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", padding: 28 },
  boxed: {
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 18,
  },
  title: { fontSize: 16, textAlign: "center" },
  description: { textAlign: "center", lineHeight: 19, marginTop: 7 },
});
