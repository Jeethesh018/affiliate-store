import { useEffect, useMemo, useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import Header from "./Header"
import type { Product } from "../types/product"

interface LayoutProps {
  products: Product[]
  darkMode: boolean
  onToggleDarkMode: () => void
}

const Layout = ({ products, darkMode, onToggleDarkMode }: LayoutProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 260)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const searchable = useMemo(
    () => products.map((p) => ({ id: p.id, title: p.title })),
    [products]
  )

  return (
    <div className={`app-shell ${darkMode ? "dark" : ""}`}>
      <Header
        products={searchable}
        onSuggestionSelect={(id) => navigate(`/product/${id}`)}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
      />
      <main key={location.pathname} className="main-content route-fade show">
        <Outlet />
      </main>

      <section className="telegram-cta-section">
        <h3>Never miss a hot deal</h3>
        <p>Join our Telegram channel for instant price drops and curated offers.</p>
        <a href="https://t.me/peakkartdeals" target="_blank" rel="noreferrer">
          Join Deals Channel
        </a>
      </section>

      <footer className="site-footer">© {new Date().getFullYear()} Peak-Kart. All rights reserved.</footer>

      <a className="telegram-float" href="https://t.me/peakkartdeals" target="_blank" rel="noreferrer">
        Telegram
      </a>

      {showScrollTop && (
        <button
          type="button"
          className="scroll-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ↑
        </button>
      )}
    </div>
  )
}

export default Layout
