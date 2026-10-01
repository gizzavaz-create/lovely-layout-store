import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MousePointerClick, Search, ShieldCheck, Star } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { CATEGORIES } from "@/lib/catalog";
import { productsQuery } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { LeadForm } from "@/components/LeadForm";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GI INDICA — Achados e ofertas que eu indico" },
      { name: "description", content: "Produtos de beleza, suplementos, casa, cursos e achadinhos selecionados com carinho. Compre com segurança nas plataformas oficiais." },
      { property: "og:title", content: "GI INDICA — Achados e ofertas que eu indico" },
      { property: "og:description", content: "Curadoria de produtos com as melhores ofertas da TikTok Shop, Shopee, Hotmart e Kiwify." },
    ],
  }),
  component: Index,
});

const TESTIMONIALS = [
  { name: "Mariana S.", text: "Comprei o sérum indicado e minha pele mudou! Amo as dicas da Gi." },
  { name: "Juliana R.", text: "Os achadinhos são incríveis, já virei cliente fiel das indicações." },
  { name: "Patrícia L.", text: "O curso de organização transformou minha casa. Super recomendo!" },
  { name: "Camila M.", text: "Recebo as ofertas no WhatsApp e sempre pego os melhores preços." },
];

const FAQ = [
  { q: "Eu compro direto aqui no site?", a: "Não. Aqui você encontra a curadoria; ao clicar em “Quero este”, você é levada à plataforma oficial (TikTok Shop, Shopee, Hotmart, Kiwify) para comprar com segurança." },
  { q: "Pago mais caro comprando pelo link?", a: "Nunca. O preço é o mesmo — eu apenas posso receber uma pequena comissão da plataforma." },
  { q: "Quem cuida da entrega e da troca?", a: "A loja ou plataforma onde a compra foi feita, seguindo as políticas dela." },
  { q: "Como recebo as ofertas exclusivas?", a: "Deixe seu nome e WhatsApp ou e-mail no formulário e você recebe as novidades antes de todo mundo." },
];

function Index() {
  const { data: products = [], isLoading } = useQuery(productsQuery);
  const featured = products.filter((p) => p.featured).slice(0, 8);

  return (
    <>
      {/* Hero */}
      <section className="container-site grid items-center gap-10 py-12 md:grid-cols-2 md:py-20">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.25em] text-primary">Curadoria com carinho</p>
          <h1 className="text-5xl leading-[1.05] md:text-6xl">
            Só o que vale a pena, <em className="text-primary">pelo melhor preço.</em>
          </h1>
          <p className="max-w-md text-lg text-muted-foreground">
            Produtos que eu testo, uso e amo — beleza, casa, bem-estar e conhecimento em um só lugar.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/produtos" className="rounded-full bg-primary px-7 py-3.5 font-medium text-primary-foreground shadow-soft transition hover:opacity-90">Ver produtos</Link>
            <a href="#ofertas" className="rounded-full border border-primary px-7 py-3.5 font-medium text-primary transition hover:bg-secondary">Receber ofertas</a>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-secondary" />
          <img src={hero} alt="Produtos selecionados GI INDICA" width={1200} height={1400} className="aspect-[6/7] w-full rounded-[2rem] object-cover shadow-lift" />
        </div>
      </section>

      {/* Categorias */}
      <section className="container-site">
        <div className="flex gap-3 overflow-x-auto pb-2 md:justify-center">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} to="/categorias/$slug" params={{ slug: c.slug }} className="flex shrink-0 items-center gap-2 rounded-full bg-secondary px-5 py-3 text-sm font-medium transition hover:bg-sand">
              <span className="text-primary">{c.emoji}</span> {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Destaques */}
      <section className="container-site py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <h2 className="text-3xl md:text-4xl">Produtos em destaque</h2>
          <Link to="/produtos" className="shrink-0 text-sm text-primary underline-offset-4 hover:underline">Ver todos →</Link>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-secondary" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
      </section>

      {/* Como funciona */}
      <section className="bg-secondary/60 py-20">
        <div className="container-site">
          <h2 className="mb-12 text-center text-3xl md:text-4xl">Como funciona</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Search, t: "1. Escolha", d: "Navegue pela curadoria e encontre o que combina com você." },
              { icon: MousePointerClick, t: "2. Clique", d: "Toque em “Quero este” e vá direto para a oferta." },
              { icon: ShieldCheck, t: "3. Compre com segurança", d: "Finalize na plataforma oficial, com toda a garantia dela." },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="rounded-2xl bg-card p-8 text-center shadow-soft">
                <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-secondary text-primary"><Icon /></div>
                <h3 className="mb-2 text-xl">{t}</h3>
                <p className="text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="container-site py-20">
        <h2 className="mb-12 text-center text-3xl md:text-4xl">Quem compra, ama</h2>
        <Carousel opts={{ loop: true, align: "start" }} className="mx-auto max-w-4xl px-10">
          <CarouselContent>
            {TESTIMONIALS.map((t) => (
              <CarouselItem key={t.name} className="md:basis-1/2">
                <figure className="h-full rounded-2xl bg-card p-8 shadow-soft">
                  <div className="mb-4 flex gap-1 text-primary">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
                  <blockquote className="font-serif text-lg italic">“{t.text}”</blockquote>
                  <figcaption className="mt-4 text-sm text-muted-foreground">— {t.name}</figcaption>
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      {/* Leads */}
      <section id="ofertas" className="container-site scroll-mt-24">
        <div className="rounded-[2rem] bg-secondary px-6 py-14 md:px-14">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl">Receba ofertas exclusivas antes de todo mundo</h2>
            <p className="mb-8 mt-3 text-muted-foreground">Cupons, promoções relâmpago e achadinhos direto para você.</p>
            <LeadForm />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-site max-w-3xl py-20">
        <h2 className="mb-8 text-center text-3xl md:text-4xl">Perguntas frequentes</h2>
        <Accordion type="single" collapsible className="rounded-2xl bg-card px-6 shadow-soft">
          {FAQ.map((f, i) => (
            <AccordionItem key={i} value={`f${i}`}>
              <AccordionTrigger className="text-left text-base">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </>
  );
}
