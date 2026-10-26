import { StyleSheet, View } from "react-native";

import { AppText, Divider, IconBox } from "@/components/atoms";
import { SectionHeader } from "@/components/molecules";
import { Palette } from "@/constants/palette";
import type { BookingOrder } from "@/store/orders-store";
import { formatRupiah } from "@/utils/format";

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <AppText variant="micro" color="#AAA199" style={styles.metaLabel}>
        {label}
      </AppText>
      <AppText variant="caption" color={Palette.surface} style={styles.metaValue}>
        {value}
      </AppText>
    </View>
  );
}

export function LatestBookingCard({ booking }: { booking: BookingOrder }) {
  return (
    <View style={styles.section}>
      <SectionHeader
        title="Booking Terbaru"
        trailing={<AppText variant="caption">Booking kamu</AppText>}
        style={styles.header}
      />

      <View style={styles.card}>
        <View style={styles.top}>
          <IconBox symbol="✂" tone="raised" radius={14} />
          <View style={styles.info}>
            <AppText variant="cardTitle" color={Palette.surface} style={styles.service}>
              {booking.serviceName}
            </AppText>
            <AppText variant="caption" color="#C7C0B8" style={styles.customer}>
              {booking.customerName}
            </AppText>
          </View>
          <AppText variant="cardTitle" color="#E9AE7C" style={styles.price}>
            {formatRupiah(booking.price)}
          </AppText>
        </View>

        <Divider color="#48433E" style={styles.divider} />

        <View style={styles.bottom}>
          <MetaCell label="TANGGAL" value={booking.date} />
          <MetaCell label="JAM" value={booking.time} />
          <MetaCell label="STATUS" value={booking.status} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 28 },
  header: { marginBottom: 13 },
  card: { backgroundColor: Palette.dark, borderRadius: 19, padding: 16 },
  top: { flexDirection: "row", alignItems: "center" },
  info: { flex: 1, marginLeft: 11 },
  service: { fontSize: 14 },
  customer: { marginTop: 4 },
  price: { marginLeft: 6 },
  divider: { marginVertical: 16 },
  bottom: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  metaLabel: { fontSize: 9, fontWeight: "700", letterSpacing: 1 },
  metaValue: { fontWeight: "700", marginTop: 6 },
});
