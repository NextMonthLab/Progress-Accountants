import { Request, Response } from "express";
import { db } from "../db";
import { 
  pageBuilderPages, 
  pageBuilderSections, 
  pageBuilderComponents,
  pageBuilderTemplates,
  pageBuilderComponentLibrary,
  pageBuilderRecommendations,
  pageBuilderVersionHistory,
  InsertPageBuilderPage,
  InsertPageBuilderSection,
  InsertPageBuilderComponent,
  InsertPageBuilderTemplate,
  InsertPageBuilderRecommendation,
  InsertPageBuilderVersionHistory
} from "@shared/schema";
import { eq, and, desc, asc, sql } from "drizzle-orm";
import { extractTenantId, getJwtPayload } from "../middleware/jwt";
import { PageMetadata, PageSeoMetadata } from "@shared/page_metadata";
import OpenAI from "openai";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Utility function to handle API errors
function handleError(res: Response, error: any, message: string) {
  console.error(`${message}:`, error);
  res.status(500).json({ 
    success: false, 
    message,
    error: error.message 
  });
}

// Get all pages for a tenant
export async function getPages(req: Request, res: Response) {
  try {
    const tenantId = extractTenantId(req);
    
    if (!tenantId) {
      return res.status(400).json({ success: false, message: "Tenant ID is required" });
    }
    
    const pages = await db.select().from(pageBuilderPages)
      .where(eq(pageBuilderPages.tenantId, tenantId));
    
    return res.status(200).json({ success: true, data: pages });
  } catch (error) {
    handleError(res, error, "Failed to retrieve pages");
  }
}

// Get a single page by ID with its sections and components
export async function getPage(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const tenantId = extractTenantId(req);
    
    if (!tenantId) {
      return res.status(400).json({ success: false, message: "Tenant ID is required" });
    }
    
    const page = await db.select().from(pageBuilderPages)
      .where(and(
        eq(pageBuilderPages.id, parseInt(id)),
        eq(pageBuilderPages.tenantId, tenantId)
      ));
    
    if (!page.length) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }
    
    // Get sections for this page
    const sections = await db.select().from(pageBuilderSections)
      .where(eq(pageBuilderSections.pageId, parseInt(id)))
      .orderBy(asc(pageBuilderSections.order));
    
    // Get components for each section
    const sectionIds = sections.map(section => section.id);
    
    const components = await db.select().from(pageBuilderComponents)
      .where(sql`${pageBuilderComponents.sectionId} IN (${sectionIds.length ? sectionIds : [0]})`)
      .orderBy(asc(pageBuilderComponents.order));
    
    // Organize components by section
    const sectionsWithComponents = sections.map(section => {
      const sectionComponents = components.filter(comp => comp.sectionId === section.id);
      return {
        ...section,
        components: sectionComponents
      };
    });
    
    return res.status(200).json({ 
      success: true, 
      data: {
        ...page[0],
        sections: sectionsWithComponents
      }
    });
  } catch (error) {
    handleError(res, error, "Failed to retrieve page");
  }
}

// Create a new page
export async function createPage(req: Request, res: Response) {
  try {
    const tenantId = extractTenantId(req);
    
    if (!tenantId) {
      return res.status(400).json({ success: false, message: "Tenant ID is required" });
    }
    
    const pageData = req.body as Omit<InsertPageBuilderPage, "id" | "createdAt" | "updatedAt">;
    
    // Validate basic requirements
    if (!pageData.title || !pageData.path) {
      return res.status(400).json({ 
        success: false, 
        message: "Title and path are required" 
      });
    }
    
    // Check if path already exists for this tenant
    const existingPage = await db.select({ id: pageBuilderPages.id }).from(pageBuilderPages)
      .where(and(
        eq(pageBuilderPages.path, pageData.path),
        eq(pageBuilderPages.tenantId, tenantId)
      ));
    
    if (existingPage.length) {
      return res.status(400).json({ 
        success: false, 
        message: "A page with this path already exists" 
      });
    }
    
    // Create the new page
    const [newPage] = await db.insert(pageBuilderPages).values({
      ...pageData,
      tenantId,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    return res.status(201).json({ success: true, data: newPage });
  } catch (error) {
    handleError(res, error, "Failed to create page");
  }
}

// Update an existing page
export async function updatePage(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const tenantId = extractTenantId(req);
    
    if (!tenantId) {
      return res.status(400).json({ success: false, message: "Tenant ID is required" });
    }
    
    const pageData = req.body;
    
    // Check if page exists and belongs to this tenant
    const existingPage = await db.select().from(pageBuilderPages)
      .where(and(
        eq(pageBuilderPages.id, parseInt(id)),
        eq(pageBuilderPages.tenantId, tenantId)
      ));
    
    if (!existingPage.length) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }
    
    // If path is being changed, check for duplicates
    if (pageData.path && pageData.path !== existingPage[0].path) {
      const duplicatePath = await db.select({ id: pageBuilderPages.id }).from(pageBuilderPages)
        .where(and(
          eq(pageBuilderPages.path, pageData.path),
          eq(pageBuilderPages.tenantId, tenantId),
          sql`${pageBuilderPages.id} != ${parseInt(id)}`
        ));
      
      if (duplicatePath.length) {
        return res.status(400).json({ 
          success: false, 
          message: "A page with this path already exists" 
        });
      }
    }
    
    // Update the page
    const [updatedPage] = await db.update(pageBuilderPages)
      .set({
        ...pageData,
        updatedAt: new Date()
      })
      .where(eq(pageBuilderPages.id, parseInt(id)))
      .returning();
    
    return res.status(200).json({ success: true, data: updatedPage });
  } catch (error) {
    handleError(res, error, "Failed to update page");
  }
}

