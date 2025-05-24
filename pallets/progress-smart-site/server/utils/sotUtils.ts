/**
 * SOT (Single Source of Truth) Utilities
 * Contains utility functions for blueprint validation and processing
 */

/**
 * Validates a blueprint to ensure it has all required properties and structure
 * @param blueprint The blueprint object to validate
 * @returns Object containing validation result and any error messages
 */
export function validateBlueprint(blueprint: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Basic structure validation
  if (!blueprint) {
    errors.push("Blueprint is empty or undefined");
    return { valid: false, errors };
  }

  // Check required top-level properties
  if (!blueprint.version) errors.push("Missing version");
  if (!blueprint.extractedAt) errors.push("Missing extractedAt timestamp");
  if (typeof blueprint.tenantAgnostic !== 'boolean') errors.push("Missing or invalid tenantAgnostic flag");
  
  // Source validation
  if (!blueprint.source) {
    errors.push("Missing source information");
  } else {
    if (!blueprint.source.tenantId && !blueprint.tenantAgnostic) {
      errors.push("Missing tenantId in source when blueprint is not tenant-agnostic");
    }
  }
  
  // Schema validation
  if (!blueprint.schema) {
    errors.push("Missing schema information");
  } else {
    if (!blueprint.schema.version) errors.push("Missing schema version");
  }

  // Optional modules validation
  if (blueprint.modules && typeof blueprint.modules !== 'object') {
    errors.push("Modules must be an object");
  }

  // Tools validation
  if (!blueprint.tools) {
    errors.push("Missing tools list");
  } else if (!Array.isArray(blueprint.tools)) {
    errors.push("Tools must be an array");
  } else {
    // Check each tool
    blueprint.tools.forEach((tool: any, index: number) => {
      if (!tool.name) errors.push(`Tool at index ${index} is missing a name`);
      if (!tool.version) errors.push(`Tool at index ${index} is missing a version`);
    });
  }

  // Pages validation
  if (blueprint.pages && !Array.isArray(blueprint.pages)) {
    errors.push("Pages must be an array");
  }

  // Layouts validation
  if (blueprint.layouts && !Array.isArray(blueprint.layouts)) {
    errors.push("Layouts must be an array");
  }

  // Content blocks validation
  if (blueprint.contentBlocks && !Array.isArray(blueprint.contentBlocks)) {
    errors.push("Content blocks must be an array");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Deep cleans a blueprint to make it suitable for cross-tenant use
 * @param blueprint The blueprint to clean
 * @param makeTenantAgnostic Whether to remove tenant-specific information
 * @returns Cleaned blueprint object
 */
export function sanitizeBlueprint(blueprint: any, makeTenantAgnostic: boolean = true): any {
  if (!blueprint) return null;
  
  const sanitized = JSON.parse(JSON.stringify(blueprint));
  
  if (makeTenantAgnostic) {
    // Remove tenant-specific information
    if (sanitized.source) {
      sanitized.source.tenantId = null;
    }
    
    sanitized.tenantAgnostic = true;
    
    // Sanitize business identity if it exists
    if (sanitized.modules?.businessIdentity) {
      const identity = sanitized.modules.businessIdentity;
      if (identity.name) identity.name = '[BUSINESS_NAME]';
      if (identity.tenantId) identity.tenantId = null;
    }
    
    // Sanitize brand guidelines if they exist
    if (sanitized.modules?.brandGuidelines) {
      const guidelines = sanitized.modules.brandGuidelines;
      if (guidelines.logos) {
        guidelines.logos = {
          primary: '[PRIMARY_LOGO_URL]',
          secondary: '[SECONDARY_LOGO_URL]',
          favicon: '[FAVICON_URL]'
        };
      }
      if (guidelines.tenantId) guidelines.tenantId = null;
    }
  }
  
  return sanitized;
}

/**
 * Compares two blueprints and returns the differences
 * @param blueprintA First blueprint to compare
 * @param blueprintB Second blueprint to compare
 * @returns Object containing arrays of added, removed, and modified items
 */
export function compareBlueprints(blueprintA: any, blueprintB: any): { 
  added: string[], 
  removed: string[], 
  modified: string[] 
} {
  const result = {
    added: [] as string[],
    removed: [] as string[],
    modified: [] as string[]
  };
  
  if (!blueprintA || !blueprintB) {
    return result;
  }
  
  // Compare tools
  const toolsA = new Set((blueprintA.tools || []).map((t: any) => t.name));
  const toolsB = new Set((blueprintB.tools || []).map((t: any) => t.name));
  
  // Use Array.from to avoid iteration issues
  Array.from(toolsB).forEach((tool: any) => {
    if (!toolsA.has(tool)) {
      result.added.push(`Tool: ${tool}`);
    }
  });
  
  Array.from(toolsA).forEach((tool: any) => {
    if (!toolsB.has(tool)) {
      result.removed.push(`Tool: ${tool}`);
    }
  });
  
  // Compare pages (by route or id)
  const pagesA = new Map((blueprintA.pages || []).map((p: any) => [p.route || p.id, p]));
  const pagesB = new Map((blueprintB.pages || []).map((p: any) => [p.route || p.id, p]));
  
  // Use Array.from to avoid iteration issues
  Array.from(pagesB.entries()).forEach(([key, page]: [any, any]) => {
    if (!pagesA.has(key)) {
      result.added.push(`Page: ${key}`);
    } else if (JSON.stringify(pagesA.get(key)) !== JSON.stringify(page)) {
      result.modified.push(`Page: ${key}`);
    }
  });
  
  Array.from(pagesA.keys()).forEach((key: any) => {
    if (!pagesB.has(key)) {
      result.removed.push(`Page: ${key}`);
    }
  });
  
  // Compare layouts
  const layoutsA = new Set((blueprintA.layouts || []).map((l: any) => l.name || l.id));
  const layoutsB = new Set((blueprintB.layouts || []).map((l: any) => l.name || l.id));
  
  Array.from(layoutsB).forEach((layout: any) => {
    if (!layoutsA.has(layout)) {
      result.added.push(`Layout: ${layout}`);
    }
  });
  
  Array.from(layoutsA).forEach((layout: any) => {
    if (!layoutsB.has(layout)) {
      result.removed.push(`Layout: ${layout}`);
    }
  });
  
  return result;
}