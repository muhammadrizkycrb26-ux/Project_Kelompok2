import { StyleSheet, View } from "react-native";

import { AppText, Button, Divider } from "@/components/atoms";
import { KeyValueRow } from "@/components/molecules";
import { Palette } from "@/constants/palette";
import { formatRupiah } from "@/utils/format";

type BookingSummaryProps = {
  customerName: string;
  serviceName?: string;
  hairLengthLabel?: string;
  date?: string;
  time: string;
  price?: number;
  onSubmit: () => void;
};

export function BookingSummary({
  customerName,
  serviceName,
  hairLengthLabel,
  date,
  time,
  price,
  onSubmit,
}: BookingSummaryProps) {
  return (
    <View style={styles.card}>
      <AppText variant="eyebrow" color={Palette.accentOnDark} style={styles.eyebrow}>
        BOOKING SUMMARY
      </AppText>
      <AppText variant="sectionTitle" color={Palette.surface} style={styles.title}>
        Ringkasan booking
      </AppText>

      <KeyValueRow tone="dark" label="Pelanggan" value={customerName.trim() || "Belum diisi"} valueLines={1} />
      <KeyValueRow tone="dark" label="Layanan" value={serviceName ?? "Belum dipilih"} valueLines={2} />
      {hairLengthLabel ? (
        <KeyValueRow tone="dark" label="Panjang rambut" value={hairLengthLabel} />
      ) : null}
      <KeyValueRow tone="dark" label="Tanggal" value={date ?? "Belum dipilih"} valueLines={2} />
      <KeyValueRow tone="dark" label="Jam" value={time || "Belum dipilih"} />

      <Divider color={Palette.darkBorder} style={styles.divider} />

      <View style={styles.totalRow}>
        <View>
          <AppText variant="cardTitle" color={Palette.surface}>
            Total harga
          </AppText>
          <AppText variant="micro" color="#BEB7AF" style={styles.totalNote}>
            Harga berdasarkan layanan terpilih
          </AppText>
        </View>
        <AppText variant="sectionTitle" color={Palette.accentLight} style={styles.totalPrice}>
          {price === undefined ? "—" : formatRupiah(price)}
        </AppText>
      </View>

      <Button label="Konfirmasi Booking →" size="lg" fullWidth onPress={onSubmit} style={styles.submit} />

      <AppText variant="micro" color={Palette.mutedOnDark} style={styles.disclaimer}>
        Booking disimpan ke riwayat lokal aplikasi. Data belum disimpan ke database permanen.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 18,
    marginTop: 25,
    borderRadius: 21,
    padding: 19,
    backgroundColor: Palette.dark,
  },
  eyebrow: { fontSize: 9, letterSpacing: 1.8 },
  title: { fontSize: 21, marginTop: 7, marginBottom: 3 },
  divider: { marginVertical: 17 },
  totalRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  totalNote: { fontSize: 9, marginTop: 5 },
  totalPrice: { fontSize: 19 },
  submit: { marginTop: 21 },
  disclaimer: { textAlign: "center", fontSize: 9, lineHeight: 15, marginTop: 12 },
});
