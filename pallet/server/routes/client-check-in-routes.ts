import express, { Request, Response } from 'express';
import { clientCheckInService } from '../services/client-check-in';
import { logger } from '../utils/logger';

const router = express.Router();

/**
 * Client Check-In Routes
 * These routes handle the NextMonth SOT check-in process
 */

// Main client check-in endpoint as specified in the SOT requirements
router.post('/client-check-in', async (req: Request, res: Response) => {
  try {
    logger.info('Received client check-in request');
    
    // Gather data from the system
    const checkInData = await clientCheckInService.gatherCheckInData();
    
    // Submit the data to NextMonth
    // (In a real implementation, this would make an HTTP request to NextMonth's API)
    const submitted = await clientCheckInService.submitCheckIn(checkInData);
    
    if (submitted) {
      return res.status(200).json({
        success: true,
        message: 'Successfully submitted client check-in to NextMonth SOT',
        timestamp: new Date().toISOString(),
        schemaVersion: '1.0.0',
        checkInData
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to submit client check-in to NextMonth SOT',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    logger.error('Error processing client check-in:', error);
    
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing the client check-in',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get current check-in data
router.get('/client-check-in', async (req: Request, res: Response) => {
  try {
    logger.info('Fetching client check-in data');
    
    // Gather data from the system
    const checkInData = await clientCheckInService.gatherCheckInData();
    
    return res.status(200).json({
      success: true,
      message: 'Successfully gathered client check-in data',
      timestamp: new Date().toISOString(),
      schemaVersion: '1.0.0',
      checkInData
    });
  } catch (error) {
    logger.error('Error fetching client check-in data:', error);
    
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching client check-in data',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Register client check-in routes with the app
 */
export function registerClientCheckInRoutes(app: express.Express): void {
  // Register client check-in routes directly on the root for NextMonth compatibility
  app.use('/', router);
  
  logger.info('Client check-in routes registered');
}