import { Express } from 'express';
import {
  getSeoScore,
  getSeoRecommendations,
  generateSeoRecommendations,
  applyRecommendation,
  dismissRecommendation,
  analyzeKeywordDensity,
  analyzeCompetitors,
  getCompetitorContentRecommendations,
  analyzeMobileFriendliness,
  getPageSeoSummary
} from './enhancedSeoController';

/**
 * Register enhanced SEO analysis routes
 * @param app Express application
 */
export function registerEnhancedSeoRoutes(app: Express): void {
  // Page SEO summary (combines all analyses)
  app.get('/api/enhanced-seo/pages/:pageId/summary', getPageSeoSummary);

  // SEO scores
  app.get('/api/enhanced-seo/pages/:pageId/score', getSeoScore);

  // Recommendations
  app.get('/api/enhanced-seo/pages/:pageId/recommendations', getSeoRecommendations);
  app.post('/api/enhanced-seo/pages/:pageId/recommendations/generate', generateSeoRecommendations);
  app.post('/api/enhanced-seo/recommendations/:recommendationId/apply', applyRecommendation);
  app.post('/api/enhanced-seo/recommendations/:recommendationId/dismiss', dismissRecommendation);

  // Keyword analysis
  app.get('/api/enhanced-seo/pages/:pageId/keyword-density', analyzeKeywordDensity);

  // Mobile-friendliness
  app.get('/api/enhanced-seo/pages/:pageId/mobile-friendliness', analyzeMobileFriendliness);

  // Competitor analysis
  app.post('/api/enhanced-seo/competitor-analysis', analyzeCompetitors);
  app.post('/api/enhanced-seo/competitor-content-recommendations', getCompetitorContentRecommendations);

  console.log('✅ Enhanced SEO routes registered');
}