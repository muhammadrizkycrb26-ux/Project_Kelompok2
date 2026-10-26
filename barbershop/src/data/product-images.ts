// Foto produk asli dari halaman produk terkait.
// Sesuaikan foto dengan merek dan produk yang benar-benar dijual.
const productImages: Record<string, string> = {
  P001: "https://peteandpedro.com/cdn/shop/files/hi_res-7d-Michael_Levy_r2_0315_grande.jpg?v=1743620259",
  P002: "https://no113.com.au/cdn/shop/files/100g_Pomade-Front_1.jpg?v=1754430061&width=1400",
  P003: "https://scalpformen.com/cdn/shop/files/Foto_champu.png?v=1773304431",
  P004: "https://images.unsplash.com/photo-1707539160277-e39464517645?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  P005: "https://plus.unsplash.com/premium_photo-1706800175278-4b39bab8ffc2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  P006: "https://modernbarbersupply.com/cdn/shop/products/modern-image-hair-clay-969015.jpg?crop=center&height=1200&v=1702009854&width=1200",
  P007: "https://peteandpedro.com/cdn/shop/files/hi_res-7d-Michael_Levy_r2_0315_grande.jpg?v=1743620259",
  P008: "https://scandinavianbiolabs.us/cdn/shop/files/01_Shampoo_Men.jpg?v=1725361658&width=720",
};

export function getProductImage(productId: string): string | undefined {
  return productImages[productId];
}
