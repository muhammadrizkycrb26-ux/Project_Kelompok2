// Preprocessing forecasting Corte Barbershop — HARUS sama persis dengan train.py.
// train.py: window 14 hari, normalisasi (x - mu) / sigma, mu/sigma dari data TRAIN
// (tersimpan di metrics.json -> "preprocess"). Ubah satu, ubah keduanya.

export const WINDOW = 14;

/** (x - mu) / sigma — sama dengan train.py. */
export function normalisasi(qty: number, mu: number, sigma: number): number {
  return (qty - mu) / sigma;
}

/** Kebalikan normalisasi: keluaran model -> qty asli. */
export function denormalisasi(nilai: number, mu: number, sigma: number): number {
  return nilai * sigma + mu;
}

/** 14 hari terakhir dari deret (urut tanggal menaik); null bila < 14 hari. */
export function ambilWindow(deret: number[]): number[] | null {
  if (deret.length < WINDOW) return null;
  return deret.slice(deret.length - WINDOW);
}

/** Baseline MA7: rata-rata 7 hari terakhir (sama dengan train.py). */
export function ma7(deret: number[]): number | null {
  if (deret.length < 7) return null;
  const tujuh = deret.slice(deret.length - 7);
  return tujuh.reduce((a, b) => a + b, 0) / tujuh.length;
}

/** Saran stok / kesiapan: prediksi dibulatkan ke atas. */
export function saranStok(prediksiQty: number): number {
  return Math.max(0, Math.ceil(prediksiQty));
}
