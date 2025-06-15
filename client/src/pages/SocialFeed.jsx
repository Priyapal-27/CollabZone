import React, { useState, useEffect } from 'react'
import { feedAPI } from '../api'

export default function SocialFeed() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [newPost, setNewPost] = useState({
    content: '',
    author: ''
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await feedAPI.getAll()
      setPosts(response.data)
    } catch (err) {
      console.error('Failed to load posts:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newPost.content.trim() || !newPost.author.trim()) return

    setSubmitting(true)
    try {
      await feedAPI.create({
        ...newPost,
        content: newPost.content.trim(),
        author: newPost.author.trim()
      })
      setNewPost({ content: '', author: '' })
      await fetchPosts()
    } catch (err) {
      console.error('Failed to create post:', err)
      alert('Failed to create post. Please try again.')
    } finally {
      setSubmitting(false)
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Community Feed
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Share updates, announcements, and connect with the inter-college community.
        </p>
      </div>

      {/* Create Post */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Share Something
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="author"
              required
              value={newPost.author}
              onChange={(e) => setNewPost(prev => ({ ...prev, author: e.target.value }))}
              className="input-field"
              placeholder="Enter your name"
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              What's on your mind?
            </label>
            <textarea
              id="content"
              required
              rows={4}
              value={newPost.content}
              onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
              className="input-field"
              placeholder="Share your thoughts, announcements, or updates..."
            />
          </div>
          
          <button
            type="submit"
            disabled={submitting || !newPost.content.trim() || !newPost.author.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Posting...' : 'Share Post'}
          </button>
        </form>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Recent Posts
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No posts yet</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Be the first to share something with the community!
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="card">
              <div className="flex items-start space-x-4">
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
                  </div>
                  
                  <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {post.content}
                  </div>
                  
                  {post.image && (
                    <div className="mt-4">
                      <img
                        src={post.image}
                        alt="Post image"
                        className="rounded-lg max-w-full h-auto"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-6 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>Like</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>Comment</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}