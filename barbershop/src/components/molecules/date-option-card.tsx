import { Pressable, StyleSheet } from "react-native";

import { AppText } from "@/components/atoms";
import { Palette } from "@/constants/palette";
import type { DateOption } from "@/utils/booking-date";

type DateOptionCardProps = { option: DateOption; active: boolean; onPress: () => void };

export function DateOptionCard({ option, active, onPress }: DateOptionCardProps) {
  const color = active ? Palette.surface : undefined;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.card, active && styles.cardActive]}
    >
      <AppText variant="micro" color={color} style={styles.day}>
        {option.day}
      </AppText>
      <AppText variant="pageTitle" color={color ?? Palette.dark} style={styles.date}>
        {option.date}
      </AppText>
      <AppText variant="micro" color={color} style={styles.month}>
        {option.month}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 69,
    height: 88,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  cardActive: { backgroundColor: Palette.accent, borderColor: Palette.accent },
  day: { fontWeight: "700" },
  date: { fontSize: 23, marginTop: 4 },
  month: { marginTop: 2 },
});
