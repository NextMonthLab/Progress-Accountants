import { db } from '../db';
import { insightAppUserCapacity } from '@shared/schema';
import { eq, sql } from 'drizzle-orm';
import { AIEventLogger } from './ai-event-logger';
import type { InsertInsightAppUserCapacity, InsightAppUserCapacity } from '@shared/schema';

export interface CapacityStatus {
  baseFreeCapacity: number;
  additionalPurchasedCapacity: number;
  totalCapacity: number;
  currentUsage: number;
  hasCapacity: boolean;
  remainingSlots: number;
}

export interface InviteValidationResult {
  canInvite: boolean;
  status: 'success' | 'limit-exceeded';
  message?: string;
  capacityStatus: CapacityStatus;
}

export class InsightAppCapacityService {
  /**
   * Get current capacity status for a tenant
   */
  static async getCapacityStatus(tenantId: string): Promise<CapacityStatus> {
    try {
      // Get capacity record or create default
      let [capacityRecord] = await db
        .select()
        .from(insightAppUserCapacity)
        .where(eq(insightAppUserCapacity.tenantId, tenantId))
        .limit(1);

      if (!capacityRecord) {
        // Create default capacity for new tenant
        [capacityRecord] = await db
          .insert(insightAppUserCapacity)
          .values({
            tenantId,
            baseFreeCapacity: 10,
            additionalPurchasedCapacity: 0,
          })
          .returning();
      }

      // For now, set current usage to 0 to avoid database schema conflicts
      // This will be enhanced when user management is fully implemented
      const currentUsage = 0;
      const totalCapacity = capacityRecord.baseFreeCapacity + capacityRecord.additionalPurchasedCapacity;
      const hasCapacity = currentUsage < totalCapacity;
      const remainingSlots = Math.max(0, totalCapacity - currentUsage);

      return {
        baseFreeCapacity: capacityRecord.baseFreeCapacity,
        additionalPurchasedCapacity: capacityRecord.additionalPurchasedCapacity,
        totalCapacity,
        currentUsage,
        hasCapacity,
        remainingSlots,
      };
    } catch (error) {
      console.error('Error getting capacity status:', error);
      throw new Error('Failed to retrieve capacity status');
    }
  }

  /**
   * Validate if a new user can be invited
   */
  static async validateInvite(tenantId: string): Promise<InviteValidationResult> {
    try {
      const capacityStatus = await this.getCapacityStatus(tenantId);

      if (!capacityStatus.hasCapacity) {
        return {
          canInvite: false,
          status: 'limit-exceeded',
          message: "You've reached your Insight App user limit. Please purchase more capacity to invite additional users.",
          capacityStatus,
        };
      }

      return {
        canInvite: true,
        status: 'success',
        capacityStatus,
      };
    } catch (error) {
      console.error('Error validating invite:', error);
      throw new Error('Failed to validate invite capacity');
    }
  }

  /**
   * Log user invitation attempt
   */
  static async logInviteAttempt(
    tenantId: string, 
    userId: number | null, 
    success: boolean, 
    email: string
  ): Promise<void> {
    try {
      await AIEventLogger.logEvent({
        tenantId,
        userId,
        eventType: 'insight-user-invite',
        taskType: 'user-management',
        detail: {
          inviteEmail: email,
          success,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('Failed to log invite attempt:', error);
      // Don't throw - logging is not critical for functionality
    }
  }

  /**
   * Update tenant capacity (admin only)
   */
  static async updateCapacity(
    tenantId: string, 
    additionalPurchasedCapacity: number
  ): Promise<InsightAppUserCapacity> {
    try {
      // Ensure capacity exists
      await this.getCapacityStatus(tenantId);

      const [updatedCapacity] = await db
        .update(insightAppUserCapacity)
        .set({
          additionalPurchasedCapacity,
          lastUpdated: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(insightAppUserCapacity.tenantId, tenantId))
        .returning();

      return updatedCapacity;
    } catch (error) {
      console.error('Error updating capacity:', error);
      throw new Error('Failed to update capacity');
    }
  }

  /**
   * Initialize capacity for a new tenant
   */
  static async initializeCapacity(
    tenantId: string, 
    baseFreeCapacity: number = 10
  ): Promise<InsightAppUserCapacity> {
    try {
      const [capacity] = await db
        .insert(insightAppUserCapacity)
        .values({
          tenantId,
          baseFreeCapacity,
          additionalPurchasedCapacity: 0,
        })
        .onConflictDoNothing()
        .returning();

      return capacity;
    } catch (error) {
      console.error('Error initializing capacity:', error);
      throw new Error('Failed to initialize capacity');
    }
  }

  /**
   * Get capacity summary for admin dashboard
   */
  static async getCapacitySummary(tenantId: string): Promise<{
    capacity: CapacityStatus;
    recentInvites: number;
    utilizationPercentage: number;
  }> {
    try {
      const capacity = await this.getCapacityStatus(tenantId);
      
      // Count recent invites (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // This would need to be adjusted based on how invite tracking is implemented
      const recentInvites = 0; // Placeholder

      const utilizationPercentage = capacity.totalCapacity > 0 
        ? Math.round((capacity.currentUsage / capacity.totalCapacity) * 100)
        : 0;

      return {
        capacity,
        recentInvites,
        utilizationPercentage,
      };
    } catch (error) {
      console.error('Error getting capacity summary:', error);
      throw new Error('Failed to get capacity summary');
    }
  }
}