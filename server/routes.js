import { createServer } from "http";
import { storage } from "./storage.js";
import { insertCollegeSchema, insertEventSchema, insertRegistrationSchema, insertFeedPostSchema } from "../shared/schema.js";

export async function registerRoutes(app) {
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
      res.status(400).json({ message: "Invalid college data", error: error.message });
    }
  });

  // Events API
  app.get("/api/events", async (req, res) => {
    try {
      const { category, type } = req.query;
      
      let events;
      if (category) {
        events = await storage.getEventsByCategory(category);
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
      res.status(400).json({ message: "Invalid event data", error: error.message });
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
      res.status(400).json({ message: "Invalid registration data", error: error.message });
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
      res.status(400).json({ message: "Invalid post data", error: error.message });
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

  // College Admin Authentication - Fixed credentials validation
  app.post("/api/college/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Input validation
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      const college = await storage.getCollegeByEmail(email);
      
      if (!college) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Simple password comparison (in production, use bcrypt)
      if (college.password !== password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      if (!college.isApproved) {
        return res.status(403).json({ message: "College account is pending approval" });
      }
      
      // Return college data without password
      const { password: _, ...collegeData } = college;
      res.json({ 
        success: true,
        college: collegeData,
        message: "Login successful"
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed. Please try again." });
    }
  });

  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      
      // Basic validation
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: "All fields are required" });
      }
      
      // In a real application, you would save this to database or send email
      console.log("Contact form submission:", { name, email, subject, message });
      
      res.json({ message: "Message sent successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  const server = createServer(app);
  return server;
}