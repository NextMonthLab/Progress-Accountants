import { Request, Response } from 'express';
import { storage } from '../storage';

/**
 * API endpoint to check the origin of a page
 * This helps the frontend determine if a page is editable
 */
export async function checkPageOrigin(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    // Allow checking by path or ID
    let page;
    if (isNaN(parseInt(id))) {
      // If not a number, assume it's a path
      const path = id.replace(/^\//, '');
      page = await storage.getPageByPath(path);
    } else {
      // If a number, get by ID
      page = await storage.getPage(parseInt(id));
    }
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }
    
    // Check if page is a NextMonth foundation page
    const isNextMonthPage = page.origin === 'nextmonth' || 
                           page.createdBy === 'nextmonth' || 
                           page.pageType === 'core';
    
    return res.status(200).json({
      success: true,
      data: {
        id: page.id,
        title: page.title,
        path: page.path,
        origin: page.origin || null,
        createdBy: page.createdBy || null,
        pageType: page.pageType || null,
        isProtected: isNextMonthPage
      }
    });
  } catch (error) {
    console.error('Error checking page origin:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to check page origin'
    });
  }
}

/**
 * API endpoint to check if user has override permissions
 */
export async function checkOverridePermission(req: Request, res: Response) {
  try {
    const { user } = req;
    
    // If no user in session, return false
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
        hasOverride: false
      });
    }
    
    // Check if user has override permission
    // For demo purposes, only super_admin has override permission
    const hasOverride = user.userType === 'super_admin' || user.isSuperAdmin;
    
    return res.status(200).json({
      success: true,
      hasOverride
    });
  } catch (error) {
    console.error('Error checking override permission:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to check override permission',
      hasOverride: false
    });
  }
}