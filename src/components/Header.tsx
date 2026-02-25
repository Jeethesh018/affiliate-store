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
    <header className="header">
      <Link to="/" className="logo-wrap">
        <span className="logo">PeakCart</span>
        <span className="logo-tag">Performance Lifestyle Marketplace</span>
      </Link>

      <nav className="nav">
        <div className="nav-dropdown">
          <button className="dropdown-trigger" type="button">
            Categories
          </button>
          <div className="dropdown-menu">
            {categories.map((category) => (
              <NavLink key={category} to={`/category/${category}`}>
                {category}
              </NavLink>
            ))}
          </div>
        </div>
        <NavLink to="/admin">Admin</NavLink>
        <NavLink to="/admin/analytics">Analytics</NavLink>
      </nav>
    </header>
  )
}

export default Header
