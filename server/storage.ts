import { 
  users, colleges, events, registrations, feedPosts, admins,
  type User, type InsertUser,
  type College, type InsertCollege,
  type Event, type InsertEvent,
  type Registration, type InsertRegistration,
  type FeedPost, type InsertFeedPost,
  type Admin, type InsertAdmin
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private colleges: Map<number, College>;
  private events: Map<number, Event>;
  private registrations: Map<number, Registration>;
  private feedPosts: Map<number, FeedPost>;
  private admins: Map<number, Admin>;
  private currentId: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.colleges = new Map();
    this.events = new Map();
    this.registrations = new Map();
    this.feedPosts = new Map();
    this.admins = new Map();
    this.currentId = {
      users: 1,
      colleges: 1,
      events: 1,
      registrations: 1,
      feedPosts: 1,
      admins: 1,
    };

    // Initialize with default super admin
    this.createAdmin({
      username: "admin",
      email: "admin@collabzone.edu",
      password: "admin123",
      role: "super_admin"
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Colleges
  async getCollege(id: number): Promise<College | undefined> {
    return this.colleges.get(id);
  }

  async getCollegeByEmail(email: string): Promise<College | undefined> {
    return Array.from(this.colleges.values()).find(college => college.email === email);
  }

  async getAllColleges(): Promise<College[]> {
    return Array.from(this.colleges.values());
  }

  async getApprovedColleges(): Promise<College[]> {
    return Array.from(this.colleges.values()).filter(college => college.isApproved);
  }

  async getPendingColleges(): Promise<College[]> {
    return Array.from(this.colleges.values()).filter(college => !college.isApproved);
  }

  async createCollege(insertCollege: InsertCollege): Promise<College> {
    const id = this.currentId.colleges++;
    const college: College = {
      ...insertCollege,
      id,
      isApproved: false,
      studentsCount: 0,
      createdAt: new Date(),
    };
    this.colleges.set(id, college);
    return college;
  }

  async updateCollege(id: number, updates: Partial<College>): Promise<College | undefined> {
    const college = this.colleges.get(id);
    if (!college) return undefined;
    
    const updatedCollege = { ...college, ...updates };
    this.colleges.set(id, updatedCollege);
    return updatedCollege;
  }

  async deleteCollege(id: number): Promise<boolean> {
    return this.colleges.delete(id);
  }

  // Events
  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEventsByCollege(collegeId: number): Promise<Event[]> {
    return Array.from(this.events.values()).filter(event => event.collegeId === collegeId);
  }

  async getUpcomingEvents(): Promise<Event[]> {
    const now = new Date();
    return Array.from(this.events.values()).filter(event => new Date(event.date) > now);
  }

  async getPastEvents(): Promise<Event[]> {
    const now = new Date();
    return Array.from(this.events.values()).filter(event => new Date(event.date) <= now);
  }

  async getEventsByCategory(category: string): Promise<Event[]> {
    return Array.from(this.events.values()).filter(event => event.category === category);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.currentId.events++;
    const event: Event = {
      ...insertEvent,
      id,
      currentParticipants: 0,
      isActive: true,
      createdAt: new Date(),
    };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: number, updates: Partial<Event>): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;
    
    const updatedEvent = { ...event, ...updates };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<boolean> {
    return this.events.delete(id);
  }

  // Registrations
  async getRegistration(id: number): Promise<Registration | undefined> {
    return this.registrations.get(id);
  }

  async getRegistrationsByEvent(eventId: number): Promise<Registration[]> {
    return Array.from(this.registrations.values()).filter(reg => reg.eventId === eventId);
  }

  async createRegistration(insertRegistration: InsertRegistration): Promise<Registration> {
    const id = this.currentId.registrations++;
    const registration: Registration = {
      ...insertRegistration,
      id,
      isVerified: false,
      registeredAt: new Date(),
    };
    this.registrations.set(id, registration);

    // Update event participant count
    const event = this.events.get(insertRegistration.eventId);
    if (event) {
      event.currentParticipants = (event.currentParticipants || 0) + 1;
      this.events.set(insertRegistration.eventId, event);
    }

    return registration;
  }

  async updateRegistration(id: number, updates: Partial<Registration>): Promise<Registration | undefined> {
    const registration = this.registrations.get(id);
    if (!registration) return undefined;
    
    const updatedRegistration = { ...registration, ...updates };
    this.registrations.set(id, updatedRegistration);
    return updatedRegistration;
  }

  async deleteRegistration(id: number): Promise<boolean> {
    return this.registrations.delete(id);
  }

  // Feed Posts
  async getFeedPost(id: number): Promise<FeedPost | undefined> {
    return this.feedPosts.get(id);
  }

  async getAllFeedPosts(): Promise<FeedPost[]> {
    return Array.from(this.feedPosts.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getApprovedFeedPosts(): Promise<FeedPost[]> {
    return Array.from(this.feedPosts.values())
      .filter(post => post.isApproved)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getPendingFeedPosts(): Promise<FeedPost[]> {
    return Array.from(this.feedPosts.values()).filter(post => !post.isApproved);
  }

  async createFeedPost(insertPost: InsertFeedPost): Promise<FeedPost> {
    const id = this.currentId.feedPosts++;
    const post: FeedPost = {
      ...insertPost,
      id,
      likes: 0,
      comments: 0,
      isApproved: true,
      createdAt: new Date(),
    };
    this.feedPosts.set(id, post);
    return post;
  }

  async updateFeedPost(id: number, updates: Partial<FeedPost>): Promise<FeedPost | undefined> {
    const post = this.feedPosts.get(id);
    if (!post) return undefined;
    
    const updatedPost = { ...post, ...updates };
    this.feedPosts.set(id, updatedPost);
    return updatedPost;
  }

  async deleteFeedPost(id: number): Promise<boolean> {
    return this.feedPosts.delete(id);
  }

  // Admins
  async getAdmin(id: number): Promise<Admin | undefined> {
    return this.admins.get(id);
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    return Array.from(this.admins.values()).find(admin => admin.username === username);
  }

  async getAdminByEmail(email: string): Promise<Admin | undefined> {
    return Array.from(this.admins.values()).find(admin => admin.email === email);
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const id = this.currentId.admins++;
    const admin: Admin = {
      ...insertAdmin,
      id,
      createdAt: new Date(),
    };
    this.admins.set(id, admin);
    return admin;
  }
}

export const storage = new MemStorage();
