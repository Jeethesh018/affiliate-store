import { useEffect, useMemo, useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import Header from "./Header"
import type { Product } from "../types/product"

interface LayoutProps {
  products: Product[]
}

const Layout = ({ products }: LayoutProps) => {
  const location = useLocation()
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [location.pathname, location.search])

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 260)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const searchable = useMemo(
    () => products.map((p) => ({ id: p.id, title: p.title, affiliate_link: p.affiliate_link })),
    [products]
  )

  return (
    <div className="app-shell">
      <Header products={searchable} />
      <main key={`${location.pathname}${location.search}`} className="main-content route-fade show">
        <Outlet />
      </main>

      <footer className="site-footer">© {new Date().getFullYear()} Peak-Kart. All rights reserved.</footer>

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
