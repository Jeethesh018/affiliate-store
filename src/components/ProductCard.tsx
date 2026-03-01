import type { MouseEvent } from "react"
import { parseProductImages, trackProductClick } from "../services/productService"
import type { Product } from "../types/product"

interface Props {
  product: Product
}

const ProductCard = ({ product }: Props) => {
  const primaryImage = parseProductImages(product.image_url)[0] || product.image_url

  const handleQuickBuy = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    await trackProductClick(product.id)
    window.open(product.affiliate_link, "_blank", "noopener,noreferrer")
  }

  return (
    <article className="card">
      <img src={primaryImage} alt={product.title} className="product-image" loading="lazy" />
      <h3 className="product-title">{product.title}</h3>
      <p className="product-price">₹{Number(product.price).toLocaleString("en-IN")}</p>
      <div className="card-actions">
        <button className="buy-button" onClick={handleQuickBuy}>
          Buy Now
        </button>
      </div>
    </article>
  )
}

export default ProductCard
