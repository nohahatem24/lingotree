/**
 * Payment Modal component for course enrollment
 * Handles payment processing with mock payment gateway
 */

import { useState } from 'react'
import { X, CreditCard, Lock, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '../ui/button'
import { useCourseStore } from '../../store/courseStore'

interface PaymentModalProps {
  courseId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: (courseId: string) => void
}

export default function PaymentModal({ courseId, isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [step, setStep] = useState<'payment' | 'processing' | 'success'>('payment')
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    email: '',
    billingAddress: ''
  })

  const { getCourseById } = useCourseStore()
  const course = getCourseById(courseId)

  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }))
  }

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
  }

  const formatExpiryDate = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep('processing')

    // Mock payment processing
    await new Promise(resolve => setTimeout(resolve, 3000))

    setStep('success')
    
    // Auto close and trigger success after showing success message
    setTimeout(() => {
      onSuccess(courseId)
    }, 2000)
  }

  if (!isOpen || !course) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {step === 'success' ? 'Payment Successful!' : 'Complete Your Enrollment'}
          </h2>
          {step !== 'processing' && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Course Summary */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="flex items-center space-x-4">
            <img 
              src={course.image} 
              alt={course.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">{course.title}</h3>
              <p className="text-sm text-gray-600">{course.level} • {course.duration}</p>
              <p className="text-2xl font-bold text-green-600 mt-1">${course.price}</p>
            </div>
          </div>
        </div>

        {step === 'payment' && (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Card Number</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={paymentData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Expiry Date</label>
                <input
                  type="text"
                  value={paymentData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">CVV</label>
                <input
                  type="text"
                  value={paymentData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Name on Card</label>
              <input
                type="text"
                value={paymentData.nameOnCard}
                onChange={(e) => handleInputChange('nameOnCard', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                value={paymentData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="john@example.com"
                required
              />
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center space-x-2">
              <Lock className="w-5 h-5 text-blue-500" />
              <p className="text-sm text-blue-700">
                Your payment information is secure and encrypted
              </p>
            </div>

            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white py-3 rounded-lg font-medium"
            >
              Complete Payment - ${course.price}
            </Button>

            {/* Demo Notice */}
            <div className="text-center text-xs text-gray-500 bg-yellow-50 border border-yellow-200 rounded-lg p-2">
              This is a demo. Use any card details to simulate payment.
            </div>
          </form>
        )}

        {step === 'processing' && (
          <div className="p-12 text-center">
            <Loader2 className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Processing Payment</h3>
            <p className="text-gray-600">Please wait while we process your payment...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Welcome to the Course!</h3>
            <p className="text-gray-600 mb-4">
              You've successfully enrolled in <strong>{course.title}</strong>
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to your dashboard...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
