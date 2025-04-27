import { Express } from "express";
import { BlogController } from "./blogController";

/**
 * Registers all blog-related API routes
 * @param app Express application instance
 */
export function registerBlogRoutes(app: Express): void {
  // Blog Pages routes
  app.get("/api/blog/pages", BlogController.getBlogPages);
  app.get("/api/blog/pages/:id", BlogController.getBlogPage);
  app.get("/api/blog/pages/slug/:slug", BlogController.getBlogPageBySlug);
  app.post("/api/blog/pages", BlogController.createBlogPage);
  app.put("/api/blog/pages/:id", BlogController.updateBlogPage);
  app.delete("/api/blog/pages/:id", BlogController.deleteBlogPage);
  
  // Blog Posts routes
  app.get("/api/blog/posts", BlogController.getBlogPosts);
  app.get("/api/blog/posts/:id", BlogController.getBlogPost);
  app.get("/api/blog/posts/slug/:slug", BlogController.getBlogPostBySlug);
  app.post("/api/blog/posts", BlogController.createBlogPost);
  app.post("/api/blog/publish-to-news", BlogController.publishDirectToNews);
  app.put("/api/blog/posts/:id", BlogController.updateBlogPost);
  app.delete("/api/blog/posts/:id", BlogController.deleteBlogPost);
  
  // Integration Requests routes
  app.get("/api/blog/integration-requests", BlogController.getIntegrationRequests);
  app.get("/api/blog/integration-requests/:id", BlogController.getIntegrationRequest);
  app.post("/api/blog/integration-requests", BlogController.createIntegrationRequest);
  app.put("/api/blog/integration-requests/:id", BlogController.updateIntegrationRequest);
  app.delete("/api/blog/integration-requests/:id", BlogController.deleteIntegrationRequest);
}