/**
 * Analytics component for teachers
 * Displays course performance, student progress, and teaching insights
 */

import { TrendingUp, Users, BookOpen, Star, Calendar, Award, BarChart3, PieChart } from 'lucide-react'
import { useCourseStore } from '../../store/courseStore'
import { useAuthStore } from '../../store/authStore'

export default function Analytics() {
  const { courses } = useCourseStore()
  const { user } = useAuthStore()

  const teacherCourses = courses.filter(course => 
    course.teacherIds.includes(user?.id || '')
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

  const totalRevenue = teacherCourses.reduce((sum, course) => 
    sum + (course.price * course.enrolledStudents.length), 0
  )

  // Mock analytics data
  const weeklyStats = [
    { week: 'Week 1', enrollments: 12, completions: 8, revenue: 980 },
    { week: 'Week 2', enrollments: 18, completions: 15, revenue: 1420 },
    { week: 'Week 3', enrollments: 25, completions: 22, revenue: 1890 },
    { week: 'Week 4', enrollments: 22, completions: 28, revenue: 2100 }
  ]

  const studentProgress = [
    { name: 'Alex Johnson', course: 'Little Sprouts', progress: 80, score: 85 },
    { name: 'Emma Wilson', course: 'Little Sprouts', progress: 60, score: 92 },
    { name: 'Michael Chen', course: 'Teen Mastery', progress: 90, score: 78 },
    { name: 'Sophie Davis', course: 'Growing Readers', progress: 45, score: 88 }
  ]

  const coursePerformance = teacherCourses.map(course => ({
    title: course.title,
    students: course.enrolledStudents.length,
    rating: course.rating,
    completion: Math.floor(Math.random() * 30) + 70, // Mock completion rate
    revenue: course.price * course.enrolledStudents.length
  }))

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Analytics Dashboard</h2>
        <p className="text-gray-600">Track your teaching performance and student progress</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Students</p>
              <p className="text-3xl font-bold text-blue-600">{totalStudents}</p>
              <p className="text-green-600 text-sm font-medium">+12% this month</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Course Rating</p>
              <p className="text-3xl font-bold text-green-600">{averageRating.toFixed(1)}</p>
              <p className="text-green-600 text-sm font-medium">+0.2 this week</p>
            </div>
            <Star className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Lessons</p>
              <p className="text-3xl font-bold text-purple-600">{totalLessons}</p>
              <p className="text-green-600 text-sm font-medium">+3 this week</p>
            </div>
            <BookOpen className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Revenue</p>
              <p className="text-3xl font-bold text-orange-600">${totalRevenue}</p>
              <p className="text-green-600 text-sm font-medium">+18% this month</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Weekly Performance */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-bold text-gray-800">Weekly Performance</h3>
          </div>
          <div className="space-y-4">
            {weeklyStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-800">{stat.week}</span>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-blue-600">{stat.enrollments}</div>
                    <div className="text-gray-500">Enrollments</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-green-600">{stat.completions}</div>
                    <div className="text-gray-500">Completions</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-purple-600">${stat.revenue}</div>
                    <div className="text-gray-500">Revenue</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Performance */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-2 mb-6">
            <PieChart className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-bold text-gray-800">Course Performance</h3>
          </div>
          <div className="space-y-4">
            {coursePerformance.map((course, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-800">{course.title}</h4>
                    <p className="text-sm text-gray-600">{course.students} students enrolled</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">${course.revenue}</div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">{course.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-medium">{course.completion}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${course.completion}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Students */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Award className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-bold text-gray-800">Top Performing Students</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {studentProgress.map((student, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {student.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{student.name}</h4>
                <p className="text-sm text-gray-600">{student.course}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{student.progress}%</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Score: </span>
                    <span className="font-medium text-purple-600">{student.score}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights & Recommendations */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Teaching Insights</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="font-medium text-green-800">Great Progress!</span>
            </div>
            <p className="text-sm text-gray-600">
              Your student engagement increased by 25% this month. Keep up the excellent work!
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span className="font-medium text-blue-800">Content Suggestion</span>
            </div>
            <p className="text-sm text-gray-600">
              Consider adding more interactive quizzes to boost lesson completion rates.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-4 h-4 text-purple-500" />
              <span className="font-medium text-purple-800">Student Focus</span>
            </div>
            <p className="text-sm text-gray-600">
              3 students need extra attention in grammar lessons. Consider scheduling 1-on-1 sessions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
