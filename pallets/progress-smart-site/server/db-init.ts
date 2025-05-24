import { db } from "./db";
import { 
  users, 
  businessIdentity, 
  projectContext, 
  modules, 
  featureRequests,
  contactSubmissions,
  activityLogs
} from "@shared/schema";
import { sqliteTable } from "drizzle-orm/sqlite-core";
import { pgTable } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function initializeDatabase() {
  console.log("Initializing database...");
  
  try {
    // Create tables
    // This would normally be done by drizzle migration, but we're doing it manually for simplicity
    console.log("Creating tables...");

    // Check if admin user exists
    const adminUser = await db.select().from(users).where(sql`username = 'admin'`).limit(1);
    
    if (!adminUser.length) {
      console.log("Creating default admin user...");
      await db.insert(users).values({
        username: "admin",
        password: await hashPassword("admin123"),
        userType: "admin",
        name: "Administrator",
        email: "admin@progressaccountants.com",
        createdAt: new Date()
      });
    }
    
    // Add other default data as needed
    const businessData = await db.select().from(businessIdentity).limit(1);
    if (!businessData.length) {
      console.log("Creating default business identity...");
      await db.insert(businessIdentity).values({
        name: "Progress Accountants",
        mission: "To provide modern accounting services to creative professionals",
        vision: "To be the leading accounting firm for the creative industry",
        marketFocus: JSON.stringify(["Film", "Music", "Construction"]),
        targetAudience: JSON.stringify(["Independent creators", "Small studios", "Creative businesses"]),
        brandVoice: JSON.stringify(["Professional", "Friendly", "Knowledgeable"]),
        brandPositioning: "Premier accounting services for creative professionals",
        teamValues: JSON.stringify(["Integrity", "Innovation", "Client-focused"]),
        cultureStatements: JSON.stringify(["We value work-life balance", "We promote continuous learning"]),
        updatedAt: new Date()
      });
    }
    
    const projectData = await db.select().from(projectContext).limit(1);
    if (!projectData.length) {
      console.log("Creating default project context...");
      await db.insert(projectContext).values({
        homepageSetup: JSON.stringify({
          heroTitle: "Progress Accountants",
          heroSubtitle: "Financial clarity for creative professionals",
          heroButtonText: "Book a Discovery Call",
          heroButtonLink: "/contact"
        }),
        pageStatus: JSON.stringify({
          homepage: "complete",
          about: "in_progress",
          services: "not_started"
        }),
        onboardingComplete: false,
        updatedAt: new Date()
      });
    }
    
    console.log("Database initialization complete!");
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    await db.$client.end();
  }
}

// Run the initialization function
initializeDatabase();