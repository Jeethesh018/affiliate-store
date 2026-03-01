import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { getCategories } from "../services/productService"

interface HeaderProduct {
  id: string
  title: string
  affiliate_link: string
}

interface HeaderProps {
  products: HeaderProduct[]
}

const Header = ({ products }: HeaderProps) => {
  const [categories, setCategories] = useState<string[]>([])
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const loadCategories = async () => {
      const allCategories = await getCategories()
      setCategories(allCategories)
    }

    loadCategories()
    window.addEventListener("categories-updated", loadCategories)
    return () => window.removeEventListener("categories-updated", loadCategories)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 250)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const suggestions = useMemo(() => {
    if (!debouncedQuery) return []
    return products
      .filter((product) => product.title.toLowerCase().includes(debouncedQuery))
      .slice(0, 6)
  }, [debouncedQuery, products])

  const openDeal = (id: string) => {
    const product = products.find((item) => item.id === id)
    if (!product) return
    window.open(product.affiliate_link, "_blank", "noopener,noreferrer")
    setQuery("")
  }

  return (
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <Link to="/" className="brand-wrap">
        <img src="/peakkart-logo.svg" alt="PeakKart" className="brand-logo-image" />
      </Link>

      <div className="header-search-wrap">
        <input
          className="header-search"
          placeholder="Search products"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && suggestions[0]) {
              event.preventDefault()
              openDeal(suggestions[0].id)
            }
          }}
        />
        {suggestions.length > 0 && (
          <div className="search-suggestions">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                onClick={() => openDeal(suggestion.id)}
              >
                {suggestion.title}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        className="menu-toggle"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        ☰
      </button>

      <nav className={`site-nav ${menuOpen ? "open" : ""}`}>
        <div className="category-dropdown">
          <button className="category-trigger" type="button">
            Categories ▾
          </button>
          <div className="category-menu">
            {categories.length === 0 ? (
              <span className="category-empty">No categories yet</span>
            ) : (
              categories.map((category) => (
                <Link key={category} to={`/?category=${encodeURIComponent(category)}`} onClick={() => setMenuOpen(false)}>
                  {category}
                </Link>
              ))
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
