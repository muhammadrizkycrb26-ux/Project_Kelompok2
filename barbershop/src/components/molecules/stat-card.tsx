import { StyleSheet } from "react-native";

import { AppText, Card } from "@/components/atoms";

type StatCardProps = { value: number | string; label: string };

export function StatCard({ value, label }: StatCardProps) {
  return (
    <Card bordered style={styles.card}>
      <AppText variant="pageTitle" style={styles.value}>
        {value}
      </AppText>
      <AppText variant="micro" style={styles.label}>
        {label}
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, borderRadius: 16, paddingVertical: 17, paddingHorizontal: 12 },
  value: { fontSize: 23, fontWeight: "800" },
  label: { marginTop: 5 },
});
