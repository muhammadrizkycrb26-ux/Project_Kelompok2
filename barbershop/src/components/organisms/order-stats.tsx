import { StyleSheet, View } from "react-native";

import { StatCard } from "@/components/molecules";

type OrderStatsProps = { total: number; waiting: number; completed: number };

export function OrderStats({ total, waiting, completed }: OrderStatsProps) {
  return (
    <View style={styles.row}>
      <StatCard value={total} label="Total Pesanan" />
      <StatCard value={waiting} label="Menunggu" />
      <StatCard value={completed} label="Selesai" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 10, marginBottom: 26 },
});