// Delete a page and all its sections and components
export async function deletePage(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const tenantId = extractTenantId(req);
    
    if (!tenantId) {
      return res.status(400).json({ success: false, message: "Tenant ID is required" });
    }
    
    // Check if page exists and belongs to this tenant
    const existingPage = await db.select().from(pageBuilderPages)
      .where(and(
        eq(pageBuilderPages.id, parseInt(id)),
        eq(pageBuilderPages.tenantId, tenantId)
      ));
    
    if (!existingPage.length) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }
    
    // Get all sections for this page
    const sections = await db.select().from(pageBuilderSections)
      .where(eq(pageBuilderSections.pageId, parseInt(id)));
    
    const sectionIds = sections.map(section => section.id);
    
    // Delete components from each section
    if (sectionIds.length) {
      await db.delete(pageBuilderComponents)
        .where(sql`${pageBuilderComponents.sectionId} IN (${sectionIds})`);
    }
    
    // Delete sections
    await db.delete(pageBuilderSections)
      .where(eq(pageBuilderSections.pageId, parseInt(id)));
    
    // Delete page
    await db.delete(pageBuilderPages)
      .where(eq(pageBuilderPages.id, parseInt(id)));
    
    return res.status(200).json({ 
      success: true, 
      message: "Page and all its content deleted successfully" 
    });
  } catch (error) {
    handleError(res, error, "Failed to delete page");
  }
}

// Toggle page publish status
export async function togglePagePublishStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const tenantId = extractTenantId(req);
    
    if (!tenantId) {
      return res.status(400).json({ success: false, message: "Tenant ID is required" });
    }
    
    // Check if page exists and belongs to this tenant
    const existingPage = await db.select().from(pageBuilderPages)
      .where(and(
        eq(pageBuilderPages.id, parseInt(id)),
        eq(pageBuilderPages.tenantId, tenantId)
      ));
    
    if (!existingPage.length) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }
    
    const currentStatus = existingPage[0].isPublished;
    
    // Toggle publish status
    const [updatedPage] = await db.update(pageBuilderPages)
      .set({
        isPublished: !currentStatus,
        publishedAt: !currentStatus ? new Date() : existingPage[0].publishedAt,
        updatedAt: new Date()
      })
      .where(eq(pageBuilderPages.id, parseInt(id)))
      .returning();
    
    return res.status(200).json({ 
      success: true, 
      data: updatedPage,
      message: `Page ${updatedPage.isPublished ? 'published' : 'unpublished'} successfully`
    });
  } catch (error) {
    handleError(res, error, "Failed to update page publish status");
  }
}

// Add a section to a page
export async function addSection(req: Request, res: Response) {
  try {
    const { pageId } = req.params;
    const tenantId = extractTenantId(req);
    
    if (!tenantId) {
      return res.status(400).json({ success: false, message: "Tenant ID is required" });
    }
    
    const sectionData = req.body as Omit<InsertPageBuilderSection, "id" | "createdAt" | "updatedAt">;
    
    // Check if page exists and belongs to this tenant
    const existingPage = await db.select().from(pageBuilderPages)
      .where(and(
        eq(pageBuilderPages.id, parseInt(pageId)),
        eq(pageBuilderPages.tenantId, tenantId)
      ));
    
    if (!existingPage.length) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }
    
    // Find highest order to place new section at the end
    const highestOrderSection = await db.select()
      .from(pageBuilderSections)
      .where(eq(pageBuilderSections.pageId, parseInt(pageId)))
      .orderBy(desc(pageBuilderSections.order))
      .limit(1);
    
    const nextOrder = highestOrderSection.length ? (highestOrderSection[0].order || 0) + 1 : 0;
    
    // Create the new section
    const [newSection] = await db.insert(pageBuilderSections).values({
      ...sectionData,
      pageId: parseInt(pageId),
      order: nextOrder,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    return res.status(201).json({ success: true, data: newSection });
  } catch (error) {
    handleError(res, error, "Failed to add section");
  }
}

// Update a section
export async function updateSection(req: Request, res: Response) {
  try {
    const { sectionId } = req.params;
    const sectionData = req.body;
    
    // Check if section exists
    const existingSection = await db.select().from(pageBuilderSections)
      .where(eq(pageBuilderSections.id, parseInt(sectionId)));
    
    if (!existingSection.length) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }
    
    // Check if user has access to this page
    const page = await db.select().from(pageBuilderPages)
      .where(eq(pageBuilderPages.id, existingSection[0].pageId));
    
    if (!page.length) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }
    
    const tenantId = extractTenantId(req);
    
    if (!tenantId || tenantId !== page[0].tenantId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    
    // Update the section
    const [updatedSection] = await db.update(pageBuilderSections)
      .set({
        ...sectionData,
        updatedAt: new Date()
      })
      .where(eq(pageBuilderSections.id, parseInt(sectionId)))
      .returning();
    
    return res.status(200).json({ success: true, data: updatedSection });
  } catch (error) {
    handleError(res, error, "Failed to update section");
  }
}

