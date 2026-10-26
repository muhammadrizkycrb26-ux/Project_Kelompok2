import { StyleSheet } from "react-native";

import { Badge, Card } from "@/components/atoms";
import { IconListItem } from "@/components/molecules";

export function HoursCard() {
  return (
    <Card style={styles.card}>
      <IconListItem
        icon="◷"
        title="Jam Operasional"
        subtitle="Setiap hari · 09.00–21.00"
        trailing={<Badge label="OPEN" tone="success" />}
        style={styles.item}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 20, marginTop: 22, borderRadius: 16 },
  item: { paddingVertical: 0 },
});
