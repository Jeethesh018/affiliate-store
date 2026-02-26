import { lazy, Suspense, useEffect, useMemo, useState } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import ComparisonBar from "./components/ComparisonBar"
import Layout from "./components/Layout"
import { getAllProducts } from "./services/productService"
import type { Product } from "./types/product"
import AdminAnalytics from "./pages/AdminAnalytics"
import AdminDashboard from "./pages/AdminDashboard"
import CategoryPage from "./pages/CategoryPage"
import Home from "./pages/Home"
import ProductDetails from "./pages/ProductDetails"

const ComparisonModal = lazy(() => import("./components/ComparisonModal"))

function App() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [comparedProducts, setComparedProducts] = useState<Product[]>([])
  const [isComparisonOpen, setIsComparisonOpen] = useState(false)
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

  const comparedMap = useMemo(() => {
    return new Set(comparedProducts.map((product) => product.id))
  }, [comparedProducts])

  const toggleCompare = (product: Product) => {
    setComparedProducts((prev) => {
      if (prev.find((p) => p.id === product.id)) {
        return prev.filter((p) => p.id !== product.id)
      }
      if (prev.length >= 3) return prev
      return [...prev, product]
    })
  }

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
          <Route
            path="/"
            element={
              <Home
                comparedMap={comparedMap}
                onToggleCompare={toggleCompare}
              />
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProductDetails
                comparedMap={comparedMap}
                onToggleCompare={toggleCompare}
              />
            }
          />
          <Route
            path="/category/:categoryName"
            element={
              <CategoryPage
                comparedMap={comparedMap}
                onToggleCompare={toggleCompare}
              />
            }
          />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
        </Route>
      </Routes>

      <ComparisonBar
        items={comparedProducts}
        onOpen={() => setIsComparisonOpen(true)}
        onClear={() => setComparedProducts([])}
      />

      {isComparisonOpen && (
        <Suspense fallback={null}>
          <ComparisonModal
            products={comparedProducts}
            onClose={() => setIsComparisonOpen(false)}
          />
        </Suspense>
      )}
    </BrowserRouter>
  )
}

export default App
