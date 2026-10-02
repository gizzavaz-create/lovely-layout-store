import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { productsQuery, type Product } from "@/lib/products";
import { CATEGORIES, PLATFORMS, categoryName, formatPrice } from "@/lib/catalog";
import { Logo } from "@/components/SiteChrome";
import { AiProductFill } from "@/components/AiProductFill";
import { Pencil, Trash2, Plus, LogOut, Star } from "lucide-react";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Painel — GI INDICA" },
      { name: "description", content: "Painel administrativo da GI INDICA." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Painel — GI INDICA" },
      { property: "og:description", content: "Área restrita." },
    ],
  }),
  component: AdminPage,
});

const input = "h-11 w-full rounded-xl border border-input bg-background px-4 outline-none focus:ring-2 focus:ring-ring";
const btn = "inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60";

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return setIsAdmin(null);
    supabase.rpc("has_role", { _user_id: session.user.id, _role: "admin" }).then(({ data }) => setIsAdmin(!!data));
  }, [session]);

  if (!ready) return null;
  if (!session) return <Login />;
  if (isAdmin === null) return <p className="p-10 text-center">Verificando acesso...</p>;
  if (!isAdmin)
    return (
      <div className="p-10 text-center">
        <p>Esta conta não tem acesso ao painel.</p>
        <button className={`${btn} mt-4`} onClick={() => supabase.auth.signOut()}>Sair</button>
      </div>
    );
  return <Dashboard />;
}

function Login() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const p = z.object({ email: z.string().trim().email(), password: z.string().min(6) }).safeParse({ email, password });
    if (!p.success) return void toast.error("E-mail válido e senha com 6+ caracteres");
    setLoading(true);
    const res = mode === "in"
      ? await supabase.auth.signInWithPassword(p.data)
      : await supabase.auth.signUp({ ...p.data, options: { emailRedirectTo: `${window.location.origin}/admin` } });
    setLoading(false);
    if (res.error) return void toast.error(res.error.message);
    if (mode === "up" && !res.data.session) toast.success("Conta criada! Confirme pelo link enviado ao seu e-mail.");
  }

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl bg-card p-8 shadow-soft">
        <div className="text-center"><Logo /><p className="mt-2 text-sm text-muted-foreground">Painel administrativo</p></div>
        <input className={input} type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className={input} type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className={`${btn} w-full`} disabled={loading}>{mode === "in" ? "Entrar" : "Criar conta"}</button>
        <button type="button" className="w-full text-sm text-primary" onClick={() => setMode(mode === "in" ? "up" : "in")}>
          {mode === "in" ? "Primeiro acesso? Criar conta" : "Já tenho conta"}
        </button>
        <Link to="/" className="block text-center text-xs text-muted-foreground">← Voltar ao site</Link>
      </form>
    </div>
  );
}

const productSchema = z.object({
  name: z.string().trim().min(1, "Nome obrigatório").max(150),
  image_url: z.string().trim().url("URL da imagem inválida").max(1000),
  description: z.string().trim().max(500),
  price: z.number().nonnegative().nullable(),
  category: z.string().min(1),
  platform: z.string().min(1),
  affiliate_url: z.string().trim().url("Link de afiliado inválido").max(1000),
  featured: z.boolean(),
});

type Form = Omit<z.infer<typeof productSchema>, "price"> & { price: string };
const empty: Form = { name: "", image_url: "", description: "", price: "", category: CATEGORIES[0].slug, platform: PLATFORMS[0], affiliate_url: "", featured: false };

