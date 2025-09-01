import { useState } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
// import tailwindConfig from '../../tailwind.config.js'

const Auth = ({ view: initialView = 'signin' }) => {
  const [view, setView] = useState(initialView)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const { signIn, signUp } = useAuth()

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (view === 'signin') {
        const { error } = await signIn(email, password)
        if (error) throw error
        setMessage('Successfully signed in!')
      } else {
        const { error } = await signUp(email, password, { name })
        if (error) throw error
        setMessage('Check your email for confirmation link!')
      }
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 safe-top safe-bottom">
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            🎯 Habit Tracker
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {view === 'signin' ? 'Welcome back!' : 'Start your journey'}
          </p>
        </div>

        {message && (
          <div className={`p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 text-sm sm:text-base ${
            message.includes('Successfully') || message.includes('Check your email')
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4 sm:space-y-6">
          {view === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 touch-manipulation"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm sm:text-base">
                  {view === 'signin' ? 'Signing in...' : 'Creating account...'}
                </span>
              </span>
            ) : (
              <span className="text-sm sm:text-base">
                {view === 'signin' ? 'Sign In' : 'Create Account'}
              </span>
            )}
          </button>
        </form>

        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-sm sm:text-base text-gray-600">
            {view === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => {
                setView(view === 'signin' ? 'signup' : 'signin')
                setMessage('')
                setEmail('')
                setPassword('')
                setName('')
              }}
              className="text-blue-500 hover:text-blue-600 font-medium touch-manipulation"
            >
              {view === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Auth
