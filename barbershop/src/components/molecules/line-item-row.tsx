import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/atoms";
import { Palette } from "@/constants/palette";
import { formatRupiah } from "@/utils/format";

type LineItemRowProps = {
  name: string;
  quantity: number;
  price: number;
  /** Tambahkan garis pemisah di bawah baris (dipakai di checkout). */
  bordered?: boolean;
};

export function LineItemRow({ name, quantity, price, bordered }: LineItemRowProps) {
  return (
    <View style={[styles.row, bordered && styles.bordered]}>
      <View style={styles.info}>
        <AppText variant="body" style={styles.name}>
          {name}
        </AppText>
        <AppText variant="micro" style={styles.quantity}>
          {quantity} × {formatRupiah(price)}
        </AppText>
      </View>
      <AppText variant="body" style={styles.subtotal}>
        {formatRupiah(price * quantity)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 12 },
  bordered: {
    alignItems: "center",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  info: { flex: 1 },
  name: { fontWeight: "700" },
  quantity: { marginTop: 4 },
  subtotal: { fontWeight: "700" },
});
