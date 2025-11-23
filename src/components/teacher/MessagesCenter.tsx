/**
 * Messages Center component for teacher-student communication
 * Handles messages, comments, and notifications
 */

import { useState } from 'react'
import { Search, Send, MessageCircle, User, Clock, Star, Reply } from 'lucide-react'
import { Button } from '../ui/button'

interface Message {
  id: string
  studentName: string
  studentId: string
  studentAvatar: string
  subject: string
  content: string
  timestamp: Date
  isRead: boolean
  type: 'message' | 'comment' | 'question'
  courseTitle?: string
  lessonTitle?: string
}

export default function MessagesCenter() {
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread' | 'comments'>('all')
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [replyText, setReplyText] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock messages data
  const mockMessages: Message[] = [
    {
      id: '1',
      studentName: 'Alex Johnson',
      studentId: 'student1',
      studentAvatar: 'https://pub-cdn.sider.ai/u/U06XHNVR9EG/web-coder/689229887ce69ee490366798/resource/61e2b1f4-7245-4ae0-93df-3f7f1c2ab96a.jpg',
      subject: 'Question about Grammar Lesson',
      content: 'Hi Miss Gannah! I\'m having trouble understanding the difference between past perfect and present perfect. Could you please explain it again?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false,
      type: 'question',
      courseTitle: 'Little Sprouts English',
      lessonTitle: 'Grammar Basics'
    },
    {
      id: '2',
      studentName: 'Emma Wilson',
      studentId: 'student2',
      studentAvatar: 'https://pub-cdn.sider.ai/u/U06XHNVR9EG/web-coder/689229887ce69ee490366798/resource/e462a90d-8c10-4690-b5bb-fc44599344e8.jpg',
      subject: 'Great lesson!',
      content: 'Thank you for the amazing reading lesson today! The story about the magical forest was so interesting. I can\'t wait for the next one!',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      isRead: true,
      type: 'message',
      courseTitle: 'Growing Readers',
      lessonTitle: 'Reading Adventures'
    },
    {
      id: '3',
      studentName: 'Michael Chen',
      studentId: 'student3',
      studentAvatar: 'https://pub-cdn.sider.ai/u/U06XHNVR9EG/web-coder/689229887ce69ee490366798/resource/a8a0c797-f11e-47c4-bdfa-10ce181a5290.jpg',
      subject: 'Assignment Help Needed',
      content: 'I\'m working on the essay assignment but I\'m not sure about the structure. Should I include an introduction, body paragraphs, and conclusion? Also, how many words should it be?',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      isRead: false,
      type: 'question',
      courseTitle: 'Teen English Mastery',
      lessonTitle: 'Essay Writing'
    },
    {
      id: '4',
      studentName: 'Alex Johnson',
      studentId: 'student1',
      studentAvatar: 'https://pub-cdn.sider.ai/u/U06XHNVR9EG/web-coder/689229887ce69ee490366798/resource/61e2b1f4-7245-4ae0-93df-3f7f1c2ab96a.jpg',
      subject: 'Comment on Video Lesson',
      content: 'The pronunciation exercises in this video are really helpful! Could you make more videos like this one?',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isRead: true,
      type: 'comment',
      courseTitle: 'Little Sprouts English',
      lessonTitle: 'Pronunciation Practice'
    }
  ]

  const filteredMessages = mockMessages.filter(message => {
    const matchesSearch = message.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = selectedTab === 'all' || 
                      (selectedTab === 'unread' && !message.isRead) ||
                      (selectedTab === 'comments' && message.type === 'comment')
    return matchesSearch && matchesTab
  })

  const handleSendReply = () => {
    if (replyText.trim() && selectedMessage) {
      alert(`Reply sent to ${selectedMessage.studentName}: ${replyText}`)
      setReplyText('')
      setSelectedMessage(null)
    }
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return 'Yesterday'
    return `${diffInDays} days ago`
  }

  const unreadCount = mockMessages.filter(m => !m.isRead).length

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Messages Center</h2>
          <p className="text-gray-600">{filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''}</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Search messages..."
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'all', name: 'All Messages', count: mockMessages.length },
          { id: 'unread', name: 'Unread', count: unreadCount },
          { id: 'comments', name: 'Comments', count: mockMessages.filter(m => m.type === 'comment').length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedTab === tab.id
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.name}
            {tab.count > 0 && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                selectedTab === tab.id
                  ? 'bg-purple-100 text-purple-600'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-2 space-y-3">
          {filteredMessages.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Messages</h3>
              <p className="text-gray-600">
                {searchTerm ? 'No messages match your search.' : 'New messages will appear here.'}
              </p>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <div 
                key={message.id}
                onClick={() => setSelectedMessage(message)}
                className={`bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-all duration-200 ${
                  !message.isRead ? 'border-l-4 border-purple-500' : ''
                } ${selectedMessage?.id === message.id ? 'ring-2 ring-purple-200' : ''}`}
              >
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-pink-500">
                      <img 
                        src={message.studentAvatar} 
                        alt={message.studentName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {!message.isRead && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h3 className={`font-medium ${!message.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                          {message.studentName}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          message.type === 'question' ? 'bg-orange-100 text-orange-800' :
                          message.type === 'comment' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {message.type}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-500 text-sm">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimestamp(message.timestamp)}</span>
                      </div>
                    </div>
                    
                    <h4 className={`font-medium mb-1 ${!message.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                      {message.subject}
                    </h4>
                    
                    <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                      {message.content}
                    </p>
                    
                    {message.courseTitle && (
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span className="bg-gray-100 px-2 py-0.5 rounded">{message.courseTitle}</span>
                        {message.lessonTitle && (
                          <>
                            <span>•</span>
                            <span>{message.lessonTitle}</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Detail & Reply */}
        <div className="lg:col-span-1">
          {selectedMessage ? (
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-pink-500">
                  <img 
                    src={selectedMessage.studentAvatar} 
                    alt={selectedMessage.studentName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{selectedMessage.studentName}</h3>
                  <p className="text-sm text-gray-600">{formatTimestamp(selectedMessage.timestamp)}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">{selectedMessage.subject}</h4>
                <p className="text-gray-700 leading-relaxed text-sm">{selectedMessage.content}</p>
              </div>
              
              {selectedMessage.courseTitle && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">Course Context:</div>
                  <div className="text-sm font-medium text-gray-800">{selectedMessage.courseTitle}</div>
                  {selectedMessage.lessonTitle && (
                    <div className="text-xs text-gray-600">{selectedMessage.lessonTitle}</div>
                  )}
                </div>
              )}
              
              {/* Reply Section */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Reply to {selectedMessage.studentName}</label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  rows={4}
                  placeholder="Type your reply..."
                />
                <div className="flex space-x-2">
                  <Button
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Reply
                  </Button>
                  <Button
                    onClick={() => setSelectedMessage(null)}
                    variant="outline"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h4 className="font-medium text-gray-800 mb-2">Select a Message</h4>
              <p className="text-gray-600 text-sm">Click on a message to read and reply</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
