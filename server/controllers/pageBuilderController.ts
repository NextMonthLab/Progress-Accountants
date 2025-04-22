import { Request, Response } from 'express';
import { db } from '../db';
import { 
  pageBuilderPages, 
  pageBuilderSections, 
  pageBuilderComponents, 
  pageBuilderTemplates,
  pageBuilderRecommendations,
  pageBuilderVersionHistory,
  pageBuilderComponentLibrary,
  InsertPageBuilderPage,
  InsertPageBuilderSection,
  InsertPageBuilderComponent,
  PageBuilderComponent,
  PageBuilderSection
} from '../../shared/schema';
import { PageMetadata, PageSeoMetadata, ComplexityLevel } from '../../shared/page_metadata';
import { eq, and, desc, asc, inArray, like, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { extractTenantId, getJwtPayload } from '../middleware/jwt';

// Page Builder API - Main functions

/**
 * Get all pages for a tenant with optional filtering
 */
export const getPages = async (req: Request, res: Response) => {
  try {
    const tenantId = extractTenantId(req);
    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID is required' });
    }

    const { status, pageType, search } = req.query;
    
    let query = db.select().from(pageBuilderPages)
      .where(eq(pageBuilderPages.tenantId, tenantId));
    
    if (status) {
      query = query.where(eq(pageBuilderPages.status, status as string));
    }
    
    if (pageType) {
      query = query.where(eq(pageBuilderPages.pageType, pageType as string));
    }
    
    if (search) {
      query = query.where(
        sql`${pageBuilderPages.name} ILIKE ${'%' + search + '%'} OR ${pageBuilderPages.description} ILIKE ${'%' + search + '%'}`
      );
    }
    
    const pages = await query.orderBy(desc(pageBuilderPages.updatedAt));
    res.status(200).json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
};

/**
 * Get a specific page with its sections and components
 */
export const getPage = async (req: Request, res: Response) => {
  try {
    const tenantId = extractTenantId(req);
    const { id } = req.params;
    
    // Get page
    const [page] = await db.select().from(pageBuilderPages)
      .where(and(
        eq(pageBuilderPages.id, parseInt(id)),
        eq(pageBuilderPages.tenantId, tenantId)
      ));
    
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    // Get sections for the page
    const sections = await db.select().from(pageBuilderSections)
      .where(eq(pageBuilderSections.pageId, parseInt(id)))
      .orderBy(asc(pageBuilderSections.order));
    
    // Get components for each section
    const sectionIds = sections.map(section => section.id);
    const components = sectionIds.length > 0 
      ? await db.select().from(pageBuilderComponents)
          .where(inArray(pageBuilderComponents.sectionId, sectionIds))
          .orderBy(asc(pageBuilderComponents.order))
      : [];
    
    // Group components by section
    const sectionsWithComponents = sections.map(section => ({
      ...section,
      components: components.filter(component => component.sectionId === section.id)
    }));
    
    // Get recommendations for the page
    const recommendations = await db.select().from(pageBuilderRecommendations)
      .where(and(
        eq(pageBuilderRecommendations.pageId, parseInt(id)),
        eq(pageBuilderRecommendations.dismissed, false)
      ));
    
    const result = {
      ...page,
      sections: sectionsWithComponents,
      recommendations
    };
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching page details:', error);
    res.status(500).json({ error: 'Failed to fetch page details' });
  }
};

/**
 * Create a new page
 */
export const createPage = async (req: Request, res: Response) => {
  try {
    const tenantId = extractTenantId(req);
    const userId = getJwtPayload(req)?.userId;
    
    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID is required' });
    }
    
    const pageData: InsertPageBuilderPage = {
      ...req.body,
      tenantId,
      createdBy: userId,
      lastEditedBy: userId,
      // Initialize SEO performance object
      seo: {
        ...req.body.seo,
        performance: {
          score: calculateInitialSeoScore(req.body.metadata, req.body.seo),
          suggestions: generateSeoSuggestions(req.body.metadata, req.body.seo),
          keywordDensity: {},
          readabilityScore: 0,
          mobileOptimized: true
        }
      }
    };
    
    const [page] = await db.insert(pageBuilderPages).values(pageData).returning();
    
    // If template was provided, initialize with template sections
    if (req.body.template) {
      await initializeFromTemplate(page.id, req.body.template);
    } else {
      // Create a default empty section
      const defaultSection: InsertPageBuilderSection = {
        pageId: page.id,
        name: "Main Content",
        description: "Primary content section",
        order: 0,
        settings: {
          padding: { top: 40, right: 40, bottom: 40, left: 40 },
          fullWidth: false
        },
        seoWeight: 10
      };
      
      await db.insert(pageBuilderSections).values(defaultSection);
    }
    
    // Create initial version history entry
    const versionHistoryEntry = {
      pageId: page.id,
      version: 1,
      snapshot: page,
      changedBy: userId,
      changeDescription: "Initial page creation"
    };
    
    await db.insert(pageBuilderVersionHistory).values(versionHistoryEntry);
    
    res.status(201).json(page);
  } catch (error) {
    console.error('Error creating page:', error);
    res.status(500).json({ error: 'Failed to create page' });
  }
};

/**
 * Update an existing page
 */
