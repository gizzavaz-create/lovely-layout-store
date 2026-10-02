import { createOpenAI } from "@ai-sdk/openai";
import { streamText, type ModelMessage } from "ai";

const CATS = ["beleza", "suplementos", "casa-e-decoracao", "cursos-e-ebooks", "achadinhos"];
const PLATS = ["TikTok Shop", "Shopee", "Mercado Livre", "Amazon", "Shein", "Hotmart", "Kiwify", "Outra"];

export type Extracted = { name: string; category: string; description: string; platform: string; price: number | null; image_url: string };

async function pageInfo(url: string) {
  try {
    const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, redirect: "follow", signal: AbortSignal.timeout(10000) });
    const html = (await r.text()).slice(0, 300000);
    const meta = (p: string) => html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${p}["'][^>]+content=["']([^"']+)`, "i"))?.[1] ?? "";
    const title = html.match(/<title[^>]*>([^<]*)/i)?.[1] ?? "";
    return { title: meta("og:title") || title, desc: meta("og:description") || meta("description"), image: meta("og:image") };
  } catch {
    return { title: "", desc: "", image: "" };
  }
}

export async function extractProduct(input: { url?: string | undefined; text?: string | undefined; image?: string | undefined }): Promise<Extracted> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("Chave de IA ausente.");
  const page = input.url ? await pageInfo(input.url) : null;

  const prompt = `Você ajuda a cadastrar produtos de afiliado num site brasileiro. A partir das informações abaixo, responda APENAS com um JSON:
{"name": nome do produto (claro, sem emojis), "category": uma de ${JSON.stringify(CATS)}, "platform": uma de ${JSON.stringify(PLATS)} (deduza pelo link), "price": número em reais ou null, "description": descrição atraente em pt-BR com no máximo 300 caracteres}
${input.url ? `Link: ${input.url}` : ""}
${page?.title ? `Título da página: ${page.title}` : ""}
${page?.desc ? `Descrição da página: ${page.desc}` : ""}
${input.text ? `Texto enviado: ${input.text}` : ""}`;

  const content: Exclude<ModelMessage, { role: "system" }>["content"] = [{ type: "text", text: prompt }] as never;
  if (input.image) (content as unknown[]).push({ type: "image", image: input.image });

  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });
  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    messages: [{ role: "user", content } as ModelMessage],
    providerOptions: {
      openai: { forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", store: false, include: ["reasoning.encrypted_content"] },
    },
  });
  const text = await result.text;
  const json = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] ?? "{}");
  const price = typeof json.price === "number" ? json.price : null;
  return {
    name: String(json.name ?? "").slice(0, 200),
    category: CATS.includes(json.category) ? json.category : "achadinhos",
    platform: PLATS.includes(json.platform) ? json.platform : "Outra",
    price,
    description: String(json.description ?? "").slice(0, 500),
    image_url: page?.image ?? "",
  };
}
