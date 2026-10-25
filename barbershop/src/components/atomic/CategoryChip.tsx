import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from "react-native";

type CategoryChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

const COLORS = { orange: "#F59A38", dark: "#242321", white: "#FFFFFF" };

/** Filter kategori yang konsisten untuk layanan dan produk. */
export default function CategoryChip({ label, selected, onPress, style }: CategoryChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, selected && styles.selected, pressed && styles.pressed, style]}
    >
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: COLORS.white },
  selected: { backgroundColor: COLORS.orange },
  label: { fontSize: 11, color: COLORS.dark, fontWeight: "600" },
  selectedLabel: { color: COLORS.white },
  pressed: { opacity: 0.8 },
});
