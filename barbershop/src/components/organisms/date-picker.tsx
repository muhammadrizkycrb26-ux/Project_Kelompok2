import { ScrollView, StyleSheet } from "react-native";

import { DateOptionCard } from "@/components/molecules";
import type { DateOption } from "@/utils/booking-date";

type DatePickerProps = {
  options: DateOption[];
  selectedKey: string;
  onSelect: (key: string) => void;
};

export function DatePicker({ options, selectedKey, onSelect }: DatePickerProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
    >
      {options.map((option) => (
        <DateOptionCard
          key={option.key}
          option={option}
          active={option.key === selectedKey}
          onPress={() => onSelect(option.key)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 18, gap: 9 },
});
