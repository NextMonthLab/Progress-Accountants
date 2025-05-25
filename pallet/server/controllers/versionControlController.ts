/**
 * Version Control Controller
 * 
 * Manages the creation, retrieval, and restoration of content versions
 * and maintains the version history for various content types.
 */

import { Request, Response } from 'express';
import { db } from '../db';
import { contentVersions, changeLogs, users } from '@shared/schema';
import { eq, desc, and } from 'drizzle-orm';
import { detectChangeType, calculateDiff } from '@shared/version_control';
import { VersionableEntityType, ChangeType } from '@shared/version_control';

/**
 * Create a new version of content
 */
export async function createVersion(req: Request, res: Response) {
  try {
    const { entityId, entityType, snapshot, changeDescription } = req.body;
    
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    // Validate request
    if (!entityId || !entityType || !snapshot) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Get the latest version for this entity to determine version number
    const [latestVersion] = await db.select()
      .from(contentVersions)
      .where(and(
        eq(contentVersions.entityId, entityId),
        eq(contentVersions.entityType, entityType as VersionableEntityType)
      ))
      .orderBy(desc(contentVersions.versionNumber))
      .limit(1);
    
    const versionNumber = latestVersion ? latestVersion.versionNumber + 1 : 1;
    
    // Determine change type
    const changeType = latestVersion
      ? detectChangeType(latestVersion.snapshot, snapshot)
      : 'create' as ChangeType;
    
    // Calculate diff if there's a previous version
    const diff = latestVersion ? calculateDiff(latestVersion.snapshot, snapshot) : undefined;
    
    // Create new version
    const [newVersion] = await db.insert(contentVersions)
      .values({
        entityId,
        entityType: entityType as VersionableEntityType,
        versionNumber,
        createdBy: req.user.id,
        status: versionNumber === 1 ? 'draft' : latestVersion.status,
        changeType,
        changeDescription,
        snapshot,
        diff
      })
      .returning();
    
    // Create change log entry
    await db.insert(changeLogs)
      .values({
        userId: req.user.id,
        action: `${changeType}_version`,
        entityType: entityType as VersionableEntityType,
        entityId,
        versionId: newVersion.id,
        details: {
          versionNumber,
          changeDescription
        },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });
    
    return res.status(201).json(newVersion);
  } catch (error) {
    console.error('Error creating version:', error);
    return res.status(500).json({ error: 'Failed to create version' });
  }
}

/**
 * Get version history for an entity
 */
export async function getVersionHistory(req: Request, res: Response) {
  try {
    const { entityType, entityId } = req.params;
    
    // Validate parameters
    if (!entityType || !entityId) {
      return res.status(400).json({ error: 'Entity type and ID are required' });
    }
    
    // Get all versions for this entity
    const versions = await db.select({
      id: contentVersions.id,
      versionNumber: contentVersions.versionNumber,
      status: contentVersions.status,
      changeType: contentVersions.changeType,
      changeDescription: contentVersions.changeDescription,
      createdAt: contentVersions.createdAt,
      createdBy: users.username,
      creatorId: users.id,
      snapshot: contentVersions.snapshot
    })
      .from(contentVersions)
      .leftJoin(users, eq(contentVersions.createdBy, users.id))
      .where(and(
        eq(contentVersions.entityType, entityType as VersionableEntityType),
        eq(contentVersions.entityId, parseInt(entityId))
      ))
      .orderBy(desc(contentVersions.versionNumber));
    
    // Extract title/name from snapshot for page versions
    const enrichedVersions = versions.map(version => {
      // Create a base version object without the full snapshot
      const baseVersion = {
        id: version.id,
        versionNumber: version.versionNumber,
        status: version.status,
        changeType: version.changeType,
        changeDescription: version.changeDescription,
        createdAt: version.createdAt,
        createdBy: version.createdBy,
        creatorId: version.creatorId
      };

      // For page types, extract the name (title) from the snapshot
      if (entityType === 'page' && version.snapshot) {
        try {
          const pageData = typeof version.snapshot === 'string' 
            ? JSON.parse(version.snapshot) 
            : version.snapshot;
            
          return {
            ...baseVersion,
            title: pageData.name || 'Untitled Page', // Get page name from snapshot
            versionLabel: `v${version.versionNumber.toFixed(1)}`
          };
        } catch (error) {
          console.error('Error parsing snapshot:', error);
        }
      }
      
      return {
        ...baseVersion,
        title: 'Unknown',
        versionLabel: `v${version.versionNumber.toFixed(1)}`
      };
    });
    
    return res.json(enrichedVersions);
  } catch (error) {
    console.error('Error fetching version history:', error);
    return res.status(500).json({ error: 'Failed to fetch version history' });
  }
}

