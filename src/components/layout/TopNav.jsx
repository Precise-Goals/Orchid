import { NavLink } from 'react-router-dom'
import { FiLogOut, FiMoon, FiSun, FiUser } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'

export function TopNav({ theme, onThemeChange }) {
  const { user, signOutUser } = useAuth()

  return (
    <header className="top-nav">
      <NavLink to="/" className="brand" aria-label="CODEX home">
        <img src="/logo.png" alt="" />
        <span>CODEX</span>
      </NavLink>
      <nav aria-label="Primary navigation">
        <NavLink to="/">About</NavLink>
        <NavLink to="/research">Research</NavLink>
        <NavLink to="/voice">Orchid</NavLink>
        <NavLink to="/settings">Settings</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </nav>
      <div className="nav-actions">
        {user ? (
          <button className="icon-button" type="button" onClick={signOutUser} aria-label="Sign out">
            <FiLogOut />
          </button>
        ) : (
          <NavLink className="icon-button" to="/auth" aria-label="Sign in">
            <FiUser />
          </NavLink>
        )}
        <button className="icon-button" type="button" onClick={onThemeChange} aria-label="Toggle theme">
          {theme === 'light' ? <FiMoon /> : <FiSun />}
        </button>
      </div>
    </header>
  )
}