export const updatePage = async (req: Request, res: Response) => {
  try {
    const tenantId = extractTenantId(req);
    const userId = getJwtPayload(req)?.userId;
    const { id } = req.params;
    
    // Get current page
    const [existingPage] = await db.select().from(pageBuilderPages)
      .where(and(
        eq(pageBuilderPages.id, parseInt(id)),
        eq(pageBuilderPages.tenantId, tenantId)
      ));
    
    if (!existingPage) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    // Update SEO performance metrics
    const seo = {
      ...req.body.seo,
      performance: {
        score: calculateSeoScore(req.body.metadata, req.body.seo, req.body.sections || []),
        suggestions: generateSeoSuggestions(req.body.metadata, req.body.seo),
        keywordDensity: calculateKeywordDensity(req.body.sections || []),
        readabilityScore: calculateReadabilityScore(req.body.sections || []),
        mobileOptimized: checkMobileOptimization(req.body.sections || [])
      }
    };
    
    // Update page
    const updateData = {
      ...req.body,
      seo,
      lastEditedBy: userId,
      updatedAt: new Date()
    };
    
    const [updatedPage] = await db.update(pageBuilderPages)
      .set(updateData)
      .where(and(
        eq(pageBuilderPages.id, parseInt(id)),
        eq(pageBuilderPages.tenantId, tenantId)
      ))
      .returning();
    
    // Create version history entry
    const versionHistoryEntry = {
      pageId: parseInt(id),
      version: existingPage.version + 1,
      snapshot: updatedPage,
      changedBy: userId,
      changeDescription: req.body.changeDescription || "Page updated"
    };
    
    await db.insert(pageBuilderVersionHistory).values(versionHistoryEntry);
    
    // Update page version number
    await db.update(pageBuilderPages)
      .set({ version: existingPage.version + 1 })
      .where(eq(pageBuilderPages.id, parseInt(id)));
    
    res.status(200).json(updatedPage);
  } catch (error) {
    console.error('Error updating page:', error);
    res.status(500).json({ error: 'Failed to update page' });
  }
};

/**
 * Delete a page
 */
export const deletePage = async (req: Request, res: Response) => {
  try {
    const tenantId = extractTenantId(req);
    const { id } = req.params;
    
    // Get sections for the page
    const sections = await db.select().from(pageBuilderSections)
      .where(eq(pageBuilderSections.pageId, parseInt(id)));
    
    const sectionIds = sections.map(section => section.id);
    
    // Delete components first (maintain referential integrity)
    if (sectionIds.length > 0) {
      await db.delete(pageBuilderComponents)
        .where(inArray(pageBuilderComponents.sectionId, sectionIds));
    }
    
    // Delete sections
    await db.delete(pageBuilderSections)
      .where(eq(pageBuilderSections.pageId, parseInt(id)));
    
    // Delete recommendations
    await db.delete(pageBuilderRecommendations)
      .where(eq(pageBuilderRecommendations.pageId, parseInt(id)));
    
    // Delete version history
    await db.delete(pageBuilderVersionHistory)
      .where(eq(pageBuilderVersionHistory.pageId, parseInt(id)));
    
    // Delete page
    const [deletedPage] = await db.delete(pageBuilderPages)
      .where(and(
        eq(pageBuilderPages.id, parseInt(id)),
        eq(pageBuilderPages.tenantId, tenantId)
      ))
      .returning();
    
    if (!deletedPage) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    res.status(200).json({ message: 'Page deleted successfully' });
  } catch (error) {
    console.error('Error deleting page:', error);
    res.status(500).json({ error: 'Failed to delete page' });
  }
};

/**
 * Publish or unpublish a page
 */
export const togglePagePublishStatus = async (req: Request, res: Response) => {
  try {
    const tenantId = extractTenantId(req);
    const { id } = req.params;
    const { published } = req.body;
    
    const updateData = {
      published,
      publishedAt: published ? new Date() : null,
      updatedAt: new Date()
    };
    
    const [updatedPage] = await db.update(pageBuilderPages)
      .set(updateData)
      .where(and(
        eq(pageBuilderPages.id, parseInt(id)),
        eq(pageBuilderPages.tenantId, tenantId)
      ))
      .returning();
    
    if (!updatedPage) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    res.status(200).json(updatedPage);
  } catch (error) {
    console.error('Error toggling page publish status:', error);
    res.status(500).json({ error: 'Failed to update page publish status' });
  }
};

// Section Management

/**
 * Add a section to a page
 */
export const addSection = async (req: Request, res: Response) => {
  try {
    const tenantId = extractTenantId(req);
    const { pageId } = req.params;
    
    // Verify page ownership
    const [page] = await db.select().from(pageBuilderPages)
      .where(and(
        eq(pageBuilderPages.id, parseInt(pageId)),
        eq(pageBuilderPages.tenantId, tenantId)
      ));
    
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    // Get highest current order
    const [highestOrderSection] = await db.select()
      .from(pageBuilderSections)
      .where(eq(pageBuilderSections.pageId, parseInt(pageId)))
      .orderBy(desc(pageBuilderSections.order))
      .limit(1);
    
    const newOrder = highestOrderSection ? highestOrderSection.order + 1 : 0;
    
    const sectionData: InsertPageBuilderSection = {
      ...req.body,
      pageId: parseInt(pageId),
      order: newOrder
    };
    
    const [section] = await db.insert(pageBuilderSections).values(sectionData).returning();
    
    res.status(201).json(section);
  } catch (error) {
    console.error('Error adding section:', error);
    res.status(500).json({ error: 'Failed to add section' });
  }
};

/**
 * Update a section
 */
