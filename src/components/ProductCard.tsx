import type { MouseEvent } from "react"
import { useNavigate } from "react-router-dom"
import { trackProductClick } from "../services/productService"
import type { Product } from "../types/product"

interface Props {
  product: Product
  isTrending?: boolean
  isEditorsPick?: boolean
  isPremium?: boolean
  isCompared?: boolean
  onToggleCompare?: (product: Product) => void
}

const ProductCard = ({
  product,
  isTrending,
  isEditorsPick,
  isPremium,
  isCompared,
  onToggleCompare,
}: Props) => {
  const navigate = useNavigate()

  const handleQuickBuy = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    await trackProductClick(product.id)
    window.open(product.affiliate_link, "_blank")
  }

  return (
    <article className="card" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="card-badges">
        {isTrending && <span className="badge">🔥 Trending</span>}
        {isEditorsPick && <span className="badge">⭐ Editor&apos;s Pick</span>}
        {isPremium && <span className="badge">💎 Premium</span>}
      </div>
      <img src={product.image_url} alt={product.title} className="product-image" loading="lazy" />
      <h3 className="product-title">{product.title}</h3>
      <p className="product-price">₹{product.price}</p>
      <div className="card-actions">
        <button className="buy-button" onClick={handleQuickBuy}>
          Buy Now
        </button>
        {onToggleCompare && (
          <button
            type="button"
            className={`compare-button ${isCompared ? "active" : ""}`}
            onClick={(event) => {
              event.stopPropagation()
              onToggleCompare(product)
            }}
          >
            {isCompared ? "Selected" : "Compare"}
          </button>
        )}
      </div>
    </article>
  )
}

export default ProductCard
