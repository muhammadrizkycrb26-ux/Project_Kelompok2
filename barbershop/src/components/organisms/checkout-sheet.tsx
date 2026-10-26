import { ScrollView, StyleSheet, View } from "react-native";

import { AppText, Button, Divider } from "@/components/atoms";
import { BottomSheet, LineItemRow, PaymentOption } from "@/components/molecules";
import { Palette } from "@/constants/palette";
import { PAYMENT_METHODS } from "@/data/payments";
import type { PaymentMethod } from "@/store/orders-store";
import type { CartItem } from "@/types/cart";
import { formatRupiah } from "@/utils/format";

type CheckoutSheetProps = {
  visible: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onConfirm: () => void;
  onBack: () => void;
};

export function CheckoutSheet({
  visible,
  onClose,
  items,
  subtotal,
  paymentMethod,
  onPaymentMethodChange,
  onConfirm,
  onBack,
}: CheckoutSheetProps) {
  return (
    <BottomSheet visible={visible} onClose={onClose} title="Checkout" subtitle="Periksa kembali pesananmu">
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        <AppText variant="cardTitle" style={styles.sectionTitle}>
          Ringkasan Pesanan
        </AppText>

        {items.map((item) => (
          <LineItemRow
            key={item.product.id}
            bordered
            name={item.product.name}
            quantity={item.quantity}
            price={item.product.price}
          />
        ))}

        <Divider style={styles.divider} />

        <View style={styles.totalRow}>
          <AppText variant="cardTitle">Total Belanja</AppText>
          <AppText variant="sectionTitle" color={Palette.accent} style={styles.totalPrice}>
            {formatRupiah(subtotal)}
          </AppText>
        </View>

        <AppText variant="cardTitle" style={[styles.sectionTitle, styles.paymentTitle]}>
          Metode Pembayaran
        </AppText>

        {PAYMENT_METHODS.map(({ method, description }) => (
          <PaymentOption
            key={method}
            title={method}
            description={description}
            selected={paymentMethod === method}
            onPress={() => onPaymentMethodChange(method)}
          />
        ))}

        <View style={styles.notice}>
          <AppText variant="caption" style={styles.noticeTitle}>
            Informasi Checkout
          </AppText>
          <AppText variant="caption" style={styles.noticeText}>
            Metode pembayaran akan dicatat pada pesanan. Transaksi masih simulasi dan belum terhubung
            ke bank atau penyedia pembayaran.
          </AppText>
        </View>
      </ScrollView>

      <Button label="Konfirmasi Pesanan" size="lg" fullWidth onPress={onConfirm} style={styles.confirm} />
      <Button label="Kembali ke Keranjang" variant="ghost" fullWidth onPress={onBack} />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  list: { flexGrow: 0, flexShrink: 1 },
  sectionTitle: { fontWeight: "900", marginBottom: 10 },
  paymentTitle: { marginTop: 24 },
  divider: { marginVertical: 17 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 },
  totalPrice: { fontSize: 20 },
  notice: { backgroundColor: Palette.accentSoft, borderRadius: 13, padding: 14, marginTop: 20, marginBottom: 10 },
  noticeTitle: { color: Palette.dark, fontWeight: "900", marginBottom: 6 },
  noticeText: { lineHeight: 17 },
  confirm: { marginTop: 12 },
});
