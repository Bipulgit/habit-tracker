import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

const HabitForm = ({ onClose, onSuccess }) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'health',
    target_frequency: 1
  })
  const [loading, setLoading] = useState(false)

  const categories = [
    { value: 'health', label: 'Health & Fitness' },
    { value: 'productivity', label: 'Productivity' },
    { value: 'learning', label: 'Learning' },
    { value: 'mindfulness', label: 'Mindfulness' },
    { value: 'social', label: 'Social' },
    { value: 'general', label: 'General' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('habits')
        .insert([
          {
            ...formData,
            user_id: user.id
          }
        ])

      if (error) throw error
      onSuccess?.()
    } catch (error) {
      console.error('Error creating habit:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Create New Habit</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Habit Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Drink 8 glasses of water"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="Why is this habit important to you?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg transition-colors"
            >
              {loading ? 'Creating...' : 'Create Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default HabitForm
