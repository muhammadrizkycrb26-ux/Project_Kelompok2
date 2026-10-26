import { ScrollView, StyleSheet } from "react-native";

import { AppText, Button, Card } from "@/components/atoms";
import { BottomSheet, EmptyState } from "@/components/molecules";
import { Palette } from "@/constants/palette";
import { getProductImage } from "@/data/product-images";
import type { CartItem } from "@/types/cart";
import { formatRupiah } from "@/utils/format";
import { CartItemRow } from "./cart-item-row";

type CartSheetProps = {
  visible: boolean;
  onClose: () => void;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  onChangeQuantity: (productId: string, change: number) => void;
  onCheckout: () => void;
};

export function CartSheet({
  visible,
  onClose,
  items,
  itemCount,
  subtotal,
  onChangeQuantity,
  onCheckout,
}: CartSheetProps) {
  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Keranjang Saya"
      subtitle={`${itemCount} produk dipilih`}
    >
      {items.length === 0 ? (
        <EmptyState
          icon={<AppText style={styles.emoji}>🛒</AppText>}
          title="Keranjang masih kosong"
          description="Tambahkan produk dari katalog untuk mulai belanja."
          action={<Button label="Lihat Produk" size="lg" fullWidth onPress={onClose} style={styles.action} />}
        />
      ) : (
        <>
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {items.map((item) => (
              <CartItemRow
                key={item.product.id}
                item={item}
                imageUri={getProductImage(item.product.id)}
                onChangeQuantity={(change) => onChangeQuantity(item.product.id, change)}
              />
            ))}

            <Card bordered style={styles.subtotal}>
              <AppText variant="caption">Subtotal</AppText>
              <AppText variant="pageTitle" style={styles.subtotalPrice}>
                {formatRupiah(subtotal)}
              </AppText>
              <AppText variant="micro" style={styles.note}>
                Ongkir belum dihitung.
              </AppText>
            </Card>
          </ScrollView>

          <Button
            size="lg"
            fullWidth
            label={`Lanjut Checkout · ${formatRupiah(subtotal)}`}
            onPress={onCheckout}
            style={styles.checkout}
          />
        </>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  list: { flexGrow: 0, flexShrink: 1 },
  emoji: { fontSize: 36, marginBottom: 12 },
  action: { marginTop: 15 },
  subtotal: { borderRadius: 15, marginTop: 18, marginBottom: 15, backgroundColor: Palette.surface },
  subtotalPrice: { fontSize: 22, marginTop: 5 },
  note: { marginTop: 6 },
  checkout: { marginTop: 12 },
});
