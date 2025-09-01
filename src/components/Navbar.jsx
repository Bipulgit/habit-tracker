import { useState } from 'react'
// import tailwindConfig from '../../tailwind.config'

const Navbar = ({ user, onSignOut }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 safe-top">
      <div className="container-responsive">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center">
            <h1 className="text-lg sm:text-xl font-bold text-gray-800">
              <span className="sm:hidden">🎯</span>
              <span className="hidden sm:inline">🎯 Habit Tracker</span>
            </h1>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="text-xs sm:text-sm text-gray-600 max-w-32 sm:max-w-none truncate">
              {user?.user_metadata?.name || user?.email}
            </span>
            
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center text-gray-600 hover:text-gray-900 focus:outline-none touch-manipulation p-1"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm sm:text-base">
                  {(user?.user_metadata?.name || user?.email)?.[0]?.toUpperCase()}
                </div>
              </button>

              {isMenuOpen && (
                <>
                  {/* Mobile backdrop */}
                  <div 
                    className="fixed inset-0 z-10 sm:hidden" 
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    <div className="px-4 py-2 border-b border-gray-200 sm:hidden">
                      <p className="text-sm text-gray-600 truncate">
                        {user?.user_metadata?.name || user?.email}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onSignOut()
                        setIsMenuOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 touch-manipulation"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
