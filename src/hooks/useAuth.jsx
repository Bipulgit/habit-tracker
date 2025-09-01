import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  // Sign up function
  const signUp = async (email, password, metadata = {}) => {
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    setLoading(false)
    return { data, error }
  }

  // Sign in function
  const signIn = async (email, password) => {
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    setLoading(false)
    return { data, error }
  }

  // Sign out function
  const signOut = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    setLoading(false)
    return { error }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
