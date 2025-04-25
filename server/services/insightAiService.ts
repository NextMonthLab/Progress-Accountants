import OpenAI from 'openai';
import { db } from '../db';
import { userInsights, insightUsers, insightSummaries } from '@shared/insight_dashboard';
import { eq, and, gte, lte } from 'drizzle-orm';
import { format, subDays, subWeeks, subMonths } from 'date-fns';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface InsightWithUser {
  id: number;
  content: string;
  displayName: string;
  role?: string;
  tags?: string[];
  createdAt: Date;
}

export async function generateWeeklySummary(tenantId: string): Promise<boolean> {
  try {
    const endDate = new Date();
    const startDate = subWeeks(endDate, 1);
    
    return await generateSummary(tenantId, startDate, endDate, 'weekly');
  } catch (error) {
    console.error('Error generating weekly summary:', error);
    return false;
  }
}

export async function generateMonthlySummary(tenantId: string): Promise<boolean> {
  try {
    const endDate = new Date();
    const startDate = subMonths(endDate, 1);
    
    return await generateSummary(tenantId, startDate, endDate, 'monthly');
  } catch (error) {
    console.error('Error generating monthly summary:', error);
    return false;
  }
}

async function generateSummary(
  tenantId: string, 
  startDate: Date, 
  endDate: Date, 
  summaryType: 'weekly' | 'monthly'
): Promise<boolean> {
  // Get insights for the period
  const insights = await db
    .select({
      id: userInsights.id,
      content: userInsights.content,
      tags: userInsights.tags,
      createdAt: userInsights.createdAt,
      displayName: insightUsers.displayName,
      role: insightUsers.role
    })
    .from(userInsights)
    .innerJoin(insightUsers, eq(userInsights.userId, insightUsers.id))
    .where(and(
      eq(userInsights.tenantId, tenantId),
      gte(userInsights.createdAt, startDate),
      lte(userInsights.createdAt, endDate)
    ))
    .orderBy(userInsights.createdAt);
  
  if (insights.length === 0) {
    console.log(`No insights found for ${summaryType} summary period`);
    return false;
  }
  
  // Prepare the prompt for OpenAI
  const prompt = `
    I'd like you to analyze a set of insights shared by our team during the ${summaryType === 'weekly' ? 'past week' : 'past month'} 
    (${format(startDate, 'MMM d, yyyy')} to ${format(endDate, 'MMM d, yyyy')}).
    
    Here are the insights:
    ${insights.map(insight => 
      `- "${insight.content}" - ${insight.displayName}${insight.role ? ` (${insight.role})` : ''} on ${format(insight.createdAt, 'MMM d')}`
    ).join('\n')}
    
    Please provide:
    1. A concise summary of the main themes that emerged
    2. A highlight of 2-3 most valuable or insightful contributions and why they stood out
    3. Any patterns or interesting observations
    
    Make the tone friendly and professional, like an executive summary. Keep it under 250 words.
    Format the response as valid JSON with the structure:
    {
      "themes": ["theme1", "theme2", "theme3"],
      "topInsights": [
        {"id": number, "reason": "why this insight was valuable"},
        {"id": number, "reason": "why this insight was valuable"}
      ],
      "summary": "The executive summary text"
    }
  `;
  
  try {
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages: [
        { role: "system", content: "You are an expert insight analyst who identifies patterns and valuable contributions from company feedback." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });
    
    if (!response.choices[0].message.content) {
      console.error('Empty response from OpenAI');
      return false;
    }
    
    const aiResponse = JSON.parse(response.choices[0].message.content);
    
    // Store the summary
    await db.insert(insightSummaries).values({
      tenantId,
      summaryType,
      startDate,
      endDate,
      themes: aiResponse.themes,
      topInsights: aiResponse.topInsights,
      aiSummary: aiResponse.summary
    });
    
    return true;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return false;
  }
}