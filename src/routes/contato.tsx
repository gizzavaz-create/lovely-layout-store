import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Instagram } from "lucide-react";
import { PageHeading } from "@/components/SiteChrome";
import { INSTAGRAM_URL, WHATSAPP_URL } from "@/lib/catalog";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — GI INDICA" },
      { name: "description", content: "Fale com a GI INDICA pelo WhatsApp ou Instagram." },
      { property: "og:title", content: "Contato — GI INDICA" },
      { property: "og:description", content: "Tire dúvidas e peça indicações pelo WhatsApp." },
    ],
  }),
  component: () => (
    <>
      <PageHeading eyebrow="Fale comigo" title="Contato">Dúvidas, parcerias ou quer uma indicação personalizada? Me chama!</PageHeading>
      <div className="container-site flex flex-col items-center gap-4">
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-8 py-4 text-lg font-medium text-whatsapp-foreground shadow-soft transition hover:opacity-90">
          <MessageCircle /> Chamar no WhatsApp
        </a>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline">
          <Instagram className="h-4 w-4" /> Ou me siga no Instagram
        </a>
      </div>
    </>
  ),
});
