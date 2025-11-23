/**
 * Enrolled Courses component for student dashboard
 * Displays courses the student is enrolled in with progress tracking
 */

import { useState } from 'react'
import { Play, BookOpen, Clock, Star, Trophy, ArrowRight } from 'lucide-react'
import { Button } from '../ui/button'
import { useCourseStore } from '../../store/courseStore'
import { useAuthStore } from '../../store/authStore'
import CourseViewer from './CourseViewer'

export default function EnrolledCourses() {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const { courses, enrolledCourses, courseProgress } = useCourseStore()
  const { user } = useAuthStore()

  const enrolledCourseData = courses.filter(course => 
    enrolledCourses.includes(course.id)
  )

  if (selectedCourseId) {
    return (
      <CourseViewer 
        courseId={selectedCourseId}
        onBack={() => setSelectedCourseId(null)}
      />
    )
  }

  if (enrolledCourseData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Courses Yet</h3>
          <p className="text-gray-600 mb-6">
            Start your learning journey by enrolling in a course!
          </p>
          <Button 
            onClick={() => {
              const element = document.querySelector('#courses')
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' })
              }
            }}
            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white rounded-full px-6"
          >
            Browse Courses
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Courses</h2>
        <span className="text-sm text-gray-600">
          {enrolledCourseData.length} course{enrolledCourseData.length !== 1 ? 's' : ''} enrolled
        </span>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolledCourseData.map((course) => {
          const progress = courseProgress[course.id]
          const progressPercentage = progress?.progressPercentage || 0

          return (
            <div 
              key={course.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Course Image */}
              <div className="relative">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Enrolled
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2">
                  <Play className="w-4 h-4 text-green-500" />
                </div>
              </div>

              {/* Course Info */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{course.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-600">{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Course Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{progress?.completedLessons.length || 0}/{course.lessons.length} lessons</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  onClick={() => setSelectedCourseId(course.id)}
                  className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white rounded-lg"
                >
                  {progressPercentage > 0 ? 'Continue Learning' : 'Start Course'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
