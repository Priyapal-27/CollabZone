import type { User, InsertUser, College, InsertCollege, Event, InsertEvent, Registration, InsertRegistration, FeedPost, InsertFeedPost, Admin, InsertAdmin } from "@shared/schema";
import { users, colleges, events, registrations, feedPosts, admins } from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, and } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Colleges
  getCollege(id: number): Promise<College | undefined>;
  getCollegeByEmail(email: string): Promise<College | undefined>;
  getAllColleges(): Promise<College[]>;
  getApprovedColleges(): Promise<College[]>;
  getPendingColleges(): Promise<College[]>;
  createCollege(college: InsertCollege): Promise<College>;
  updateCollege(id: number, updates: Partial<College>): Promise<College | undefined>;
  deleteCollege(id: number): Promise<boolean>;

  // Events
  getEvent(id: number): Promise<Event | undefined>;
  getAllEvents(): Promise<Event[]>;
  getEventsByCollege(collegeId: number): Promise<Event[]>;
  getUpcomingEvents(): Promise<Event[]>;
  getPastEvents(): Promise<Event[]>;
  getEventsByCategory(category: string): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, updates: Partial<Event>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;

  // Registrations
  getRegistration(id: number): Promise<Registration | undefined>;
  getRegistrationsByEvent(eventId: number): Promise<Registration[]>;
  createRegistration(registration: InsertRegistration): Promise<Registration>;
  updateRegistration(id: number, updates: Partial<Registration>): Promise<Registration | undefined>;
  deleteRegistration(id: number): Promise<boolean>;

  // Feed Posts
  getFeedPost(id: number): Promise<FeedPost | undefined>;
  getAllFeedPosts(): Promise<FeedPost[]>;
  getApprovedFeedPosts(): Promise<FeedPost[]>;
  getPendingFeedPosts(): Promise<FeedPost[]>;
  createFeedPost(post: InsertFeedPost): Promise<FeedPost>;
  updateFeedPost(id: number, updates: Partial<FeedPost>): Promise<FeedPost | undefined>;
  deleteFeedPost(id: number): Promise<boolean>;

  // Admins
  getAdmin(id: number): Promise<Admin | undefined>;
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  getAdminByEmail(email: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getCollege(id: number): Promise<College | undefined> {
    const [college] = await db.select().from(colleges).where(eq(colleges.id, id));
    return college || undefined;
  }

  async getCollegeByEmail(email: string): Promise<College | undefined> {
    const [college] = await db.select().from(colleges).where(eq(colleges.email, email));
    return college || undefined;
  }

  async getAllColleges(): Promise<College[]> {
    return await db.select().from(colleges).orderBy(asc(colleges.name));
  }

  async getApprovedColleges(): Promise<College[]> {
    return await db.select().from(colleges).where(eq(colleges.isApproved, true)).orderBy(asc(colleges.name));
  }

  async getPendingColleges(): Promise<College[]> {
    return await db.select().from(colleges).where(eq(colleges.isApproved, false)).orderBy(desc(colleges.createdAt));
  }

  async createCollege(insertCollege: InsertCollege): Promise<College> {
    const [college] = await db
      .insert(colleges)
      .values({ ...insertCollege, isApproved: true })
      .returning();
    return college;
  }

  async updateCollege(id: number, updates: Partial<College>): Promise<College | undefined> {
    const [college] = await db
      .update(colleges)
      .set(updates)
      .where(eq(colleges.id, id))
      .returning();
    return college || undefined;
  }

  async deleteCollege(id: number): Promise<boolean> {
    const result = await db.delete(colleges).where(eq(colleges.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  }

  async getAllEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(desc(events.createdAt));
  }

  async getEventsByCollege(collegeId: number): Promise<Event[]> {
    return await db.select().from(events).where(eq(events.collegeId, collegeId)).orderBy(desc(events.createdAt));
  }

  async getUpcomingEvents(): Promise<Event[]> {
    return await db.select().from(events).where(eq(events.isActive, true)).orderBy(asc(events.createdAt));
  }

  async getPastEvents(): Promise<Event[]> {
    return await db.select().from(events).where(eq(events.isActive, true)).orderBy(desc(events.createdAt));
  }

  async getEventsByCategory(category: string): Promise<Event[]> {
    return await db.select().from(events).where(and(
      eq(events.category, category),
      eq(events.isActive, true)
    )).orderBy(desc(events.createdAt));
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const [event] = await db
      .insert(events)
      .values(insertEvent)
      .returning();
    return event;
  }

  async updateEvent(id: number, updates: Partial<Event>): Promise<Event | undefined> {
    const [event] = await db
      .update(events)
      .set(updates)
      .where(eq(events.id, id))
      .returning();
    return event || undefined;
  }

  async deleteEvent(id: number): Promise<boolean> {
    const result = await db.delete(events).where(eq(events.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getRegistration(id: number): Promise<Registration | undefined> {
    const [registration] = await db.select().from(registrations).where(eq(registrations.id, id));
    return registration || undefined;
  }

  async getRegistrationsByEvent(eventId: number): Promise<Registration[]> {
    return await db.select().from(registrations).where(eq(registrations.eventId, eventId)).orderBy(desc(registrations.registeredAt));
  }

  async createRegistration(insertRegistration: InsertRegistration): Promise<Registration> {
    const [registration] = await db
      .insert(registrations)
      .values(insertRegistration)
      .returning();
    return registration;
  }

  async updateRegistration(id: number, updates: Partial<Registration>): Promise<Registration | undefined> {
    const [registration] = await db
      .update(registrations)
      .set(updates)
      .where(eq(registrations.id, id))
      .returning();
    return registration || undefined;
  }

  async deleteRegistration(id: number): Promise<boolean> {
    const result = await db.delete(registrations).where(eq(registrations.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getFeedPost(id: number): Promise<FeedPost | undefined> {
    const [post] = await db.select().from(feedPosts).where(eq(feedPosts.id, id));
    return post || undefined;
  }

  async getAllFeedPosts(): Promise<FeedPost[]> {
    return await db.select().from(feedPosts).orderBy(desc(feedPosts.createdAt));
  }

  async getApprovedFeedPosts(): Promise<FeedPost[]> {
    return await db.select().from(feedPosts).where(eq(feedPosts.isApproved, true)).orderBy(desc(feedPosts.createdAt));
  }

  async getPendingFeedPosts(): Promise<FeedPost[]> {
    return await db.select().from(feedPosts).where(eq(feedPosts.isApproved, false)).orderBy(desc(feedPosts.createdAt));
  }

  async createFeedPost(insertPost: InsertFeedPost): Promise<FeedPost> {
    const [post] = await db
      .insert(feedPosts)
      .values(insertPost)
      .returning();
    return post;
  }

  async updateFeedPost(id: number, updates: Partial<FeedPost>): Promise<FeedPost | undefined> {
    const [post] = await db
      .update(feedPosts)
      .set(updates)
      .where(eq(feedPosts.id, id))
      .returning();
    return post || undefined;
  }

  async deleteFeedPost(id: number): Promise<boolean> {
    const result = await db.delete(feedPosts).where(eq(feedPosts.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getAdmin(id: number): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.id, id));
    return admin || undefined;
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.username, username));
    return admin || undefined;
  }

  async getAdminByEmail(email: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.email, email));
    return admin || undefined;
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const [admin] = await db
      .insert(admins)
      .values(insertAdmin)
      .returning();
    return admin;
  }
}

export const storage = new DatabaseStorage();