import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navigationItems = [
  {
    name: 'Home',
    path: '/',
    icon: '🏠'
  },
  {
    name: 'Java & OOP Review',
    path: '/java-oop',
    icon: '☕',
    children: [
      { name: 'OOP Principles', path: '/java-oop/principles' },
      { name: 'Java Features', path: '/java-oop/features' },
      { name: 'Collections Framework', path: '/java-oop/collections' }
    ]
  },
  {
    name: 'Data Structures',
    path: '/data-structures',
    icon: '📊',
    children: [
      { name: 'Linear Structures', path: '/data-structures/linear' },
      { name: 'Trees', path: '/data-structures/trees' },
      { name: 'Graphs', path: '/data-structures/graphs' },
      { name: 'Hash Tables & Maps', path: '/data-structures/hash' }
    ]
  },
  {
    name: 'Algorithm Analysis',
    path: '/algorithm-analysis',
    icon: '📈',
    children: [
      { name: 'Complexity Analysis', path: '/algorithm-analysis/complexity' },
      { name: 'Performance Measurement', path: '/algorithm-analysis/performance' }
    ]
  },
  {
    name: 'Algorithms',
    path: '/algorithms',
    icon: '🔄',
    children: [
      { name: 'Searching', path: '/algorithms/searching' },
      { name: 'Sorting', path: '/algorithms/sorting' }
    ]
  }
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl">🧮</span>
              <span className="font-bold text-xl text-gray-900">SE2205A Visualizer</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div key={item.path} className="relative group">
                <Link
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
                
                {/* Dropdown for items with children */}
                {item.children && (
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-600"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <span className="text-xl">✕</span>
              ) : (
                <span className="text-xl">☰</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {navigationItems.map((item) => (
              <div key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                    isActive(item.path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
                {item.children && (
                  <div className="pl-8 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className="block px-3 py-2 rounded-md text-sm text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                        onClick={() => setIsOpen(false)}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}