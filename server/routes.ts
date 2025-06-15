import { Router } from 'express';
import { z } from 'zod';
import type { IStorage } from './storage.js';
import { 
  insertCollegeSchema, 
  insertEventSchema, 
  insertRegistrationSchema, 
  insertFeedPostSchema 
} from '../shared/schema.js';

export function createRoutes(storage: IStorage) {
  const router = Router();

  // Colleges endpoints
  router.get('/api/colleges', async (req, res) => {
    try {
      const colleges = await storage.getColleges();
      res.json(colleges);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch colleges' });
    }
  });

  router.get('/api/colleges/:id', async (req, res) => {
    try {
      const collegeId = parseInt(req.params.id);
      if (isNaN(collegeId)) {
        return res.status(400).json({ error: 'Invalid college ID' });
      }

      const college = await storage.getCollegeById(collegeId);
      if (!college) {
        return res.status(404).json({ error: 'College not found' });
      }

      const events = await storage.getEventsByCollegeId(collegeId);
      res.json({ college, events });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch college details' });
    }
  });

  router.post('/api/colleges', async (req, res) => {
    try {
      const validatedData = insertCollegeSchema.parse(req.body);
      const newCollege = await storage.createCollege(validatedData);
      res.status(201).json(newCollege);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid college data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create college' });
    }
  });

  // Events endpoints
  router.get('/api/events', async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  });

  router.get('/api/events/:id', async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      if (isNaN(eventId)) {
        return res.status(400).json({ error: 'Invalid event ID' });
      }

      const event = await storage.getEventById(eventId);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      const college = await storage.getCollegeById(event.collegeId);
      res.json({ ...event, collegeName: college?.name });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch event details' });
    }
  });

  router.post('/api/events', async (req, res) => {
    try {
      const validatedData = insertEventSchema.parse(req.body);
      const newEvent = await storage.createEvent(validatedData);
      res.status(201).json(newEvent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid event data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create event' });
    }
  });

  router.put('/api/events/:id', async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      if (isNaN(eventId)) {
        return res.status(400).json({ error: 'Invalid event ID' });
      }

      const validatedData = insertEventSchema.partial().parse(req.body);
      const updatedEvent = await storage.updateEvent(eventId, validatedData);
      
      if (!updatedEvent) {
        return res.status(404).json({ error: 'Event not found' });
      }

      res.json(updatedEvent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid event data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to update event' });
    }
  });

  router.delete('/api/events/:id', async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      if (isNaN(eventId)) {
        return res.status(400).json({ error: 'Invalid event ID' });
      }

      const deleted = await storage.deleteEvent(eventId);
      if (!deleted) {
        return res.status(404).json({ error: 'Event not found' });
      }

      res.json({ message: 'Event deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete event' });
    }
  });

  // Registrations endpoints
  router.post('/api/registrations', async (req, res) => {
    try {
      const validatedData = insertRegistrationSchema.parse(req.body);
      const newRegistration = await storage.createRegistration(validatedData);
      res.status(201).json(newRegistration);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid registration data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to register for event' });
    }
  });

  router.get('/api/events/:id/registrations', async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      if (isNaN(eventId)) {
        return res.status(400).json({ error: 'Invalid event ID' });
      }

      const registrations = await storage.getRegistrationsByEventId(eventId);
      res.json(registrations);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch registrations' });
    }
  });

  // Social Feed endpoints
  router.get('/api/feed', async (req, res) => {
    try {
      const feedPosts = await storage.getApprovedFeedPosts();
      res.json(feedPosts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch feed posts' });
    }
  });

  router.post('/api/feed', async (req, res) => {
    try {
      const validatedData = insertFeedPostSchema.parse(req.body);
      const newPost = await storage.createFeedPost(validatedData);
      res.status(201).json(newPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid feed post data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create feed post' });
    }
  });

  // Authentication endpoints
  router.post('/api/college/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const college = await storage.getCollegeByEmail(email);
      
      if (college) {
        // Mock JWT token for now - in production, implement proper JWT
        res.json({ success: true, college, token: 'mock-jwt-token' });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  });

  router.post('/api/admin/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      // Hardcoded admin credentials for demo
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
  router.get('/api/admin/events', async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch admin events' });
    }
  });

  router.get('/api/admin/feed', async (req, res) => {
    try {
      const feedPosts = await storage.getFeedPosts();
      res.json(feedPosts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch admin feed' });
    }
  });

  router.get('/api/users', async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  return router;
}