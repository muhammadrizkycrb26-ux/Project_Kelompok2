import { Pressable, StyleSheet, View } from "react-native";

import { AppText } from "@/components/atoms";
import { Palette } from "@/constants/palette";

type QuantityStepperProps = {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

export function QuantityStepper({ value, onDecrease, onIncrease }: QuantityStepperProps) {
  return (
    <View style={styles.row}>
      <Pressable accessibilityLabel="Kurangi jumlah" style={styles.button} onPress={onDecrease}>
        <AppText style={styles.symbol}>−</AppText>
      </Pressable>
      <AppText style={styles.value}>{value}</AppText>
      <Pressable accessibilityLabel="Tambah jumlah" style={styles.button} onPress={onIncrease}>
        <AppText style={styles.symbol}>+</AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  button: {
    width: 27,
    height: 27,
    borderRadius: 9,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: "center",
    justifyContent: "center",
  },
  symbol: { fontSize: 17, fontWeight: "800" },
  value: { fontWeight: "900", minWidth: 12, textAlign: "center" },
});
