import { useMemo, useSyncExternalStore } from "react";
import { StyleSheet } from "react-native";

// Prototype only: pengaturan disimpan di memori, kembali ke terang saat app di-reload.
let darkMode = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setDarkMode(value: boolean) {
  if (darkMode === value) return;
  darkMode = value;
  listeners.forEach((listener) => listener());
}

export function useDarkMode() {
  return useSyncExternalStore(
    subscribe,
    () => darkMode,
    () => darkMode,
  );
}

/* ---------- Peta warna terang → gelap ---------- */

// Warna latar (backgroundColor)
const BG: Record<string, string> = {
  "#F7F4EF": "#151413", // latar halaman
  "#FFFFFF": "#211F1D", // kartu
  "#FCFBF9": "#1B1A18",
  "#FFFCF8": "#1B1A18",
  "#FFF9F8": "#2B1D1C",
  "#FFF8F1": "#2D241C",
  "#242321": "#3B3632", // hero / kartu gelap / chip aktif
  "#F5E7D9": "#3A2F26", // oranye lembut
  "#EEE8E0": "#2A2724",
  "#EFEBE5": "#2A2724",
  "#EAE4DC": "#37332F",
  "#E2F4E7": "#1E3A29",
  "#E7F4EC": "#1E3A29",
  "#FBE1DF": "#3F2321",
  "#FCE8E6": "#3F2321",
};

// Warna teks (color)
const TEXT: Record<string, string> = {
  "#242321": "#F3EEE8",
  "#8C8781": "#A8A29B",
  "#77736E": "#A8A29B",
};

// Warna garis (borderColor, borderTopColor, dst.)
const BORDER: Record<string, string> = {
  "#EAE4DC": "#37332F",
  "#D0CBC4": "#46413C",
  "#D5CEC5": "#46413C",
  "#D9D1C8": "#46413C",
  "#D0C8BF": "#46413C",
};

function mapColor(prop: string, value: unknown) {
  if (typeof value !== "string") return value;
  const key = value.toUpperCase();
  if (prop === "backgroundColor") return BG[key] ?? value;
  if (prop === "color") return TEXT[key] ?? value;
  if (prop.startsWith("border") && prop.endsWith("Color")) return BORDER[key] ?? value;
  return value;
}

function themeStyles<T extends object>(styles: T, dark: boolean): T {
  if (!dark) return styles;

  const result: Record<string, unknown> = {};
  for (const [name, style] of Object.entries(styles)) {
    const flat = (StyleSheet.flatten(style as never) ?? {}) as Record<string, unknown>;
    const mapped: Record<string, unknown> = {};
    for (const [prop, value] of Object.entries(flat)) {
      mapped[prop] = mapColor(prop, value);
    }
    result[name] = mapped;
  }
  return result as T;
}

// Pakai di dalam komponen: const styles = useThemedStyles(baseStyles);
export function useThemedStyles<T extends object>(styles: T): T {
  const dark = useDarkMode();
  return useMemo(() => themeStyles(styles, dark), [styles, dark]);
}