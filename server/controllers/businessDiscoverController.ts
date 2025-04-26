import { Request, Response } from "express";
import { db } from "../db";
import { eq, and, desc, asc } from "drizzle-orm";
import { 
  businessServices, 
  businessOffers, 
  contractOpportunities, 
  affiliateItems,
  businessProfiles,
  users
} from "@shared/business_network";

// Get all business services with pagination and filters
export async function getBusinessServices(req: Request, res: Response) {
  try {
    const { category, sort = "newest", limit = 20, offset = 0 } = req.query;
    
    let query = db.select({
      id: businessServices.id,
      title: businessServices.title,
      description: businessServices.description,
      price: businessServices.price,
      category: businessServices.category,
      createdAt: businessServices.createdAt,
      featured: businessServices.featured,
      provider: {
        id: businessProfiles.userId,
        name: businessProfiles.name,
        avatar: businessProfiles.avatar,
        rating: businessProfiles.rating,
        reviewCount: businessProfiles.reviewCount
      }
    })
    .from(businessServices)
    .leftJoin(businessProfiles, eq(businessServices.providerId, businessProfiles.id))
    .limit(Number(limit))
    .offset(Number(offset));
    
    // Apply category filter if provided
    if (category && category !== 'all') {
      query = query.where(eq(businessServices.category, String(category)));
    }
    
    // Apply sorting
    if (sort === "newest") {
      query = query.orderBy(desc(businessServices.createdAt));
    } else if (sort === "oldest") {
      query = query.orderBy(asc(businessServices.createdAt));
    } else if (sort === "rating") {
      query = query.orderBy(desc(businessProfiles.rating));
    }

    const services = await query;
    
    res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching business services:", error);
    res.status(500).json({ error: "Failed to fetch business services" });
  }
}

// Get all business offers with pagination and filters
export async function getBusinessOffers(req: Request, res: Response) {
  try {
    const { sort = "newest", limit = 20, offset = 0 } = req.query;
    
    let query = db.select({
      id: businessOffers.id,
      title: businessOffers.title,
      description: businessOffers.description,
      discount: businessOffers.discount,
      validUntil: businessOffers.validUntil,
      createdAt: businessOffers.createdAt,
      featured: businessOffers.featured,
      provider: {
        id: businessProfiles.userId,
        name: businessProfiles.name,
        avatar: businessProfiles.avatar,
        rating: businessProfiles.rating,
        reviewCount: businessProfiles.reviewCount
      }
    })
    .from(businessOffers)
    .leftJoin(businessProfiles, eq(businessOffers.providerId, businessProfiles.id))
    .limit(Number(limit))
    .offset(Number(offset));
    
    // Apply sorting
    if (sort === "newest") {
      query = query.orderBy(desc(businessOffers.createdAt));
    } else if (sort === "oldest") {
      query = query.orderBy(asc(businessOffers.createdAt));
    } else if (sort === "rating") {
      query = query.orderBy(desc(businessProfiles.rating));
    }

    const offers = await query;
    
    res.status(200).json(offers);
  } catch (error) {
    console.error("Error fetching business offers:", error);
    res.status(500).json({ error: "Failed to fetch business offers" });
  }
}

// Get all contract opportunities with pagination and filters
export async function getContractOpportunities(req: Request, res: Response) {
  try {
    const { expertise, sort = "newest", limit = 20, offset = 0 } = req.query;
    
    let query = db.select({
      id: contractOpportunities.id,
      title: contractOpportunities.title,
      description: contractOpportunities.description,
      budget: contractOpportunities.budget,
      deadline: contractOpportunities.deadline,
      location: contractOpportunities.location,
      requiredExpertise: contractOpportunities.requiredExpertise,
      createdAt: contractOpportunities.createdAt,
      featured: contractOpportunities.featured,
      postedBy: {
        id: businessProfiles.userId,
        name: businessProfiles.name,
        avatar: businessProfiles.avatar,
        rating: businessProfiles.rating,
        reviewCount: businessProfiles.reviewCount
      }
    })
    .from(contractOpportunities)
    .leftJoin(businessProfiles, eq(contractOpportunities.postedById, businessProfiles.id))
    .limit(Number(limit))
    .offset(Number(offset));
    
    // Apply sorting
    if (sort === "newest") {
      query = query.orderBy(desc(contractOpportunities.createdAt));
    } else if (sort === "oldest") {
      query = query.orderBy(asc(contractOpportunities.createdAt));
    } else if (sort === "rating") {
      query = query.orderBy(desc(businessProfiles.rating));
    }

    const opportunities = await query;
    
    // If expertise filter is provided, filter results in JS
    // (since array filtering in SQL is more complex)
    let filteredOpportunities = opportunities;
    if (expertise && expertise !== 'all') {
      filteredOpportunities = opportunities.filter(opp => 
        opp.requiredExpertise && 
        opp.requiredExpertise.includes(String(expertise))
      );
    }
    
    res.status(200).json(filteredOpportunities);
  } catch (error) {
    console.error("Error fetching contract opportunities:", error);
    res.status(500).json({ error: "Failed to fetch contract opportunities" });
  }
}

