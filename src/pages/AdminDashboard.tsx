import { useEffect, useMemo, useState, type FormEvent } from "react"
import EmptyState from "../components/EmptyState"
import Loader from "../components/Loader"
import PageLayout from "../components/PageLayout"
import {
  createProduct,
  getAllProducts,
  getCategories,
} from "../services/productService"
import type { Product } from "../types/product"

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [isErrorMessage, setIsErrorMessage] = useState(false)
  const [useNewCategory, setUseNewCategory] = useState(false)

  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [affiliateLink, setAffiliateLink] = useState("")
  const [rating, setRating] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [newCategory, setNewCategory] = useState("")

  const fetchDashboardData = async () => {
    const [allProducts, allCategories] = await Promise.all([
      getAllProducts(),
      getCategories(),
    ])

    return { allProducts, allCategories }
  }

  useEffect(() => {
    const hydrateDashboard = async () => {
      setLoading(true)
      const { allProducts, allCategories } = await fetchDashboardData()

      setProducts(allProducts)
      setCategories(allCategories)
      setSelectedCategory((prev) => prev || allCategories[0] || "")
      setLoading(false)
    }

    hydrateDashboard()
  }, [])

  const categoryValue = useMemo(() => {
    if (useNewCategory) return newCategory.trim()
    return selectedCategory.trim()
  }, [newCategory, selectedCategory, useNewCategory])

  const resetForm = () => {
    setTitle("")
    setPrice("")
    setImageUrl("")
    setAffiliateLink("")
    setRating("")
    setNewCategory("")
    setUseNewCategory(false)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)
    setIsErrorMessage(false)

    if (!categoryValue) {
      setIsErrorMessage(true)
      setMessage("Please select a category or create a new one.")
      return
    }

    setSubmitting(true)

    const created = await createProduct({
      title: title.trim(),
      price: Number(price),
      image_url: imageUrl.trim(),
      affiliate_link: affiliateLink.trim(),
      category: categoryValue,
      rating: rating.trim() ? Number(rating) : null,
    })

    if (!created.data) {
      setIsErrorMessage(true)
      setMessage(created.errorMessage || "Unable to add product. Please verify inputs and try again.")
      setSubmitting(false)
      return
    }

    const { allProducts, allCategories } = await fetchDashboardData()
    setProducts(allProducts)
    setCategories(allCategories)
    setSelectedCategory((prev) => prev || allCategories[0] || "")

    setIsErrorMessage(false)
    setMessage("Product added successfully. Category navigation is now updated.")
    resetForm()
    window.dispatchEvent(new Event("categories-updated"))
    setSubmitting(false)
  }

  if (loading) return <Loader label="Loading admin dashboard..." />

  return (
    <PageLayout
      title="Admin Dashboard"
      subtitle="Add new affiliate products and manage dynamic categories from one place."
    >
      <section className="admin-grid">
        <div className="admin-card">
          <h3>Add New Product</h3>
          <form className="admin-form" onSubmit={handleSubmit}>
            <label>
              Product Title
              <input value={title} onChange={(event) => setTitle(event.target.value)} required />
            </label>

            <label>
              Price (INR)
              <input
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                type="number"
                min="0"
                step="0.01"
                required
              />
            </label>

            <label>
              Image URL
              <input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} required />
            </label>

            <label>
              Affiliate Link
              <input value={affiliateLink} onChange={(event) => setAffiliateLink(event.target.value)} required />
            </label>

            <label>
              Rating (optional)
              <input
                value={rating}
                onChange={(event) => setRating(event.target.value)}
                type="number"
                min="0"
                max="5"
                step="0.1"
              />
            </label>

            <div className="category-switch-row">
              <button
                type="button"
                className={`chip-button ${!useNewCategory ? "active" : ""}`}
                onClick={() => setUseNewCategory(false)}
              >
                Existing Category
              </button>
              <button
                type="button"
                className={`chip-button ${useNewCategory ? "active" : ""}`}
                onClick={() => setUseNewCategory(true)}
              >
                New Category
              </button>
            </div>

            {!useNewCategory ? (
              <label>
                Select Category
                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  required
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <label>
                New Category Name
                <input
                  value={newCategory}
                  onChange={(event) => setNewCategory(event.target.value)}
                  placeholder="e.g. Fitness Gear"
                  required
                />
              </label>
            )}

            <button className="buy-button" type="submit" disabled={submitting}>
              {submitting ? "Adding Product..." : "Add Product"}
            </button>
            {message && <p className={`admin-message ${isErrorMessage ? "error" : ""}`}>{message}</p>}
            <p className="admin-hint">
              If insert fails with RLS, run this in Supabase SQL editor:
              <code> create policy "Allow public insert on products" on public.products for insert to anon with check (true); </code>
            </p>
          </form>
        </div>

        <div className="admin-card">
          <h3>Current Categories</h3>
          <div className="chip-wrap">
            {categories.map((category) => (
              <span className="chip" key={category}>
                {category}
              </span>
            ))}
          </div>

          <h3 className="admin-secondary-title">Latest Products</h3>
          {products.length === 0 ? (
            <EmptyState
              title="No products yet"
              description="Start by adding your first affiliate product from this dashboard."
            />
          ) : (
            <ul className="admin-product-list">
              {products.slice(0, 8).map((product) => (
                <li key={product.id}>
                  <span>{product.title}</span>
                  <strong>{product.category}</strong>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </PageLayout>
  )
}

export default AdminDashboard
