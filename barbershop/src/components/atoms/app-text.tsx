import { StyleSheet, Text, type TextProps } from "react-native";

import { Palette } from "@/constants/palette";

export type AppTextVariant =
  | "eyebrow"
  | "pageTitle"
  | "sectionTitle"
  | "cardTitle"
  | "body"
  | "caption"
  | "micro"
  | "price";

const variantStyles = StyleSheet.create({
  eyebrow: { fontSize: 10, fontWeight: "800", letterSpacing: 2 },
  pageTitle: { fontSize: 28, fontWeight: "900" },
  sectionTitle: { fontSize: 18, fontWeight: "900" },
  cardTitle: { fontSize: 13, fontWeight: "800" },
  body: { fontSize: 12 },
  caption: { fontSize: 11 },
  micro: { fontSize: 10 },
  price: { fontSize: 12, fontWeight: "800" },
});

const defaultColor: Record<AppTextVariant, string> = {
  eyebrow: Palette.accent,
  pageTitle: Palette.dark,
  sectionTitle: Palette.dark,
  cardTitle: Palette.dark,
  body: Palette.dark,
  caption: Palette.muted,
  micro: Palette.muted,
  price: Palette.accent,
};

export type AppTextProps = TextProps & {
  variant?: AppTextVariant;
  color?: string;
};

export function AppText({ variant = "body", color, style, ...rest }: AppTextProps) {
  return (
    <Text
      style={[variantStyles[variant], { color: color ?? defaultColor[variant] }, style]}
      {...rest}
    />
  );
}
