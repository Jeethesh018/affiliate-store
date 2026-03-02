import { useEffect, useState } from "react"
import EmptyState from "../components/EmptyState"
import Loader from "../components/Loader"
import PageLayout from "../components/PageLayout"
import {
  getProductClickAnalytics,
  type ProductClickAnalytics,
} from "../services/productService"

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<ProductClickAnalytics[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      const data = await getProductClickAnalytics()
      setAnalytics(data)
      setLoading(false)
    }

    fetchAnalytics()
  }, [])

  if (loading) return <Loader label="Loading analytics..." />

  return (
    <PageLayout
      title="Performance Analytics"
      subtitle="Click insights to optimize product mix and affiliate execution."
    >
      <div className="analytics-card">
        <table className="analytics-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Total Clicks</th>
              <th>Estimated Revenue</th>
            </tr>
          </thead>
          <tbody>
            {analytics.length === 0 ? (
              <tr>
                <td colSpan={3}>
                  <EmptyState
                    title="No click data yet"
                    description="As traffic starts coming in, click insights will appear here."
                  />
                </td>
              </tr>
            ) : (
              analytics.map((item) => (
                <tr key={item.productId}>
                  <td>{item.productTitle}</td>
                  <td>{item.totalClicks}</td>
                  <td>{item.estimatedRevenue === null ? "Coming soon" : `₹${item.estimatedRevenue}`}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </PageLayout>
  )
}

export default AdminAnalytics
