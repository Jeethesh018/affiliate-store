import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "../lib/supabase"
import type { Product } from "../types/product"
import { trackProductClick } from "../services/productService"

const ProductDetails = () => {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single()

      if (!error) {
        setProduct(data)
      }

      setLoading(false)
    }

    fetchProduct()
  }, [id])

  if (loading) return <h2>Loading...</h2>
  if (!product) return <h2>Product not found</h2>

  return (
    <div className="details-container">
      <div className="details-grid">
        <div className="image-section">
          <img
            src={product.image_url}
            alt={product.title}
            className="details-image"
          />
        </div>

        <div className="info-section">
          <h1>{product.title}</h1>
          <p className="price">₹{product.price}</p>

          {product.rating && (
            <p className="rating">Rating: {product.rating} ⭐</p>
          )}

          <button
            className="buy-button"
           onClick={async () => {
  await trackProductClick(product.id)
  window.open(product.affiliate_link, "_blank")
}}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails