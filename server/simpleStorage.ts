import { 
  users, 
  type User, 
  type InsertUser
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import session from "express-session";

/**
 * Simplified storage interface with just the authentication-related methods
 */
export interface ISimpleStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string, tenantId?: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  sessionStore: session.Store;
}

/**
 * Database-backed implementation of simplified storage for authentication
 */
export class DatabaseStorage implements ISimpleStorage {
  sessionStore: session.Store;
  
  constructor() {
    // Use built-in MemoryStore for sessions - simplest option to get started
    this.sessionStore = new session.MemoryStore();
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string, tenantId?: string): Promise<User | undefined> {
    if (tenantId) {
      // Check for username uniqueness within tenant scope
      const [user] = await db
        .select()
        .from(users)
        .where(
          and(
            eq(users.username, username),
            eq(users.tenantId, tenantId)
          )
        );
      return user;
    } else {
      // Global lookup for usernames (still useful for system admin functions)
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.username, username));
      return user;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Check for tenant-scoped username uniqueness before creating
    // This is mirroring the validation in auth.ts but adding an extra safety layer
    if (insertUser.tenantId) {
      const existingUser = await this.getUserByUsername(insertUser.username, insertUser.tenantId);
      if (existingUser) {
        throw new Error(`Username '${insertUser.username}' already exists in this tenant`);
      }
    } else {
      const existingUser = await this.getUserByUsername(insertUser.username);
      if (existingUser) {
        throw new Error(`Username '${insertUser.username}' already exists`);
      }
    }
    
    // Add timestamps
    const userWithTimestamps = {
      ...insertUser,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const [user] = await db.insert(users).values(userWithTimestamps).returning();
    return user;
  }
}

// Create a simpler memory-based storage implementation
export class MemStorage implements ISimpleStorage {
  private users: Map<number, User>;
  private currentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    this.sessionStore = new session.MemoryStore();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string, tenantId?: string): Promise<User | undefined> {
    if (tenantId) {
      // Tenant-scoped username lookup
      return Array.from(this.users.values()).find(
        (user) => user.username === username && user.tenantId === tenantId
      );
    } else {
      // Global username lookup
      return Array.from(this.users.values()).find(
        (user) => user.username === username
      );
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Check for tenant-scoped username uniqueness
    if (insertUser.tenantId) {
      const existingUser = await this.getUserByUsername(insertUser.username, insertUser.tenantId);
      if (existingUser) {
        throw new Error(`Username '${insertUser.username}' already exists in this tenant`);
      }
    } else {
      // Check for global uniqueness
      const existingUser = await this.getUserByUsername(insertUser.username);
      if (existingUser) {
        throw new Error(`Username '${insertUser.username}' already exists`);
      }
    }
    
    const id = this.currentId++;
    const user = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }
}

// Using the DatabaseStorage implementation for production
export const simpleStorage = new DatabaseStorage();