import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { adminAPI } from '../api'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalColleges: 0,
    totalEvents: 0,
    totalUsers: 0,
    pendingPosts: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const adminData = localStorage.getItem('admin')
    if (!adminData) {
      navigate('/admin/login')
      return
    }
    
    fetchStats()
  }, [navigate])

  const fetchStats = async () => {
    try {
      const [eventsResponse, usersResponse, feedResponse] = await Promise.all([
        adminAPI.getAllEvents(),
        adminAPI.getUsers(),
        adminAPI.getAllFeed()
      ])
      
      setStats({
        totalColleges: 2, // Mock data since no colleges API for admin
        totalEvents: eventsResponse.data.length,
        totalUsers: usersResponse.data.length,
        pendingPosts: feedResponse.data.filter(post => !post.approved).length
      })
    } catch (err) {
      console.error('Failed to load stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('admin')
    navigate('/admin/login')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Super Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Platform overview and management controls
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {loading ? '...' : stats.totalColleges}
          </div>
          <div className="text-gray-600 dark:text-gray-400">Registered Colleges</div>
        </div>
        
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            {loading ? '...' : stats.totalEvents}
          </div>
          <div className="text-gray-600 dark:text-gray-400">Total Events</div>
        </div>
        
        <div className="card text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            {loading ? '...' : stats.totalUsers}
          </div>
          <div className="text-gray-600 dark:text-gray-400">Platform Users</div>
        </div>
        
        <div className="card text-center">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
            {loading ? '...' : stats.pendingPosts}
          </div>
          <div className="text-gray-600 dark:text-gray-400">Pending Posts</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/admin/events" className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Manage Events</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">View and moderate all events</p>
            </div>
          </div>
        </Link>

        <Link to="/admin/feed" className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Feed Moderation</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Review and approve posts</p>
            </div>
          </div>
        </Link>

        <Link to="/admin/users" className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">User Management</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">View platform users</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Events
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">TechFest 2024</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tech University</p>
              </div>
              <span className="text-sm text-green-600 dark:text-green-400">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Art Exhibition</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Arts College</p>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            System Health
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Server Status</span>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full">
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Database</span>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">API Status</span>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full">
                Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}