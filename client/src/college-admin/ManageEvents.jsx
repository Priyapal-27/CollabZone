import { useState, useEffect } from 'react'
import { Link, useLocation } from 'wouter'
import { eventAPI } from '../api'

export default function ManageEvents() {
  const [, navigate] = useLocation()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [college, setCollege] = useState(null)

  useEffect(() => {
    const collegeData = localStorage.getItem('college')
    if (!collegeData) {
      navigate('/college/login')
      return
    }
    
    const parsedCollege = JSON.parse(collegeData)
    setCollege(parsedCollege)
    fetchEvents(parsedCollege.id)
  }, [navigate])

  const fetchEvents = async (collegeId) => {
    try {
      const response = await eventAPI.getAll()
      const collegeEvents = response.data.filter(event => event.collegeId === collegeId)
      setEvents(collegeEvents)
    } catch (err) {
      console.error('Failed to load events:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return
    }

    try {
      await eventAPI.delete(eventId)
      setEvents(events.filter(event => event.id !== eventId))
    } catch (err) {
      console.error('Failed to delete event:', err)
      alert('Failed to delete event. Please try again.')
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Manage Events
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            View, edit, and manage all events for {college?.name}
          </p>
        </div>
        <Link to="/college/create-event" className="btn-primary">
          Create New Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No events created yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start by creating your first event to engage with other colleges.
          </p>
          <Link to="/college/create-event" className="btn-primary">
            Create Your First Event
          </Link>
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Event Name
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
                    Spots
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
                        </div>
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {event.openings || 'Unlimited'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Link
                          to={`/events/${event.id}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          View
                        </Link>
                        <Link
                          to={`/college/registrations/${event.id}`}
                          className="text-green-600 dark:text-green-400 hover:underline"
                        >
                          Registrations
                        </Link>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-red-600 dark:text-red-400 hover:underline"
                        >
                          Delete
                        </button>
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