/**
 * Get a specific version
 */
export async function getVersion(req: Request, res: Response) {
  try {
    const { versionId } = req.params;
    
    if (!versionId) {
      return res.status(400).json({ error: 'Version ID is required' });
    }
    
    const [version] = await db.select()
      .from(contentVersions)
      .where(eq(contentVersions.id, parseInt(versionId)));
    
    if (!version) {
      return res.status(404).json({ error: 'Version not found' });
    }
    
    return res.json(version);
  } catch (error) {
    console.error('Error fetching version:', error);
    return res.status(500).json({ error: 'Failed to fetch version' });
  }
}

/**
 * Get the latest version of an entity
 */
export async function getLatestVersion(req: Request, res: Response) {
  try {
    const { entityType, entityId } = req.params;
    
    // Validate parameters
    if (!entityType || !entityId) {
      return res.status(400).json({ error: 'Entity type and ID are required' });
    }
    
    const [latestVersion] = await db.select()
      .from(contentVersions)
      .where(and(
        eq(contentVersions.entityType, entityType as VersionableEntityType),
        eq(contentVersions.entityId, parseInt(entityId))
      ))
      .orderBy(desc(contentVersions.versionNumber))
      .limit(1);
    
    if (!latestVersion) {
      return res.status(404).json({ error: 'No versions found for this entity' });
    }
    
    return res.json(latestVersion);
  } catch (error) {
    console.error('Error fetching latest version:', error);
    return res.status(500).json({ error: 'Failed to fetch latest version' });
  }
}

/**
 * Restore a specific version (creates a new version with the old content)
 */
export async function restoreVersion(req: Request, res: Response) {
  try {
    const { versionId } = req.params;
    
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    if (!versionId) {
      return res.status(400).json({ error: 'Version ID is required' });
    }
    
    // Get the version to restore
    const [versionToRestore] = await db.select()
      .from(contentVersions)
      .where(eq(contentVersions.id, parseInt(versionId)));
    
    if (!versionToRestore) {
      return res.status(404).json({ error: 'Version not found' });
    }
    
    // Get the latest version number
    const [latestVersion] = await db.select()
      .from(contentVersions)
      .where(and(
        eq(contentVersions.entityId, versionToRestore.entityId),
        eq(contentVersions.entityType, versionToRestore.entityType)
      ))
      .orderBy(desc(contentVersions.versionNumber))
      .limit(1);
    
    const newVersionNumber = latestVersion.versionNumber + 1;
    
    // Create a new version with the restored content
    const [restoredVersion] = await db.insert(contentVersions)
      .values({
        entityId: versionToRestore.entityId,
        entityType: versionToRestore.entityType,
        versionNumber: newVersionNumber,
        createdBy: req.user.id,
        status: versionToRestore.status,
        changeType: 'restore',
        changeDescription: `Restored from version ${versionToRestore.versionNumber}`,
        snapshot: versionToRestore.snapshot,
        diff: calculateDiff(latestVersion.snapshot, versionToRestore.snapshot)
      })
      .returning();
    
    // Create change log entry
    await db.insert(changeLogs)
      .values({
        userId: req.user.id,
        action: 'restore_version',
        entityType: versionToRestore.entityType,
        entityId: versionToRestore.entityId,
        versionId: restoredVersion.id,
        details: {
          restoredFromVersion: versionToRestore.versionNumber,
          newVersionNumber,
          reason: req.body.reason || 'Not specified'
        },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });
    
    return res.status(200).json(restoredVersion);
  } catch (error) {
    console.error('Error restoring version:', error);
    return res.status(500).json({ error: 'Failed to restore version' });
  }
}

