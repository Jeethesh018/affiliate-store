import { useEffect, useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { getCategories } from "../services/productService"

const Header = () => {
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    const loadCategories = async () => {
      const allCategories = await getCategories()
      setCategories(allCategories)
    }

    loadCategories()

    window.addEventListener("categories-updated", loadCategories)
    return () => window.removeEventListener("categories-updated", loadCategories)
  }, [])

  return (
    <header className="site-header">
      <Link to="/" className="brand-wrap">
        <span className="brand-logo">PeakCart</span>
        <span className="brand-tag">Smart Performance Buying</span>
      </Link>

      <nav className="site-nav">
        <div className="category-dropdown">
          <button className="category-trigger" type="button">
            Categories ▾
          </button>
          <div className="category-menu">
            {categories.length === 0 ? (
              <span className="category-empty">No categories yet</span>
            ) : (
              categories.map((category) => (
                <NavLink key={category} to={`/category/${category}`}>
                  {category}
                </NavLink>
              ))
            )}
          </div>
        </div>

        <NavLink to="/admin" className="nav-pill">
          Admin
        </NavLink>
        <NavLink to="/admin/analytics" className="nav-pill nav-pill-dark">
          Analytics
        </NavLink>
      </nav>
    </header>
  )
}

export default Header