// Delete a section
export async function deleteSection(req: Request, res: Response) {
  try {
    const { sectionId } = req.params;
    
    // Check if section exists
    const existingSection = await db.select().from(pageBuilderSections)
      .where(eq(pageBuilderSections.id, parseInt(sectionId)));
    
    if (!existingSection.length) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }
    
    // Check if user has access to this page
    const page = await db.select().from(pageBuilderPages)
      .where(eq(pageBuilderPages.id, existingSection[0].pageId));
    
    if (!page.length) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }
    
    const tenantId = extractTenantId(req);
    
    if (!tenantId || tenantId !== page[0].tenantId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    
    // Delete components in this section
    await db.delete(pageBuilderComponents)
      .where(eq(pageBuilderComponents.sectionId, parseInt(sectionId)));
    
    // Delete the section
    await db.delete(pageBuilderSections)
      .where(eq(pageBuilderSections.id, parseInt(sectionId)));
    
    // Reorder remaining sections
    const remainingSections = await db.select().from(pageBuilderSections)
      .where(eq(pageBuilderSections.pageId, existingSection[0].pageId))
      .orderBy(asc(pageBuilderSections.order));
    
    // Update order for remaining sections
    for (let i = 0; i < remainingSections.length; i++) {
      await db.update(pageBuilderSections)
        .set({ order: i })
        .where(eq(pageBuilderSections.id, remainingSections[i].id));
    }
    
    return res.status(200).json({ 
      success: true, 
      message: "Section and all its components deleted successfully" 
    });
  } catch (error) {
    handleError(res, error, "Failed to delete section");
  }
}

// Update section order
export async function updateSectionOrder(req: Request, res: Response) {
  try {
    const { pageId } = req.params;
    const { sectionOrder } = req.body;
    
    if (!Array.isArray(sectionOrder)) {
      return res.status(400).json({ success: false, message: "Section order must be an array" });
    }
    
    // Check if page exists and user has access
    const page = await db.select().from(pageBuilderPages)
      .where(eq(pageBuilderPages.id, parseInt(pageId)));
    
    if (!page.length) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }
    
    const tenantId = extractTenantId(req);
    
    if (!tenantId || tenantId !== page[0].tenantId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    
    // Update each section's order
    for (let i = 0; i < sectionOrder.length; i++) {
      await db.update(pageBuilderSections)
        .set({ order: i })
        .where(eq(pageBuilderSections.id, sectionOrder[i]));
    }
    
    // Get updated sections
    const updatedSections = await db.select().from(pageBuilderSections)
      .where(eq(pageBuilderSections.pageId, parseInt(pageId)))
      .orderBy(asc(pageBuilderSections.order));
    
    return res.status(200).json({ 
      success: true, 
      data: updatedSections,
      message: "Section order updated successfully" 
    });
  } catch (error) {
    handleError(res, error, "Failed to update section order");
  }
}

// Add a component to a section
export async function addComponent(req: Request, res: Response) {
  try {
    const { sectionId } = req.params;
    const componentData = req.body as Omit<InsertPageBuilderComponent, "id" | "createdAt" | "updatedAt">;
    
    // Check if section exists
    const existingSection = await db.select().from(pageBuilderSections)
      .where(eq(pageBuilderSections.id, parseInt(sectionId)));
    
    if (!existingSection.length) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }
    
    // Check if user has access to this page
    const page = await db.select().from(pageBuilderPages)
      .where(eq(pageBuilderPages.id, existingSection[0].pageId));
    
    if (!page.length) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }
    
    const tenantId = extractTenantId(req);
    
    if (!tenantId || tenantId !== page[0].tenantId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    
    // Find highest order to place new component at the end
    const highestOrderComponent = await db.select()
      .from(pageBuilderComponents)
      .where(eq(pageBuilderComponents.sectionId, parseInt(sectionId)))
      .orderBy(desc(pageBuilderComponents.order))
      .limit(1);
    
    const nextOrder = highestOrderComponent.length ? (highestOrderComponent[0].order || 0) + 1 : 0;
    
    // Create the new component
    const [newComponent] = await db.insert(pageBuilderComponents).values({
      ...componentData,
      sectionId: parseInt(sectionId),
      order: nextOrder,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    return res.status(201).json({ success: true, data: newComponent });
  } catch (error) {
    handleError(res, error, "Failed to add component");
  }
}

// Update a component
export async function updateComponent(req: Request, res: Response) {
  try {
    const { componentId } = req.params;
    const componentData = req.body;
    
    // Check if component exists
    const existingComponent = await db.select().from(pageBuilderComponents)
      .where(eq(pageBuilderComponents.id, parseInt(componentId)));
    
    if (!existingComponent.length) {
      return res.status(404).json({ success: false, message: "Component not found" });
    }
    
    // Check if user has access to this section/page
    const section = await db.select().from(pageBuilderSections)
      .where(eq(pageBuilderSections.id, existingComponent[0].sectionId));
    
    if (!section.length) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }
    
    const page = await db.select().from(pageBuilderPages)
      .where(eq(pageBuilderPages.id, section[0].pageId));
    
    if (!page.length) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }
    
    const tenantId = extractTenantId(req);
    
    if (!tenantId || tenantId !== page[0].tenantId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    
    // Update the component
    const [updatedComponent] = await db.update(pageBuilderComponents)
      .set({
        ...componentData,
        updatedAt: new Date()
      })
      .where(eq(pageBuilderComponents.id, parseInt(componentId)))
      .returning();
    
    return res.status(200).json({ success: true, data: updatedComponent });
  } catch (error) {
    handleError(res, error, "Failed to update component");
  }
}

