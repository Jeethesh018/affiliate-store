import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import EmptyState from "../components/EmptyState"
import PageLayout from "../components/PageLayout"
import ProductCard from "../components/ProductCard"
import Reveal from "../components/Reveal"
import ProductGridSkeleton from "../components/Skeletons"
import { getAllProducts, getProductClickAnalytics } from "../services/productService"
import type { Product } from "../types/product"

const PRODUCTS_PER_PAGE = 8

const Home = ({ comparedMap, onToggleCompare }: HomeProps) => {
  const [products, setProducts] = useState<Product[]>([])
  const [trendingIds, setTrendingIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("latest")
  const [maxPrice, setMaxPrice] = useState(50000)
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

    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.setAttribute("content", "Peak-Kart | Premium Affiliate Deals")

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

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 300)
    return () => clearTimeout(timer)
  }, [query])


  const categories = useMemo(() => {
    return ["All", ...new Set(products.map((product) => product.category))]
  }, [products])

  const maxAvailablePrice = useMemo(() => {
    if (products.length === 0) return 50000
    return Math.max(...products.map((item) => Number(item.price) || 0))
  }, [products])

  const featuredDeals = useMemo(() => {
    return [...products]
      .sort((a, b) => (a.rating ?? 0) < (b.rating ?? 0) ? 1 : -1)
      .slice(0, 6)
  }, [products])

  const filteredProducts = useMemo(() => {
    const searched = products.filter((product) => {
      const matchesSearch = debouncedQuery ? product.title.toLowerCase().includes(debouncedQuery) : true
      const matchesCategory = selectedCategory === "All" ? true : product.category === selectedCategory
      const matchesPrice = Number(product.price) <= maxPrice
      return matchesSearch && matchesCategory && matchesPrice
    })

    if (sortBy === "price-low") return [...searched].sort((a, b) => a.price - b.price)
    if (sortBy === "price-high") return [...searched].sort((a, b) => b.price - a.price)
    if (sortBy === "rating") return [...searched].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    return searched
  }, [products, debouncedQuery, selectedCategory, sortBy, maxPrice])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE))

  const pagedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE)
  }, [filteredProducts, currentPage])

  const trendingProducts = useMemo(
    () => products.filter((product) => trendingIds.includes(product.id)).slice(0, 5),
    [products, trendingIds]
  )

  if (loading) return <ProductGridSkeleton />

  return (
    <PageLayout
      title="Premium Deals for Smart Buyers"
      subtitle="Curated high-conversion offers across performance lifestyle categories."
    >
      <section className="hero-section">
        <div>
          <h2>Shop smarter. Save bigger. Move faster.</h2>
          <p>Find verified affiliate deals in tech, accessories, and daily essentials with confidence.</p>
          <Link className="hero-cta" to="/category/Electronics">Explore Deals</Link>
        </div>
      </section>

      <section className="filters-toolbar">
        <input
          type="search"
          value={query}
          onChange={(event) => { setQuery(event.target.value); setCurrentPage(1) }}
          placeholder="Search deals"
          className="search-input"
        />
        <select value={selectedCategory} onChange={(event) => { setSelectedCategory(event.target.value); setCurrentPage(1) }}>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <select value={sortBy} onChange={(event) => { setSortBy(event.target.value); setCurrentPage(1) }}>
          <option value="latest">Sort: Latest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Rating</option>
        </select>
        <label className="price-slider-wrap">
          Max Price: ₹{maxPrice}
          <input
            type="range"
            min={0}
            max={Math.max(maxAvailablePrice, 1000)}
            value={maxPrice}
            onChange={(event) => { setMaxPrice(Number(event.target.value)); setCurrentPage(1) }}
          />
        </label>
      </section>

      <Reveal>
        <section className="featured-carousel">
          <h3>Featured Deals</h3>
          <div className="featured-row">
            {featuredDeals.map((product) => (
              <ProductCard key={`featured-${product.id}`} product={product} isPremium />
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="trending-section">
          <h3>🔥 Trending</h3>
          <div className="trending-row">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} isTrending />
            ))}
          </div>
        </section>
      </Reveal>

      <section className="top-categories">
        <h3>Top Categories</h3>
        <div className="chip-wrap">
          {categories.slice(1).map((category) => (
            <Link key={category} className="chip" to={`/category/${category}`}>
              {category}
            </Link>
          ))}
        </div>
      </section>

      {pagedProducts.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try different search/category/price filters to discover better deals."
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