/**
 * Update version status (draft, published, archived)
 */
export async function updateVersionStatus(req: Request, res: Response) {
  try {
    const { versionId } = req.params;
    const { status } = req.body;
    
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    if (!versionId || !status) {
      return res.status(400).json({ error: 'Version ID and status are required' });
    }
    
    // Validate the status
    if (!['draft', 'published', 'archived'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    // Get the version to update
    const [versionToUpdate] = await db.select()
      .from(contentVersions)
      .where(eq(contentVersions.id, parseInt(versionId)));
    
    if (!versionToUpdate) {
      return res.status(404).json({ error: 'Version not found' });
    }
    
    // If publishing, unpublish all other versions of this entity
    if (status === 'published') {
      await db.update(contentVersions)
        .set({ status: 'archived' })
        .where(and(
          eq(contentVersions.entityId, versionToUpdate.entityId),
          eq(contentVersions.entityType, versionToUpdate.entityType),
          eq(contentVersions.status, 'published')
        ));
    }
    
    // Update the version status
    const [updatedVersion] = await db.update(contentVersions)
      .set({ status })
      .where(eq(contentVersions.id, parseInt(versionId)))
      .returning();
    
    // Create change log entry
    await db.insert(changeLogs)
      .values({
        userId: req.user.id,
        action: 'update_version_status',
        entityType: versionToUpdate.entityType,
        entityId: versionToUpdate.entityId,
        versionId: parseInt(versionId),
        details: {
          oldStatus: versionToUpdate.status,
          newStatus: status,
          reason: req.body.reason || 'Not specified'
        },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });
    
    return res.json(updatedVersion);
  } catch (error) {
    console.error('Error updating version status:', error);
    return res.status(500).json({ error: 'Failed to update version status' });
  }
}

/**
 * Get version activity log
 */
export async function getVersionActivityLog(req: Request, res: Response) {
  try {
    const { entityType, entityId } = req.params;
    
    // Validate parameters
    if (!entityType || !entityId) {
      return res.status(400).json({ error: 'Entity type and ID are required' });
    }
    
    // Get all activity logs for this entity
    const logs = await db.select({
      id: changeLogs.id,
      timestamp: changeLogs.timestamp,
      action: changeLogs.action,
      details: changeLogs.details,
      username: users.username,
      userId: users.id
    })
      .from(changeLogs)
      .leftJoin(users, eq(changeLogs.userId, users.id))
      .where(and(
        eq(changeLogs.entityType, entityType as VersionableEntityType),
        eq(changeLogs.entityId, parseInt(entityId))
      ))
      .orderBy(desc(changeLogs.timestamp));
    
    return res.json(logs);
  } catch (error) {
    console.error('Error fetching version activity log:', error);
    return res.status(500).json({ error: 'Failed to fetch activity log' });
  }
}

/**
 * Compare two versions
 */
export async function compareVersions(req: Request, res: Response) {
  try {
    const { versionId1, versionId2 } = req.params;
    
    if (!versionId1 || !versionId2) {
      return res.status(400).json({ error: 'Two version IDs are required' });
    }
    
    // Get the versions to compare
    const [version1] = await db.select()
      .from(contentVersions)
      .where(eq(contentVersions.id, parseInt(versionId1)));
    
    const [version2] = await db.select()
      .from(contentVersions)
      .where(eq(contentVersions.id, parseInt(versionId2)));
    
    if (!version1 || !version2) {
      return res.status(404).json({ error: 'One or both versions not found' });
    }
    
    // Compute the differences
    const differences = calculateDiff(version1.snapshot, version2.snapshot);
    
    return res.json({
      version1: {
        id: version1.id,
        versionNumber: version1.versionNumber,
        createdAt: version1.createdAt,
        status: version1.status
      },
      version2: {
        id: version2.id,
        versionNumber: version2.versionNumber,
        createdAt: version2.createdAt,
        status: version2.status
      },
      differences
    });
  } catch (error) {
    console.error('Error comparing versions:', error);
    return res.status(500).json({ error: 'Failed to compare versions' });
  }
}