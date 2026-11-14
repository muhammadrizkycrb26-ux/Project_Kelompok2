import { useEffect, useState, type ReactNode } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  TextInput,
  View,
} from "react-native";

import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";

import AppText from "@/components/app-text";
import {
  getProductError,
  getServiceError,
  type ProductInput,
  type ServiceInput,
} from "@/data/catalog-store";
import type { Product } from "@/data/products";
import type { Service } from "@/data/services";
import styles, { C } from "../styles/screens/admin.styles";

const PRODUCT_CATEGORIES = ["Styling", "Perawatan"];
const SERVICE_CATEGORIES = ["Haircut", "Treatment", "Coloring", "Styling"];
const DESCRIPTION_MAX = 120;
const DEFAULT_SERVICE_IMAGE =
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800";

/* ---------------- Komponen dasar form ---------------- */

function ModalShell({
  visible,
  title,
  subtitle,
  onClose,
  onSave,
  saving,
  dimmed,
  children,
}: {
  visible: boolean;
  title: string;
  subtitle: string;
  onClose: () => void;
  onSave: () => void;
  saving?: boolean;
  dimmed?: boolean;
  children: ReactNode;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalBackdrop}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.modalCard}>
          <AppText style={styles.modalTitle}>{title}</AppText>
          <AppText style={styles.modalSubtitle}>{subtitle}</AppText>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>

          <View style={styles.modalActions}>
            <Pressable style={styles.ghostButton} onPress={onClose}>
              <AppText style={styles.ghostButtonText}>Batal</AppText>
            </Pressable>
            <Pressable
              style={[
                styles.primaryButton,
                { flex: 1, alignItems: "center", opacity: saving || dimmed ? 0.5 : 1 },
              ]}
              onPress={onSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color={C.white} />
              ) : (
                <AppText style={styles.primaryButtonText}>Simpan</AppText>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function Field({
  label,
  value,
  onChangeText,
  error,
  placeholder,
  numeric,
  multiline,
  onBlur,
  counter,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  placeholder?: string;
  numeric?: boolean;
  multiline?: boolean;
  onBlur?: () => void;
  counter?: string;
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      <AppText style={styles.formLabel}>{label}</AppText>
      <TextInput
        style={[
          styles.formInput,
          multiline && styles.formInputMultiline,
          error ? styles.formInputError : null,
        ]}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor="#A49D95"
        keyboardType={numeric ? "numeric" : "default"}
        multiline={multiline}
        accessibilityLabel={label}
      />
      {counter ? (
        <AppText
          style={{
            color: "#8A8178",
            fontSize: 12,
            textAlign: "right",
            marginTop: 4,
          }}
        >
          {counter}
        </AppText>
      ) : null}
      {error ? <AppText style={styles.formErrorText}>{error}</AppText> : null}
    </View>
  );
}

function ChipSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      <AppText style={styles.formLabel}>{label}</AppText>
      <View style={styles.formChipRow}>
        {options.map((option) => (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            style={[styles.formChip, value === option && styles.formChipActive]}
          >
            <AppText
              style={[
                styles.formChipText,
                value === option && styles.formChipTextActive,
              ]}
            >
              {option}
            </AppText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function SwitchRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.switchRow}>
      <AppText style={styles.formLabelInline}>{label}</AppText>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: C.orange, false: C.border }}
        thumbColor={C.white}
      />
    </View>
  );
}

const digitsOnly = (value: string) => value.replace(/\D/g, "");

/* ---------------- Form Produk ---------------- */

