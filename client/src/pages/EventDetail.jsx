import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { eventAPI } from '../api'

export default function EventDetail() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchEventData()
  }, [id])

  const fetchEventData = async () => {
    try {
      const response = await eventAPI.getById(id)
      setEvent(response.data)
    } catch (err) {
      setError('Failed to load event details')
      console.error(err)
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

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Event Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    )
  }

  const eventDate = new Date(event.date)
  const isUpcoming = eventDate > new Date()

  const formatDateTime = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Event Header */}
      <div className="card mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            {event.poster ? (
              <img 
                src={event.poster} 
                alt={event.name}
                className="w-full h-64 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-20 h-20 text-blue-600 dark:text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-blue-600 dark:text-blue-400 font-medium text-lg">Event Poster</span>
                </div>
              </div>
            )}
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                isUpcoming 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
              }`}>
                {isUpcoming ? 'Upcoming Event' : 'Past Event'}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {event.name}
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              {event.description}
            </p>

            {isUpcoming && (
              <Link
                to={`/register/${event.id}`}
                className="btn-primary text-lg px-8 py-3 inline-block"
              >
                Register for Event
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Event Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Date & Time</p>
                <p className="text-gray-600 dark:text-gray-400">{formatDateTime(eventDate)}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Registration Fee</p>
                <p className="text-gray-600 dark:text-gray-400">
                  {event.fee === 0 ? 'Free' : `₹${event.fee}`}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Eligibility</p>
                <p className="text-gray-600 dark:text-gray-400">{event.eligibility}</p>
              </div>
            </div>

            {event.openings && (
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Available Spots</p>
                  <p className="text-gray-600 dark:text-gray-400">{event.openings} participants</p>
                </div>
              </div>
            )}

            {event.prize && (
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Prize Pool</p>
                  <p className="text-gray-600 dark:text-gray-400">{event.prize}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h2>
          
          <div className="space-y-4">
            {event.collegeName && (
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Organizing College</p>
                  <p className="text-gray-600 dark:text-gray-400">{event.collegeName}</p>
                </div>
              </div>
            )}

            {event.hosts && event.hosts.length > 0 && (
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Event Hosts</p>
                  <p className="text-gray-600 dark:text-gray-400">{event.hosts.join(', ')}</p>
                </div>
              </div>
            )}

            {event.contactNos && event.contactNos.length > 0 && (
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Contact Numbers</p>
                  {event.contactNos.map((contact, index) => (
                    <p key={index} className="text-gray-600 dark:text-gray-400">
                      <a href={`tel:${contact}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                        {contact}
                      </a>
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}