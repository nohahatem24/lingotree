/**
 * Progress section showcasing learning journey and growth tracking
 * Features visual progress indicators and student success stories
 */

import { TreePine, Trophy, Star, TrendingUp } from 'lucide-react'

export default function ProgressSection() {
  const progressSteps = [
    {
      icon: TreePine,
      title: "Plant Your Seed",
      description: "Start with basic vocabulary and simple phrases",
      color: "from-green-400 to-green-500"
    },
    {
      icon: TrendingUp,
      title: "Watch It Grow",
      description: "Build confidence with interactive lessons and practice",
      color: "from-blue-400 to-blue-500"
    },
    {
      icon: Star,
      title: "Bloom with Confidence",
      description: "Express yourself fluently and think in English",
      color: "from-purple-400 to-purple-500"
    },
    {
      icon: Trophy,
      title: "Achieve Mastery",
      description: "Reach advanced levels and academic success",
      color: "from-yellow-400 to-yellow-500"
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Watch Your Child's{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600">
              Progress Grow
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our unique progress tracking system makes learning visible and rewarding
          </p>
        </div>

        {/* Progress Tree Visualization */}
        <div className="relative max-w-4xl mx-auto mb-20">
          {/* Tree trunk */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-full bg-gradient-to-b from-green-600 to-green-800 rounded-full opacity-20"></div>
          
          {/* Progress steps */}
          <div className="space-y-16">
            {progressSteps.map((step, index) => (
              <div key={index} className={`flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className={`flex items-center space-x-6 max-w-md ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse space-x-reverse'}`}>
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-200`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 border-gradient-to-b ${step.color.replace('from-', 'border-').replace(' to-', '').split('-')[0]}-400`}>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Features */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Visual Progress</h3>
            <p className="text-gray-600">Watch your learning tree grow with every completed lesson and achievement unlocked.</p>
          </div>

          <div className="text-center bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Rewards & Badges</h3>
            <p className="text-gray-600">Earn colorful badges and certificates as you master new skills and reach milestones.</p>
          </div>

          <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Detailed Reports</h3>
            <p className="text-gray-600">Parents receive detailed progress reports showing strengths and areas for improvement.</p>
          </div>
        </div>
      </div>
    </section>
  )
}