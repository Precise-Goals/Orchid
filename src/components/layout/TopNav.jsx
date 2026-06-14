import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FiLogOut, FiMoon, FiSun, FiUser, FiVolume2, FiVolumeX } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'

export function TopNav({ theme, onThemeChange }) {
  const { user, signOutUser } = useAuth()
  const audioRef = useRef(null)
  const [soundOn, setSoundOn] = useState(false)

  // Try autoplay on first load; browsers usually block it until a gesture
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0.8
    audio.play().then(() => setSoundOn(true)).catch(() => {
      // Blocked by browser — user must click the speaker button first
      setSoundOn(false)
    })
  }, [])

  function toggleSound() {
    const audio = audioRef.current
    if (!audio) return
    if (soundOn) {
      audio.pause()
      setSoundOn(false)
    } else {
      audio.play().catch(() => {})
      setSoundOn(true)
    }
  }

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
        <NavLink to="/account">Account</NavLink>
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

        <button
          className="icon-button"
          type="button"
          onClick={toggleSound}
          aria-label={soundOn ? 'Mute background music' : 'Play background music'}
          title={soundOn ? 'Mute' : 'Unmute'}
        >
          {soundOn ? <FiVolume2 /> : <FiVolumeX />}
        </button>
      </div>

      <audio ref={audioRef} src="/backg.mp3" loop preload="auto" />
    </header>
  )
}
