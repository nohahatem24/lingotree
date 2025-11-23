/**
 * Home page component for LingoNest
 * Main landing page showcasing the educational platform
 */

import Navigation from '../components/Navigation'
import HeroSection from '../components/HeroSection'
import TeachersSection from '../components/TeachersSection'
import FeaturedCourses from '../components/FeaturedCourses'
import ProgressSection from '../components/ProgressSection'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <TeachersSection />
      <FeaturedCourses />
      <ProgressSection />
      <Footer />
    </div>
  )
}