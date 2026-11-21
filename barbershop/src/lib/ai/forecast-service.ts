// Layanan inferensi forecasting Corte Barbershop.
//
// Jalur TFLite (on-device) hanya aktif di DEVELOPMENT BUILD. react-native-fast-tflite
// adalah modul native dan TIDAK ada di Expo Go / web — di sana otomatis dipakai
// fallback MA7 (JS murni) dengan label jujur "MA7", bukan "model TFLite".
import { Platform } from "react-native";
import Constants, { ExecutionEnvironment } from "expo-constants";

import { getJumlahHariTransaksi, getSeriHarian, keSlug, type JenisPermintaan } from "./forecast-data";
import { ambilWindow, denormalisasi, ma7, normalisasi, WINDOW } from "./forecast-preprocess";

const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient ||
  (Constants as any).appOwnership === "expo";

// metrics.json hasil latih (assets/ai/metrics.json). mu/sigma dibaca dari sini —
// JANGAN ditulis manual, karena berubah setiap kali model dilatih ulang.
// Path: naik 3 tingkat dari src/lib/ai/ ke root proyek.
let metricsJson: any = null;
try {
  metricsJson = require("../../../assets/ai/metrics.json");
} catch {
  metricsJson = null;
}

export type PrediksiSumber = "tflite" | "ma7" | "kurang-data";

export interface PrediksiItem {
  nama: string;
  slug: string;
  jenis: JenisPermintaan;
  prediksi: number | null;
  ma7: number | null;
  sumber: PrediksiSumber;
  catatan: string; // ditampilkan apa adanya di UI
  nHari: number;
  modelMae: number | null;
  baselineMae: number | null;
}

let model: any = null;
let modelGagal: string | null = null;

function bacaMetrics() {
  const p = metricsJson?.preprocess ?? {};
  return {
    mu: typeof p.mu === "number" ? p.mu : 0,
    sigma: typeof p.sigma === "number" && p.sigma !== 0 ? p.sigma : 1,
    modelMae: typeof metricsJson?.model?.MAE === "number" ? metricsJson.model.MAE : null,
    baselineMae: typeof metricsJson?.baseline_ma7?.MAE === "number" ? metricsJson.baseline_ma7.MAE : null,
  };
}

export const isTfliteAktif = () => model !== null;

export async function muatModel(): Promise<any | null> {
  if (model) return model;
  if (modelGagal) return null;
  if (Platform.OS === "web") {
    modelGagal = "TFLite tidak didukung di web";
    return null;
  }
  if (isExpoGo) {
    modelGagal = "TFLite tidak didukung di Expo Go (gunakan development build)";
    return null;
  }
  try {
    const { loadTensorflowModel } = require("react-native-fast-tflite");
    model = await loadTensorflowModel(require("../../../assets/ai/model.tflite"), []);
    const inp = model.inputs[0];
    if (!inp || inp.shape[0] !== 1 || inp.shape[1] !== WINDOW || inp.shape[2] !== 1 || inp.dataType !== "float32") {
      throw new Error(`Bentuk input model tidak cocok: ${JSON.stringify(inp?.shape)} (diharapkan [1, ${WINDOW}, 1] float32)`);
    }
    return model;
  } catch (e: any) {
    model = null;
    modelGagal = e?.message ?? "Gagal memuat model TFLite";
    console.warn("[forecast] model TFLite gagal dimuat:", modelGagal);
    return null;
  }
}

/**
 * Tangga fallback (selalu berlabel):
 *  >= 14 hari transaksi + model termuat -> TFLite
 *  >= 7 hari (atau model gagal)          -> MA7
 *  <  7 hari                              -> kurang-data
 */
export async function prediksiUntukItem(jenis: JenisPermintaan, nama: string, paksa = false): Promise<PrediksiItem> {
  if (!metricsJson) {
    throw new Error("metrics.json belum ada di assets/ai/ — latih model dulu lalu salin model.tflite + metrics.json.");
  }
  const { mu, sigma, modelMae, baselineMae } = bacaMetrics();
  const nHari = await getJumlahHariTransaksi(jenis, WINDOW, paksa);
  const seri = await getSeriHarian(jenis, nama, WINDOW);
  const deret = seri.map((s) => s.qty);
  const nilaiMa7 = ma7(deret);

  const dasar = {
    nama,
    slug: keSlug(nama),
    jenis,
    ma7: nilaiMa7 !== null ? Math.round(nilaiMa7 * 10) / 10 : null,
    nHari,
    modelMae,
    baselineMae,
  };
  const dariMa7 = (catatan: string): PrediksiItem => ({
    ...dasar,
    prediksi: nilaiMa7 !== null ? Math.max(0, Math.round(nilaiMa7)) : null,
    sumber: "ma7",
    catatan,
  });

  if (nHari < 7) {
    return { ...dasar, prediksi: null, sumber: "kurang-data", catatan: "Belum cukup data" };
  }
  if (nHari >= WINDOW) {
    const m = await muatModel();
    const window = ambilWindow(deret);
    if (m && window) {
      const input = new Float32Array(window.map((q) => normalisasi(q, mu, sigma)));
      const outputs = await m.run([input.buffer]);
      const y = new Float32Array(outputs[0])[0];
      const prediksi = Math.max(0, Math.round(denormalisasi(y, mu, sigma)));
      return { ...dasar, prediksi, sumber: "tflite", catatan: "Model TFLite (on-device)" };
    }
    return dariMa7("Estimasi sementara — MA7 (model TFLite tidak termuat di perangkat ini)");
  }
  return dariMa7("Estimasi sementara — MA7 (model butuh 14 hari data)");
}
