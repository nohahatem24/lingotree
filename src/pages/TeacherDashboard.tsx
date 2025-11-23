/**
 * Teacher Dashboard page
 * Comprehensive management system for teachers to handle courses, students, and content
 */

import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { useCourseStore } from '../store/courseStore'
import { Teacher } from '../types'
import { 
  BookOpen, 
  Users, 
  MessageCircle, 
  Settings, 
  BarChart3, 
  Plus,
  Play,
  FileText,
  Star,
  TrendingUp,
  Calendar,
  Bell
} from 'lucide-react'
import { Button } from '../components/ui/button'
import CourseManagement from '../components/teacher/CourseManagement'
import StudentManagement from '../components/teacher/StudentManagement'
import MessagesCenter from '../components/teacher/MessagesCenter'
import Analytics from '../components/teacher/Analytics'
import ContentCreator from '../components/teacher/ContentCreator'
import TeacherSettings from '../components/teacher/TeacherSettings'

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'students' | 'messages' | 'analytics' | 'content' | 'settings'>('overview')
  const { user } = useAuthStore()
  const { courses, fetchCourses } = useCourseStore()

  const teacher = user as Teacher

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  if (!teacher || teacher.role !== 'teacher') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Access Denied</h2>
          <p className="text-gray-600">Teacher access required.</p>
        </div>
      </div>
    )
  }

  // Teacher courses and stats
  const teacherCourses = courses.filter(course => 
    course.teacherIds.includes(teacher.id)
  )
  
  const totalStudents = teacherCourses.reduce((sum, course) => 
    sum + course.enrolledStudents.length, 0
  )
  
  const totalLessons = teacherCourses.reduce((sum, course) => 
    sum + course.lessons.length, 0
  )
  
  const averageRating = teacherCourses.length > 0 
    ? teacherCourses.reduce((sum, course) => sum + course.rating, 0) / teacherCourses.length
    : 0

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'courses', name: 'My Courses', icon: BookOpen },
    { id: 'students', name: 'Students', icon: Users },
    { id: 'messages', name: 'Messages', icon: MessageCircle },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp },
    { id: 'content', name: 'Create Content', icon: Plus },
    { id: 'settings', name: 'Settings', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {/* Back to Home Button */}
              <Button
                variant="ghost"
                onClick={() => window.location.hash = '/'}
                className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg px-3 py-2"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-gradient-to-br from-green-400 to-blue-500 rounded-full"></div>
                  </div>
                </div>
                <span className="font-medium">LingoNest</span>
              </Button>
              
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-pink-500">
                {teacher.profilePicture ? (
                  <img 
                    src={teacher.profilePicture} 
                    alt={teacher.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-bold">
                    {teacher.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Welcome, {teacher.username}!</h1>
                <p className="text-sm text-gray-600">Ready to inspire your students?</p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{teacherCourses.length}</div>
                <div className="text-xs text-gray-500">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">{totalStudents}</div>
                <div className="text-xs text-gray-500">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{totalLessons}</div>
                <div className="text-xs text-gray-500">Lessons</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{averageRating.toFixed(1)}</div>
                <div className="text-xs text-gray-500">Rating</div>
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
                    ? 'border-purple-500 text-purple-600'
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
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">My Courses</p>
                    <p className="text-3xl font-bold text-purple-600">{teacherCourses.length}</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-pink-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Students</p>
                    <p className="text-3xl font-bold text-pink-600">{totalStudents}</p>
                  </div>
                  <Users className="w-8 h-8 text-pink-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Lessons</p>
                    <p className="text-3xl font-bold text-blue-600">{totalLessons}</p>
                  </div>
                  <Play className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Avg Rating</p>
                    <p className="text-3xl font-bold text-yellow-600">{averageRating.toFixed(1)}</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { action: 'New student enrolled in Little Sprouts', time: '2 hours ago', type: 'enrollment' },
                    { action: 'Comment on Reading Adventures lesson', time: '4 hours ago', type: 'comment' },
                    { action: 'Quiz completed by 5 students', time: '1 day ago', type: 'quiz' },
                    { action: 'New assignment submitted', time: '2 days ago', type: 'assignment' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'enrollment' ? 'bg-green-100 text-green-600' :
                        activity.type === 'comment' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'quiz' ? 'bg-purple-100 text-purple-600' :
                        'bg-orange-100 text-orange-600'
                      }`}>
                        {activity.type === 'enrollment' ? <Users className="w-4 h-4" /> :
                         activity.type === 'comment' ? <MessageCircle className="w-4 h-4" /> :
                         activity.type === 'quiz' ? <FileText className="w-4 h-4" /> :
                         <Calendar className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => setActiveTab('content')}
                    className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white rounded-lg p-4 h-auto flex flex-col items-center space-y-2"
                  >
                    <Plus className="w-6 h-6" />
                    <span className="text-sm">Create Lesson</span>
                  </Button>
                  <Button
                    onClick={() => setActiveTab('students')}
                    className="bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white rounded-lg p-4 h-auto flex flex-col items-center space-y-2"
                  >
                    <Users className="w-6 h-6" />
                    <span className="text-sm">View Students</span>
                  </Button>
                  <Button
                    onClick={() => setActiveTab('messages')}
                    className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white rounded-lg p-4 h-auto flex flex-col items-center space-y-2"
                  >
                    <MessageCircle className="w-6 h-6" />
                    <span className="text-sm">Messages</span>
                  </Button>
                  <Button
                    onClick={() => setActiveTab('analytics')}
                    className="bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white rounded-lg p-4 h-auto flex flex-col items-center space-y-2"
                  >
                    <BarChart3 className="w-6 h-6" />
                    <span className="text-sm">Analytics</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && <CourseManagement />}
        {activeTab === 'students' && <StudentManagement />}
        {activeTab === 'messages' && <MessagesCenter />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'content' && <ContentCreator />}
        {activeTab === 'settings' && <TeacherSettings />}
      </div>
    </div>
  )
}
