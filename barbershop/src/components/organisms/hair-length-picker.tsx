import { StyleSheet, View } from "react-native";

import { AppText, Card } from "@/components/atoms";
import { HairLengthOption } from "@/components/molecules";
import { HAIR_LENGTH_LABEL, type HairLength } from "@/data/booking";

type HairLengthPickerProps = {
  prices: Record<HairLength, number>;
  value: HairLength;
  onChange: (value: HairLength) => void;
};

const OPTIONS: HairLength[] = ["short", "medium"];

export function HairLengthPicker({ prices, value, onChange }: HairLengthPickerProps) {
  return (
    <Card style={styles.card}>
      <AppText variant="body" style={styles.label}>
        Panjang rambut
      </AppText>
      <AppText variant="micro" style={styles.description}>
        Harga menyesuaikan pilihan panjang rambut.
      </AppText>

      <View style={styles.row}>
        {OPTIONS.map((option) => (
          <HairLengthOption
            key={option}
            label={HAIR_LENGTH_LABEL[option]}
            price={prices[option]}
            active={value === option}
            onPress={() => onChange(option)}
          />
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 18, marginTop: 10 },
  label: { fontWeight: "800", marginBottom: 9 },
  description: { lineHeight: 16, marginBottom: 10 },
  row: { flexDirection: "row", gap: 10 },
});
