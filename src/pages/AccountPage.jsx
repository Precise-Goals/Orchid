import { Link } from 'react-router-dom'
import { 
  FiUser, FiMoon, FiSun, FiSettings, 
  FiShield, FiLogOut, FiEdit2 
} from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { languageOptions } from '../data/research'

export function AccountPage({ theme, onThemeChange }) {
  const { user, profile, signOutUser } = useAuth()

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.19, 1, 0.22, 1], staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.section 
      className="account-page"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <header className="account-header">
        <div className="profile-hero">
          <motion.div className="profile-avatar-large" variants={itemVariants}>
            {(profile?.name || user?.email || 'C').slice(0, 1).toUpperCase()}
          </motion.div>
          <div className="profile-info">
            <motion.p className="eyebrow" variants={itemVariants}>Account Identity</motion.p>
            <motion.h1 variants={itemVariants}>{profile?.name || user?.displayName || 'Codex User'}</motion.h1>
            <motion.p className="hero-text" variants={itemVariants}>
              {profile?.role || 'Researcher'} · {profile?.language || 'English'}
            </motion.p>
          </div>
        </div>
        <motion.div className="account-actions" variants={itemVariants}>
          <button className="btn-secondary" onClick={signOutUser}>
            <FiLogOut /> Sign Out
          </button>
          <Link to="/onboarding" className="btn-primary">
            <FiEdit2 /> Update Identity
          </Link>
        </motion.div>
      </header>

      <div className="account-grid">
        <motion.div className="account-card" variants={itemVariants}>
          <div className="card-header">
            <FiUser /> <h3>Profile Details</h3>
          </div>
          <div className="details-list">
            <div className="detail-item">
              <span>Email</span>
              <strong>{profile?.email || user?.email}</strong>
            </div>
            <div className="detail-item">
              <span>Mobile</span>
              <strong>{profile?.mobile || 'Not provided'}</strong>
            </div>
            <div className="detail-item">
              <span>Role</span>
              <strong>{profile?.role || 'Researcher'}</strong>
            </div>
          </div>
        </motion.div>

        <motion.div className="account-card" variants={itemVariants}>
          <div className="card-header">
            <FiSettings /> <h3>Workspace Preferences</h3>
          </div>
          <div className="settings-list">
            <div className="setting-row">
              <div className="setting-label">
                <strong>Interface Theme</strong>
                <p>Switch between light and dark modes.</p>
              </div>
              <div className="segmented-control">
                <button 
                  className={theme === 'light' ? 'active' : ''} 
                  onClick={() => onThemeChange('light')}
                >
                  <FiSun /> Light
                </button>
                <button 
                  className={theme === 'dark' ? 'active' : ''} 
                  onClick={() => onThemeChange('dark')}
                >
                  <FiMoon /> Dark
                </button>
              </div>
            </div>
            <div className="setting-row">
              <div className="setting-label">
                <strong>Research Language</strong>
                <p>Primary response language for Codex.</p>
              </div>
              <select value={profile?.language || 'English'} disabled>
                {languageOptions.map(opt => <option key={opt}>{opt}</option>)}
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div className="account-card full-width" variants={itemVariants}>
          <div className="card-header">
            <FiShield /> <h3>Security & Privacy</h3>
          </div>
          <p className="security-note">
            Your research data is encrypted and grounded via Codex Intelligence. 
            Account details are managed through Firebase Authentication.
          </p>
        </motion.div>
      </div>
    </motion.section>
  )
}
