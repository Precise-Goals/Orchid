import { Navigate, useNavigate } from 'react-router-dom'
import { FiGlobe, FiMail, FiPhone, FiUser } from 'react-icons/fi'
import { useState } from 'react'
import { languageOptions } from '../data/research'
import { useAuth } from '../hooks/useAuth'

export function OnboardingPage() {
  const navigate = useNavigate()
  const { user, profile, saveProfile } = useAuth()
  const [details, setDetails] = useState({
    name: profile?.name || user?.displayName || '',
    email: profile?.email || user?.email || '',
    mobile: profile?.mobile || '',
    role: profile?.role || 'Founder',
    language: profile?.language || 'English',
  })

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  function submit(event) {
    event.preventDefault()
    saveProfile(details)
    navigate('/research')
  }

  return (
    <section className="auth-page">
      <form className="auth-card onboarding-card" onSubmit={submit}>
        <p className="eyebrow">Onboarding</p>
        <h1>Shape your research context.</h1>
        <p className="auth-copy">
          ORCHIDE uses these details to tune language, tone, and research defaults.
        </p>
        <div className="auth-form">
          <label>
            <FiUser aria-hidden="true" />
            <input
              value={details.name}
              onChange={(event) => setDetails({ ...details, name: event.target.value })}
              placeholder="Full name"
              required
            />
          </label>
          <label>
            <FiMail aria-hidden="true" />
            <input
              value={details.email}
              type="email"
              onChange={(event) => setDetails({ ...details, email: event.target.value })}
              placeholder="Email"
              required
            />
          </label>
          <label>
            <FiPhone aria-hidden="true" />
            <input
              value={details.mobile}
              onChange={(event) => setDetails({ ...details, mobile: event.target.value })}
              placeholder="Mobile number"
              required
            />
          </label>
          <label>
            <FiUser aria-hidden="true" />
            <select value={details.role} onChange={(event) => setDetails({ ...details, role: event.target.value })}>
              <option>Founder</option>
              <option>Investor</option>
              <option>Analyst</option>
              <option>Student</option>
            </select>
          </label>
          <label>
            <FiGlobe aria-hidden="true" />
            <select value={details.language} onChange={(event) => setDetails({ ...details, language: event.target.value })}>
              {languageOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>
        <button type="submit">Finish onboarding</button>
      </form>
    </section>
  )
}
