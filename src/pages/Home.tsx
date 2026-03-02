import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import EmptyState from "../components/EmptyState"
import PageLayout from "../components/PageLayout"
import ProductCard from "../components/ProductCard"
import ProductGridSkeleton from "../components/Skeletons"
import { getAllProducts } from "../services/productService"
import type { Product } from "../types/product"

const TOP_DEALS_PER_PAGE = 8
const CATEGORY_PRODUCTS_PER_PAGE = 8

const Home = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [topDealsPage, setTopDealsPage] = useState(1)
  const [categoryPage, setCategoryPage] = useState(1)
  const [categoryQuery, setCategoryQuery] = useState("")
  const [categoryFocused, setCategoryFocused] = useState(false)
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


  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [products]
  )

  const todayTopDeals = useMemo(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const day = now.getDate()

    return sortedProducts.filter((product) => {
      const created = new Date(product.created_at)
      return (
        created.getFullYear() == year &&
        created.getMonth() == month &&
        created.getDate() == day
      )
    })
  }, [sortedProducts])

  const categories = useMemo(() => ["All", ...new Set(products.map((p) => p.category))], [products])

  const visibleCategoryQuery = categoryFocused ? categoryQuery : selectedCategory === "All" ? "" : selectedCategory

  const categorySuggestions = useMemo(() => {
    if (!visibleCategoryQuery.trim()) return categories
    const needle = visibleCategoryQuery.trim().toLowerCase()
    return categories.filter((category) => category.toLowerCase().includes(needle))
  }, [visibleCategoryQuery, categories])

  const productSuggestions = useMemo(() => {
    if (!debouncedQuery) return []
    return products.filter((p) => p.title.toLowerCase().includes(debouncedQuery)).slice(0, 6)
  }, [debouncedQuery, products])

  const filteredCategoryProducts = useMemo(() => {
    return sortedProducts.filter((product) => {
      const matchesSearch = debouncedQuery ? product.title.toLowerCase().includes(debouncedQuery) : true
      const matchesCategory = selectedCategory === "All" ? true : product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [sortedProducts, debouncedQuery, selectedCategory])

  const topDealsTotalPages = Math.max(1, Math.ceil(todayTopDeals.length / TOP_DEALS_PER_PAGE))
  const pagedTopDeals = useMemo(() => {
    const start = (topDealsPage - 1) * TOP_DEALS_PER_PAGE
    return todayTopDeals.slice(start, start + TOP_DEALS_PER_PAGE)
  }, [todayTopDeals, topDealsPage])

  const categoryTotalPages = Math.max(1, Math.ceil(filteredCategoryProducts.length / CATEGORY_PRODUCTS_PER_PAGE))
  const pagedCategoryProducts = useMemo(() => {
    const start = (categoryPage - 1) * CATEGORY_PRODUCTS_PER_PAGE
    return filteredCategoryProducts.slice(start, start + CATEGORY_PRODUCTS_PER_PAGE)
  }, [filteredCategoryProducts, categoryPage])

  if (loading) return <ProductGridSkeleton />

  return (
    <PageLayout
      title="Peak-Kart Deals"
      subtitle="Single-page deal list: product image, name, price and direct Buy Now."
    >
      <section className="section-block">
        <h3>Today Top Deals</h3>
        <p className="section-note">Only products added today are shown here. This resets automatically after midnight.</p>
        {pagedTopDeals.length === 0 ? (
          <EmptyState title="No new deals today" description="Add products today to feature them in Today Top Deals." />
        ) : (
          <div className="grid">
            {pagedTopDeals.map((product) => (
              <ProductCard key={`top-${product.id}`} product={product} />
            ))}
          </div>
        )}
        <div className="pagination-row">
          <button type="button" disabled={topDealsPage === 1} onClick={() => setTopDealsPage((prev) => prev - 1)}>
            Previous
          </button>
          <span>Page {topDealsPage} / {topDealsTotalPages}</span>
          <button
            type="button"
            disabled={topDealsPage === topDealsTotalPages}
            onClick={() => setTopDealsPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </section>

      <section className="section-block top-categories top-first" id="categories">
        <h3>Categories</h3>
        <div className="category-filter-wrap">
          <input
            type="search"
            value={visibleCategoryQuery}
            className="search-input"
            placeholder="Search category"
            onFocus={() => {
              setCategoryFocused(true)
              setCategoryQuery(selectedCategory === "All" ? "" : selectedCategory)
            }}
            onBlur={() => setTimeout(() => setCategoryFocused(false), 120)}
            onChange={(event) => setCategoryQuery(event.target.value)}
          />
          {categoryFocused && categorySuggestions.length > 0 && (
            <div className="inline-suggestions">
              {categorySuggestions.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setCategoryPage(1)
                    setCategoryQuery(category === "All" ? "" : category)
                    setCategoryFocused(false)
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
          )}
        </div>
      </section>

      <section className="filters-toolbar">
        <div className="search-stack">
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setCategoryPage(1)
            }}
            placeholder="Search deals"
            className="search-input"
          />
          {productSuggestions.length > 0 && (
            <div className="inline-suggestions">
              {productSuggestions.map((item) => (
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

      {pagedCategoryProducts.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try a different search term or category."
        />
      ) : (
        <div className="grid">
          {pagedCategoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <div className="pagination-row">
        <button type="button" disabled={categoryPage === 1} onClick={() => setCategoryPage((prev) => prev - 1)}>
          Previous
        </button>
        <span>Page {categoryPage} / {categoryTotalPages}</span>
        <button
          type="button"
          disabled={categoryPage === categoryTotalPages}
          onClick={() => setCategoryPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </PageLayout>
  )
}

export default Home
