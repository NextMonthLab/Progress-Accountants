/**
 * Version Control System
 * 
 * Enables content versioning for pages, templates, and other managed content
 * with complete history, restore capabilities, and change tracking.
 */

import { z } from "zod";

// Type of content that can be versioned
export type VersionableEntityType = 
  | "page" 
  | "template" 
  | "component" 
  | "section"
  | "media" 
  | "form";

// Version status
export type VersionStatus = 
  | "draft"      // In progress, not published
  | "published"  // Live version
  | "archived";  // Old version, no longer active

// Change types
export type ChangeType = 
  | "create"     // Initial creation
  | "update"     // Content update
  | "layout"     // Layout change
  | "style"      // Style change  
  | "publish"    // Publication status change
  | "seo"        // SEO metadata update
  | "delete"     // Content deletion
  | "restore";   // Restored from previous version

// Schema for storing version data
export const versionSchema = z.object({
  id: z.number(),
  entityId: z.number(), // ID of the entity being versioned (e.g., pageId)
  entityType: z.enum([
    "page", 
    "template", 
    "component", 
    "section", 
    "media", 
    "form"
  ]),
  versionNumber: z.number(),
  createdBy: z.number(), // User ID
  createdAt: z.date(),
  status: z.enum(["draft", "published", "archived"]),
  changeType: z.enum([
    "create", 
    "update", 
    "layout", 
    "style", 
    "publish", 
    "seo", 
    "delete", 
    "restore"
  ]),
  changeDescription: z.string().optional(),
  snapshot: z.any(), // Complete JSON representation of entity at this point
  diff: z.any().optional(), // Diff from previous version (for efficiency in storage)
});

// Schema for validation when creating a version
export const createVersionSchema = versionSchema.omit({ 
  id: true, 
  createdAt: true 
});

// Type definitions
export type Version = z.infer<typeof versionSchema>;
export type CreateVersion = z.infer<typeof createVersionSchema>;

// Entity snapshot interfaces
export interface PageSnapshot {
  id: number;
  title: string;
  slug: string;
  status: string;
  sections: any[];  // Section content
  metadata: any;    // SEO and other metadata
  settings: any;    // Page-specific settings
  layout: string;   // Layout identifier
  lastModified: Date;
  // Additional page data
}

export interface TemplateSnapshot {
  id: number;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  sections: any[];
  settings: any;
  createdAt: Date;
  lastModified: Date;
  // Additional template data
}

// Change detection utilities
export function detectChangeType(oldVersion: any, newVersion: any): ChangeType {
  if (!oldVersion) return "create";
  
  // Check for layout changes
  if (JSON.stringify(oldVersion.sections?.map((s: any) => s.id)) !== 
      JSON.stringify(newVersion.sections?.map((s: any) => s.id))) {
    return "layout";
  }
  
  // Check for SEO changes
  if (JSON.stringify(oldVersion.metadata) !== JSON.stringify(newVersion.metadata)) {
    return "seo";
  }
  
  // Check for style changes (simplified)
  const oldStyles = JSON.stringify(extractStyles(oldVersion));
  const newStyles = JSON.stringify(extractStyles(newVersion));
  if (oldStyles !== newStyles) {
    return "style";
  }
  
  // Default to general update
  return "update";
}

// Helper to extract style properties from an entity
function extractStyles(entity: any): any {
  const styles: any = {};
  
  // Extract from sections
  if (entity.sections) {
    entity.sections.forEach((section: any, index: number) => {
      styles[`section_${index}`] = {
        backgroundColor: section.backgroundColor,
        textColor: section.textColor,
        padding: section.padding,
        margin: section.margin,
        borderRadius: section.borderRadius,
        // Other style properties
      };
      
      // Extract from components in sections
      if (section.components) {
        section.components.forEach((component: any, compIndex: number) => {
          styles[`section_${index}_component_${compIndex}`] = {
            backgroundColor: component.backgroundColor,
            textColor: component.textColor,
            fontSize: component.fontSize,
            fontWeight: component.fontWeight,
            // Other component style properties
          };
        });
      }
    });
  }
  
  return styles;
}

// Helper to calculate differences between versions
export function calculateDiff(oldVersion: any, newVersion: any): any {
  // Simple diff implementation - in a real application, use a library like jsondiffpatch
  const diff: any = {};
  
  // Get all keys from both objects
  const allKeys = new Set([
    ...Object.keys(oldVersion || {}),
    ...Object.keys(newVersion || {})
  ]);
  
  // Check each key for differences
  allKeys.forEach(key => {
    const oldValue = oldVersion?.[key];
    const newValue = newVersion?.[key];
    
    if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      if (typeof oldValue === 'object' && typeof newValue === 'object') {
        // Recursive diff for objects
        diff[key] = calculateDiff(oldValue, newValue);
      } else {
        // Direct value difference
        diff[key] = {
          oldValue,
          newValue
        };
      }
    }
  });
  
  return diff;
}