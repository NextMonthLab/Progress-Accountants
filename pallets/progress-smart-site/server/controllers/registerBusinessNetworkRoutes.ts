import { Express } from 'express';
import * as businessNetworkController from './businessNetworkController';

export function registerBusinessNetworkRoutes(app: Express) {
  // Business Profile Routes
  app.get('/api/business-network/my-profile', businessNetworkController.getMyProfile);
  app.post('/api/business-network/profiles', businessNetworkController.createBusinessProfile);
  app.put('/api/business-network/profiles', businessNetworkController.updateBusinessProfile);
  app.get('/api/business-network/profiles', businessNetworkController.getAllProfiles);
  app.get('/api/business-network/profiles/:id', businessNetworkController.getProfileById);
  
  // Post Routes
  app.get('/api/business-network/posts', businessNetworkController.getAllPosts);
  app.get('/api/business-network/posts/following', businessNetworkController.getFollowingPosts);
  app.post('/api/business-network/posts', businessNetworkController.createPost);
  app.post('/api/business-network/posts/:id/like', businessNetworkController.likePost);
  
  // Comment Routes
  app.post('/api/business-network/posts/:id/comment', businessNetworkController.commentOnPost);
  app.get('/api/business-network/posts/:id/comments', businessNetworkController.getPostComments);
  
  // Follow Routes
  app.post('/api/business-network/follow/:id', businessNetworkController.followProfile);
  app.delete('/api/business-network/follow/:id', businessNetworkController.unfollowProfile);
  app.get('/api/business-network/follow/:id', businessNetworkController.checkFollowing);
  
  // Message Routes
  app.post('/api/business-network/messages', businessNetworkController.sendMessage);
  app.get('/api/business-network/conversations', businessNetworkController.getConversations);
  app.get('/api/business-network/messages/:id', businessNetworkController.getMessages);
  
  console.log('✅ Business Network routes registered');
}