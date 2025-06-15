import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { eventAPI } from '../api'

export default function CollegeDashboard() {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [college, setCollege] = useState(null)

  useEffect(() => {
    const collegeData = localStorage.getItem('college')
    if (!collegeData) {
      navigate('/college/login')
      return
    }
    
    setCollege(JSON.parse(collegeData))
    fetchEvents()
  }, [navigate])

  const fetchEvents = async () => {
    try {
      const response = await eventAPI.getAll()
      // Filter events for this college
      const collegeEvents = response.data.filter(event => event.collegeId === college?.id)
      setEvents(collegeEvents)
    } catch (err) {
      console.error('Failed to load events:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('college')
    navigate('/college/login')
  }

  const upcomingEvents = events.filter(event => new Date(event.date) > new Date())
  const pastEvents = events.filter(event => new Date(event.date) <= new Date())

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            College Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Welcome back, {college?.name}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {events.length}
          </div>
          <div className="text-gray-600 dark:text-gray-400">Total Events</div>
        </div>
        
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            {upcomingEvents.length}
          </div>
          <div className="text-gray-600 dark:text-gray-400">Upcoming</div>
        </div>
        
        <div className="card text-center">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
            {pastEvents.length}
          </div>
          <div className="text-gray-600 dark:text-gray-400">Completed</div>
        </div>
        
        <div className="card text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            0
          </div>
          <div className="text-gray-600 dark:text-gray-400">Total Registrations</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/college/create-event" className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Create New Event</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Add a new event to your calendar</p>
            </div>
          </div>
        </Link>

        <Link to="/college/manage-events" className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Manage Events</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Edit or delete existing events</p>
            </div>
          </div>
        </Link>

        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">View Registrations</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">See who registered for events</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Events</h2>
          <Link to="/college/manage-events" className="text-blue-600 dark:text-blue-400 hover:underline">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No events yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start by creating your first event to engage with other colleges.
            </p>
            <Link to="/college/create-event" className="btn-primary">
              Create Your First Event
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
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
                {events.slice(0, 5).map((event) => {
                  const eventDate = new Date(event.date)
                  const isUpcoming = eventDate > new Date()
                  
                  return (
                    <tr key={event.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {event.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {eventDate.toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {event.fee === 0 ? 'Free' : `₹${event.fee}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          isUpcoming 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                        }`}>
                          {isUpcoming ? 'Upcoming' : 'Completed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          to={`/college/registrations/${event.id}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline mr-4"
                        >
                          View Registrations
                        </Link>
                        <Link
                          to={`/events/${event.id}`}
                          className="text-green-600 dark:text-green-400 hover:underline"
                        >
                          View Event
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}