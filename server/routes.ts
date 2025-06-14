import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCollegeSchema, insertEventSchema, insertRegistrationSchema, insertFeedPostSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Colleges API
  app.get("/api/colleges", async (req, res) => {
    try {
      const colleges = await storage.getApprovedColleges();
      res.json(colleges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch colleges" });
    }
  });

  app.get("/api/colleges/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const college = await storage.getCollege(id);
      if (!college) {
        return res.status(404).json({ message: "College not found" });
      }
      
      const events = await storage.getEventsByCollege(id);
      res.json({ college, events });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch college details" });
    }
  });

  app.post("/api/colleges", async (req, res) => {
    try {
      const collegeData = insertCollegeSchema.parse(req.body);
      const college = await storage.createCollege(collegeData);
      res.status(201).json(college);
    } catch (error) {
      res.status(400).json({ message: "Invalid college data" });
    }
  });

  // Events API
  app.get("/api/events", async (req, res) => {
    try {
      const { category, type } = req.query;
      
      let events;
      if (category) {
        events = await storage.getEventsByCategory(category as string);
      } else if (type === "upcoming") {
        events = await storage.getUpcomingEvents();
      } else if (type === "past") {
        events = await storage.getPastEvents();
      } else {
        events = await storage.getAllEvents();
      }
      
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getEvent(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch event details" });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const eventData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ message: "Invalid event data" });
    }
  });

  app.put("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const event = await storage.updateEvent(id, updates);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to update event" });
    }
  });

  app.delete("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteEvent(id);
      if (!deleted) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete event" });
    }
  });

  // Registrations API
  app.get("/api/events/:id/registrations", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const registrations = await storage.getRegistrationsByEvent(eventId);
      res.json(registrations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch registrations" });
    }
  });

  app.post("/api/registrations", async (req, res) => {
    try {
      const registrationData = insertRegistrationSchema.parse(req.body);
      const registration = await storage.createRegistration(registrationData);
      res.status(201).json(registration);
    } catch (error) {
      res.status(400).json({ message: "Invalid registration data" });
    }
  });

  // Social Feed API
  app.get("/api/feed", async (req, res) => {
    try {
      const posts = await storage.getApprovedFeedPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch feed posts" });
    }
  });

  app.post("/api/feed", async (req, res) => {
    try {
      const postData = insertFeedPostSchema.parse(req.body);
      const post = await storage.createFeedPost(postData);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid post data" });
    }
  });

  app.put("/api/feed/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const post = await storage.updateFeedPost(id, updates);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to update post" });
    }
  });

  app.delete("/api/feed/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteFeedPost(id);
      if (!deleted) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  // College Admin Authentication
  app.post("/api/college/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const college = await storage.getCollegeByEmail(email);
      
      if (!college || college.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      if (!college.isApproved) {
        return res.status(403).json({ message: "College not approved yet" });
      }
      
      res.json({ college: { ...college, password: undefined } });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Super Admin Authentication
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const admin = await storage.getAdminByUsername(username);
      
      if (!admin || admin.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      res.json({ admin: { ...admin, password: undefined } });
    } catch (error) {
      res.status(500).json({ message: "Admin login failed" });
    }
  });

  // Admin endpoints for college approval
  app.get("/api/admin/pending-colleges", async (req, res) => {
    try {
      const pendingColleges = await storage.getPendingColleges();
      res.json(pendingColleges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pending colleges" });
    }
  });

  app.put("/api/admin/colleges/:id/approve", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const college = await storage.updateCollege(id, { isApproved: true });
      if (!college) {
        return res.status(404).json({ message: "College not found" });
      }
      res.json(college);
    } catch (error) {
      res.status(500).json({ message: "Failed to approve college" });
    }
  });

  // Admin endpoints for users and content moderation
  app.get("/api/users", async (req, res) => {
    try {
      const registrations = await storage.getAllFeedPosts(); // Using feedPosts as user activity proxy
      res.json(registrations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/events", async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch all events" });
    }
  });

  // File upload placeholder endpoint
  app.post("/api/uploads/qr", async (req, res) => {
    try {
      // In a real implementation, this would handle file uploads using multer
      // For now, return a placeholder URL
      const filename = `qr_${Date.now()}.png`;
      res.json({ url: `/uploads/${filename}` });
    } catch (error) {
      res.status(500).json({ message: "Upload failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
