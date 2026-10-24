
export type Service = {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  price?: number;
  prices?: {
    short: number;
    medium: number;
  };
};

export const services: Service[] = [
  {
    id: 'haircut-owner',
    name: 'Haircut by Owner',
    description: 'Special haircut (Shampo, pemakain hair tonic dan menstling rambut',
    category: 'Haircut',
    price: 60000,
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800',
  },
  {
    id: 'senior-barber',
    name: 'Senior Barber',
    description: 'Potong rambut saja',
    category: 'Haircut',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800',
  },
  {
    id: 'haircut-wash',
    name: 'Haircut + Hair Wash',
    description: 'Potong dan cuci rambut',
    category: 'Haircut',
    price: 40000,
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800',
  },
  {
    id: 'face-mask',
    name: 'Face Mask',
    description: 'Perawatan wajah',
    category: 'Treatment',
    price: 50000,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800',
  },
  {
    id: 'ear-candle',
    name: 'Ear Candle',
    description: 'Perawatan ear candle',
    category: 'Treatment',
    price: 50000,
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800',
  },
  {
    id: 'basic-color',
    name: 'Basic Color',
    description: 'Pewarnaan rambut',
    category: 'Coloring',
    prices: { short: 100000, medium: 250000 },
    image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800',
  },
  {
    id: 'fashion-color',
    name: 'Fashion Color',
    description: 'Pewarnaan rambut fashion',
    category: 'Coloring',
    prices: { short: 450000, medium: 650000 },
    image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800',
  },
  {
    id: 'hair-spa',
    name: 'Hair Spa',
    description: 'Pemijitan rambut',
    category: 'Treatment',
    prices: { short: 65000, medium: 70000 },
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800',
  },
  {
    id: 'creambath',
    name: 'Creambath',
    description: 'Perawatan rambut dan kulit kepala',
    category: 'Treatment',
    prices: { short: 50000, medium: 65000 },
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800',
  },
  {
    id: 'perm-curly',
    name: 'Perm and Curly',
    description: 'Styling rambut keriting',
    category: 'Styling',
    prices: { short: 300000, medium: 450000 },
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800',
  },
  {
    id: 'smoothing',
    name: 'Smoothing',
    description: 'Perawatan pelurusan rambut',
    category: 'Styling',
    prices: { short: 350000, medium: 650000 },
    image: 'https://images.unsplash.com/photo-1590540179852-2110a54f813a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
  },
];

export function formatRupiah(price: number): string {
  return `Rp${price.toLocaleString('id-ID')}`;
}

export function getServicePriceLabel(service: Service): string {
  if (service.prices) {
    return `${formatRupiah(service.prices.short)} – ${formatRupiah(
      service.prices.medium,
    )}`;
  }

  if (service.price !== undefined) {
    return formatRupiah(service.price);
  }

  return 'Harga belum tersedia';
}
