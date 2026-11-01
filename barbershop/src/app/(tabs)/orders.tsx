import styles from "../../styles/screens/orders.styles";
import { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  cancelOrder,
  type Order,
  type OrderStatus,
  useOrders,
} from "../store/orders-store";

const C = {
  bg: "#F7F4EF",
  dark: "#242321",
  orange: "#C9824A",
  muted: "#77736E",
  white: "#FFFFFF",
  border: "#EAE4DC",
  soft: "#F5E7D9",
};

type FilterType = "Semua" | "Booking" | "Produk";

function formatRupiah(value: number) {
  return `Rp${value.toLocaleString("id-ID")}`;
}

function formatDate(value: string) {
  const date = new Date(value);

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusColor(status: OrderStatus) {
  switch (status) {
    case "Menunggu Proses":
      return {
        backgroundColor: "#FFF0D8",
        color: "#9A641D",
      };
    case "Sedang Dikirim":
      return {
        backgroundColor: "#DDEBFF",
        color: "#285EA8",
      };
    case "Selesai":
      return {
        backgroundColor: "#DDF4E5",
        color: "#267446",
      };
    case "Batal":
      return {
        backgroundColor: "#FBE1DF",
        color: "#B23B35",
      };
    default:
      return {
        backgroundColor: C.border,
        color: C.muted,
      };
  }
}

export default function OrdersScreen() {
  const orders = useOrders();

  const [selectedFilter, setSelectedFilter] = useState<FilterType>("Semua");

  const sortedOrders = useMemo(
    () =>
      [...orders].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [orders],
  );

  const bookingOrders = sortedOrders.filter(
    (order) => order.type === "booking",
  );

  const productOrders = sortedOrders.filter(
    (order) => order.type === "product",
  );

  const filteredOrders = sortedOrders.filter((order) => {
    if (selectedFilter === "Booking" && order.type !== "booking") {
      return false;
    }

    if (selectedFilter === "Produk" && order.type !== "product") {
      return false;
    }

    return true;
  });

  const completedCount = orders.filter(
    (order) => order.status === "Selesai",
  ).length;

  const waitingCount = orders.filter(
    (order) => order.status === "Menunggu Proses",
  ).length;

  const latestBooking = bookingOrders[0];

  function handleCancel(order: Order) {
    if (order.status !== "Menunggu Proses") {
      Alert.alert(
        "Pesanan tidak dapat dibatalkan",
        "Pesanan hanya dapat dibatalkan saat masih menunggu proses.",
      );
      return;
    }

    Alert.alert("Batalkan pesanan?", "Yakin ingin membatalkan pesanan ini?", [
      {
        text: "Tidak",
        style: "cancel",
      },
      {
        text: "Ya, batalkan",
        style: "destructive",
        onPress: () => {
          cancelOrder(order.id);
          Alert.alert(
            "Pesanan dibatalkan",
            "Status pesanan berhasil diperbarui.",
          );
        },
      },
    ]);
  }

  function renderOrder({ item }: { item: Order }) {
    const statusStyle = getStatusColor(item.status);

    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View style={styles.orderTypeContainer}>
            <View style={styles.orderIcon}>
              <Text style={styles.orderIconText}>
                {item.type === "booking" ? "✂" : "🛍"}
              </Text>
            </View>

            <View style={styles.orderTitleContainer}>
              <Text style={styles.orderTitle}>
                {item.type === "booking"
                  ? "Booking Barbershop"
                  : "Belanja Produk"}
              </Text>

              <Text style={styles.orderId}>{item.id}</Text>
            </View>
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusStyle.backgroundColor },
            ]}
          >
            <Text style={[styles.statusText, { color: statusStyle.color }]}>
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {item.type === "booking" ? (
          <View style={styles.detailContainer}>
            <DetailRow label="Nama pelanggan" value={item.customerName} />
            <DetailRow label="Layanan" value={item.serviceName} />
            <DetailRow label="Tanggal" value={item.date} />
            <DetailRow label="Jam" value={item.time} />
          </View>
        ) : (
          <View style={styles.detailContainer}>
            {item.items.map((product, index) => (
              <View
                key={`${product.productId}-${index}`}
                style={styles.productRow}
              >
                <View style={styles.productTextContainer}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productQuantity}>
                    {product.quantity} × {formatRupiah(product.price)}
                  </Text>
                </View>

                <Text style={styles.productSubtotal}>
                  {formatRupiah(product.price * product.quantity)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {item.type === "product" && (
          <View style={styles.detailContainer}>
            <DetailRow label="Metode pembayaran" value={item.paymentMethod} />
          </View>
        )}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>
            {item.type === "booking" ? "Total pembayaran" : "Total belanja"}
          </Text>

          <Text style={styles.totalPrice}>
            {formatRupiah(item.type === "booking" ? item.price : item.total)}
          </Text>
        </View>

        <View style={styles.orderFooter}>
          <Text style={styles.orderDate}>
            Dibuat {formatDate(item.createdAt)}
          </Text>

          {item.status === "Menunggu Proses" && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancel(item)}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>Batalkan</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>BARBERSHOP</Text>
          <Text style={styles.headerTitle}>Pesanan Saya</Text>
          <Text style={styles.headerSubtitle}>
            Pantau booking dan belanja kamu.
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Text style={styles.headerIconText}>✂</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{orders.length}</Text>
            <Text style={styles.statLabel}>Total Pesanan</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{waitingCount}</Text>
            <Text style={styles.statLabel}>Menunggu</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{completedCount}</Text>
            <Text style={styles.statLabel}>Selesai</Text>
          </View>
        </View>

        {latestBooking && (
          <View style={styles.latestSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Booking Terbaru</Text>
              <Text style={styles.sectionCaption}>Booking kamu</Text>
            </View>

            <View style={styles.bookingCard}>
              <View style={styles.bookingTop}>
                <View style={styles.bookingIcon}>
                  <Text style={styles.bookingIconText}>✂</Text>
                </View>

                <View style={styles.bookingInfo}>
                  <Text style={styles.bookingService}>
                    {latestBooking.serviceName}
                  </Text>
                  <Text style={styles.bookingCustomer}>
                    {latestBooking.customerName}
                  </Text>
                </View>

                <Text style={styles.bookingPrice}>
                  {formatRupiah(latestBooking.price)}
                </Text>
              </View>

              <View style={styles.bookingDivider} />

              <View style={styles.bookingBottom}>
                <View>
                  <Text style={styles.bookingMetaLabel}>TANGGAL</Text>
                  <Text style={styles.bookingMetaValue}>
                    {latestBooking.date}
                  </Text>
                </View>

                <View>
                  <Text style={styles.bookingMetaLabel}>JAM</Text>
                  <Text style={styles.bookingMetaValue}>
                    {latestBooking.time}
                  </Text>
                </View>

                <View>
                  <Text style={styles.bookingMetaLabel}>STATUS</Text>
                  <Text style={styles.bookingMetaValue}>
                    {latestBooking.status}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        <View style={styles.historySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Riwayat Pesanan</Text>
            <Text style={styles.sectionCaption}>
              {filteredOrders.length} pesanan
            </Text>
          </View>

          <View style={styles.filterContainer}>
            {(["Semua", "Booking", "Produk"] as FilterType[]).map((filter) => {
              const active = selectedFilter === filter;

              return (
                <TouchableOpacity
                  key={filter}
                  onPress={() => setSelectedFilter(filter)}
                  style={[
                    styles.filterButton,
                    active && styles.filterButtonActive,
                  ]}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.filterText,
                      active && styles.filterTextActive,
                    ]}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {filteredOrders.length > 0 ? (
            <FlatList
              data={filteredOrders}
              renderItem={renderOrder}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.orderList}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIcon}>
                <Text style={styles.emptyIconText}>📋</Text>
              </View>

              <Text style={styles.emptyTitle}>Belum Ada Pesanan</Text>

              <Text style={styles.emptyDescription}>
                {selectedFilter === "Booking"
                  ? "Booking layanan yang kamu buat akan muncul di sini."
                  : selectedFilter === "Produk"
                    ? "Pesanan produk yang kamu checkout akan muncul di sini."
                    : "Booking layanan dan pembelian produk kamu akan muncul di sini."}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.footerNote}>
          Status pesanan ditampilkan berdasarkan data aplikasi.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}


