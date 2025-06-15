import { users, colleges, events, registrations, feedPosts, admins } from "../shared/schema.js";
import { db } from "./db.js";
import { eq, desc, asc, and } from "drizzle-orm";

export class DatabaseStorage {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser) {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getCollege(id) {
    const [college] = await db.select().from(colleges).where(eq(colleges.id, id));
    return college || undefined;
  }

  async getCollegeByEmail(email) {
    const [college] = await db.select().from(colleges).where(eq(colleges.email, email));
    return college || undefined;
  }

  async getAllColleges() {
    return await db.select().from(colleges).orderBy(asc(colleges.name));
  }

  async getApprovedColleges() {
    return await db.select().from(colleges).where(eq(colleges.isApproved, true)).orderBy(asc(colleges.name));
  }

  async getPendingColleges() {
    return await db.select().from(colleges).where(eq(colleges.isApproved, false)).orderBy(desc(colleges.createdAt));
  }

  async createCollege(insertCollege) {
    const [college] = await db
      .insert(colleges)
      .values({ ...insertCollege, isApproved: true })
      .returning();
    return college;
  }

  async updateCollege(id, updates) {
    const [college] = await db
      .update(colleges)
      .set(updates)
      .where(eq(colleges.id, id))
      .returning();
    return college || undefined;
  }

  async deleteCollege(id) {
    const result = await db.delete(colleges).where(eq(colleges.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getEvent(id) {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  }

  async getAllEvents() {
    return await db.select().from(events).orderBy(desc(events.createdAt));
  }

  async getEventsByCollege(collegeId) {
    return await db.select().from(events).where(eq(events.collegeId, collegeId)).orderBy(desc(events.createdAt));
  }

  async getUpcomingEvents() {
    return await db.select().from(events).where(eq(events.isActive, true)).orderBy(asc(events.createdAt));
  }

  async getPastEvents() {
    return await db.select().from(events).where(eq(events.isActive, true)).orderBy(desc(events.createdAt));
  }

  async getEventsByCategory(category) {
    return await db.select().from(events).where(and(
      eq(events.category, category),
      eq(events.isActive, true)
    )).orderBy(desc(events.createdAt));
  }

  async createEvent(insertEvent) {
    const [event] = await db
      .insert(events)
      .values(insertEvent)
      .returning();
    return event;
  }

  async updateEvent(id, updates) {
    const [event] = await db
      .update(events)
      .set(updates)
      .where(eq(events.id, id))
      .returning();
    return event || undefined;
  }

  async deleteEvent(id) {
    const result = await db.delete(events).where(eq(events.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getRegistration(id) {
    const [registration] = await db.select().from(registrations).where(eq(registrations.id, id));
    return registration || undefined;
  }

  async getRegistrationsByEvent(eventId) {
    return await db.select().from(registrations).where(eq(registrations.eventId, eventId)).orderBy(desc(registrations.registeredAt));
  }

  async createRegistration(insertRegistration) {
    const [registration] = await db
      .insert(registrations)
      .values(insertRegistration)
      .returning();
    return registration;
  }

  async updateRegistration(id, updates) {
    const [registration] = await db
      .update(registrations)
      .set(updates)
      .where(eq(registrations.id, id))
      .returning();
    return registration || undefined;
  }

  async deleteRegistration(id) {
    const result = await db.delete(registrations).where(eq(registrations.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getFeedPost(id) {
    const [feedPost] = await db.select().from(feedPosts).where(eq(feedPosts.id, id));
    return feedPost || undefined;
  }

  async getAllFeedPosts() {
    return await db.select().from(feedPosts).orderBy(desc(feedPosts.createdAt));
  }

  async getApprovedFeedPosts() {
    return await db.select().from(feedPosts).where(eq(feedPosts.isApproved, true)).orderBy(desc(feedPosts.createdAt));
  }

  async getPendingFeedPosts() {
    return await db.select().from(feedPosts).where(eq(feedPosts.isApproved, false)).orderBy(desc(feedPosts.createdAt));
  }

  async createFeedPost(insertPost) {
    const [feedPost] = await db
      .insert(feedPosts)
      .values(insertPost)
      .returning();
    return feedPost;
  }

  async updateFeedPost(id, updates) {
    const [feedPost] = await db
      .update(feedPosts)
      .set(updates)
      .where(eq(feedPosts.id, id))
      .returning();
    return feedPost || undefined;
  }

  async deleteFeedPost(id) {
    const result = await db.delete(feedPosts).where(eq(feedPosts.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getAdmin(id) {
    const [admin] = await db.select().from(admins).where(eq(admins.id, id));
    return admin || undefined;
  }

  async getAdminByUsername(username) {
    const [admin] = await db.select().from(admins).where(eq(admins.username, username));
    return admin || undefined;
  }

  async getAdminByEmail(email) {
    const [admin] = await db.select().from(admins).where(eq(admins.email, email));
    return admin || undefined;
  }

  async createAdmin(insertAdmin) {
    const [admin] = await db
      .insert(admins)
      .values(insertAdmin)
      .returning();
    return admin;
  }
}

export const storage = new DatabaseStorage();