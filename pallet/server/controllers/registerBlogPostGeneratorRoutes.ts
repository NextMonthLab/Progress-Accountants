import { Express } from 'express';
import { blogPostGeneratorController } from './blogPostGeneratorController';

export function registerBlogPostGeneratorRoutes(app: Express) {
  // Generate blog post content using AI
  app.post('/api/blog-post-generator/generate-post', blogPostGeneratorController.generatePost);
  
  // Generate image for blog post using AI
  app.post('/api/blog-post-generator/generate-image', blogPostGeneratorController.generateImage);
  
  // Save post to session storage
  app.post('/api/blog-post-generator/save-post', blogPostGeneratorController.savePost);
  
  // Get all user posts from session storage
  app.get('/api/blog-post-generator/posts', blogPostGeneratorController.getUserPosts);
  
  // Delete a post from session storage
  app.delete('/api/blog-post-generator/posts/:id', blogPostGeneratorController.deletePost);
  
  console.log('✅ Blog Post Generator routes registered');
}