// Delete a component
export async function deleteComponent(req: Request, res: Response) {
  try {
    const { componentId } = req.params;
    
    // Check if component exists
    const existingComponent = await db.select().from(pageBuilderComponents)
      .where(eq(pageBuilderComponents.id, parseInt(componentId)));
    
    if (!existingComponent.length) {
      return res.status(404).json({ success: false, message: "Component not found" });
    }
    
    // Check if user has access to this section/page
    const section = await db.select().from(pageBuilderSections)
      .where(eq(pageBuilderSections.id, existingComponent[0].sectionId));
    
    if (!section.length) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }
    
    const page = await db.select().from(pageBuilderPages)
      .where(eq(pageBuilderPages.id, section[0].pageId));
    
    if (!page.length) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }
    
    const tenantId = extractTenantId(req);
    
    if (!tenantId || tenantId !== page[0].tenantId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    
    // Delete the component
    await db.delete(pageBuilderComponents)
      .where(eq(pageBuilderComponents.id, parseInt(componentId)));
    
    // Reorder remaining components
    const remainingComponents = await db.select().from(pageBuilderComponents)
      .where(eq(pageBuilderComponents.sectionId, existingComponent[0].sectionId))
      .orderBy(asc(pageBuilderComponents.order));
    
    // Update order for remaining components
    for (let i = 0; i < remainingComponents.length; i++) {
      await db.update(pageBuilderComponents)
        .set({ order: i })
        .where(eq(pageBuilderComponents.id, remainingComponents[i].id));
    }
    
    return res.status(200).json({ 
      success: true, 
      message: "Component deleted successfully" 
    });
  } catch (error) {
    handleError(res, error, "Failed to delete component");
  }
}

// Update component order within a section
export async function updateComponentOrder(req: Request, res: Response) {
  try {
    const { sectionId } = req.params;
    const { componentOrder } = req.body;
    
    if (!Array.isArray(componentOrder)) {
      return res.status(400).json({ success: false, message: "Component order must be an array" });
    }
    
    // Check if section exists
    const section = await db.select().from(pageBuilderSections)
      .where(eq(pageBuilderSections.id, parseInt(sectionId)));
    
    if (!section.length) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }
    
    // Check if user has access to this page
    const page = await db.select().from(pageBuilderPages)
      .where(eq(pageBuilderPages.id, section[0].pageId));
    
    if (!page.length) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }
    
    const tenantId = extractTenantId(req);
    
    if (!tenantId || tenantId !== page[0].tenantId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    
    // Update each component's order
    for (let i = 0; i < componentOrder.length; i++) {
      await db.update(pageBuilderComponents)
        .set({ order: i })
        .where(eq(pageBuilderComponents.id, componentOrder[i]));
    }
    
    // Get updated components
    const updatedComponents = await db.select().from(pageBuilderComponents)
      .where(eq(pageBuilderComponents.sectionId, parseInt(sectionId)))
      .orderBy(asc(pageBuilderComponents.order));
    
    return res.status(200).json({ 
      success: true, 
      data: updatedComponents,
      message: "Component order updated successfully" 
    });
  } catch (error) {
    handleError(res, error, "Failed to update component order");
  }
}

// Get templates
export async function getTemplates(req: Request, res: Response) {
  try {
    const tenantId = extractTenantId(req);
    
    if (!tenantId) {
      return res.status(400).json({ success: false, message: "Tenant ID is required" });
    }
    
    // Get templates for this tenant and global templates
    const templates = await db.select().from(pageBuilderTemplates)
      .where(sql`${pageBuilderTemplates.tenantId} = ${tenantId} OR ${pageBuilderTemplates.isGlobal} = true`);
    
    return res.status(200).json({ success: true, data: templates });
  } catch (error) {
    handleError(res, error, "Failed to retrieve templates");
  }
}

// Get a single template
export async function getTemplate(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const tenantId = extractTenantId(req);
    
    if (!tenantId) {
      return res.status(400).json({ success: false, message: "Tenant ID is required" });
    }
    
    // Get template if it belongs to this tenant or is global
    const template = await db.select().from(pageBuilderTemplates)
      .where(and(
        eq(pageBuilderTemplates.id, parseInt(id)),
        sql`(${pageBuilderTemplates.tenantId} = ${tenantId} OR ${pageBuilderTemplates.isGlobal} = true)`
      ));
    
    if (!template.length) {
      return res.status(404).json({ success: false, message: "Template not found" });
    }
    
    return res.status(200).json({ success: true, data: template[0] });
  } catch (error) {
    handleError(res, error, "Failed to retrieve template");
  }
}

