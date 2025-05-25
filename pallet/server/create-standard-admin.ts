import { db } from "./db";
import { users } from "@shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { sql } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function createStandardAdmin() {
  console.log("Creating standard admin user...");
  
  try {
    // Check if we need to update an existing user
    const existingUserResult = await db.select().from(users).where(sql`username = 'manager'`).limit(1);
    
    if (existingUserResult.length === 0) {
      console.log("Creating new standard admin user 'manager'...");
      await db.insert(users).values({
        username: "manager",
        password: await hashPassword("manager123"),
        userType: "admin",
        name: "Site Manager",
        email: "manager@progressaccountants.com",
        isSuperAdmin: false,
        createdAt: new Date()
      });
      console.log("Standard admin user created successfully!");
    } else {
      console.log("Updating existing user to be a standard admin...");
      await db.update(users)
        .set({
          userType: "admin",
          isSuperAdmin: false,
          password: await hashPassword("manager123")
        })
        .where(sql`username = 'manager'`);
      console.log("Standard admin user updated successfully!");
    }
  } catch (error) {
    console.error("Error managing standard admin user:", error);
  } finally {
    await db.$client.end();
  }
}

// Run the function
createStandardAdmin();