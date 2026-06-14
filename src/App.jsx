import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './components/auth/AuthProvider'
import { useTheme } from './hooks/useTheme'
import { TopNav } from './components/layout/TopNav'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { AboutPage } from './pages/AboutPage'
import { AuthPage } from './pages/AuthPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { ProfilePage } from './pages/ProfilePage'
import { ResearchPage } from './pages/ResearchPage'
import { SettingsPage } from './pages/SettingsPage'
import { VoicePage } from './pages/VoicePage'
import './App.css'

function App() {
  const [theme, setTheme] = useTheme()

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-shell">
          <TopNav theme={theme} onThemeChange={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
          <main>
            <Routes>
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
                path="/settings"
                element={(
                  <ProtectedRoute>
                    <SettingsPage theme={theme} onThemeChange={setTheme} />
                  </ProtectedRoute>
                )}
              />
              <Route
                path="/profile"
                element={(
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                )}
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