export const updateSection = async (req: Request, res: Response) => {
  try {
    const tenantId = extractTenantId(req);
    const { sectionId } = req.params;
    
    // Get section first to verify page ownership
    const [section] = await db.select().from(pageBuilderSections)
      .where(eq(pageBuilderSections.id, parseInt(sectionId)));
    
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }
    
    // Verify page ownership
    const [page] = await db.select().from(pageBuilderPages)
      .where(and(
        eq(pageBuilderPages.id, section.pageId),
        eq(pageBuilderPages.tenantId, tenantId)
      ));
    
    if (!page) {
      return res.status(403).json({ error: 'Not authorized to modify this section' });
    }
    
    // Update section
    const [updatedSection] = await db.update(pageBuilderSections)
      .set({
        ...req.body,
        updatedAt: new Date()
      })
      .where(eq(pageBuilderSections.id, parseInt(sectionId)))
      .returning();
    
    res.status(200).json(updatedSection);
  } catch (error) {
    console.error('Error updating section:', error);
    res.status(500).json({ error: 'Failed to update section' });
  }
};

/**
 * Delete a section
 */
export const deleteSection = async (req: Request, res: Response) => {
  try {
    const tenantId = extractTenantId(req);
    const { sectionId } = req.params;
    
    // Get section first to verify page ownership
    const [section] = await db.select().from(pageBuilderSections)
      .where(eq(pageBuilderSections.id, parseInt(sectionId)));
    
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }
    
    // Verify page ownership
    const [page] = await db.select().from(pageBuilderPages)
      .where(and(
        eq(pageBuilderPages.id, section.pageId),
        eq(pageBuilderPages.tenantId, tenantId)
      ));
    
    if (!page) {
      return res.status(403).json({ error: 'Not authorized to delete this section' });
    }
    
    // Delete all components in the section
    await db.delete(pageBuilderComponents)
      .where(eq(pageBuilderComponents.sectionId, parseInt(sectionId)));
    
    // Delete section
    await db.delete(pageBuilderSections)
      .where(eq(pageBuilderSections.id, parseInt(sectionId)));
    
    res.status(200).json({ message: 'Section deleted successfully' });
  } catch (error) {
    console.error('Error deleting section:', error);
    res.status(500).json({ error: 'Failed to delete section' });
  }
};

/**
 * Update section order
 */
export const updateSectionOrder = async (req: Request, res: Response) => {
  try {
    const tenantId = extractTenantId(req);
    const { pageId } = req.params;
    const { sectionIds } = req.body;
    
    // Verify page ownership
    const [page] = await db.select().from(pageBuilderPages)
      .where(and(
        eq(pageBuilderPages.id, parseInt(pageId)),
        eq(pageBuilderPages.tenantId, tenantId)
      ));
    
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    // Update order for each section
    for (let i = 0; i < sectionIds.length; i++) {
      await db.update(pageBuilderSections)
        .set({ order: i })
        .where(and(
          eq(pageBuilderSections.id, parseInt(sectionIds[i])),
          eq(pageBuilderSections.pageId, parseInt(pageId))
        ));
    }
    
    res.status(200).json({ message: 'Section order updated successfully' });
  } catch (error) {
    console.error('Error updating section order:', error);
    res.status(500).json({ error: 'Failed to update section order' });
  }
};

// Component Management

/**
 * Add a component to a section
 */
export const addComponent = async (req: Request, res: Response) => {
  try {
    const tenantId = extractTenantId(req);
    const { sectionId } = req.params;
    
    // Get section first to verify page ownership
    const [section] = await db.select().from(pageBuilderSections)
      .where(eq(pageBuilderSections.id, parseInt(sectionId)));
    
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }
    
    // Verify page ownership
    const [page] = await db.select().from(pageBuilderPages)
      .where(and(
        eq(pageBuilderPages.id, section.pageId),
        eq(pageBuilderPages.tenantId, tenantId)
      ));
    
    if (!page) {
      return res.status(403).json({ error: 'Not authorized to modify this section' });
    }
    
    // Get highest current order in the section
    const [highestOrderComponent] = await db.select()
      .from(pageBuilderComponents)
      .where(eq(pageBuilderComponents.sectionId, parseInt(sectionId)))
      .orderBy(desc(pageBuilderComponents.order))
      .limit(1);
    
    const newOrder = highestOrderComponent ? highestOrderComponent.order + 1 : 0;
    
    const componentData: InsertPageBuilderComponent = {
      ...req.body,
      sectionId: parseInt(sectionId),
      order: newOrder
    };
    
    const [component] = await db.insert(pageBuilderComponents).values(componentData).returning();
    
    // Update SEO metrics for the page
    updatePageSeoMetrics(section.pageId);
    
    res.status(201).json(component);
  } catch (error) {
    console.error('Error adding component:', error);
    res.status(500).json({ error: 'Failed to add component' });
  }
};

/**
 * Update a component
 */
export const updateComponent = async (req: Request, res: Response) => {
  try {
    const tenantId = extractTenantId(req);
    const { componentId } = req.params;
    
    // Get component to verify ownership
    const [component] = await db.select().from(pageBuilderComponents)
      .where(eq(pageBuilderComponents.id, parseInt(componentId)));
    
    if (!component) {
      return res.status(404).json({ error: 'Component not found' });
    }
    
    // Get section
    const [section] = await db.select().from(pageBuilderSections)
      .where(eq(pageBuilderSections.id, component.sectionId));
    
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }
    
    // Verify page ownership
    const [page] = await db.select().from(pageBuilderPages)
      .where(and(
        eq(pageBuilderPages.id, section.pageId),
        eq(pageBuilderPages.tenantId, tenantId)
      ));
    
    if (!page) {
      return res.status(403).json({ error: 'Not authorized to modify this component' });
    }
    
    // Update component
    const [updatedComponent] = await db.update(pageBuilderComponents)
      .set({
        ...req.body,
        updatedAt: new Date()
      })
      .where(eq(pageBuilderComponents.id, parseInt(componentId)))
      .returning();
    
    // Update SEO metrics for the page
    updatePageSeoMetrics(section.pageId);
    
    res.status(200).json(updatedComponent);
  } catch (error) {
    console.error('Error updating component:', error);
    res.status(500).json({ error: 'Failed to update component' });
  }
};

