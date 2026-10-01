import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Product = {
  id: string;
  name: string;
  image_url: string;
  description: string;
  price: number | null;
  category: string;
  platform: string;
  affiliate_url: string;
  featured: boolean;
  clicks: number;
  created_at: string;
};

export const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Product[];
  },
});

export function trackClick(id: string) {
  void supabase.rpc("increment_click", { _product_id: id });
}
