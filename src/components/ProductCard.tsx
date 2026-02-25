import type { MouseEvent } from "react"
import { useNavigate } from "react-router-dom"
import type { Product } from "../types/product"
import { trackProductClick } from "../services/productService"

interface Props {
  product: Product
}

const ProductCard = ({ product }: Props) => {
  const navigate = useNavigate()

  const handleQuickBuy = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    await trackProductClick(product.id)
    window.open(product.affiliate_link, "_blank")
  }

  return (
    <article className="card" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="card-top-row">
        <span className="card-category">{product.category}</span>
        {product.rating ? <span className="card-rating">⭐ {product.rating}</span> : null}
      </div>

      <img src={product.image_url} alt={product.title} className="product-image" />

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