/**
 * Delete a component
 */
export const deleteComponent = async (req: Request, res: Response) => {
  try {
    const tenantId = extractTenantId(req);
    const { componentId } = req.params;
    
    // Get component to verify ownership
    const [component] = await db.select().from(pageBuilderComponents)
      .where(eq(pageBuilderComponents.id, parseInt(componentId)));
    
    if (!component) {
      return res.status(404).json({ error: 'Component not found' });
    }
    
    // Get section
    const [section] = await db.select().from(pageBuilderSections)
      .where(eq(pageBuilderSections.id, component.sectionId));
    
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }
    
    // Verify page ownership
    const [page] = await db.select().from(pageBuilderPages)
      .where(and(
        eq(pageBuilderPages.id, section.pageId),
        eq(pageBuilderPages.tenantId, tenantId)
      ));
    
    if (!page) {
      return res.status(403).json({ error: 'Not authorized to delete this component' });
    }
    
    // For parent components, handle children
    if (component.parentId === null) {
      // Delete all child components
      await db.delete(pageBuilderComponents)
        .where(eq(pageBuilderComponents.parentId, parseInt(componentId)));
    }
    
    // Delete component
    await db.delete(pageBuilderComponents)
      .where(eq(pageBuilderComponents.id, parseInt(componentId)));
    
    // Update SEO metrics for the page
    updatePageSeoMetrics(section.pageId);
    
    res.status(200).json({ message: 'Component deleted successfully' });
  } catch (error) {
    console.error('Error deleting component:', error);
    res.status(500).json({ error: 'Failed to delete component' });
  }
};

/**
 * Update component order
 */
export const updateComponentOrder = async (req: Request, res: Response) => {
  try {
    const tenantId = extractTenantId(req);
    const { sectionId } = req.params;
    const { componentIds } = req.body;
    
    // Get section to verify ownership
    const [section] = await db.select().from(pageBuilderSections)
      .where(eq(pageBuilderSections.id, parseInt(sectionId)));
    
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }
    
    // Verify page ownership
    const [page] = await db.select().from(pageBuilderPages)
      .where(and(
        eq(pageBuilderPages.id, section.pageId),
        eq(pageBuilderPages.tenantId, tenantId)
      ));
    
    if (!page) {
      return res.status(403).json({ error: 'Not authorized to modify this section' });
    }
    
    // Update order for each component
    for (let i = 0; i < componentIds.length; i++) {
      await db.update(pageBuilderComponents)
        .set({ order: i })
        .where(and(
          eq(pageBuilderComponents.id, parseInt(componentIds[i])),
          eq(pageBuilderComponents.sectionId, parseInt(sectionId))
        ));
    }
    
    res.status(200).json({ message: 'Component order updated successfully' });
  } catch (error) {
    console.error('Error updating component order:', error);
    res.status(500).json({ error: 'Failed to update component order' });
  }
};

// Template Management

/**
 * Get all templates
 */
export const getTemplates = async (req: Request, res: Response) => {
  try {
    const tenantId = extractTenantId(req);
    
    const templates = await db.select().from(pageBuilderTemplates)
      .where(sql`${pageBuilderTemplates.tenantId} = ${tenantId} OR ${pageBuilderTemplates.isGlobal} = true`);
    
    res.status(200).json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
};

/**
 * Get template details
 */
export const getTemplate = async (req: Request, res: Response) => {
  try {
    const tenantId = extractTenantId(req);
    const { id } = req.params;
    
    const [template] = await db.select().from(pageBuilderTemplates)
      .where(and(
        eq(pageBuilderTemplates.id, parseInt(id)),
        sql`${pageBuilderTemplates.tenantId} = ${tenantId} OR ${pageBuilderTemplates.isGlobal} = true`
      ));
    
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    res.status(200).json(template);
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ error: 'Failed to fetch template' });
  }
};

/**
 * Create a template
 */
export const createTemplate = async (req: Request, res: Response) => {
  try {
    const tenantId = extractTenantId(req);
    const userId = getJwtPayload(req)?.userId;
    
    const templateData = {
      ...req.body,
      tenantId,
      author: userId
    };
    
    const [template] = await db.insert(pageBuilderTemplates).values(templateData).returning();
    
    res.status(201).json(template);
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ error: 'Failed to create template' });
  }
};

/**
 * Save an existing page as a template
 */
