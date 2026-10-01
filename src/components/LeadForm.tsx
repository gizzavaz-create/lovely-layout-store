import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2 } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(1, "Informe seu nome").max(100),
  contact: z
    .string()
    .trim()
    .min(5, "Informe WhatsApp ou e-mail")
    .max(255)
    .refine(
      (v) => z.string().email().safeParse(v).success || /^[\d\s()+-]{8,20}$/.test(v),
      "Digite um e-mail ou WhatsApp válido",
    ),
});

export function LeadForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ name, contact });
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Dados inválidos");
    setError(null);
    setLoading(true);
    const { error } = await supabase.from("leads").insert(parsed.data);
    setLoading(false);
    if (error) return setError("Não foi possível enviar. Tente novamente.");
    setDone(true);
  }

  if (done)
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-card p-8 text-center shadow-soft">
        <CheckCircle2 className="h-10 w-10 text-primary" />
        <h3 className="text-2xl">Prontinho, {name.split(" ")[0]}!</h3>
        <p className="text-muted-foreground">Você vai receber as melhores ofertas antes de todo mundo.</p>
      </div>
    );

  return (
    <form onSubmit={onSubmit} className="grid gap-3 rounded-2xl bg-card p-6 shadow-soft sm:grid-cols-[1fr_1fr_auto]">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Seu nome"
        maxLength={100}
        aria-label="Nome"
        className="h-12 rounded-full border border-input bg-background px-5 outline-none focus:ring-2 focus:ring-ring"
      />
      <input
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        placeholder="WhatsApp ou e-mail"
        maxLength={255}
        aria-label="WhatsApp ou e-mail"
        className="h-12 rounded-full border border-input bg-background px-5 outline-none focus:ring-2 focus:ring-ring"
      />
      <button
        disabled={loading}
        className="h-12 rounded-full bg-primary px-6 font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Enviando..." : "Quero receber"}
      </button>
      {error && <p className="text-sm text-destructive sm:col-span-3">{error}</p>}
    </form>
  );
}
