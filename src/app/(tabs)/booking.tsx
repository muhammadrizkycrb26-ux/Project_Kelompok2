import { formatRupiah, services, type Service } from "@/data/services";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { addBookingOrder } from "../store/orders-store";

const COLORS = {
  background: "#F7F4EF",
  dark: "#242321",
  orange: "#C9824A",
  muted: "#77736E",
  white: "#FFFFFF",
  border: "#EAE4DC",
  softOrange: "#F5E7D9",
};

const TIME_SLOTS = [
  "09.00",
  "10.00",
  "11.00",
  "12.00",
  "13.00",
  "14.00",
  "15.00",
  "16.00",
  "17.00",
  "18.00",
  "19.00",
  "20.00",
];

type HairLength = "short" | "medium";

type DateOption = {
  key: string;
  day: string;
  date: string;
  month: string;
};

function getLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDateOptions(): DateOption[] {
  const days: DateOption[] = [];

  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + i);

    days.push({
      key: getLocalDateKey(date),
      day: i === 0 ? "Hari ini" : dayNames[date.getDay()],
      date: String(date.getDate()),
      month: monthNames[date.getMonth()],
    });
  }

  return days;
}

function formatLongDate(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function showMessage(title: string, message: string) {
  if (Platform.OS === "web") {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

export default function BookingScreen() {
  const dateOptions = useMemo(() => getDateOptions(), []);

  const [customerName, setCustomerName] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState(
    services[0]?.id ?? "",
  );
  const [selectedDate, setSelectedDate] = useState(
    dateOptions[0]?.key ?? getLocalDateKey(new Date()),
  );
  const [selectedTime, setSelectedTime] = useState("");
  const [hairLength, setHairLength] = useState<HairLength>("short");

  const selectedService: Service | undefined = services.find(
    (service) => service.id === selectedServiceId,
  );

  const hasVariablePrice = Boolean(selectedService?.prices);

  const selectedPrice = selectedService
    ? selectedService.prices
      ? selectedService.prices[hairLength]
      : (selectedService.price ?? 0)
    : 0;

  function selectService(service: Service) {
    setSelectedServiceId(service.id);

    if (service.prices) {
      setHairLength("short");
    }

    setSelectedTime("");
  }

  function handleBooking() {
    if (!customerName.trim()) {
      showMessage(
        "Nama belum diisi",
        "Masukkan nama pelanggan terlebih dahulu.",
      );
      return;
    }

    if (!selectedService) {
      showMessage(
        "Pilih layanan",
        "Silakan pilih layanan yang ingin kamu pesan.",
      );
      return;
    }

    if (!selectedDate || !selectedTime) {
      showMessage(
        "Jadwal belum lengkap",
        "Pilih tanggal dan jam booking terlebih dahulu.",
      );
      return;
    }

    const bookingData = {
      customerName: customerName.trim(),
      serviceName: selectedService.name,
      date: formatLongDate(selectedDate),
      time: selectedTime,
      price: selectedPrice,
    };

    const summary = [
      `Nama: ${bookingData.customerName}`,
      `Layanan: ${bookingData.serviceName}`,
      ...(selectedService.prices
        ? [`Panjang rambut: ${hairLength === "short" ? "Pendek" : "Medium"}`]
        : []),
      `Tanggal: ${bookingData.date}`,
      `Jam: ${bookingData.time}`,
      `Harga: ${formatRupiah(bookingData.price)}`,
    ].join("\n");

    function saveBooking() {
      try {
        const savedOrder = addBookingOrder(bookingData);

        if (!savedOrder) {
          throw new Error("Booking tidak berhasil dibuat.");
        }

        showMessage(
          "Booking berhasil",
          `ID Booking: ${savedOrder.id}\n\nBooking sudah ditambahkan ke halaman Pesanan.`,
        );
      } catch (error) {
        console.error("Gagal menyimpan booking:", error);

        showMessage(
          "Booking gagal",
          "Booking gagal disimpan. Silakan coba lagi.",
        );
      }
    }

    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        `Konfirmasi Booking\n\n${summary}\n\nApakah kamu ingin menyimpan booking ini?`,
      );

      if (confirmed) {
        saveBooking();
      }

      return;
    }

    Alert.alert(
      "Konfirmasi Booking",
      `${summary}\n\nBooking akan disimpan ke riwayat aplikasi.`,
      [
        {
          text: "Periksa lagi",
          style: "cancel",
        },
        {
          text: "Konfirmasi",
          onPress: saveBooking,
        },
      ],
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>BARBERSHOP EXPERIENCE</Text>
            <Text style={styles.headerTitle}>Booking Layanan</Text>
            <Text style={styles.headerSubtitle}>
              Atur jadwal, tampil lebih percaya diri.
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>✂</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroEyebrow}>YOUR NEXT LOOK STARTS HERE</Text>
          <Text style={styles.heroTitle}>
            Waktunya tampil{"\n"}lebih fresh.
          </Text>
          <Text style={styles.heroDescription}>
            Pilih treatment dan jadwalkan kunjunganmu dengan mudah.
          </Text>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>
              JAM OPERASIONAL 09.00–21.00
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>01</Text>
          </View>
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>Data pelanggan</Text>
            <Text style={styles.sectionSubtitle}>
              Isi nama untuk identitas booking.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Nama lengkap</Text>
          <TextInput
            style={styles.textInput}
            value={customerName}
            onChangeText={setCustomerName}
            placeholder="Masukkan nama kamu"
            placeholderTextColor="#A49D95"
            autoCapitalize="words"
            returnKeyType="done"
            maxLength={80}
          />
        </View>

        <View style={styles.sectionHeader}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>02</Text>
          </View>
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>Pilih layanan</Text>
            <Text style={styles.sectionSubtitle}>
              {services.length} layanan tersedia.
            </Text>
          </View>
        </View>

        <View style={styles.serviceList}>
          {services.map((service) => {
            const active = service.id === selectedServiceId;

            const priceLabel = service.prices
              ? `${formatRupiah(service.prices.short)} – ${formatRupiah(
                  service.prices.medium,
                )}`
              : formatRupiah(service.price ?? 0);

            return (
              <Pressable
                key={service.id}
                onPress={() => selectService(service)}
                style={[styles.serviceCard, active && styles.serviceCardActive]}
              >
                <View
                  style={[
                    styles.serviceIcon,
                    active && styles.serviceIconActive,
                  ]}
                >
                  <Text style={styles.serviceIconText}>
                    {service.category === "Haircut"
                      ? "✂"
                      : service.category === "Coloring"
                        ? "✦"
                        : service.category === "Styling"
                          ? "◇"
                          : "✧"}
                  </Text>
                </View>

                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceCategory}>
                    {service.category.toUpperCase()}
                  </Text>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceDescription}>
                    {service.description}
                  </Text>
                  <Text style={styles.servicePrice}>{priceLabel}</Text>
                </View>

                <View
                  style={[styles.radioOuter, active && styles.radioOuterActive]}
                >
                  {active ? <View style={styles.radioInner} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        {hasVariablePrice && selectedService?.prices ? (
          <View style={styles.card}>
            <Text style={styles.fieldLabel}>Panjang rambut</Text>
            <Text style={styles.fieldDescription}>
              Harga menyesuaikan pilihan panjang rambut.
            </Text>

            <View style={styles.optionRow}>
              <Pressable
                onPress={() => setHairLength("short")}
                style={[
                  styles.optionButton,
                  hairLength === "short" && styles.optionButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.optionTitle,
                    hairLength === "short" && styles.optionTitleActive,
                  ]}
                >
                  Pendek
                </Text>
                <Text
                  style={[
                    styles.optionPrice,
                    hairLength === "short" && styles.optionTitleActive,
                  ]}
                >
                  {formatRupiah(selectedService.prices.short)}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setHairLength("medium")}
                style={[
                  styles.optionButton,
                  hairLength === "medium" && styles.optionButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.optionTitle,
                    hairLength === "medium" && styles.optionTitleActive,
                  ]}
                >
                  Medium
                </Text>
                <Text
                  style={[
                    styles.optionPrice,
                    hairLength === "medium" && styles.optionTitleActive,
                  ]}
                >
                  {formatRupiah(selectedService.prices.medium)}
                </Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        <View style={styles.sectionHeader}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>03</Text>
          </View>
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>Pilih tanggal</Text>
            <Text style={styles.sectionSubtitle}>
              Pilih salah satu dari tujuh hari ke depan.
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateList}
        >
          {dateOptions.map((date) => {
            const active = date.key === selectedDate;

            return (
              <Pressable
                key={date.key}
                onPress={() => {
                  setSelectedDate(date.key);
                  setSelectedTime("");
                }}
                style={[styles.dateCard, active && styles.dateCardActive]}
              >
                <Text style={[styles.dateDay, active && styles.activeText]}>
                  {date.day}
                </Text>
                <Text style={[styles.dateNumber, active && styles.activeText]}>
                  {date.date}
                </Text>
                <Text style={[styles.dateMonth, active && styles.activeText]}>
                  {date.month}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>04</Text>
          </View>
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>Pilih jam</Text>
            <Text style={styles.sectionSubtitle}>
              Jam operasional 09.00–21.00.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.timeGrid}>
            {TIME_SLOTS.map((time) => {
              const active = time === selectedTime;

              return (
                <Pressable
                  key={time}
                  onPress={() => setSelectedTime(time)}
                  style={[styles.timeButton, active && styles.timeButtonActive]}
                >
                  <Text style={[styles.timeText, active && styles.activeText]}>
                    {time}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.fieldDescription}>
            Slot di atas merupakan pilihan waktu awal. Ketersediaan aktual perlu
            diperiksa melalui sistem booking.
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryEyebrow}>BOOKING SUMMARY</Text>
          <Text style={styles.summaryTitle}>Ringkasan booking</Text>

          <View style={styles.summaryLine}>
            <Text style={styles.summaryLabel}>Pelanggan</Text>
            <Text style={styles.summaryValue} numberOfLines={1}>
              {customerName.trim() || "Belum diisi"}
            </Text>
          </View>

          <View style={styles.summaryLine}>
            <Text style={styles.summaryLabel}>Layanan</Text>
            <Text style={styles.summaryValue} numberOfLines={2}>
              {selectedService?.name ?? "Belum dipilih"}
            </Text>
          </View>

          {selectedService?.prices ? (
            <View style={styles.summaryLine}>
              <Text style={styles.summaryLabel}>Panjang rambut</Text>
              <Text style={styles.summaryValue}>
                {hairLength === "short" ? "Pendek" : "Medium"}
              </Text>
            </View>
          ) : null}

          <View style={styles.summaryLine}>
            <Text style={styles.summaryLabel}>Tanggal</Text>
            <Text style={styles.summaryValue} numberOfLines={2}>
              {selectedDate ? formatLongDate(selectedDate) : "Belum dipilih"}
            </Text>
          </View>

          <View style={styles.summaryLine}>
            <Text style={styles.summaryLabel}>Jam</Text>
            <Text style={styles.summaryValue}>
              {selectedTime || "Belum dipilih"}
            </Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.totalRow}>
            <View>
              <Text style={styles.totalLabel}>Total harga</Text>
              <Text style={styles.totalNote}>
                Harga berdasarkan layanan terpilih
              </Text>
            </View>
            <Text style={styles.totalPrice}>
              {selectedService ? formatRupiah(selectedPrice) : "—"}
            </Text>
          </View>

          <Pressable
            onPress={handleBooking}
            style={({ pressed }) => [
              styles.bookingButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.bookingButtonText}>Konfirmasi Booking →</Text>
          </Pressable>

          <Text style={styles.disclaimer}>
            Booking disimpan ke riwayat lokal aplikasi. Data belum disimpan ke
            database permanen.
          </Text>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eyebrow: {
    fontSize: 9,
    letterSpacing: 2,
    color: COLORS.muted,
    fontWeight: "700",
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "900",
    color: COLORS.dark,
    marginTop: 6,
  },
  headerSubtitle: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 5,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.dark,
    alignItems: "center",
    justifyContent: "center",
  },
  headerIconText: {
    color: COLORS.orange,
    fontSize: 25,
  },
  hero: {
    marginHorizontal: 18,
    padding: 23,
    borderRadius: 23,
    backgroundColor: COLORS.dark,
  },
  heroEyebrow: {
    fontSize: 9,
    letterSpacing: 1.8,
    fontWeight: "800",
    color: "#DDA477",
  },
  heroTitle: {
    marginTop: 14,
    fontSize: 31,
    lineHeight: 37,
    fontWeight: "900",
    color: COLORS.white,
  },
  heroDescription: {
    fontSize: 12,
    lineHeight: 19,
    color: "#D1CDC7",
    marginTop: 10,
  },
  heroBadge: {
    alignSelf: "flex-start",
    marginTop: 18,
    backgroundColor: "#373431",
    borderRadius: 8,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  heroBadgeText: {
    color: "#F0C19B",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.7,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 27,
    marginBottom: 13,
  },
  stepNumber: {
    width: 37,
    height: 37,
    borderRadius: 12,
    backgroundColor: COLORS.softOrange,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    fontSize: 12,
    color: COLORS.orange,
    fontWeight: "900",
  },
  sectionHeading: {
    flex: 1,
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: COLORS.dark,
  },
  sectionSubtitle: {
    marginTop: 4,
    fontSize: 11,
    color: COLORS.muted,
  },
  card: {
    marginHorizontal: 18,
    padding: 16,
    borderRadius: 17,
    backgroundColor: COLORS.white,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.dark,
    marginBottom: 9,
  },
  textInput: {
    height: 49,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#FCFBF9",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 13,
    color: COLORS.dark,
  },
  fieldDescription: {
    fontSize: 10,
    color: COLORS.muted,
    lineHeight: 16,
    marginTop: 10,
  },
  serviceList: {
    paddingHorizontal: 18,
    gap: 10,
  },
  serviceCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: "transparent",
    borderRadius: 16,
    minHeight: 100,
  },
  serviceCardActive: {
    borderColor: COLORS.orange,
    backgroundColor: "#FFFCF8",
  },
  serviceIcon: {
    width: 55,
    height: 55,
    borderRadius: 13,
    backgroundColor: COLORS.softOrange,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceIconActive: {
    backgroundColor: "#F1D7C0",
  },
  serviceIconText: {
    fontSize: 25,
    color: COLORS.orange,
  },
  serviceInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  serviceCategory: {
    color: COLORS.orange,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1,
  },
  serviceName: {
    color: COLORS.dark,
    fontSize: 13,
    fontWeight: "800",
    marginTop: 4,
  },
  serviceDescription: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 4,
  },
  servicePrice: {
    color: COLORS.orange,
    fontSize: 11,
    fontWeight: "900",
    marginTop: 6,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#D9D1C8",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterActive: {
    borderColor: COLORS.orange,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.orange,
  },
  optionRow: {
    flexDirection: "row",
    gap: 10,
  },
  optionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 13,
    padding: 13,
    backgroundColor: COLORS.white,
  },
  optionButtonActive: {
    borderColor: COLORS.orange,
    backgroundColor: COLORS.softOrange,
  },
  optionTitle: {
    color: COLORS.dark,
    fontSize: 12,
    fontWeight: "800",
  },
  optionTitleActive: {
    color: COLORS.orange,
  },
  optionPrice: {
    color: COLORS.orange,
    fontSize: 11,
    fontWeight: "800",
    marginTop: 6,
  },
  dateList: {
    paddingHorizontal: 18,
    gap: 9,
  },
  dateCard: {
    width: 69,
    height: 88,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  dateCardActive: {
    backgroundColor: COLORS.orange,
    borderColor: COLORS.orange,
  },
  dateDay: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: "700",
  },
  dateNumber: {
    color: COLORS.dark,
    fontSize: 23,
    fontWeight: "900",
    marginTop: 4,
  },
  dateMonth: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 2,
  },
  activeText: {
    color: COLORS.white,
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
  },
  timeButton: {
    width: "22%",
    minHeight: 42,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },
  timeButtonActive: {
    backgroundColor: COLORS.orange,
    borderColor: COLORS.orange,
  },
  timeText: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.dark,
  },
  summaryCard: {
    marginHorizontal: 18,
    marginTop: 25,
    borderRadius: 21,
    padding: 19,
    backgroundColor: COLORS.dark,
  },
  summaryEyebrow: {
    color: "#DDA477",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.8,
  },
  summaryTitle: {
    color: COLORS.white,
    fontSize: 21,
    fontWeight: "900",
    marginTop: 7,
    marginBottom: 15,
  },
  summaryLine: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 15,
  },
  summaryLabel: {
    flex: 0.8,
    color: "#C5BEB6",
    fontSize: 11,
  },
  summaryValue: {
    flex: 1.2,
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "700",
    textAlign: "right",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#494541",
    marginVertical: 17,
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  totalLabel: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "800",
  },
  totalNote: {
    color: "#BEB7AF",
    fontSize: 9,
    marginTop: 5,
  },
  totalPrice: {
    color: "#F0B47F",
    fontSize: 19,
    fontWeight: "900",
  },
  bookingButton: {
    backgroundColor: COLORS.orange,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 51,
    marginTop: 21,
  },
  bookingButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "900",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  disclaimer: {
    textAlign: "center",
    color: "#C5BEB6",
    fontSize: 9,
    lineHeight: 15,
    marginTop: 12,
  },
  bottomSpace: {
    height: 24,
  },
});