export const savePageAsTemplate = async (req: Request, res: Response) => {
  try {
    const tenantId = extractTenantId(req);
    const userId = getJwtPayload(req)?.userId;
    const { pageId } = req.params;
    const { name, description, isGlobal = false } = req.body;
    
    // Get page
    const [page] = await db.select().from(pageBuilderPages)
      .where(and(
        eq(pageBuilderPages.id, parseInt(pageId)),
        eq(pageBuilderPages.tenantId, tenantId)
      ));
    
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    // Get sections
    const sections = await db.select().from(pageBuilderSections)
      .where(eq(pageBuilderSections.pageId, parseInt(pageId)))
      .orderBy(asc(pageBuilderSections.order));
    
    // Get components for each section
    const sectionIds = sections.map(section => section.id);
    const components = sectionIds.length > 0
      ? await db.select().from(pageBuilderComponents)
          .where(inArray(pageBuilderComponents.sectionId, sectionIds))
          .orderBy(asc(pageBuilderComponents.order))
      : [];
    
    // Prepare structure for template
    const structure = {
      sections: sections.map(section => ({
        name: section.name,
        description: section.description,
        settings: section.settings,
        seoWeight: section.seoWeight,
        components: components
          .filter(component => component.sectionId === section.id)
          .map(component => ({
            type: component.type,
            label: component.label,
            context: component.context,
            settings: component.settings,
            content: component.content,
            metadata: component.metadata,
            seoImpact: component.seoImpact,
            hidden: component.hidden
          }))
      }))
    };
    
    const templateData = {
      name,
      description,
      tenantId: isGlobal ? null : tenantId,
      isGlobal,
      author: userId,
      industry: page.businessContext?.industry ? [page.businessContext.industry] : [],
      purpose: page.businessContext?.purpose || "",
      structure,
      seoRecommendations: {
        title: page.seo?.title || "",
        description: page.seo?.description || "",
        keywords: page.seo?.keywords || []
      },
      complexity: "moderate" as ComplexityLevel
    };
    
    const [template] = await db.insert(pageBuilderTemplates).values(templateData).returning();
    
    res.status(201).json(template);
  } catch (error) {
    console.error('Error creating template from page:', error);
    res.status(500).json({ error: 'Failed to create template' });
  }
};

/**
 * Get component library items
 */
export const getComponentLibrary = async (req: Request, res: Response) => {
  try {
    const tenantId = extractTenantId(req);
    
    const components = await db.select().from(pageBuilderComponentLibrary)
      .where(sql`${pageBuilderComponentLibrary.tenantId} = ${tenantId} OR ${pageBuilderComponentLibrary.isGlobal} = true`);
    
    res.status(200).json(components);
  } catch (error) {
    console.error('Error fetching component library:', error);
    res.status(500).json({ error: 'Failed to fetch component library' });
  }
};

// SEO Management

/**
 * Generate recommendations for a page
 */
