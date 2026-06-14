import { FiBookOpen, FiClock, FiGlobe, FiMoon, FiSettings, FiSun } from 'react-icons/fi'
import { useState } from 'react'
import { languageOptions } from '../data/research'
import { useAuth } from '../hooks/useAuth'

export function SettingsPage({ theme, onThemeChange }) {
  const { profile } = useAuth()
  const [voiceCache, setVoiceCache] = useState(true)
  const [sourceStrictness, setSourceStrictness] = useState(82)
  const [language, setLanguage] = useState(profile?.language || 'English')

  return (
    <section className="settings-page">
      <div className="settings-heading">
        <p className="eyebrow">Settings</p>
        <h1>Research preferences.</h1>
        <p>Keep the interface quiet, citations strict, and voice behavior tuned to the user.</p>
      </div>
      <div className="settings-grid">
        <section className="setting-block">
          <FiSettings aria-hidden="true" />
          <div>
            <h2>Interface mode</h2>
            <p>Choose the visual mode for the workspace.</p>
          </div>
          <div className="segmented">
            <button type="button" className={theme === 'light' ? 'selected' : ''} onClick={() => onThemeChange('light')}>
              <FiSun aria-hidden="true" />
              Light
            </button>
            <button type="button" className={theme === 'dark' ? 'selected' : ''} onClick={() => onThemeChange('dark')}>
              <FiMoon aria-hidden="true" />
              Dark
            </button>
          </div>
        </section>
        <section className="setting-block">
          <FiGlobe aria-hidden="true" />
          <div>
            <h2>Default language</h2>
            <p>Set the preferred response language.</p>
          </div>
          <select value={language} onChange={(event) => setLanguage(event.target.value)}>
            {languageOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </section>
        <section className="setting-block">
          <FiBookOpen aria-hidden="true" />
          <div>
            <h2>Source strictness</h2>
            <p>Raise this for fewer but stronger citations.</p>
          </div>
          <label className="range-control">
            <span>{sourceStrictness}%</span>
            <input
              type="range"
              min="50"
              max="98"
              value={sourceStrictness}
              onChange={(event) => setSourceStrictness(event.target.value)}
            />
          </label>
        </section>
        <section className="setting-block">
          <FiClock aria-hidden="true" />
          <div>
            <h2>Voice cache</h2>
            <p>Keep synthesized responses in the current voice session.</p>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={voiceCache}
              onChange={(event) => setVoiceCache(event.target.checked)}
            />
            <span></span>
          </label>
        </section>
      </div>
    </section>
  )
}
