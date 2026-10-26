import { StyleSheet } from "react-native";

import { Badge, Card, IconBox } from "@/components/atoms";
import { FormField, PageHeader, SectionHeader } from "@/components/molecules";
import {
  BookingSummary,
  DatePicker,
  HairLengthPicker,
  HeroBanner,
  ServicePicker,
  TimeSlotPicker,
} from "@/components/organisms";
import { ScreenTemplate } from "@/components/templates";
import { HAIR_LENGTH_LABEL, TIME_SLOTS } from "@/data/booking";
import { services } from "@/data/services";
import { useBookingForm } from "@/hooks/use-booking-form";
import { formatLongDate } from "@/utils/booking-date";

export default function BookingPage() {
  const form = useBookingForm();
  const prices = form.selectedService?.prices;

  return (
    <ScreenTemplate keyboardShouldPersistTaps="handled">
      <PageHeader
        eyebrow="BARBERSHOP EXPERIENCE"
        title="Booking Layanan"
        titleSize={25}
        subtitle="Atur jadwal, tampil lebih percaya diri."
        trailing={<IconBox symbol="✂" tone="dark" size={48} radius={16} fontSize={25} />}
      />

      <HeroBanner
        eyebrow="YOUR NEXT LOOK STARTS HERE"
        title={"Waktunya tampil\nlebih fresh."}
        description="Pilih treatment dan jadwalkan kunjunganmu dengan mudah."
      >
        <Badge label="JAM OPERASIONAL 09.00–21.00" tone="dark" style={styles.heroBadge} />
      </HeroBanner>

      <SectionHeader step="01" title="Data pelanggan" subtitle="Isi nama untuk identitas booking." style={styles.section} />
      <Card style={styles.card}>
        <FormField
          label="Nama lengkap"
          value={form.customerName}
          onChangeText={form.setCustomerName}
          placeholder="Masukkan nama kamu"
          autoCapitalize="words"
          returnKeyType="done"
          maxLength={80}
        />
      </Card>

      <SectionHeader step="02" title="Pilih layanan" subtitle={`${services.length} layanan tersedia.`} style={styles.section} />
      <ServicePicker services={services} selectedId={form.selectedServiceId} onSelect={form.selectService} />

      {prices ? (
        <HairLengthPicker prices={prices} value={form.hairLength} onChange={form.setHairLength} />
      ) : null}

      <SectionHeader step="03" title="Pilih tanggal" subtitle="Pilih salah satu dari tujuh hari ke depan." style={styles.section} />
      <DatePicker options={form.dateOptions} selectedKey={form.selectedDate} onSelect={form.selectDate} />

      <SectionHeader step="04" title="Pilih jam" subtitle="Jam operasional 09.00–21.00." style={styles.section} />
      <TimeSlotPicker slots={TIME_SLOTS} selected={form.selectedTime} onSelect={form.setSelectedTime} />

      <BookingSummary
        customerName={form.customerName}
        serviceName={form.selectedService?.name}
        hairLengthLabel={prices ? HAIR_LENGTH_LABEL[form.hairLength] : undefined}
        date={form.selectedDate ? formatLongDate(form.selectedDate) : undefined}
        time={form.selectedTime}
        price={form.selectedService ? form.selectedPrice : undefined}
        onSubmit={form.submit}
      />
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  heroBadge: { marginTop: 18 },
  section: { marginHorizontal: 20, marginTop: 27, marginBottom: 13 },
  card: { marginHorizontal: 18 },
});
