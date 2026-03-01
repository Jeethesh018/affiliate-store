import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import EmptyState from "../components/EmptyState"
import PageLayout from "../components/PageLayout"
import ProductCard from "../components/ProductCard"
import ProductGridSkeleton from "../components/Skeletons"
import { getAllProducts } from "../services/productService"
import type { Product } from "../types/product"

const PRODUCTS_PER_PAGE = 8

const Home = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [params, setParams] = useSearchParams()
  const selectedCategory = params.get("category") ?? "All"

  useEffect(() => {
    document.title = "Peak-Kart | Deals"

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
    return products
      .filter((product) => {
        const matchesSearch = debouncedQuery ? product.title.toLowerCase().includes(debouncedQuery) : true
        const matchesCategory = selectedCategory === "All" ? true : product.category === selectedCategory
        return matchesSearch && matchesCategory
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }, [products, debouncedQuery, selectedCategory])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE))
  const pagedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE)
  }, [filteredProducts, currentPage])

  if (loading) return <ProductGridSkeleton />

  return (
    <PageLayout
      title="Peak-Kart Deals"
      subtitle="Single-page deal list: product image, name, price and direct Buy Now."
    >
      <section className="top-categories top-first" id="categories">
        <h3>Categories</h3>
        <div className="chip-wrap">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`chip ${selectedCategory === category ? "active" : ""}`}
              onClick={() => {
                setCurrentPage(1)
                if (category === "All") {
                  setParams({})
                  return
                }
                setParams({ category })
              }}
            >
              {category}
            </button>
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
      </section>

      {pagedProducts.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try a different search term or category."
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
