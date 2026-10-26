import {
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { Palette } from "@/constants/palette";

export type ButtonVariant =
  | "primary"
  | "dark"
  | "soft"
  | "outline"
  | "danger"
  | "dangerOutline"
  | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = Omit<PressableProps, "style" | "children"> & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function Button({
  label,
  variant = "primary",
  size = "md",
  fullWidth,
  style,
  textStyle,
  ...rest
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && styles.full,
        pressed && styles.pressed,
        style,
      ]}
      {...rest}
    >
      <Text
        style={[styles.label, labelSizes[size], { color: labelColors[variant] }, textStyle]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: "center", justifyContent: "center" },
  full: { alignSelf: "stretch" },
  pressed: { opacity: 0.8 },
  label: { fontWeight: "900" },
});

const sizeStyles = StyleSheet.create({
  sm: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  md: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 12 },
  lg: { minHeight: 50, paddingHorizontal: 16, borderRadius: 13 },
});

const labelSizes = StyleSheet.create({
  sm: { fontSize: 11 },
  md: { fontSize: 12 },
  lg: { fontSize: 13 },
});

const variantStyles = StyleSheet.create({
  primary: { backgroundColor: Palette.accent },
  dark: { backgroundColor: Palette.dark },
  soft: { backgroundColor: Palette.accentSoft },
  outline: { borderWidth: 1, borderColor: Palette.border },
  danger: { backgroundColor: Palette.danger },
  dangerOutline: {
    borderWidth: 1,
    borderColor: Palette.dangerBorder,
    backgroundColor: "#FFF9F8",
  },
  ghost: { backgroundColor: "transparent" },
});

const labelColors: Record<ButtonVariant, string> = {
  primary: Palette.surface,
  dark: Palette.surface,
  soft: Palette.accent,
  outline: Palette.dark,
  danger: Palette.surface,
  dangerOutline: Palette.danger,
  ghost: Palette.muted,
};
