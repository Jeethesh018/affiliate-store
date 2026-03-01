import { useMemo, useState, type ReactNode } from "react"

interface AdminGuardProps {
  children: ReactNode
}

const ADMIN_USER = "PeakKart-21"
const ADMIN_PASS = "PeakKart@018"
const STORAGE_KEY = "peakkart-admin-auth"

const AdminGuard = ({ children }: AdminGuardProps) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [authed, setAuthed] = useState(() => localStorage.getItem(STORAGE_KEY) === "1")

  const title = useMemo(() => (authed ? "" : "Admin Login"), [authed])

  if (authed) return <>{children}</>

  return (
    <section className="admin-auth-wrap">
      <div className="admin-auth-card">
        <h2>{title}</h2>
        <p>Login required to access admin pages.</p>

        <label>
          Username
          <input value={username} onChange={(event) => setUsername(event.target.value)} />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        <button
          type="button"
          className="buy-button"
          onClick={() => {
            if (username === ADMIN_USER && password === ADMIN_PASS) {
              setAuthed(true)
              localStorage.setItem(STORAGE_KEY, "1")
              setError("")
              return
            }

            setError("Invalid credentials")
          }}
        >
          Login
        </button>

        {error && <p className="admin-message error">{error}</p>}
      </div>
    </section>
  )
}

export default AdminGuard
