import type { Product } from "../types/product"

interface Props {
  product: Product
}

const ProductCard = ({ product }: Props) => {
  return (
    <div className="card">
      <img
        src={product.image_url}
        alt={product.title}
        className="product-image"
      />

      <h3 className="product-title">{product.title}</h3>

      <p className="product-price">₹{product.price}</p>

      <button
        className="buy-button"
        onClick={() =>
          window.open(product.affiliate_link, "_blank")
        }
      >
        Buy Now
      </button>
    </div>
  )
}

export default ProductCard