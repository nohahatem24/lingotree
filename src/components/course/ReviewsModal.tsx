/**
 * Reviews Modal component displaying course reviews and ratings
 * Allows users to read existing reviews and submit new ones
 */

import { useState } from 'react'
import { X, Star, User, Calendar, MessageCircle } from 'lucide-react'
import { Button } from '../ui/button'
import { useCourseStore } from '../../store/courseStore'
import { useAuthStore } from '../../store/authStore'

interface ReviewsModalProps {
  courseId: string
  isOpen: boolean
  onClose: () => void
}

export default function ReviewsModal({ courseId, isOpen, onClose }: ReviewsModalProps) {
  const [showAddReview, setShowAddReview] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  })

  const { getCourseById, addReview, enrolledCourses } = useCourseStore()
  const { user, isAuthenticated } = useAuthStore()
  
  const course = getCourseById(courseId)
  const canAddReview = isAuthenticated && enrolledCourses.includes(courseId)

  const handleSubmitReview = () => {
    if (user && newReview.comment.trim()) {
      addReview(courseId, {
        studentId: user.id,
        studentName: user.username,
        rating: newReview.rating,
        comment: newReview.comment.trim(),
        isVisible: true
      })
      setNewReview({ rating: 5, comment: '' })
      setShowAddReview(false)
    }
  }

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange?.(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            <Star 
              className={`w-5 h-5 ${
                star <= rating 
                  ? 'text-yellow-500 fill-current' 
                  : 'text-gray-300'
              }`} 
            />
          </button>
        ))}
      </div>
    )
  }

  if (!isOpen || !course) return null

  const averageRating = course.rating
  const totalReviews = course.reviews.length
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: course.reviews.filter(review => review.rating === rating).length,
    percentage: totalReviews > 0 ? (course.reviews.filter(review => review.rating === rating).length / totalReviews) * 100 : 0
  }))

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Course Reviews</h2>
            <p className="text-gray-600">{course.title}</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Rating Overview */}
        <div className="p-6 border-b bg-gray-50">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800 mb-2">{averageRating}</div>
              {renderStars(Math.round(averageRating))}
              <p className="text-gray-600 mt-2">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600 w-8">{rating} ★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Review Section */}
        {canAddReview && (
          <div className="p-6 border-b">
            {!showAddReview ? (
              <Button
                onClick={() => setShowAddReview(true)}
                className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white rounded-lg"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Write a Review
              </Button>
            ) : (
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800">Share Your Experience</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Your Rating</label>
                  {renderStars(newReview.rating, true, (rating) => setNewReview(prev => ({ ...prev, rating })))}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Your Review</label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    placeholder="Share your thoughts about this course..."
                  />
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={handleSubmitReview}
                    disabled={!newReview.comment.trim()}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Submit Review
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setShowAddReview(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reviews List */}
        <div className="p-6">
          <h3 className="font-bold text-gray-800 mb-4">
            Reviews ({totalReviews})
          </h3>

          {totalReviews === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No reviews yet</p>
              <p className="text-sm text-gray-500">Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {course.reviews
                .filter(review => review.isVisible)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((review) => (
                  <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-gray-800">{review.studentName}</h4>
                          {renderStars(review.rating)}
                          <div className="flex items-center space-x-1 text-gray-500 text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
