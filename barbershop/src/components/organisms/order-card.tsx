import { StyleSheet, View } from "react-native";

import { AppText, Button, Card, Divider, IconBox } from "@/components/atoms";
import { KeyValueRow, LineItemRow, StatusBadge } from "@/components/molecules";
import { Palette } from "@/constants/palette";
import type { Order } from "@/store/orders-store";
import { formatRupiah, formatShortDate } from "@/utils/format";

type OrderCardProps = { order: Order; onCancel: (order: Order) => void };

export function OrderCard({ order, onCancel }: OrderCardProps) {
  const isBooking = order.type === "booking";

  return (
    <Card bordered style={styles.card}>
      <View style={styles.header}>
        <View style={styles.typeRow}>
          <IconBox symbol={isBooking ? "✂" : "🛍"} radius={13} fontSize={20} />
          <View style={styles.title}>
            <AppText variant="cardTitle">{isBooking ? "Booking Barbershop" : "Belanja Produk"}</AppText>
            <AppText variant="micro" style={styles.id}>
              {order.id}
            </AppText>
          </View>
        </View>
        <StatusBadge status={order.status} />
      </View>

      <Divider style={styles.divider} />

      {order.type === "booking" ? (
        <View style={styles.details}>
          <KeyValueRow label="Nama pelanggan" value={order.customerName} />
          <KeyValueRow label="Layanan" value={order.serviceName} />
          <KeyValueRow label="Tanggal" value={order.date} />
          <KeyValueRow label="Jam" value={order.time} />
        </View>
      ) : (
        <>
          <View style={styles.details}>
            {order.items.map((item, index) => (
              <LineItemRow
                key={`${item.productId}-${index}`}
                name={item.name}
                quantity={item.quantity}
                price={item.price}
              />
            ))}
          </View>
          <View style={[styles.details, styles.payment]}>
            <KeyValueRow label="Metode pembayaran" value={order.paymentMethod} />
          </View>
        </>
      )}

      <View style={styles.totalRow}>
        <AppText variant="body" color={Palette.muted}>
          {isBooking ? "Total pembayaran" : "Total belanja"}
        </AppText>
        <AppText variant="price" style={styles.totalPrice}>
          {formatRupiah(order.type === "booking" ? order.price : order.total)}
        </AppText>
      </View>

      <View style={styles.footer}>
        <AppText variant="micro">Dibuat {formatShortDate(order.createdAt)}</AppText>

        {order.status === "Menunggu Proses" ? (
          <Button label="Batalkan" variant="dangerOutline" size="sm" onPress={() => onCancel(order)} />
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 18, padding: 15 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 8 },
  typeRow: { flexDirection: "row", alignItems: "center", flex: 1 },
  title: { marginLeft: 10, flex: 1 },
  id: { marginTop: 4 },
  divider: { marginVertical: 14 },
  details: { gap: 12 },
  payment: { marginTop: 12 },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    marginTop: 15,
    paddingTop: 13,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalPrice: { fontSize: 15 },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
    gap: 8,
  },
});
