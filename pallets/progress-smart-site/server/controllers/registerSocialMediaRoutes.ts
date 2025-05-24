import { Express } from 'express';
import { socialMediaController } from './socialMediaController';

export function registerSocialMediaRoutes(app: Express) {
  // Generate social media post content using AI
  app.post('/api/social-media/generate-post', socialMediaController.generatePost);
  
  // Generate image for social media post using AI
  app.post('/api/social-media/generate-image', socialMediaController.generateImage);
  
  // Save post to session storage
  app.post('/api/social-media/save-post', socialMediaController.savePost);
  
  // Get all user posts from session storage
  app.get('/api/social-media/posts', socialMediaController.getUserPosts);
  
  // Delete a post from session storage
  app.delete('/api/social-media/posts/:id', socialMediaController.deletePost);
  
  console.log('✅ Social Media Post Generator routes registered');
}