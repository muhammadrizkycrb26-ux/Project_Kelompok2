import { Image, StyleSheet, View } from "react-native";

import { AppText, Badge, Button } from "@/components/atoms";
import { Palette } from "@/constants/palette";
import type { Product } from "@/data/products";
import { formatRupiah } from "@/utils/format";

type ProductCardProps = {
  product: Product;
  imageUri?: string;
  quantityInCart: number;
  onAdd: () => void;
};

export function ProductCard({ product, imageUri, quantityInCart, onAdd }: ProductCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.imageBox}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
        ) : (
          <View style={styles.fallback}>
            <AppText variant="caption">Foto produk</AppText>
          </View>
        )}

        {product.popular ? (
          <Badge label="POPULER" tone="soft" style={styles.popular} textStyle={styles.popularText} />
        ) : null}
      </View>

      <View style={styles.info}>
        <AppText variant="eyebrow" style={styles.category}>
          {product.category}
        </AppText>
        <AppText variant="cardTitle" numberOfLines={2} style={styles.name}>
          {product.name}
        </AppText>
        <AppText variant="micro" numberOfLines={2} style={styles.description}>
          {product.description}
        </AppText>
        <AppText variant="cardTitle" style={styles.price}>
          {formatRupiah(product.price)}
        </AppText>
        <AppText variant="micro" style={styles.stock}>
          Stok: {product.stock}
        </AppText>

        <Button
          variant="dark"
          size="sm"
          label={quantityInCart > 0 ? `+ Tambah (${quantityInCart})` : "+ Keranjang"}
          onPress={onAdd}
          style={styles.addButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Palette.surface,
    borderRadius: 17,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Palette.border,
  },
  imageBox: { height: 145, backgroundColor: Palette.surface, padding: 8 },
  image: { width: "100%", height: "100%" },
  fallback: {
    flex: 1,
    backgroundColor: "#EFEBE5",
    justifyContent: "center",
    alignItems: "center",
  },
  popular: { position: "absolute", top: 9, left: 8, paddingHorizontal: 7, paddingVertical: 4, borderRadius: 6 },
  popularText: { fontWeight: "900", letterSpacing: 0 },
  info: { padding: 11 },
  category: { fontSize: 9, letterSpacing: 0, marginBottom: 5 },
  name: { fontWeight: "900" },
  description: { lineHeight: 15, marginTop: 5, minHeight: 30 },
  price: { fontWeight: "900", marginTop: 9 },
  stock: { fontSize: 9, marginTop: 4 },
  addButton: { marginTop: 10 },
});
