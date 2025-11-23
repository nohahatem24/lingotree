/**
 * TypeScript type definitions for LingoNest platform
 * Defines all data structures used throughout the application
 */

export interface User {
  id: string
  email: string
  username: string
  profilePicture?: string
  role: 'student' | 'teacher' | 'parent'
  createdAt: Date
  lastLogin?: Date
  parentId?: string // For student accounts linked to parents
}

export interface Student extends User {
  role: 'student'
  enrolledCourses: string[]
  completedLessons: string[]
  progress: { [courseId: string]: CourseProgress }
  totalPoints: number
  achievements: Achievement[]
}

export interface Teacher extends User {
  role: 'teacher'
  bio: string
  specialties: string[]
  experience: number
}

export interface Course {
  id: string
  title: string
  description: string
  level: string
  price: number
  duration: string
  image: string
  teacherIds: string[]
  lessons: Lesson[]
  enrolledStudents: string[]
  totalStudents: number
  rating: number
  reviews: Review[]
  createdAt: Date
  isPublished: boolean
  features: string[]
}

export interface Lesson {
  id: string
  courseId: string
  title: string
  description: string
  videoUrl?: string
  duration: number
  order: number
  type: 'video' | 'quiz' | 'assignment' | 'reading'
  content?: string
  quiz?: Quiz
  assignment?: Assignment
  isCompleted?: boolean
}

export interface Quiz {
  id: string
  lessonId: string
  questions: Question[]
  passingScore: number
  timeLimit?: number
}

export interface Question {
  id: string
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'short-answer'
  question: string
  options?: string[]
  correctAnswer: string | string[]
  explanation?: string
  points: number
}

export interface Assignment {
  id: string
  lessonId: string
  title: string
  description: string
  instructions: string
  allowedFormats: string[]
  maxFileSize: number
  dueDate?: Date
  submissions: Submission[]
}

export interface Submission {
  id: string
  assignmentId: string
  studentId: string
  content?: string
  fileUrl?: string
  fileName?: string
  submittedAt: Date
  grade?: number
  feedback?: string
  status: 'pending' | 'graded' | 'returned'
}

export interface Review {
  id: string
  courseId: string
  studentId: string
  studentName: string
  rating: number
  comment: string
  createdAt: Date
  isVisible: boolean
}

export interface Comment {
  id: string
  lessonId?: string
  assignmentId?: string
  userId: string
  userName: string
  userRole: 'student' | 'teacher'
  content: string
  createdAt: Date
  replies: Comment[]
  parentId?: string
}

export interface CourseProgress {
  courseId: string
  completedLessons: string[]
  totalLessons: number
  progressPercentage: number
  currentLesson: string
  timeSpent: number
  lastAccessed: Date
  quizScores: { [lessonId: string]: number }
  assignmentGrades: { [assignmentId: string]: number }
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  color: string
  unlockedAt: Date
}

export interface Message {
  id: string
  fromId: string
  toId: string
  fromName: string
  toName: string
  subject: string
  content: string
  createdAt: Date
  isRead: boolean
  isStarred: boolean
  parentMessageId?: string
}

export interface Payment {
  id: string
  userId: string
  courseId: string
  amount: number
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentMethod: string
  transactionId: string
  createdAt: Date
}

export interface Notification {
  id: string
  userId: string
  type: 'course' | 'assignment' | 'grade' | 'message' | 'achievement'
  title: string
  message: string
  isRead: boolean
  createdAt: Date
  actionUrl?: string
}
