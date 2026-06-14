import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { FiLock, FiMail, FiUser } from 'react-icons/fi'
import { useAuth } from '../hooks/useAuth'

export function AuthPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isOnboarded, signIn, signUp } = useAuth()
  const [mode, setMode] = useState('signin')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (user && isOnboarded) {
    return <Navigate to={location.state?.from?.pathname || '/research'} replace />
  }

  if (user && !isOnboarded) {
    return <Navigate to="/onboarding" replace />
  }

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      if (mode === 'signup') {
        await signUp(form)
        navigate('/onboarding')
      } else {
        await signIn(form)
        navigate(location.state?.from?.pathname || '/research')
      }
    } catch (authError) {
      setError(authError.message.replace('Firebase: ', ''))
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">ORCHIDE account</p>
        <h1>{mode === 'signup' ? 'Create your research identity.' : 'Welcome back.'}</h1>
        <p className="auth-copy">
          Sign in with email and password to access Research, Voice, Settings, and Profile.
        </p>
        <form className="auth-form" onSubmit={submit}>
          {mode === 'signup' && (
            <label>
              <FiUser aria-hidden="true" />
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Full name"
                required
              />
            </label>
          )}
          <label>
            <FiMail aria-hidden="true" />
            <input
              value={form.email}
              type="email"
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="Email"
              required
            />
          </label>
          <label>
            <FiLock aria-hidden="true" />
            <input
              value={form.password}
              type="password"
              minLength="6"
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="Password"
              required
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" disabled={busy}>
            {busy ? 'Working...' : mode === 'signup' ? 'Create account' : 'Sign in'}
          </button>
        </form>
        <button className="text-button" type="button" onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}>
          {mode === 'signup' ? 'Already have an account? Sign in' : 'New here? Create an account'}
        </button>
        <Link className="text-button" to="/">Back to About</Link>
      </div>
    </section>
  )
}
