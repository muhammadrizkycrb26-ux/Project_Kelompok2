import { formatRupiah, products, type Product } from "@/data/products";
import { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { addProductOrder, type PaymentMethod } from "../store/orders-store";

const C = {
  bg: "#F7F4EF",
  dark: "#242321",
  orange: "#C9824A",
  muted: "#77736E",
  white: "#FFFFFF",
  border: "#EAE4DC",
  soft: "#F5E7D9",
  gray: "#EFEBE5",
};

type Category = "Semua" | "Styling" | "Perawatan";
type CartItem = { product: Product; quantity: number };

// Foto produk asli dari halaman produk terkait.
// Sesuaikan foto dengan merek dan produk yang benar-benar dijual.
const productImages: Record<string, string> = {
  P001: "https://peteandpedro.com/cdn/shop/files/hi_res-7d-Michael_Levy_r2_0315_grande.jpg?v=1743620259",
  P002: "https://no113.com.au/cdn/shop/files/100g_Pomade-Front_1.jpg?v=1754430061&width=1400",
  P003: "https://scalpformen.com/cdn/shop/files/Foto_champu.png?v=1773304431",
  P004: "https://images.unsplash.com/photo-1707539160277-e39464517645?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  P005: "https://plus.unsplash.com/premium_photo-1706800175278-4b39bab8ffc2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  P006: "https://modernbarbersupply.com/cdn/shop/products/modern-image-hair-clay-969015.jpg?crop=center&height=1200&v=1702009854&width=1200",
  P007: "https://peteandpedro.com/cdn/shop/files/hi_res-7d-Michael_Levy_r2_0315_grande.jpg?v=1743620259",
  P008: "https://scandinavianbiolabs.us/cdn/shop/files/01_Shampoo_Men.jpg?v=1725361658&width=720",
};

export default function ShopScreen() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("Semua");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartVisible, setCartVisible] = useState(false);
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("Transfer Bank");

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchKeyword =
        product.name.toLowerCase().includes(keyword) ||
        product.category.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword);

      const matchCategory =
        category === "Semua" || product.category === category;

      return matchKeyword && matchCategory;
    });
  }, [search, category]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const addToCart = (product: Product) => {
    setCart((current) => {
      const found = current.find((item) => item.product.id === product.id);

      if (found) {
        if (found.quantity >= product.stock) {
          Alert.alert(
            "Batas stok",
            "Jumlah produk sudah mencapai stok tersedia.",
          );
          return current;
        }

        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      if (product.stock <= 0) {
        Alert.alert("Stok habis", "Produk ini sedang tidak tersedia.");
        return current;
      }

      return [...current, { product, quantity: 1 }];
    });
  };

  const changeQuantity = (id: string, change: number) => {
    setCart((current) =>
      current
        .map((item) => {
          if (item.product.id !== id) return item;

          const quantity = item.quantity + change;

          if (quantity > item.product.stock) {
            Alert.alert("Batas stok", "Jumlah melebihi stok tersedia.");
            return item;
          }

          return { ...item, quantity };
        })
        .filter((item) => item.quantity > 0),
    );
  };

  const openCheckout = () => {
    if (cart.length === 0) {
      Alert.alert("Keranjang kosong", "Tambahkan produk terlebih dahulu.");
      return;
    }

    setCartVisible(false);
    setCheckoutVisible(true);
  };

  const confirmCheckout = () => {
    if (cart.length === 0) {
      Alert.alert("Keranjang kosong", "Tambahkan produk terlebih dahulu.");
      setCheckoutVisible(false);
      return;
    }

    const createdOrder = addProductOrder(
      cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      })),
      paymentMethod,
    );

    if (!createdOrder) {
      Alert.alert("Pesanan gagal", "Pesanan belum dapat dibuat. Coba lagi.");
      return;
    }

    setCart([]);
    setCheckoutVisible(false);
    setCartVisible(false);

    Alert.alert(
      "Pesanan berhasil",
      `Pesanan ${createdOrder.id} sudah ditambahkan ke riwayat lokal. Pembayaran dan pengiriman belum diproses karena aplikasi belum terhubung ke backend.`,
    );
  };

  const renderProduct = ({ item }: { item: Product }) => {
    const quantity =
      cart.find((cartItem) => cartItem.product.id === item.id)?.quantity ?? 0;

    const imageUrl = productImages[item.id];

    return (
      <View style={styles.productCard}>
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.productImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.imageFallback}>
              <Text style={styles.fallbackText}>Foto produk</Text>
            </View>
          )}

          {item.popular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>POPULER</Text>
            </View>
          )}
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productCategory}>{item.category}</Text>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.productDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <Text style={styles.productPrice}>{formatRupiah(item.price)}</Text>
          <Text style={styles.stockText}>Stok: {item.stock}</Text>

          <Pressable style={styles.addButton} onPress={() => addToCart(item)}>
            <Text style={styles.addButtonText}>
              {quantity > 0 ? `+ Tambah (${quantity})` : "+ Keranjang"}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const renderCartItem = (item: CartItem) => (
    <View key={item.product.id} style={styles.cartItem}>
      <Image
        source={{ uri: productImages[item.product.id] }}
        style={styles.cartImage}
        resizeMode="contain"
      />

      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemName}>{item.product.name}</Text>
        <Text style={styles.cartItemPrice}>
          {formatRupiah(item.product.price)}
        </Text>

        <View style={styles.quantityRow}>
          <Pressable
            style={styles.quantityButton}
            onPress={() => changeQuantity(item.product.id, -1)}
          >
            <Text style={styles.quantityButtonText}>−</Text>
          </Pressable>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <Pressable
            style={styles.quantityButton}
            onPress={() => changeQuantity(item.product.id, 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.cartItemTotal}>
        {formatRupiah(item.product.price * item.quantity)}
      </Text>
    </View>
  );

  const listHeader = (
    <View>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>BARBERSHOP STORE</Text>
          <Text style={styles.headerTitle}>Shop</Text>
          <Text style={styles.headerSubtitle}>
            Rawat penampilanmu setiap hari.
          </Text>
        </View>

        <Pressable
          style={styles.cartHeaderButton}
          onPress={() => setCartVisible(true)}
        >
          <Text style={styles.cartIcon}>🛒</Text>
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>
                {cartCount > 99 ? "99+" : cartCount}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Cari pomade, shampoo, serum..."
          placeholderTextColor={C.muted}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      <View style={styles.promoBanner}>
        <View style={styles.promoContent}>
          <Text style={styles.promoEyebrow}>BARBER ESSENTIALS</Text>
          <Text style={styles.promoTitle}>
            Tampil rapi,{"\n"}lebih percaya diri.
          </Text>
          <Text style={styles.promoSubtitle}>
            Temukan produk perawatan favoritmu.
          </Text>
        </View>
        <Text style={styles.promoEmoji}>💈</Text>
      </View>

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Katalog Produk</Text>
          <Text style={styles.sectionSubtitle}>
            {filteredProducts.length} produk ditemukan
          </Text>
        </View>
        <Pressable onPress={() => setCartVisible(true)}>
          <Text style={styles.viewCartText}>Keranjang →</Text>
        </Pressable>
      </View>

      <View style={styles.categoryRow}>
        {(["Semua", "Styling", "Perawatan"] as Category[]).map((item) => {
          const active = category === item;

          return (
            <Pressable
              key={item}
              style={[
                styles.categoryButton,
                active && styles.categoryButtonActive,
              ]}
              onPress={() => setCategory(item)}
            >
              <Text
                style={[
                  styles.categoryText,
                  active && styles.categoryTextActive,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Satu FlatList sebagai scroll utama untuk seluruh halaman */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.productList}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          <View style={styles.emptySearch}>
            <Text style={styles.emptyEmoji}>🔎</Text>
            <Text style={styles.emptyTitle}>Produk tidak ditemukan</Text>
            <Text style={styles.emptyDescription}>
              Coba kata kunci lain atau reset kategori.
            </Text>
            <Pressable
              style={styles.resetButton}
              onPress={() => {
                setSearch("");
                setCategory("Semua");
              }}
            >
              <Text style={styles.resetButtonText}>Reset pencarian</Text>
            </Pressable>
          </View>
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />

      {cartCount > 0 && (
        <Pressable
          style={styles.floatingCart}
          onPress={() => setCartVisible(true)}
        >
          <View>
            <Text style={styles.floatingCartTitle}>
              Keranjang Saya · {cartCount} produk
            </Text>
            <Text style={styles.floatingCartPrice}>
              {formatRupiah(subtotal)}
            </Text>
          </View>
          <Text style={styles.floatingCartAction}>Lihat →</Text>
        </Pressable>
      )}

      {/* MODAL KERANJANG */}
      <Modal
        visible={cartVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setCartVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Keranjang Saya</Text>
                <Text style={styles.modalSubtitle}>
                  {cartCount} produk dipilih
                </Text>
              </View>
              <Pressable
                style={styles.closeButton}
                onPress={() => setCartVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>

            {cart.length === 0 ? (
              <View style={styles.emptyCart}>
                <Text style={styles.emptyEmoji}>🛒</Text>
                <Text style={styles.emptyTitle}>Keranjang masih kosong</Text>
                <Text style={styles.emptyDescription}>
                  Tambahkan produk dari katalog untuk mulai belanja.
                </Text>
                <Pressable
                  style={styles.primaryButton}
                  onPress={() => setCartVisible(false)}
                >
                  <Text style={styles.primaryButtonText}>Lihat Produk</Text>
                </Pressable>
              </View>
            ) : (
              <>
                <ScrollView
                  style={styles.cartList}
                  showsVerticalScrollIndicator={false}
                >
                  {cart.map(renderCartItem)}

                  <View style={styles.subtotalBox}>
                    <Text style={styles.subtotalLabel}>Subtotal</Text>
                    <Text style={styles.subtotalPrice}>
                      {formatRupiah(subtotal)}
                    </Text>
                    <Text style={styles.checkoutNote}>
                      Ongkir belum dihitung.
                    </Text>
                  </View>
                </ScrollView>

                <Pressable style={styles.primaryButton} onPress={openCheckout}>
                  <Text style={styles.primaryButtonText}>
                    Lanjut Checkout · {formatRupiah(subtotal)}
                  </Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* MODAL CHECKOUT */}
      <Modal
        visible={checkoutVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setCheckoutVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Checkout</Text>
                <Text style={styles.modalSubtitle}>
                  Periksa kembali pesananmu
                </Text>
              </View>
              <Pressable
                style={styles.closeButton}
                onPress={() => setCheckoutVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>

            <ScrollView
              style={styles.checkoutList}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.checkoutSectionTitle}>Ringkasan Pesanan</Text>

              {cart.map((item) => (
                <View key={item.product.id} style={styles.checkoutRow}>
                  <View style={styles.checkoutProductInfo}>
                    <Text style={styles.checkoutProductName}>
                      {item.product.name}
                    </Text>
                    <Text style={styles.checkoutProductQuantity}>
                      {item.quantity} × {formatRupiah(item.product.price)}
                    </Text>
                  </View>
                  <Text style={styles.checkoutProductTotal}>
                    {formatRupiah(item.product.price * item.quantity)}
                  </Text>
                </View>
              ))}

              <View style={styles.divider} />

              <View style={styles.checkoutTotalRow}>
                <Text style={styles.checkoutTotalLabel}>Total Belanja</Text>
                <Text style={styles.checkoutTotalPrice}>
                  {formatRupiah(subtotal)}
                </Text>
              </View>

              <Text style={styles.checkoutSectionTitle}>Metode Pembayaran</Text>
              {(["Transfer Bank", "E-Wallet", "Debit"] as PaymentMethod[]).map(
                (method) => (
                  <Pressable
                    key={method}
                    style={[
                      styles.paymentOption,
                      paymentMethod === method && styles.paymentOptionSelected,
                    ]}
                    onPress={() => setPaymentMethod(method)}
                  >
                    <View
                      style={[
                        styles.paymentRadio,
                        paymentMethod === method && styles.paymentRadioSelected,
                      ]}
                    >
                      {paymentMethod === method && (
                        <View style={styles.paymentRadioDot} />
                      )}
                    </View>
                    <View style={styles.paymentOptionText}>
                      <Text style={styles.paymentOptionTitle}>{method}</Text>
                      <Text style={styles.paymentOptionSubtitle}>
                        {method === "Transfer Bank"
                          ? "Transfer melalui rekening bank"
                          : method === "E-Wallet"
                            ? "DANA, OVO, GoPay, atau sejenisnya"
                            : "Pembayaran menggunakan kartu debit"}
                      </Text>
                    </View>
                  </Pressable>
                ),
              )}

              <View style={styles.noticeBox}>
                <Text style={styles.noticeTitle}>Informasi Checkout</Text>
                <Text style={styles.noticeText}>
                  Metode pembayaran akan dicatat pada pesanan. Transaksi masih
                  simulasi dan belum terhubung ke bank atau penyedia pembayaran.
                </Text>
              </View>
            </ScrollView>

            <Pressable style={styles.primaryButton} onPress={confirmCheckout}>
              <Text style={styles.primaryButtonText}>Konfirmasi Pesanan</Text>
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              onPress={() => {
                setCheckoutVisible(false);
                setCartVisible(true);
              }}
            >
              <Text style={styles.secondaryButtonText}>
                Kembali ke Keranjang
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.bg },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerText: { flex: 1 },
  eyebrow: {
    color: C.orange,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 5,
  },
  headerTitle: {
    color: C.dark,
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -0.8,
  },
  headerSubtitle: { color: C.muted, fontSize: 12, marginTop: 3 },
  cartHeaderButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.border,
    marginLeft: 12,
  },
  cartIcon: { fontSize: 22 },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 4,
    borderRadius: 10,
    backgroundColor: C.orange,
    alignItems: "center",
    justifyContent: "center",
  },
  cartBadgeText: { color: C.white, fontSize: 10, fontWeight: "900" },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 14,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
  },
  searchIcon: { fontSize: 25, color: C.muted, marginRight: 9 },
  searchInput: { flex: 1, color: C.dark, fontSize: 12, paddingVertical: 0 },

  promoBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 22,
    padding: 18,
    borderRadius: 20,
    backgroundColor: C.dark,
    minHeight: 150,
    overflow: "hidden",
  },
  promoContent: { flex: 1 },
  promoEyebrow: {
    color: "#E8B68E",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 9,
  },
  promoTitle: {
    color: C.white,
    fontSize: 22,
    lineHeight: 27,
    fontWeight: "900",
  },
  promoSubtitle: { color: "#D0CBC4", fontSize: 10, marginTop: 9 },
  promoEmoji: { fontSize: 48, marginLeft: 6 },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: { color: C.dark, fontSize: 18, fontWeight: "900" },
  sectionSubtitle: { color: C.muted, fontSize: 11, marginTop: 4 },
  viewCartText: { color: C.orange, fontSize: 11, fontWeight: "800" },

  categoryRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 14,
  },
  categoryButton: {
    paddingVertical: 9,
    paddingHorizontal: 17,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.white,
  },
  categoryButtonActive: { backgroundColor: C.dark, borderColor: C.dark },
  categoryText: { color: C.muted, fontSize: 11, fontWeight: "700" },
  categoryTextActive: { color: C.white },

  productList: { paddingHorizontal: 16, paddingBottom: 110 },
  productRow: { gap: 10, marginBottom: 10 },
  productCard: {
    flex: 1,
    backgroundColor: C.white,
    borderRadius: 17,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.border,
  },
  imageContainer: {
    height: 145,
    backgroundColor: C.white,
    position: "relative",
    padding: 8,
  },
  productImage: { width: "100%", height: "100%" },
  imageFallback: {
    flex: 1,
    backgroundColor: C.gray,
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackText: { color: C.muted, fontSize: 11 },
  popularBadge: {
    position: "absolute",
    top: 9,
    left: 8,
    backgroundColor: C.soft,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
  },
  popularText: { color: C.orange, fontSize: 8, fontWeight: "900" },
  productInfo: { padding: 11 },
  productCategory: {
    color: C.orange,
    fontSize: 9,
    fontWeight: "800",
    marginBottom: 5,
  },
  productName: { color: C.dark, fontSize: 13, fontWeight: "900" },
  productDescription: {
    color: C.muted,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 5,
    minHeight: 30,
  },
  productPrice: {
    color: C.dark,
    fontSize: 13,
    fontWeight: "900",
    marginTop: 9,
  },
  stockText: { color: C.muted, fontSize: 9, marginTop: 4 },
  addButton: {
    backgroundColor: C.dark,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 10,
  },
  addButtonText: { color: C.white, fontSize: 10, fontWeight: "800" },

  emptySearch: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 42,
  },
  emptyEmoji: { fontSize: 36, marginBottom: 12 },
  emptyTitle: {
    color: C.dark,
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },
  emptyDescription: {
    color: C.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 7,
  },
  resetButton: {
    marginTop: 15,
    backgroundColor: C.soft,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  resetButtonText: { color: C.orange, fontWeight: "800", fontSize: 11 },

  floatingCart: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 12,
    backgroundColor: C.dark,
    borderRadius: 17,
    paddingHorizontal: 17,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 7,
  },
  floatingCartTitle: { color: "#D0CBC4", fontSize: 10, fontWeight: "700" },
  floatingCartPrice: {
    color: C.white,
    fontSize: 15,
    fontWeight: "900",
    marginTop: 3,
  },
  floatingCartAction: { color: "#E8B68E", fontSize: 12, fontWeight: "900" },

  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  modalSheet: {
    backgroundColor: C.bg,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    maxHeight: "88%",
  },
  modalHandle: {
    width: 42,
    height: 4,
    borderRadius: 3,
    backgroundColor: "#D5CEC5",
    alignSelf: "center",
    marginBottom: 18,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  modalTitle: { color: C.dark, fontSize: 22, fontWeight: "900" },
  modalSubtitle: { color: C.muted, fontSize: 11, marginTop: 5 },
  closeButton: {
    width: 35,
    height: 35,
    borderRadius: 12,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: { color: C.dark, fontSize: 14, fontWeight: "800" },

  cartList: { flexGrow: 0, flexShrink: 1 },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    gap: 10,
  },
  cartImage: {
    width: 54,
    height: 60,
    borderRadius: 12,
    backgroundColor: C.white,
  },
  cartItemInfo: { flex: 1 },
  cartItemName: { color: C.dark, fontSize: 12, fontWeight: "900" },
  cartItemPrice: {
    color: C.orange,
    fontSize: 11,
    fontWeight: "800",
    marginTop: 4,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 9,
  },
  quantityButton: {
    width: 27,
    height: 27,
    borderRadius: 9,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: { color: C.dark, fontSize: 17, fontWeight: "800" },
  quantityText: {
    color: C.dark,
    fontSize: 12,
    fontWeight: "900",
    minWidth: 12,
    textAlign: "center",
  },
  cartItemTotal: { color: C.dark, fontSize: 11, fontWeight: "900" },
  subtotalBox: {
    backgroundColor: C.white,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: C.border,
    padding: 15,
    marginTop: 18,
    marginBottom: 15,
  },
  subtotalLabel: { color: C.muted, fontSize: 11 },
  subtotalPrice: {
    color: C.dark,
    fontSize: 22,
    fontWeight: "900",
    marginTop: 5,
  },
  checkoutNote: { color: C.muted, fontSize: 10, marginTop: 6 },
  primaryButton: {
    backgroundColor: C.orange,
    borderRadius: 14,
    minHeight: 49,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    marginTop: 12,
  },
  primaryButtonText: { color: C.white, fontSize: 12, fontWeight: "900" },
  emptyCart: { alignItems: "center", paddingVertical: 28 },
  secondaryButton: { alignItems: "center", paddingVertical: 14 },
  secondaryButtonText: { color: C.muted, fontSize: 11, fontWeight: "800" },

  checkoutList: { flexGrow: 0, flexShrink: 1 },
  checkoutSectionTitle: {
    color: C.dark,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 10,
  },
  checkoutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    gap: 12,
  },
  checkoutProductInfo: { flex: 1 },
  checkoutProductName: { color: C.dark, fontSize: 12, fontWeight: "800" },
  checkoutProductQuantity: { color: C.muted, fontSize: 10, marginTop: 5 },
  checkoutProductTotal: { color: C.dark, fontSize: 11, fontWeight: "900" },
  divider: { height: 1, backgroundColor: C.border, marginVertical: 17 },
  checkoutTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  checkoutTotalLabel: { color: C.dark, fontSize: 13, fontWeight: "800" },
  checkoutTotalPrice: { color: C.orange, fontSize: 20, fontWeight: "900" },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 13,
    marginTop: 9,
    gap: 11,
  },
  paymentOptionSelected: { borderColor: C.orange, backgroundColor: "#FFF8F1" },
  paymentRadio: {
    width: 19,
    height: 19,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: C.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  paymentRadioSelected: { borderColor: C.orange },
  paymentRadioDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: C.orange,
  },
  paymentOptionText: { flex: 1 },
  paymentOptionTitle: { color: C.dark, fontSize: 12, fontWeight: "800" },
  paymentOptionSubtitle: { color: C.muted, fontSize: 10, marginTop: 4 },
  noticeBox: {
    backgroundColor: C.soft,
    borderRadius: 13,
    padding: 14,
    marginTop: 20,
    marginBottom: 10,
  },
  noticeTitle: {
    color: C.dark,
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 6,
  },
  noticeText: { color: C.muted, fontSize: 11, lineHeight: 17 },
});
