import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeading } from "@/components/SiteChrome";
import { CATEGORIES } from "@/lib/catalog";

export const Route = createFileRoute("/categorias/")({
  head: () => ({
    meta: [
      { title: "Categorias — GI INDICA" },
      { name: "description", content: "Beleza, suplementos, casa e decoração, cursos e ebooks e achadinhos." },
      { property: "og:title", content: "Categorias — GI INDICA" },
      { property: "og:description", content: "Navegue pelas categorias da curadoria GI INDICA." },
    ],
  }),
  component: () => (
    <>
      <PageHeading eyebrow="Explore" title="Categorias" />
      <div className="container-site grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c) => (
          <Link key={c.slug} to="/categorias/$slug" params={{ slug: c.slug }} className="group rounded-2xl bg-secondary p-10 shadow-soft transition hover:-translate-y-1 hover:bg-sand">
            <span className="text-3xl text-primary">{c.emoji}</span>
            <h2 className="mt-4 text-2xl">{c.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground group-hover:text-foreground">Ver produtos →</p>
          </Link>
        ))}
      </div>
    </>
  ),
});
