/**
 * Task Manager component for teachers
 * Create and manage assignments, quizzes, and tasks with file submission support
 */

import { useState } from 'react'
import { Plus, FileText, Upload, Calendar, Clock, Users, Eye, Edit, Trash2, Download } from 'lucide-react'
import { Button } from '../ui/button'
import { useCourseStore } from '../../store/courseStore'
import { useAuthStore } from '../../store/authStore'
import { Assignment, Submission } from '../../types'

interface TaskFormData {
  title: string
  description: string
  instructions: string
  allowedFormats: string[]
  maxFileSize: number
  dueDate?: string
  points: number
}

export default function TaskManager() {
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedTask, setSelectedTask] = useState<Assignment | null>(null)
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    instructions: '',
    allowedFormats: ['pdf', 'doc', 'docx', 'jpg', 'png', 'txt'],
    maxFileSize: 10,
    points: 100
  })

  const { courses } = useCourseStore()
  const { user } = useAuthStore()

  const teacherCourses = courses.filter(course => 
    course.teacherIds.includes(user?.id || '')
  )

  // Mock submissions data
  const mockSubmissions: Submission[] = [
    {
      id: 'sub1',
      assignmentId: 'task1',
      studentId: 'student1',
      studentName: 'Alex Johnson',
      fileUrl: 'https://example.com/submissions/alex-homework.pdf',
      fileName: 'alex-homework.pdf',
      submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'pending',
      grade: undefined,
      feedback: ''
    },
    {
      id: 'sub2',
      assignmentId: 'task1',
      studentId: 'student2',
      studentName: 'Emma Wilson',
      fileUrl: 'https://example.com/submissions/emma-essay.docx',
      fileName: 'emma-essay.docx',
      submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      status: 'graded',
      grade: 95,
      feedback: 'Excellent work! Your essay structure is very clear.'
    }
  ]

  const fileFormatOptions = [
    { value: 'pdf', label: 'PDF', icon: '📄' },
    { value: 'doc', label: 'Word Document', icon: '📝' },
    { value: 'docx', label: 'Word Document (New)', icon: '📝' },
    { value: 'jpg', label: 'JPEG Image', icon: '🖼️' },
    { value: 'png', label: 'PNG Image', icon: '🖼️' },
    { value: 'txt', label: 'Text File', icon: '📋' },
    { value: 'mp4', label: 'Video', icon: '🎥' },
    { value: 'mp3', label: 'Audio', icon: '🎵' }
  ]

  const handleCreateTask = () => {
    if (!selectedCourse || !formData.title || !formData.description) {
      alert('Please fill in all required fields')
      return
    }

    // In real app, this would save to backend
    alert(`Task "${formData.title}" created successfully!`)
    setShowCreateTask(false)
    setFormData({
      title: '',
      description: '',
      instructions: '',
      allowedFormats: ['pdf', 'doc', 'docx', 'jpg', 'png', 'txt'],
      maxFileSize: 10,
      points: 100
    })
  }

  const handleGradeSubmission = (submissionId: string, grade: number, feedback: string) => {
    alert(`Graded submission ${submissionId} with ${grade} points. Feedback: ${feedback}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Task & Assignment Manager</h2>
          <p className="text-gray-600">Create and manage student assignments and tasks</p>
        </div>
        <Button
          onClick={() => setShowCreateTask(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Task
        </Button>
      </div>

      {/* Create Task Modal */}
      {showCreateTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Create New Assignment/Task</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Course *</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Choose a course</option>
                  {teacherCourses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Task Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Essay Writing Assignment"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={3}
                  placeholder="Brief description of the task"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Instructions</label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={4}
                  placeholder="Step-by-step instructions for students"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
                  <input
                    type="number"
                    value={formData.points}
                    onChange={(e) => setFormData(prev => ({ ...prev, points: parseInt(e.target.value) || 100 }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Allowed File Formats</label>
                <div className="grid grid-cols-2 gap-2">
                  {fileFormatOptions.map(format => (
                    <label key={format.value} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.allowedFormats.includes(format.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              allowedFormats: [...prev.allowedFormats, format.value]
                            }))
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              allowedFormats: prev.allowedFormats.filter(f => f !== format.value)
                            }))
                          }
                        }}
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm">{format.icon} {format.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max File Size (MB)</label>
                <input
                  type="number"
                  value={formData.maxFileSize}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxFileSize: parseInt(e.target.value) || 10 }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  min="1"
                  max="100"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={handleCreateTask}
                  className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
                >
                  Create Task
                </Button>
                <Button
                  onClick={() => setShowCreateTask(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Task</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Course</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Due Date</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Submissions</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teacherCourses.flatMap(course => 
                course.lessons
                  .filter(lesson => lesson.type === 'assignment' && lesson.assignment)
                  .map((lesson, index) => (
                    <tr key={`${course.id}-${lesson.id}`} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-medium text-gray-800">{lesson.title}</div>
                          <div className="text-sm text-gray-600">{lesson.description}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-700">{course.title}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-600">
                          {lesson.assignment?.dueDate 
                            ? new Date(lesson.assignment.dueDate).toLocaleDateString()
                            : 'No due date'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {mockSubmissions.filter(s => s.assignmentId === lesson.assignment?.id).length}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submissions Overview */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Submissions</h3>
        <div className="space-y-3">
          {mockSubmissions.map(submission => (
            <div key={submission.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold">
                  {submission.studentName.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-gray-800">{submission.studentName}</div>
                  <div className="text-sm text-gray-600">{submission.fileName}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  submission.status === 'graded' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {submission.status}
                </span>
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-1" />
                  Review
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