export const generateRecommendations = async (req: Request, res: Response) => {
  try {
    const tenantId = extractTenantId(req);
    const { pageId } = req.params;
    
    // Verify page ownership
    const [page] = await db.select().from(pageBuilderPages)
      .where(and(
        eq(pageBuilderPages.id, parseInt(pageId)),
        eq(pageBuilderPages.tenantId, tenantId)
      ));
    
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    // Get sections
    const sections = await db.select().from(pageBuilderSections)
      .where(eq(pageBuilderSections.pageId, parseInt(pageId)))
      .orderBy(asc(pageBuilderSections.order));
    
    // Get components for each section
    const sectionIds = sections.map(section => section.id);
    const components = sectionIds.length > 0
      ? await db.select().from(pageBuilderComponents)
          .where(inArray(pageBuilderComponents.sectionId, sectionIds))
          .orderBy(asc(pageBuilderComponents.order))
      : [];
    
    // Generate recommendations based on page content
    const recommendations = generatePageRecommendations(page, sections, components);
    
    // Clear existing recommendations
    await db.delete(pageBuilderRecommendations)
      .where(eq(pageBuilderRecommendations.pageId, parseInt(pageId)));
    
    // Insert new recommendations
    if (recommendations.length > 0) {
      await db.insert(pageBuilderRecommendations).values(
        recommendations.map(rec => ({
          ...rec,
          pageId: parseInt(pageId)
        }))
      );
    }
    
    res.status(200).json(recommendations);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
};

/**
 * Dismiss a recommendation
 */
export const dismissRecommendation = async (req: Request, res: Response) => {
  try {
    const { recommendationId } = req.params;
    
    await db.update(pageBuilderRecommendations)
      .set({ dismissed: true })
      .where(eq(pageBuilderRecommendations.id, parseInt(recommendationId)));
    
    res.status(200).json({ message: 'Recommendation dismissed' });
  } catch (error) {
    console.error('Error dismissing recommendation:', error);
    res.status(500).json({ error: 'Failed to dismiss recommendation' });
  }
};

/**
 * Calculate SEO score for a page
 */
export const calculatePageSeoScore = async (req: Request, res: Response) => {
  try {
    const tenantId = extractTenantId(req);
    const { pageId } = req.params;
    
    // Verify page ownership
    const [page] = await db.select().from(pageBuilderPages)
      .where(and(
        eq(pageBuilderPages.id, parseInt(pageId)),
        eq(pageBuilderPages.tenantId, tenantId)
      ));
    
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    // Get sections
    const sections = await db.select().from(pageBuilderSections)
      .where(eq(pageBuilderSections.pageId, parseInt(pageId)))
      .orderBy(asc(pageBuilderSections.order));
    
    // Get components for each section
    const sectionIds = sections.map(section => section.id);
    const components = sectionIds.length > 0
      ? await db.select().from(pageBuilderComponents)
          .where(inArray(pageBuilderComponents.sectionId, sectionIds))
          .orderBy(asc(pageBuilderComponents.order))
      : [];
    
    // Build sections with components
    const sectionsWithComponents = sections.map(section => ({
      ...section,
      components: components.filter(component => component.sectionId === section.id)
    }));
    
    // Calculate SEO score
    const score = calculateSeoScore(page.metadata, page.seo, sectionsWithComponents);
    const suggestions = generateSeoSuggestions(page.metadata, page.seo);
    const keywordDensity = calculateKeywordDensity(sectionsWithComponents);
    const readabilityScore = calculateReadabilityScore(sectionsWithComponents);
    const mobileOptimized = checkMobileOptimization(sectionsWithComponents);
    
    // Update page SEO metrics
    await db.update(pageBuilderPages)
      .set({
        seo: {
          ...page.seo,
          performance: {
            score,
            suggestions,
            keywordDensity,
            readabilityScore,
            mobileOptimized
          }
        }
      })
      .where(eq(pageBuilderPages.id, parseInt(pageId)));
    
    res.status(200).json({
      score,
      suggestions,
      keywordDensity,
      readabilityScore,
      mobileOptimized
    });
  } catch (error) {
    console.error('Error calculating SEO score:', error);
    res.status(500).json({ error: 'Failed to calculate SEO score' });
  }
};

// Helper functions

/**
 * Initialize a page from a template
 */
async function initializeFromTemplate(pageId: number, templateId: string) {
  try {
    // Get template
    const [template] = await db.select().from(pageBuilderTemplates)
      .where(eq(pageBuilderTemplates.id, parseInt(templateId)));
    
    if (!template || !template.structure) {
      return;
    }
    
    // Create sections and components from template
    const structure = template.structure as any;
    
    if (structure.sections && Array.isArray(structure.sections)) {
      for (let i = 0; i < structure.sections.length; i++) {
        const sectionTemplate = structure.sections[i];
        
        // Create section
        const sectionData: InsertPageBuilderSection = {
          pageId,
          name: sectionTemplate.name,
          description: sectionTemplate.description,
          order: i,
          settings: sectionTemplate.settings,
          seoWeight: sectionTemplate.seoWeight || 5
        };
        
        const [section] = await db.insert(pageBuilderSections).values(sectionData).returning();
        
        // Create components for the section
        if (sectionTemplate.components && Array.isArray(sectionTemplate.components)) {
          for (let j = 0; j < sectionTemplate.components.length; j++) {
            const componentTemplate = sectionTemplate.components[j];
            
            const componentData: InsertPageBuilderComponent = {
              sectionId: section.id,
              type: componentTemplate.type,
              label: componentTemplate.label,
              context: componentTemplate.context,
              settings: componentTemplate.settings,
              content: componentTemplate.content,
              metadata: componentTemplate.metadata,
              seoImpact: componentTemplate.seoImpact || 'low',
              hidden: componentTemplate.hidden || false,
              order: j
            };
            
            await db.insert(pageBuilderComponents).values(componentData);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error initializing from template:', error);
    throw error;
  }
}

/**
 * Update SEO metrics for a page
 */
async function updatePageSeoMetrics(pageId: number) {
  try {
    // Get page
    const [page] = await db.select().from(pageBuilderPages)
      .where(eq(pageBuilderPages.id, pageId));
    
    if (!page) {
      return;
    }
    
    // Get sections
    const sections = await db.select().from(pageBuilderSections)
      .where(eq(pageBuilderSections.pageId, pageId))
      .orderBy(asc(pageBuilderSections.order));
    
    // Get components for each section
    const sectionIds = sections.map(section => section.id);
    const components = sectionIds.length > 0
      ? await db.select().from(pageBuilderComponents)
          .where(inArray(pageBuilderComponents.sectionId, sectionIds))
          .orderBy(asc(pageBuilderComponents.order))
      : [];
    
    // Build sections with components
    const sectionsWithComponents = sections.map(section => ({
      ...section,
      components: components.filter(component => component.sectionId === section.id)
    }));
    
    // Calculate SEO metrics
    const score = calculateSeoScore(page.metadata, page.seo, sectionsWithComponents);
    const suggestions = generateSeoSuggestions(page.metadata, page.seo);
    const keywordDensity = calculateKeywordDensity(sectionsWithComponents);
    const readabilityScore = calculateReadabilityScore(sectionsWithComponents);
    const mobileOptimized = checkMobileOptimization(sectionsWithComponents);
    
    // Update page SEO metrics
    await db.update(pageBuilderPages)
      .set({
        seo: {
          ...page.seo,
          performance: {
            score,
            suggestions,
            keywordDensity,
            readabilityScore,
            mobileOptimized
          }
        }
      })
      .where(eq(pageBuilderPages.id, pageId));
  } catch (error) {
    console.error('Error updating page SEO metrics:', error);
  }
}

/**
 * Calculate initial SEO score for a new page
 */
function calculateInitialSeoScore(metadata: PageMetadata, seo: PageSeoMetadata): number {
  let score = 50; // Start with a base score
  
  // Check title
  if (seo?.title && seo.title.length > 10 && seo.title.length < 60) {
    score += 10;
  }
  
  // Check description
  if (seo?.description && seo.description.length > 50 && seo.description.length < 160) {
    score += 10;
  }
  
  // Check keywords
  if (seo?.keywords && Array.isArray(seo.keywords) && seo.keywords.length > 0) {
    score += 5;
  }
  
  // Check for primary keyword in title
  if (seo?.primaryKeyword && seo?.title && seo.title.toLowerCase().includes(seo.primaryKeyword.toLowerCase())) {
    score += 5;
  }
  
  return Math.min(Math.max(score, 0), 100);
}

/**
 * Calculate SEO score for a page
 */
function calculateSeoScore(
  metadata: PageMetadata,
  seo: PageSeoMetadata,
  sections: (PageBuilderSection & { components: PageBuilderComponent[] })[]
): number {
  let score = 40; // Start with a base score
  
  // Check title
  if (seo?.title) {
    if (seo.title.length > 10 && seo.title.length < 60) {
      score += 10;
    } else if (seo.title.length > 0) {
      score += 5;
    }
  }
  
  // Check description
  if (seo?.description) {
    if (seo.description.length > 50 && seo.description.length < 160) {
      score += 10;
    } else if (seo.description.length > 0) {
      score += 5;
    }
  }
  
  // Check keywords
  if (seo?.keywords && Array.isArray(seo.keywords)) {
    score += Math.min(seo.keywords.length * 2, 10);
  }
  
  // Check for primary keyword in title and description
  if (seo?.primaryKeyword) {
    if (seo?.title && seo.title.toLowerCase().includes(seo.primaryKeyword.toLowerCase())) {
      score += 5;
    }
    
    if (seo?.description && seo.description.toLowerCase().includes(seo.primaryKeyword.toLowerCase())) {
      score += 5;
    }
  }
  
  // Check page structure
  if (sections && sections.length > 0) {
    // Has multiple sections
    score += Math.min(sections.length * 2, 10);
    
    // Check for headings
    const hasHeadings = sections.some(section => 
      section.components.some(component => component.type === 'heading')
    );
    
    if (hasHeadings) {
      score += 5;
    }
    
    // Check for images with alt text
    const hasImagesWithAlt = sections.some(section => 
      section.components.some(component => 
        component.type === 'image' && 
        component.metadata?.alt
      )
    );
    
    if (hasImagesWithAlt) {
      score += 5;
    }
  }
  
  return Math.min(Math.max(score, 0), 100);
}

/**
 * Generate SEO suggestions based on page content
 */
function generateSeoSuggestions(metadata: PageMetadata, seo: PageSeoMetadata): string[] {
  const suggestions: string[] = [];
  
  // Title suggestions
  if (!seo?.title) {
    suggestions.push('Add a title to improve SEO');
  } else if (seo.title.length < 10) {
    suggestions.push('Make your title longer (10-60 characters recommended)');
  } else if (seo.title.length > 60) {
    suggestions.push('Shorten your title (10-60 characters recommended)');
  }
  
  // Description suggestions
  if (!seo?.description) {
    suggestions.push('Add a meta description to improve SEO');
  } else if (seo.description.length < 50) {
    suggestions.push('Make your description longer (50-160 characters recommended)');
  } else if (seo.description.length > 160) {
    suggestions.push('Shorten your description (50-160 characters recommended)');
  }
  
  // Keyword suggestions
  if (!seo?.keywords || seo.keywords.length === 0) {
    suggestions.push('Add keywords to improve SEO');
  }
  
  // Primary keyword suggestions
  if (!seo?.primaryKeyword) {
    suggestions.push('Set a primary keyword to focus your SEO efforts');
  } else {
    if (seo?.title && !seo.title.toLowerCase().includes(seo.primaryKeyword.toLowerCase())) {
      suggestions.push('Include your primary keyword in the title');
    }
    
    if (seo?.description && !seo.description.toLowerCase().includes(seo.primaryKeyword.toLowerCase())) {
      suggestions.push('Include your primary keyword in the description');
    }
  }
  
  return suggestions;
}

/**
 * Generate recommendations for a page
 */
function generatePageRecommendations(
  page: any,
  sections: any[],
  components: any[]
): any[] {
  const recommendations: any[] = [];
  
  // Check SEO metadata
  if (!page.seo?.title || page.seo?.title.length < 10) {
    recommendations.push({
      type: 'seo',
      severity: 'recommendation',
      message: 'Add a descriptive title',
      details: 'A good title should be 10-60 characters and include your primary keyword',
      improvement: 'Update the page title in the SEO settings',
      autoFixAvailable: false
    });
  }
  
  if (!page.seo?.description || page.seo?.description.length < 50) {
    recommendations.push({
      type: 'seo',
      severity: 'recommendation',
      message: 'Add a meta description',
      details: 'A good description should be 50-160 characters and include your primary keyword',
      improvement: 'Update the page description in the SEO settings',
      autoFixAvailable: false
    });
  }
  
  // Check page structure
  if (sections.length === 0) {
    recommendations.push({
      type: 'structure',
      severity: 'critical',
      message: 'Add content to your page',
      details: 'Your page needs at least one section with content',
      improvement: 'Add a new section to your page',
      autoFixAvailable: false
    });
  } else if (components.length === 0) {
    recommendations.push({
      type: 'structure',
      severity: 'critical',
      message: 'Add components to your page',
      details: 'Your page has sections but no content components',
      improvement: 'Add components to your sections',
      autoFixAvailable: false
    });
  }
  
  // Check for headings
  const hasHeading = components.some(component => component.type === 'heading');
  if (!hasHeading) {
    recommendations.push({
      type: 'structure',
      severity: 'recommendation',
      message: 'Add heading elements',
      details: 'Headings help structure your content and improve SEO',
      improvement: 'Add at least one heading component',
      autoFixAvailable: false
    });
  }
  
  // Check for images
  const images = components.filter(component => component.type === 'image');
  if (images.length === 0) {
    recommendations.push({
      type: 'content',
      severity: 'suggestion',
      message: 'Add images to your page',
      details: 'Visual content makes your page more engaging',
      improvement: 'Add at least one image component',
      autoFixAvailable: false
    });
  } else {
    // Check for alt text
    const imagesWithoutAlt = images.filter(image => !image.metadata?.alt);
    if (imagesWithoutAlt.length > 0) {
      recommendations.push({
        type: 'seo',
        severity: 'recommendation',
        message: 'Add alt text to images',
        details: `${imagesWithoutAlt.length} image(s) missing alt text`,
        affectedComponents: imagesWithoutAlt.map(image => image.id.toString()),
        improvement: 'Add descriptive alt text to all images',
        autoFixAvailable: false
      });
    }
  }
  
  // SEO goal specific recommendations
  if (page.seo?.seoGoal) {
    switch (page.seo.seoGoal) {
      case 'local':
        recommendations.push({
          type: 'seo',
          severity: 'suggestion',
          message: 'Include local keywords',
          details: 'For local visibility, include location-specific terms',
          improvement: 'Add your city, neighborhood, or region in headings and content',
          autoFixAvailable: false
        });
        break;
      
      case 'industry':
        recommendations.push({
          type: 'content',
          severity: 'suggestion',
          message: 'Add authoritative content',
          details: 'Industry leadership requires demonstrating expertise',
          improvement: 'Include statistics, case studies, or research findings',
          autoFixAvailable: false
        });
        break;
      
      case 'conversion':
        const hasCta = components.some(component => component.type === 'cta' || component.type === 'button');
        if (!hasCta) {
          recommendations.push({
            type: 'content',
            severity: 'recommendation',
            message: 'Add call-to-action elements',
            details: 'Conversion-focused pages need clear CTAs',
            improvement: 'Add buttons or call-to-action components',
            autoFixAvailable: false
          });
        }
        break;
    }
  }
  
  return recommendations;
}

/**
 * Calculate keyword density for a page
 */
function calculateKeywordDensity(
  sections: (PageBuilderSection & { components: PageBuilderComponent[] })[]
): Record<string, number> {
  const keywordDensity: Record<string, number> = {};
  let totalWords = 0;
  const wordCounts: Record<string, number> = {};
  
  // Extract text content from components
  sections.forEach(section => {
    section.components.forEach(component => {
      let text = '';
      
      // Extract text based on component type
      if (component.type === 'paragraph' || component.type === 'rich-text') {
        text = extractTextFromHtml(component.content);
      } else if (component.type === 'heading') {
        text = component.content?.text || '';
      } else if (component.type === 'list') {
        const items = component.content?.items || [];
        text = items.join(' ');
      }
      
      // Count words
      const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 3);
      totalWords += words.length;
      
      words.forEach(word => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      });
    });
  });
  
  // Calculate density for top keywords
  if (totalWords > 0) {
    Object.entries(wordCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 10)
      .forEach(([word, count]) => {
        keywordDensity[word] = +(count / totalWords * 100).toFixed(2);
      });
  }
  
  return keywordDensity;
}

/**
 * Calculate readability score for a page
 */
function calculateReadabilityScore(
  sections: (PageBuilderSection & { components: PageBuilderComponent[] })[]
): number {
  // Simplified implementation - can be expanded with more complex algorithms
  let totalSentences = 0;
  let totalWords = 0;
  let longWordCount = 0;
  
  // Extract text content
  sections.forEach(section => {
    section.components.forEach(component => {
      let text = '';
      
      // Extract text based on component type
      if (component.type === 'paragraph' || component.type === 'rich-text') {
        text = extractTextFromHtml(component.content);
      } else if (component.type === 'heading') {
        text = component.content?.text || '';
      } else if (component.type === 'list') {
        const items = component.content?.items || [];
        text = items.join('. ');
      }
      
      // Count sentences
      const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
      totalSentences += sentences.length;
      
      // Count words
      const words = text.split(/\s+/).filter(word => word.trim().length > 0);
      totalWords += words.length;
      
      // Count long words (more than 6 characters)
      longWordCount += words.filter(word => word.length > 6).length;
    });
  });
  
  if (totalWords === 0 || totalSentences === 0) {
    return 50; // Default score for empty content
  }
  
  // Calculate average words per sentence
  const avgWordsPerSentence = totalWords / totalSentences;
  
  // Calculate percentage of long words
  const longWordPercentage = longWordCount / totalWords * 100;
  
  // Calculate simplified readability score (0-100)
  // Lower avg words per sentence and lower percentage of long words = higher readability
  const sentenceScore = Math.max(0, 100 - (avgWordsPerSentence - 10) * 5);
  const wordScore = Math.max(0, 100 - longWordPercentage * 2);
  
  const readabilityScore = Math.round((sentenceScore + wordScore) / 2);
  
  return Math.min(Math.max(readabilityScore, 0), 100);
}

/**
 * Check if a page is optimized for mobile
 */
function checkMobileOptimization(
  sections: (PageBuilderSection & { components: PageBuilderComponent[] })[]
): boolean {
  // Check for mobile-friendly settings
  let isMobileOptimized = true;
  
  // Check for responsive sections
  for (const section of sections) {
    // Check if section has responsive settings
    const settings = section.settings || {};
    
    // Check for potential mobile issues
    if (settings.fullWidth === false && (!settings.padding || settings.padding.left < 16 || settings.padding.right < 16)) {
      isMobileOptimized = false;
      break;
    }
    
    // Check component spacing
    for (const component of section.components) {
      // Check for potentially non-mobile-friendly components
      if (component.type === 'columns' && component.settings?.columns > 2) {
        isMobileOptimized = false;
        break;
      }
      
      // Check for image size issues
      if (component.type === 'image' && component.settings?.width === 'fixed' && component.settings?.fixedWidth > 600) {
        isMobileOptimized = false;
        break;
      }
    }
    
    if (!isMobileOptimized) {
      break;
    }
  }
  
  return isMobileOptimized;
}

/**
 * Extract plain text from HTML content
 */
function extractTextFromHtml(content: any): string {
  if (!content) return '';
  
  let html = '';
  
  if (typeof content === 'string') {
    html = content;
  } else if (content.html) {
    html = content.html;
  } else if (content.text) {
    return content.text;
  }
  
  // Simple HTML tag removal (for more advanced parsing, use a proper HTML parser)
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}