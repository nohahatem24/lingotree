/**
 * Course store using Zustand
 * Manages course data, enrollment, and progress tracking
 */

import { create } from 'zustand'
import { Course, Lesson, Review, CourseProgress } from '../types'
import { v4 as uuidv4 } from 'uuid'

interface CourseState {
  courses: Course[]
  enrolledCourses: string[]
  courseProgress: { [courseId: string]: CourseProgress }
  isLoading: boolean
  selectedCourse: Course | null
  
  // Actions
  fetchCourses: () => Promise<void>
  getCourseById: (id: string) => Course | undefined
  enrollInCourse: (courseId: string, userId: string) => Promise<boolean>
  markLessonComplete: (courseId: string, lessonId: string, userId: string) => void
  addReview: (courseId: string, review: Omit<Review, 'id' | 'createdAt'>) => void
  updateCourseRating: (courseId: string) => void
  getStudentProgress: (courseId: string, userId: string) => CourseProgress | undefined
  addCourse: (course: Omit<Course, 'id'>) => Promise<boolean>
  updateCourse: (courseId: string, course: Omit<Course, 'id'>) => Promise<boolean>
  deleteCourse: (courseId: string) => Promise<boolean>
}

// Mock course data
const mockCourses: Course[] = [
  {
    id: 'course1',
    title: 'Little Sprouts English',
    description: 'Perfect for ages 4-6. Foundation building with fun activities, songs, and interactive games.',
    level: 'Beginner',
    price: 89,
    duration: '12 weeks',
    image: 'https://pub-cdn.sider.ai/u/U06XHNVR9EG/web-coder/689229887ce69ee490366798/resource/62504169-23d1-44f4-989c-f9c3dab64a60.jpg',
    teacherIds: ['teacher1', 'teacher2'],
    lessons: [
      {
        id: 'lesson1',
        courseId: 'course1',
        title: 'Hello World - First Words',
        description: 'Learn basic greetings and introduce yourself',
        videoUrl: 'https://example.com/video1',
        duration: 15,
        order: 1,
        type: 'video'
      },
      {
        id: 'lesson2',
        courseId: 'course1',
        title: 'Colors and Shapes Quiz',
        description: 'Interactive quiz about colors and basic shapes',
        duration: 10,
        order: 2,
        type: 'quiz',
        quiz: {
          id: 'quiz1',
          lessonId: 'lesson2',
          questions: [
            {
              id: 'q1',
              type: 'multiple-choice',
              question: 'What color is the sun?',
              options: ['Blue', 'Yellow', 'Green', 'Red'],
              correctAnswer: 'Yellow',
              explanation: 'The sun appears yellow in the sky!',
              points: 10
            }
          ],
          passingScore: 70,
          timeLimit: 300
        }
      }
    ],
    enrolledStudents: ['student1'],
    totalStudents: 150,
    rating: 4.9,
    reviews: [
      {
        id: 'review1',
        courseId: 'course1',
        studentId: 'student1',
        studentName: 'Alex Johnson',
        rating: 5,
        comment: 'My child loves this course! Very engaging and fun.',
        createdAt: new Date(),
        isVisible: true
      }
    ],
    createdAt: new Date(),
    isPublished: true,
    features: ['Interactive games', 'Songs & rhymes', 'Basic vocabulary', 'Letter recognition']
  },
  {
    id: 'course2',
    title: 'Growing Readers',
    description: 'For ages 7-10. Build reading skills, expand vocabulary, and develop confidence in speaking.',
    level: 'Elementary',
    price: 129,
    duration: '16 weeks',
    image: 'https://pub-cdn.sider.ai/u/U06XHNVR9EG/web-coder/689229887ce69ee490366798/resource/48511065-7451-4409-a844-0d41f52dae45.jpg',
    teacherIds: ['teacher1', 'teacher2'],
    lessons: [
      {
        id: 'lesson3',
        courseId: 'course2',
        title: 'Reading Adventures Begin',
        description: 'Introduction to reading comprehension',
        videoUrl: 'https://example.com/video2',
        duration: 20,
        order: 1,
        type: 'video'
      }
    ],
    enrolledStudents: [],
    totalStudents: 200,
    rating: 4.8,
    reviews: [],
    createdAt: new Date(),
    isPublished: true,
    features: ['Reading comprehension', 'Vocabulary building', 'Speaking practice', 'Story writing']
  },
  {
    id: 'course3',
    title: 'Teen English Mastery',
    description: 'For ages 11-17. Advanced grammar, essay writing, and preparation for academic success.',
    level: 'Intermediate',
    price: 189,
    duration: '20 weeks',
    image: 'https://pub-cdn.sider.ai/u/U06XHNVR9EG/web-coder/689229887ce69ee490366798/resource/f0704058-5df9-41bd-9ade-5cb209ee94d8.jpg',
    teacherIds: ['teacher1', 'teacher2'],
    lessons: [
      {
        id: 'lesson4',
        courseId: 'course3',
        title: 'Advanced Grammar Mastery',
        description: 'Complex sentence structures and advanced grammar rules',
        videoUrl: 'https://example.com/video3',
        duration: 25,
        order: 1,
        type: 'video'
      }
    ],
    enrolledStudents: [],
    totalStudents: 180,
    rating: 4.9,
    reviews: [],
    createdAt: new Date(),
    isPublished: true,
    features: ['Advanced grammar', 'Essay writing', 'Presentation skills', 'Exam preparation']
  }
]

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: mockCourses,
  enrolledCourses: [],
  courseProgress: {},
  isLoading: false,
  selectedCourse: null,

  fetchCourses: async (): Promise<void> => {
    set({ isLoading: true })
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500))
    set({ courses: mockCourses, isLoading: false })
  },

  getCourseById: (id: string): Course | undefined => {
    const { courses } = get()
    return courses.find(course => course.id === id)
  },

  enrollInCourse: async (courseId: string, userId: string): Promise<boolean> => {
    set({ isLoading: true })
    
    // Mock payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const { courses, enrolledCourses, courseProgress } = get()
    const course = courses.find(c => c.id === courseId)
    
    if (course && !enrolledCourses.includes(courseId)) {
      // Update enrolled courses
      const updatedEnrolledCourses = [...enrolledCourses, courseId]
      
      // Initialize progress
      const newProgress: CourseProgress = {
        courseId,
        completedLessons: [],
        totalLessons: course.lessons.length,
        progressPercentage: 0,
        currentLesson: course.lessons[0]?.id || '',
        timeSpent: 0,
        lastAccessed: new Date(),
        quizScores: {},
        assignmentGrades: {}
      }
      
      // Update course enrollment count
      const updatedCourses = courses.map(c => 
        c.id === courseId 
          ? { ...c, enrolledStudents: [...c.enrolledStudents, userId], totalStudents: c.totalStudents + 1 }
          : c
      )
      
      set({ 
        enrolledCourses: updatedEnrolledCourses,
        courseProgress: { ...courseProgress, [courseId]: newProgress },
        courses: updatedCourses,
        isLoading: false 
      })
      
      return true
    }
    
    set({ isLoading: false })
    return false
  },

  markLessonComplete: (courseId: string, lessonId: string, userId: string): void => {
    const { courseProgress } = get()
    const progress = courseProgress[courseId]
    
    if (progress && !progress.completedLessons.includes(lessonId)) {
      const updatedCompletedLessons = [...progress.completedLessons, lessonId]
      const progressPercentage = (updatedCompletedLessons.length / progress.totalLessons) * 100
      
      const updatedProgress: CourseProgress = {
        ...progress,
        completedLessons: updatedCompletedLessons,
        progressPercentage,
        lastAccessed: new Date()
      }
      
      set({
        courseProgress: {
          ...courseProgress,
          [courseId]: updatedProgress
        }
      })
    }
  },

  addReview: (courseId: string, review: Omit<Review, 'id' | 'createdAt'>): void => {
    const { courses } = get()
    const newReview: Review = {
      ...review,
      id: uuidv4(),
      createdAt: new Date()
    }
    
    const updatedCourses = courses.map(course =>
      course.id === courseId
        ? { ...course, reviews: [...course.reviews, newReview] }
        : course
    )
    
    set({ courses: updatedCourses })
    get().updateCourseRating(courseId)
  },

  updateCourseRating: (courseId: string): void => {
    const { courses } = get()
    const course = courses.find(c => c.id === courseId)
    
    if (course && course.reviews.length > 0) {
      const totalRating = course.reviews.reduce((sum, review) => sum + review.rating, 0)
      const averageRating = totalRating / course.reviews.length
      
      const updatedCourses = courses.map(c =>
        c.id === courseId
          ? { ...c, rating: Math.round(averageRating * 10) / 10 }
          : c
      )
      
      set({ courses: updatedCourses })
    }
  },

  getStudentProgress: (courseId: string, userId: string): CourseProgress | undefined => {
    const { courseProgress } = get()
    return courseProgress[courseId]
  },

  addCourse: async (course: Omit<Course, 'id'>): Promise<boolean> => {
    const { courses } = get()
    const newCourse: Course = {
      ...course,
      id: `course_${Date.now()}`,
    }
    
    set({ courses: [...courses, newCourse] })
    return true
  },

  updateCourse: async (courseId: string, course: Omit<Course, 'id'>): Promise<boolean> => {
    const { courses } = get()
    const updatedCourses = courses.map(c => 
      c.id === courseId ? { ...course, id: courseId } : c
    )
    
    set({ courses: updatedCourses })
    return true
  },

  deleteCourse: async (courseId: string): Promise<boolean> => {
    const { courses } = get()
    const updatedCourses = courses.filter(c => c.id !== courseId)
    
    set({ courses: updatedCourses })
    return true
  }
}))
