/**
 * Recent Activity component showing student's latest learning activities
 * Displays completed lessons, quiz scores, and achievements
 */

import { Clock, CheckCircle, Trophy, BookOpen, Star } from 'lucide-react'

export default function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: 'lesson',
      title: 'Completed "Hello World - First Words"',
      course: 'Little Sprouts English',
      time: '2 hours ago',
      icon: CheckCircle,
      color: 'text-green-500'
    },
    {
      id: 2,
      type: 'quiz',
      title: 'Scored 85% on Colors and Shapes Quiz',
      course: 'Little Sprouts English',
      time: '1 day ago',
      icon: Star,
      color: 'text-yellow-500'
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Earned "First Steps" achievement',
      course: 'General',
      time: '2 days ago',
      icon: Trophy,
      color: 'text-purple-500'
    },
    {
      id: 4,
      type: 'lesson',
      title: 'Started "Reading Adventures Begin"',
      course: 'Growing Readers',
      time: '3 days ago',
      icon: BookOpen,
      color: 'text-blue-500'
    }
  ]

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className={`p-2 rounded-full bg-gray-100 ${activity.color}`}>
              <activity.icon className="w-4 h-4" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 text-sm">
                {activity.title}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {activity.course}
              </p>
              <div className="flex items-center space-x-1 mt-2">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
        
        {activities.length === 0 && (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No recent activity</p>
            <p className="text-sm text-gray-500">Start learning to see your progress here!</p>
          </div>
        )}
      </div>
    </div>
  )
}
