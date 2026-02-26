import { useEffect, useMemo } from "react"
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [location.pathname])

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
      <footer className="site-footer">© {new Date().getFullYear()} PeakCart</footer>
    </div>
  )
}

export default Layout
