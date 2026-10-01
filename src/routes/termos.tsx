import { createFileRoute } from "@tanstack/react-router";
import { PageHeading } from "@/components/SiteChrome";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos de Uso — GI INDICA" },
      { name: "description", content: "Termos de uso do site GI INDICA." },
      { property: "og:title", content: "Termos de Uso — GI INDICA" },
      { property: "og:description", content: "Regras de uso da vitrine de afiliados GI INDICA." },
    ],
  }),
  component: () => (
    <>
      <PageHeading title="Termos de Uso" />
      <div className="container-site max-w-2xl space-y-4 text-muted-foreground">
        <p>A GI INDICA é uma vitrine de indicações. Não vendemos produtos diretamente.</p>
        <p>Preços e disponibilidade podem mudar a qualquer momento nas plataformas parceiras; o valor válido é sempre o exibido na loja.</p>
        <p>Podemos receber comissão por compras feitas pelos links, sem custo extra para você.</p>
        <p>Entregas, trocas e garantias são de responsabilidade da loja onde a compra foi realizada.</p>
      </div>
    </>
  ),
});
