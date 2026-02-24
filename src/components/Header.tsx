import { Link } from "react-router-dom"

const Header = () => {
  return (
    <header className="header">
      <Link to="/" className="logo">
        Affiliate Store
      </Link>

      <nav className="nav">
        <Link to="/category/Electronics">Electronics</Link>
        <Link to="/category/Accessories">Accessories</Link>
        <Link to="/category/Gadgets">Gadgets</Link>
      </nav>
    </header>
  )
}

export default Header