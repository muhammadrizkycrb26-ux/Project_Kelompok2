import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from "react-native";

type AppButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

const COLORS = { orange: "#F59A38", white: "#FFFFFF", muted: "#B8B2AA" };

/** Tombol utama bersama; gaya mengikuti UI Corte Barbershop yang sudah ada. */
export default function AppButton({ title, onPress, disabled = false, style, children }: AppButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, disabled && styles.disabled, pressed && !disabled && styles.pressed, style]}
    >
      {children ?? <Text style={styles.label}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { backgroundColor: COLORS.orange, paddingVertical: 14, paddingHorizontal: 18, borderRadius: 12, alignSelf: "flex-start", marginTop: 20 },
  label: { color: COLORS.white, fontSize: 13, fontWeight: "700" },
  disabled: { opacity: 0.55 },
  pressed: { opacity: 0.85 },
});
