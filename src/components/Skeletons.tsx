const ProductGridSkeleton = () => {
  return (
    <div className="grid">
      {Array.from({ length: 8 }).map((_, index) => (
        <div className="skeleton-card animate-pulse" key={index} />
      ))}
    </div>
  )
}

export const ProductDetailsSkeleton = () => {
  return (
    <div className="details-skeleton animate-pulse">
      <div className="details-skeleton-image" />
      <div className="details-skeleton-info" />
    </div>
  )
}

export default ProductGridSkeleton
