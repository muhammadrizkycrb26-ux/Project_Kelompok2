import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState, type ReactNode } from "react";
import { Alert, Platform, Pressable, ScrollView, View } from "react-native";

import { ProductFormModal, ServiceFormModal } from "@/components/admin-forms";
import AppText from "@/components/app-text";
import { signOutLocalAccount } from "@/data/auth";
import {
  addProduct,
  addService,
  deleteProduct,
  deleteService,
  updateProduct,
  updateService,
  useProducts,
  useServices,
  type ProductInput,
  type ServiceInput,
} from "@/data/catalog-store";
import { formatRupiah, type Product } from "@/data/products";
import { getServicePriceLabel, type Service } from "@/data/services";
import styles from "../styles/screens/admin.styles";
import {
  updateOrderStatus,
  useOrders,
  type Order,
  type OrderStatus,
} from "./store/orders-store";

type AdminTab = "Ringkasan" | "Pesanan" | "Produk" | "Layanan";
type StatusFilter = "Semua" | OrderStatus;

const TABS: AdminTab[] = ["Ringkasan", "Pesanan", "Produk", "Layanan"];
const STATUS_FILTERS: StatusFilter[] = [
  "Semua",
  "Menunggu Proses",
  "Sedang Dikirim",
  "Selesai",
  "Batal",
];
const LOW_STOCK_LIMIT = 10;

function getStatusColor(status: OrderStatus) {
  switch (status) {
    case "Menunggu Proses":
      return { backgroundColor: "#FFF0D8", color: "#9A641D" };
    case "Sedang Dikirim":
      return { backgroundColor: "#DDEBFF", color: "#285EA8" };
    case "Selesai":
      return { backgroundColor: "#DDF4E5", color: "#267446" };
    case "Batal":
      return { backgroundColor: "#FBE1DF", color: "#B23B35" };
  }
}

function getOrderAmount(order: Order) {
  return order.type === "booking" ? order.price : order.total;
}

