/**
 * Authentication store using Zustand
 * Manages user authentication state and operations
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, Student, Teacher } from '../types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (userData: Partial<User>, password: string) => Promise<boolean>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<boolean>
  uploadProfilePicture: (file: File) => Promise<string>
}

// Mock data for development
const mockUsers: (Student | Teacher)[] = [
  {
    id: 'teacher1',
    email: 'Gannah@lingonest.com',
    username: 'Miss Gannah',
    role: 'teacher',
    bio: 'Experienced English teacher specializing in early childhood education',
    specialties: ['Grammar', 'Vocabulary', 'Reading'],
    experience: 8,
    createdAt: new Date(),
    profilePicture: 'https://pub-cdn.sider.ai/u/U06XHNVR9EG/web-coder/689229887ce69ee490366798/resource/8c31bb5b-b741-4546-b7e6-60d00208d55d.jpg'
  },
  {
    id: 'teacher2',
    email: 'suzan@lingonest.com',
    username: 'Miss Suzan',
    role: 'teacher',
    bio: 'Passionate educator focused on teen English mastery and academic success',
    specialties: ['Writing', 'Speaking', 'Literature'],
    experience: 7,
    createdAt: new Date(),
    profilePicture: 'https://pub-cdn.sider.ai/u/U06XHNVR9EG/web-coder/689229887ce69ee490366798/resource/8c31bb5b-b741-4546-b7e6-60d00208d55d.jpg'
  },
  {
    id: 'student1',
    email: 'student@example.com',
    username: 'Alex Johnson',
    role: 'student',
    enrolledCourses: ['course1'],
    completedLessons: [],
    progress: {},
    totalPoints: 150,
    achievements: [],
    createdAt: new Date(),
    profilePicture: 'https://pub-cdn.sider.ai/u/U06XHNVR9EG/web-coder/689229887ce69ee490366798/resource/c04dc7e5-005f-403c-afbb-7778efca457c.jpeg'
  }
]

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string): Promise<boolean> => {
        set({ isLoading: true })
        
        // Mock authentication - in real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const user = mockUsers.find(u => u.email === email)
        
        if (user && password === 'password123') {
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
          })
          return true
        }
        
        set({ isLoading: false })
        return false
      },

      signup: async (userData: Partial<User>, password: string): Promise<boolean> => {
        set({ isLoading: true })
        
        // Mock signup - in real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const newUser: Student = {
          id: `user_${Date.now()}`,
          email: userData.email!,
          username: userData.username!,
          role: 'student',
          enrolledCourses: [],
          completedLessons: [],
          progress: {},
          totalPoints: 0,
          achievements: [],
          createdAt: new Date(),
          profilePicture: userData.profilePicture || 'https://pub-cdn.sider.ai/u/U06XHNVR9EG/web-coder/689229887ce69ee490366798/resource/85c9e814-aa21-43ed-8ebe-b095f5179003.jpg'
        }
        
        mockUsers.push(newUser)
        
        set({ 
          user: newUser, 
          isAuthenticated: true, 
          isLoading: false 
        })
        return true
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false 
        })
      },

      updateProfile: async (updates: Partial<User>): Promise<boolean> => {
        const { user } = get()
        if (!user) return false
        
        set({ isLoading: true })
        
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const updatedUser = { ...user, ...updates }
        set({ 
          user: updatedUser, 
          isLoading: false 
        })
        return true
      },

      uploadProfilePicture: async (file: File): Promise<string> => {
        // Mock file upload - in real app, this would upload to cloud storage
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Return mock URL
        return `https://pub-cdn.sider.ai/u/U06XHNVR9EG/web-coder/689229887ce69ee490366798/resource/ef2255ca-b60b-4639-a413-c30b62f48f34.jpg`
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
)
