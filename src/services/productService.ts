import { supabase } from "../lib/supabase"
import type { Product } from "../types/product"


export const getAllProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return data || []
}

export const getProductsByCategory = async (
  category: string
): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching category products:", error)
    return []
  }

  return data || []
}

export const trackProductClick = async (productId: string) => {
  const { error } = await supabase
    .from("product_clicks")
    .insert([
      {
        product_id: productId,
        user_agent: navigator.userAgent,
      },
    ])

  if (error) {
    console.error("Error tracking click:", error)
  }
}