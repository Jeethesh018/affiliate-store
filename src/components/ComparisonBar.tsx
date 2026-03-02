import type { Product } from "../types/product"

interface ComparisonBarProps {
  items: Product[]
  onOpen: () => void
  onClear: () => void
}

const ComparisonBar = ({ items, onOpen, onClear }: ComparisonBarProps) => {
  if (items.length === 0) return null

  return (
    <div className="comparison-bar">
      <p>{items.length} product(s) selected for compare</p>
      <div>
        <button type="button" onClick={onOpen}>Compare</button>
        <button type="button" onClick={onClear}>Clear</button>
      </div>
    </div>
  )
}

export default ComparisonBar
