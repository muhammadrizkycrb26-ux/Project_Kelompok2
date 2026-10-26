import { Pressable, StyleSheet, View } from "react-native";

import { AppText, RadioDot } from "@/components/atoms";
import { Palette } from "@/constants/palette";

type PaymentOptionProps = {
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
};

export function PaymentOption({ title, description, selected, onPress }: PaymentOptionProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.option, selected && styles.selected]}
    >
      <RadioDot selected={selected} size={19} />
      <View style={styles.text}>
        <AppText variant="body" style={styles.title}>
          {title}
        </AppText>
        <AppText variant="micro" style={styles.description}>
          {description}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 12,
    padding: 13,
    marginTop: 9,
    gap: 11,
  },
  selected: { borderColor: Palette.accent, backgroundColor: "#FFF8F1" },
  text: { flex: 1 },
  title: { fontWeight: "800" },
  description: { marginTop: 4 },
});
