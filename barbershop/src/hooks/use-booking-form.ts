import { useMemo, useState } from "react";
import { Alert, Platform } from "react-native";

import { HAIR_LENGTH_LABEL, type HairLength } from "@/data/booking";
import { services, type Service } from "@/data/services";
import { addBookingOrder } from "@/store/orders-store";
import { showMessage } from "@/utils/alert";
import { formatLongDate, getDateOptions, getLocalDateKey } from "@/utils/booking-date";
import { formatRupiah } from "@/utils/format";

export function useBookingForm() {
  const dateOptions = useMemo(() => getDateOptions(), []);

  const [customerName, setCustomerName] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id ?? "");
  const [selectedDate, setSelectedDate] = useState(
    dateOptions[0]?.key ?? getLocalDateKey(new Date()),
  );
  const [selectedTime, setSelectedTime] = useState("");
  const [hairLength, setHairLength] = useState<HairLength>("short");

  const selectedService: Service | undefined = services.find((s) => s.id === selectedServiceId);

  const selectedPrice = selectedService
    ? selectedService.prices
      ? selectedService.prices[hairLength]
      : (selectedService.price ?? 0)
    : 0;

  function selectService(service: Service) {
    setSelectedServiceId(service.id);
    if (service.prices) setHairLength("short");
    setSelectedTime("");
  }

  function selectDate(key: string) {
    setSelectedDate(key);
    setSelectedTime("");
  }

  function submit() {
    if (!customerName.trim()) {
      showMessage("Nama belum diisi", "Masukkan nama pelanggan terlebih dahulu.");
      return;
    }

    if (!selectedService) {
      showMessage("Pilih layanan", "Silakan pilih layanan yang ingin kamu pesan.");
      return;
    }

    if (!selectedDate || !selectedTime) {
      showMessage("Jadwal belum lengkap", "Pilih tanggal dan jam booking terlebih dahulu.");
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
      ...(selectedService.prices ? [`Panjang rambut: ${HAIR_LENGTH_LABEL[hairLength]}`] : []),
      `Tanggal: ${bookingData.date}`,
      `Jam: ${bookingData.time}`,
      `Harga: ${formatRupiah(bookingData.price)}`,
    ].join("\n");

    function saveBooking() {
      try {
        const savedOrder = addBookingOrder(bookingData);

        showMessage(
          "Booking berhasil",
          `ID Booking: ${savedOrder.id}\n\nBooking sudah ditambahkan ke halaman Pesanan.`,
        );
      } catch (error) {
        console.error("Gagal menyimpan booking:", error);
        showMessage("Booking gagal", "Booking gagal disimpan. Silakan coba lagi.");
      }
    }

    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        `Konfirmasi Booking\n\n${summary}\n\nApakah kamu ingin menyimpan booking ini?`,
      );
      if (confirmed) saveBooking();
      return;
    }

    Alert.alert("Konfirmasi Booking", `${summary}\n\nBooking akan disimpan ke riwayat aplikasi.`, [
      { text: "Periksa lagi", style: "cancel" },
      { text: "Konfirmasi", onPress: saveBooking },
    ]);
  }

  return {
    dateOptions,
    customerName,
    setCustomerName,
    selectedService,
    selectedServiceId,
    selectService,
    hairLength,
    setHairLength,
    selectedDate,
    selectDate,
    selectedTime,
    setSelectedTime,
    selectedPrice,
    submit,
  };
}
