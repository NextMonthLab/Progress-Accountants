import { db } from "./db";
import { User, users } from "@shared/schema";
import { scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { eq } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

async function verifyUser(username: string, password: string) {
  try {
    // Get user from database
    const [user] = await db.select().from(users).where(eq(users.username, username));
    
    if (!user) {
      console.log(`User with username "${username}" not found`);
      return false;
    }
    
    console.log(`Found user: ${user.username} (ID: ${user.id})`);
    
    // Check password
    const isPasswordValid = await comparePasswords(password, user.password);
    
    if (isPasswordValid) {
      console.log('Password is valid! Authentication successful.');
      return true;
    } else {
      console.log('Password is invalid. Authentication failed.');
      return false;
    }
  } catch (error) {
    console.error('Error verifying user:', error);
    return false;
  } finally {
    await db.$client.end();
  }
}

// Verify the admin user
verifyUser('admin', 'admin123')
  .then(result => {
    if (result) {
      console.log('Verification successful');
    } else {
      console.log('Verification failed');
    }
  })
  .catch(err => {
    console.error('Verification error:', err);
  });