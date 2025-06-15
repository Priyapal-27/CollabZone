import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, '../client/dist')))
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Mock data storage (will be replaced with MongoDB later)
let colleges = [
  {
    id: 1,
    name: 'Tech University',
    email: 'admin@techuni.edu',
    logo: '/uploads/tech-uni-logo.png',
    description: 'Leading technology university',
    location: 'Silicon Valley, CA',
    studentCount: 5000,
    establishedYear: 1985
  },
  {
    id: 2,
    name: 'Arts College',
    email: 'admin@artscollege.edu',
    logo: '/uploads/arts-college-logo.png',
    description: 'Premier arts and design institution',
    location: 'New York, NY',
    studentCount: 2500,
    establishedYear: 1920
  }
]

let events = [
  {
    id: 1,
    name: 'TechFest 2024',
    collegeId: 1,
    date: '2024-03-15T10:00:00Z',
    fee: 500,
    eligibility: 'All students',
    hosts: ['Tech Club', 'Innovation Society'],
    contactNos: ['+1-555-0123', '+1-555-0124'],
    prize: '₹50,000',
    openings: 100,
    poster: '/uploads/techfest-poster.jpg',
    description: 'Annual technology festival'
  },
  {
    id: 2,
    name: 'Art Exhibition',
    collegeId: 2,
    date: '2024-02-20T14:00:00Z',
    fee: 0,
    eligibility: 'Art students',
    hosts: ['Fine Arts Department'],
    contactNos: ['+1-555-0125'],
    prize: '₹25,000',
    openings: 50,
    poster: '/uploads/art-exhibition-poster.jpg',
    description: 'Student art showcase'
  }
]

let registrations = []
let feedPosts = []
let users = []

// API Routes

// Colleges
app.get('/api/colleges', (req, res) => {
  res.json(colleges)
})

app.get('/api/colleges/:id', (req, res) => {
  const college = colleges.find(c => c.id === parseInt(req.params.id))
  if (!college) {
    return res.status(404).json({ error: 'College not found' })
  }
  
  const collegeEvents = events.filter(e => e.collegeId === college.id)
  res.json({ college, events: collegeEvents })
})

app.post('/api/colleges', (req, res) => {
  const newCollege = {
    id: colleges.length + 1,
    ...req.body,
    approved: true // Auto-approve as per requirements
  }
  colleges.push(newCollege)
  res.status(201).json(newCollege)
})

// Events
app.get('/api/events', (req, res) => {
  res.json(events)
})

app.get('/api/events/:id', (req, res) => {
  const event = events.find(e => e.id === parseInt(req.params.id))
  if (!event) {
    return res.status(404).json({ error: 'Event not found' })
  }
  
  const college = colleges.find(c => c.id === event.collegeId)
  res.json({ ...event, collegeName: college?.name })
})

app.post('/api/events', (req, res) => {
  const newEvent = {
    id: events.length + 1,
    ...req.body
  }
  events.push(newEvent)
  res.status(201).json(newEvent)
})

app.put('/api/events/:id', (req, res) => {
  const eventIndex = events.findIndex(e => e.id === parseInt(req.params.id))
  if (eventIndex === -1) {
    return res.status(404).json({ error: 'Event not found' })
  }
  
  events[eventIndex] = { ...events[eventIndex], ...req.body }
  res.json(events[eventIndex])
})

app.delete('/api/events/:id', (req, res) => {
  const eventIndex = events.findIndex(e => e.id === parseInt(req.params.id))
  if (eventIndex === -1) {
    return res.status(404).json({ error: 'Event not found' })
  }
  
  events.splice(eventIndex, 1)
  res.json({ message: 'Event deleted successfully' })
})

// Registrations
app.post('/api/registrations', (req, res) => {
  const newRegistration = {
    id: registrations.length + 1,
    ...req.body,
    registeredAt: new Date().toISOString()
  }
  registrations.push(newRegistration)
  res.status(201).json(newRegistration)
})

app.get('/api/events/:id/registrations', (req, res) => {
  const eventRegistrations = registrations.filter(r => r.eventId === parseInt(req.params.id))
  res.json(eventRegistrations)
})

// Social Feed
app.get('/api/feed', (req, res) => {
  res.json(feedPosts.filter(post => post.approved))
})

app.post('/api/feed', (req, res) => {
  const newPost = {
    id: feedPosts.length + 1,
    ...req.body,
    approved: true, // Auto-approve for simplicity
    timestamp: new Date().toISOString()
  }
  feedPosts.push(newPost)
  res.status(201).json(newPost)
})

// Auth (simplified)
app.post('/api/college/login', (req, res) => {
  const { email, password } = req.body
  const college = colleges.find(c => c.email === email)
  
  if (college) {
    res.json({ success: true, college, token: 'mock-jwt-token' })
  } else {
    res.status(401).json({ error: 'Invalid credentials' })
  }
})

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body
  
  if (username === 'admin' && password === 'admin123') {
    res.json({ success: true, user: { username: 'admin' }, token: 'mock-admin-token' })
  } else {
    res.status(401).json({ error: 'Invalid credentials' })
  }
})

// Admin routes
app.get('/api/admin/events', (req, res) => {
  res.json(events)
})

app.get('/api/admin/feed', (req, res) => {
  res.json(feedPosts)
})

app.get('/api/users', (req, res) => {
  res.json(users)
})

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})