// Create a template
export async function createTemplate(req: Request, res: Response) {
  try {
    const tenantId = extractTenantId(req);
    
    if (!tenantId) {
      return res.status(400).json({ success: false, message: "Tenant ID is required" });
    }
    
    const templateData = req.body as Omit<InsertPageBuilderTemplate, "id" | "createdAt" | "updatedAt">;
    
    // Create the template
    const [newTemplate] = await db.insert(pageBuilderTemplates).values({
      ...templateData,
      tenantId,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    return res.status(201).json({ success: true, data: newTemplate });
  } catch (error) {
    handleError(res, error, "Failed to create template");
  }
}

// Save a page as a template
export async function savePageAsTemplate(req: Request, res: Response) {
  try {
    const { pageId } = req.params;
    const { name, description, tags, isGlobal } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, message: "Template name is required" });
    }
    
    const tenantId = extractTenantId(req);
    
    if (!tenantId) {
      return res.status(400).json({ success: false, message: "Tenant ID is required" });
    }
    
    // Check if page exists and belongs to this tenant
    const page = await db.select().from(pageBuilderPages)
      .where(and(
        eq(pageBuilderPages.id, parseInt(pageId)),
        eq(pageBuilderPages.tenantId, tenantId)
      ));
    
    if (!page.length) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }
    
    // Get sections for this page
    const sections = await db.select().from(pageBuilderSections)
      .where(eq(pageBuilderSections.pageId, parseInt(pageId)))
      .orderBy(asc(pageBuilderSections.order));
    
    // Get components for each section
    const sectionIds = sections.map(section => section.id);
    
    const components = await db.select().from(pageBuilderComponents)
      .where(sql`${pageBuilderComponents.sectionId} IN (${sectionIds.length ? sectionIds : [0]})`)
      .orderBy(asc(pageBuilderComponents.order));
    
    // Organize components by section
    const sectionsWithComponents = sections.map(section => {
      const sectionComponents = components.filter(comp => comp.sectionId === section.id);
      return {
        ...section,
        components: sectionComponents
      };
    });
    
    // Create template with page structure
    const [newTemplate] = await db.insert(pageBuilderTemplates).values({
      name,
      description: description || page[0].description || '',
      tags: tags || [],
      pageType: page[0].pageType,
      structure: {
        page: {
          title: page[0].title,
          description: page[0].description,
          pageType: page[0].pageType,
          seoSettings: page[0].seoSettings
        },
        sections: sectionsWithComponents
      },
      tenantId,
      isGlobal: isGlobal || false,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    return res.status(201).json({ 
      success: true, 
      data: newTemplate,
      message: "Page saved as template successfully"
    });
  } catch (error) {
    handleError(res, error, "Failed to save page as template");
  }
}

// Get component library
export async function getComponentLibrary(req: Request, res: Response) {
  try {
    const tenantId = extractTenantId(req);
    
    if (!tenantId) {
      return res.status(400).json({ success: false, message: "Tenant ID is required" });
    }
    
    // Get component library items for this tenant and global items
    const libraryItems = await db.select().from(pageBuilderComponentLibrary)
      .where(sql`${pageBuilderComponentLibrary.tenantId} = ${tenantId} OR ${pageBuilderComponentLibrary.isGlobal} = true`);
    
    return res.status(200).json({ success: true, data: libraryItems });
  } catch (error) {
    handleError(res, error, "Failed to retrieve component library");
  }
}

