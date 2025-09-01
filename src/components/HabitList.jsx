import { useState } from 'react'
import { supabase } from '../lib/supabase'

const HabitList = ({ habits, onUpdate }) => {
  const [loggingHabit, setLoggingHabit] = useState(null)

  const logHabit = async (habitId, status = true) => {
    try {
      setLoggingHabit(habitId)
      const today = new Date().toISOString().split('T')[0]
      
      const { error } = await supabase
        .from('habit_logs')
        .upsert({
          habit_id: habitId,
          log_date: today,
          status
        })

      if (error) throw error
      onUpdate?.()
    } catch (error) {
      console.error('Error logging habit:', error)
    } finally {
      setLoggingHabit(null)
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {habits.map((habit) => (
        <div key={habit.id} className="card">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 truncate">
                {habit.name}
              </h3>
              {habit.description && (
                <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">
                  {habit.description}
                </p>
              )}
            </div>
            <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full ml-2 flex-shrink-0">
              {habit.category}
            </span>
          </div>

          <div className="flex space-x-2 sm:space-x-3">
            <button
              onClick={() => logHabit(habit.id, true)}
              disabled={loggingHabit === habit.id}
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white text-xs sm:text-sm font-medium py-2 px-3 sm:px-4 rounded-lg transition-colors touch-manipulation"
            >
              {loggingHabit === habit.id ? '...' : '✓ Done'}
            </button>
            <button
              onClick={() => logHabit(habit.id, false)}
              disabled={loggingHabit === habit.id}
              className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white text-xs sm:text-sm font-medium py-2 px-3 sm:px-4 rounded-lg transition-colors touch-manipulation"
            >
              {loggingHabit === habit.id ? '...' : '✗ Skip'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default HabitList
