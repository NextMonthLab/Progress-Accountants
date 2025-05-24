import { Express } from 'express';
import {
  detectIndustry,
  getIndustryKeywords,
  getContentBenchmarks,
  compareToBenchmarks,
  analyzeCompetitors,
  getCompetitorContentRecommendations,
  getTrendingTopics,
  optimizeContent,
  applyOptimizations,
  generateContent,
  getSeoIntelligenceDashboard
} from './advancedSeoController';

/**
 * Registers routes for the Advanced SEO Intelligence feature
 * @param app Express app instance
 */
export function registerAdvancedSeoRoutes(app: Express): void {
  // Industry detection and benchmarking
  app.get('/api/advanced-seo/pages/:pageId/industry', detectIndustry);
  app.get('/api/advanced-seo/pages/:pageId/industry-keywords', getIndustryKeywords);
  app.get('/api/advanced-seo/industry/:industry/benchmarks', getContentBenchmarks);
  app.get('/api/advanced-seo/pages/:pageId/benchmark-comparison', compareToBenchmarks);
  
  // Competitor analysis
  app.post('/api/advanced-seo/competitor-analysis', analyzeCompetitors);
  app.get('/api/advanced-seo/pages/:pageId/competitor-recommendations', getCompetitorContentRecommendations);
  app.get('/api/advanced-seo/industry/:industry/trending-topics', getTrendingTopics);
  
  // Content optimization
  app.post('/api/advanced-seo/pages/:pageId/optimize', optimizeContent);
  app.post('/api/advanced-seo/pages/:pageId/apply-optimizations', applyOptimizations);
  app.post('/api/advanced-seo/pages/:pageId/generate-content', generateContent);
  
  // SEO Intelligence Dashboard - all data in one request
  app.get('/api/advanced-seo/pages/:pageId/intelligence-dashboard', getSeoIntelligenceDashboard);
  
  console.log('✅ Advanced SEO Intelligence routes registered');
}