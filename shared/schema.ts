import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const colleges = pgTable("colleges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  location: text("location").notNull(),
  description: text("description"),
  logoUrl: text("logo_url"),
  isApproved: boolean("is_approved").default(true),
  studentsCount: integer("students_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  collegeId: integer("college_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // Technical, Cultural, Sports, Workshop
  date: timestamp("date").notNull(),
  location: text("location").notNull(),
  fee: decimal("fee", { precision: 10, scale: 2 }).default("0"),
  eligibility: text("eligibility"),
  hosts: text("hosts").array(),
  contactNumbers: text("contact_numbers").array(),
  maxParticipants: integer("max_participants"),
  currentParticipants: integer("current_participants").default(0),
  prizeDetails: text("prize_details"),
  posterUrl: text("poster_url"),
  qrCodeUrl: text("qr_code_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  college: text("college").notNull(),
  course: text("course").notNull(),
  address: text("address"),
  paymentScreenshot: text("payment_screenshot"),
  isVerified: boolean("is_verified").default(false),
  registeredAt: timestamp("registered_at").defaultNow(),
});

export const feedPosts = pgTable("feed_posts", {
  id: serial("id").primaryKey(),
  author: text("author").notNull(),
  college: text("college").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  isApproved: boolean("is_approved").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("super_admin"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertCollegeSchema = createInsertSchema(colleges).omit({
  id: true,
  isApproved: true,
  studentsCount: true,
  createdAt: true,
}).extend({
  name: z.string().min(2, "College name must be at least 2 characters").max(100, "College name must be less than 100 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  location: z.string().min(2, "Location must be at least 2 characters").max(100, "Location must be less than 100 characters"),
  description: z.string().optional(),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  currentParticipants: true,
  isActive: true,
  createdAt: true,
}).extend({
  name: z.string().min(3, "Event name must be at least 3 characters").max(100, "Event name must be less than 100 characters"),
  description: z.string().optional(),
  category: z.enum(["Technical", "Cultural", "Sports", "Workshop"], {
    required_error: "Please select a category",
  }),
  date: z.date({
    required_error: "Event date is required",
  }),
  location: z.string().min(3, "Location must be at least 3 characters").max(100, "Location must be less than 100 characters"),
  fee: z.string().regex(/^\d+(\.\d{1,2})?$/, "Fee must be a valid amount"),
  eligibility: z.string().optional(),
  contactNumbers: z.array(z.string().regex(/^\d{10}$/, "Each contact number must be exactly 10 digits")).min(1, "At least one contact number is required"),
  maxParticipants: z.number().min(1, "Maximum participants must be at least 1").optional(),
});

export const insertRegistrationSchema = createInsertSchema(registrations).omit({
  id: true,
  isVerified: true,
  registeredAt: true,
}).extend({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(50, "Full name must be less than 50 characters").regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  college: z.string().min(2, "College name must be at least 2 characters").max(100, "College name must be less than 100 characters"),
  course: z.string().min(2, "Course name must be at least 2 characters").max(50, "Course name must be less than 50 characters"),
  address: z.string().optional(),
});

export const insertFeedPostSchema = createInsertSchema(feedPosts).omit({
  id: true,
  likes: true,
  comments: true,
  isApproved: true,
  createdAt: true,
}).extend({
  author: z.string().min(2, "Author name must be at least 2 characters").max(50, "Author name must be less than 50 characters"),
  college: z.string().min(2, "College name must be at least 2 characters").max(100, "College name must be less than 100 characters"),
  content: z.string().min(10, "Content must be at least 10 characters").max(500, "Content must be less than 500 characters"),
});

export const insertAdminSchema = createInsertSchema(admins).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCollege = z.infer<typeof insertCollegeSchema>;
export type College = typeof colleges.$inferSelect;

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type Registration = typeof registrations.$inferSelect;

export type InsertFeedPost = z.infer<typeof insertFeedPostSchema>;
export type FeedPost = typeof feedPosts.$inferSelect;

export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof admins.$inferSelect;

// Relations
export const collegesRelations = relations(colleges, ({ many }) => ({
  events: many(events),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  college: one(colleges, {
    fields: [events.collegeId],
    references: [colleges.id],
  }),
  registrations: many(registrations),
}));

export const registrationsRelations = relations(registrations, ({ one }) => ({
  event: one(events, {
    fields: [registrations.eventId],
    references: [events.id],
  }),
}));

export const feedPostsRelations = relations(feedPosts, ({ one }) => ({
  // No direct foreign key relations for feed posts as they reference colleges by name
}));
