import { useState } from 'react'
import { Link, useLocation } from 'wouter'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [location] = useLocation()

  const isActive = (path) => location === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 dark:from-white dark:to-blue-300 bg-clip-text text-transparent">
                CollabZone
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/colleges"
              className={`nav-link ${isActive('/colleges') ? 'active' : ''}`}
            >
              Colleges
            </Link>
            <Link
              to="/social-feed"
              className={`nav-link ${isActive('/social-feed') ? 'active' : ''}`} 
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              Social Feed
            </Link>
            <Link
              to="/contact"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive('/contact') 
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              Contact
            </Link>
            
            {/* Auth Links */}
            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
              <Link
                to="/college/login"
                className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                College Login
              </Link>
              <Link
                to="/admin/login"
                className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Admin
              </Link>
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2 space-y-2">
            <Link to="/" className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg">
              Home
            </Link>
            <Link to="/colleges" className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg">
              Colleges
            </Link>
            <Link to="/social-feed" className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg">
              Social Feed
            </Link>
            <Link to="/contact" className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg">
              Contact
            </Link>
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <Link to="/college/login" className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg">
                College Login
              </Link>
              <Link to="/admin/login" className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg">
                Admin
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}