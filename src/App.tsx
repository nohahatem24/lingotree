import { HashRouter, Route, Routes } from 'react-router'
import { useEffect } from 'react'
import HomePage from './pages/Home'
import StudentDashboard from './pages/StudentDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import { useAuthStore } from './store/authStore'

export default function App() {
  const { user } = useAuthStore()

  // Listen for custom events to show auth modals
  useEffect(() => {
    const handleShowLoginModal = () => {
      const event = new CustomEvent('show-login-modal')
      window.dispatchEvent(event)
    }

    window.addEventListener('show-login-modal', handleShowLoginModal)
    return () => window.removeEventListener('show-login-modal', handleShowLoginModal)
  }, [])

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/student-dashboard" 
          element={user?.role === 'student' ? <StudentDashboard /> : <HomePage />} 
        />
        <Route 
          path="/teacher-dashboard" 
          element={user?.role === 'teacher' ? <TeacherDashboard /> : <HomePage />} 
        />
      </Routes>
    </HashRouter>
  )
}
