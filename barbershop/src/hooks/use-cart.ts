import { useState } from "react";

import type { Product } from "@/data/products";
import type { CartItem } from "@/types/cart";
import { showMessage } from "@/utils/alert";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  function quantityOf(productId: string) {
    return items.find((item) => item.product.id === productId)?.quantity ?? 0;
  }

  function add(product: Product) {
    const found = items.find((item) => item.product.id === product.id);

    if (found) {
      if (found.quantity >= product.stock) {
        showMessage("Batas stok", "Jumlah produk sudah mencapai stok tersedia.");
        return;
      }

      setItems(
        items.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      );
      return;
    }

    if (product.stock <= 0) {
      showMessage("Stok habis", "Produk ini sedang tidak tersedia.");
      return;
    }

    setItems([...items, { product, quantity: 1 }]);
  }

  function changeQuantity(productId: string, change: number) {
    setItems(
      items
        .map((item) => {
          if (item.product.id !== productId) return item;

          const quantity = item.quantity + change;

          if (quantity > item.product.stock) {
            showMessage("Batas stok", "Jumlah melebihi stok tersedia.");
            return item;
          }

          return { ...item, quantity };
        })
        .filter((item) => item.quantity > 0),
    );
  }

  function clear() {
    setItems([]);
  }

  return { items, count, subtotal, quantityOf, add, changeQuantity, clear };
}
