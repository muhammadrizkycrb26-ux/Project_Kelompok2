import { StyleSheet, View } from "react-native";

import { AppText, Card, Chip } from "@/components/atoms";

type TimeSlotPickerProps = {
  slots: readonly string[];
  selected: string;
  onSelect: (slot: string) => void;
};

export function TimeSlotPicker({ slots, selected, onSelect }: TimeSlotPickerProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.grid}>
        {slots.map((slot) => (
          <Chip
            key={slot}
            variant="slot"
            label={slot}
            active={slot === selected}
            onPress={() => onSelect(slot)}
          />
        ))}
      </View>

      <AppText variant="micro" style={styles.note}>
        Slot di atas merupakan pilihan waktu awal. Ketersediaan aktual perlu diperiksa melalui
        sistem booking.
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 18 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 9 },
  note: { lineHeight: 16, marginTop: 10 },
});
