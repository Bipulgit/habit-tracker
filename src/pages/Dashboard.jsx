import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import HabitList from '../components/HabitList'
import HabitForm from '../components/HabitForm'

const Dashboard = () => {
  const { user, signOut } = useAuth()
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (user) {
      fetchHabits()
    }
  }, [user])

  const fetchHabits = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setHabits(data || [])
    } catch (error) {
      console.error('Error fetching habits:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleHabitCreated = () => {
    fetchHabits()
    setShowForm(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 text-sm sm:text-base">Loading your habits...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 safe-bottom">
      <Navbar user={user} onSignOut={signOut} />
      
      <main className="container-responsive py-4 sm:py-6 lg:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.user_metadata?.name || user?.email?.split('@')[0]}! 👋
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Track your habits and build a better you, one day at a time.
          </p>
        </div>

        {habits.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="mx-auto text-4xl sm:text-6xl mb-4 sm:mb-6">
              🎯
            </div>
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
              No habits yet
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4">
              Get started by creating your first habit to track!
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-colors touch-manipulation"
            >
              Create Your First Habit
            </button>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Your Habits</h2>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-colors touch-manipulation"
              >
                + Add Habit
              </button>
            </div>
            <HabitList habits={habits} onUpdate={fetchHabits} />
          </div>
        )}

        {showForm && (
          <HabitForm
            onClose={() => setShowForm(false)}
            onSuccess={handleHabitCreated}
          />
        )}
      </main>
    </div>
  )
}

export default Dashboard
