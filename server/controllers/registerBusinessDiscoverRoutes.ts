import { Express } from "express";
import {
  getBusinessServices,
  getBusinessOffers,
  getContractOpportunities,
  getAffiliateItems,
  createBusinessService,
  createBusinessOffer,
  createContractOpportunity,
  createAffiliateItem
} from "./businessDiscoverController";

export function registerBusinessDiscoverRoutes(app: Express): void {
  // Get routes
  app.get("/api/business-network/services", getBusinessServices);
  app.get("/api/business-network/offers", getBusinessOffers);
  app.get("/api/business-network/opportunities", getContractOpportunities);
  app.get("/api/business-network/affiliate-items", getAffiliateItems);
  
  // Create routes
  app.post("/api/business-network/services", createBusinessService);
  app.post("/api/business-network/offers", createBusinessOffer);
  app.post("/api/business-network/opportunities", createContractOpportunity);
  app.post("/api/business-network/affiliate-items", createAffiliateItem);
  
  console.log("✅ Business Discover routes registered");
}