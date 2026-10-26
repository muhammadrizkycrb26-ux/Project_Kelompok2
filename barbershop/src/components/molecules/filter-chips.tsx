import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { Chip } from "@/components/atoms";

type FilterChipsProps<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  /** pill = scroll horizontal, tab = baris biasa, segment = kontrol bersegmen. */
  variant?: "pill" | "tab" | "segment";
  style?: StyleProp<ViewStyle>;
};

export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  variant = "pill",
  style,
}: FilterChipsProps<T>) {
  const chips = options.map((option) => (
    <Chip
      key={option}
      label={option}
      variant={variant}
      active={option === value}
      onPress={() => onChange(option)}
    />
  ));

  if (variant === "pill") {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.pillRow, style]}
      >
        {chips}
      </ScrollView>
    );
  }

  return <View style={[variant === "segment" ? styles.segment : styles.tabRow, style]}>{chips}</View>;
}

const styles = StyleSheet.create({
  pillRow: { paddingHorizontal: 20, paddingBottom: 16, gap: 8 },
  tabRow: { flexDirection: "row", paddingHorizontal: 20, gap: 8, marginBottom: 14 },
  segment: {
    flexDirection: "row",
    backgroundColor: "#EEE8E0",
    borderRadius: 13,
    padding: 4,
    marginBottom: 15,
  },
});

