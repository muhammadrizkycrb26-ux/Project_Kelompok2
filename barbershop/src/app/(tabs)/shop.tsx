import baseStyles from "../../styles/screens/shop.styles";
import { useDarkMode, useThemedStyles } from "@/data/theme-store";
import { formatRupiah, type Product } from "@/data/products";
import {
  loadProducts,
  useProducts,
  useProductStatus,
} from "@/data/catalog-store";
import { getOrderError } from "@/data/orders-store";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { addProductOrder, type PaymentMethod } from "@/data/orders-store";

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

function notify(title: string, message: string) {
  if (Platform.OS === "web") {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

export default function ShopScreen() {
  const styles = useThemedStyles(baseStyles);
  const darkMode = useDarkMode();
  // ✅ BARU: ambil produk dari store (berubah otomatis kalau admin CRUD)
  const products = useProducts();
  const { loading, error } = useProductStatus();
  const [placing, setPlacing] = useState(false);

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
  }, [search, category, products]); // ✅ BARU: tambah `products`

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
          notify(
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
        notify("Stok habis", "Produk ini sedang tidak tersedia.");
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
            notify("Batas stok", "Jumlah melebihi stok tersedia.");
            return item;
          }

          return { ...item, quantity };
        })
        .filter((item) => item.quantity > 0),
    );
  };

  const openCheckout = () => {
    if (cart.length === 0) {
      notify("Keranjang kosong", "Tambahkan produk terlebih dahulu.");
      return;
    }

    setCartVisible(false);
    setCheckoutVisible(true);
  };

  const confirmCheckout = async () => {
    if (placing) return;
    if (cart.length === 0) {
      notify("Keranjang kosong", "Tambahkan produk terlebih dahulu.");
      setCheckoutVisible(false);
      return;
    }

    setPlacing(true);
    // Harga dan stok dihitung ulang oleh database, bukan oleh aplikasi
    const createdOrder = await addProductOrder(
      cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      })),
      paymentMethod,
    );
    setPlacing(false);

    if (!createdOrder) {
      notify("Pesanan gagal", getOrderError() ?? "Pesanan belum dapat dibuat. Coba lagi.");
      return;
    }

    setCart([]);
    setCheckoutVisible(false);
    setCartVisible(false);

    notify(
      "Pesanan berhasil",
      `Pesanan ${createdOrder.id} tersimpan di database dan stok produk sudah diperbarui. Pembayaran belum diproses (belum ada payment gateway).`,
    );
  };

  const renderProduct = ({ item }: { item: Product }) => {
    const quantity =
      cart.find((cartItem) => cartItem.product.id === item.id)?.quantity ?? 0;

    const imageUrl = item.image;

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
              {/* ✅ BARU: produk baru dari admin tampil pakai emoji */}
              <Text style={[styles.fallbackText, { fontSize: 44 }]}>
                {item.emoji}
              </Text>
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

  const renderCartItem = (item: CartItem) => {
    const cartImageUrl = item.product.image;

    return (
      <View key={item.product.id} style={styles.cartItem}>
        {/* ✅ BARU: fallback emoji kalau produk tidak punya foto */}
        {cartImageUrl ? (
          <Image
            source={{ uri: cartImageUrl }}
            style={styles.cartImage}
            resizeMode="contain"
          />
        ) : (
          <View
            style={[
              styles.cartImage,
              { alignItems: "center", justifyContent: "center" },
            ]}
          >
            <Text style={{ fontSize: 28 }}>{item.product.emoji}</Text>
          </View>
        )}

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
  };

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
      <StatusBar
        barStyle={darkMode ? "light-content" : "dark-content"}
        backgroundColor={darkMode ? "#151413" : C.bg}
      />

      {/* Satu FlatList sebagai scroll utama untuk seluruh halaman */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.productList}
        ListHeaderComponent={listHeader}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => void loadProducts()}
            tintColor={C.orange}
          />
        }
        ListEmptyComponent={
          loading && products.length === 0 ? (
            <ActivityIndicator color={C.orange} style={{ marginTop: 40 }} />
          ) : error && products.length === 0 ? (
            <View style={styles.emptySearch}>
              <Text style={styles.emptyEmoji}>⚠️</Text>
              <Text style={styles.emptyTitle}>Produk gagal dimuat</Text>
              <Text style={styles.emptyDescription}>{error}</Text>
              <Pressable
                style={styles.resetButton}
                onPress={() => void loadProducts()}
              >
                <Text style={styles.resetButtonText}>Coba lagi</Text>
              </Pressable>
            </View>
          ) : (
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
          )
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

            <Pressable
              style={[styles.primaryButton, placing && { opacity: 0.6 }]}
              onPress={confirmCheckout}
              disabled={placing}
            >
              <Text style={styles.primaryButtonText}>
                {placing ? "Memproses..." : "Konfirmasi Pesanan"}
              </Text>
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