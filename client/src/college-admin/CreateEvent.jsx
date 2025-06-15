import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { eventAPI } from '../api'

export default function CreateEvent() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    fee: '',
    eligibility: '',
    hosts: '',
    prize: '',
    openings: '',
    contactNos: '',
    description: ''
  })

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
      const college = JSON.parse(localStorage.getItem('college'))
      
      const eventData = {
        ...formData,
        collegeId: college.id,
        date: new Date(`${formData.date}T${formData.time}`).toISOString(),
        fee: parseInt(formData.fee) || 0,
        openings: parseInt(formData.openings) || null,
        hosts: formData.hosts.split(',').map(h => h.trim()).filter(h => h),
        contactNos: formData.contactNos.split(',').map(c => c.trim()).filter(c => c)
      }

      await eventAPI.create(eventData)
      navigate('/college/dashboard')
    } catch (err) {
      console.error('Failed to create event:', err)
      alert('Failed to create event. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Create New Event
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Fill out the details below to create a new event for your college.
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Event Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="input-field"
              placeholder="e.g., TechFest 2024, Cultural Night"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Event Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                value={formData.date}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Event Time *
              </label>
              <input
                type="time"
                id="time"
                name="time"
                required
                value={formData.time}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fee" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Registration Fee (₹)
              </label>
              <input
                type="number"
                id="fee"
                name="fee"
                min="0"
                value={formData.fee}
                onChange={handleInputChange}
                className="input-field"
                placeholder="0 for free events"
              />
            </div>

            <div>
              <label htmlFor="openings" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Available Spots
              </label>
              <input
                type="number"
                id="openings"
                name="openings"
                min="1"
                value={formData.openings}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Maximum participants"
              />
            </div>
          </div>

          <div>
            <label htmlFor="eligibility" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Eligibility Criteria *
            </label>
            <input
              type="text"
              id="eligibility"
              name="eligibility"
              required
              value={formData.eligibility}
              onChange={handleInputChange}
              className="input-field"
              placeholder="e.g., All students, UG students only, Open to all"
            />
          </div>

          <div>
            <label htmlFor="hosts" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Event Hosts *
            </label>
            <input
              type="text"
              id="hosts"
              name="hosts"
              required
              value={formData.hosts}
              onChange={handleInputChange}
              className="input-field"
              placeholder="e.g., Computer Science Department, Tech Club (comma separated)"
            />
          </div>

          <div>
            <label htmlFor="contactNos" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contact Numbers *
            </label>
            <input
              type="text"
              id="contactNos"
              name="contactNos"
              required
              value={formData.contactNos}
              onChange={handleInputChange}
              className="input-field"
              placeholder="e.g., +91-9876543210, +91-9876543211 (comma separated)"
            />
          </div>

          <div>
            <label htmlFor="prize" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prize Pool
            </label>
            <input
              type="text"
              id="prize"
              name="prize"
              value={formData.prize}
              onChange={handleInputChange}
              className="input-field"
              placeholder="e.g., ₹50,000, Certificates, Trophies"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Event Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Provide a detailed description of your event..."
            />
          </div>

          <div className="flex items-center justify-between pt-6">
            <button
              type="button"
              onClick={() => navigate('/college/dashboard')}
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating Event...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}