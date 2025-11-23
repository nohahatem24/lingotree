/**
 * Navigation component for LingoNest
 * Provides site-wide navigation with authentication and user profile
 */

import { useState, useEffect } from 'react'
import { Menu, X, BookOpen, Users, MessageCircle, User, LogOut, Settings, GraduationCap } from 'lucide-react'
import { Button } from './ui/button'
import { useAuthStore } from '../store/authStore'
import LoginModal from './auth/LoginModal'
import SignupModal from './auth/SignupModal'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  
  const { user, isAuthenticated, logout } = useAuthStore()

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowProfileDropdown(false)
    }
    
    if (showProfileDropdown) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showProfileDropdown])

  const navItems = [
    { name: 'Home', href: '#home', icon: BookOpen },
    { name: 'Courses', href: '#courses', icon: BookOpen },
    { name: 'About Us', href: '#about', icon: Users },
    { name: 'Contact', href: '#contact', icon: MessageCircle },
  ]

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
    setIsMenuOpen(false)
  }

  const handleDashboardClick = () => {
    // Navigate to dashboard based on user role
    if (user?.role === 'teacher') {
      window.location.hash = '/teacher-dashboard'
    } else {
      window.location.hash = '/student-dashboard'
    }
    setShowProfileDropdown(false)
  }

  const handleLogout = () => {
    logout()
    setShowProfileDropdown(false)
    // Scroll to home after logout
    scrollToSection('#home')
  }

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => scrollToSection('#home')}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-blue-500 rounded-full"></div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">LingoNest</h1>
                <p className="text-xs text-gray-600">Where English grows</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-blue-50"
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.name}</span>
                </button>
              ))}
              
              {/* Authentication Section */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowProfileDropdown(!showProfileDropdown)
                    }}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white rounded-full px-4 py-2 transition-all duration-200 transform hover:scale-105"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-white/20">
                      {user.profilePicture ? (
                        <img 
                          src={user.profilePicture} 
                          alt={user.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                    <span className="font-medium">{user.username}</span>
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 animate-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-medium text-gray-800">{user.username}</p>
                        <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                      </div>
                      
                      <button
                        onClick={handleDashboardClick}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <GraduationCap className="w-4 h-4" />
                        <span>Dashboard</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowProfileDropdown(false)
                          // Handle settings
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                      
                      <hr className="my-1" />
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    onClick={() => setShowLoginModal(true)}
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => setShowSignupModal(true)}
                    className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white rounded-full px-6"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Sign Up
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t animate-in slide-in-from-top-2 duration-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 w-full px-3 py-2 rounded-md hover:bg-blue-50 transition-colors duration-200"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                ))}
                
                {/* Mobile Authentication */}
                {isAuthenticated && user ? (
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center space-x-3 px-3 py-2">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-green-400 to-blue-500">
                        {user.profilePicture ? (
                          <img 
                            src={user.profilePicture} 
                            alt={user.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{user.username}</p>
                        <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleDashboardClick}
                      className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 w-full px-3 py-2 rounded-md hover:bg-blue-50 transition-colors"
                    >
                      <GraduationCap className="w-5 h-5" />
                      <span>Dashboard</span>
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 text-red-600 hover:bg-red-50 w-full px-3 py-2 rounded-md transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 space-y-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setShowLoginModal(true)
                        setIsMenuOpen(false)
                      }}
                      className="w-full justify-start text-gray-700 hover:text-blue-600"
                    >
                      Sign In
                    </Button>
                    <Button 
                      onClick={() => {
                        setShowSignupModal(true)
                        setIsMenuOpen(false)
                      }}
                      className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white rounded-full"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Auth Modals */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignup={() => {
          setShowLoginModal(false)
          setShowSignupModal(true)
        }}
      />
      
      <SignupModal 
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSwitchToLogin={() => {
          setShowSignupModal(false)
          setShowLoginModal(true)
        }}
      />
    </>
  )
}
