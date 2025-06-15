import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ThemeProvider from './components/ThemeProvider'

// Public Pages
import Home from './pages/Home'
import Colleges from './pages/Colleges'
import CollegeProfile from './pages/CollegeProfile'
import EventDetail from './pages/EventDetail'
import RegisterEvent from './pages/RegisterEvent'
import SocialFeed from './pages/SocialFeed'
import Contact from './pages/Contact'

// College Admin Pages
import CollegeLogin from './college-admin/CollegeLogin'
import CollegeDashboard from './college-admin/CollegeDashboard'
import CreateEvent from './college-admin/CreateEvent'
import ManageEvents from './college-admin/ManageEvents'
import ViewRegistrations from './college-admin/ViewRegistrations'

// Admin Pages
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import AllEvents from './admin/AllEvents'
import FeedModeration from './admin/FeedModeration'
import AllUsers from './admin/AllUsers'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
          <Navbar />
          <main className="pt-16">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/colleges" element={<Colleges />} />
              <Route path="/colleges/:id" element={<CollegeProfile />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/register/:eventId" element={<RegisterEvent />} />
              <Route path="/social-feed" element={<SocialFeed />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* College Admin Routes */}
              <Route path="/college/login" element={<CollegeLogin />} />
              <Route path="/college/dashboard" element={<CollegeDashboard />} />
              <Route path="/college/create-event" element={<CreateEvent />} />
              <Route path="/college/manage-events" element={<ManageEvents />} />
              <Route path="/college/registrations/:eventId" element={<ViewRegistrations />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/events" element={<AllEvents />} />
              <Route path="/admin/feed" element={<FeedModeration />} />
              <Route path="/admin/users" element={<AllUsers />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App