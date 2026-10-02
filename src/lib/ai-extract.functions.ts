import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const extractProductFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({
      url: z.string().url().max(2000).optional(),
      text: z.string().max(5000).optional(),
      image: z.string().max(8_000_000).optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) throw new Error("Apenas administradores.");
    if (!data.url && !data.text && !data.image) throw new Error("Envie um link, texto ou imagem.");
    const { extractProduct } = await import("./ai-extract.server");
    return extractProduct(data);
  });
