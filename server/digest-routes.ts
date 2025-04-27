import { Router } from 'express';
import { 
  generateTicketDigest,
  generateSessionDigest,
  generateSystemDigest,
  getUserDigests,
  getDigestById,
  markDigestAsRead,
  markDigestAsDelivered
} from './controllers/digestController';
import { isAuthenticated } from './middleware/auth';

const router = Router();

// Create digest routes
router.post('/ticket/:ticketId', isAuthenticated, generateTicketDigest);
router.post('/session/:sessionId', isAuthenticated, generateSessionDigest);
router.post('/system', isAuthenticated, generateSystemDigest);

// Read digest routes
router.get('/user/:userId', isAuthenticated, getUserDigests);
router.get('/:digestId', isAuthenticated, getDigestById);

// Update digest routes
router.put('/:digestId/read', isAuthenticated, markDigestAsRead);
router.put('/:digestId/delivered', isAuthenticated, markDigestAsDelivered);

export default router;