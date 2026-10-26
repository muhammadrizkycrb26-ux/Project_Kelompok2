export const TIME_SLOTS = [
  "09.00", "10.00", "11.00", "12.00", "13.00", "14.00",
  "15.00", "16.00", "17.00", "18.00", "19.00", "20.00",
] as const;

export type HairLength = "short" | "medium";

export const HAIR_LENGTH_LABEL: Record<HairLength, string> = {
  short: "Pendek",
  medium: "Medium",
};
