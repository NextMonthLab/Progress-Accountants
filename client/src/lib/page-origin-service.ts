/**
 * Service to check and validate page origins
 * Used to determine if pages are editable or protected based on who created them
 */

import { apiRequest } from '@/lib/queryClient';

// Types of page origins
export type PageOrigin = 'user' | 'nextmonth';

// Page info interface with origin data
export interface PageInfo {
  id: number;
  path: string;
  title: string;
  origin?: PageOrigin;
  createdBy?: PageOrigin;
  pageType?: 'core' | 'custom' | 'automation';
  isProtected: boolean;
}

// Cache page origin results to avoid excessive API calls
const pageOriginCache = new Map<string, PageInfo>();

/**
 * Check if a page is editable based on origin
 * @param pageIdOrPath - The page ID or path to check
 * @returns Promise<PageInfo> - Information about the page, including if it's protected
 */
export async function checkPageOrigin(pageIdOrPath: string | number): Promise<PageInfo> {
  // Convert to string for cache key
  const cacheKey = String(pageIdOrPath);
  
  // Return cached result if available
  if (pageOriginCache.has(cacheKey)) {
    return pageOriginCache.get(cacheKey)!;
  }
  
  try {
    // Determine if we're checking by ID or path
    const isPath = typeof pageIdOrPath === 'string' && !pageIdOrPath.match(/^\d+$/);
    const endpoint = isPath 
      ? `/api/page-builder/pages/path/${encodeURIComponent(pageIdOrPath.replace(/^\//, ''))}`
      : `/api/page-builder/pages/${pageIdOrPath}`;
    
    const response = await apiRequest('GET', endpoint);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to check page origin');
    }
    
    // Process page info
    const pageInfo = data.data || data;
    const origin = pageInfo.origin || pageInfo.createdBy;
    const pageType = pageInfo.pageType;
    
    // Determine if page is protected (NextMonth created or core type)
    const isProtected = origin === 'nextmonth' || pageType === 'core';
    
    const result: PageInfo = {
      id: pageInfo.id,
      path: pageInfo.path,
      title: pageInfo.title,
      origin: origin,
      createdBy: pageInfo.createdBy,
      pageType: pageInfo.pageType,
      isProtected
    };
    
    // Cache the result
    pageOriginCache.set(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error('Error checking page origin:', error);
    
    // Return a fallback - assume protected if we can't verify
    const fallback: PageInfo = {
      id: typeof pageIdOrPath === 'number' ? pageIdOrPath : 0,
      path: typeof pageIdOrPath === 'string' ? pageIdOrPath : '',
      title: '',
      isProtected: true // Default to protected on error to prevent unwanted edits
    };
    
    return fallback;
  }
}

/**
 * Check if current user has override permissions to edit protected pages
 * @returns boolean - true if user can override page protection
 */
export async function hasOverridePermission(): Promise<boolean> {
  try {
    const response = await apiRequest('GET', '/api/user/permissions');
    const data = await response.json();
    
    // Check for override_edit permission
    return data.permissions?.includes('override_edit') || false;
  } catch (error) {
    console.error('Error checking permissions:', error);
    return false;
  }
}

/**
 * Clear the page origin cache
 * Call this when pages are updated/changed
 */
export function clearPageOriginCache(): void {
  pageOriginCache.clear();
}