import type { MouseEvent } from "react"
import { useNavigate } from "react-router-dom"
import { parseProductImages, trackProductClick } from "../services/productService"
import type { Product } from "../types/product"

interface Props {
  product: Product
  isTrending?: boolean
  isEditorsPick?: boolean
  isPremium?: boolean
}

const ProductCard = ({
  product,
  isTrending,
  isEditorsPick,
  isPremium,
}: Props) => {
  const navigate = useNavigate()
  const primaryImage = parseProductImages(product.image_url)[0] || product.image_url

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
      <img src={primaryImage} alt={product.title} className="product-image" loading="lazy" />
      <h3 className="product-title">{product.title}</h3>
      <p className="product-price">₹{product.price}</p>
      <div className="card-actions">
        <button className="buy-button" onClick={handleQuickBuy}>
          Buy Now
        </button>
      </div>
    </article>
  )
}

export default ProductCard
