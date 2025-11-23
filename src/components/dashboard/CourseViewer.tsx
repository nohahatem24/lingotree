/**
 * Course Viewer component for displaying course content
 * Includes lessons, quizzes, assignments, comments, and progress tracking
 */

import { useState, useEffect } from 'react'
import { ArrowLeft, Play, FileText, HelpCircle, Upload, MessageCircle, CheckCircle, Clock, Star, Send, Paperclip, Image, FileText as FileIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { useCourseStore } from '../../store/courseStore'
import { useAuthStore } from '../../store/authStore'
import { Lesson } from '../../types'

interface CourseViewerProps {
  courseId: string
  onBack: () => void
}

interface Comment {
  id: string
  userId: string
  userName: string
  userRole: 'student' | 'teacher'
  content: string
  createdAt: Date
  replies: Comment[]
}

export default function CourseViewer({ courseId, onBack }: CourseViewerProps) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [assignmentFile, setAssignmentFile] = useState<File | null>(null)
  const [assignmentText, setAssignmentText] = useState('')
  const [submissionType, setSubmissionType] = useState<'file' | 'text'>('text')
  
  const { getCourseById, courseProgress, markLessonComplete } = useCourseStore()
  const { user } = useAuthStore()
  
  const course = getCourseById(courseId)
  const progress = courseProgress[courseId]

  useEffect(() => {
    if (course && course.lessons.length > 0 && !selectedLesson) {
      // Select first incomplete lesson or first lesson
      const firstIncompleteLesson = course.lessons.find(lesson => 
        !progress?.completedLessons.includes(lesson.id)
      )
      setSelectedLesson(firstIncompleteLesson || course.lessons[0])
    }
  }, [course, progress, selectedLesson])

  // Mock comments data
  useEffect(() => {
    if (selectedLesson) {
      setComments([
        {
          id: 'comment1',
          userId: 'student1',
          userName: 'Alex Johnson',
          userRole: 'student',
          content: 'This lesson was really helpful! I finally understand the difference between past and present tense.',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          replies: [
            {
              id: 'reply1',
              userId: 'teacher1',
              userName: 'Miss Gannah',
              userRole: 'teacher',
              content: "That's wonderful to hear! Keep practicing and you'll master it completely. 💪",
              createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
              replies: []
            }
          ]
        }
      ])
    }
  }, [selectedLesson])

  if (!course || !user) {
    return <div>Course not found</div>
  }

  const handleMarkComplete = () => {
    if (selectedLesson) {
      markLessonComplete(courseId, selectedLesson.id, user.id)
    }
  }

  const isLessonCompleted = (lessonId: string) => {
    return progress?.completedLessons.includes(lessonId) || false
  }

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      const newComment: Comment = {
        id: `comment_${Date.now()}`,
        userId: user.id,
        userName: user.username,
        userRole: user.role as 'student' | 'teacher',
        content: comment.trim(),
        createdAt: new Date(),
        replies: []
      }

      if (replyTo) {
        setComments(prev => prev.map(c => 
          c.id === replyTo 
            ? { ...c, replies: [...c.replies, newComment] }
            : c
        ))
        setReplyTo(null)
      } else {
        setComments(prev => [newComment, ...prev])
      }
      
      setComment('')
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAssignmentFile(file)
    }
  }

  const handleAssignmentSubmit = () => {
    if (submissionType === 'file' && assignmentFile) {
      alert(`File "${assignmentFile.name}" submitted successfully!`)
      setAssignmentFile(null)
    } else if (submissionType === 'text' && assignmentText.trim()) {
      alert('Text assignment submitted successfully!')
      setAssignmentText('')
    }
  }

  const renderLessonContent = () => {
    if (!selectedLesson) return null

    switch (selectedLesson.type) {
      case 'video':
        return (
          <div className="space-y-6">
            {/* Video Player */}
            <div className="relative bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
              <div className="aspect-video flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="relative">
                    <img 
                      src="https://pub-cdn.sider.ai/u/U06XHNVR9EG/web-coder/689229887ce69ee490366798/resource/85fd3e89-631e-45f9-b93f-1d0ddd463475.jpg"
                      alt="Video thumbnail"
                      className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200 transform hover:scale-110">
                        <Play className="w-10 h-10 text-white ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                <Clock className="w-4 h-4 inline mr-1" />
                {selectedLesson.duration} minutes
              </div>
            </div>
            
            {/* Lesson Description */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-3">{selectedLesson.title}</h3>
              <p className="text-gray-600 leading-relaxed">{selectedLesson.description}</p>
            </div>
          </div>
        )
      
      case 'quiz':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center space-x-3 mb-4">
                <HelpCircle className="w-6 h-6 text-blue-500" />
                <h3 className="text-xl font-bold text-gray-800">{selectedLesson.title}</h3>
              </div>
              <p className="text-gray-600 mb-6">{selectedLesson.description}</p>
              
              {selectedLesson.quiz && (
                <div className="space-y-4">
                  {selectedLesson.quiz.questions.map((question, index) => (
                    <div key={question.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <h4 className="font-medium text-gray-800 mb-3">
                        {index + 1}. {question.question}
                      </h4>
                      
                      {question.type === 'multiple-choice' && question.options && (
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <label key={optionIndex} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                              <input type="radio" name={`question-${question.id}`} className="text-blue-500" />
                              <span className="text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}
                      
                      {question.type === 'short-answer' && (
                        <textarea 
                          className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          rows={3}
                          placeholder="Type your answer here..."
                        />
                      )}
                    </div>
                  ))}
                  
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white transform hover:scale-105 transition-all duration-200">
                    Submit Quiz
                  </Button>
                </div>
              )}
            </div>
          </div>
        )
      
      case 'assignment':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="w-6 h-6 text-green-500" />
                <h3 className="text-xl font-bold text-gray-800">{selectedLesson.title}</h3>
              </div>
              <p className="text-gray-600 mb-6">{selectedLesson.description}</p>
              
              {/* Submission Type Toggle */}
              <div className="mb-6">
                <div className="flex space-x-4 mb-4">
                  <button
                    onClick={() => setSubmissionType('text')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      submissionType === 'text'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FileText className="w-4 h-4 inline mr-2" />
                    Text Submission
                  </button>
                  <button
                    onClick={() => setSubmissionType('file')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      submissionType === 'file'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Upload className="w-4 h-4 inline mr-2" />
                    File Upload
                  </button>
                </div>

                {submissionType === 'text' ? (
                  <div className="space-y-3">
                    <textarea
                      value={assignmentText}
                      onChange={(e) => setAssignmentText(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-4 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      rows={6}
                      placeholder="Write your assignment here..."
                    />
                    <Button
                      onClick={handleAssignmentSubmit}
                      disabled={!assignmentText.trim()}
                      className="bg-green-500 hover:bg-green-600 text-white transform hover:scale-105 transition-all duration-200"
                    >
                      Submit Text Assignment
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-800 mb-2">Upload Your Assignment</h4>
                    <p className="text-gray-600 mb-4">Support: PDF, DOC, DOCX, JPG, PNG (Max 10MB)</p>
                    
                    {assignmentFile ? (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <Paperclip className="w-5 h-5 inline text-blue-500 mr-2" />
                        <span className="font-medium text-blue-700">{assignmentFile.name}</span>
                        <button
                          onClick={() => setAssignmentFile(null)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ) : null}

                    <input
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      className="hidden"
                      id="assignment-upload"
                    />
                    <label
                      htmlFor="assignment-upload"
                      className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg cursor-pointer font-medium transform hover:scale-105 transition-all duration-200"
                    >
                      Choose File
                    </label>
                    
                    {assignmentFile && (
                      <Button
                        onClick={handleAssignmentSubmit}
                        className="ml-4 bg-blue-500 hover:bg-blue-600 text-white transform hover:scale-105 transition-all duration-200"
                      >
                        Submit File
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      
      default:
        return (
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-3">{selectedLesson.title}</h3>
            <p className="text-gray-600">{selectedLesson.description}</p>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost" 
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg px-4 py-2 transform hover:scale-105 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Courses</span>
        </Button>
        
        <div className="text-right">
          <h1 className="text-2xl font-bold text-gray-800">{course.title}</h1>
          <p className="text-sm text-gray-600">
            {progress?.completedLessons.length || 0} of {course.lessons.length} lessons completed
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Lesson Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-4 sticky top-4">
            <h3 className="font-bold text-gray-800 mb-4">Course Content</h3>
            <div className="space-y-2">
              {course.lessons.map((lesson, index) => {
                const isCompleted = isLessonCompleted(lesson.id)
                const isSelected = selectedLesson?.id === lesson.id
                
                return (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedLesson(lesson)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                      isSelected 
                        ? 'bg-blue-100 border-2 border-blue-300 shadow-md' 
                        : 'hover:bg-gray-50 border-2 border-transparent hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isCompleted 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-bold">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm truncate ${
                          isSelected ? 'text-blue-700' : 'text-gray-800'
                        }`}>
                          {lesson.title}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{lesson.duration}min</span>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {renderLessonContent()}
          
          {/* Comments Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Discussion & Questions</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComments(!showComments)}
                className="flex items-center space-x-2 hover:bg-blue-50 text-blue-600"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Comments ({comments.length})</span>
              </Button>
            </div>
            
            {/* Comment Input */}
            <div className="border border-gray-200 rounded-lg p-4 mb-6">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={replyTo ? "Write your reply..." : "Ask a question or share your thoughts..."}
                className="w-full border-0 resize-none focus:ring-0 focus:outline-none"
                rows={3}
              />
              <div className="flex justify-between items-center mt-2">
                {replyTo && (
                  <button
                    onClick={() => setReplyTo(null)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Cancel reply
                  </button>
                )}
                <div className="flex space-x-2 ml-auto">
                  <Button 
                    size="sm" 
                    onClick={handleCommentSubmit}
                    disabled={!comment.trim()}
                    className="bg-blue-500 hover:bg-blue-600 text-white transform hover:scale-105 transition-all duration-200"
                  >
                    <Send className="w-4 h-4 mr-1" />
                    {replyTo ? 'Reply' : 'Comment'}
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      comment.userRole === 'teacher' 
                        ? 'bg-gradient-to-br from-green-400 to-blue-500' 
                        : 'bg-gray-300'
                    }`}>
                      <span className="text-white font-bold text-sm">
                        {comment.userName.charAt(0)}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-800">{comment.userName}</h4>
                        {comment.userRole === 'teacher' && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Teacher</span>
                        )}
                        <span className="text-xs text-gray-500">
                          {comment.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed mb-2">{comment.content}</p>
                      
                      <button
                        onClick={() => setReplyTo(comment.id)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Reply
                      </button>
                      
                      {/* Replies */}
                      {comment.replies.length > 0 && (
                        <div className="mt-4 space-y-3 border-l-2 border-gray-200 pl-4">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex items-start space-x-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                reply.userRole === 'teacher' 
                                  ? 'bg-gradient-to-br from-green-400 to-blue-500' 
                                  : 'bg-gray-300'
                              }`}>
                                <span className="text-white font-bold text-xs">
                                  {reply.userName.charAt(0)}
                                </span>
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h5 className="font-medium text-gray-800 text-sm">{reply.userName}</h5>
                                  {reply.userRole === 'teacher' && (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Teacher</span>
                                  )}
                                  <span className="text-xs text-gray-500">
                                    {reply.createdAt.toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed">{reply.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {comments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No comments yet. Be the first to ask a question!</p>
                </div>
              )}
            </div>
          </div>

          {/* Mark Complete Button */}
          {selectedLesson && !isLessonCompleted(selectedLesson.id) && (
            <div className="text-center">
              <Button
                onClick={handleMarkComplete}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Mark as Complete
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
