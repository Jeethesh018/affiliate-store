import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import type { Product } from "../types/product"
import ProductCard from "../components/ProductCard"
import { getProductsByCategory } from "../services/productService"

const CategoryPage = () => {
  const { categoryName } = useParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchByCategory = async () => {
      if (!categoryName) return

      setLoading(true)
      const data = await getProductsByCategory(categoryName)
      setProducts(data)
      setLoading(false)
    }

    fetchByCategory()
  }, [categoryName])

  if (loading) return <h2>Loading...</h2>

  return (
    <div className="container">
      <h1>{categoryName}</h1>

      <div className="grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default CategoryPage