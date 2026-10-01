import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { productsQuery } from "@/lib/products";
import { CATEGORIES, PLATFORMS } from "@/lib/catalog";
import { ProductCard } from "./ProductCard";

const chip = (active: boolean) =>
  `shrink-0 rounded-full px-4 py-2 text-sm transition ${active ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-sand"}`;

export function ProductBrowser({ fixedCategory }: { fixedCategory?: string }) {
  const { data = [], isLoading } = useQuery(productsQuery);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("");
  const [plat, setPlat] = useState<string>("");
  const category = fixedCategory ?? cat;

  const list = useMemo(
    () =>
      data.filter(
        (p) =>
          (!category || p.category === category) &&
          (!plat || p.platform === plat) &&
          p.name.toLowerCase().includes(q.trim().toLowerCase()),
      ),
    [data, category, plat, q],
  );

  return (
    <div className="container-site space-y-6">
      <div className="relative mx-auto max-w-lg">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar pelo nome..." className="h-12 w-full rounded-full border border-input bg-card pl-11 pr-5 outline-none focus:ring-2 focus:ring-ring" />
      </div>
      {!fixedCategory && (
        <div className="flex gap-2 overflow-x-auto pb-1 md:justify-center">
          <button className={chip(!cat)} onClick={() => setCat("")}>Todas</button>
          {CATEGORIES.map((c) => <button key={c.slug} className={chip(cat === c.slug)} onClick={() => setCat(c.slug)}>{c.name}</button>)}
        </div>
      )}
      <div className="flex gap-2 overflow-x-auto pb-1 md:justify-center">
        <button className={chip(!plat)} onClick={() => setPlat("")}>Todas plataformas</button>
        {PLATFORMS.map((p) => <button key={p} className={chip(plat === p)} onClick={() => setPlat(p)}>{p}</button>)}
      </div>
      {isLoading ? (
        <p className="py-10 text-center text-muted-foreground">Carregando...</p>
      ) : list.length === 0 ? (
        <p className="py-10 text-center text-muted-foreground">Nenhum produto encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 pt-4 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  );
}
