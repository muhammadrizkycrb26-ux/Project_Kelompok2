import { useMemo, useState } from "react";

import { services, type ServiceCategory } from "@/data/services";

export function useServiceFilter() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ServiceCategory>("Semua");

  const filtered = useMemo(() => {
    const keyword = search.toLowerCase();

    return services.filter((service) => {
      const matchesCategory = category === "Semua" || service.category === category;
      const matchesSearch =
        service.name.toLowerCase().includes(keyword) ||
        service.description.toLowerCase().includes(keyword);

      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  return { search, setSearch, category, setCategory, filtered, total: services.length };
}
