import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import EmptyState from "../components/EmptyState"
import PageLayout from "../components/PageLayout"
import ProductCard from "../components/ProductCard"
import { ProductDetailsSkeleton } from "../components/Skeletons"
import {
  getAllProducts,
  getProductById,
  trackProductClick,
} from "../services/productService"
import type { Product } from "../types/product"

interface ProductDetailsProps {
  comparedMap: Set<string>
  onToggleCompare: (product: Product) => void
}

const ProductDetails = ({ comparedMap, onToggleCompare }: ProductDetailsProps) => {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return

      const [productData, allProducts] = await Promise.all([
        getProductById(id),
        getAllProducts(),
      ])

      setProduct(productData)
      setRelatedProducts(allProducts)
      setLoading(false)

      if (productData) {
        document.title = `${productData.title} | PeakCart`
        const meta = document.querySelector('meta[name="description"]')
        if (meta) {
          meta.setAttribute("content", `${productData.title} at ₹${productData.price}. Performance-focused product recommendation.`)
        }
      }
    }

    fetchProduct()
  }, [id])

  const matchedRelatedProducts = useMemo(() => {
    if (!product) return []

    return relatedProducts
      .filter((item) => item.category === product.category && item.id !== product.id)
      .slice(0, 4)
  }, [product, relatedProducts])

  if (loading) return <ProductDetailsSkeleton />
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

  const performanceScore = Math.min(100, Math.round((product.rating ?? 3.8) * 20))

  return (
    <PageLayout>
      <div className="details-container">
        <div className="details-grid">
          <div className="image-section">
            <img src={product.image_url} alt={product.title} className="details-image" loading="lazy" />
          </div>

          <div className="info-section">
            <span className="detail-category">{product.category}</span>
            <h1>{product.title}</h1>
            <p className="price">₹{product.price}</p>

            {product.rating && <p className="rating">Rating: {product.rating} ⭐</p>}

            <div className="detail-section">
              <h3>Why This Product?</h3>
              <p><strong>Best For:</strong> Performance-driven buyers seeking reliable quality.</p>
              <p><strong>Not Ideal For:</strong> Ultra-budget one-time purchases.</p>
              <div className="performance-bar-wrap">
                <span>Performance Rating</span>
                <div className="performance-bar"><div style={{ width: `${performanceScore}%` }} /></div>
              </div>
            </div>

            <div className="trust-block">
              <p>✔ Secure Checkout</p>
              <p>✔ Affiliate Disclosure</p>
              <p>✔ Fast Shipping</p>
              <p>✔ Curated Selection</p>
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

        <div className="related-section">
          <h2>Related Products</h2>
          {matchedRelatedProducts.length === 0 ? (
            <EmptyState
              title="No related products"
              description="More products from this category will appear soon."
            />
          ) : (
            <div className="grid">
              {matchedRelatedProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  isCompared={comparedMap.has(item.id)}
                  onToggleCompare={onToggleCompare}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}

export default ProductDetails
