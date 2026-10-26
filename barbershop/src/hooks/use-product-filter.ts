import { useMemo, useState } from "react";

import { products, type ProductCategory } from "@/data/products";

export function useProductFilter() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ProductCategory>("Semua");

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesKeyword =
        product.name.toLowerCase().includes(keyword) ||
        product.category.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword);
      const matchesCategory = category === "Semua" || product.category === category;

      return matchesKeyword && matchesCategory;
    });
  }, [search, category]);

  function reset() {
    setSearch("");
    setCategory("Semua");
  }

  return { search, setSearch, category, setCategory, filtered, reset };
}
