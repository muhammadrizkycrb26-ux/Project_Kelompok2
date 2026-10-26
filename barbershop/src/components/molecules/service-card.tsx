import { Image, Pressable, StyleSheet, View } from "react-native";

import { AppText } from "@/components/atoms";
import { Palette } from "@/constants/palette";
import { getServicePriceLabel, type Service } from "@/data/services";

type ServiceCardProps = { service: Service; onPress: () => void };

export function ServiceCard({ service, onPress }: ServiceCardProps) {
  return (
    <Pressable accessibilityRole="button" style={styles.card} onPress={onPress}>
      <Image source={{ uri: service.image }} style={styles.image} resizeMode="cover" />

      <View style={styles.info}>
        <AppText variant="eyebrow" style={styles.category}>
          {service.category.toUpperCase()}
        </AppText>
        <AppText variant="cardTitle">{service.name}</AppText>
        <AppText variant="caption" style={styles.description}>
          {service.description}
        </AppText>
        <AppText variant="price" style={styles.price}>
          {getServicePriceLabel(service)}
        </AppText>
      </View>

      <View style={styles.arrow}>
        <AppText color={Palette.accent} style={styles.arrowText}>
          ›
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.surface,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  image: { width: 76, height: 82, borderRadius: 12, backgroundColor: Palette.accentSoft },
  info: { flex: 1, marginLeft: 12, paddingVertical: 3 },
  category: { fontSize: 9, letterSpacing: 1, marginBottom: 5 },
  description: { marginTop: 5 },
  price: { marginTop: 8 },
  arrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Palette.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },
  arrowText: { fontSize: 22, marginTop: -2 },
});
