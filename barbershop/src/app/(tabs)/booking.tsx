import styles from "../../styles/screens/booking.styles";
import { formatRupiah, services, type Service } from "@/data/services";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { addBookingOrder, isBookingSlotAvailable, useOrders } from "../store/orders-store";

const COLORS = {
  background: "#F7F4EF",
  dark: "#242321",
  orange: "#C9824A",
  muted: "#77736E",
  white: "#FFFFFF",
  border: "#EAE4DC",
  softOrange: "#F5E7D9",
};

const OPENING_MINUTES = 9 * 60;
const CLOSING_MINUTES = 21 * 60;
const SLOT_INTERVAL_MINUTES = 30;
const ESTIMATED_SERVICE_MINUTES = 60;

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

function formatTime(minutes: number): string {
  const hour = String(Math.floor(minutes / 60)).padStart(2, "0");
  const minute = String(minutes % 60).padStart(2, "0");
  return `${hour}.${minute}`;
}

function getAvailableSlots(dateKey: string, now: number): string[] {
  const todayKey = getLocalDateKey(new Date(now));
  const currentDate = new Date(now);
  const currentMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();
  const earliestTodaySlot = Math.ceil(
    (currentMinutes + SLOT_INTERVAL_MINUTES) / SLOT_INTERVAL_MINUTES,
  ) * SLOT_INTERVAL_MINUTES;

  const firstSlot = dateKey === todayKey
    ? Math.max(OPENING_MINUTES, earliestTodaySlot)
    : OPENING_MINUTES;
  const slots: string[] = [];

  for (
    let start = firstSlot;
    start + ESTIMATED_SERVICE_MINUTES <= CLOSING_MINUTES;
    start += SLOT_INTERVAL_MINUTES
  ) {
    slots.push(formatTime(start));
  }

  return slots;
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
  const orders = useOrders();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(timer);
  }, []);

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

  const availableSlots = useMemo(
    () => getAvailableSlots(selectedDate, now).filter((time) =>
      isBookingSlotAvailable(
        formatLongDate(selectedDate),
        time,
        ESTIMATED_SERVICE_MINUTES,
      ),
    ),
    [selectedDate, now, orders],
  );

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

    if (
      !availableSlots.includes(selectedTime) ||
      !isBookingSlotAvailable(
        formatLongDate(selectedDate),
        selectedTime,
        ESTIMATED_SERVICE_MINUTES,
      )
    ) {
      setSelectedTime("");
      showMessage(
        "Jadwal sudah tidak tersedia",
        "Silakan pilih waktu lain. Pilihan jadwal diperbarui mengikuti waktu sekarang dan booking yang sudah tercatat.",
      );
      return;
    }

    const bookingData = {
      customerName: customerName.trim(),
      serviceName: selectedService.name,
      date: formatLongDate(selectedDate),
      time: selectedTime,
      durationMinutes: ESTIMATED_SERVICE_MINUTES,
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
          setSelectedTime("");
          showMessage(
            "Jadwal baru saja diambil",
            "Silakan pilih slot waktu lain yang masih tersedia.",
          );
          return;
        }

        setSelectedTime("");

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
            {availableSlots.map((time) => {
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

          {availableSlots.length === 0 ? (
            <Text style={styles.fieldDescription}>
              Tidak ada slot tersisa untuk tanggal ini. Silakan pilih tanggal lain.
            </Text>
          ) : null}

          <Text style={styles.fieldDescription}>
            Slot diperbarui mengikuti waktu sekarang dan booking di aplikasi. Setiap layanan memakai estimasi durasi {ESTIMATED_SERVICE_MINUTES} menit untuk simulasi.
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
            Ketersediaan ini hanya tersinkron di aplikasi yang sedang terbuka. Belum tersambung ke database atau perangkat lain.
          </Text>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}


