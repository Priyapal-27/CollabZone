import { pgTable, serial, text, integer, timestamp, boolean, json } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// College table
export const colleges = pgTable('colleges', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  logo: text('logo'),
  description: text('description'),
  location: text('location'),
  studentCount: integer('student_count'),
  establishedYear: integer('established_year'),
  approved: boolean('approved').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// Events table
export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  collegeId: integer('college_id').references(() => colleges.id),
  date: timestamp('date').notNull(),
  fee: integer('fee').default(0),
  eligibility: text('eligibility'),
  hosts: text('hosts').array(),
  contactNos: text('contact_nos').array(),
  prize: text('prize'),
  openings: integer('openings'),
  poster: text('poster'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Registrations table
export const registrations = pgTable('registrations', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').references(() => events.id),
  studentName: text('student_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  college: text('college'),
  year: text('year'),
  branch: text('branch'),
  registeredAt: timestamp('registered_at').defaultNow(),
});

// Feed posts table
export const feedPosts = pgTable('feed_posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  author: text('author').notNull(),
  collegeId: integer('college_id').references(() => colleges.id),
  approved: boolean('approved').default(true),
  timestamp: timestamp('timestamp').defaultNow(),
});

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('student'), // student, college_admin, admin
  collegeId: integer('college_id').references(() => colleges.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// Insert schemas
export const insertCollegeSchema = createInsertSchema(colleges).omit({ 
  id: true, 
  createdAt: true 
});

export const insertEventSchema = createInsertSchema(events).omit({ 
  id: true, 
  createdAt: true 
});

export const insertRegistrationSchema = createInsertSchema(registrations).omit({ 
  id: true, 
  registeredAt: true 
});

export const insertFeedPostSchema = createInsertSchema(feedPosts).omit({ 
  id: true, 
  timestamp: true 
});

export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  createdAt: true 
});

// Types
export type College = typeof colleges.$inferSelect;
export type InsertCollege = z.infer<typeof insertCollegeSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type Registration = typeof registrations.$inferSelect;
export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;

export type FeedPost = typeof feedPosts.$inferSelect;
export type InsertFeedPost = z.infer<typeof insertFeedPostSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;