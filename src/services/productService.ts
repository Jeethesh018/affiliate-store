import { supabase } from "../lib/supabase"
import type { Product } from "../types/product"

export interface ProductClickAnalytics {
  productId: string
  productTitle: string
  totalClicks: number
  estimatedRevenue: number | null
}

interface ProductPayload {
  title: string
  price: number
  image_url: string
  category: string
  affiliate_link: string
  rating: number | null
}

export interface CreateProductResult {
  data: Product | null
  errorMessage: string | null
  errorCode: string | null
}

const normalizeProductTitle = (title: string) =>
  title
    .toLowerCase()
    .replace(/\b(amazon|flipkart|meesho|ajio|myntra)\b/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim()

export const inferMarketplace = (affiliateLink: string) => {
  const link = affiliateLink.toLowerCase()
  if (link.includes("amazon")) return "Amazon"
  if (link.includes("flipkart")) return "Flipkart"
  if (link.includes("meesho")) return "Meesho"
  if (link.includes("ajio")) return "Ajio"
  if (link.includes("myntra")) return "Myntra"
  return "Marketplace"
}

export const parseProductImages = (imageUrl: string): string[] => {
  return imageUrl
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

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

export const getComparableProducts = (baseProduct: Product, allProducts: Product[]) => {
  const baseNormalized = normalizeProductTitle(baseProduct.title)

  return allProducts
    .filter((item) => item.id !== baseProduct.id)
    .filter((item) => item.category === baseProduct.category)
    .filter((item) => {
      const normalized = normalizeProductTitle(item.title)
      return normalized === baseNormalized || normalized.includes(baseNormalized) || baseNormalized.includes(normalized)
    })
}

export const getCategories = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("category")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return [...new Set((data || []).map((item) => item.category).filter(Boolean))].sort()
}

export const createProduct = async (payload: ProductPayload): Promise<CreateProductResult> => {
  const { data, error } = await supabase
    .from("products")
    .insert([payload])
    .select("*")
    .single()

  if (error) {
    console.error("Error adding product:", error)

    if (error.code === "42501") {
      return {
        data: null,
        errorCode: error.code,
        errorMessage:
          "Insert blocked by Supabase RLS policy. Add an INSERT policy for products in Supabase SQL editor.",
      }
    }

    return {
      data: null,
      errorCode: error.code ?? null,
      errorMessage: error.message,
    }
  }

  return { data, errorCode: null, errorMessage: null }
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

export const getProductById = async (productId: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single()

  if (error) {
    console.error("Error fetching product details:", error)
    return null
  }

  return data
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

export const getProductClickAnalytics = async (): Promise<ProductClickAnalytics[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("id, title, product_clicks(count)")

  if (error) {
    console.error("Error fetching product analytics:", error)
    return []
  }

  return (data || [])
    .map((row) => ({
      productId: row.id,
      productTitle: row.title,
      totalClicks: row.product_clicks?.[0]?.count ?? 0,
      estimatedRevenue: null,
    }))
    .sort((a, b) => b.totalClicks - a.totalClicks)
}
