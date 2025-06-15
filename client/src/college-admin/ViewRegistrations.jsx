import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { eventAPI } from '../api'

export default function ViewRegistrations() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const collegeData = localStorage.getItem('college')
    if (!collegeData) {
      navigate('/college/login')
      return
    }
    
    fetchEventAndRegistrations()
  }, [eventId, navigate])

  const fetchEventAndRegistrations = async () => {
    try {
      const [eventResponse, registrationsResponse] = await Promise.all([
        eventAPI.getById(eventId),
        eventAPI.getRegistrations(eventId)
      ])
      
      setEvent(eventResponse.data)
      setRegistrations(registrationsResponse.data)
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    if (registrations.length === 0) {
      alert('No registrations to export')
      return
    }

    const headers = ['Name', 'Email', 'Phone', 'Course', 'College', 'Address', 'Registration Date']
    const csvContent = [
      headers.join(','),
      ...registrations.map(reg => [
        `"${reg.name}"`,
        `"${reg.email}"`,
        `"${reg.phone}"`,
        `"${reg.course}"`,
        `"${reg.college}"`,
        `"${reg.address}"`,
        `"${new Date(reg.registeredAt).toLocaleDateString()}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${event.name}_registrations.csv`
    a.click()
    window.URL.revokeObjectURL(url)
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
          <p className="text-gray-600 dark:text-gray-400">The event you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Event Header */}
      <div className="card mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {event.name} - Registrations
            </h1>
            <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <span>Date: {new Date(event.date).toLocaleDateString()}</span>
              <span>Fee: {event.fee === 0 ? 'Free' : `₹${event.fee}`}</span>
              <span>Total Registrations: {registrations.length}</span>
            </div>
          </div>
          {registrations.length > 0 && (
            <button
              onClick={exportToCSV}
              className="btn-secondary"
            >
              Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Registrations Table */}
      <div className="card">
        {registrations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No registrations yet</h3>
            <p className="text-gray-600 dark:text-gray-400">
              People haven't started registering for this event yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Participant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Course/Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Institution
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Registration Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {registrations.map((registration, index) => (
                  <tr key={registration.id || index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {registration.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {registration.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {registration.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {registration.course}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {registration.college}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {registration.address}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(registration.registeredAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}