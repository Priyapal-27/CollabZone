import React from 'react'
import { Link } from 'react-router-dom'

export default function CollegeCard({ college }) {
  return (
    <Link to={`/colleges/${college.id}`} className="block">
      <div className="card hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              {college.logo ? (
                <img 
                  src={college.logo} 
                  alt={`${college.name} logo`}
                  className="w-12 h-12 object-contain rounded-lg"
                />
              ) : (
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {college.name?.charAt(0)}
                </span>
              )}
            </div>
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {college.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
              {college.location}
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{college.studentCount?.toLocaleString()} students</span>
              <span>Est. {college.establishedYear}</span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}