import { Request, Response } from "express";
import { storage } from "../storage";
import { z } from "zod";
import { insertCompanionConfigSchema } from "@shared/schema";

export const getCompanionConfig = async (req: Request, res: Response) => {
  try {
    // Get tenantId from authenticated user, query param, or body
    let tenantId = req.user?.tenantId as string;
    
    // If not in user object, check query param
    if (!tenantId && req.query.tenantId) {
      tenantId = req.query.tenantId as string;
    }
    
    // If not in query, check body
    if (!tenantId && req.body.tenantId) {
      tenantId = req.body.tenantId;
    }
    
    if (!tenantId) {
      return res.status(400).json({ error: "Tenant ID is required" });
    }
    
    const config = await storage.getCompanionConfig(tenantId);
    
    if (!config) {
      return res.status(404).json({ error: "Companion configuration not found" });
    }
    
    return res.status(200).json(config);
  } catch (error) {
    console.error("Error fetching companion config:", error);
    return res.status(500).json({ error: "Failed to fetch companion configuration" });
  }
};

export const createCompanionConfig = async (req: Request, res: Response) => {
  try {
    // Get tenantId from authenticated user, query param, or body
    let tenantId = req.user?.tenantId as string;
    
    // If not in user object, check query param
    if (!tenantId && req.query.tenantId) {
      tenantId = req.query.tenantId as string;
    }
    
    // If not in query, check body
    if (!tenantId && req.body.tenantId) {
      tenantId = req.body.tenantId;
    }
    
    if (!tenantId) {
      return res.status(400).json({ error: "Tenant ID is required" });
    }
    
    // Check if config already exists
    const existingConfig = await storage.getCompanionConfig(tenantId);
    
    if (existingConfig) {
      return res.status(409).json({ 
        error: "Companion configuration already exists for this tenant",
        config: existingConfig
      });
    }
    
    // Validate the request body
    const validationResult = insertCompanionConfigSchema.safeParse({
      ...req.body,
      tenantId
    });
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: "Invalid configuration data", 
        details: validationResult.error.format() 
      });
    }
    
    const newConfig = await storage.createCompanionConfig(validationResult.data);
    
    return res.status(201).json(newConfig);
  } catch (error) {
    console.error("Error creating companion config:", error);
    return res.status(500).json({ error: "Failed to create companion configuration" });
  }
};

export const updateCompanionConfig = async (req: Request, res: Response) => {
  try {
    // Get tenantId from authenticated user, query param, or body
    let tenantId = req.user?.tenantId as string;
    
    // If not in user object, check query param
    if (!tenantId && req.query.tenantId) {
      tenantId = req.query.tenantId as string;
    }
    
    // If not in query, check body
    if (!tenantId && req.body.tenantId) {
      tenantId = req.body.tenantId;
    }
    
    if (!tenantId) {
      return res.status(400).json({ error: "Tenant ID is required" });
    }
    
    // Check if config exists
    const existingConfig = await storage.getCompanionConfig(tenantId);
    
    if (!existingConfig) {
      return res.status(404).json({ error: "Companion configuration not found" });
    }
    
    // Validate the request body
    const updateSchema = insertCompanionConfigSchema.partial().omit({ tenantId: true });
    const validationResult = updateSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: "Invalid configuration data", 
        details: validationResult.error.format() 
      });
    }
    
    const updatedConfig = await storage.updateCompanionConfig(
      existingConfig.id,
      validationResult.data
    );
    
    return res.status(200).json(updatedConfig);
  } catch (error) {
    console.error("Error updating companion config:", error);
    return res.status(500).json({ error: "Failed to update companion configuration" });
  }
};

// Default configuration creator for new tenants
export const createDefaultCompanionConfig = async (tenantId: string) => {
  try {
    // Check if config already exists
    const existingConfig = await storage.getCompanionConfig(tenantId);
    
    if (existingConfig) {
      return existingConfig; // Already exists, no need to create
    }
    
    // Default configuration values
    const defaultConfig = {
      tenantId,
      tone: {
        style: "professional",
        examplePhrases: [
          "How can I assist you with your accounting needs today?",
          "I'd be happy to explain our services in more detail.",
          "Let me help you understand how our financial solutions can benefit your business."
        ]
      },
      allowedTopics: [
        "accounting services",
        "tax preparation",
        "financial planning",
        "business consulting",
        "bookkeeping"
      ],
      offlimitTopics: [
        "specific investment advice",
        "legal advice",
        "personal issues unrelated to finance"
      ],
      regulatedIndustry: {
        isRegulated: true,
        guidelines: [
          "All tax advice must be general in nature",
          "Financial recommendations must include disclaimers",
          "Data protection and confidentiality must be maintained"
        ],
        termsToAvoid: [
          "guarantee",
          "promise",
          "assured return",
          "risk-free"
        ],
        requiredDisclaimers: [
          "This information is general in nature and not a substitute for professional advice.",
          "Individual circumstances may affect outcomes."
        ]
      },
      dataAccess: {
        canAccessClientData: true,
        customerDataRestrictions: [
          "Cannot share specifics between clients",
          "Cannot access financial records without explicit permission"
        ],
        sensitiveFieldsRestricted: [
          "tax identification numbers",
          "bank details",
          "personal financial information"
        ]
      }
    };
    
    return await storage.createCompanionConfig(defaultConfig);
  } catch (error) {
    console.error("Error creating default companion config:", error);
    throw error;
  }
};