// Generate SEO and content recommendations for a page
export async function generateRecommendations(req: Request, res: Response) {
  try {
    const { pageId } = req.params;
    const tenantId = extractTenantId(req);
    
    if (!tenantId) {
      return res.status(400).json({ success: false, message: "Tenant ID is required" });
    }
    
    // Check if page exists and belongs to this tenant
    const page = await db.select().from(pageBuilderPages)
      .where(and(
        eq(pageBuilderPages.id, parseInt(pageId)),
        eq(pageBuilderPages.tenantId, tenantId)
      ));
    
    if (!page.length) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }
    
    // Get sections and components for this page
    const sections = await db.select().from(pageBuilderSections)
      .where(eq(pageBuilderSections.pageId, parseInt(pageId)))
      .orderBy(asc(pageBuilderSections.order));
    
    const sectionIds = sections.map(section => section.id);
    
    const components = await db.select().from(pageBuilderComponents)
      .where(sql`${pageBuilderComponents.sectionId} IN (${sectionIds.length ? sectionIds : [0]})`)
      .orderBy(asc(pageBuilderComponents.order));
    
    // Prepare page content for analysis
    const pageContext = {
      title: page[0].title,
      description: page[0].description,
      pageType: page[0].pageType,
      seoSettings: page[0].seoSettings,
      sections: sections.map(section => {
        const sectionComponents = components.filter(comp => comp.sectionId === section.id);
        return {
          name: section.name,
          type: section.type,
          components: sectionComponents.map(comp => ({
            type: comp.type,
            content: comp.content
          }))
        };
      })
    };
    
    // Extract existing text content for analysis
    let extractedText = `Page Title: ${page[0].title}\nDescription: ${page[0].description || 'None'}\n\n`;
    
    pageContext.sections.forEach(section => {
      extractedText += `Section: ${section.name}\n`;
      section.components.forEach(comp => {
        if (comp.content && typeof comp.content === 'object') {
          if (comp.content.text) {
            extractedText += `${comp.content.text}\n`;
          }
          if (comp.content.items && Array.isArray(comp.content.items)) {
            comp.content.items.forEach((item: any) => {
              if (typeof item === 'string') {
                extractedText += `- ${item}\n`;
              } else if (item && typeof item === 'object' && item.text) {
                extractedText += `- ${item.text}\n`;
              }
            });
          }
        }
      });
      extractedText += '\n';
    });
    
    // Get industry and purpose from SEO settings
    const industry = page[0].seoSettings?.industry || '';
    const purpose = page[0].seoSettings?.purpose || '';
    
    // Analyze content and generate recommendations
    const seoRecommendations = await generateSeoRecommendations(
      extractedText,
      page[0].title,
      page[0].description || '',
      page[0].seoSettings?.keywords || [],
      industry,
      purpose,
      page[0].pageType
    );
    
    // Save recommendations to database
    const recommendations: InsertPageBuilderRecommendation[] = seoRecommendations.map(rec => ({
      pageId: parseInt(pageId),
      type: rec.type,
      priority: rec.priority,
      recommendation: rec.recommendation,
      implementationHint: rec.implementationHint,
      originalValue: rec.originalValue,
      suggestedValue: rec.suggestedValue,
      isDismissed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    // Delete existing non-dismissed recommendations
    await db.delete(pageBuilderRecommendations)
      .where(and(
        eq(pageBuilderRecommendations.pageId, parseInt(pageId)),
        eq(pageBuilderRecommendations.isDismissed, false)
      ));
    
    // Insert new recommendations
    const savedRecommendations = [];
    for (const rec of recommendations) {
      const [saved] = await db.insert(pageBuilderRecommendations).values(rec).returning();
      savedRecommendations.push(saved);
    }
    
    return res.status(200).json({ 
      success: true, 
      data: savedRecommendations,
      message: `Generated ${savedRecommendations.length} recommendations`
    });
  } catch (error) {
    handleError(res, error, "Failed to generate recommendations");
  }
}

// Dismiss a recommendation
export async function dismissRecommendation(req: Request, res: Response) {
  try {
    const { recommendationId } = req.params;
    
    // Check if recommendation exists
    const recommendation = await db.select().from(pageBuilderRecommendations)
      .where(eq(pageBuilderRecommendations.id, parseInt(recommendationId)));
    
    if (!recommendation.length) {
      return res.status(404).json({ success: false, message: "Recommendation not found" });
    }
    
    // Check if user has access to this page
    const page = await db.select().from(pageBuilderPages)
      .where(eq(pageBuilderPages.id, recommendation[0].pageId));
    
    if (!page.length) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }
    
    const tenantId = extractTenantId(req);
    
    if (!tenantId || tenantId !== page[0].tenantId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    
    // Mark recommendation as dismissed
    const [updatedRecommendation] = await db.update(pageBuilderRecommendations)
      .set({
        isDismissed: true,
        updatedAt: new Date()
      })
      .where(eq(pageBuilderRecommendations.id, parseInt(recommendationId)))
      .returning();
    
    return res.status(200).json({ 
      success: true, 
      data: updatedRecommendation,
      message: "Recommendation dismissed successfully" 
    });
  } catch (error) {
    handleError(res, error, "Failed to dismiss recommendation");
  }
}

// Calculate SEO score for a page
export async function calculatePageSeoScore(req: Request, res: Response) {
  try {
    const { pageId } = req.params;
    const tenantId = extractTenantId(req);
    
    if (!tenantId) {
      return res.status(400).json({ success: false, message: "Tenant ID is required" });
    }
    
    // Check if page exists and belongs to this tenant
    const page = await db.select().from(pageBuilderPages)
      .where(and(
        eq(pageBuilderPages.id, parseInt(pageId)),
        eq(pageBuilderPages.tenantId, tenantId)
      ));
    
    if (!page.length) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }
    
    // Get sections and components for this page
    const sections = await db.select().from(pageBuilderSections)
      .where(eq(pageBuilderSections.pageId, parseInt(pageId)))
      .orderBy(asc(pageBuilderSections.order));
    
    const sectionIds = sections.map(section => section.id);
    
    const components = await db.select().from(pageBuilderComponents)
      .where(sql`${pageBuilderComponents.sectionId} IN (${sectionIds.length ? sectionIds : [0]})`)
      .orderBy(asc(pageBuilderComponents.order));
    
    // Prepare page content for analysis
    const pageContent = {
      title: page[0].title,
      description: page[0].description,
      seoSettings: page[0].seoSettings,
      sections: sections.map(section => {
        const sectionComponents = components.filter(comp => comp.sectionId === section.id);
        return {
          name: section.name,
          type: section.type,
          components: sectionComponents.map(comp => ({
            type: comp.type,
            content: comp.content
          }))
        };
      })
    };
    
    // Calculate SEO score
    const seoScore = calculateSeoScore(pageContent);
    
    // Update page with SEO score
    await db.update(pageBuilderPages)
      .set({ seoScore: seoScore.overallScore })
      .where(eq(pageBuilderPages.id, parseInt(pageId)));
    
    return res.status(200).json({
      success: true,
      data: seoScore
    });
  } catch (error) {
    handleError(res, error, "Failed to calculate SEO score");
  }
}

// OpenAI helper for generating SEO recommendations
async function generateSeoRecommendations(
  pageContent: string,
  title: string,
  description: string,
  keywords: string[],
  industry: string,
  purpose: string,
  pageType: string
): Promise<any[]> {
  try {
    // Check if we have an API key
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not set");
      return [
        {
          type: "error",
          priority: "high",
          recommendation: "OpenAI API key is not configured. Please set up your API key to get SEO recommendations.",
          implementationHint: "Add your OpenAI API key to the environment variables.",
          originalValue: "",
          suggestedValue: ""
        }
      ];
    }
    
    const prompt = `
      As an SEO expert, analyze the following page content for a ${industry} business website.
      The page purpose is: ${purpose}.
      The page type is: ${pageType}.
      
      Current title: "${title}"
      Current description: "${description}"
      Current keywords: ${keywords.join(", ")}
      
      Page content:
      ${pageContent}
      
      Provide detailed SEO recommendations in this JSON format:
      [{
        "type": "title"|"description"|"keywords"|"content"|"headings"|"images"|"structure",
        "priority": "high"|"medium"|"low",
        "recommendation": "<clear explanation of the recommendation>",
        "implementationHint": "<specific advice on how to implement>",
        "originalValue": "<current value if applicable>",
        "suggestedValue": "<suggested improved value>"
      }]
      
      Focus on:
      1. Title optimization (length, keywords, clarity)
      2. Meta description improvements
      3. Primary and secondary keyword usage and density
      4. Content structure and readability
      5. Heading hierarchy (H1, H2, etc.)
      6. Image alt text if images are mentioned
      7. Internal linking opportunities
      
      Provide 3-6 actionable recommendations in the exact JSON format specified.
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an SEO optimization expert analyzing web page content." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });
    
    const content = response.choices[0].message.content;
    if (!content) {
      return [];
    }
    
    try {
      const parsedResponse = JSON.parse(content);
      return Array.isArray(parsedResponse) ? parsedResponse : (parsedResponse.recommendations || []);
    } catch (error) {
      console.error("Error parsing OpenAI response:", error);
      return [];
    }
  } catch (error) {
    console.error("Error generating SEO recommendations:", error);
    return [{
      type: "error",
      priority: "high",
      recommendation: "Failed to generate SEO recommendations. Please try again later.",
      implementationHint: "Check your OpenAI API key and network connection.",
      originalValue: "",
      suggestedValue: ""
    }];
  }
}

// Calculate SEO score for a page
function calculateSeoScore(pageContent: any): { 
  overallScore: number;
  categoryScores: Record<string, number>;
  analysis: Record<string, string>;
} {
  const results = {
    overallScore: 0,
    categoryScores: {
      title: 0,
      description: 0,
      keywords: 0,
      content: 0,
      structure: 0,
      images: 0,
      performance: 0
    },
    analysis: {
      title: "",
      description: "",
      keywords: "",
      content: "",
      structure: "",
      images: "",
      performance: ""
    }
  };
  
  // Check title
  let titleScore = 0;
  let titleAnalysis = [];
  
  if (!pageContent.title) {
    titleAnalysis.push("Missing page title.");
  } else {
    const titleLength = pageContent.title.length;
    
    if (titleLength < 10) {
      titleAnalysis.push("Title is too short (< 10 characters).");
    } else if (titleLength >= 10 && titleLength <= 30) {
      titleScore += 5;
      titleAnalysis.push("Title length is good (10-30 characters).");
    } else if (titleLength > 30 && titleLength <= 60) {
      titleScore += 10;
      titleAnalysis.push("Title length is optimal (31-60 characters).");
    } else {
      titleScore += 5;
      titleAnalysis.push("Title is too long (> 60 characters).");
    }
    
    // Check for primary keyword in title
    if (pageContent.seoSettings?.primaryKeyword && 
        pageContent.title.toLowerCase().includes(pageContent.seoSettings.primaryKeyword.toLowerCase())) {
      titleScore += 10;
      titleAnalysis.push("Title contains primary keyword.");
    } else if (pageContent.seoSettings?.primaryKeyword) {
      titleAnalysis.push("Title does not contain primary keyword.");
    }
  }
  
  results.categoryScores.title = Math.min(titleScore, 20);
  results.analysis.title = titleAnalysis.join(" ");
  
  // Check description
  let descriptionScore = 0;
  let descriptionAnalysis = [];
  
  if (!pageContent.description) {
    descriptionAnalysis.push("Missing page description.");
  } else {
    const descriptionLength = pageContent.description.length;
    
    if (descriptionLength < 50) {
      descriptionAnalysis.push("Description is too short (< 50 characters).");
    } else if (descriptionLength >= 50 && descriptionLength <= 120) {
      descriptionScore += 5;
      descriptionAnalysis.push("Description length is good (50-120 characters).");
    } else if (descriptionLength > 120 && descriptionLength <= 160) {
      descriptionScore += 10;
      descriptionAnalysis.push("Description length is optimal (121-160 characters).");
    } else {
      descriptionScore += 5;
      descriptionAnalysis.push("Description is too long (> 160 characters).");
    }
    
    // Check for primary keyword in description
    if (pageContent.seoSettings?.primaryKeyword && 
        pageContent.description.toLowerCase().includes(pageContent.seoSettings.primaryKeyword.toLowerCase())) {
      descriptionScore += 5;
      descriptionAnalysis.push("Description contains primary keyword.");
    } else if (pageContent.seoSettings?.primaryKeyword) {
      descriptionAnalysis.push("Description does not contain primary keyword.");
    }
    
    // Check for call to action
    const ctaPatterns = [
      /learn more/i, /discover/i, /find out/i, /contact us/i, /call now/i, 
      /get started/i, /sign up/i, /try/i, /schedule/i, /book/i, /explore/i
    ];
    
    if (ctaPatterns.some(pattern => pattern.test(pageContent.description))) {
      descriptionScore += 5;
      descriptionAnalysis.push("Description contains a call to action.");
    }
  }
  
  results.categoryScores.description = Math.min(descriptionScore, 20);
  results.analysis.description = descriptionAnalysis.join(" ");
  
  // Check keywords
  let keywordScore = 0;
  let keywordAnalysis = [];
  
  if (!pageContent.seoSettings?.keywords || pageContent.seoSettings.keywords.length === 0) {
    keywordAnalysis.push("No keywords defined.");
  } else {
    if (pageContent.seoSettings.keywords.length >= 3 && pageContent.seoSettings.keywords.length <= 10) {
      keywordScore += 10;
      keywordAnalysis.push(`Good number of keywords (${pageContent.seoSettings.keywords.length}).`);
    } else if (pageContent.seoSettings.keywords.length > 10) {
      keywordScore += 5;
      keywordAnalysis.push("Too many keywords may dilute focus.");
    } else {
      keywordAnalysis.push("Consider adding more keywords (at least 3).");
    }
    
    if (pageContent.seoSettings.primaryKeyword) {
      keywordScore += 5;
      keywordAnalysis.push("Primary keyword is defined.");
    } else {
      keywordAnalysis.push("No primary keyword defined.");
    }
  }
  
  results.categoryScores.keywords = Math.min(keywordScore, 15);
  results.analysis.keywords = keywordAnalysis.join(" ");
  
  // Check content
  let contentScore = 0;
  let contentAnalysis = [];
  let contentText = "";
  let headingsCount = 0;
  let imagesCount = 0;
  let imageWithAltCount = 0;
  
  pageContent.sections.forEach((section: any) => {
    section.components.forEach((component: any) => {
      if (component.type === 'heading' && component.content?.text) {
        headingsCount++;
        contentText += component.content.text + " ";
      } else if (component.type === 'paragraph' && component.content?.text) {
        contentText += component.content.text + " ";
      } else if (component.type === 'list' && component.content?.items) {
        component.content.items.forEach((item: any) => {
          if (typeof item === 'string') {
            contentText += item + " ";
          } else if (item?.text) {
            contentText += item.text + " ";
          }
        });
      } else if (component.type === 'image') {
        imagesCount++;
        if (component.content?.alt) {
          imageWithAltCount++;
        }
      }
    });
  });
  
  const wordCount = contentText.split(/\s+/).filter(Boolean).length;
  
  if (wordCount < 300) {
    contentAnalysis.push("Content is too short (< 300 words).");
  } else if (wordCount >= 300 && wordCount < 600) {
    contentScore += 5;
    contentAnalysis.push("Content length is acceptable (300-599 words).");
  } else if (wordCount >= 600 && wordCount < 1200) {
    contentScore += 10;
    contentAnalysis.push("Content length is good (600-1199 words).");
  } else {
    contentScore += 15;
    contentAnalysis.push("Content length is excellent (1200+ words).");
  }
  
  // Check keyword usage in content
  if (pageContent.seoSettings?.primaryKeyword) {
    const primaryKeyword = pageContent.seoSettings.primaryKeyword.toLowerCase();
    const primaryKeywordCount = (contentText.toLowerCase().match(new RegExp(primaryKeyword, 'g')) || []).length;
    const keywordDensity = primaryKeywordCount / wordCount * 100;
    
    if (keywordDensity > 0 && keywordDensity <= 2.5) {
      contentScore += 10;
      contentAnalysis.push(`Good primary keyword density (${keywordDensity.toFixed(1)}%).`);
    } else if (keywordDensity > 2.5) {
      contentScore += 5;
      contentAnalysis.push(`Primary keyword may be overused (${keywordDensity.toFixed(1)}%).`);
    } else {
      contentAnalysis.push("Primary keyword not found in content.");
    }
  }
  
  results.categoryScores.content = Math.min(contentScore, 25);
  results.analysis.content = contentAnalysis.join(" ");
  
  // Check structure
  let structureScore = 0;
  let structureAnalysis = [];
  
  if (headingsCount === 0) {
    structureAnalysis.push("No headings found in content.");
  } else {
    structureScore += 5;
    structureAnalysis.push(`${headingsCount} headings found in content.`);
  }
  
  // Assume a good structure has at least 3 sections
  if (pageContent.sections.length < 3) {
    structureAnalysis.push("Consider adding more sections to improve structure.");
  } else {
    structureScore += 5;
    structureAnalysis.push(`Good number of sections (${pageContent.sections.length}).`);
  }
  
  results.categoryScores.structure = Math.min(structureScore, 10);
  results.analysis.structure = structureAnalysis.join(" ");
  
  // Check images
  let imageScore = 0;
  let imageAnalysis = [];
  
  if (imagesCount === 0) {
    imageAnalysis.push("No images found in content.");
  } else {
    imageScore += 5;
    imageAnalysis.push(`${imagesCount} images found in content.`);
    
    if (imageWithAltCount === imagesCount) {
      imageScore += 5;
      imageAnalysis.push("All images have alt text.");
    } else if (imageWithAltCount > 0) {
      imageScore += 3;
      imageAnalysis.push(`${imageWithAltCount} out of ${imagesCount} images have alt text.`);
    } else {
      imageAnalysis.push("No images have alt text.");
    }
  }
  
  results.categoryScores.images = Math.min(imageScore, 10);
  results.analysis.images = imageAnalysis.join(" ");
  
  // Sum up all scores
  const totalPossibleScore = 100;
  const actualScore = 
    results.categoryScores.title + 
    results.categoryScores.description + 
    results.categoryScores.keywords + 
    results.categoryScores.content + 
    results.categoryScores.structure + 
    results.categoryScores.images;
  
  results.overallScore = Math.min(Math.round(actualScore), totalPossibleScore);
  
  return results;
}