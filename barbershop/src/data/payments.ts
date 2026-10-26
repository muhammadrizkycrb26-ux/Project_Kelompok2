import type { PaymentMethod } from "@/store/orders-store";

export const PAYMENT_METHODS: { method: PaymentMethod; description: string }[] = [
  { method: "Transfer Bank", description: "Transfer melalui rekening bank" },
  { method: "E-Wallet", description: "DANA, OVO, GoPay, atau sejenisnya" },
  { method: "Debit", description: "Pembayaran menggunakan kartu debit" },
];
