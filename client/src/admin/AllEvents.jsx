import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminAPI } from '../api'

export default function AllEvents() {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const adminData = localStorage.getItem('admin')
    if (!adminData) {
      navigate('/admin/login')
      return
    }
    
    fetchEvents()
  }, [navigate])

  const fetchEvents = async () => {
    try {
      const response = await adminAPI.getAllEvents()
      setEvents(response.data)
    } catch (err) {
      console.error('Failed to load events:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          All Events Management
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Monitor and manage all events across the platform
        </p>
      </div>

      {events.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No events found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            No events have been created on the platform yet.
          </p>
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Event Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    College
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Fee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {events.map((event) => {
                  const eventDate = new Date(event.date)
                  const isUpcoming = eventDate > new Date()
                  
                  return (
                    <tr key={event.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {event.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {event.eligibility}
                          </div>
                          {event.description && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                              {event.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          College ID: {event.collegeId}
                        </div>
                        {event.hosts && event.hosts.length > 0 && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Hosts: {event.hosts.join(', ')}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {eventDate.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {eventDate.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {event.fee === 0 ? 'Free' : `₹${event.fee}`}
                        </div>
                        {event.prize && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Prize: {event.prize}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          isUpcoming 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                        }`}>
                          {isUpcoming ? 'Upcoming' : 'Completed'}
                        </span>
                        {event.openings && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {event.openings} spots
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <a
                          href={`/events/${event.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          View
                        </a>
                        {event.contactNos && event.contactNos.length > 0 && (
                          <span className="text-gray-500 dark:text-gray-400">
                            Contact: {event.contactNos[0]}
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}