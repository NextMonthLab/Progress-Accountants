import { db } from "./db";
import { users, tenants } from "@shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { sql } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function createAdminUser() {
  console.log("Checking for existing admin user...");
  
  try {
    // Check if admin user exists
    const adminUser = await db.select().from(users).where(sql`username = 'admin'`);
    
    if (adminUser.length) {
      console.log("Admin user already exists.");
      return;
    }
    
    // Check if any tenant exists
    const existingTenant = await db.select().from(tenants).limit(1);
    let tenantId: string | null = null;
    
    if (existingTenant.length) {
      tenantId = existingTenant[0].id;
      console.log(`Using existing tenant: ${tenantId}`);
    } else {
      console.log("Creating default tenant...");
      // Create a tenant
      const [tenant] = await db.insert(tenants).values({
        name: "Progress Accountants",
        type: "business",
        domain: "progressaccountants.com",
        status: "active",
        customization: {
          uiLabels: {
            siteName: "Progress Accountants",
            dashboardTitle: "Progress Dashboard",
            toolsLabel: "Services",
            pagesLabel: "Pages",
            marketplaceLabel: "Modules",
            accountLabel: "My Account",
            settingsLabel: "Settings",
          },
          tone: {
            formality: "professional",
            personality: "professional",
          },
          featureFlags: {
            enablePodcastTools: true,
            enableFinancialReporting: true,
            enableClientPortal: true,
            enableMarketplaceAccess: true,
            enableCustomPages: true,
            enableClientLogin: true,
          },
          sectionsEnabled: {
            servicesShowcase: true,
            teamMembers: true,
            testimonialsSlider: true,
            blogPosts: true,
            eventCalendar: true,
            resourceCenter: true,
          },
        }
      }).returning();
      
      tenantId = tenant.id;
      console.log(`Created new tenant with ID: ${tenantId}`);
    }
    
    console.log("Creating admin user...");
    
    // Create the admin user
    const [admin] = await db.insert(users).values({
      username: "admin",
      password: await hashPassword("admin123"),
      userType: "admin",
      name: "Administrator",
      email: "admin@progressaccountants.com",
      tenantId,
      isSuperAdmin: true
    }).returning();
    
    console.log(`Admin user created with ID: ${admin.id}`);
    console.log("Username: admin");
    console.log("Password: admin123");
    
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    // Don't end the pool as it might be used by the running app
  }
}

// Run the function
createAdminUser().then(() => {
  console.log("Admin user creation script completed");
});