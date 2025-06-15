import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminAPI } from '../api'

export default function FeedModeration() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const adminData = localStorage.getItem('admin')
    if (!adminData) {
      navigate('/admin/login')
      return
    }
    
    fetchPosts()
  }, [navigate])

  const fetchPosts = async () => {
    try {
      const response = await adminAPI.getAllFeed()
      setPosts(response.data)
    } catch (err) {
      console.error('Failed to load posts:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatTimeAgo = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const approvedPosts = posts.filter(post => post.approved)
  const pendingPosts = posts.filter(post => !post.approved)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Feed Moderation
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Review and moderate community posts
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            {approvedPosts.length}
          </div>
          <div className="text-gray-600 dark:text-gray-400">Approved Posts</div>
        </div>
        
        <div className="card text-center">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
            {pendingPosts.length}
          </div>
          <div className="text-gray-600 dark:text-gray-400">Pending Review</div>
        </div>
        
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {posts.length}
          </div>
          <div className="text-gray-600 dark:text-gray-400">Total Posts</div>
        </div>
      </div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No posts found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            No posts have been submitted to the community feed yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-grow">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        {post.author?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {post.author}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatTimeAgo(post.timestamp)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        post.approved 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}>
                        {post.approved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                    
                    <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-4">
                      {post.content}
                    </div>
                    
                    {post.image && (
                      <div className="mb-4">
                        <img
                          src={post.image}
                          alt="Post image"
                          className="rounded-lg max-w-md h-auto"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-shrink-0 ml-4">
                  <div className="flex space-x-2">
                    {!post.approved && (
                      <button className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded transition-colors">
                        Approve
                      </button>
                    )}
                    <button className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}