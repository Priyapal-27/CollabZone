import { Router, Route, Switch } from 'wouter'
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
            <Switch>
              {/* Public Routes */}
              <Route path="/" component={Home} />
              <Route path="/colleges" component={Colleges} />
              <Route path="/colleges/:id" component={CollegeProfile} />
              <Route path="/events/:id" component={EventDetail} />
              <Route path="/register/:eventId" component={RegisterEvent} />
              <Route path="/social-feed" component={SocialFeed} />
              <Route path="/contact" component={Contact} />
              
              {/* College Admin Routes */}
              <Route path="/college/login" component={CollegeLogin} />
              <Route path="/college/dashboard" component={CollegeDashboard} />
              <Route path="/college/create-event" component={CreateEvent} />
              <Route path="/college/manage-events" component={ManageEvents} />
              <Route path="/college/registrations/:eventId" component={ViewRegistrations} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" component={AdminLogin} />
              <Route path="/admin/dashboard" component={AdminDashboard} />
              <Route path="/admin/events" component={AllEvents} />
              <Route path="/admin/feed" component={FeedModeration} />
              <Route path="/admin/users" component={AllUsers} />
            </Switch>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App