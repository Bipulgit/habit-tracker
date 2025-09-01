import { useState } from 'react'

const Navbar = ({ user, onSignOut }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800">
              🎯 Habit Tracker
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              {user?.user_metadata?.name || user?.email}
            </span>
            
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                  {(user?.user_metadata?.name || user?.email)?.[0]?.toUpperCase()}
                </div>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  <button
                    onClick={() => {
                      onSignOut()
                      setIsMenuOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
