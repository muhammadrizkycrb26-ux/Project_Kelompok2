import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/atoms";
import { Palette } from "@/constants/palette";

type KeyValueRowProps = {
  label: string;
  value: string;
  /** "dark" dipakai di atas kartu gelap (mis. ringkasan booking). */
  tone?: "light" | "dark";
  valueLines?: number;
};

export function KeyValueRow({ label, value, tone = "light", valueLines }: KeyValueRowProps) {
  if (tone === "dark") {
    return (
      <View style={styles.darkRow}>
        <AppText variant="caption" color={Palette.mutedOnDark} style={styles.darkLabel}>
          {label}
        </AppText>
        <AppText
          variant="caption"
          color={Palette.surface}
          numberOfLines={valueLines}
          style={styles.darkValue}
        >
          {value}
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.lightRow}>
      <AppText variant="body" color={Palette.muted}>
        {label}
      </AppText>
      <AppText variant="body" style={styles.lightValue} numberOfLines={valueLines}>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  lightRow: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  lightValue: { fontWeight: "700", textAlign: "right", flexShrink: 1 },
  darkRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 15,
  },
  darkLabel: { flex: 0.8 },
  darkValue: { flex: 1.2, fontWeight: "700", textAlign: "right" },
});
