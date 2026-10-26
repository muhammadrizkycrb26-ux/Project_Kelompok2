import { router } from "expo-router";
import { StyleSheet } from "react-native";

import { Avatar, Button, AppText } from "@/components/atoms";
import { PageHeader } from "@/components/molecules";
import { HeroBanner, HoursCard, PromoBanner, ServiceCatalog } from "@/components/organisms";
import { ScreenTemplate } from "@/components/templates";
import { useServiceFilter } from "@/hooks/use-service-filter";

export default function HomePage() {
  const filter = useServiceFilter();

  return (
    <ScreenTemplate>
      <PageHeader
        eyebrow="WELCOME TO"
        title="Corte Barbershop."
        titleSize={23}
        trailing={<Avatar label="TN" onPress={() => router.push("/profile")} />}
        style={styles.header}
      />

      <HeroBanner
        size="lg"
        eyebrow="YOUR STYLE, YOUR RULES"
        title={"Look sharp.\nFeel confident."}
        description="Temukan layanan grooming yang sesuai dengan gaya kamu."
      >
        <Button
          label="Booking Sekarang →"
          onPress={() => router.push("/booking")}
          style={styles.cta}
        />
        <AppText variant="micro" color="#AAA199" style={styles.note}>
          GROOMING • STYLE • CONFIDENCE
        </AppText>
      </HeroBanner>

      <HoursCard />

      <ServiceCatalog
        services={filter.filtered}
        totalCount={filter.total}
        search={filter.search}
        onSearchChange={filter.setSearch}
        category={filter.category}
        onCategoryChange={filter.setCategory}
        onSelectService={(service) =>
          router.push({ pathname: "/booking", params: { serviceId: service.id } })
        }
      />

      <PromoBanner
        eyebrow="GROOMING ESSENTIALS"
        title="Lengkapi gaya kamu."
        description="Temukan produk perawatan rambut favoritmu."
        linkLabel="Belanja sekarang →"
        onPress={() => router.push("/shop")}
        style={styles.promo}
      />
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 24, paddingTop: 20 },
  cta: { alignSelf: "flex-start", marginTop: 20 },
  note: { fontSize: 9, letterSpacing: 2, marginTop: 20 },
  promo: { marginTop: 26, padding: 22 },
});

