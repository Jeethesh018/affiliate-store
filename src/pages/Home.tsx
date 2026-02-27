import { useEffect, useMemo, useState } from "react"
import EmptyState from "../components/EmptyState"
import PageLayout from "../components/PageLayout"
import ProductCard from "../components/ProductCard"
import Reveal from "../components/Reveal"
import ProductGridSkeleton from "../components/Skeletons"
import {
  getAllProducts,
  getProductClickAnalytics,
} from "../services/productService"
import type { Product } from "../types/product"

const Home = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [trendingIds, setTrendingIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")

  useEffect(() => {
    document.title = "PeakCart | Performance Lifestyle Picks"
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute("content", "Discover performance products, smart tech and lifestyle upgrades.")

    const fetchProducts = async () => {
      const [productData, analyticsData] = await Promise.all([
        getAllProducts(),
        getProductClickAnalytics(),
      ])
      setProducts(productData)
      setTrendingIds(analyticsData.slice(0, 5).map((item) => item.productId))
      setLoading(false)
    }

    fetchProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return products

    return products.filter((product) => product.title.toLowerCase().includes(normalizedQuery))
  }, [products, query])

  const trendingProducts = useMemo(
    () => products.filter((product) => trendingIds.includes(product.id)).slice(0, 5),
    [products, trendingIds]
  )

  if (loading) return <ProductGridSkeleton />

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
          placeholder="Search products"
          className="search-input"
        />
      </div>

      <Reveal>
        <section className="trending-section">
          <h2>🔥 Trending</h2>
          <div className="trending-row">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} isTrending />
            ))}
          </div>
        </section>
      </Reveal>

      {filteredProducts.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try another keyword to explore curated performance picks."
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
