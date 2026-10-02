import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { extractProductFn } from "@/lib/ai-extract.functions";

type Result = { name: string; category: string; description: string; platform: string; price: number | null; image_url: string };

export function AiProductFill({ onResult }: { onResult: (r: Result & { url: string }) => void }) {
  const run = useServerFn(extractProductFn);
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState<string>();
  const [loading, setLoading] = useState(false);
  const field = "h-11 w-full rounded-xl border border-border bg-background px-4 text-sm";

  function pick(f?: File) {
    if (!f) return setImage(undefined);
    if (f.size > 5_000_000) return void toast.error("Imagem muito grande (máx. 5MB).");
    const r = new FileReader();
    r.onload = () => setImage(r.result as string);
    r.readAsDataURL(f);
  }

  async function go() {
    if (!url && !text && !image) return void toast.error("Envie um link, texto ou imagem.");
    setLoading(true);
    try {
      const r = await run({ data: { url: url || undefined, text: text || undefined, image } });
      onResult({ ...r, url });
      toast.success("Campos preenchidos! Confira antes de salvar.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível analisar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-3 rounded-xl bg-secondary/60 p-4 md:col-span-2">
      <p className="flex items-center gap-2 font-medium"><Sparkles className="h-4 w-4 text-primary" /> Preencher com IA</p>
      <input className={field} placeholder="Link do produto" value={url} onChange={(e) => setUrl(e.target.value)} />
      <textarea className={`${field} h-20 py-2`} placeholder="Ou cole um texto sobre o produto" value={text} onChange={(e) => setText(e.target.value)} />
      <input type="file" accept="image/*" className="text-sm" onChange={(e) => pick(e.target.files?.[0])} />
      <button type="button" disabled={loading} onClick={go} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground disabled:opacity-60">
        <Sparkles className="h-4 w-4" /> {loading ? "Analisando..." : "Analisar com IA"}
      </button>
    </div>
  );
}
