import type { ReactElement } from "react";
import { FlatList, StyleSheet } from "react-native";

import { AppText, Button } from "@/components/atoms";
import { EmptyState, ProductCard } from "@/components/molecules";
import type { Product } from "@/data/products";
import { getProductImage } from "@/data/product-images";

type ProductGridProps = {
  products: Product[];
  quantityOf: (productId: string) => number;
  onAdd: (product: Product) => void;
  header: ReactElement;
  onResetFilters: () => void;
};

export function ProductGrid({ products, quantityOf, onAdd, header, onResetFilters }: ProductGridProps) {
  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.content}
      ListHeaderComponent={header}
      ListEmptyComponent={
        <EmptyState
          icon={<AppText style={styles.emptyEmoji}>🔎</AppText>}
          title="Produk tidak ditemukan"
          description="Coba kata kunci lain atau reset kategori."
          action={
            <Button
              variant="soft"
              size="sm"
              label="Reset pencarian"
              onPress={onResetFilters}
              style={styles.reset}
            />
          }
        />
      }
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          imageUri={getProductImage(item.id)}
          quantityInCart={quantityOf(item.id)}
          onAdd={() => onAdd(item)}
        />
      )}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    />
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingBottom: 110 },
  row: { gap: 10, marginBottom: 10 },
  emptyEmoji: { fontSize: 36, marginBottom: 12 },
  reset: { marginTop: 15 },
});
