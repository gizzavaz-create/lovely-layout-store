import { createFileRoute } from "@tanstack/react-router";
import { PageHeading } from "@/components/SiteChrome";
import { ProductBrowser } from "@/components/ProductBrowser";

export const Route = createFileRoute("/produtos")({
  head: () => ({
    meta: [
      { title: "Produtos — GI INDICA" },
      { name: "description", content: "Todos os produtos indicados pela GI: filtre por categoria, plataforma ou busque pelo nome." },
      { property: "og:title", content: "Produtos — GI INDICA" },
      { property: "og:description", content: "Explore a curadoria completa de produtos e ofertas da GI INDICA." },
    ],
  }),
  component: () => (
    <>
      <PageHeading eyebrow="Vitrine" title="Todos os produtos">Filtre por categoria ou plataforma e encontre o seu favorito.</PageHeading>
      <ProductBrowser />
    </>
  ),
});
