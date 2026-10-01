import { createFileRoute } from "@tanstack/react-router";
import { PageHeading } from "@/components/SiteChrome";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — GI INDICA" },
      { name: "description", content: "Como a GI INDICA coleta e utiliza seus dados." },
      { property: "og:title", content: "Política de Privacidade — GI INDICA" },
      { property: "og:description", content: "Saiba como tratamos seus dados pessoais." },
    ],
  }),
  component: () => (
    <>
      <PageHeading title="Política de Privacidade" />
      <div className="container-site max-w-2xl space-y-4 text-muted-foreground">
        <p>Coletamos apenas o nome e o contato (WhatsApp ou e-mail) que você informa voluntariamente para receber ofertas.</p>
        <p>Esses dados não são vendidos ou compartilhados com terceiros e são usados somente para enviar novidades da GI INDICA.</p>
        <p>As compras acontecem nas plataformas parceiras, que possuem suas próprias políticas de privacidade.</p>
        <p>Para remover seus dados, entre em contato pela página de Contato. Este texto atende à LGPD de forma resumida.</p>
      </div>
    </>
  ),
});
