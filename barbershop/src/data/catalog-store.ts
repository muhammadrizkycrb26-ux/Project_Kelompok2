import { useSyncExternalStore } from "react";

import { products as seedProducts, type Product } from "./products";
import { services as seedServices, type Service } from "./services";

// Prototype only: data disimpan di memori, kembali ke data awal saat app di-reload.
let productList: Product[] = [...seedProducts];
let serviceList: Service[] = [...seedServices];
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useProducts() {
  return useSyncExternalStore(subscribe, () => productList, () => productList);
}

export function useServices() {
  return useSyncExternalStore(subscribe, () => serviceList, () => serviceList);
}

/* ---------------- Produk ---------------- */

export type ProductInput = Omit<Product, "id">;

export function addProduct(input: ProductInput): Product {
  const lastNumber = productList.reduce(
    (max, item) => Math.max(max, Number(item.id.replace(/\D/g, "")) || 0),
    0,
  );
  const product: Product = { ...input, id: `P${String(lastNumber + 1).padStart(3, "0")}` };
  productList = [...productList, product];
  notify();
  return product;
}

export function updateProduct(id: string, input: ProductInput) {
  productList = productList.map((item) => (item.id === id ? { ...input, id } : item));
  notify();
}

export function deleteProduct(id: string) {
  productList = productList.filter((item) => item.id !== id);
  notify();
}

/* ---------------- Layanan ---------------- */

export type ServiceInput = Omit<Service, "id">;

function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "layanan"
  );
}

export function addService(input: ServiceInput): Service {
  const base = slugify(input.name);
  let id = base;
  let counter = 2;
  while (serviceList.some((item) => item.id === id)) {
    id = `${base}-${counter++}`;
  }
  const service: Service = { ...input, id };
  serviceList = [...serviceList, service];
  notify();
  return service;
}

export function updateService(id: string, input: ServiceInput) {
  serviceList = serviceList.map((item) => (item.id === id ? { ...input, id } : item));
  notify();
}

export function deleteService(id: string) {
  serviceList = serviceList.filter((item) => item.id !== id);
  notify();
}