import { StyleSheet, View } from "react-native";

import { AppText, IconBox } from "@/components/atoms";
import { EmptyState, FilterChips, SectionHeader } from "@/components/molecules";
import type { Order } from "@/store/orders-store";
import { OrderCard } from "./order-card";

export const ORDER_FILTERS = ["Semua", "Booking", "Produk"] as const;
export type OrderFilter = (typeof ORDER_FILTERS)[number];

const emptyMessage: Record<OrderFilter, string> = {
  Semua: "Booking layanan dan pembelian produk kamu akan muncul di sini.",
  Booking: "Booking layanan yang kamu buat akan muncul di sini.",
  Produk: "Pesanan produk yang kamu checkout akan muncul di sini.",
};

type OrderHistoryProps = {
  orders: Order[];
  filter: OrderFilter;
  onFilterChange: (filter: OrderFilter) => void;
  onCancel: (order: Order) => void;
};

export function OrderHistory({ orders, filter, onFilterChange, onCancel }: OrderHistoryProps) {
  return (
    <View style={styles.section}>
      <SectionHeader
        title="Riwayat Pesanan"
        trailing={<AppText variant="caption">{orders.length} pesanan</AppText>}
        style={styles.header}
      />

      <FilterChips
        variant="segment"
        options={ORDER_FILTERS}
        value={filter}
        onChange={onFilterChange}
        style={styles.filters}
      />

      {orders.length > 0 ? (
        <View style={styles.list}>
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onCancel={onCancel} />
          ))}
        </View>
      ) : (
        <EmptyState
          boxed
          icon={<IconBox symbol="📋" size={58} radius={20} fontSize={26} style={styles.emptyIcon} />}
          title="Belum Ada Pesanan"
          description={emptyMessage[filter]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 10 },
  header: { marginBottom: 13 },
  filters: { paddingHorizontal: 4 },
  list: { gap: 13 },
  emptyIcon: { marginBottom: 13 },
});
