interface LoaderProps {
  label?: string
}

const Loader = ({ label = "Loading..." }: LoaderProps) => {
  return (
    <div className="loader-wrap" role="status" aria-live="polite">
      <span className="loader-dot" />
      <p>{label}</p>
    </div>
  )
}

export default Loader
