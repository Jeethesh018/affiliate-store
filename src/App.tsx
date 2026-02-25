import { BrowserRouter, Route, Routes } from "react-router-dom"
import Header from "./components/Header"
import AdminAnalytics from "./pages/AdminAnalytics"
import CategoryPage from "./pages/CategoryPage"
import Home from "./pages/Home"
import ProductDetails from "./pages/ProductDetails"

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
