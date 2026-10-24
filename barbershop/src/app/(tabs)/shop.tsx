import styles from "../../styles/screens/shop.styles";
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


