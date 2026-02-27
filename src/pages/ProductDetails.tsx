import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import EmptyState from "../components/EmptyState"
import PageLayout from "../components/PageLayout"
import ProductCard from "../components/ProductCard"
import { ProductDetailsSkeleton } from "../components/Skeletons"
import {
  getAllProducts,
  getComparableProducts,
  getProductById,
  inferMarketplace,
  parseProductImages,
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
  const [activeImageIndex, setActiveImageIndex] = useState(0)

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
      setActiveImageIndex(0)

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

  const sameProductOffers = useMemo(() => {
    if (!product) return []
    return [product, ...getComparableProducts(product, relatedProducts)]
      .map((item) => ({ ...item, marketplace: inferMarketplace(item.affiliate_link) }))
      .sort((a, b) => a.price - b.price)
  }, [product, relatedProducts])

  const imageList = useMemo(() => {
    if (!product) return []
    return parseProductImages(product.image_url)
  }, [product])

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
  const activeImage = imageList[activeImageIndex] || product.image_url

  return (
    <PageLayout>
      <div className="details-container">
        <div className="details-grid">
          <div className="image-section">
            <img src={activeImage} alt={product.title} className="details-image" loading="lazy" />
            {imageList.length > 1 && (
              <div className="gallery-strip">
                {imageList.map((url, index) => (
                  <button
                    key={`${url}-${index}`}
                    type="button"
                    className={`gallery-thumb ${activeImageIndex === index ? "active" : ""}`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img src={url} alt={`${product.title} view ${index + 1}`} loading="lazy" />
                  </button>
                ))}
              </div>
            )}
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

        <div className="offer-compare-section">
          <h2>Marketplace Price Comparison</h2>
          {sameProductOffers.length <= 1 ? (
            <EmptyState
              title="No alternate marketplace offers yet"
              description="Add the same product from Amazon/Flipkart/Meesho in admin to compare prices here."
            />
          ) : (
            <div className="offer-table-wrap">
              <table className="offer-table">
                <thead>
                  <tr>
                    <th>Marketplace</th>
                    <th>Price</th>
                    <th>Rating</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sameProductOffers.map((offer) => (
                    <tr key={offer.id}>
                      <td>{offer.marketplace}</td>
                      <td>₹{offer.price}</td>
                      <td>{offer.rating ?? "-"}</td>
                      <td>
                        <button
                          type="button"
                          className="compare-button"
                          onClick={async () => {
                            await trackProductClick(offer.id)
                            window.open(offer.affiliate_link, "_blank")
                          }}
                        >
                          View Deal
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          )}
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
