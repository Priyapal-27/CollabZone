import { useState, useEffect } from 'react'
import { useRoute, useLocation } from 'wouter'
import { eventAPI, registrationAPI } from '../api'

export default function RegisterEvent() {
  const [match, params] = useRoute('/register/:eventId')
  const [, navigate] = useLocation()
  const eventId = params?.eventId
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    college: '',
    address: ''
  })

  useEffect(() => {
    fetchEvent()
  }, [eventId])

  const fetchEvent = async () => {
    try {
      const response = await eventAPI.getById(eventId)
      setEvent(response.data)
    } catch (err) {
      console.error('Failed to load event:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await registrationAPI.create({
        ...formData,
        eventId: parseInt(eventId)
      })
      setShowSuccess(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        course: '',
        college: '',
        address: ''
      })
    } catch (err) {
      console.error('Registration failed:', err)
      alert('Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Event Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400">The event you're trying to register for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const eventDate = new Date(event.date)
  const isPastEvent = eventDate <= new Date()

  if (isPastEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Registration Closed</h2>
          <p className="text-gray-600 dark:text-gray-400">Registration for this event has ended.</p>
        </div>
      </div>
    )
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card max-w-md mx-auto text-center">
          <div className="text-green-600 dark:text-green-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Registration Successful!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You have successfully registered for {event.name}. You will receive a confirmation email shortly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowSuccess(false)}
              className="btn-secondary"
            >
              Register Another Person
            </button>
            <button
              onClick={() => navigate(`/events/${eventId}`)}
              className="btn-primary"
            >
              Back to Event
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Event Summary */}
      <div className="card mb-8">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Register for {event.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {eventDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p className="text-lg font-medium text-green-600 dark:text-green-400 mt-1">
              {event.fee === 0 ? 'Free Event' : `Registration Fee: ₹${event.fee}`}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Registration Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Registration Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="course" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Course/Position *
                  </label>
                  <input
                    type="text"
                    id="course"
                    name="course"
                    required
                    value={formData.course}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., B.Tech CSE, Working Professional"
                  />
                </div>

                <div>
                  <label htmlFor="college" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    College/Organization *
                  </label>
                  <input
                    type="text"
                    id="college"
                    name="college"
                    required
                    value={formData.college}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Your college or organization name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  required
                  rows={3}
                  value={formData.address}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Your complete address"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Registering...' : 'Register for Event'}
              </button>
            </form>
          </div>
        </div>

        {/* Payment & QR Code */}
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Information</h3>
            
            {event.fee === 0 ? (
              <div className="text-center py-8">
                <div className="text-green-600 dark:text-green-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Free Event</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  No payment required. Just fill out the registration form to secure your spot.
                </p>
              </div>
            ) : (
              <div>
                <div className="text-center mb-6">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">₹{event.fee}</p>
                  <p className="text-gray-600 dark:text-gray-400">Registration Fee</p>
                </div>
                
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
                  <div className="w-48 h-48 bg-white rounded-lg mx-auto flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h2M4 8h4m4 0V4m0 4h.01M8 12h.01M12 8h.01" />
                      </svg>
                      <p className="text-sm text-gray-600">QR Code for Payment</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <p>• Scan the QR code to make payment</p>
                  <p>• Take a screenshot of payment confirmation</p>
                  <p>• Upload the screenshot after registration</p>
                  <p>• You will receive confirmation once payment is verified</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}