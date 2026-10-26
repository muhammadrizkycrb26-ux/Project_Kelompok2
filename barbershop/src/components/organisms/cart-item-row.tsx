import { Image, StyleSheet, View } from "react-native";

import { AppText } from "@/components/atoms";
import { QuantityStepper } from "@/components/molecules";
import { Palette } from "@/constants/palette";
import type { CartItem } from "@/types/cart";
import { formatRupiah } from "@/utils/format";

type CartItemRowProps = {
  item: CartItem;
  imageUri?: string;
  onChangeQuantity: (change: number) => void;
};

export function CartItemRow({ item, imageUri, onChangeQuantity }: CartItemRowProps) {
  return (
    <View style={styles.row}>
      <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />

      <View style={styles.info}>
        <AppText variant="body" style={styles.name}>
          {item.product.name}
        </AppText>
        <AppText variant="caption" color={Palette.accent} style={styles.price}>
          {formatRupiah(item.product.price)}
        </AppText>

        <View style={styles.stepper}>
          <QuantityStepper
            value={item.quantity}
            onDecrease={() => onChangeQuantity(-1)}
            onIncrease={() => onChangeQuantity(1)}
          />
        </View>
      </View>

      <AppText variant="caption" color={Palette.dark} style={styles.total}>
        {formatRupiah(item.product.price * item.quantity)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
    gap: 10,
  },
  image: { width: 54, height: 60, borderRadius: 12, backgroundColor: Palette.surface },
  info: { flex: 1 },
  name: { fontWeight: "900" },
  price: { fontWeight: "800", marginTop: 4 },
  stepper: { marginTop: 9 },
  total: { fontWeight: "900" },
});
