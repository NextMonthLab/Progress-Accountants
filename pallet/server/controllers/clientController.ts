import { Request, Response } from "express";
import type { Express } from "express";
import { z } from "zod";
import { storage } from "../storage";
import { hashPassword } from "../auth";
import { simpleStorage } from "../simpleStorage";

// Define client registration schema
const clientRegistrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  tenantId: z.string().uuid("Invalid tenant ID"),
  userType: z.literal("client")
});

/**
 * Register client routes
 */
export function registerClientRoutes(app: Express) {
  // Client registration endpoint
  app.post("/api/client-register", async (req: Request, res: Response) => {
    try {
      // Validate incoming data
      const validatedData = clientRegistrationSchema.parse(req.body);
      
      // Check if tenant exists
      const tenant = await simpleStorage.getTenant(validatedData.tenantId);
      if (!tenant) {
        return res.status(404).json({
          success: false,
          message: "Tenant not found"
        });
      }
      
      // Check if tenant has client login enabled
      const clientLoginEnabled = tenant.customization?.featureFlags?.enableClientLogin ?? false;
      if (!clientLoginEnabled) {
        return res.status(403).json({
          success: false,
          message: "Client registration is disabled for this tenant"
        });
      }
      
      // Check if email is already in use within this tenant
      const existingUser = await simpleStorage.getUserByEmail(validatedData.email, validatedData.tenantId);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email is already registered. Please log in instead."
        });
      }
      
      // Create a username from the email (typically the part before @)
      const username = validatedData.email.split('@')[0];
      
      // Hash the password
      const hashedPassword = await hashPassword(validatedData.password);
      
      // Create the user account
      const newUser = await simpleStorage.createUser({
        username,
        password: hashedPassword,
        name: validatedData.name,
        email: validatedData.email,
        userType: "client",
        tenantId: validatedData.tenantId,
        isSuperAdmin: false
      });
      
      // Return success without the password
      const { password, ...userWithoutPassword } = newUser;
      
      // Log the client registration
      await simpleStorage.logActivity({
        userId: newUser.id,
        tenantId: validatedData.tenantId,
        action: "client_registration",
        details: {
          userEmail: validatedData.email,
          name: validatedData.name
        }
      });
      
      res.status(201).json({
        success: true,
        message: "Client registered successfully",
        user: userWithoutPassword
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.errors
        });
      }
      
      console.error("Client registration error:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred during registration"
      });
    }
  });
  
  // Get client profile endpoint (protected, requires authentication)
  app.get("/api/client/profile", (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }
    
    // Check if the authenticated user is a client
    const user = req.user;
    if (user.userType !== "client") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Client access only."
      });
    }
    
    // Return client profile info (excluding password)
    const { password, ...userWithoutPassword } = user;
    
    res.status(200).json({
      success: true,
      client: userWithoutPassword
    });
  });
}