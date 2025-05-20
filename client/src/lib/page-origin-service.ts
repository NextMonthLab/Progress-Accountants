/**
 * Service to check page origin and protect NextMonth foundation pages
 */

import { apiRequest } from '@/lib/queryClient';

export interface PageInfo {
  id: number;
  title: string;
  path: string;
  origin: string | null;
  createdBy: string | null;
  pageType: string | null;
  isProtected: boolean;
}

/**
 * Check if a page is a NextMonth foundation page and should be protected
 * @param pageIdOrPath - The page ID or path to check
 * @returns PageInfo object with protection status and metadata
 */
export async function checkPageOrigin(pageIdOrPath: string | number): Promise<PageInfo> {
  try {
    const response = await apiRequest('GET', `/api/page-origin/${pageIdOrPath}`);
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to check page origin');
    }

    return result.data;
  } catch (error) {
    console.error('Error checking page origin:', error);
    throw error;
  }
}

/**
 * Check if current user has permission to override page protection
 * @returns Boolean indicating if the user has override permission
 */
export async function hasOverridePermission(): Promise<boolean> {
  try {
    const response = await apiRequest('GET', '/api/page-origin/override-permission');
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to check override permission');
    }

    return !!result.hasOverride;
  } catch (error) {
    console.error('Error checking override permission:', error);
    return false;
  }
}

/**
 * Duplicate a NextMonth foundation page for customization
 * @param pageId - The ID of the page to duplicate
 * @returns The new page ID
 */
export async function duplicatePageForCustomization(pageId: number): Promise<number> {
  try {
    const response = await apiRequest('POST', `/api/pages/${pageId}/duplicate`, {
      customization: true
    });
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to duplicate page');
    }

    return result.data.id;
  } catch (error) {
    console.error('Error duplicating page:', error);
    throw error;
  }
}