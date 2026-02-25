import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import EmptyState from "../components/EmptyState"
import Loader from "../components/Loader"
import PageLayout from "../components/PageLayout"
import ProductCard from "../components/ProductCard"
import { getProductsByCategory } from "../services/productService"
import type { Product } from "../types/product"

const CategoryPage = () => {
  const { categoryName } = useParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")

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

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return products

    return products.filter((product) => product.title.toLowerCase().includes(normalizedQuery))
  }, [products, query])

  if (loading) return <Loader label="Loading category products..." />

  return (
    <PageLayout
      title={`${categoryName} Essentials`}
      subtitle="Curated tools to improve execution, output, and consistency."
    >
      <div className="search-row">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={`Search in ${categoryName}`}
          className="search-input"
        />
      </div>

      {filteredProducts.length === 0 ? (
        <EmptyState
          title="No products found"
          description="This category is being refreshed. Check back soon for updated high-performance picks."
        />
      ) : (
        <div className="grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </PageLayout>
  )
}

export default CategoryPage
