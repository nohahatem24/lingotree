/**
 * Teacher Settings component for profile and account management
 * Allows teachers to update their profile, specialties, and preferences
 */

import { useState } from 'react'
import { User, Mail, Camera, Save, Loader2, Award, Book, Settings as SettingsIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { useAuthStore } from '../../store/authStore'
import { Teacher } from '../../types'

export default function TeacherSettings() {
  const { user, updateProfile, uploadProfilePicture, isLoading } = useAuthStore()
  const teacher = user as Teacher

  const [formData, setFormData] = useState({
    username: teacher?.username || '',
    email: teacher?.email || '',
    bio: teacher?.bio || '',
    experience: teacher?.experience || 0,
    specialties: teacher?.specialties || []
  })
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState(teacher?.profilePicture || '')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState<'profile' | 'teaching' | 'preferences'>('profile')

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfilePicture(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleAddSpecialty = () => {
    setFormData(prev => ({
      ...prev,
      specialties: [...prev.specialties, '']
    }))
  }

  const handleSpecialtyChange = (index: number, value: string) => {
    const newSpecialties = [...formData.specialties]
    newSpecialties[index] = value
    setFormData(prev => ({ ...prev, specialties: newSpecialties }))
  }

  const handleRemoveSpecialty = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess('')

    let profilePictureUrl = teacher?.profilePicture

    if (profilePicture) {
      profilePictureUrl = await uploadProfilePicture(profilePicture)
    } else if (previewUrl && previewUrl !== teacher?.profilePicture) {
      profilePictureUrl = previewUrl
    }

    const success = await updateProfile({
      username: formData.username,
      email: formData.email,
      profilePicture: profilePictureUrl,
      bio: formData.bio,
      experience: formData.experience,
      specialties: formData.specialties.filter(s => s.trim())
    })

    if (success) {
      setSuccess('Profile updated successfully!')
      setProfilePicture(null)
      setTimeout(() => setSuccess(''), 3000)
    }
  }

  if (!teacher) return null

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'teaching', name: 'Teaching Info', icon: Award },
    { id: 'preferences', name: 'Preferences', icon: SettingsIcon }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Teacher Settings</h2>
        <p className="text-gray-600">Manage your profile and teaching preferences</p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-sm animate-in slide-in-from-top-1">
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Picture */}
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center overflow-hidden">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-white" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="profile-picture-teacher"
                  />
                  <label
                    htmlFor="profile-picture-teacher"
                    className="absolute -bottom-2 -right-2 bg-purple-500 text-white p-2 rounded-full cursor-pointer hover:bg-purple-600 transition-colors shadow-lg"
                  >
                    <Camera className="w-4 h-4" />
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  Click the camera icon to change your profile picture
                </p>
              </div>

              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      placeholder="Enter your full name"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      placeholder="Enter your email"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none transition-colors"
                  rows={4}
                  placeholder="Tell students about yourself and your teaching approach..."
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {activeTab === 'teaching' && (
            <div className="space-y-6">
              {/* Experience */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Years of Experience</label>
                <input
                  type="number"
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  min="0"
                  max="50"
                  disabled={isLoading}
                />
              </div>

              {/* Specialties */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-gray-700">Teaching Specialties</label>
                  <Button
                    type="button"
                    onClick={handleAddSpecialty}
                    size="sm"
                    variant="outline"
                    className="text-purple-600 border-purple-300"
                  >
                    Add Specialty
                  </Button>
                </div>
                <div className="space-y-3">
                  {formData.specialties.map((specialty, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={specialty}
                        onChange={(e) => handleSpecialtyChange(index, e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="e.g., Grammar, Vocabulary, Speaking"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        onClick={() => handleRemoveSpecialty(index)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  {formData.specialties.length === 0 && (
                    <p className="text-gray-500 text-sm italic">
                      Add your teaching specialties to help students understand your expertise
                    </p>
                  )}
                </div>
              </div>

              {/* Teaching Stats */}
              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="font-medium text-gray-800 mb-4">Your Teaching Impact</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">250+</div>
                    <div className="text-sm text-gray-600">Students Taught</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">50+</div>
                    <div className="text-sm text-gray-600">Lessons Created</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">4.8</div>
                    <div className="text-sm text-gray-600">Average Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">95%</div>
                    <div className="text-sm text-gray-600">Completion Rate</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              {/* Notification Preferences */}
              <div>
                <h3 className="font-medium text-gray-800 mb-4">Notification Preferences</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" defaultChecked />
                    <span className="text-gray-700">Email notifications for new student enrollments</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" defaultChecked />
                    <span className="text-gray-700">Notifications for student messages and comments</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                    <span className="text-gray-700">Weekly progress reports</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" defaultChecked />
                    <span className="text-gray-700">Assignment submission notifications</span>
                  </label>
                </div>
              </div>

              {/* Teaching Preferences */}
              <div>
                <h3 className="font-medium text-gray-800 mb-4">Teaching Preferences</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Preferred Teaching Method</label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                      <option>Interactive Learning</option>
                      <option>Project-Based Learning</option>
                      <option>Traditional Instruction</option>
                      <option>Blended Approach</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Class Size Preference</label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                      <option>Small Groups (5-10 students)</option>
                      <option>Medium Groups (11-20 students)</option>
                      <option>Large Groups (21+ students)</option>
                      <option>One-on-One</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Account Settings */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-medium text-gray-800 mb-4">Account Settings</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-800">Two-Factor Authentication</div>
                      <div className="text-sm text-gray-600">Add an extra layer of security</div>
                    </div>
                    <Button size="sm" variant="outline" className="text-purple-600 border-purple-300">
                      Enable
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-800">Download Teaching Data</div>
                      <div className="text-sm text-gray-600">Export your courses and student data</div>
                    </div>
                    <Button size="sm" variant="outline" className="text-blue-600 border-blue-300">
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t">
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
