import { useEffect, useState } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./components/Layout"
import { getAllProducts } from "./services/productService"
import type { Product } from "./types/product"
import AdminAnalytics from "./pages/AdminAnalytics"
import AdminGuard from "./components/AdminGuard"
import AdminDashboard from "./pages/AdminDashboard"
import Home from "./pages/Home"

function App() {
  const [allProducts, setAllProducts] = useState<Product[]>([])

  useEffect(() => {
    const loadProducts = async () => {
      const products = await getAllProducts()
      setAllProducts(products)
    }
    loadProducts()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout products={allProducts} />}>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
          <Route path="/admin/analytics" element={<AdminGuard><AdminAnalytics /></AdminGuard>} />
          <Route path="/adminAnalytics" element={<AdminGuard><AdminAnalytics /></AdminGuard>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
