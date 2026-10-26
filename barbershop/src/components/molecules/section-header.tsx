import type { ReactNode } from "react";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { AppText } from "@/components/atoms";
import { Palette } from "@/constants/palette";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  /** Elemen di sisi kanan (mis. link / jumlah item). */
  trailing?: ReactNode;
  /** Nomor langkah, mis. "01". Menampilkan kotak nomor di sisi kiri. */
  step?: string;
  style?: StyleProp<ViewStyle>;
};

export function SectionHeader({ title, subtitle, trailing, step, style }: SectionHeaderProps) {
  return (
    <View style={[styles.row, style]}>
      {step ? (
        <View style={styles.step}>
          <Text style={styles.stepText}>{step}</Text>
        </View>
      ) : null}

      <View style={styles.text}>
        <AppText variant="sectionTitle">{title}</AppText>
        {subtitle ? (
          <AppText variant="caption" style={styles.subtitle}>
            {subtitle}
          </AppText>
        ) : null}
      </View>

      {trailing}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  step: {
    width: 37,
    height: 37,
    borderRadius: 12,
    backgroundColor: Palette.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  stepText: { fontSize: 12, fontWeight: "900", color: Palette.accent },
  text: { flex: 1 },
  subtitle: { marginTop: 4 },
});
