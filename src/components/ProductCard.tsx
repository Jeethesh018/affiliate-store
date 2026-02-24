import type { Product } from "../types/product";
import { useNavigate } from "react-router-dom";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const navigate = useNavigate();
  return (
    <div
      className="card"
      onClick={() => navigate(`/product/${product.id}`)}
      style={{ cursor: "pointer" }}
    >
      <img
        src={product.image_url}
        alt={product.title}
        className="product-image"
      />

      <h3 className="product-title">{product.title}</h3>

      <p className="product-price">₹{product.price}</p>

      <button
        className="buy-button"
      >
        Buy Now
      </button>
    </div>
  );
};

export default ProductCard;
