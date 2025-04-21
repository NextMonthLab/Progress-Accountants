import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function createAdminUser() {
  try {
    console.log("Checking for admin user...");
    
    // Check if admin user exists
    const adminUser = await db.select().from(users).where(eq(users.username, "admin")).limit(1);
    
    if (adminUser.length === 0) {
      console.log("Admin user not found, creating new admin user...");
      
      // Create admin user
      const hashedPassword = await hashPassword("admin123");
      
      await db.insert(users).values({
        username: "admin",
        password: hashedPassword,
        name: "Administrator",
        userType: "admin",
        email: "admin@progressaccountants.com",
        isSuperAdmin: true
      });
      
      console.log("Admin user created successfully!");
    } else {
      console.log("Admin user already exists");
      
      // Update admin password to ensure it's correct
      console.log("Updating admin password to ensure it's correct...");
      const hashedPassword = await hashPassword("admin123");
      
      await db.update(users)
        .set({ 
          password: hashedPassword,
          isSuperAdmin: true,
          updatedAt: new Date()
        })
        .where(eq(users.username, "admin"));
      
      console.log("Admin password updated successfully!");
    }
  } catch (error) {
    console.error("Error creating/updating admin user:", error);
  } finally {
    await db.$client.end();
  }
}

// Run the script
createAdminUser();