function getNextAction(order: Order): { label: string; status: OrderStatus } | null {
  if (order.status === "Menunggu Proses") {
    return order.type === "product"
      ? { label: "Kirim Pesanan", status: "Sedang Dikirim" }
      : { label: "Tandai Selesai", status: "Selesai" };
  }
  if (order.status === "Sedang Dikirim") {
    return { label: "Tandai Selesai", status: "Selesai" };
  }
  return null;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Alert.alert dengan tombol tidak jalan di web, jadi dibedakan
function confirmAction(title: string, message: string, onConfirm: () => void) {
  if (Platform.OS === "web") {
    if (window.confirm(`${title}\n\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: "Tidak", style: "cancel" },
    { text: "Ya", style: "destructive", onPress: onConfirm },
  ]);
}

export default function AdminDashboardScreen() {
  const orders = useOrders();
  const products = useProducts();
  const services = useServices();

  const [tab, setTab] = useState<AdminTab>("Ringkasan");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Semua");

  // state form: open + item yang sedang diedit (null = tambah baru)
  const [productForm, setProductForm] = useState<{ open: boolean; editing: Product | null }>({
    open: false,
    editing: null,
  });
  const [serviceForm, setServiceForm] = useState<{ open: boolean; editing: Service | null }>({
    open: false,
    editing: null,
  });

  const stats = useMemo(() => {
    const revenue = orders
      .filter((o) => o.status === "Selesai")
      .reduce((sum, o) => sum + getOrderAmount(o), 0);
    return {
      revenue,
      bookings: orders.filter((o) => o.type === "booking").length,
      productOrders: orders.filter((o) => o.type === "product").length,
      pending: orders.filter((o) => o.status === "Menunggu Proses").length,
    };
  }, [orders]);

  const lowStockProducts = useMemo(
    () => products.filter((p) => p.stock <= LOW_STOCK_LIMIT).sort((a, b) => a.stock - b.stock),
    [products],
  );

  const pendingOrders = useMemo(
    () => orders.filter((o) => o.status === "Menunggu Proses"),
    [orders],
  );

  const filteredOrders = useMemo(
    () => (statusFilter === "Semua" ? orders : orders.filter((o) => o.status === statusFilter)),
    [orders, statusFilter],
  );

  function handleLogout() {
    signOutLocalAccount();
    router.replace("/login");
  }

  function handleCancel(order: Order) {
    confirmAction("Batalkan pesanan?", `Pesanan ${order.id} akan dibatalkan.`, () =>
      updateOrderStatus(order.id, "Batal"),
    );
  }

  /* ---- CRUD Produk ---- */
  function handleSaveProduct(input: ProductInput) {
    if (productForm.editing) updateProduct(productForm.editing.id, input);
    else addProduct(input);
    setProductForm({ open: false, editing: null });
  }

  function handleDeleteProduct(product: Product) {
    confirmAction("Hapus produk?", `${product.name} akan dihapus dari katalog.`, () =>
      deleteProduct(product.id),
    );
  }

  /* ---- CRUD Layanan ---- */
  function handleSaveService(input: ServiceInput) {
    if (serviceForm.editing) updateService(serviceForm.editing.id, input);
    else addService(input);
    setServiceForm({ open: false, editing: null });
  }

  function handleDeleteService(service: Service) {
    confirmAction("Hapus layanan?", `${service.name} akan dihapus dari daftar layanan.`, () =>
      deleteService(service.id),
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <AppText style={styles.eyebrow}>CORTE BARBERSHOP</AppText>
            <AppText style={styles.headerTitle}>Dashboard Admin</AppText>
            <AppText style={styles.headerSubtitle}>
              Kelola pesanan, produk, dan layanan.
            </AppText>
          </View>
          <Pressable style={styles.logoutButton} onPress={handleLogout} accessibilityRole="button">
            <AppText style={styles.logoutText}>Keluar</AppText>
          </Pressable>
        </View>

        {/* Tab switcher */}
        <View style={styles.tabBar}>
          {TABS.map((item) => (
            <Pressable
              key={item}
              style={[styles.tabButton, tab === item && styles.tabButtonActive]}
              onPress={() => setTab(item)}
            >
              <AppText style={[styles.tabText, tab === item && styles.tabTextActive]}>
                {item}
              </AppText>
            </Pressable>
          ))}
        </View>

        {/* ========== RINGKASAN ========== */}
        {tab === "Ringkasan" && (
          <>
            <View style={styles.statsGrid}>
              <StatCard dark icon="$" value={formatRupiah(stats.revenue)} label="Pendapatan (selesai)" />
              <StatCard icon="◷" value={String(stats.bookings)} label="Total booking" />
              <StatCard icon="◇" value={String(stats.productOrders)} label="Pesanan produk" />
              <StatCard icon="!" value={String(stats.pending)} label="Menunggu proses" />
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <AppText style={styles.sectionTitle}>Perlu Diproses</AppText>
                <Pressable onPress={() => setTab("Pesanan")}>
                  <AppText style={styles.sectionCaption}>Lihat semua →</AppText>
                </Pressable>
              </View>
              {pendingOrders.length === 0 ? (
                <EmptyState title="Semua beres" description="Tidak ada pesanan yang menunggu proses." />
              ) : (
                <View style={styles.orderList}>
                  {pendingOrders.slice(0, 3).map((order) => (
                    <OrderCard key={order.id} order={order} onCancel={handleCancel} />
                  ))}
                </View>
              )}
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <AppText style={styles.sectionTitle}>Stok Menipis</AppText>
                <AppText style={styles.sectionCaption}>≤ {LOW_STOCK_LIMIT} item</AppText>
              </View>
              {lowStockProducts.length === 0 ? (
                <EmptyState title="Stok aman" description="Semua produk masih tersedia cukup." />
              ) : (
                lowStockProducts.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    onEdit={() => setProductForm({ open: true, editing: product })}
                  />
                ))
              )}
            </View>
          </>
        )}

        {/* ========== PESANAN ========== */}
        {tab === "Pesanan" && (
          <View style={styles.section}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipList}
            >
              {STATUS_FILTERS.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setStatusFilter(item)}
                  style={[styles.chip, statusFilter === item && styles.chipActive]}
                >
                  <AppText style={[styles.chipText, statusFilter === item && styles.chipTextActive]}>
                    {item}
                  </AppText>
                </Pressable>
              ))}
            </ScrollView>

            {filteredOrders.length === 0 ? (
              <EmptyState
                title="Belum ada pesanan"
                description="Pesanan dari pelanggan akan muncul di sini."
              />
            ) : (
              <View style={styles.orderList}>
                {filteredOrders.map((order) => (
                  <OrderCard key={order.id} order={order} onCancel={handleCancel} />
                ))}
              </View>
            )}
          </View>
        )}

        {/* ========== PRODUK (CRUD) ========== */}
        {tab === "Produk" && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <AppText style={styles.sectionTitle}>Daftar Produk</AppText>
                <AppText style={styles.orderSub}>{products.length} produk</AppText>
              </View>
              <Pressable
                style={styles.primaryButton}
                onPress={() => setProductForm({ open: true, editing: null })}
              >
                <AppText style={styles.primaryButtonText}>+ Tambah Produk</AppText>
              </Pressable>
            </View>

            {products.length === 0 ? (
              <EmptyState title="Belum ada produk" description="Tekan “Tambah Produk” untuk menambah produk pertama." />
            ) : (
              products.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onEdit={() => setProductForm({ open: true, editing: product })}
                  onDelete={() => handleDeleteProduct(product)}
                />
              ))
            )}
          </View>
        )}

        {/* ========== LAYANAN (CRUD) ========== */}
        {tab === "Layanan" && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <AppText style={styles.sectionTitle}>Daftar Layanan</AppText>
                <AppText style={styles.orderSub}>{services.length} layanan</AppText>
              </View>
              <Pressable
                style={styles.primaryButton}
                onPress={() => setServiceForm({ open: true, editing: null })}
              >
                <AppText style={styles.primaryButtonText}>+ Tambah Layanan</AppText>
              </Pressable>
            </View>

            {services.length === 0 ? (
              <EmptyState title="Belum ada layanan" description="Tekan “Tambah Layanan” untuk menambah layanan pertama." />
            ) : (
              services.map((service) => (
                <RowShell
                  key={service.id}
                  onEdit={() => setServiceForm({ open: true, editing: service })}
                  onDelete={() => handleDeleteService(service)}
                >
                  <View style={styles.rowIcon}>
                    <AppText style={styles.rowIconText}>✂</AppText>
                  </View>
                  <View style={styles.rowInfo}>
                    <AppText style={styles.rowCategory}>{service.category.toUpperCase()}</AppText>
                    <AppText style={styles.rowTitle}>{service.name}</AppText>
                    <AppText style={styles.rowMuted} numberOfLines={1}>
                      {service.description}
                    </AppText>
                  </View>
                  <View style={styles.rowRight}>
                    <AppText style={styles.rowPrice}>{getServicePriceLabel(service)}</AppText>
                  </View>
                </RowShell>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* Modal form */}
      <ProductFormModal
        visible={productForm.open}
        product={productForm.editing}
        onClose={() => setProductForm({ open: false, editing: null })}
        onSubmit={handleSaveProduct}
      />
      <ServiceFormModal
        visible={serviceForm.open}
        service={serviceForm.editing}
        onClose={() => setServiceForm({ open: false, editing: null })}
        onSubmit={handleSaveService}
      />
    </View>
  );
}

/* ---------------- Komponen kecil ---------------- */

function StatCard({
  icon,
  value,
  label,
  dark,
}: {
  icon: string;
  value: string;
  label: string;
  dark?: boolean;
}) {
  return (
    <View style={[styles.statCard, dark && styles.statCardDark]}>
      <View style={[styles.statIcon, dark && styles.statIconDark]}>
        <AppText style={styles.statIconText}>{icon}</AppText>
      </View>
      <AppText style={[styles.statNumber, dark && styles.statNumberLight]}>{value}</AppText>
      <AppText style={[styles.statLabel, dark && styles.statLabelLight]}>{label}</AppText>
    </View>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <View style={styles.emptyContainer}>
      <AppText style={styles.emptyTitle}>{title}</AppText>
      <AppText style={styles.emptyDescription}>{description}</AppText>
    </View>
  );
}

// Kartu baris dengan tombol Edit / Hapus (opsional)
function RowShell({
  children,
  onEdit,
  onDelete,
}: {
  children: ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <View style={styles.rowOuter}>
      <View style={styles.rowMain}>{children}</View>
      {(onEdit || onDelete) && (
        <View style={styles.rowActions}>
          {onEdit && (
            <Pressable style={styles.smallButton} onPress={onEdit}>
              <AppText style={styles.smallButtonText}>Edit</AppText>
            </Pressable>
          )}
          {onDelete && (
            <Pressable style={styles.smallDangerButton} onPress={onDelete}>
              <AppText style={styles.smallDangerText}>Hapus</AppText>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

function ProductRow({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const low = product.stock <= LOW_STOCK_LIMIT;
  return (
    <RowShell onEdit={onEdit} onDelete={onDelete}>
      <View style={styles.rowIcon}>
        <AppText style={styles.rowIconText}>{product.emoji}</AppText>
      </View>
      <View style={styles.rowInfo}>
        <AppText style={styles.rowCategory}>{product.category.toUpperCase()}</AppText>
        <AppText style={styles.rowTitle}>{product.name}</AppText>
        <AppText style={styles.rowMuted}>{product.id}</AppText>
      </View>
      <View style={styles.rowRight}>
        <AppText style={styles.rowPrice}>{formatRupiah(product.price)}</AppText>
        <View style={[styles.stockBadge, { backgroundColor: low ? "#FFF0D8" : "#DDF4E5" }]}>
          <AppText style={[styles.stockText, { color: low ? "#9A641D" : "#267446" }]}>
            Stok {product.stock}
          </AppText>
        </View>
      </View>
    </RowShell>
  );
}

function OrderCard({
  order,
  onCancel,
}: {
  order: Order;
  onCancel: (order: Order) => void;
}) {
  const statusColor = getStatusColor(order.status);
  const next = getNextAction(order);
  const canCancel = order.status === "Menunggu Proses" || order.status === "Sedang Dikirim";

  return (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderTypeWrap}>
          <View style={styles.orderIcon}>
            <AppText style={styles.orderIconText}>{order.type === "booking" ? "✂" : "🧴"}</AppText>
          </View>
          <View style={styles.orderTitleWrap}>
            <AppText style={styles.orderTitle}>
              {order.type === "booking"
                ? order.serviceName
                : order.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
            </AppText>
            <AppText style={styles.orderSub}>
              {order.id} · {formatDate(order.createdAt)}
            </AppText>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor.backgroundColor }]}>
          <AppText style={[styles.statusText, { color: statusColor.color }]}>
            {order.status.toUpperCase()}
          </AppText>
        </View>
      </View>

      <View style={styles.divider} />

      {order.type === "booking" ? (
        <>
          <DetailRow label="Pelanggan" value={order.customerName} />
          <DetailRow label="Jadwal" value={`${order.date} · ${order.time}`} />
          <DetailRow label="Durasi" value={`${order.durationMinutes} menit`} />
        </>
      ) : (
        <>
          <DetailRow label="Pembayaran" value={order.paymentMethod} />
          <DetailRow
            label="Jumlah item"
            value={`${order.items.reduce((sum, i) => sum + i.quantity, 0)} item`}
          />
        </>
      )}

      <View style={styles.detailRow}>
        <AppText style={styles.detailLabel}>Total</AppText>
        <AppText style={styles.totalValue}>{formatRupiah(getOrderAmount(order))}</AppText>
      </View>

      {(next || canCancel) && (
        <View style={styles.actionRow}>
          {canCancel && (
            <Pressable style={styles.cancelButton} onPress={() => onCancel(order)}>
              <AppText style={styles.cancelButtonText}>Batalkan</AppText>
            </Pressable>
          )}
          {next && (
            <Pressable
              style={styles.primaryButton}
              onPress={() => updateOrderStatus(order.id, next.status)}
            >
              <AppText style={styles.primaryButtonText}>{next.label}</AppText>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <AppText style={styles.detailLabel}>{label}</AppText>
      <AppText style={styles.detailValue}>{value}</AppText>
    </View>
  );
}