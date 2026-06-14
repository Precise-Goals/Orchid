import { Link } from 'react-router-dom'
import { FiMail, FiPhone, FiUser } from 'react-icons/fi'
import { useAuth } from '../hooks/useAuth'

export function ProfilePage() {
  const { user, profile } = useAuth()

  return (
    <section className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">
          {(profile?.name || user?.email || 'O').slice(0, 1).toUpperCase()}
        </div>
        <div>
          <p className="eyebrow">Profile</p>
          <h1>{profile?.name || user?.displayName || 'ORCHIDE user'}</h1>
          <p className="hero-text">{profile?.role || 'Research user'} · {profile?.language || 'English'}</p>
        </div>
      </div>
      <div className="profile-grid">
        <ProfileField icon={FiMail} label="Email" value={profile?.email || user?.email} />
        <ProfileField icon={FiPhone} label="Mobile" value={profile?.mobile || 'Not provided'} />
        <ProfileField icon={FiUser} label="Role" value={profile?.role || 'Not provided'} />
      </div>
      <Link className="profile-edit" to="/onboarding">Update profile details</Link>
    </section>
  )
}

function ProfileField({ icon: Icon, label, value }) {
  return (
    <div className="profile-field">
      <Icon aria-hidden="true" />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}
