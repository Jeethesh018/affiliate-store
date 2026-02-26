import type { ReactNode } from "react"

interface PageLayoutProps {
  title?: string
  subtitle?: string
  children: ReactNode
}

const PageLayout = ({ title, subtitle, children }: PageLayoutProps) => {
  return (
    <section className="page-shell">
      {(title || subtitle) && (
        <div className="page-head">
          {title && <h1 className="page-title">{title}</h1>}
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  )
}

export default PageLayout
