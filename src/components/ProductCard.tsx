import type { Product } from "@/lib/products";
import { trackClick } from "@/lib/products";
import { categoryName, formatPrice } from "@/lib/catalog";
import { ArrowUpRight } from "lucide-react";
import { ProductGallery } from "./ProductGallery";
import { Button } from "@/components/ui/button";

export function ProductCard({ p }: { p: Product }) {
  const images = p.image_urls?.filter(Boolean) ?? [];
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
      <div className="relative overflow-hidden bg-secondary">
        {images.length > 1 ? <ProductGallery images={images} name={p.name} /> : <img
          src={p.image_url}
          alt={p.name}
          loading="lazy"
          decoding="async"
          width={600}
          height={600}
          className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
        />}
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">
          {p.platform}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{categoryName(p.category)}</p>
        <h3 className="text-lg leading-snug">{p.name}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
          <span className="font-serif text-xl">{formatPrice(p.price)}</span>
          <Button asChild className="rounded-full px-4 py-2 text-sm font-medium">
          <a
            href={p.affiliate_url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => trackClick(p.id)}
          >
            Quero este <ArrowUpRight className="h-4 w-4" />
          </a>
          </Button>
        </div>
      </div>
    </article>
  );
}
