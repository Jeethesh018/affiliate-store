import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import EmptyState from "../components/EmptyState"
import PageLayout from "../components/PageLayout"
import ProductCard from "../components/ProductCard"
import ProductGridSkeleton from "../components/Skeletons"
import { getAllProducts } from "../services/productService"
import type { Product } from "../types/product"

const PRODUCTS_PER_PAGE = 8

const Home = ({ comparedMap, onToggleCompare }: HomeProps) => {
  const [products, setProducts] = useState<Product[]>([])
  const [trendingIds, setTrendingIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    document.title = "Peak-Kart | Premium Affiliate Deals"
    const meta = document.querySelector('meta[name="description"]')
    if (meta) {
      meta.setAttribute(
        "content",
        "Peak-Kart helps you discover premium, high-value affiliate deals across smart tech, fitness, accessories and lifestyle essentials."
      )
    }

    const fetchProducts = async () => {
      const productData = await getAllProducts()
      setProducts(productData)
      setLoading(false)
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 300)
    return () => clearTimeout(timer)
  }, [query])

  const categories = useMemo(() => ["All", ...new Set(products.map((p) => p.category))], [products])

  const suggestions = useMemo(() => {
    if (!debouncedQuery) return []
    return products.filter((p) => p.title.toLowerCase().includes(debouncedQuery)).slice(0, 6)
  }, [debouncedQuery, products])

  const filteredProducts = useMemo(() => {
    const searched = products.filter((product) => {
      const matchesSearch = debouncedQuery ? product.title.toLowerCase().includes(debouncedQuery) : true
      const matchesCategory = selectedCategory === "All" ? true : product.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    return [...searched].sort((a, b) => {
      const left = new Date(a.created_at).getTime()
      const right = new Date(b.created_at).getTime()
      return sortBy === "newest" ? right - left : left - right
    })
  }, [products, debouncedQuery, selectedCategory, sortBy])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE))
  const pagedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE)
  }, [filteredProducts, currentPage])

  if (loading) return <ProductGridSkeleton />

  return (
    <PageLayout
      title="Premium Deals for Smart Buyers"
      subtitle="Curated offers across electronics, accessories and lifestyle categories."
    >
      <section className="hero-section">
        <div>
          <h2>Deals at Their Peak</h2>
          <p>Compare smarter and shop faster with trusted affiliate offers.</p>
          <Link className="hero-cta" to="/category/Electronics">Explore Deals</Link>
        </div>
      </section>

      <section className="top-categories top-first">
        <h3>Browse Categories</h3>
        <div className="chip-wrap">
          {categories.slice(1).map((category) => (
            <Link key={category} className="chip" to={`/category/${category}`}>
              {category}
            </Link>
          ))}
        </div>
      </section>

      <section className="filters-toolbar">
        <div className="search-stack">
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setCurrentPage(1)
            }}
            placeholder="Search deals"
            className="search-input"
          />
          {suggestions.length > 0 && (
            <div className="inline-suggestions">
              {suggestions.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    setQuery(item.title)
                    setDebouncedQuery(item.title.toLowerCase())
                  }}
                >
                  {item.title}
                </button>
              ))}
            </div>
          )}
        </div>

        <select
          value={selectedCategory}
          onChange={(event) => {
            setSelectedCategory(event.target.value)
            setCurrentPage(1)
          }}
        >
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(event) => {
            setSortBy(event.target.value)
            setCurrentPage(1)
          }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </section>

      {pagedProducts.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try different search/category filters to discover better deals."
        />
      ) : (
        <div className="grid">
          {pagedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <div className="pagination-row">
        <button type="button" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
          Previous
        </button>
        <span>Page {currentPage} / {totalPages}</span>
        <button type="button" disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>
          Next
        </button>
      </div>
    </PageLayout>
  )
}

export default Home
