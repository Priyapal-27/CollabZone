import type { College, InsertCollege, Event, InsertEvent, Registration, InsertRegistration, FeedPost, InsertFeedPost, User, InsertUser } from '@shared/schema';

export interface IStorage {
  // Colleges
  getColleges(): Promise<College[]>;
  getCollegeById(id: number): Promise<College | null>;
  createCollege(college: InsertCollege): Promise<College>;
  
  // Events
  getEvents(): Promise<Event[]>;
  getEventById(id: number): Promise<Event | null>;
  getEventsByCollegeId(collegeId: number): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | null>;
  deleteEvent(id: number): Promise<boolean>;
  
  // Registrations
  createRegistration(registration: InsertRegistration): Promise<Registration>;
  getRegistrationsByEventId(eventId: number): Promise<Registration[]>;
  
  // Feed Posts
  getFeedPosts(): Promise<FeedPost[]>;
  createFeedPost(post: InsertFeedPost): Promise<FeedPost>;
  
  // Users
  getUsers(): Promise<User[]>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(user: InsertUser): Promise<User>;
  
  // Auth
  authenticateCollege(email: string, password: string): Promise<College | null>;
  authenticateAdmin(username: string, password: string): Promise<{ username: string } | null>;
}

export class MemStorage implements IStorage {
  private colleges: College[] = [
    {
      id: 1,
      name: 'Tech University',
      email: 'admin@techuni.edu',
      logo: '/uploads/tech-uni-logo.png',
      description: 'Leading technology university',
      location: 'Silicon Valley, CA',
      studentCount: 5000,
      establishedYear: 1985,
      approved: true,
      createdAt: new Date(),
    },
    {
      id: 2,
      name: 'Arts College',
      email: 'admin@artscollege.edu',
      logo: '/uploads/arts-college-logo.png',
      description: 'Premier arts and design institution',
      location: 'New York, NY',
      studentCount: 2500,
      establishedYear: 1920,
      approved: true,
      createdAt: new Date(),
    }
  ];

  private events: Event[] = [
    {
      id: 1,
      name: 'TechFest 2024',
      collegeId: 1,
      date: new Date('2024-03-15T10:00:00Z'),
      fee: 500,
      eligibility: 'All students',
      hosts: ['Tech Club', 'Innovation Society'],
      contactNos: ['+1-555-0123', '+1-555-0124'],
      prize: '₹50,000',
      openings: 100,
      poster: '/uploads/techfest-poster.jpg',
      description: 'Annual technology festival',
      createdAt: new Date(),
    },
    {
      id: 2,
      name: 'Art Exhibition',
      collegeId: 2,
      date: new Date('2024-02-20T14:00:00Z'),
      fee: 0,
      eligibility: 'Art students',
      hosts: ['Fine Arts Department'],
      contactNos: ['+1-555-0125'],
      prize: '₹25,000',
      openings: 50,
      poster: '/uploads/art-exhibition-poster.jpg',
      description: 'Student art showcase',
      createdAt: new Date(),
    }
  ];

  private registrations: Registration[] = [];
  private feedPosts: FeedPost[] = [];
  private users: User[] = [];
  private idCounter = 3;

  async getColleges(): Promise<College[]> {
    return this.colleges;
  }

  async getCollegeById(id: number): Promise<College | null> {
    return this.colleges.find(c => c.id === id) || null;
  }

  async createCollege(college: InsertCollege): Promise<College> {
    const newCollege: College = {
      id: this.idCounter++,
      ...college,
      createdAt: new Date(),
    };
    this.colleges.push(newCollege);
    return newCollege;
  }

  async getEvents(): Promise<Event[]> {
    return this.events;
  }

  async getEventById(id: number): Promise<Event | null> {
    return this.events.find(e => e.id === id) || null;
  }

  async getEventsByCollegeId(collegeId: number): Promise<Event[]> {
    return this.events.filter(e => e.collegeId === collegeId);
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const newEvent: Event = {
      id: this.idCounter++,
      ...event,
      createdAt: new Date(),
    };
    this.events.push(newEvent);
    return newEvent;
  }

  async updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | null> {
    const index = this.events.findIndex(e => e.id === id);
    if (index === -1) return null;
    
    this.events[index] = { ...this.events[index], ...event };
    return this.events[index];
  }

  async deleteEvent(id: number): Promise<boolean> {
    const index = this.events.findIndex(e => e.id === id);
    if (index === -1) return false;
    
    this.events.splice(index, 1);
    return true;
  }

  async createRegistration(registration: InsertRegistration): Promise<Registration> {
    const newRegistration: Registration = {
      id: this.idCounter++,
      ...registration,
      registeredAt: new Date(),
    };
    this.registrations.push(newRegistration);
    return newRegistration;
  }

  async getRegistrationsByEventId(eventId: number): Promise<Registration[]> {
    return this.registrations.filter(r => r.eventId === eventId);
  }

  async getFeedPosts(): Promise<FeedPost[]> {
    return this.feedPosts.filter(post => post.approved);
  }

  async createFeedPost(post: InsertFeedPost): Promise<FeedPost> {
    const newPost: FeedPost = {
      id: this.idCounter++,
      ...post,
      timestamp: new Date(),
    };
    this.feedPosts.push(newPost);
    return newPost;
  }

  async getUsers(): Promise<User[]> {
    return this.users;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.email === email) || null;
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      id: this.idCounter++,
      ...user,
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  async authenticateCollege(email: string, password: string): Promise<College | null> {
    // Simple auth for demo - in real app, check password hash
    return this.colleges.find(c => c.email === email) || null;
  }

  async authenticateAdmin(username: string, password: string): Promise<{ username: string } | null> {
    if (username === 'admin' && password === 'admin123') {
      return { username: 'admin' };
    }
    return null;
  }
}