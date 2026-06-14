import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './components/auth/AuthProvider'
import { useTheme } from './hooks/useTheme'
import { TopNav } from './components/layout/TopNav'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { AboutPage } from './pages/AboutPage'
import { AuthPage } from './pages/AuthPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { AccountPage } from './pages/AccountPage'
import { ResearchPage } from './pages/ResearchPage'
import { VoicePage } from './pages/VoicePage'
import './App.css'

function AnimatedRoutes({ theme, setTheme }) {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AboutPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/onboarding"
          element={(
            <ProtectedRoute requireOnboarding={false}>
              <OnboardingPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/research"
          element={(
            <ProtectedRoute>
              <ResearchPage />
            </ProtectedRoute>
          )}
        />
        <Route path="/chat" element={<Navigate to="/research" replace />} />
        <Route
          path="/voice"
          element={(
            <ProtectedRoute>
              <VoicePage />
            </ProtectedRoute>
          )}
        />
        <Route path="/orchide-voice" element={<Navigate to="/voice" replace />} />
        <Route
          path="/account"
          element={(
            <ProtectedRoute>
              <AccountPage theme={theme} onThemeChange={setTheme} />
            </ProtectedRoute>
          )}
        />
        <Route path="/settings" element={<Navigate to="/account" replace />} />
        <Route path="/profile" element={<Navigate to="/account" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  const [theme, setTheme] = useTheme()

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-shell">
          <TopNav theme={theme} onThemeChange={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
          <main>
            <AnimatedRoutes theme={theme} setTheme={setTheme} />
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
