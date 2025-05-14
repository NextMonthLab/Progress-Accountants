import { Router } from "express";
import { marketplaceService } from "../services/marketplaceService";
import { z } from "zod";
import { storage } from "../storage";

const MarketplaceApiRouter = Router();

// Get all available tools from marketplace
MarketplaceApiRouter.get("/tools", async (req, res) => {
  try {
    const visibility = req.query.visibility as "public" | "private" || "public";
    const tools = await marketplaceService.getAvailableTools(visibility);
    res.json(tools);
  } catch (error) {
    console.error("Error fetching marketplace tools:", error);
    res.status(500).json({ error: "Failed to fetch marketplace tools" });
  }
});

// Install a tool from marketplace
MarketplaceApiRouter.post("/tools/install", async (req, res) => {
  try {
    const schema = z.object({
      toolId: z.string(),
      userId: z.number()
    });

    const { toolId, userId } = schema.parse(req.body);
    
    const installation = await marketplaceService.installTool(toolId, userId);
    
    if (!installation) {
      return res.status(400).json({ error: "Failed to install tool" });
    }
    
    res.status(201).json(installation);
  } catch (error) {
    console.error("Error installing marketplace tool:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Failed to install tool" });
  }
});

// Get all installed tools for the current tenant
MarketplaceApiRouter.get("/tools/installed", async (req, res) => {
  try {
    const tenantDomain = req.query.domain as string || "progress-accountants.com";
    const installations = await marketplaceService.getInstalledTools(tenantDomain);
    res.json(installations);
  } catch (error) {
    console.error("Error fetching installed tools:", error);
    res.status(500).json({ error: "Failed to fetch installed tools" });
  }
});

// Uninstall a tool
MarketplaceApiRouter.post("/tools/uninstall", async (req, res) => {
  try {
    const schema = z.object({
      installationId: z.number()
    });

    const { installationId } = schema.parse(req.body);
    
    const success = await marketplaceService.uninstallTool(installationId);
    
    if (!success) {
      return res.status(400).json({ error: "Failed to uninstall tool" });
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error uninstalling tool:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Failed to uninstall tool" });
  }
});

// Register Progress as a Smart Site
MarketplaceApiRouter.post("/register", async (req, res) => {
  try {
    const success = await marketplaceService.registerSmartSite();
    
    if (!success) {
      return res.status(400).json({ error: "Failed to register Smart Site" });
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error registering Smart Site:", error);
    res.status(500).json({ error: "Failed to register Smart Site" });
  }
});

// Get credit usage for the current tenant
MarketplaceApiRouter.get("/credits/usage", async (req, res) => {
  try {
    const businessId = req.query.businessId as string || "progress-accountants";
    const logs = await storage.getCreditUsageLogs(businessId);
    const total = await storage.getCreditUsageTotal(businessId);
    
    res.json({ logs, total });
  } catch (error) {
    console.error("Error fetching credit usage:", error);
    res.status(500).json({ error: "Failed to fetch credit usage" });
  }
});

export default MarketplaceApiRouter;