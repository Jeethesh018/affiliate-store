import { Link, NavLink } from "react-router-dom"

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
        <span className="logo">FitShapers</span>
        <span className="logo-tag">Performance Lifestyle Picks</span>
      </Link>

      <nav className="nav">
        <NavLink to="/category/Electronics">Smart Tech</NavLink>
        <NavLink to="/category/Accessories">Accessories</NavLink>
        <NavLink to="/category/Gadgets">Productivity</NavLink>
        <NavLink to="/admin/analytics">Analytics</NavLink>
      </nav>
    </header>
  )
}

export default Header
