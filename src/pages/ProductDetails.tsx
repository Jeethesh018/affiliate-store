import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import EmptyState from "../components/EmptyState"
import Loader from "../components/Loader"
import PageLayout from "../components/PageLayout"
import {
  getAllProducts,
  getProductById,
  trackProductClick,
} from "../services/productService"
import type { Product } from "../types/product"

const ProductDetails = () => {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return

      const data = await getProductById(id)
      setProduct(data)
      setLoading(false)
    }

    fetchProduct()
  }, [id])

  useEffect(() => {
    const fetchRelated = async () => {
      const allProducts = await getAllProducts()
      setRelatedProducts(allProducts)
    }

    fetchRelated()
  }, [])

  const matchedRelatedProducts = useMemo(() => {
    if (!product) return []

    return relatedProducts
      .filter((item) => item.category === product.category && item.id !== product.id)
      .slice(0, 4)
  }, [product, relatedProducts])

  if (loading) return <Loader label="Loading product details..." />
  if (!product) {
    return (
      <PageLayout>
        <EmptyState
          title="Product not found"
          description="This product may have been removed or is temporarily unavailable."
        />
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="details-container">
        <div className="details-grid">
          <div className="image-section">
            <img src={product.image_url} alt={product.title} className="details-image" />
          </div>

          <div className="info-section">
            <span className="detail-category">{product.category}</span>
            <h1>{product.title}</h1>
            <p className="price">₹{product.price}</p>

            {product.rating && <p className="rating">Rating: {product.rating} ⭐</p>}

            <div className="trust-block">
              <p>✔ Curated for performance-first lifestyle goals</p>
              <p>✔ Price-to-value verified before listing</p>
              <p>✔ Affiliate click tracking for quality optimization</p>
            </div>

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

        {matchedRelatedProducts.length > 0 && (
          <div className="related-section">
            <h2>Related Picks</h2>
            <div className="grid">
              {matchedRelatedProducts.map((item) => (
                <article key={item.id} className="related-card">
                  <img src={item.image_url} alt={item.title} className="related-image" />
                  <h4>{item.title}</h4>
                  <p>₹{item.price}</p>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  )
}

export default ProductDetails
