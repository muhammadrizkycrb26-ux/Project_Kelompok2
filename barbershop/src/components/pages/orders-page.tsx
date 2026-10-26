import { useMemo, useState } from "react";
import { Alert, StyleSheet } from "react-native";

import { IconBox } from "@/components/atoms";
import { PageHeader } from "@/components/molecules";
import {
  LatestBookingCard,
  OrderHistory,
  OrderStats,
  type OrderFilter,
} from "@/components/organisms";
import { ScreenTemplate } from "@/components/templates";
import { cancelOrder, useOrders, type Order } from "@/store/orders-store";

export default function OrdersPage() {
  const orders = useOrders();
  const [filter, setFilter] = useState<OrderFilter>("Semua");

  const sorted = useMemo(
    () =>
      [...orders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [orders],
  );

  const visible = sorted.filter((order) => {
    if (filter === "Booking") return order.type === "booking";
    if (filter === "Produk") return order.type === "product";
    return true;
  });

  const latestBooking = sorted.find((order) => order.type === "booking");
  const waiting = orders.filter((o) => o.status === "Menunggu Proses").length;
  const completed = orders.filter((o) => o.status === "Selesai").length;

  function handleCancel(order: Order) {
    if (order.status !== "Menunggu Proses") {
      Alert.alert(
        "Pesanan tidak dapat dibatalkan",
        "Pesanan hanya dapat dibatalkan saat masih menunggu proses.",
      );
      return;
    }

    Alert.alert("Batalkan pesanan?", "Yakin ingin membatalkan pesanan ini?", [
      { text: "Tidak", style: "cancel" },
      {
        text: "Ya, batalkan",
        style: "destructive",
        onPress: () => {
          cancelOrder(order.id);
          Alert.alert("Pesanan dibatalkan", "Status pesanan berhasil diperbarui.");
        },
      },
    ]);
  }

  return (
    <ScreenTemplate
      safeArea
      contentStyle={styles.content}
      header={
        <PageHeader
          eyebrow="BARBERSHOP"
          title="Pesanan Saya"
          subtitle="Pantau booking dan belanja kamu."
          trailing={<IconBox symbol="✂" size={48} radius={16} fontSize={24} />}
        />
      }
    >
      <OrderStats total={orders.length} waiting={waiting} completed={completed} />

      {latestBooking && latestBooking.type === "booking" ? (
        <LatestBookingCard booking={latestBooking} />
      ) : null}

      <OrderHistory
        orders={visible}
        filter={filter}
        onFilterChange={setFilter}
        onCancel={handleCancel}
      />
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingBottom: 30 },
});
