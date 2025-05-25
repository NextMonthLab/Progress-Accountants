import { Express } from 'express';
import { 
  getInsightUsers, createInsightUser, updateInsightUser, deleteInsightUser 
} from './insightUsersController';
import {
  getLeaderboard, getInsightSummaries, getUserActivity
} from './insightsDashboardController';

export function registerInsightsRoutes(app: Express) {
  console.log('Registering Insights Dashboard routes...');
  
  // User management routes
  app.get('/api/insight-users', getInsightUsers);
  app.post('/api/insight-users', createInsightUser);
  app.patch('/api/insight-users/:id', updateInsightUser);
  app.delete('/api/insight-users/:id', deleteInsightUser);

  // Dashboard routes
  app.get('/api/insights/leaderboard', getLeaderboard);
  app.get('/api/insights/summaries', getInsightSummaries);
  app.get('/api/insights/activity', getUserActivity);
  
  console.log('✅ Insights Dashboard routes registered');
}