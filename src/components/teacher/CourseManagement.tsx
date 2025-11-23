/**
 * Course Management component for teachers
 * Allows teachers to view, edit, add, and delete courses
 */

import { useState } from 'react'
import { Plus, Edit, Trash2, Users, Star, Play, Eye, Settings, BookOpen } from 'lucide-react'
import { Button } from '../ui/button'
import { useCourseStore } from '../../store/courseStore'
import { useAuthStore } from '../../store/authStore'
import CourseEditor from './CourseEditor'

export default function CourseManagement() {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [showCreateCourse, setShowCreateCourse] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  const { courses, deleteCourse } = useCourseStore()
  const { user } = useAuthStore()

  const teacherCourses = courses.filter(course => 
    course.teacherIds.includes(user?.id || '')
  )

  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      await deleteCourse(courseId)
    }
  }

  if (selectedCourseId || showCreateCourse) {
    return (
      <CourseEditor
        courseId={selectedCourseId}
        onBack={() => {
          setSelectedCourseId(null)
          setShowCreateCourse(false)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Course Management</h2>
          <p className="text-gray-600">{teacherCourses.length} course{teacherCourses.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex rounded-lg bg-gray-100 p-1">
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
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List
            </button>
          </div>
          
          <Button
            onClick={() => setShowCreateCourse(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Course
          </Button>
        </div>
      </div>

      {teacherCourses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Courses Yet</h3>
          <p className="text-gray-600 mb-6">Create your first course to start teaching students!</p>
          <Button
            onClick={() => setShowCreateCourse(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-6"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Course
          </Button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {teacherCourses.map((course) => (
            <div 
              key={course.id} 
              className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 ${
                viewMode === 'grid' ? 'transform hover:-translate-y-1' : ''
              }`}
            >
              {viewMode === 'grid' ? (
                <>
                  {/* Course Image */}
                  <div className="relative">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {course.level}
                    </div>
                    <div className="absolute top-3 right-3 flex space-x-1">
                      <button
                        onClick={() => setSelectedCourseId(course.id)}
                        className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-purple-600" />
                      </button>
                      <button
                        onClick={() => setSelectedCourseId(course.id)}
                        className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
                        title="Edit Course"
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{course.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                    </div>

                    {/* Course Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{course.enrolledStudents.length} students</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Play className="w-4 h-4" />
                        <span>{course.lessons.length} lessons</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>{course.rating}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setSelectedCourseId(course.id)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteCourse(course.id)}
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                // List View
                <div className="p-6 flex items-center space-x-6">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{course.title}</h3>
                        <p className="text-gray-600 text-sm">{course.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{course.enrolledStudents.length} students</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Play className="w-4 h-4" />
                            <span>{course.lessons.length} lessons</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span>{course.rating}</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => setSelectedCourseId(course.id)}
                          size="sm"
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteCourse(course.id)}
                          size="sm"
                          variant="outline"
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
