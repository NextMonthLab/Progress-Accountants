import { Request, Response } from "express";
import { db } from "../db";
import { migratePageBuilderTables } from "../db-migrate-page-builder";
import { sql } from "drizzle-orm";
import { 
  pageBuilderPages, 
  pageBuilderSections,
  pageBuilderComponents,
  pageBuilderTemplates,
  insertPageBuilderPageSchema,
  insertPageBuilderSectionSchema,
  insertPageBuilderComponentSchema,
} from "../../shared/schema";
import { desc, eq, and } from "drizzle-orm";

export const pageBuilderController = {
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

// Helper function to check if a table exists
async function checkIfTableExists(tableName: string): Promise<boolean> {
  const result = await db.execute(sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_name = ${tableName}
    );
  `);
  
  return result.rows[0] && result.rows[0].exists === true;
}