import { users, type User, type InsertUser } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

// Feature request type
export interface FeatureRequest {
  id: number;
  requestData: {
    project: string;
    type: string;
    payload: {
      screen_name: string;
      description: string;
      features: string[];
    }
  };
  sentAt: string;
  status: 'sent' | 'delivered' | 'in-progress' | 'completed';
}

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  featureRequests?: FeatureRequest[];
  saveContactSubmission(data: any): Promise<any>;
  getContactSubmissions(): Promise<any[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;
  featureRequests: FeatureRequest[];
  contactSubmissions?: Map<number, any>;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    this.featureRequests = [];
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async saveContactSubmission(data: any): Promise<any> {
    const id = this.currentId++;
    const submission = { 
      ...data, 
      id, 
      date: new Date() 
    };
    
    if (!this.contactSubmissions) {
      this.contactSubmissions = new Map<number, any>();
    }
    
    this.contactSubmissions.set(id, submission);
    return submission;
  }

  async getContactSubmissions(): Promise<any[]> {
    if (!this.contactSubmissions) {
      this.contactSubmissions = new Map<number, any>();
    }
    
    return Array.from(this.contactSubmissions.values());
  }
}

export const storage = new MemStorage();
