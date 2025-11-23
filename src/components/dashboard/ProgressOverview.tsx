/**
 * Progress Overview component showing student learning progress
 * Displays visual progress indicators and achievements
 */

import { useCourseStore } from '../../store/courseStore'
import { useAuthStore } from '../../store/authStore'
import { TreePine, Trophy, Star, TrendingUp, BookOpen } from 'lucide-react'

interface ProgressOverviewProps {
  detailed?: boolean
}

export default function ProgressOverview({ detailed = false }: ProgressOverviewProps) {
  const { courses, enrolledCourses, courseProgress } = useCourseStore()
  const { user } = useAuthStore()

  const enrolledCourseData = courses.filter(course => 
    enrolledCourses.includes(course.id)
  )

  const overallProgress = enrolledCourseData.length > 0 
    ? enrolledCourseData.reduce((acc, course) => {
        const progress = courseProgress[course.id]
        return acc + (progress?.progressPercentage || 0)
      }, 0) / enrolledCourseData.length
    : 0

  const achievements = [
    {
      id: 'first-lesson',
      title: 'First Steps',
      description: 'Completed your first lesson',
      icon: TreePine,
      color: 'from-green-400 to-green-500',
      unlocked: true
    },
    {
      id: 'quiz-master',
      title: 'Quiz Master',
      description: 'Scored 100% on a quiz',
      icon: Trophy,
      color: 'from-yellow-400 to-yellow-500',
      unlocked: false
    },
    {
      id: 'consistent-learner',
      title: 'Consistent Learner',
      description: 'Studied for 7 days in a row',
      icon: Star,
      color: 'from-purple-400 to-purple-500',
      unlocked: false
    }
  ]

  if (!detailed) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Learning Progress</h3>
        
        {enrolledCourseData.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No courses enrolled yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Overall Progress */}
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - overallProgress / 100)}`}
                    className="text-blue-500 transition-all duration-500"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-800">
                    {Math.round(overallProgress)}%
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600">Overall Progress</p>
            </div>

            {/* Course Progress */}
            <div className="space-y-3">
              {enrolledCourseData.slice(0, 3).map((course) => {
                const progress = courseProgress[course.id]
                const progressPercentage = progress?.progressPercentage || 0
                
                return (
                  <div key={course.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 truncate">
                        {course.title}
                      </span>
                      <span className="text-sm text-gray-600">
                        {Math.round(progressPercentage)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Progress Tree */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Learning Journey</h3>
        
        <div className="relative">
          {/* Tree trunk */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-full bg-gradient-to-b from-green-600 to-green-800 rounded-full opacity-30"></div>
          
          {/* Progress levels */}
          <div className="space-y-12">
            {achievements.map((achievement, index) => (
              <div key={achievement.id} className={`flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className={`flex items-center space-x-4 max-w-sm ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse space-x-reverse'}`}>
                  <div className={`w-12 h-12 bg-gradient-to-br ${achievement.color} rounded-full flex items-center justify-center ${achievement.unlocked ? 'shadow-lg' : 'opacity-50 grayscale'}`}>
                    <achievement.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${achievement.unlocked ? 'border-green-400' : 'border-gray-300'}`}>
                    <h4 className="font-bold text-gray-800">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    {achievement.unlocked && (
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-2">
                        Unlocked!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course Progress Details */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Course Progress</h3>
        
        {enrolledCourseData.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No courses enrolled yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {enrolledCourseData.map((course) => {
              const progress = courseProgress[course.id]
              const progressPercentage = progress?.progressPercentage || 0
              const completedLessons = progress?.completedLessons.length || 0
              
              return (
                <div key={course.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-gray-800">{course.title}</h4>
                      <p className="text-sm text-gray-600">{course.level}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm text-gray-600">
                        {Math.round(progressPercentage)}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{completedLessons} of {course.lessons.length} lessons</span>
                      <span>{course.duration}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
