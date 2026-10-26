import { Pressable, StyleSheet, View } from "react-native";

import { AppText } from "@/components/atoms";
import { Palette } from "@/constants/palette";
import { formatRupiah } from "@/utils/format";

type FloatingCartBarProps = { itemCount: number; subtotal: number; onPress: () => void };

export function FloatingCartBar({ itemCount, subtotal, onPress }: FloatingCartBarProps) {
  return (
    <Pressable accessibilityRole="button" style={styles.bar} onPress={onPress}>
      <View>
        <AppText variant="micro" color={Palette.textOnDark} style={styles.title}>
          Keranjang Saya · {itemCount} produk
        </AppText>
        <AppText variant="sectionTitle" color={Palette.surface} style={styles.price}>
          {formatRupiah(subtotal)}
        </AppText>
      </View>
      <AppText color="#E8B68E" style={styles.action}>
        Lihat →
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 12,
    backgroundColor: Palette.dark,
    borderRadius: 17,
    paddingHorizontal: 17,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 7,
  },
  title: { fontWeight: "700" },
  price: { fontSize: 15, marginTop: 3 },
  action: { fontSize: 12, fontWeight: "900" },
});
