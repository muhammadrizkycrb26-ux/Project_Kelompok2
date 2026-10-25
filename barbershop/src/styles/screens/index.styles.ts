const COLORS = {
  background: "#F7F4EF",
  dark: "#242321",
  orange: "#F59A38",
  muted: "#8C8781",
  white: "#FFFFFF",
  softOrange: "#F5E7D9",
};

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 3,
    color: COLORS.muted,
    fontWeight: "600",
  },
  logo: {
    fontSize: 23,
    fontWeight: "900",
    letterSpacing: 1,
    color: COLORS.dark,
    marginTop: 4,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.dark,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  hero: {
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    backgroundColor: COLORS.dark,
    minHeight: 270,
    justifyContent: "center",
  },
  heroLabel: {
    fontSize: 10,
    letterSpacing: 2,
    color: "#DDA477",
    fontWeight: "700",
  },
  heroTitle: {
    fontSize: 35,
    lineHeight: 42,
    color: COLORS.white,
    fontWeight: "900",
    marginTop: 15,
  },
  heroDescription: {
    color: "#D1CDC7",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 12,
  },
  primaryButton: {
    backgroundColor: COLORS.orange,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 20,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "700",
  },
  heroNote: {
    color: "#AAA49D",
    fontSize: 9,
    letterSpacing: 2,
    marginTop: 20,
  },
  hoursCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 22,
    padding: 16,
    borderRadius: 16,
    backgroundColor: COLORS.white,
  },
  clockIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.softOrange,
    alignItems: "center",
    justifyContent: "center",
  },
  clockText: {
    color: COLORS.orange,
    fontSize: 27,
  },
  hoursInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    color: COLORS.dark,
    fontSize: 13,
    fontWeight: "700",
  },
  mutedText: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 5,
  },
  openBadge: {
    backgroundColor: "#E2F4E7",
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
  },
  openText: {
    color: "#267641",
    fontSize: 9,
    fontWeight: "800",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 24,
    marginTop: 28,
    marginBottom: 15,
  },
  sectionTitle: {
    color: COLORS.dark,
    fontSize: 20,
    fontWeight: "800",
  },
  serviceCount: {
    color: COLORS.orange,
    fontSize: 11,
    fontWeight: "700",
  },
  
  searchBox: {
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#EAE4DC",
  },
  searchIcon: {
    color: COLORS.orange,
    fontSize: 25,
  },
  searchInput: {
  flex: 1,
  paddingVertical: 14,
  paddingHorizontal: 10,
  fontSize: 12,
  color: COLORS.dark,
  },
  categoryList: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.white,
  },
  categoryChipActive: {
    backgroundColor: COLORS.orange,
  },
  categoryText: {
    fontSize: 11,
    color: COLORS.dark,
    fontWeight: "600",
  },
  categoryTextActive: {
    color: COLORS.white,
  },
  serviceList: {
    gap: 10,
  },
  serviceCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  serviceImage: {
    width: 76,
    height: 82,
    borderRadius: 12,
    backgroundColor: COLORS.softOrange,
  },
  serviceInfo: {
    flex: 1,
    marginLeft: 12,
    paddingVertical: 3,
  },
  serviceCategory: {
    color: COLORS.orange,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 5,
  },
  price: {
    fontSize: 12,
    color: COLORS.orange,
    fontWeight: "800",
    marginTop: 8,
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.softOrange,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },
  arrowText: {
    fontSize: 22,
    color: COLORS.orange,
    marginTop: -2,
  },
  emptyState: {
    alignItems: "center",
    padding: 28,
  },
  emptyTitle: {
    color: COLORS.dark,
    fontSize: 14,
    fontWeight: "700",
  },
  shopBanner: {
    marginHorizontal: 20,
    marginTop: 26,
    borderRadius: 20,
    padding: 22,
    backgroundColor: COLORS.dark,
  },
  shopBannerText: {
    gap: 8,
  },
  shopBannerLabel: {
    color: "#DDA477",
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: "800",
  },
  shopBannerTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "900",
  },
  shopBannerDescription: {
    color: "#D1CDC7",
    fontSize: 12,
    lineHeight: 19,
  },
  shopLink: {
    color: COLORS.orange,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 6,
  },
  bottomSpace: {
    height: 20,
  },
});

export default styles;
