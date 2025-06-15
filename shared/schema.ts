import { z } from 'zod';
import { pgTable, serial, text, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

// College schema
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

// Events schema
export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  collegeId: integer('college_id').references(() => colleges.id).notNull(),
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

// Registrations schema
export const registrations = pgTable('registrations', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').references(() => events.id).notNull(),
  studentName: text('student_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  collegeName: text('college_name').notNull(),
  year: text('year'),
  branch: text('branch'),
  registeredAt: timestamp('registered_at').defaultNow(),
});

// Feed posts schema
export const feedPosts = pgTable('feed_posts', {
  id: serial('id').primaryKey(),
  author: text('author').notNull(),
  content: text('content').notNull(),
  collegeId: integer('college_id').references(() => colleges.id),
  approved: boolean('approved').default(true),
  timestamp: timestamp('timestamp').defaultNow(),
});

// Users schema
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  role: text('role').notNull(), // 'admin', 'college_admin', 'student'
  collegeId: integer('college_id').references(() => colleges.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// Insert schemas using drizzle-zod with proper defaults
export const insertCollegeSchema = createInsertSchema(colleges, {
  approved: z.boolean().default(true),
}).omit({
  id: true,
  createdAt: true,
});

export const insertEventSchema = createInsertSchema(events, {
  fee: z.number().default(0),
}).omit({
  id: true,
  createdAt: true,
});

export const insertRegistrationSchema = createInsertSchema(registrations).omit({
  id: true,
  registeredAt: true,
});

export const insertFeedPostSchema = createInsertSchema(feedPosts, {
  approved: z.boolean().default(true),
}).omit({
  id: true,
  timestamp: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Inferred types
export type InsertCollege = z.infer<typeof insertCollegeSchema>;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type InsertFeedPost = z.infer<typeof insertFeedPostSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type SelectCollege = typeof colleges.$inferSelect;
export type SelectEvent = typeof events.$inferSelect;
export type SelectRegistration = typeof registrations.$inferSelect;
export type SelectFeedPost = typeof feedPosts.$inferSelect;
export type SelectUser = typeof users.$inferSelect;