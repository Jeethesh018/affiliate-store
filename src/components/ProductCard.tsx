import type { MouseEvent } from "react"
import { useNavigate } from "react-router-dom"
import { parseProductImages, trackProductClick } from "../services/productService"
import type { Product } from "../types/product"

interface Props {
  product: Product
}

const ProductCard = ({ product }: Props) => {
  const navigate = useNavigate()
  const primaryImage = parseProductImages(product.image_url)[0] || product.image_url
  const rating = product.rating ?? 4

  const handleQuickBuy = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    await trackProductClick(product.id)
    window.open(product.affiliate_link, "_blank")
  }

  return (
    <article className="card" onClick={() => navigate(`/product/${product.id}`)}>
      <img src={primaryImage} alt={product.title} className="product-image" loading="lazy" />
      <h3 className="product-title">{product.title}</h3>
      <p className="product-price">₹{product.price}</p>
      <div className="star-row" aria-label={`Rating ${rating}`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < Math.round(rating) ? "star filled" : "star"}>★</span>
        ))}
      </div>
      <div className="card-actions">
        <button className="buy-button" onClick={handleQuickBuy}>
          View Deal
        </button>
      </div>
    </article>
  )
}

export default ProductCard
