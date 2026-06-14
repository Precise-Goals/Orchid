import { useEffect, useMemo, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { AuthContext } from '../../contexts/authContext'
import { auth, hasFirebaseConfig } from '../../config/firebase'

function profileKey(uid) {
  return `orchide-profile-${uid}`
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!hasFirebaseConfig || !auth) {
      setLoading(false)
      return undefined
    }

    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      if (nextUser) {
        const saved = localStorage.getItem(profileKey(nextUser.uid))
        setProfile(saved ? JSON.parse(saved) : null)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
  }, [])

  async function signUp({ name, email, password }) {
    if (!auth) {
      throw new Error('Firebase auth is not configured. Add the VITE_FIREBASE_* values to a .env file.')
    }

    const credential = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(credential.user, { displayName: name })
    setUser({ ...credential.user, displayName: name })
    return credential.user
  }

  function signIn({ email, password }) {
    if (!auth) {
      throw new Error('Firebase auth is not configured. Add the VITE_FIREBASE_* values to a .env file.')
    }

    return signInWithEmailAndPassword(auth, email, password)
  }

  function saveProfile(details) {
    if (!auth?.currentUser) return
    const nextProfile = {
      name: details.name.trim(),
      email: details.email.trim(),
      mobile: details.mobile.trim(),
      role: details.role,
      language: details.language,
      completedAt: new Date().toISOString(),
    }
    localStorage.setItem(profileKey(auth.currentUser.uid), JSON.stringify(nextProfile))
    setProfile(nextProfile)
  }

  const value = useMemo(() => ({
    user,
    profile,
    loading,
    isOnboarded: Boolean(profile?.name && profile?.mobile),
    signUp,
    signIn,
    saveProfile,
    signOutUser: () => (auth ? signOut(auth) : Promise.resolve()),
  }), [loading, profile, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
