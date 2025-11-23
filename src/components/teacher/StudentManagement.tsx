/**
 * Student Management component for teachers
 * View and manage enrolled students across all courses
 */

import { useState } from 'react'
import { Search, Filter, User, BookOpen, TrendingUp, MessageCircle, Mail, MoreHorizontal } from 'lucide-react'
import { Button } from '../ui/button'
import { useCourseStore } from '../../store/courseStore'
import { useAuthStore } from '../../store/authStore'

export default function StudentManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCourse, setSelectedCourse] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table')

  const { courses } = useCourseStore()
  const { user } = useAuthStore()

  const teacherCourses = courses.filter(course => 
    course.teacherIds.includes(user?.id || '')
  )

  // Mock student data - in real app, this would come from a students store
  const mockStudents = [
    {
      id: 'student1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      profilePicture: 'https://pub-cdn.sider.ai/u/U06XHNVR9EG/web-coder/689229887ce69ee490366798/resource/ef93d403-9610-4853-a72f-217a595bfe83.jpg',
      enrolledCourses: ['course1', 'course2'],
      totalLessons: 15,
      completedLessons: 12,
      averageScore: 85,
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'student2',
      name: 'Emma Wilson',
      email: 'emma@example.com',
      profilePicture: 'https://pub-cdn.sider.ai/u/U06XHNVR9EG/web-coder/689229887ce69ee490366798/resource/b17ed5d5-9cd4-4d3d-8846-18f58db56eda.jpg',
      enrolledCourses: ['course1'],
      totalLessons: 8,
      completedLessons: 6,
      averageScore: 92,
      lastActive: new Date(Date.now() - 5 * 60 * 60 * 1000),
      joinDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'student3',
      name: 'Michael Chen',
      email: 'michael@example.com',
      profilePicture: 'https://pub-cdn.sider.ai/u/U06XHNVR9EG/web-coder/689229887ce69ee490366798/resource/2204ff75-d140-4ea4-ba24-e59beb0e0ba5.jpg',
      enrolledCourses: ['course2', 'course3'],
      totalLessons: 20,
      completedLessons: 18,
      averageScore: 78,
      lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
      joinDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
    }
  ]

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCourse = selectedCourse === 'all' || student.enrolledCourses.includes(selectedCourse)
    return matchesSearch && matchesCourse
  })

  const formatLastActive = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Student Management</h2>
          <p className="text-gray-600">{filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Search students..."
            />
          </div>
          
          {/* Course Filter */}
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Courses</option>
            {teacherCourses.map(course => (
              <option key={course.id} value={course.id}>{course.title}</option>
            ))}
          </select>
          
          {/* View Toggle */}
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'table' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Grid
            </button>
          </div>
        </div>
      </div>

      {/* Students Display */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Student</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Courses</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Progress</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Avg Score</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Last Active</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr key={student.id} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-pink-500">
                          <img 
                            src={student.profilePicture} 
                            alt={student.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{student.name}</div>
                          <div className="text-sm text-gray-600">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1">
                        <BookOpen className="w-4 h-4 text-purple-500" />
                        <span className="text-gray-700">{student.enrolledCourses.length}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 max-w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(student.completedLessons / student.totalLessons) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {student.completedLessons}/{student.totalLessons}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-sm ${
                        student.averageScore >= 90 ? 'bg-green-100 text-green-800' :
                        student.averageScore >= 80 ? 'bg-blue-100 text-blue-800' :
                        student.averageScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        <TrendingUp className="w-3 h-3" />
                        <span>{student.averageScore}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-600 text-sm">
                        {formatLastActive(student.lastActive)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" className="text-purple-600 border-purple-300 hover:bg-purple-50">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-blue-600 border-blue-300 hover:bg-blue-50">
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <div key={student.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-pink-500">
                  <img 
                    src={student.profilePicture} 
                    alt={student.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{student.name}</h3>
                  <p className="text-sm text-gray-600">{student.email}</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium">
                    {student.completedLessons}/{student.totalLessons} lessons
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(student.completedLessons / student.totalLessons) * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Score</span>
                  <span className={`text-sm font-medium ${
                    student.averageScore >= 90 ? 'text-green-600' :
                    student.averageScore >= 80 ? 'text-blue-600' :
                    student.averageScore >= 70 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {student.averageScore}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Courses</span>
                  <span className="text-sm font-medium">{student.enrolledCourses.length}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button size="sm" className="flex-1 bg-purple-500 hover:bg-purple-600 text-white">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Message
                </Button>
                <Button size="sm" variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredStudents.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Students Found</h3>
          <p className="text-gray-600">
            {searchTerm || selectedCourse !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Students will appear here once they enroll in your courses.'
            }
          </p>
        </div>
      )}
    </div>
  )
}
