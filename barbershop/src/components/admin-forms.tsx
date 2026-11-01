import { useEffect, useState, type ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  TextInput,
  View,
} from "react-native";

import AppText from "@/components/app-text";
import type { ProductInput, ServiceInput } from "@/data/catalog-store";
import type { Product } from "@/data/products";
import type { Service } from "@/data/services";
import styles, { C } from "../styles/screens/admin.styles";

const PRODUCT_CATEGORIES = ["Styling", "Perawatan"];
const SERVICE_CATEGORIES = ["Haircut", "Treatment", "Coloring", "Styling"];
const DEFAULT_SERVICE_IMAGE =
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800";

/* ---------------- Komponen dasar form ---------------- */

function ModalShell({
  visible,
  title,
  subtitle,
  onClose,
  onSave,
  children,
}: {
  visible: boolean;
  title: string;
  subtitle: string;
  onClose: () => void;
  onSave: () => void;
  children: ReactNode;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalBackdrop}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.modalCard}>
          <AppText style={styles.modalTitle}>{title}</AppText>
          <AppText style={styles.modalSubtitle}>{subtitle}</AppText>

          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>

          <View style={styles.modalActions}>
            <Pressable style={styles.ghostButton} onPress={onClose}>
              <AppText style={styles.ghostButtonText}>Batal</AppText>
            </Pressable>
            <Pressable style={[styles.primaryButton, { flex: 1, alignItems: "center" }]} onPress={onSave}>
              <AppText style={styles.primaryButtonText}>Simpan</AppText>
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
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  placeholder?: string;
  numeric?: boolean;
  multiline?: boolean;
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
        placeholder={placeholder}
        placeholderTextColor="#A49D95"
        keyboardType={numeric ? "numeric" : "default"}
        multiline={multiline}
        accessibilityLabel={label}
      />
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
            <AppText style={[styles.formChipText, value === option && styles.formChipTextActive]}>
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
  onSubmit: (input: ProductInput) => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(PRODUCT_CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [emoji, setEmoji] = useState("🧴");
  const [popular, setPopular] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setName(product?.name ?? "");
    setCategory(product?.category ?? PRODUCT_CATEGORIES[0]);
    setDescription(product?.description ?? "");
    setPrice(product ? String(product.price) : "");
    setStock(product ? String(product.stock) : "");
    setEmoji(product?.emoji ?? "🧴");
    setPopular(product?.popular ?? false);
    setSubmitted(false);
  }, [visible, product]);

  const errors = {
    name: name.trim().length < 3 ? "Nama minimal 3 karakter." : "",
    description: description.trim().length < 5 ? "Deskripsi minimal 5 karakter." : "",
    price: !price || Number(price) <= 0 ? "Harga harus lebih dari 0." : "",
    stock: stock === "" ? "Stok wajib diisi (boleh 0)." : "",
  };

  function save() {
    setSubmitted(true);
    if (Object.values(errors).some(Boolean)) return;
    onSubmit({
      name: name.trim(),
      category,
      description: description.trim(),
      price: Number(price),
      stock: Number(stock),
      emoji: emoji.trim() || "🧴",
      popular,
    });
  }

  return (
    <ModalShell
      visible={visible}
      title={product ? "Edit Produk" : "Tambah Produk"}
      subtitle={product ? `ID ${product.id}` : "Produk baru akan tampil di halaman Shop."}
      onClose={onClose}
      onSave={save}
    >
      <Field label="Nama produk" value={name} onChangeText={setName} placeholder="Contoh: Sea Salt Spray" error={submitted ? errors.name : ""} />
      <ChipSelect label="Kategori" options={PRODUCT_CATEGORIES} value={category} onChange={setCategory} />
      <Field label="Deskripsi" value={description} onChangeText={setDescription} placeholder="Deskripsi singkat produk" multiline error={submitted ? errors.description : ""} />
      <Field label="Harga (Rp)" value={price} onChangeText={(v) => setPrice(digitsOnly(v))} placeholder="45000" numeric error={submitted ? errors.price : ""} />
      <Field label="Stok" value={stock} onChangeText={(v) => setStock(digitsOnly(v))} placeholder="10" numeric error={submitted ? errors.stock : ""} />
      <Field label="Emoji ikon" value={emoji} onChangeText={setEmoji} placeholder="🧴" />
      <SwitchRow label="Tandai sebagai populer" value={popular} onChange={setPopular} />
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
  onSubmit: (input: ServiceInput) => void;
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
  }, [visible, service]);

  const invalidPrice = (value: string) => (!value || Number(value) <= 0 ? "Harga harus lebih dari 0." : "");
  const errors = {
    name: name.trim().length < 3 ? "Nama minimal 3 karakter." : "",
    description: description.trim().length < 3 ? "Deskripsi minimal 3 karakter." : "",
    price: variable ? "" : invalidPrice(price),
    priceShort: variable ? invalidPrice(priceShort) : "",
    priceMedium: variable ? invalidPrice(priceMedium) : "",
  };

  function save() {
    setSubmitted(true);
    if (Object.values(errors).some(Boolean)) return;
    const base = {
      name: name.trim(),
      category,
      description: description.trim(),
      image: image.trim() || DEFAULT_SERVICE_IMAGE,
    };
    onSubmit(
      variable
        ? { ...base, prices: { short: Number(priceShort), medium: Number(priceMedium) } }
        : { ...base, price: Number(price) },
    );
  }

  return (
    <ModalShell
      visible={visible}
      title={service ? "Edit Layanan" : "Tambah Layanan"}
      subtitle={service ? `ID ${service.id}` : "Layanan baru akan tampil di Home dan Booking."}
      onClose={onClose}
      onSave={save}
    >
      <Field label="Nama layanan" value={name} onChangeText={setName} placeholder="Contoh: Hair Tattoo" error={submitted ? errors.name : ""} />
      <ChipSelect label="Kategori" options={SERVICE_CATEGORIES} value={category} onChange={setCategory} />
      <Field label="Deskripsi" value={description} onChangeText={setDescription} placeholder="Deskripsi singkat layanan" multiline error={submitted ? errors.description : ""} />

      <SwitchRow label="Harga beda per panjang rambut" value={variable} onChange={setVariable} />

      {variable ? (
        <>
          <Field label="Harga rambut pendek (Rp)" value={priceShort} onChangeText={(v) => setPriceShort(digitsOnly(v))} placeholder="100000" numeric error={submitted ? errors.priceShort : ""} />
          <Field label="Harga rambut sedang (Rp)" value={priceMedium} onChangeText={(v) => setPriceMedium(digitsOnly(v))} placeholder="250000" numeric error={submitted ? errors.priceMedium : ""} />
        </>
      ) : (
        <Field label="Harga (Rp)" value={price} onChangeText={(v) => setPrice(digitsOnly(v))} placeholder="50000" numeric error={submitted ? errors.price : ""} />
      )}

      <Field label="URL gambar (opsional)" value={image} onChangeText={setImage} placeholder="https://..." />
    </ModalShell>
  );
}