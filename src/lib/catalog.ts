export const CATEGORIES = [
  { slug: "beleza", name: "Beleza", emoji: "✿" },
  { slug: "suplementos", name: "Suplementos", emoji: "◐" },
  { slug: "casa-e-decoracao", name: "Casa e Decoração", emoji: "⌂" },
  { slug: "vestuario", name: "Vestuário", emoji: "✂" },
  { slug: "cursos-e-ebooks", name: "Cursos e Ebooks", emoji: "❧" },
  { slug: "achadinhos", name: "Achadinhos", emoji: "✦" },
] as const;

export const PLATFORMS = ["TikTok Shop", "Shopee", "Mercado Livre", "Amazon", "Shein", "Hotmart", "Kiwify", "Outra"] as const;

// Troque pelo seu número (DDI + DDD + número, só dígitos)
export const WHATSAPP_NUMBER = "5511999999999";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Vim pelo site GI INDICA 💛")}`;
export const INSTAGRAM_URL = "https://instagram.com/";
export const TIKTOK_URL = "https://tiktok.com/";

export const categoryName = (slug: string) =>
  CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;

export const formatPrice = (p: number | null) =>
  p == null ? "" : p.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
