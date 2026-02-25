import { Link, NavLink } from "react-router-dom"

const Header = () => {
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
