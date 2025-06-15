import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createServer } from './vite.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ========================================
// TEMPORARY IN-MEMORY DATABASE
// TODO: Replace with MongoDB when ready
// ========================================

// Mock data - Replace with MongoDB collections
let colleges = [
  {
    id: 1,
    name: 'Tech University',
    email: 'admin@techuni.edu',
    logo: '/uploads/tech-uni-logo.png',
    description: 'Leading technology university',
    location: 'Silicon Valley, CA',
    studentCount: 5000,
    establishedYear: 1985,
    approved: true,
    createdAt: new Date()
  },
  {
    id: 2,
    name: 'Arts College',
    email: 'admin@artscollege.edu',
    logo: '/uploads/arts-college-logo.png',
    description: 'Premier arts and design institution',
    location: 'New York, NY',
    studentCount: 2500,
    establishedYear: 1920,
    approved: true,
    createdAt: new Date()
  }
];

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
    description: 'Annual technology festival',
    createdAt: new Date()
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
    description: 'Student art showcase',
    createdAt: new Date()
  }
];

// TODO: Replace these arrays with MongoDB collections
let registrations = [];
let feedPosts = [];
let users = [];
let idCounter = 3;

// ========================================
// API ROUTES - Backend oriented structure
// ========================================

// Colleges endpoints
app.get('/api/colleges', (req, res) => {
  try {
    // TODO: Replace with MongoDB query: await db.collection('colleges').find({}).toArray()
    res.json(colleges);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch colleges' });
  }
});

app.get('/api/colleges/:id', (req, res) => {
  try {
    const collegeId = parseInt(req.params.id);
    // TODO: Replace with MongoDB query: await db.collection('colleges').findOne({_id: collegeId})
    const college = colleges.find(c => c.id === collegeId);
    
    if (!college) {
      return res.status(404).json({ error: 'College not found' });
    }
    
    // TODO: Replace with MongoDB query: await db.collection('events').find({collegeId: collegeId}).toArray()
    const collegeEvents = events.filter(e => e.collegeId === collegeId);
    res.json({ college, events: collegeEvents });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch college details' });
  }
});

app.post('/api/colleges', (req, res) => {
  try {
    // TODO: Replace with MongoDB insert: await db.collection('colleges').insertOne(newCollege)
    const newCollege = {
      id: idCounter++,
      ...req.body,
      approved: true,
      createdAt: new Date()
    };
    colleges.push(newCollege);
    res.status(201).json(newCollege);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create college' });
  }
});

// Events endpoints
app.get('/api/events', (req, res) => {
  try {
    // TODO: Replace with MongoDB query: await db.collection('events').find({}).toArray()
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

app.get('/api/events/:id', (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    // TODO: Replace with MongoDB query: await db.collection('events').findOne({_id: eventId})
    const event = events.find(e => e.id === eventId);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // TODO: Replace with MongoDB lookup/join
    const college = colleges.find(c => c.id === event.collegeId);
    res.json({ ...event, collegeName: college?.name });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event details' });
  }
});

app.post('/api/events', (req, res) => {
  try {
    // TODO: Replace with MongoDB insert: await db.collection('events').insertOne(newEvent)
    const newEvent = {
      id: idCounter++,
      ...req.body,
      createdAt: new Date()
    };
    events.push(newEvent);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event' });
  }
});

app.put('/api/events/:id', (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const eventIndex = events.findIndex(e => e.id === eventId);
    
    if (eventIndex === -1) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // TODO: Replace with MongoDB update: await db.collection('events').updateOne({_id: eventId}, {$set: req.body})
    events[eventIndex] = { ...events[eventIndex], ...req.body };
    res.json(events[eventIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event' });
  }
});

app.delete('/api/events/:id', (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const eventIndex = events.findIndex(e => e.id === eventId);
    
    if (eventIndex === -1) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // TODO: Replace with MongoDB delete: await db.collection('events').deleteOne({_id: eventId})
    events.splice(eventIndex, 1);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// Registrations endpoints
app.post('/api/registrations', (req, res) => {
  try {
    // TODO: Replace with MongoDB insert: await db.collection('registrations').insertOne(newRegistration)
    const newRegistration = {
      id: idCounter++,
      ...req.body,
      registeredAt: new Date()
    };
    registrations.push(newRegistration);
    res.status(201).json(newRegistration);
  } catch (error) {
    res.status(500).json({ error: 'Failed to register for event' });
  }
});

app.get('/api/events/:id/registrations', (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    // TODO: Replace with MongoDB query: await db.collection('registrations').find({eventId: eventId}).toArray()
    const eventRegistrations = registrations.filter(r => r.eventId === eventId);
    res.json(eventRegistrations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

// Social Feed endpoints
app.get('/api/feed', (req, res) => {
  try {
    // TODO: Replace with MongoDB query: await db.collection('feedPosts').find({approved: true}).toArray()
    res.json(feedPosts.filter(post => post.approved));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feed posts' });
  }
});

app.post('/api/feed', (req, res) => {
  try {
    // TODO: Replace with MongoDB insert: await db.collection('feedPosts').insertOne(newPost)
    const newPost = {
      id: idCounter++,
      ...req.body,
      approved: true,
      timestamp: new Date()
    };
    feedPosts.push(newPost);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create feed post' });
  }
});

// Authentication endpoints
app.post('/api/college/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // TODO: Replace with MongoDB query and password verification
    // const college = await db.collection('colleges').findOne({email: email});
    // const isValid = await bcrypt.compare(password, college.passwordHash);
    const college = colleges.find(c => c.email === email);
    
    if (college) {
      // TODO: Generate real JWT token using jsonwebtoken library
      res.json({ success: true, college, token: 'mock-jwt-token' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/admin/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    // TODO: Replace with proper admin authentication
    // const admin = await db.collection('admins').findOne({username: username});
    // const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (username === 'admin' && password === 'admin123') {
      res.json({ success: true, user: { username: 'admin' }, token: 'mock-admin-token' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Admin login failed' });
  }
});

// Admin endpoints
app.get('/api/admin/events', (req, res) => {
  try {
    // TODO: Add admin authorization middleware
    // TODO: Replace with MongoDB query: await db.collection('events').find({}).toArray()
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin events' });
  }
});

app.get('/api/admin/feed', (req, res) => {
  try {
    // TODO: Add admin authorization middleware
    // TODO: Replace with MongoDB query: await db.collection('feedPosts').find({}).toArray()
    res.json(feedPosts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin feed' });
  }
});

app.get('/api/users', (req, res) => {
  try {
    // TODO: Replace with MongoDB query: await db.collection('users').find({}).toArray()
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Development vs Production setup
if (process.env.NODE_ENV === 'development') {
  // Development: Use Vite dev server
  const { app: viteApp } = await createServer();
  app.use('/', viteApp);
} else {
  // Production: Serve built React app
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`CollabZone Server running on port ${PORT}`);
  console.log(`Backend: Express.js with in-memory database`);
  console.log(`Frontend: React with Vite`);
  console.log(`Ready for MongoDB integration!`);
  console.log(`VS Code compatible for Windows 10`);
});