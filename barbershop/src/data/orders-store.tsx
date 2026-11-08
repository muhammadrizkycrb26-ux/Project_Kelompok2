import { useSyncExternalStore } from "react";

export type OrderStatus =
  | "Menunggu Proses"
  | "Sedang Dikirim"
  | "Selesai"
  | "Batal";

export type BookingOrder = {
  id: string;
  type: "booking";
  customerName: string;
  serviceName: string;
  date: string;
  time: string;
  durationMinutes: number;
  price: number;
  status: OrderStatus;
  createdAt: string;
};

export type PaymentMethod = "Transfer Bank" | "E-Wallet" | "Debit";

export type ProductOrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type ProductOrder = {
  id: string;
  type: "product";
  items: ProductOrderItem[];
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
};

export type Order = BookingOrder | ProductOrder;

let orders: Order[] = [];
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return orders;
}

export function useOrders() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function addBookingOrder(
  data: Omit<BookingOrder, "id" | "type" | "status" | "createdAt">,
) {
  if (!isBookingSlotAvailable(data.date, data.time, data.durationMinutes)) {
    return null;
  }

  const order: BookingOrder = {
    ...data,
    id: `BK-${Date.now()}`,
    type: "booking",
    status: "Menunggu Proses",
    createdAt: new Date().toISOString(),
  };

  orders = [order, ...orders];
  notify();

  return order;
}

function timeToMinutes(time: string) {
  const [hour, minute] = time.split(".").map(Number);
  return hour * 60 + minute;
}

export function isBookingSlotAvailable(
  date: string,
  time: string,
  durationMinutes: number,
) {
  const start = timeToMinutes(time);
  const end = start + durationMinutes;

  return !orders.some((order) => {
    if (order.type !== "booking" || order.date !== date || order.status === "Batal") {
      return false;
    }

    const existingStart = timeToMinutes(order.time);
    const existingEnd = existingStart + order.durationMinutes;
    return start < existingEnd && existingStart < end;
  });
}

export function addProductOrder(
  items: ProductOrderItem[],
  paymentMethod: PaymentMethod,
) {
  if (items.length === 0) {
    return null;
  }

  const order: ProductOrder = {
    id: `PR-${Date.now()}`,
    type: "product",
    items: items.map((item) => ({ ...item })),
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    paymentMethod,
    status: "Menunggu Proses",
    createdAt: new Date().toISOString(),
  };

  orders = [order, ...orders];
  notify();

  return order;
}

export function cancelOrder(id: string) {
  orders = orders.map((order) =>
    order.id === id && order.status === "Menunggu Proses"
      ? { ...order, status: "Batal" }
      : order,
  );

  notify();
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  orders = orders.map((order) =>
    order.id === id ? { ...order, status } : order,
  );

  notify();
}
