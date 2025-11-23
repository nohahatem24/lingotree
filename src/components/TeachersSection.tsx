/**
 * Teachers section component showcasing Miss Gannah and Miss Suzan
 * Displays separate teacher profiles with their individual expertise
 */

import { Heart, Award, Users, MessageCircle, BookOpen, Star } from 'lucide-react'
import { Button } from './ui/button'
import MissSuzan from '../assets/images/MissSuzan.png'
import MissGannah from '../assets/images/MissGannah.png'
export default function TeachersSection() {
  const teachers = [
    {
      name: "Miss Suzan", 
      image: MissSuzan,
      specialties: ["Grammar", "Vocabulary", "Reading", "Early Childhood"],
      experience: "2+ years",
      bio: "Specialized in early childhood education with a passion for making English fun and engaging for young learners."
    },
    {
      name: "Miss Gannah",
      image: MissGannah,
      specialties: ["Writing", "Speaking", "Literature", "Teen Education"],
      experience: "2+ years",
      bio: "Expert in teen English mastery and academic preparation, helping students achieve fluency and confidence."
    }
  ]

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Meet Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600">
              Teachers
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Two passionate educators working together to provide the best learning experience for your child
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-3xl p-8 md:p-12">
          {/* Individual Teacher Profiles */}
          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            {teachers.map((teacher, index) => (
              <div key={teacher.name} className="text-center">
                <div className="relative mb-6">
                  <div className="w-48 h-48 mx-auto rounded-full overflow-hidden shadow-2xl ring-4 ring-white transform hover:scale-105 transition-all duration-300">
                    <img 
                      src={teacher.image} 
                      alt={teacher.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className={`absolute -top-3 ${index === 0 ? '-right-3' : '-left-3'} bg-gradient-to-br ${index === 0 ? 'from-blue-400 to-blue-500' : 'from-green-400 to-green-500'} text-white rounded-full p-3 shadow-lg`}>
                    <Award className="w-6 h-6" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{teacher.name}</h3>
                <p className="text-lg text-gray-600 mb-4">{teacher.experience} Experience</p>
                <p className="text-gray-600 mb-6 leading-relaxed">{teacher.bio}</p>
                
                {/* Specialties */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {teacher.specialties.map((specialty) => (
                    <span 
                      key={specialty}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        index === 0 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Combined Qualifications */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-md text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Award className="w-5 h-5 text-blue-500" />
                <h4 className="font-semibold text-gray-800">Certified</h4>
              </div>
              <p className="text-sm text-gray-600">TESOL & TEFL certified educators</p>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-md text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Users className="w-5 h-5 text-green-500" />
                <h4 className="font-semibold text-gray-800">4+ Years</h4>
              </div>
              <p className="text-sm text-gray-600">Combined teaching experience</p>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-md text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Heart className="w-5 h-5 text-pink-500" />
                <h4 className="font-semibold text-gray-800">Student-Centered</h4>
              </div>
              <p className="text-sm text-gray-600">Nurturing learning environment</p>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-md text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <h4 className="font-semibold text-gray-800">500+ Students</h4>
              </div>
              <p className="text-sm text-gray-600">Happy learners worldwide</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => {
                  const element = document.querySelector('#contact')
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }}
                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white rounded-full px-6 transform hover:scale-105 transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Us
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  const element = document.querySelector('#courses')
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }}
                className="border-blue-300 text-blue-600 hover:bg-blue-50 rounded-full px-6 transform hover:scale-105 transition-all duration-200"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                View Our Courses
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
