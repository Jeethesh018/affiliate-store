import { useEffect, useState } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./components/Layout"
import { getAllProducts } from "./services/productService"
import type { Product } from "./types/product"
import AdminAnalytics from "./pages/AdminAnalytics"
import AdminGuard from "./components/AdminGuard"
import AdminDashboard from "./pages/AdminDashboard"
import CategoryPage from "./pages/CategoryPage"
import Home from "./pages/Home"
import ProductDetails from "./pages/ProductDetails"

function App() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false
    const stored = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    return stored ? stored === "dark" : prefersDark
  })

  useEffect(() => {
    const loadProducts = async () => {
      const products = await getAllProducts()
      setAllProducts(products)
    }
    loadProducts()
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
    localStorage.setItem("theme", darkMode ? "dark" : "light")
  }, [darkMode])

  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <Layout
              products={allProducts}
              darkMode={darkMode}
              onToggleDarkMode={() => setDarkMode((prev) => !prev)}
            />
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
          <Route path="/admin/analytics" element={<AdminGuard><AdminAnalytics /></AdminGuard>} />
          <Route path="/adminAnalytics" element={<AdminGuard><AdminAnalytics /></AdminGuard>} />
        </Route>
      </Routes>

      
    </BrowserRouter>
  )
}

export default App
