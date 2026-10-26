import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/atoms";
import { CartButton, FilterChips, PageHeader, SearchBar, SectionHeader } from "@/components/molecules";
import { Palette } from "@/constants/palette";
import { productCategories, type ProductCategory } from "@/data/products";
import { PromoBanner } from "./promo-banner";

type ShopListHeaderProps = {
  search: string;
  onSearchChange: (text: string) => void;
  category: ProductCategory;
  onCategoryChange: (category: ProductCategory) => void;
  resultCount: number;
  cartCount: number;
  onOpenCart: () => void;
};

export function ShopListHeader({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  resultCount,
  cartCount,
  onOpenCart,
}: ShopListHeaderProps) {
  return (
    <View>
      <PageHeader
        eyebrow="BARBERSHOP STORE"
        title="Shop"
        subtitle="Rawat penampilanmu setiap hari."
        titleSize={30}
        trailing={<CartButton count={cartCount} onPress={onOpenCart} />}
        style={styles.header}
      />

      <SearchBar
        value={search}
        onChangeText={onSearchChange}
        placeholder="Cari pomade, shampoo, serum..."
      />

      <PromoBanner
        eyebrow="BARBER ESSENTIALS"
        title={"Tampil rapi,\nlebih percaya diri."}
        description="Temukan produk perawatan favoritmu."
        trailing={<AppText style={styles.emoji}>💈</AppText>}
        style={styles.promo}
      />

      <SectionHeader
        title="Katalog Produk"
        subtitle={`${resultCount} produk ditemukan`}
        trailing={
          <AppText
            variant="caption"
            color={Palette.accent}
            style={styles.cartLink}
            onPress={onOpenCart}
          >
            Keranjang →
          </AppText>
        }
        style={styles.section}
      />

      <FilterChips variant="tab" options={productCategories} value={category} onChange={onCategoryChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  promo: { marginBottom: 22, minHeight: 150, padding: 18 },
  emoji: { fontSize: 48, marginLeft: 6 },
  section: { paddingHorizontal: 20, marginBottom: 14 },
  cartLink: { fontWeight: "800" },
});
