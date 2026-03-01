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
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [scrolled, setScrolled] = useState(false)



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

  
    </header>
  )
}

export default Header
