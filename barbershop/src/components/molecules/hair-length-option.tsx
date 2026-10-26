import { Pressable, StyleSheet } from "react-native";

import { AppText } from "@/components/atoms";
import { Palette } from "@/constants/palette";
import { formatRupiah } from "@/utils/format";

type HairLengthOptionProps = {
  label: string;
  price: number;
  active: boolean;
  onPress: () => void;
};

export function HairLengthOption({ label, price, active, onPress }: HairLengthOptionProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.button, active && styles.buttonActive]}
    >
      <AppText variant="body" color={active ? Palette.accent : Palette.dark} style={styles.title}>
        {label}
      </AppText>
      <AppText variant="caption" color={Palette.accent} style={styles.price}>
        {formatRupiah(price)}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 13,
    padding: 13,
    backgroundColor: Palette.surface,
  },
  buttonActive: { borderColor: Palette.accent, backgroundColor: Palette.accentSoft },
  title: { fontWeight: "800" },
  price: { fontWeight: "800", marginTop: 6 },
});
