import cron from 'node-cron';
import { db } from './db';
import { tenants } from '@shared/schema';
import { generateWeeklySummary, generateMonthlySummary } from './services/insightAiService';

export function initScheduler() {
  // Weekly summaries - run every Monday at 1am
  cron.schedule('0 1 * * 1', async () => {
    console.log('Running weekly insight summaries generation');
    const allTenants = await db.select({ id: tenants.id }).from(tenants);
    
    for (const tenant of allTenants) {
      try {
        await generateWeeklySummary(tenant.id);
        console.log(`Generated weekly summary for tenant ${tenant.id}`);
      } catch (error) {
        console.error(`Error generating weekly summary for tenant ${tenant.id}:`, error);
      }
    }
  });
  
  // Monthly summaries - run on the 1st of each month at 2am
  cron.schedule('0 2 1 * *', async () => {
    console.log('Running monthly insight summaries generation');
    const allTenants = await db.select({ id: tenants.id }).from(tenants);
    
    for (const tenant of allTenants) {
      try {
        await generateMonthlySummary(tenant.id);
        console.log(`Generated monthly summary for tenant ${tenant.id}`);
      } catch (error) {
        console.error(`Error generating monthly summary for tenant ${tenant.id}:`, error);
      }
    }
  });
  
  console.log('Insight summary scheduler initialized');
}