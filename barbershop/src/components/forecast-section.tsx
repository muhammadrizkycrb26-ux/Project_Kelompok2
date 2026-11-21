import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";

import AppText from "@/components/app-text";
import { getDaftarItem, type JenisPermintaan } from "@/lib/ai/forecast-data";
import { saranStok } from "@/lib/ai/forecast-preprocess";
import { prediksiUntukItem, type PrediksiItem } from "@/lib/ai/forecast-service";
import styles, { C } from "@/styles/screens/admin.styles";

const JENIS: { key: JenisPermintaan; label: string; satuan: string; saran: string }[] = [
  { key: "produk", label: "Produk", satuan: "unit", saran: "Saran stok besok: siapkan" },
  { key: "layanan", label: "Layanan", satuan: "booking", saran: "Perkiraan kebutuhan slot besok:" },
];

export default function ForecastSection() {
  const [jenis, setJenis] = useState<JenisPermintaan>("produk");
  const [daftar, setDaftar] = useState<string[]>([]);
  const [aktif, setAktif] = useState<string | null>(null);
  const [hasil, setHasil] = useState<PrediksiItem | null>(null);
  const [memuatDaftar, setMemuatDaftar] = useState(true);
  const [memuatPrediksi, setMemuatPrediksi] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);

  const meta = JENIS.find((j) => j.key === jenis)!;

  const hitung = useCallback(async (j: JenisPermintaan, nama: string, paksa = false) => {
    setMemuatPrediksi(true);
    setGalat(null);
    try {
      setHasil(await prediksiUntukItem(j, nama, paksa));
    } catch (e) {
      setHasil(null);
      setGalat(e instanceof Error ? e.message : "Gagal menghitung prediksi");
    } finally {
      setMemuatPrediksi(false);
    }
  }, []);

  // Muat daftar produk/layanan tiap ganti jenis
  useEffect(() => {
    let batal = false;
    (async () => {
      setMemuatDaftar(true);
      setHasil(null);
      setGalat(null);
      try {
        const nama = await getDaftarItem(jenis);
        if (batal) return;
        setDaftar(nama);
        setAktif(nama[0] ?? null);
        if (nama[0]) await hitung(jenis, nama[0]);
      } catch (e) {
        if (!batal) setGalat(e instanceof Error ? e.message : "Gagal memuat daftar");
      } finally {
        if (!batal) setMemuatDaftar(false);
      }
    })();
    return () => {
      batal = true;
    };
  }, [jenis, hitung]);

  const pilih = (nama: string) => {
    setAktif(nama);
    void hitung(jenis, nama);
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={{ flex: 1 }}>
          <AppText style={styles.sectionTitle}>Prediksi Permintaan Besok</AppText>
          <AppText style={styles.orderSub}>Dari penjualan 14 hari terakhir, per {meta.label.toLowerCase()}.</AppText>
        </View>
      </View>

      {/* Pilih jenis */}
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
        {JENIS.map((j) => (
          <Pressable key={j.key} onPress={() => setJenis(j.key)} style={[styles.chip, jenis === j.key && styles.chipActive]}>
            <AppText style={[styles.chipText, jenis === j.key && styles.chipTextActive]}>{j.label}</AppText>
          </Pressable>
        ))}
      </View>

      {memuatDaftar ? (
        <ActivityIndicator color={C.orange} />
      ) : daftar.length === 0 ? (
        <View style={styles.emptyContainer}>
          <AppText style={styles.emptyTitle}>Belum ada {meta.label.toLowerCase()}</AppText>
          <AppText style={styles.emptyDescription}>Tambahkan dulu di tab {meta.label}.</AppText>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipList}>
          {daftar.map((nama) => (
            <Pressable key={nama} onPress={() => pilih(nama)} style={[styles.chip, aktif === nama && styles.chipActive]}>
              <AppText style={[styles.chipText, aktif === nama && styles.chipTextActive]}>{nama}</AppText>
            </Pressable>
          ))}
        </ScrollView>
      )}

      {memuatPrediksi ? (
        <View style={{ alignItems: "center", paddingVertical: 18 }}>
          <ActivityIndicator color={C.orange} />
          <AppText style={styles.rowMuted}>Menghitung prediksi…</AppText>
        </View>
      ) : galat ? (
        <AppText style={styles.formErrorText}>{galat}</AppText>
      ) : hasil ? (
        <View style={{ gap: 12 }}>
          {hasil.prediksi === null ? (
            <AppText style={styles.emptyDescription}>
              Belum cukup data untuk {hasil.nama} (baru {hasil.nHari} hari bertransaksi). Butuh minimal 7 hari untuk estimasi MA7 dan 14 hari untuk model TFLite.
            </AppText>
          ) : hasil.prediksi === 0 ? (
            <AppText style={styles.emptyDescription}>
              Belum ada penjualan {hasil.nama} dalam 7 hari terakhir — prediksi belum bisa dihitung. Pilih item lain.
            </AppText>
          ) : (
            <>
              <View>
                <AppText style={{ fontSize: 34, fontWeight: "800", color: C.dark }}>
                  {hasil.prediksi} {meta.satuan}
                </AppText>
                <AppText style={styles.rowMuted}>Prediksi besok — {hasil.nama}</AppText>
              </View>

              <View style={{ flexDirection: "row", gap: 10 }}>
                <KotakStat label="Baseline MA7" nilai={hasil.ma7 !== null ? `${hasil.ma7} ${meta.satuan}` : "—"} sub="7 hari terakhir" />
                <KotakStat label="Selisih model (MAE)" nilai={hasil.modelMae !== null ? `±${hasil.modelMae.toFixed(1)}` : "—"} sub={`${meta.satuan}, data uji`} />
              </View>

              {/* Label sumber ditampilkan APA ADANYA dari service */}
              <AppText style={styles.rowMuted}>ⓘ {hasil.catatan}</AppText>

              <View style={{ backgroundColor: C.soft, borderRadius: 12, padding: 12 }}>
                <AppText style={{ fontSize: 13, fontWeight: "700", color: C.dark }}>
                  {meta.saran} {saranStok(hasil.prediksi)} {meta.satuan} {hasil.nama}.
                </AppText>
              </View>
            </>
          )}

          <Pressable style={[styles.primaryButton, { alignSelf: "flex-start" }]} onPress={() => aktif && void hitung(jenis, aktif, true)}>
            <AppText style={styles.primaryButtonText}>↻ Hitung ulang</AppText>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function KotakStat({ label, nilai, sub }: { label: string; nilai: string; sub: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: C.white, borderRadius: 12, borderWidth: 1, borderColor: C.border, padding: 12 }}>
      <AppText style={{ fontSize: 11, color: C.muted }}>{label}</AppText>
      <AppText style={{ fontSize: 17, fontWeight: "800", color: C.dark, marginTop: 2 }}>{nilai}</AppText>
      <AppText style={{ fontSize: 10, color: C.muted }}>{sub}</AppText>
    </View>
  );
}
