import { Request, Response } from "express";
import { db } from "../db";
import { migratePageBuilderTables } from "../db-migrate-page-builder";
import { sql } from "drizzle-orm";
import { 
  pageBuilderPages, 
  pageBuilderSections,
  pageBuilderComponents,
  pageBuilderTemplates,
  contentVersions,
  insertPageBuilderPageSchema,
  insertPageBuilderSectionSchema,
  insertPageBuilderComponentSchema,
} from "../../shared/schema";
import { desc, eq, and } from "drizzle-orm";
import { VersionableEntityType, ChangeType } from "@shared/version_control";

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
      
      // Make sure title is set (provide a default if not)
      if (!pageData.title) {
        pageData.title = pageData.pageType === 'core' ? 'Core Page' : 'New Page';
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
          message: "A page with this slug already exists",
          success: false
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
        title: page.title, // Ensure title is included in snapshot
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
      
      // Make sure title is preserved or updated, not deleted
      if (!pageData.title) {
        pageData.title = existingPage.title || 'Untitled Page';
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
            message: "A page with this slug already exists",
            success: false
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
        title: updatedPage.title, // Ensure title is included in snapshot
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
  }
};

// NOTE: This function is already defined above. Removing duplicate definition.