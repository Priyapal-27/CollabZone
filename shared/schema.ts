import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
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
  isApproved: boolean("is_approved").default(false),
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
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  currentParticipants: true,
  isActive: true,
  createdAt: true,
});

export const insertRegistrationSchema = createInsertSchema(registrations).omit({
  id: true,
  isVerified: true,
  registeredAt: true,
});

export const insertFeedPostSchema = createInsertSchema(feedPosts).omit({
  id: true,
  likes: true,
  comments: true,
  isApproved: true,
  createdAt: true,
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
