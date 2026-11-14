export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  emoji: string;
  popular?: boolean;
  image?: string; // URL foto (Supabase Storage atau tautan luar)
};

// Data produk sekarang disimpan di tabel `produk` (Supabase), bukan di sini.

export const formatRupiah = (value: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};
