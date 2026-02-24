import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import ProductDetails from "./pages/ProductDetails"
import CategoryPage from "./pages/CategoryPage"
import Header from "./components/Header"

function App() {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App