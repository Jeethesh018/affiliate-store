import type { Product } from "../types/product"

interface ComparisonModalProps {
  products: Product[]
  onClose: () => void
}

const ComparisonModal = ({ products, onClose }: ComparisonModalProps) => {
  return (
    <div className="comparison-modal-overlay" role="dialog" aria-modal="true">
      <div className="comparison-modal">
        <div className="comparison-header">
          <h3>Product Comparison</h3>
          <button type="button" onClick={onClose}>Close</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Metric</th>
              {products.map((product) => (
                <th key={product.id}>{product.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Price</td>
              {products.map((product) => (
                <td key={`price-${product.id}`}>₹{product.price}</td>
              ))}
            </tr>
            <tr>
              <td>Rating</td>
              {products.map((product) => (
                <td key={`rating-${product.id}`}>{product.rating ?? "-"}</td>
              ))}
            </tr>
            <tr>
              <td>Category</td>
              {products.map((product) => (
                <td key={`category-${product.id}`}>{product.category}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ComparisonModal