export function ProductFormModal({
  visible,
  product,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
  onSubmit: (input: ProductInput, photoUri?: string | null) => Promise<boolean>;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(PRODUCT_CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [emoji, setEmoji] = useState("🧴");
  const [popular, setPopular] = useState(false);
  const [image, setImage] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!visible) return;
    setName(product?.name ?? "");
    setCategory(product?.category ?? PRODUCT_CATEGORIES[0]);
    setDescription(product?.description ?? "");
    setPrice(product ? String(product.price) : "");
    setStock(product ? String(product.stock) : "");
    setEmoji(product?.emoji ?? "🧴");
    setPopular(product?.popular ?? false);
    setImage(product?.image ?? "");
    setPhotoUri(null);
    setSubmitted(false);
    setTouched({});
    setSaving(false);
    setFormError("");
  }, [visible, product]);

  const errors = {
    name: name.trim().length < 3 ? "Nama minimal 3 karakter." : "",
    description:
      description.trim().length < 5 ? "Deskripsi minimal 5 karakter." : "",
    price: !price || Number(price) <= 0 ? "Harga harus lebih dari 0." : "",
    stock: stock === "" ? "Stok wajib diisi (boleh 0)." : "",
  };
  const hasErrors = Object.values(errors).some(Boolean);
  const touch = (key: keyof typeof errors) =>
    setTouched((t) => ({ ...t, [key]: true }));
  const show = (key: keyof typeof errors) =>
    submitted || touched[key] ? errors[key] : "";

  const hasPhoto = Boolean(photoUri) || image !== "";

  function clearPhoto() {
    setPhotoUri(null);
    setImage(""); // kosong -> foto_url = null (kembali memakai emoji)
  }

  async function pickPhoto() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  }

  async function save() {
    setSubmitted(true);
    if (saving) return;
    const messages = Object.values(errors).filter(Boolean);
    if (messages.length > 0) {
      setFormError(`Periksa lagi isian: ${messages.join(" ")}`);
      return;
    }
    setSaving(true);
    setFormError("");
    const ok = await onSubmit(
      {
        name: name.trim(),
        category,
        description: description.trim(),
        price: Number(price),
        stock: Number(stock),
        emoji: emoji.trim() || "🧴",
        popular,
        image: image.trim() || undefined,
      },
      photoUri,
    );
    setSaving(false);
    if (!ok) setFormError(getProductError() ?? "Gagal menyimpan. Coba lagi.");
  }

  return (
    <ModalShell
      visible={visible}
      title={product ? "Edit Produk" : "Tambah Produk"}
      subtitle={
        product
          ? `ID ${product.id}`
          : "Produk baru akan tampil di halaman Shop."
      }
      onClose={onClose}
      onSave={save}
      saving={saving}
      dimmed={hasErrors}
    >
      <Field
        label="Nama produk"
        value={name}
        onChangeText={(v) => {
          setName(v);
          touch("name");
        }}
        onBlur={() => touch("name")}
        placeholder="Contoh: Sea Salt Spray"
        error={show("name")}
      />
      <ChipSelect
        label="Kategori"
        options={PRODUCT_CATEGORIES}
        value={category}
        onChange={setCategory}
      />
      <Field
        label="Deskripsi"
        value={description}
        onChangeText={(v) => {
          setDescription(v);
          touch("description");
        }}
        onBlur={() => touch("description")}
        placeholder="Deskripsi singkat produk"
        multiline
        error={show("description")}
      />
      <Field
        label="Harga (Rp)"
        value={price}
        onChangeText={(v) => {
          setPrice(digitsOnly(v));
          touch("price");
        }}
        onBlur={() => touch("price")}
        placeholder="45000"
        numeric
        error={show("price")}
      />
      <Field
        label="Stok"
        value={stock}
        onChangeText={(v) => {
          setStock(digitsOnly(v));
          touch("stock");
        }}
        onBlur={() => touch("stock")}
        placeholder="10"
        numeric
        error={show("stock")}
      />
      <Field
        label="Emoji ikon (dipakai bila tanpa foto)"
        value={emoji}
        onChangeText={setEmoji}
        placeholder="🧴"
      />
      <SwitchRow
        label="Tandai sebagai populer"
        value={popular}
        onChange={setPopular}
      />

      {hasPhoto ? (
        <Image
          source={{ uri: photoUri ?? image }}
          style={{ width: "100%", height: 160, borderRadius: 12, marginBottom: 10 }}
          contentFit="contain"
        />
      ) : null}
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 14 }}>
        <Pressable
          style={[styles.ghostButton, { flex: 1, alignItems: "center" }]}
          onPress={pickPhoto}
        >
          <AppText style={styles.ghostButtonText}>
            {hasPhoto ? "Ganti foto" : "Pilih foto dari galeri"}
          </AppText>
        </Pressable>
        {hasPhoto ? (
          <Pressable style={styles.smallDangerButton} onPress={clearPhoto}>
            <AppText style={styles.smallDangerText}>Hapus foto</AppText>
          </Pressable>
        ) : null}
      </View>

      {formError ? (
        <AppText style={[styles.formErrorText, { marginBottom: 10 }]}>
          {formError}
        </AppText>
      ) : null}
    </ModalShell>
  );
}

