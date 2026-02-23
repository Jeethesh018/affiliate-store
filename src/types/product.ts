export interface Product {
  id: string
  title: string
  price: number
  image_url: string
  category: string
  affiliate_link: string
  rating?: number | null
  created_at: string
}