function Dashboard() {
  const qc = useQueryClient();
  const { data: products = [] } = useQuery(productsQuery);
  const { data: leads = [] } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => (await supabase.from("leads").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<Form>(empty);
  const [tab, setTab] = useState<"produtos" | "leads">("produtos");

  const totalClicks = products.reduce((s, p) => s + p.clicks, 0);

  function startEdit(p?: Product) {
    setEditing(p ? p.id : "new");
    setForm(p ? { ...p, price: p.price?.toString() ?? "" } : empty);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const parsed = productSchema.safeParse({ ...form, price: form.price === "" ? null : Number(form.price.replace(",", ".")) });
    if (!parsed.success) return void toast.error(parsed.error.issues[0]?.message);
    const { error } = editing === "new"
      ? await supabase.from("products").insert(parsed.data)
      : await supabase.from("products").update(parsed.data).eq("id", editing!);
    if (error) return void toast.error(error.message);
    toast.success("Produto salvo!");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["products"] });
  }

  async function remove(id: string) {
    if (!confirm("Remover este produto?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return void toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["products"] });
  }

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="container-site py-8">
      <header className="mb-8 flex items-center justify-between gap-4">
        <Logo />
        <div className="flex items-center gap-3">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary">Ver site</Link>
          <button className="rounded-full p-2 hover:bg-secondary" aria-label="Sair" onClick={() => supabase.auth.signOut()}><LogOut className="h-5 w-5" /></button>
        </div>
      </header>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[["Produtos", products.length], ["Cliques em “Quero este”", totalClicks], ["Leads", leads.length]].map(([l, v]) => (
          <div key={l} className="rounded-2xl bg-card p-5 shadow-soft"><p className="text-sm text-muted-foreground">{l}</p><p className="font-serif text-3xl">{v}</p></div>
        ))}
      </div>

      <div className="mb-6 flex gap-2">
        {(["produtos", "leads"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-2 text-sm capitalize ${tab === t ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>{t}</button>
        ))}
        {tab === "produtos" && <button className={`${btn} ml-auto`} onClick={() => startEdit()}><Plus className="h-4 w-4" /> Novo</button>}
      </div>

      {tab === "produtos" && editing && (
        <form onSubmit={save} className="mb-8 grid gap-3 rounded-2xl bg-card p-6 shadow-soft md:grid-cols-2">
          <h2 className="text-xl md:col-span-2">{editing === "new" ? "Novo produto" : "Editar produto"}</h2>
          <AiProductFill onResult={(r) => setForm((f) => ({
            ...f,
            name: r.name || f.name,
            description: r.description || f.description,
            category: r.category || f.category,
            platform: r.platform || f.platform,
            price: r.price != null ? String(r.price).replace(".", ",") : f.price,
            image_url: r.image_url || f.image_url,
            affiliate_url: r.url || f.affiliate_url,
          }))} />
          <input className={input} placeholder="Nome" value={form.name} onChange={(e) => set("name", e.target.value)} />
          <input className={input} placeholder="Preço (ex: 49,90)" value={form.price} onChange={(e) => set("price", e.target.value)} />
          <input className={`${input} md:col-span-2`} placeholder="URL da imagem" value={form.image_url} onChange={(e) => set("image_url", e.target.value)} />
          <textarea className={`${input} h-24 py-3 md:col-span-2`} placeholder="Descrição curta" value={form.description} onChange={(e) => set("description", e.target.value)} />
          <select className={input} value={form.category} onChange={(e) => set("category", e.target.value)}>
            {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
          <select className={input} value={form.platform} onChange={(e) => set("platform", e.target.value)}>
            {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
          </select>
          <input className={`${input} md:col-span-2`} placeholder="Link de afiliado" value={form.affiliate_url} onChange={(e) => set("affiliate_url", e.target.value)} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} /> Destaque na página inicial</label>
          <div className="flex justify-end gap-2">
            <button type="button" className="rounded-full px-5 py-2.5 text-sm hover:bg-secondary" onClick={() => setEditing(null)}>Cancelar</button>
            <button className={btn}>Salvar</button>
          </div>
        </form>
      )}

      {tab === "produtos" ? (
        <div className="space-y-3">
          {products.map((p) => (
            <div key={p.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-2xl bg-card p-3 shadow-soft">
              <img src={p.image_url} alt="" className="h-16 w-16 rounded-xl object-cover" loading="lazy" />
              <div className="min-w-0">
                <p className="flex items-center gap-1 truncate font-medium">{p.featured && <Star className="h-4 w-4 shrink-0 fill-primary text-primary" />}{p.name}</p>
                <p className="truncate text-sm text-muted-foreground">{categoryName(p.category)} · {p.platform} · {formatPrice(p.price)} · {p.clicks} cliques</p>
              </div>
              <div className="flex gap-1">
                <button className="rounded-full p-2 hover:bg-secondary" aria-label="Editar" onClick={() => startEdit(p)}><Pencil className="h-4 w-4" /></button>
                <button className="rounded-full p-2 text-destructive hover:bg-secondary" aria-label="Remover" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-card shadow-soft">
          {leads.length === 0 && <p className="p-6 text-muted-foreground">Nenhum lead ainda.</p>}
          {leads.map((l) => (
            <div key={l.id} className="flex justify-between gap-4 border-b p-4 text-sm last:border-0">
              <span className="font-medium">{l.name}</span>
              <span className="truncate">{l.contact}</span>
              <span className="shrink-0 text-muted-foreground">{new Date(l.created_at).toLocaleDateString("pt-BR")}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
