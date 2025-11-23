/**
 * Student Dashboard page
 * Central hub for student learning activities, progress tracking, and course access
 */

import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { useCourseStore } from '../store/courseStore'
import { Student } from '../types'
import { BookOpen, Trophy, Clock, Star, Play, MessageCircle, Settings } from 'lucide-react'
import { Button } from '../components/ui/button'
import EnrolledCourses from '../components/dashboard/EnrolledCourses'
import ProgressOverview from '../components/dashboard/ProgressOverview'
import RecentActivity from '../components/dashboard/RecentActivity'
import ProfileSettings from '../components/dashboard/ProfileSettings'

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'progress' | 'messages' | 'settings'>('overview')
  const { user } = useAuthStore()
  const { courses, enrolledCourses, courseProgress, fetchCourses } = useCourseStore()

  const student = user as Student

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Access Denied</h2>
          <p className="text-gray-600">Please log in to access your dashboard.</p>
        </div>
      </div>
    )
  }

  const enrolledCourseData = courses.filter(course => 
    enrolledCourses.includes(course.id)
  )

  const stats = {
    totalCourses: enrolledCourseData.length,
    completedLessons: Object.values(courseProgress).reduce((sum, progress) => 
      sum + progress.completedLessons.length, 0
    ),
    totalPoints: student.totalPoints,
    achievements: student.achievements.length
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BookOpen },
    { id: 'courses', name: 'My Courses', icon: Play },
    { id: 'progress', name: 'Progress', icon: Trophy },
    { id: 'messages', name: 'Messages', icon: MessageCircle },
    { id: 'settings', name: 'Settings', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {/* Back to Home Button */}
              <Button
                variant="ghost"
                onClick={() => window.location.hash = '/'}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg px-3 py-2"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-gradient-to-br from-green-400 to-blue-500 rounded-full"></div>
                  </div>
                </div>
                <span className="font-medium">LingoNest</span>
              </Button>
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-green-400 to-blue-500">
                {student.profilePicture ? (
                  <img 
                    src={student.profilePicture} 
                    alt={student.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-bold">
                    {student.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Welcome, {student.username}!</h1>
                <p className="text-sm text-gray-600">Ready to continue your English journey?</p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalCourses}</div>
                <div className="text-xs text-gray-500">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.completedLessons}</div>
                <div className="text-xs text-gray-500">Lessons</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.totalPoints}</div>
                <div className="text-xs text-gray-500">Points</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Enrolled Courses</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.totalCourses}</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Completed Lessons</p>
                    <p className="text-3xl font-bold text-green-600">{stats.completedLessons}</p>
                  </div>
                  <Play className="w-8 h-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Points</p>
                    <p className="text-3xl font-bold text-purple-600">{stats.totalPoints}</p>
                  </div>
                  <Star className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Achievements</p>
                    <p className="text-3xl font-bold text-yellow-600">{stats.achievements}</p>
                  </div>
                  <Trophy className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
            </div>

            {/* Recent Activity & Progress */}
            <div className="grid lg:grid-cols-2 gap-8">
              <RecentActivity />
              <ProgressOverview />
            </div>
          </div>
        )}

        {activeTab === 'courses' && <EnrolledCourses />}
        
        {activeTab === 'progress' && (
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Learning Progress</h2>
            <ProgressOverview detailed />
          </div>
        )}
        
        {activeTab === 'messages' && (
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Messages</h2>
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Message system coming soon!</p>
              <p className="text-sm text-gray-500">You'll be able to chat with your teachers here.</p>
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && <ProfileSettings />}
      </div>
    </div>
  )
}
