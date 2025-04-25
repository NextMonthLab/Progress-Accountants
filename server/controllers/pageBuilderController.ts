import { Request, Response } from "express";
import { db } from "../db";
import { migratePageBuilderTables } from "../db-migrate-page-builder";
import { sql } from "drizzle-orm";
import { 
  pageBuilderPages, 
  pageBuilderSections,
  pageBuilderComponents,
  pageBuilderTemplates,
  pageBuilderRecommendations,
  contentVersions,
  users,
  tenants,
  insertPageBuilderPageSchema,
  insertPageBuilderSectionSchema,
  insertPageBuilderComponentSchema,
} from "../../shared/schema";
import { desc, eq, and } from "drizzle-orm";
import { VersionableEntityType, ChangeType } from "@shared/version_control";
import { 
  calculateSeoScore, 
  generateSeoRecommendations, 
  applyRecommendation, 
  dismissRecommendation, 
  getPageRecommendations 
} from "../services/seoAnalysisService";

// Helper function to check if a table exists
export async function checkIfTableExists(tableName: string): Promise<boolean> {
  try {
    const result = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = ${tableName}
      ) as "exists";
    `);
    
    // Handle the boolean explicitly
    if (result.rows && result.rows.length > 0) {
      const exists = result.rows[0].exists;
      return typeof exists === 'boolean' ? exists : exists === 'true' || exists === 't' || exists === '1';
    }
    
    return false;
  } catch (error) {
    console.error('Error checking if table exists:', error);
    return false;
  }
}

// Helper function to create a version record for a page
async function createPageVersion(pageId: number, snapshot: any, changeType: ChangeType, userId?: number, description?: string) {
  try {
    // Get the latest version number for this page
    const existingVersions = await db
      .select({ versionNumber: contentVersions.versionNumber })
      .from(contentVersions)
      .where(
        and(
          eq(contentVersions.entityType, 'page'),
          eq(contentVersions.entityId, pageId)
        )
      )
      .orderBy(desc(contentVersions.versionNumber))
      .limit(1);
    
    const nextVersionNumber = existingVersions.length > 0 
      ? existingVersions[0].versionNumber + 1 
      : 1;
    
    // Use a default creator ID if none is provided - must be a valid user ID
    // First check if the user exists
    let createdById = userId;
    if (!createdById) {
      // Get the first available user - typically the admin user
      const adminUsers = await db
        .select({ id: users.id })
        .from(users)
        .limit(1);
      
      if (adminUsers.length > 0) {
        createdById = adminUsers[0].id;
      } else {
        // If no users exist, insert a system record (this shouldn't happen in practice)
        createdById = 1; // Default admin ID
      }
    }
    
    // Create the version record
    const [version] = await db
      .insert(contentVersions)
      .values({
        entityId: pageId,
        entityType: 'page' as VersionableEntityType,
        versionNumber: nextVersionNumber,
        status: nextVersionNumber === 1 ? 'published' : 'draft',
        changeType: changeType,
        changeDescription: description || `Page ${changeType === 'create' ? 'created' : 'updated'}`,
        snapshot: snapshot,
        createdBy: createdById,  // Valid user ID that exists in the database
      })
      .returning();
    
    return version;
  } catch (error) {
    console.error('Error creating page version:', error);
    return null;
  }
}

export const pageBuilderController = {
  // Check if page builder tables are initialized
  async checkStatus(req: Request, res: Response) {
    try {
      const tableExists = await checkIfTableExists('page_builder_pages');
      
      return res.status(200).json({
        initialized: tableExists,
        message: tableExists 
          ? "Page Builder tables are initialized" 
          : "Page Builder tables are not initialized"
      });
    } catch (error) {
      console.error("Error checking Page Builder status:", error);
      return res.status(500).json({
        initialized: false,
        message: `Failed to check Page Builder status: ${(error as Error).message}`
      });
    }
  },
  
  // Initialize the page builder database tables
  async initializeTables(req: Request, res: Response) {
    try {
      // Check if the tables already exist
      const tableExists = await checkIfTableExists('page_builder_pages');
      
      if (tableExists) {
        return res.status(200).json({
          message: "Page Builder tables already exist",
          alreadyInitialized: true
        });
      }
      
      // Run the migration script
      await migratePageBuilderTables();
      
      return res.status(200).json({
        message: "Page Builder tables initialized successfully",
        success: true
      });
    } catch (error) {
      console.error("Error initializing Page Builder tables:", error);
      return res.status(500).json({
        message: `Failed to initialize Page Builder tables: ${(error as Error).message}`,
        success: false
      });
    }
  },
  
  // Get all pages
  async getAllPages(req: Request, res: Response) {
    try {
      const pages = await db.select().from(pageBuilderPages).orderBy(desc(pageBuilderPages.updatedAt));
      
      return res.status(200).json({
        message: "Pages retrieved successfully",
        success: true,
        data: pages
      });
    } catch (error) {
      console.error("Error retrieving pages:", error);
      return res.status(500).json({
        message: `Failed to retrieve pages: ${(error as Error).message}`,
        success: false
      });
    }
  },
  
  // Get page by ID with its sections and components
  async getPageById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      // Get the page
      const [page] = await db
        .select()
        .from(pageBuilderPages)
        .where(eq(pageBuilderPages.id, parseInt(id)));
      
      if (!page) {
        return res.status(404).json({
          message: "Page not found",
          success: false
        });
      }
      
      // Get the page's sections
      const sections = await db
        .select()
        .from(pageBuilderSections)
        .where(eq(pageBuilderSections.pageId, page.id))
        .orderBy(pageBuilderSections.order);
      
      // Get components for each section
      const sectionsWithComponents = await Promise.all(
        sections.map(async (section) => {
          const components = await db
            .select()
            .from(pageBuilderComponents)
            .where(eq(pageBuilderComponents.sectionId, section.id))
            .orderBy(pageBuilderComponents.order);
          
          return {
            ...section,
            components
          };
        })
      );
      
      return res.status(200).json({
        message: "Page retrieved successfully",
        success: true,
        data: {
          ...page,
          sections: sectionsWithComponents
        }
      });
    } catch (error) {
      console.error("Error retrieving page:", error);
      return res.status(500).json({
        message: `Failed to retrieve page: ${(error as Error).message}`,
        success: false
      });
    }
  },
  
  // Create a new page
  async createPage(req: Request, res: Response) {
    try {
      const pageData = insertPageBuilderPageSchema.parse(req.body);
      
      // Make sure name (title) is set (provide a default if not)
      if (!pageData.name) {
        pageData.name = pageData.pageType === 'core' ? 'Core Page' : 'New Page';
      }
      
      // Check if slug is already in use
      const [existingPage] = await db
        .select()
        .from(pageBuilderPages)
        .where(
          and(
            eq(pageBuilderPages.slug, pageData.slug),
            eq(pageBuilderPages.tenantId, pageData.tenantId)
          )
        );
      
      if (existingPage) {
        return res.status(400).json({
          message: `A page with the URL path '/${pageData.slug}' already exists. Please choose a different URL path.`,
          success: false,
          errorCode: 'DUPLICATE_SLUG'
        });
      }
      
      // Create the page
      const [page] = await db
        .insert(pageBuilderPages)
        .values(pageData)
        .returning();
      
      // Create the initial version record
      const userId = req.user && 'id' in req.user ? (req.user.id as number) : undefined;
      
      // Include snapshot with complete page data
      const pageSnapshot = {
        ...page,
        name: page.name, // Ensure name field (title) is included in snapshot
        versionNumber: 1.0, // Explicitly include version number for v1.0
        status: 'published' // First version should be published by default
      };
      
      await createPageVersion(
        page.id,
        pageSnapshot,
        'create' as ChangeType,
        userId,
        'Initial page creation (v1.0)'
      );
      
      return res.status(201).json({
        message: "Page created successfully",
        success: true,
        data: page
      });
    } catch (error) {
      console.error("Error creating page:", error);
      return res.status(500).json({
        message: `Failed to create page: ${(error as Error).message}`,
        success: false
      });
    }
  },
  
  // Update a page
  async updatePage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const pageData = req.body;
      
      // Check if the page exists
      const [existingPage] = await db
        .select()
        .from(pageBuilderPages)
        .where(eq(pageBuilderPages.id, parseInt(id)));
      
      if (!existingPage) {
        return res.status(404).json({
          message: "Page not found",
          success: false
        });
      }
      
      // Make sure name (title) is preserved or updated, not deleted
      if (!pageData.name) {
        pageData.name = existingPage.name || 'Untitled Page';
      }
      
      // If updating slug, check if it's already in use by another page
      if (pageData.slug && pageData.slug !== existingPage.slug) {
        const [slugExists] = await db
          .select()
          .from(pageBuilderPages)
          .where(
            and(
              eq(pageBuilderPages.slug, pageData.slug),
              eq(pageBuilderPages.tenantId, existingPage.tenantId),
              sql`${pageBuilderPages.id} != ${parseInt(id)}`
            )
          );
        
        if (slugExists) {
          return res.status(400).json({
            message: `A page with the URL path '/${pageData.slug}' already exists. Please choose a different URL path.`,
            success: false,
            errorCode: 'DUPLICATE_SLUG'
          });
        }
      }
      
      // Update the page
      const [updatedPage] = await db
        .update(pageBuilderPages)
        .set({
          ...pageData,
          updatedAt: new Date()
        })
        .where(eq(pageBuilderPages.id, parseInt(id)))
        .returning();
      
      // Get latest version to determine next version number
      const [latestVersion] = await db
        .select({ versionNumber: contentVersions.versionNumber })
        .from(contentVersions)
        .where(
          and(
            eq(contentVersions.entityType, 'page'),
            eq(contentVersions.entityId, updatedPage.id)
          )
        )
        .orderBy(desc(contentVersions.versionNumber))
        .limit(1);
        
      const nextVersionNumber = latestVersion ? latestVersion.versionNumber + 0.1 : 1.0;
      
      // Create a new version record
      const userId = req.user && 'id' in req.user ? (req.user.id as number) : undefined;
      const changeType = req.body.changeType || 'update';
      const changeDescription = req.body.changeDescription || `Page updated (v${nextVersionNumber.toFixed(1)})`;
      
      // Include snapshot with complete page data
      const pageSnapshot = {
        ...updatedPage,
        name: updatedPage.name, // Ensure name (title) is included in snapshot
        versionNumber: nextVersionNumber,
      };
      
      await createPageVersion(
        updatedPage.id,
        pageSnapshot,
        changeType as ChangeType,
        userId,
        changeDescription
      );
      
      return res.status(200).json({
        message: "Page updated successfully",
        success: true,
        data: updatedPage
      });
    } catch (error) {
      console.error("Error updating page:", error);
      return res.status(500).json({
        message: `Failed to update page: ${(error as Error).message}`,
        success: false
      });
    }
  },
  
  // Delete a page
  async deletePage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      // Check if the page exists
      const [existingPage] = await db
        .select()
        .from(pageBuilderPages)
        .where(eq(pageBuilderPages.id, parseInt(id)));
      
      if (!existingPage) {
        return res.status(404).json({
          message: "Page not found",
          success: false
        });
      }
      
      // Delete the page (cascade will delete sections and components)
      await db
        .delete(pageBuilderPages)
        .where(eq(pageBuilderPages.id, parseInt(id)));
      
      return res.status(200).json({
        message: "Page deleted successfully",
        success: true
      });
    } catch (error) {
      console.error("Error deleting page:", error);
      return res.status(500).json({
        message: `Failed to delete page: ${(error as Error).message}`,
        success: false
      });
    }
  },
  
  // Get available templates
  async getTemplates(req: Request, res: Response) {
    try {
      const templates = await db
        .select()
        .from(pageBuilderTemplates)
        .orderBy(pageBuilderTemplates.name);
      
      return res.status(200).json({
        message: "Templates retrieved successfully",
        success: true,
        data: templates
      });
    } catch (error) {
      console.error("Error retrieving templates:", error);
      return res.status(500).json({
        message: `Failed to retrieve templates: ${(error as Error).message}`,
        success: false
      });
    }
  },
  
  // Clone a page (used for creating editable copies of locked pages)
  async clonePage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      // Get the source page with all its data
      const [sourcePage] = await db
        .select()
        .from(pageBuilderPages)
        .where(eq(pageBuilderPages.id, parseInt(id)));
      
      if (!sourcePage) {
        return res.status(404).json({
          message: "Source page not found",
          success: false
        });
      }
      
      // Get the page's sections
      const sections = await db
        .select()
        .from(pageBuilderSections)
        .where(eq(pageBuilderSections.pageId, sourcePage.id))
        .orderBy(pageBuilderSections.order);
      
      // Get components for each section
      const sectionsWithComponents = await Promise.all(
        sections.map(async (section) => {
          const components = await db
            .select()
            .from(pageBuilderComponents)
            .where(eq(pageBuilderComponents.sectionId, section.id))
            .orderBy(pageBuilderComponents.order);
          
          return {
            ...section,
            components
          };
        })
      );
      
      // Create a modified copy of the page's data
      const newPageData = {
        ...sourcePage,
        id: undefined, // Remove ID to create a new record
        name: `${sourcePage.name} (Copy)`,
        slug: `${sourcePage.slug}-copy`,
        isLocked: false, // Ensure the new page is not locked
        origin: 'builder', // Mark as builder-generated
        clonedFromId: sourcePage.id, // Reference the original page
        createdAt: undefined, // Let the database set these
        updatedAt: undefined,
        publishedAt: undefined,
        published: false, // Start as unpublished
      };
      
      // Check if the slug already exists and modify if needed
      let newSlug = newPageData.slug;
      let slugCounter = 1;
      
      while (true) {
        const [slugExists] = await db
          .select()
          .from(pageBuilderPages)
          .where(
            and(
              eq(pageBuilderPages.slug, newSlug),
              eq(pageBuilderPages.tenantId, sourcePage.tenantId)
            )
          );
        
        if (!slugExists) break;
        
        // Increment counter and try a new slug
        slugCounter++;
        newSlug = `${sourcePage.slug}-copy-${slugCounter}`;
      }
      
      newPageData.slug = newSlug;
      
      // Insert the new page
      const [newPage] = await db
        .insert(pageBuilderPages)
        .values(newPageData)
        .returning();
      
      // Clone sections and their components
      for (const section of sectionsWithComponents) {
        // Create new section
        const [newSection] = await db
          .insert(pageBuilderSections)
          .values({
            ...section,
            id: undefined,
            pageId: newPage.id,
            createdAt: undefined,
            updatedAt: undefined
          })
          .returning();
        
        // Clone components for this section
        if (section.components && section.components.length > 0) {
          for (const component of section.components) {
            await db
              .insert(pageBuilderComponents)
              .values({
                ...component,
                id: undefined,
                sectionId: newSection.id,
                createdAt: undefined,
                updatedAt: undefined
              });
          }
        }
      }
      
      // Create initial version for the cloned page
      const userId = req.user && 'id' in req.user ? (req.user.id as number) : undefined;
      
      const pageSnapshot = {
        ...newPage,
        sections: sectionsWithComponents.map(section => ({
          ...section,
          pageId: newPage.id,
          id: undefined // We don't know the new IDs yet
        })),
        clonedFrom: sourcePage.id,
        versionNumber: 1.0
      };
      
      await createPageVersion(
        newPage.id,
        pageSnapshot,
        'create' as ChangeType,
        userId,
        `Cloned from ${sourcePage.name} (ID: ${sourcePage.id})`
      );
      
      return res.status(200).json({
        message: "Page cloned successfully",
        success: true,
        data: newPage
      });
    } catch (error) {
      console.error("Error cloning page:", error);
      return res.status(500).json({
        message: `Failed to clone page: ${(error as Error).message}`,
        success: false
      });
    }
  },
  
  // Get tenant starter type
  async getTenantStarterType(req: Request, res: Response) {
    try {
      const { tenantId } = req.query;
      
      if (!tenantId) {
        return res.status(400).json({
          message: "Tenant ID is required",
          success: false
        });
      }
      
      // Get the tenant information
      const [tenant] = await db
        .select({
          id: tenants.id,
          name: tenants.name,
          starterType: tenants.starterType
        })
        .from(tenants)
        .where(eq(tenants.id, tenantId as string));
      
      if (!tenant) {
        return res.status(404).json({
          message: "Tenant not found",
          success: false
        });
      }
      
      return res.status(200).json({
        message: "Tenant starter type retrieved successfully",
        success: true,
        data: {
          tenantId: tenant.id,
          name: tenant.name,
          starterType: tenant.starterType || 'blank' // Default to blank if not set
        }
      });
    } catch (error) {
      console.error("Error retrieving tenant starter type:", error);
      return res.status(500).json({
        message: `Failed to retrieve tenant starter type: ${(error as Error).message}`,
        success: false
      });
    }
  },

  // Get SEO score for a page
  async getSeoScore(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          message: "Page ID is required",
          success: false
        });
      }
      
      const pageId = parseInt(id);
      
      // Check if page exists
      const [page] = await db
        .select()
        .from(pageBuilderPages)
        .where(eq(pageBuilderPages.id, pageId));
      
      if (!page) {
        return res.status(404).json({
          message: "Page not found",
          success: false
        });
      }
      
      // Get the SEO score
      const seoScore = await calculateSeoScore(pageId);
      
      return res.status(200).json({
        message: "SEO score calculated successfully",
        success: true,
        data: seoScore
      });
    } catch (error) {
      console.error("Error calculating SEO score:", error);
      return res.status(500).json({
        message: `Failed to calculate SEO score: ${(error as Error).message}`,
        success: false
      });
    }
  },
  
  // Generate SEO recommendations for a page
  async generateSeoRecommendations(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          message: "Page ID is required",
          success: false
        });
      }
      
      const pageId = parseInt(id);
      
      // Check if page exists
      const [page] = await db
        .select()
        .from(pageBuilderPages)
        .where(eq(pageBuilderPages.id, pageId));
      
      if (!page) {
        return res.status(404).json({
          message: "Page not found",
          success: false
        });
      }
      
      // Generate the recommendations
      const recommendations = await generateSeoRecommendations(pageId);
      
      return res.status(200).json({
        message: "SEO recommendations generated successfully",
        success: true,
        data: recommendations
      });
    } catch (error) {
      console.error("Error generating SEO recommendations:", error);
      return res.status(500).json({
        message: `Failed to generate SEO recommendations: ${(error as Error).message}`,
        success: false
      });
    }
  },
  
  // Get SEO recommendations for a page
  async getPageRecommendations(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          message: "Page ID is required",
          success: false
        });
      }
      
      const pageId = parseInt(id);
      
      // Check if page exists
      const [page] = await db
        .select()
        .from(pageBuilderPages)
        .where(eq(pageBuilderPages.id, pageId));
      
      if (!page) {
        return res.status(404).json({
          message: "Page not found",
          success: false
        });
      }
      
      // Get the recommendations
      const recommendations = await getPageRecommendations(pageId);
      
      return res.status(200).json({
        message: "SEO recommendations retrieved successfully",
        success: true,
        data: recommendations
      });
    } catch (error) {
      console.error("Error retrieving SEO recommendations:", error);
      return res.status(500).json({
        message: `Failed to retrieve SEO recommendations: ${(error as Error).message}`,
        success: false
      });
    }
  },
  
  // Apply a recommendation
  async applyRecommendation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          message: "Recommendation ID is required",
          success: false
        });
      }
      
      const recommendationId = parseInt(id);
      
      // Apply the recommendation
      const success = await applyRecommendation(recommendationId);
      
      if (!success) {
        return res.status(400).json({
          message: "Failed to apply recommendation",
          success: false
        });
      }
      
      return res.status(200).json({
        message: "Recommendation applied successfully",
        success: true
      });
    } catch (error) {
      console.error("Error applying recommendation:", error);
      return res.status(500).json({
        message: `Failed to apply recommendation: ${(error as Error).message}`,
        success: false
      });
    }
  },
  
  // Dismiss a recommendation
  async dismissRecommendation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          message: "Recommendation ID is required",
          success: false
        });
      }
      
      const recommendationId = parseInt(id);
      
      // Dismiss the recommendation
      const success = await dismissRecommendation(recommendationId);
      
      if (!success) {
        return res.status(400).json({
          message: "Failed to dismiss recommendation",
          success: false
        });
      }
      
      return res.status(200).json({
        message: "Recommendation dismissed successfully",
        success: true
      });
    } catch (error) {
      console.error("Error dismissing recommendation:", error);
      return res.status(500).json({
        message: `Failed to dismiss recommendation: ${(error as Error).message}`,
        success: false
      });
    }
  }
};