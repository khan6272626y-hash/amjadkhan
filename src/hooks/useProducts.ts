import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getImageUrl } from "@/lib/imageMap";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  image_key: string;
  category: string;
  tag: string | null;
  is_new: boolean;
  is_best: boolean;
  description: string | null;
  features: string[] | null;
  sizes: number[] | null;
  colors: string[] | null;
  rating: number | null;
  reviews: number | null;
}

const mapProduct = (row: any): Product => ({
  id: row.id,
  name: row.name,
  price: Number(row.price),
  image: getImageUrl(row.image_key),
  image_key: row.image_key,
  category: row.category,
  tag: row.tag,
  is_new: row.is_new,
  is_best: row.is_best,
  description: row.description,
  features: row.features,
  sizes: row.sizes?.map(Number),
  colors: row.colors,
  rating: row.rating ? Number(row.rating) : null,
  reviews: row.reviews,
});

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id");
      if (error) throw error;
      return (data || []).map(mapProduct);
    },
  });
};

export const useProductsByCategory = (category: string | undefined) => {
  return useQuery({
    queryKey: ["products", "category", category],
    queryFn: async () => {
      let query = supabase.from("products").select("*");

      if (category === "new") {
        query = query.eq("is_new", true);
      } else if (category === "best") {
        query = query.eq("is_best", true);
      } else if (category) {
        query = query.eq("category", category);
      }

      const { data, error } = await query.order("id");
      if (error) throw error;
      return (data || []).map(mapProduct);
    },
    enabled: !!category,
  });
};

export const useProduct = (id: number | undefined) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return mapProduct(data);
    },
    enabled: !!id,
  });
};

export const useRelatedProducts = (category: string, excludeId: number) => {
  return useQuery({
    queryKey: ["products", "related", category, excludeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", category)
        .neq("id", excludeId)
        .limit(4);
      if (error) throw error;
      return (data || []).map(mapProduct);
    },
    enabled: !!category && !!excludeId,
  });
};