// Get all affiliate items with pagination and filters
export async function getAffiliateItems(req: Request, res: Response) {
  try {
    const { sort = "newest", limit = 20, offset = 0 } = req.query;
    
    let query = db.select({
      id: affiliateItems.id,
      title: affiliateItems.title,
      description: affiliateItems.description,
      price: affiliateItems.price,
      commission: affiliateItems.commission,
      image: affiliateItems.image,
      createdAt: affiliateItems.createdAt,
      featured: affiliateItems.featured,
      provider: {
        id: businessProfiles.userId,
        name: businessProfiles.name,
        avatar: businessProfiles.avatar,
        rating: businessProfiles.rating,
        reviewCount: businessProfiles.reviewCount
      }
    })
    .from(affiliateItems)
    .leftJoin(businessProfiles, eq(affiliateItems.providerId, businessProfiles.id))
    .limit(Number(limit))
    .offset(Number(offset));
    
    // Apply sorting
    if (sort === "newest") {
      query = query.orderBy(desc(affiliateItems.createdAt));
    } else if (sort === "oldest") {
      query = query.orderBy(asc(affiliateItems.createdAt));
    } else if (sort === "rating") {
      query = query.orderBy(desc(businessProfiles.rating));
    }

    const items = await query;
    
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching affiliate items:", error);
    res.status(500).json({ error: "Failed to fetch affiliate items" });
  }
}

// Create a new business service
export async function createBusinessService(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const userId = req.user.id;
    
    // Get or create business profile for the user
    const businessProfile = await db.query.businessProfiles.findFirst({
      where: eq(businessProfiles.userId, userId)
    });

    if (!businessProfile) {
      return res.status(400).json({ error: "Business profile not found. Please complete your profile first." });
    }

    const { title, description, price, category } = req.body;

    // Validate required fields
    if (!title || !description || !price || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create new business service
    const [newService] = await db.insert(businessServices)
      .values({
        title,
        description,
        price,
        category,
        providerId: businessProfile.id,
        createdAt: new Date().toISOString(),
        featured: false
      })
      .returning();

    res.status(201).json(newService);
  } catch (error) {
    console.error("Error creating business service:", error);
    res.status(500).json({ error: "Failed to create business service" });
  }
}

// Create a new business offer
export async function createBusinessOffer(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const userId = req.user.id;
    
    // Get or create business profile for the user
    const businessProfile = await db.query.businessProfiles.findFirst({
      where: eq(businessProfiles.userId, userId)
    });

    if (!businessProfile) {
      return res.status(400).json({ error: "Business profile not found. Please complete your profile first." });
    }

    const { title, description, discount, validUntil } = req.body;

    // Validate required fields
    if (!title || !description || !discount || !validUntil) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create new business offer
    const [newOffer] = await db.insert(businessOffers)
      .values({
        title,
        description,
        discount,
        validUntil,
        providerId: businessProfile.id,
        createdAt: new Date().toISOString(),
        featured: false
      })
      .returning();

    res.status(201).json(newOffer);
  } catch (error) {
    console.error("Error creating business offer:", error);
    res.status(500).json({ error: "Failed to create business offer" });
  }
}

// Create a new contract opportunity
export async function createContractOpportunity(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const userId = req.user.id;
    
    // Get or create business profile for the user
    const businessProfile = await db.query.businessProfiles.findFirst({
      where: eq(businessProfiles.userId, userId)
    });

    if (!businessProfile) {
      return res.status(400).json({ error: "Business profile not found. Please complete your profile first." });
    }

    const { title, description, budget, deadline, location, requiredExpertise } = req.body;

    // Validate required fields
    if (!title || !description || !budget || !deadline || !location || !requiredExpertise) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create new contract opportunity
    const [newOpportunity] = await db.insert(contractOpportunities)
      .values({
        title,
        description,
        budget,
        deadline,
        location,
        requiredExpertise,
        postedById: businessProfile.id,
        createdAt: new Date().toISOString(),
        featured: false
      })
      .returning();

    res.status(201).json(newOpportunity);
  } catch (error) {
    console.error("Error creating contract opportunity:", error);
    res.status(500).json({ error: "Failed to create contract opportunity" });
  }
}

// Create a new affiliate item
export async function createAffiliateItem(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const userId = req.user.id;
    
    // Get or create business profile for the user
    const businessProfile = await db.query.businessProfiles.findFirst({
      where: eq(businessProfiles.userId, userId)
    });

    if (!businessProfile) {
      return res.status(400).json({ error: "Business profile not found. Please complete your profile first." });
    }

    const { title, description, price, commission, image } = req.body;

    // Validate required fields
    if (!title || !description || !price || !commission) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create new affiliate item
    const [newItem] = await db.insert(affiliateItems)
      .values({
        title,
        description,
        price,
        commission,
        image: image || "",
        providerId: businessProfile.id,
        createdAt: new Date().toISOString(),
        featured: false
      })
      .returning();

    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error creating affiliate item:", error);
    res.status(500).json({ error: "Failed to create affiliate item" });
  }
}