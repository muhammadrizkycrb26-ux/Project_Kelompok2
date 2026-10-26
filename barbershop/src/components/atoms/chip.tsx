import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from "react-native";

import { Palette } from "@/constants/palette";

export type ChipVariant = "pill" | "tab" | "segment" | "slot";

type ChipProps = {
  label: string;
  active?: boolean;
  variant?: ChipVariant;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function Chip({ label, active = false, variant = "pill", onPress, style }: ChipProps) {
  const v = variants[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[v.container, active && v.containerActive, style]}
    >
      <Text style={[v.label, active && v.labelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Palette.surface,
  },
  pillActive: { backgroundColor: Palette.accent },
  pillLabel: { fontSize: 11, fontWeight: "600", color: Palette.dark },

  tab: {
    paddingVertical: 9,
    paddingHorizontal: 17,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.surface,
  },
  tabActive: { backgroundColor: Palette.dark, borderColor: Palette.dark },
  tabLabel: { fontSize: 11, fontWeight: "700", color: Palette.muted },

  segment: { flex: 1, alignItems: "center", paddingVertical: 11, borderRadius: 10 },
  segmentActive: { backgroundColor: Palette.dark },
  segmentLabel: { fontSize: 12, fontWeight: "700", color: Palette.muted },

  slot: {
    width: "22%",
    minHeight: 42,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Palette.surface,
  },
  slotActive: { backgroundColor: Palette.accent, borderColor: Palette.accent },
  slotLabel: { fontSize: 11, fontWeight: "800", color: Palette.dark },

  labelActive: { color: Palette.surface },
});

const variants = {
  pill: {
    container: styles.pill,
    containerActive: styles.pillActive,
    label: styles.pillLabel,
    labelActive: styles.labelActive,
  },
  tab: {
    container: styles.tab,
    containerActive: styles.tabActive,
    label: styles.tabLabel,
    labelActive: styles.labelActive,
  },
  segment: {
    container: styles.segment,
    containerActive: styles.segmentActive,
    label: styles.segmentLabel,
    labelActive: styles.labelActive,
  },
  slot: {
    container: styles.slot,
    containerActive: styles.slotActive,
    label: styles.slotLabel,
    labelActive: styles.labelActive,
  },
} as const;
