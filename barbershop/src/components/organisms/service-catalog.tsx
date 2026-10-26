import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/atoms";
import { EmptyState, FilterChips, SearchBar, SectionHeader, ServiceCard } from "@/components/molecules";
import { Palette } from "@/constants/palette";
import { serviceCategories, type Service, type ServiceCategory } from "@/data/services";

type ServiceCatalogProps = {
  services: Service[];
  totalCount: number;
  search: string;
  onSearchChange: (text: string) => void;
  category: ServiceCategory;
  onCategoryChange: (category: ServiceCategory) => void;
  onSelectService: (service: Service) => void;
};

export function ServiceCatalog({
  services,
  totalCount,
  search,
  onSearchChange,
  category,
  onCategoryChange,
  onSelectService,
}: ServiceCatalogProps) {
  return (
    <>
      <SectionHeader
        title="Layanan Kami"
        subtitle="Rawat diri, tampil percaya diri."
        trailing={
          <AppText variant="caption" color={Palette.accent} style={styles.count}>
            {totalCount} layanan
          </AppText>
        }
        style={styles.header}
      />

      <SearchBar
        value={search}
        onChangeText={onSearchChange}
        placeholder="Cari layanan grooming..."
        style={styles.search}
      />

      <FilterChips
        variant="pill"
        options={serviceCategories}
        value={category}
        onChange={onCategoryChange}
      />

      <View style={styles.list}>
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} onPress={() => onSelectService(service)} />
        ))}

        {services.length === 0 ? (
          <EmptyState
            title="Layanan tidak ditemukan"
            description="Coba kata kunci atau kategori lain."
          />
        ) : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: { marginHorizontal: 24, marginTop: 28, marginBottom: 15 },
  count: { fontWeight: "700" },
  search: { marginBottom: 14 },
  list: { gap: 10 },
});

