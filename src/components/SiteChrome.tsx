import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Instagram, MessageCircle } from "lucide-react";
import { INSTAGRAM_URL, TIKTOK_URL, WHATSAPP_URL } from "@/lib/catalog";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/produtos", label: "Produtos" },
  { to: "/categorias", label: "Categorias" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="font-serif text-2xl tracking-tight">
      GI <span className="text-primary italic">indica</span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="container-site flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm md:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }} activeProps={{ className: "text-primary" }} className="transition hover:text-primary">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/produtos" className="hidden rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 sm:inline-flex">
            Ver ofertas
          </Link>
          <button className="p-2 md:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="container-site flex flex-col gap-1 pb-4 md:hidden">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 hover:bg-secondary">
              {n.label}
            </Link>
          ))}
          <Link to="/produtos" onClick={() => setOpen(false)} className="mt-2 rounded-full bg-primary px-5 py-3 text-center font-medium text-primary-foreground">
            Ver ofertas
          </Link>
        </nav>
      )}
    </header>
  );
}

function TikTokIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={props.className} aria-hidden>
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-2.59-2.59c.27 0 .53.04.77.12V9.79a5.68 5.68 0 1 0 4.91 5.61V9.12a7.34 7.34 0 0 0 4.29 1.37V7.4a4.28 4.28 0 0 1-3.23-1.58Z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t bg-secondary/60">
      <div className="container-site grid gap-10 py-14 md:grid-cols-3">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">Curadoria de produtos que eu uso, testo e amo — com as melhores ofertas.</p>
          <div className="flex gap-3">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="rounded-full bg-background p-2.5 hover:text-primary"><Instagram className="h-5 w-5" /></a>
            <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="rounded-full bg-background p-2.5 hover:text-primary"><TikTokIcon className="h-5 w-5" /></a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="py-1 hover:text-primary">{n.label}</Link>
          ))}
          <Link to="/privacidade" className="py-1 hover:text-primary">Política de Privacidade</Link>
          <Link to="/termos" className="py-1 hover:text-primary">Termos de Uso</Link>
        </div>
        <p className="rounded-2xl bg-background p-5 text-sm text-muted-foreground">
          <strong className="text-foreground">Transparência:</strong> podemos receber comissão por compras feitas pelos links, sem custo extra para você.
        </p>
      </div>
      <p className="pb-8 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} GI INDICA</p>
    </footer>
  );
}

export function WhatsAppFloat() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale no WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lift transition hover:scale-105"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}

export function PageHeading({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="container-site pb-10 pt-14 text-center">
      {eyebrow && <p className="mb-3 text-xs uppercase tracking-[0.25em] text-primary">{eyebrow}</p>}
      <h1 className="text-4xl md:text-5xl">{title}</h1>
      {children && <div className="mx-auto mt-4 max-w-xl text-muted-foreground">{children}</div>}
    </div>
  );
}
