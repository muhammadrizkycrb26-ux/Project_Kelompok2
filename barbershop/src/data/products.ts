export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  emoji: string;
  popular?: boolean;
};

export const productCategories = ["Semua", "Styling", "Perawatan"] as const;
export type ProductCategory = (typeof productCategories)[number];

export const products: Product[] = [
  {
    id: "P001",
    name: "Matte Pomade",
    category: "Styling",
    description: "Pomade dengan hasil akhir matte untuk gaya rambut natural.",
    price: 45000,
    stock: 15,
    emoji: "🧴",
    popular: true,
  },
  {
    id: "P002",
    name: "Water Based Pomade",
    category: "Styling",
    description: "Pomade berbahan dasar air yang mudah dibersihkan.",
    price: 55000,
    stock: 12,
    emoji: "💈",
    popular: true,
  },
  {
    id: "P003",
    name: "Hair Shampoo",
    category: "Perawatan",
    description: "Sampo untuk membantu membersihkan rambut dan kulit kepala.",
    price: 35000,
    stock: 20,
    emoji: "🧴",
  },
  {
    id: "P004",
    name: "Hair Serum",
    category: "Perawatan",
    description: "Serum rambut untuk membantu menjaga rambut tetap halus.",
    price: 60000,
    stock: 10,
    emoji: "✨",
    popular: true,
  },
  {
    id: "P005",
    name: "Hair Tonic",
    category: "Perawatan",
    description: "Tonic untuk perawatan rutin kulit kepala.",
    price: 40000,
    stock: 8,
    emoji: "💧",
  },
  {
    id: "P006",
    name: "Hair Clay",
    category: "Styling",
    description: "Clay untuk membantu membentuk tekstur rambut.",
    price: 50000,
    stock: 9,
    emoji: "🫙",
  },
  {
    id: "P007",
    name: "Hair Wax",
    category: "Styling",
    description: "Wax untuk membantu mempertahankan bentuk gaya rambut.",
    price: 42000,
    stock: 14,
    emoji: "🧴",
  },
  {
    id: "P008",
    name: "Conditioner",
    category: "Perawatan",
    description: "Kondisioner untuk membantu melembutkan rambut.",
    price: 38000,
    stock: 11,
    emoji: "🫧",
  },
];
