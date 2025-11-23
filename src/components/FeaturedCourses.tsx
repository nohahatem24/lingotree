/**
 * Featured courses section displaying available learning programs
 * Shows course cards with pricing, enrollment options, and reviews
 */

import { useState } from 'react'
import { Star, Clock, Users, BookOpen, Play, ArrowRight, MessageCircle, CreditCard, Check } from 'lucide-react'
import { Button } from './ui/button'
import { useCourseStore } from '../store/courseStore'
import { useAuthStore } from '../store/authStore'
import PaymentModal from './course/PaymentModal'
import ReviewsModal from './course/ReviewsModal'

interface Course {
  id: number
  title: string
  description: string
  level: string
  duration: string
  students: number
  rating: number
  price: number
  image: string
  features: string[]
}

export default function FeaturedCourses() {
  const [selectedCourseForPayment, setSelectedCourseForPayment] = useState<string | null>(null)
  const [selectedCourseForReviews, setSelectedCourseForReviews] = useState<string | null>(null)
  
  const { courses, enrolledCourses, enrollInCourse, isLoading } = useCourseStore()
  const { isAuthenticated, user } = useAuthStore()

  const handleEnrollClick = (courseId: string) => {
    if (!isAuthenticated) {
      // Show login modal
      const event = new CustomEvent('show-login-modal')
      window.dispatchEvent(event)
      return
    }
    
    if (enrolledCourses.includes(courseId)) {
      // Navigate to course dashboard
      window.location.hash = '/student-dashboard'
      return
    }
    
    setSelectedCourseForPayment(courseId)
  }

  const handlePaymentSuccess = async (courseId: string) => {
    if (user) {
      const success = await enrollInCourse(courseId, user.id)
      if (success) {
        setSelectedCourseForPayment(null)
        // Show success message or redirect
      }
    }
  }

  return (
    <>
      <section id="courses" className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Featured{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600">
                Courses
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Carefully designed programs that grow with your child's learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => {
              const isEnrolled = enrolledCourses.includes(course.id)
              const enrollButtonText = isEnrolled ? 'Continue Learning' : 'Enroll Now'
              const enrollButtonIcon = isEnrolled ? Play : CreditCard

              return (
                <div key={course.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  {/* Course Image */}
                  <div className="relative">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {course.level}
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                      <Play className="w-5 h-5 text-blue-500" />
                    </div>
                    {isEnrolled && (
                      <div className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                        <Check className="w-4 h-4" />
                        <span>Enrolled</span>
                      </div>
                    )}
                  </div>

                  {/* Course Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{course.description}</p>
                    </div>

                    {/* Course Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{course.totalStudents} students</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>{course.rating}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-800 text-sm">What you'll learn:</h4>
                      <div className="grid grid-cols-2 gap-1">
                        {course.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-1 text-xs text-gray-600">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Reviews Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCourseForReviews(course.id)}
                      className="w-full flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Read Reviews ({course.reviews.length})</span>
                    </Button>

                    {/* Price and CTA */}
                    <div className="border-t pt-4 flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-gray-800">${course.price}</span>
                        <span className="text-sm text-gray-500 ml-1">total</span>
                      </div>
                      <Button 
                        onClick={() => handleEnrollClick(course.id)}
                        disabled={isLoading}
                        className={`rounded-full px-4 transition-all duration-200 ${
                          isEnrolled 
                            ? 'bg-green-500 hover:bg-green-600 text-white' 
                            : 'bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white'
                        }`}
                      >
                        <enrollButtonIcon className="w-4 h-4 mr-1" />
                        {enrollButtonText}
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* View All Courses CTA */}
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => {
                // Scroll to top of courses section
                const element = document.querySelector('#courses')
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              }}
              className="border-2 border-blue-300 text-blue-600 hover:bg-blue-50 rounded-full px-8 transform hover:scale-105 transition-all duration-200"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              View All Courses
            </Button>
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      {selectedCourseForPayment && (
        <PaymentModal
          courseId={selectedCourseForPayment}
          isOpen={!!selectedCourseForPayment}
          onClose={() => setSelectedCourseForPayment(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Reviews Modal */}
      {selectedCourseForReviews && (
        <ReviewsModal
          courseId={selectedCourseForReviews}
          isOpen={!!selectedCourseForReviews}
          onClose={() => setSelectedCourseForReviews(null)}
        />
      )}
    </>
  )
}