/* ---------------- Form Layanan ---------------- */

export function ServiceFormModal({
  visible,
  service,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  service: Service | null;
  onClose: () => void;
  onSubmit: (input: ServiceInput, photoUri?: string | null) => Promise<boolean>;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(SERVICE_CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [variable, setVariable] = useState(false);
  const [price, setPrice] = useState("");
  const [priceShort, setPriceShort] = useState("");
  const [priceMedium, setPriceMedium] = useState("");
  const [image, setImage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!visible) return;
    setName(service?.name ?? "");
    setCategory(service?.category ?? SERVICE_CATEGORIES[0]);
    setDescription(service?.description ?? "");
    setVariable(Boolean(service?.prices));
    setPrice(service?.price !== undefined ? String(service.price) : "");
    setPriceShort(service?.prices ? String(service.prices.short) : "");
    setPriceMedium(service?.prices ? String(service.prices.medium) : "");
    setImage(service?.image ?? "");
    setSubmitted(false);
    setPhotoUri(null);
    setSaving(false);
    setFormError("");
    setTouched({});
  }, [visible, service]);

  const invalidPrice = (value: string) =>
    !value || Number(value) <= 0 ? "Harga harus lebih dari 0." : "";
  const errors = {
    name: name.trim().length < 3 ? "Nama minimal 3 karakter." : "",
    description:
      description.trim().length < 3
        ? "Deskripsi minimal 3 karakter."
        : description.length > DESCRIPTION_MAX
          ? `Deskripsi maksimal ${DESCRIPTION_MAX} karakter.`
          : "",
    price: variable ? "" : invalidPrice(price),
    priceShort: variable ? invalidPrice(priceShort) : "",
    priceMedium: variable ? invalidPrice(priceMedium) : "",
  };

  // Validasi realtime: error tampil setelah field disentuh/diketik,
  // atau semuanya sekaligus setelah tombol Simpan ditekan.
  const hasErrors = Object.values(errors).some(Boolean);
  const touch = (key: keyof typeof errors) =>
    setTouched((t) => ({ ...t, [key]: true }));
  const show = (key: keyof typeof errors) =>
    submitted || touched[key] ? errors[key] : "";

  // Foto "ada" bila baru dipilih, atau foto tersimpan yang bukan placeholder.
  const hasPhoto =
    Boolean(photoUri) || (image !== "" && image !== DEFAULT_SERVICE_IMAGE);

  function clearPhoto() {
    setPhotoUri(null);
    setImage(""); // kosong -> disimpan sebagai foto_url = null
  }

  async function pickPhoto() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7, // kompres supaya upload ringan
    });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  }

  async function save() {
    setSubmitted(true);
    if (saving) return;
    // Pesan per-field bisa tertutup (form bisa digulir), jadi ringkasannya
    // juga ditampilkan di dekat tombol Simpan.
    const messages = Object.values(errors).filter(Boolean);
    if (messages.length > 0) {
      setFormError(`Periksa lagi isian: ${messages.join(" ")}`);
      return;
    }
    const base = {
      name: name.trim(),
      category,
      description: description.trim(),
      image: image.trim() || DEFAULT_SERVICE_IMAGE,
    };
    setSaving(true);
    setFormError("");
    const ok = await onSubmit(
      variable
        ? {
            ...base,
            prices: { short: Number(priceShort), medium: Number(priceMedium) },
          }
        : { ...base, price: Number(price) },
      photoUri,
    );
    setSaving(false);
    if (!ok) setFormError(getServiceError() ?? "Gagal menyimpan. Coba lagi.");
  }

  return (
    <ModalShell
      visible={visible}
      title={service ? "Edit Layanan" : "Tambah Layanan"}
      subtitle={
        service
          ? `ID ${service.id}`
          : "Layanan baru akan tampil di Home dan Booking."
      }
      onClose={onClose}
      onSave={save}
      saving={saving}
      dimmed={hasErrors}
    >
      <Field
        label="Nama layanan"
        value={name}
        onChangeText={(v) => {
          setName(v);
          touch("name");
        }}
        onBlur={() => touch("name")}
        placeholder="Contoh: Hair Tattoo"
        error={show("name")}
      />
      <ChipSelect
        label="Kategori"
        options={SERVICE_CATEGORIES}
        value={category}
        onChange={setCategory}
      />
      <Field
        label="Deskripsi"
        value={description}
        onChangeText={(v) => {
          setDescription(v);
          touch("description");
        }}
        onBlur={() => touch("description")}
        placeholder="Deskripsi singkat layanan"
        multiline
        counter={`${description.length}/${DESCRIPTION_MAX}`}
        error={show("description")}
      />

      <SwitchRow
        label="Harga beda per panjang rambut"
        value={variable}
        onChange={setVariable}
      />

      {variable ? (
        <>
          <Field
            label="Harga rambut pendek (Rp)"
            value={priceShort}
            onChangeText={(v) => {
              setPriceShort(digitsOnly(v));
              touch("priceShort");
            }}
            onBlur={() => touch("priceShort")}
            placeholder="100000"
            numeric
            error={show("priceShort")}
          />
          <Field
            label="Harga rambut sedang (Rp)"
            value={priceMedium}
            onChangeText={(v) => {
              setPriceMedium(digitsOnly(v));
              touch("priceMedium");
            }}
            onBlur={() => touch("priceMedium")}
            placeholder="250000"
            numeric
            error={show("priceMedium")}
          />
        </>
      ) : (
        <Field
          label="Harga (Rp)"
          value={price}
          onChangeText={(v) => {
            setPrice(digitsOnly(v));
            touch("price");
          }}
          onBlur={() => touch("price")}
          placeholder="50000"
          numeric
          error={show("price")}
        />
      )}

      {hasPhoto ? (
        <Image
          source={{ uri: photoUri ?? image }}
          style={{ width: "100%", height: 160, borderRadius: 12, marginBottom: 10 }}
          contentFit="cover"
        />
      ) : null}
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 14 }}>
        <Pressable
          style={[styles.ghostButton, { flex: 1, alignItems: "center" }]}
          onPress={pickPhoto}
        >
          <AppText style={styles.ghostButtonText}>
            {hasPhoto ? "Ganti foto" : "Pilih foto dari galeri"}
          </AppText>
        </Pressable>
        {hasPhoto ? (
          <Pressable style={styles.smallDangerButton} onPress={clearPhoto}>
            <AppText style={styles.smallDangerText}>Hapus foto</AppText>
          </Pressable>
        ) : null}
      </View>

      {formError ? (
        <AppText style={[styles.formErrorText, { marginBottom: 10 }]}>
          {formError}
        </AppText>
      ) : null}
    </ModalShell>
  );
}
