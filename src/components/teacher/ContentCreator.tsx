/**
 * Content Creator component for teachers
 * Quick tools to create lessons, quizzes, and assignments
 */

import { useState } from 'react'
import { Plus, Play, HelpCircle, FileText, Upload, Save, BookOpen } from 'lucide-react'
import { Button } from '../ui/button'
import { useCourseStore } from '../../store/courseStore'
import { useAuthStore } from '../../store/authStore'

export default function ContentCreator() {
  const [selectedType, setSelectedType] = useState<'lesson' | 'quiz' | 'assignment'>('lesson')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 15,
    videoUrl: '',
    content: ''
  })

  const { courses } = useCourseStore()
  const { user } = useAuthStore()

  const teacherCourses = courses.filter(course => 
    course.teacherIds.includes(user?.id || '')
  )

  const contentTypes = [
    {
      id: 'lesson',
      name: 'Video Lesson',
      description: 'Create an interactive video lesson',
      icon: Play,
      color: 'from-blue-500 to-purple-500'
    },
    {
      id: 'quiz',
      name: 'Quiz',
      description: 'Build an engaging quiz for students',
      icon: HelpCircle,
      color: 'from-green-500 to-blue-500'
    },
    {
      id: 'assignment',
      name: 'Assignment',
      description: 'Create a homework or project assignment',
      icon: FileText,
      color: 'from-purple-500 to-pink-500'
    }
  ]

  const handleCreate = () => {
    if (!selectedCourse || !formData.title || !formData.description) {
      alert('Please fill in all required fields and select a course')
      return
    }

    // Here you would normally add the content to the course
    alert(`${selectedType} "${formData.title}" created successfully for course: ${teacherCourses.find(c => c.id === selectedCourse)?.title}`)
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      duration: 15,
      videoUrl: '',
      content: ''
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Content Creator</h2>
        <p className="text-gray-600">Create engaging content for your students</p>
      </div>

      {/* Content Type Selection */}
      <div className="grid md:grid-cols-3 gap-6">
        {contentTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedType(type.id as any)}
            className={`p-6 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
              selectedType === type.id
                ? 'border-purple-500 bg-purple-50 shadow-lg'
                : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
            }`}
          >
            <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${type.color} flex items-center justify-center mx-auto mb-4 ${
              selectedType === type.id ? 'shadow-lg' : ''
            }`}>
              <type.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className={`text-lg font-bold mb-2 ${
              selectedType === type.id ? 'text-purple-700' : 'text-gray-800'
            }`}>
              {type.name}
            </h3>
            <p className="text-gray-600 text-sm">{type.description}</p>
          </button>
        ))}
      </div>

      {/* Creation Form */}
      <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b">
          {selectedType === 'lesson' && <Play className="w-6 h-6 text-blue-500" />}
          {selectedType === 'quiz' && <HelpCircle className="w-6 h-6 text-green-500" />}
          {selectedType === 'assignment' && <FileText className="w-6 h-6 text-purple-500" />}
          <h3 className="text-xl font-bold text-gray-800">
            Create New {contentTypes.find(t => t.id === selectedType)?.name}
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Course *
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Choose a course</option>
                {teacherCourses.map(course => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {selectedType === 'lesson' ? 'Lesson' : selectedType === 'quiz' ? 'Quiz' : 'Assignment'} Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder={`Enter ${selectedType} title`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 15 }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                min="1"
                max="120"
              />
            </div>

            {selectedType === 'lesson' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video URL
                </label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                rows={4}
                placeholder={`Describe what students will learn in this ${selectedType}`}
              />
            </div>

            {selectedType !== 'lesson' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {selectedType === 'quiz' ? 'Quiz Instructions' : 'Assignment Details'}
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                  rows={6}
                  placeholder={
                    selectedType === 'quiz' 
                      ? 'Enter quiz questions and answers...'
                      : 'Provide assignment instructions and requirements...'
                  }
                />
              </div>
            )}
          </div>
        </div>

        {/* Quick Templates */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-3">Quick Templates</h4>
          <div className="grid md:grid-cols-3 gap-3">
            <button 
              onClick={() => setFormData(prev => ({
                ...prev,
                title: 'Grammar Basics: Present Tense',
                description: 'Learn the fundamentals of present tense in English with interactive examples and practice exercises.'
              }))}
              className="text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors"
            >
              <div className="font-medium text-gray-800">Grammar Lesson</div>
              <div className="text-xs text-gray-600">Present tense basics</div>
            </button>
            <button 
              onClick={() => setFormData(prev => ({
                ...prev,
                title: 'Vocabulary Quiz: Colors & Shapes',
                description: 'Test your knowledge of basic colors and shapes with this interactive quiz.'
              }))}
              className="text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors"
            >
              <div className="font-medium text-gray-800">Vocabulary Quiz</div>
              <div className="text-xs text-gray-600">Colors and shapes</div>
            </button>
            <button 
              onClick={() => setFormData(prev => ({
                ...prev,
                title: 'Writing Assignment: My Family',
                description: 'Write a short paragraph describing your family members using simple present tense.'
              }))}
              className="text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors"
            >
              <div className="font-medium text-gray-800">Writing Task</div>
              <div className="text-xs text-gray-600">Family description</div>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4 border-t">
          <Button
            onClick={handleCreate}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3"
          >
            <Save className="w-4 h-4 mr-2" />
            Create {contentTypes.find(t => t.id === selectedType)?.name}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setFormData({
                title: '',
                description: '',
                duration: 15,
                videoUrl: '',
                content: ''
              })
              setSelectedCourse('')
            }}
          >
            Reset Form
          </Button>
        </div>
      </div>

      {/* Recent Content */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Recently Created Content</h3>
        <div className="space-y-3">
          {[
            { type: 'lesson', title: 'Pronunciation Practice', course: 'Little Sprouts English', created: '2 hours ago' },
            { type: 'quiz', title: 'Colors and Numbers', course: 'Little Sprouts English', created: '1 day ago' },
            { type: 'assignment', title: 'Story Writing', course: 'Growing Readers', created: '3 days ago' }
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-white rounded-lg">
                {item.type === 'lesson' && <Play className="w-4 h-4 text-blue-500" />}
                {item.type === 'quiz' && <HelpCircle className="w-4 h-4 text-green-500" />}
                {item.type === 'assignment' && <FileText className="w-4 h-4 text-purple-500" />}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800">{item.title}</div>
                <div className="text-sm text-gray-600">{item.course} • {item.created}</div>
              </div>
              <Button size="sm" variant="ghost">
                Edit
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
