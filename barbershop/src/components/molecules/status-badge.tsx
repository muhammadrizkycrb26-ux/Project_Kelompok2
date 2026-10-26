import { Badge, type BadgeTone } from "@/components/atoms";
import type { OrderStatus } from "@/store/orders-store";

const statusTone: Record<OrderStatus, BadgeTone> = {
  "Menunggu Proses": "warning",
  "Sedang Dikirim": "info",
  Selesai: "success",
  Batal: "danger",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <Badge label={status} tone={statusTone[status] ?? "neutral"} />;
}
