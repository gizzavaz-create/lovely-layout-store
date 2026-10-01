import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageHeading } from "@/components/SiteChrome";
import { ProductBrowser } from "@/components/ProductBrowser";
import { CATEGORIES } from "@/lib/catalog";

export const Route = createFileRoute("/categorias/$slug")({
  loader: ({ params }) => {
    const cat = CATEGORIES.find((c) => c.slug === params.slug);
    if (!cat) throw notFound();
    return { cat };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.cat.name ?? "Categoria";
    return {
      meta: [
        { title: `${name} — GI INDICA` },
        { name: "description", content: `Os melhores produtos de ${name} selecionados pela GI.` },
        { property: "og:title", content: `${name} — GI INDICA` },
        { property: "og:description", content: `Curadoria de ${name} com as melhores ofertas.` },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { cat } = Route.useLoaderData();
  return (
    <>
      <PageHeading eyebrow="Categoria" title={cat.name} />
      <ProductBrowser fixedCategory={cat.slug} />
    </>
  );
}
