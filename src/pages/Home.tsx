import { useEffect, useState } from "react"
import { getAllProducts } from "../services/productService"
import type { Product } from "../types/product"
import ProductCard from "../components/ProductCard"

const Home = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getAllProducts()
      setProducts(data)
      setLoading(false)
    }

    fetchProducts()
  }, [])

  if (loading) return <h2>Loading...</h2>

  return (
    <div className="container">
    <h1 className="heading">Affiliate Store</h1>

    <div className="grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  </div>
  )
}

export default Home