/**
 * Hero section component for LingoNest homepage
 * Features welcoming message and call-to-action for course enrollment
 */

import { ArrowRight, Star, Users, BookOpen } from 'lucide-react'
import { Button } from './ui/button'
import pic1 from '../assets/images/pic1.png'

export default function HeroSection() {
  return (
    <section id="home" className="bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight">
                Welcome to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600">
                  LingoNest
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 font-medium">
                Where English comes to life!
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                English that grows with your child — from their first word to fluency. 
                Join our nurturing learning environment guided by experienced teachers 
                Miss Gannah and Miss Suzan.
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2 bg-white/80 rounded-full px-4 py-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">500+ Happy Students</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 rounded-full px-4 py-2">
                <BookOpen className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-gray-700">50+ Courses</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 rounded-full px-4 py-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">4.9/5 Rating</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={() => {
                  const element = document.querySelector('#courses')
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }}
                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white rounded-full px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                Start Learning Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  const element = document.querySelector('#courses')
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }}
                className="border-2 border-blue-300 text-blue-600 hover:bg-blue-50 rounded-full px-8 py-4 text-lg font-medium transform hover:scale-105 transition-all duration-200"
              >
                Explore Courses
              </Button>
            </div>
          </div>

          {/* Right content - Image */}
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-300">
              <img 
                src={pic1} 
                alt="Children learning English"
                className="w-full h-80 object-cover rounded-2xl"
              />
              
              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 bg-yellow-400 rounded-full p-3 shadow-lg animate-bounce">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-green-400 rounded-full p-3 shadow-lg animate-pulse">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-200/30 to-blue-200/30 rounded-3xl -z-10 transform -rotate-6"></div>
          </div>
        </div>
      </div>
    </section>
  )
}