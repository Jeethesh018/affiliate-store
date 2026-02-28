import { useEffect, useRef, useState, type ReactNode } from "react"

interface RevealProps {
  children: ReactNode
}

const Reveal = ({ children }: RevealProps) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`reveal ${visible ? "visible" : ""}`}>
      {children}
    </div>
  )
}

export default Reveal
