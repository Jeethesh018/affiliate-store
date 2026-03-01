import { useState, type ReactNode } from "react"

interface AdminGuardProps {
  children: ReactNode
}

const ADMIN_USER = "PeakKart-21"
const ADMIN_PASS = "PeakKart@018"

const AdminGuard = ({ children }: AdminGuardProps) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [authed, setAuthed] = useState(false)

  if (authed) {
    return (
      <>
        {children}
        <div className="admin-logout-wrap">
          <button
            type="button"
            className="category-trigger"
            onClick={() => {
              setAuthed(false)
              setUsername("")
              setPassword("")
            }}
          >
            Logout
          </button>
        </div>
      </>
    )
  }

  return (
    <section className="admin-auth-wrap">
      <div className="admin-auth-card">
        <h2>Admin Login</h2>
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
