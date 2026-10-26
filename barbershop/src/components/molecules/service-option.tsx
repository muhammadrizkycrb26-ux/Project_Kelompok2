import { Pressable, StyleSheet, View } from "react-native";

import { AppText, IconBox, RadioDot } from "@/components/atoms";
import { Palette } from "@/constants/palette";
import { getServicePriceLabel, type Service } from "@/data/services";

const categoryIcon: Record<string, string> = {
  Haircut: "✂",
  Coloring: "✦",
  Styling: "◇",
};

type ServiceOptionProps = { service: Service; active: boolean; onPress: () => void };

export function ServiceOption({ service, active, onPress }: ServiceOptionProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.card, active && styles.cardActive]}
    >
      <IconBox
        symbol={categoryIcon[service.category] ?? "✧"}
        size={55}
        radius={13}
        fontSize={25}
        style={active ? styles.iconActive : undefined}
      />

      <View style={styles.info}>
        <AppText variant="eyebrow" style={styles.category}>
          {service.category.toUpperCase()}
        </AppText>
        <AppText variant="cardTitle" style={styles.name}>
          {service.name}
        </AppText>
        <AppText variant="micro" style={styles.description}>
          {service.description}
        </AppText>
        <AppText variant="price" style={styles.price}>
          {getServicePriceLabel(service)}
        </AppText>
      </View>

      <RadioDot selected={active} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: Palette.surface,
    borderWidth: 1.5,
    borderColor: "transparent",
    borderRadius: 16,
    minHeight: 100,
  },
  cardActive: { borderColor: Palette.accent, backgroundColor: "#FFFCF8" },
  iconActive: { backgroundColor: "#F1D7C0" },
  info: { flex: 1, marginHorizontal: 12 },
  category: { fontSize: 8, fontWeight: "900", letterSpacing: 1 },
  name: { marginTop: 4 },
  description: { marginTop: 4 },
  price: { marginTop: 6, fontWeight: "900" },
});
