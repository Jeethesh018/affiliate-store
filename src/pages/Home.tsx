import { useEffect, useMemo, useState } from "react"
import EmptyState from "../components/EmptyState"
import Loader from "../components/Loader"
import PageLayout from "../components/PageLayout"
import ProductCard from "../components/ProductCard"
import { getAllProducts } from "../services/productService"
import type { Product } from "../types/product"

const Home = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getAllProducts()
      setProducts(data)
      setLoading(false)
    }

    fetchProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return products

    return products.filter((product) =>
      [product.title, product.category].join(" ").toLowerCase().includes(normalizedQuery)
    )
  }, [products, query])

  if (loading) return <Loader label="Loading performance products..." />

  return (
    <PageLayout
      title="Performance Lifestyle Store"
      subtitle="High-conviction picks for fitness, focus, and smarter buying."
    >
      <div className="search-row">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by product or category"
          className="search-input"
        />
      </div>

      {filteredProducts.length === 0 ? (
        <EmptyState
          title="No products match your search"
          description="Try a broader keyword like smart watch, accessories, or productivity."
        />
      ) : (
        <div className="grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </PageLayout>
  )
}

export default Home
