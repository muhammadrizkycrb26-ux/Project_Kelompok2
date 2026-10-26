import { StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from "react-native";

import { Palette } from "@/constants/palette";

export type BadgeTone =
  | "neutral"
  | "success"
  | "warning"
  | "info"
  | "danger"
  | "soft"
  | "dark"
  | "accent";

const tones: Record<BadgeTone, { bg: string; fg: string }> = {
  neutral: { bg: Palette.border, fg: Palette.muted },
  success: { bg: "#DDF4E5", fg: "#267446" },
  warning: { bg: "#FFF0D8", fg: "#9A641D" },
  info: { bg: "#DDEBFF", fg: "#285EA8" },
  danger: { bg: Palette.dangerSoft, fg: Palette.danger },
  soft: { bg: Palette.accentSoft, fg: Palette.accent },
  dark: { bg: Palette.darkRaised, fg: Palette.accentLight },
  accent: { bg: Palette.accent, fg: Palette.surface },
};

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function Badge({ label, tone = "neutral", style, textStyle }: BadgeProps) {
  const { bg, fg } = tones[tone];

  return (
    <View style={[styles.base, { backgroundColor: bg }, style]}>
      <Text style={[styles.text, { color: fg }, textStyle]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: "flex-start",
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  text: { fontSize: 9, fontWeight: "800", letterSpacing: 0.5 },
});
