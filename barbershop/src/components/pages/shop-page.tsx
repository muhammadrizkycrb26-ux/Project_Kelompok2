import { useState } from "react";

import { CartSheet, CheckoutSheet, FloatingCartBar, ProductGrid, ShopListHeader } from "@/components/organisms";
import { ScreenTemplate } from "@/components/templates";
import { useCart } from "@/hooks/use-cart";
import { useProductFilter } from "@/hooks/use-product-filter";
import { addProductOrder, type PaymentMethod } from "@/store/orders-store";
import { showMessage } from "@/utils/alert";

export default function ShopPage() {
  const filter = useProductFilter();
  const cart = useCart();

  const [cartVisible, setCartVisible] = useState(false);
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Transfer Bank");

  function openCheckout() {
    if (cart.items.length === 0) {
      showMessage("Keranjang kosong", "Tambahkan produk terlebih dahulu.");
      return;
    }

    setCartVisible(false);
    setCheckoutVisible(true);
  }

  function confirmCheckout() {
    if (cart.items.length === 0) {
      showMessage("Keranjang kosong", "Tambahkan produk terlebih dahulu.");
      setCheckoutVisible(false);
      return;
    }

    const order = addProductOrder(
      cart.items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      })),
      paymentMethod,
    );

    if (!order) {
      showMessage("Pesanan gagal", "Pesanan belum dapat dibuat. Coba lagi.");
      return;
    }

    cart.clear();
    setCheckoutVisible(false);
    setCartVisible(false);

    showMessage(
      "Pesanan berhasil",
      `Pesanan ${order.id} sudah ditambahkan ke riwayat lokal. Pembayaran dan pengiriman belum diproses karena aplikasi belum terhubung ke backend.`,
    );
  }

  return (
    <ScreenTemplate
      safeArea
      scroll={false}
      overlay={
        <>
          {cart.count > 0 ? (
            <FloatingCartBar
              itemCount={cart.count}
              subtotal={cart.subtotal}
              onPress={() => setCartVisible(true)}
            />
          ) : null}

          <CartSheet
            visible={cartVisible}
            onClose={() => setCartVisible(false)}
            items={cart.items}
            itemCount={cart.count}
            subtotal={cart.subtotal}
            onChangeQuantity={cart.changeQuantity}
            onCheckout={openCheckout}
          />

          <CheckoutSheet
            visible={checkoutVisible}
            onClose={() => setCheckoutVisible(false)}
            items={cart.items}
            subtotal={cart.subtotal}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
            onConfirm={confirmCheckout}
            onBack={() => {
              setCheckoutVisible(false);
              setCartVisible(true);
            }}
          />
        </>
      }
    >
      <ProductGrid
        products={filter.filtered}
        quantityOf={cart.quantityOf}
        onAdd={cart.add}
        onResetFilters={filter.reset}
        header={
          <ShopListHeader
            search={filter.search}
            onSearchChange={filter.setSearch}
            category={filter.category}
            onCategoryChange={filter.setCategory}
            resultCount={filter.filtered.length}
            cartCount={cart.count}
            onOpenCart={() => setCartVisible(true)}
          />
        }
      />
    </ScreenTemplate>
  );
}
