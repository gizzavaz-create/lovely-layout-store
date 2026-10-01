import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeading } from "@/components/SiteChrome";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre — GI INDICA" },
      { name: "description", content: "Conheça a história da GI INDICA e como nasceu essa curadoria." },
      { property: "og:title", content: "Sobre a GI INDICA" },
      { property: "og:description", content: "A história por trás da curadoria de produtos GI INDICA." },
    ],
  }),
  component: () => (
    <>
      <PageHeading eyebrow="Nossa história" title="Prazer, eu sou a Gi" />
      <div className="container-site max-w-2xl space-y-5 text-lg leading-relaxed text-muted-foreground">
        <p>A GI INDICA nasceu de uma mania antiga: testar tudo antes de recomendar. Amigas sempre me perguntavam “onde você comprou isso?” — e eu adorava contar.</p>
        <p>Hoje transformei essa paixão em uma curadoria honesta de produtos de beleza, bem-estar, casa e conhecimento, sempre buscando o melhor custo-benefício nas plataformas mais seguras do Brasil.</p>
        <p>Aqui você não encontra tudo — encontra <em className="text-foreground">o que vale a pena</em>.</p>
        <Link to="/produtos" className="inline-flex rounded-full bg-primary px-6 py-3 text-base font-medium text-primary-foreground">Ver minhas indicações</Link>
      </div>
    </>
  ),
});
