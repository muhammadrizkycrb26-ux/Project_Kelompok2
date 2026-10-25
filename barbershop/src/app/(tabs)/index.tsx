import styles from "../../styles/screens/index.styles";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { getServicePriceLabel, services } from "@/data/services";
import AppButton from "@/components/atomic/AppButton";
import CategoryChip from "@/components/atomic/CategoryChip";
import SectionHeader from "@/components/atomic/SectionHeader";

const COLORS = {
  background: "#F7F4EF",
  dark: "#242321",
  orange: "#F59A38",
  muted: "#8C8781",
  white: "#FFFFFF",
  softOrange: "#F5E7D9",
};

const categories = ["Semua", "Haircut", "Treatment", "Coloring", "Styling"];

export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesCategory =
        selectedCategory === "Semua" || service.category === selectedCategory;

      const matchesSearch =
        service.name.toLowerCase().includes(search.toLowerCase()) ||
        service.description.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>WELCOME TO</Text>
            <Text style={styles.logo}>Corte Barbershop.</Text>
          </View>

          <Pressable
            style={styles.avatar}
            onPress={() => router.push("/profile")}
          >
            <Text style={styles.avatarText}>TN</Text>
          </Pressable>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroLabel}>YOUR STYLE, YOUR RULES</Text>

          <Text style={styles.heroTitle}>Look sharp.{"\n"}Feel confident.</Text>

          <Text style={styles.heroDescription}>
            Temukan layanan grooming yang sesuai dengan gaya kamu.
          </Text>

          <AppButton
            title="Booking Sekarang →"
            onPress={() => router.push("/booking")}
            style={styles.primaryButton}
          />

          <Text style={styles.heroNote}>GROOMING • STYLE • CONFIDENCE</Text>
        </View>

        <View style={styles.hoursCard}>
          <View style={styles.clockIcon}>
            <Text style={styles.clockText}>◷</Text>
          </View>

          <View style={styles.hoursInfo}>
            <Text style={styles.cardTitle}>Jam Operasional</Text>
            <Text style={styles.mutedText}>Setiap hari · 09.00–21.00</Text>
          </View>

          <View style={styles.openBadge}>
            <Text style={styles.openText}>OPEN</Text>
          </View>
        </View>

        <SectionHeader
          title="Layanan Kami"
          description="Rawat diri, tampil percaya diri."
          trailing={`${services.length} layanan`}
          style={styles.sectionHeader}
        />

        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Cari layanan grooming..."
            placeholderTextColor={COLORS.muted}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {categories.map((category) => (
            <CategoryChip
              key={category}
              label={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
              style={undefined}
            />
          ))}
        </ScrollView>

        <View style={styles.serviceList}>
          {filteredServices.map((service) => (
            <Pressable
              key={service.id}
              style={styles.serviceCard}
              onPress={() =>
                router.push({
                  pathname: "/booking",
                  params: { serviceId: service.id },
                })
              }
            >
              <Image
                source={{ uri: service.image }}
                style={styles.serviceImage}
                resizeMode="cover"
              />

              <View style={styles.serviceInfo}>
                <Text style={styles.serviceCategory}>
                  {service.category.toUpperCase()}
                </Text>

                <Text style={styles.cardTitle}>{service.name}</Text>

                <Text style={styles.mutedText}>{service.description}</Text>

                <Text style={styles.price}>
                  {getServicePriceLabel(service)}
                </Text>
              </View>

              <View style={styles.arrowCircle}>
                <Text style={styles.arrowText}>›</Text>
              </View>
            </Pressable>
          ))}

          {filteredServices.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Layanan tidak ditemukan</Text>
              <Text style={styles.mutedText}>
                Coba kata kunci atau kategori lain.
              </Text>
            </View>
          )}
        </View>

        <Pressable
          style={styles.shopBanner}
          onPress={() => router.push("/shop")}
        >
          <View style={styles.shopBannerText}>
            <Text style={styles.shopBannerLabel}>GROOMING ESSENTIALS</Text>
            <Text style={styles.shopBannerTitle}>Lengkapi gaya kamu.</Text>
            <Text style={styles.shopBannerDescription}>
              Temukan produk perawatan rambut favoritmu.
            </Text>
            <Text style={styles.shopLink}>Belanja sekarang →</Text>
          </View>
        </Pressable>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}


