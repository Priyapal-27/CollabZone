import type { 
  SelectCollege, 
  SelectEvent, 
  SelectRegistration, 
  SelectFeedPost, 
  SelectUser,
  InsertCollege,
  InsertEvent,
  InsertRegistration,
  InsertFeedPost,
  InsertUser
} from '../shared/schema.js';

export interface IStorage {
  // Colleges
  getColleges(): Promise<SelectCollege[]>;
  getCollegeById(id: number): Promise<SelectCollege | null>;
  createCollege(college: InsertCollege): Promise<SelectCollege>;
  
  // Events
  getEvents(): Promise<SelectEvent[]>;
  getEventById(id: number): Promise<SelectEvent | null>;
  getEventsByCollegeId(collegeId: number): Promise<SelectEvent[]>;
  createEvent(event: InsertEvent): Promise<SelectEvent>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<SelectEvent | null>;
  deleteEvent(id: number): Promise<boolean>;
  
  // Registrations
  createRegistration(registration: InsertRegistration): Promise<SelectRegistration>;
  getRegistrationsByEventId(eventId: number): Promise<SelectRegistration[]>;
  
  // Feed Posts
  getFeedPosts(): Promise<SelectFeedPost[]>;
  getApprovedFeedPosts(): Promise<SelectFeedPost[]>;
  createFeedPost(post: InsertFeedPost): Promise<SelectFeedPost>;
  
  // Users
  getUsers(): Promise<SelectUser[]>;
  getUserByEmail(email: string): Promise<SelectUser | null>;
  getUserByUsername(username: string): Promise<SelectUser | null>;
  createUser(user: InsertUser): Promise<SelectUser>;
  
  // Authentication helpers
  getCollegeByEmail(email: string): Promise<SelectCollege | null>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private colleges: SelectCollege[] = [
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
      createdAt: new Date()
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
      createdAt: new Date()
    }
  ];

  private events: SelectEvent[] = [
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
      createdAt: new Date()
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
      createdAt: new Date()
    }
  ];

  private registrations: SelectRegistration[] = [];
  private feedPosts: SelectFeedPost[] = [];
  private users: SelectUser[] = [];
  private idCounter = 3;

  // Colleges
  async getColleges(): Promise<SelectCollege[]> {
    return [...this.colleges];
  }

  async getCollegeById(id: number): Promise<SelectCollege | null> {
    return this.colleges.find(c => c.id === id) || null;
  }

  async createCollege(college: InsertCollege): Promise<SelectCollege> {
    const newCollege: SelectCollege = {
      id: this.idCounter++,
      ...college,
      logo: college.logo ?? null,
      description: college.description ?? null,
      location: college.location ?? null,
      studentCount: college.studentCount ?? null,
      establishedYear: college.establishedYear ?? null,
      approved: college.approved ?? null,
      createdAt: new Date()
    };
    this.colleges.push(newCollege);
    return newCollege;
  }

  async getCollegeByEmail(email: string): Promise<SelectCollege | null> {
    return this.colleges.find(c => c.email === email) || null;
  }

  // Events
  async getEvents(): Promise<SelectEvent[]> {
    return [...this.events];
  }

  async getEventById(id: number): Promise<SelectEvent | null> {
    return this.events.find(e => e.id === id) || null;
  }

  async getEventsByCollegeId(collegeId: number): Promise<SelectEvent[]> {
    return this.events.filter(e => e.collegeId === collegeId);
  }

  async createEvent(event: InsertEvent): Promise<SelectEvent> {
    const newEvent: SelectEvent = {
      id: this.idCounter++,
      ...event,
      fee: event.fee ?? null,
      eligibility: event.eligibility ?? null,
      hosts: event.hosts ?? null,
      contactNos: event.contactNos ?? null,
      prize: event.prize ?? null,
      openings: event.openings ?? null,
      poster: event.poster ?? null,
      description: event.description ?? null,
      createdAt: new Date()
    };
    this.events.push(newEvent);
    return newEvent;
  }

  async updateEvent(id: number, event: Partial<InsertEvent>): Promise<SelectEvent | null> {
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

  // Registrations
  async createRegistration(registration: InsertRegistration): Promise<SelectRegistration> {
    const newRegistration: SelectRegistration = {
      id: this.idCounter++,
      ...registration,
      year: registration.year ?? null,
      branch: registration.branch ?? null,
      registeredAt: new Date()
    };
    this.registrations.push(newRegistration);
    return newRegistration;
  }

  async getRegistrationsByEventId(eventId: number): Promise<SelectRegistration[]> {
    return this.registrations.filter(r => r.eventId === eventId);
  }

  // Feed Posts
  async getFeedPosts(): Promise<SelectFeedPost[]> {
    return [...this.feedPosts];
  }

  async getApprovedFeedPosts(): Promise<SelectFeedPost[]> {
    return this.feedPosts.filter(p => p.approved);
  }

  async createFeedPost(post: InsertFeedPost): Promise<SelectFeedPost> {
    const newPost: SelectFeedPost = {
      id: this.idCounter++,
      ...post,
      approved: post.approved ?? null,
      collegeId: post.collegeId ?? null,
      timestamp: new Date()
    };
    this.feedPosts.push(newPost);
    return newPost;
  }

  // Users
  async getUsers(): Promise<SelectUser[]> {
    return [...this.users];
  }

  async getUserByEmail(email: string): Promise<SelectUser | null> {
    return this.users.find(u => u.email === email) || null;
  }

  async getUserByUsername(username: string): Promise<SelectUser | null> {
    return this.users.find(u => u.username === username) || null;
  }

  async createUser(user: InsertUser): Promise<SelectUser> {
    const newUser: SelectUser = {
      id: this.idCounter++,
      ...user,
      collegeId: user.collegeId ?? null,
      createdAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }
}