/**
 * Course Editor component for creating and editing courses
 * Comprehensive course management with lessons, quizzes, and assignments
 */

import { useState, useEffect } from 'react'
import { ArrowLeft, Save, Plus, Edit, Trash2, Upload, Play, HelpCircle, FileText, Image } from 'lucide-react'
import { Button } from '../ui/button'
import { useCourseStore } from '../../store/courseStore'
import { useAuthStore } from '../../store/authStore'
import { Course, Lesson, Quiz, Question } from '../../types'

interface CourseEditorProps {
  courseId: string | null
  onBack: () => void
}

export default function CourseEditor({ courseId, onBack }: CourseEditorProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'lessons' | 'settings'>('details')
  const [courseData, setCourseData] = useState<Partial<Course>>({
    title: '',
    description: '',
    level: 'Beginner',
    price: 0,
    duration: '',
    image: '',
    features: [],
    lessons: []
  })
  const [currentLesson, setCurrentLesson] = useState<Partial<Lesson> | null>(null)
  const [showLessonEditor, setShowLessonEditor] = useState(false)

  const { getCourseById, addCourse, updateCourse } = useCourseStore()
  const { user } = useAuthStore()

  useEffect(() => {
    if (courseId) {
      const course = getCourseById(courseId)
      if (course) {
        setCourseData(course)
      }
    }
  }, [courseId, getCourseById])

  const handleSaveCourse = async () => {
    if (!courseData.title || !courseData.description) {
      alert('Please fill in all required fields')
      return
    }

    const courseToSave: Omit<Course, 'id'> = {
      ...courseData,
      teacherIds: courseData.teacherIds || [user?.id || ''],
      enrolledStudents: courseData.enrolledStudents || [],
      totalStudents: courseData.totalStudents || 0,
      rating: courseData.rating || 5.0,
      reviews: courseData.reviews || [],
      createdAt: courseData.createdAt || new Date(),
      isPublished: courseData.isPublished !== undefined ? courseData.isPublished : true,
      lessons: courseData.lessons || []
    } as Omit<Course, 'id'>

    if (courseId) {
      await updateCourse(courseId, courseToSave)
    } else {
      await addCourse(courseToSave)
    }
    
    onBack()
  }

  const handleAddLesson = () => {
    setCurrentLesson({
      title: '',
      description: '',
      type: 'video',
      duration: 15,
      order: (courseData.lessons?.length || 0) + 1
    })
    setShowLessonEditor(true)
  }

  const handleSaveLesson = (lesson: Lesson) => {
    const updatedLessons = courseData.lessons || []
    const lessonIndex = updatedLessons.findIndex(l => l.id === lesson.id)
    
    if (lessonIndex >= 0) {
      updatedLessons[lessonIndex] = lesson
    } else {
      updatedLessons.push(lesson)
    }
    
    setCourseData(prev => ({ ...prev, lessons: updatedLessons }))
    setShowLessonEditor(false)
    setCurrentLesson(null)
  }

  const handleDeleteLesson = (lessonId: string) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      setCourseData(prev => ({
        ...prev,
        lessons: prev.lessons?.filter(l => l.id !== lessonId) || []
      }))
    }
  }

  if (showLessonEditor) {
    return (
      <LessonEditor
        lesson={currentLesson}
        courseId={courseId || 'new'}
        onSave={handleSaveLesson}
        onBack={() => {
          setShowLessonEditor(false)
          setCurrentLesson(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Courses</span>
        </Button>
        <Button
          onClick={handleSaveCourse}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          {courseId ? 'Update Course' : 'Create Course'}
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-md">
        <div className="flex border-b">
          {[
            { id: 'details', name: 'Course Details' },
            { id: 'lessons', name: `Lessons (${courseData.lessons?.length || 0})` },
            { id: 'settings', name: 'Settings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
                    <input
                      type="text"
                      value={courseData.title}
                      onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Enter course title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                    <select
                      value={courseData.level}
                      onChange={(e) => setCourseData(prev => ({ ...prev, level: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Elementary">Elementary</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                      <input
                        type="number"
                        value={courseData.price}
                        onChange={(e) => setCourseData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                      <input
                        type="text"
                        value={courseData.duration}
                        onChange={(e) => setCourseData(prev => ({ ...prev, duration: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., 12 weeks"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Image URL</label>
                    <input
                      type="url"
                      value={courseData.image}
                      onChange={(e) => setCourseData(prev => ({ ...prev, image: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  {courseData.image && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <img
                        src={courseData.image}
                        alt="Course preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={courseData.description}
                  onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={4}
                  placeholder="Describe what students will learn in this course"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Features</label>
                <div className="space-y-2">
                  {(courseData.features || []).map((feature, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...(courseData.features || [])]
                          newFeatures[index] = e.target.value
                          setCourseData(prev => ({ ...prev, features: newFeatures }))
                        }}
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                      <Button
                        onClick={() => {
                          const newFeatures = courseData.features?.filter((_, i) => i !== index) || []
                          setCourseData(prev => ({ ...prev, features: newFeatures }))
                        }}
                        variant="outline"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    onClick={() => {
                      setCourseData(prev => ({
                        ...prev,
                        features: [...(prev.features || []), '']
                      }))
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Feature
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'lessons' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Course Lessons</h3>
                <Button
                  onClick={handleAddLesson}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Lesson
                </Button>
              </div>

              {(courseData.lessons || []).length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Play className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h4 className="font-medium text-gray-800 mb-2">No lessons yet</h4>
                  <p className="text-gray-600 mb-4">Add your first lesson to get started</p>
                  <Button
                    onClick={handleAddLesson}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Lesson
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {courseData.lessons?.map((lesson, index) => (
                    <div key={lesson.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          {lesson.type === 'video' && <Play className="w-4 h-4 text-purple-600" />}
                          {lesson.type === 'quiz' && <HelpCircle className="w-4 h-4 text-purple-600" />}
                          {lesson.type === 'assignment' && <FileText className="w-4 h-4 text-purple-600" />}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{lesson.title}</h4>
                          <p className="text-sm text-gray-600">
                            {lesson.type} • {lesson.duration} min • Order: {lesson.order}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => {
                            setCurrentLesson(lesson)
                            setShowLessonEditor(true)
                          }}
                          size="sm"
                          variant="outline"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteLesson(lesson.id)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="published"
                  checked={courseData.isPublished !== false}
                  onChange={(e) => setCourseData(prev => ({ ...prev, isPublished: e.target.checked }))}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="published" className="text-sm font-medium text-gray-700">
                  Publish this course (students can enroll)
                </label>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-2">Course Statistics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">
                      {courseData.enrolledStudents?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Enrolled Students</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {courseData.lessons?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Total Lessons</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {courseData.rating?.toFixed(1) || '0.0'}
                    </div>
                    <div className="text-sm text-gray-600">Average Rating</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-600">
                      {courseData.reviews?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Reviews</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Lesson Editor Component
interface LessonEditorProps {
  lesson: Partial<Lesson> | null
  courseId: string
  onSave: (lesson: Lesson) => void
  onBack: () => void
}

function LessonEditor({ lesson, courseId, onSave, onBack }: LessonEditorProps) {
  const [lessonData, setLessonData] = useState<Partial<Lesson>>(
    lesson || {
      title: '',
      description: '',
      type: 'video',
      duration: 15,
      order: 1
    }
  )

  const handleSave = () => {
    if (!lessonData.title || !lessonData.description) {
      alert('Please fill in all required fields')
      return
    }

    const lessonToSave: Lesson = {
      id: lessonData.id || `lesson_${Date.now()}`,
      courseId,
      title: lessonData.title || '',
      description: lessonData.description || '',
      type: lessonData.type || 'video',
      duration: lessonData.duration || 15,
      order: lessonData.order || 1,
      videoUrl: lessonData.videoUrl,
      content: lessonData.content,
      quiz: lessonData.quiz,
      assignment: lessonData.assignment
    }

    onSave(lessonToSave)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Lessons</span>
        </Button>
        <Button onClick={handleSave} className="bg-purple-500 hover:bg-purple-600 text-white">
          <Save className="w-4 h-4 mr-2" />
          Save Lesson
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title *</label>
            <input
              type="text"
              value={lessonData.title}
              onChange={(e) => setLessonData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Enter lesson title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Type</label>
            <select
              value={lessonData.type}
              onChange={(e) => setLessonData(prev => ({ ...prev, type: e.target.value as any }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="video">Video Lesson</option>
              <option value="quiz">Quiz</option>
              <option value="assignment">Assignment</option>
              <option value="reading">Reading Material</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
            <input
              type="number"
              value={lessonData.duration}
              onChange={(e) => setLessonData(prev => ({ ...prev, duration: parseInt(e.target.value) || 15 }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Order</label>
            <input
              type="number"
              value={lessonData.order}
              onChange={(e) => setLessonData(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              min="1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
          <textarea
            value={lessonData.description}
            onChange={(e) => setLessonData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
            rows={3}
            placeholder="Describe what students will learn in this lesson"
          />
        </div>

        {lessonData.type === 'video' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
            <input
              type="url"
              value={lessonData.videoUrl || ''}
              onChange={(e) => setLessonData(prev => ({ ...prev, videoUrl: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="https://example.com/video.mp4"
            />
          </div>
        )}

        {(lessonData.type === 'reading' || lessonData.type === 'assignment') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <textarea
              value={lessonData.content || ''}
              onChange={(e) => setLessonData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
              rows={6}
              placeholder="Enter the lesson content or assignment instructions"
            />
          </div>
        )}
      </div>
    </div>
  )
}
