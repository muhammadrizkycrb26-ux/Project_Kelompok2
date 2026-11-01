const C = {
  bg: "#F7F4EF",
  dark: "#242321",
  orange: "#C9824A",
  muted: "#77736E",
  white: "#FFFFFF",
  border: "#EAE4DC",
  soft: "#F5E7D9",
};

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.bg,
  },
  header: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eyebrow: {
    color: C.orange,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 5,
  },
  headerTitle: {
    color: C.dark,
    fontSize: 28,
    fontWeight: "800",
  },
  headerSubtitle: {
    color: C.muted,
    fontSize: 13,
    marginTop: 5,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: C.soft,
    alignItems: "center",
    justifyContent: "center",
  },
  headerIconText: {
    color: C.orange,
    fontSize: 24,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 26,
  },
  statCard: {
    flex: 1,
    backgroundColor: C.white,
    borderRadius: 16,
    paddingVertical: 17,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  statNumber: {
    fontSize: 23,
    fontWeight: "800",
    color: C.dark,
  },
  statLabel: {
    fontSize: 10,
    color: C.muted,
    marginTop: 5,
  },
  latestSection: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 13,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: C.dark,
  },
  sectionCaption: {
    fontSize: 11,
    color: C.muted,
  },
  bookingCard: {
    backgroundColor: C.dark,
    borderRadius: 19,
    padding: 16,
  },
  bookingTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  bookingIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#403B36",
    alignItems: "center",
    justifyContent: "center",
  },
  bookingIconText: {
    fontSize: 21,
    color: C.orange,
  },
  bookingInfo: {
    flex: 1,
    marginLeft: 11,
  },
  bookingService: {
    color: C.white,
    fontSize: 14,
    fontWeight: "800",
  },
  bookingCustomer: {
    color: "#C7C0B8",
    fontSize: 11,
    marginTop: 4,
  },
  bookingPrice: {
    color: "#E9AE7C",
    fontSize: 13,
    fontWeight: "800",
    marginLeft: 6,
  },
  bookingDivider: {
    height: 1,
    backgroundColor: "#48433E",
    marginVertical: 16,
  },
  bookingBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  bookingMetaLabel: {
    color: "#AAA199",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
  },
  bookingMetaValue: {
    color: C.white,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 6,
  },
  historySection: {
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: "row",
    backgroundColor: "#EEE8E0",
    borderRadius: 13,
    padding: 4,
    marginBottom: 15,
  },
  filterButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 11,
    borderRadius: 10,
  },
  filterButtonActive: {
    backgroundColor: C.dark,
  },
  filterText: {
    fontSize: 12,
    fontWeight: "700",
    color: C.muted,
  },
  filterTextActive: {
    color: C.white,
  },
  orderList: {
    gap: 13,
  },
  orderCard: {
    backgroundColor: C.white,
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: C.border,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  orderTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  orderIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: C.soft,
    alignItems: "center",
    justifyContent: "center",
  },
  orderIconText: {
    fontSize: 20,
  },
  orderTitleContainer: {
    marginLeft: 10,
    flex: 1,
  },
  orderTitle: {
    color: C.dark,
    fontSize: 13,
    fontWeight: "800",
  },
  orderId: {
    color: C.muted,
    fontSize: 10,
    marginTop: 4,
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 9,
    fontWeight: "800",
  },
  divider: {
    height: 1,
    backgroundColor: C.border,
    marginVertical: 14,
  },
  detailContainer: {
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  detailLabel: {
    color: C.muted,
    fontSize: 12,
  },
  detailValue: {
    color: C.dark,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "right",
    flexShrink: 1,
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  productTextContainer: {
    flex: 1,
  },
  productName: {
    color: C.dark,
    fontSize: 12,
    fontWeight: "700",
  },
  productQuantity: {
    color: C.muted,
    fontSize: 11,
    marginTop: 4,
  },
  productSubtotal: {
    color: C.dark,
    fontSize: 12,
    fontWeight: "700",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: C.border,
    marginTop: 15,
    paddingTop: 13,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    color: C.muted,
    fontSize: 12,
  },
  totalPrice: {
    color: C.orange,
    fontSize: 15,
    fontWeight: "800",
  },
  orderFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
    gap: 8,
  },
  orderDate: {
    color: C.muted,
    fontSize: 10,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#E8B8B4",
    borderRadius: 9,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  cancelButtonText: {
    color: "#B23B35",
    fontSize: 10,
    fontWeight: "800",
  },
  emptyContainer: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    padding: 28,
    alignItems: "center",
  },
  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: C.soft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 13,
  },
  emptyIconText: {
    fontSize: 26,
  },
  emptyTitle: {
    color: C.dark,
    fontSize: 16,
    fontWeight: "800",
  },
  emptyDescription: {
    color: C.muted,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 7,
  },
  footerNote: {
    color: C.muted,
    fontSize: 10,
    textAlign: "center",
    marginTop: 15,
    lineHeight: 16,
  },
});

export default styles;
