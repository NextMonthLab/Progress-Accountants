import { Express, Request, Response } from 'express';
import { checkAIServiceHealth } from '../services/ai-gateway';

interface AISettingsResponse {
  currentModel: string;
  isProAIUser: boolean;
  availableModels: {
    name: string;
    description: string;
    features: string[];
    isActive: boolean;
    isPro: boolean;
  }[];
}

// Store Pro AI setting in memory (in production, this would be in database)
let isProAIUserSetting = process.env.IS_PRO_AI_USER === 'true';

export function registerAISettingsRoutes(app: Express) {
  // Get AI settings and current model status
  app.get('/api/ai/settings', async (req: Request, res: Response) => {
    try {
      const healthCheck = await checkAIServiceHealth();
      
      const response: AISettingsResponse = {
        currentModel: healthCheck.activeService,
        isProAIUser: isProAIUserSetting,
        availableModels: [
          {
            name: 'Mistral 7B',
            description: 'Fast and efficient AI model included with your Smart Site',
            features: [
              'Smart assistant responses',
              'Basic content summarization', 
              'Simple content generation',
              'Quick insights analysis'
            ],
            isActive: healthCheck.activeService === 'Mistral 7B',
            isPro: false
          },
          {
            name: 'OpenAI GPT-4o',
            description: 'Advanced AI model with superior reasoning and creativity',
            features: [
              'Deep trend analysis and insights',
              'SEO-optimized blog generation',
              'Advanced social media content',
              'Strategic meeting summaries',
              'Complex problem solving'
            ],
            isActive: healthCheck.activeService === 'OpenAI GPT-4o',
            isPro: true
          },
          {
            name: 'Anthropic Claude',
            description: 'Thoughtful AI with excellent analytical capabilities',
            features: [
              'Detailed content analysis',
              'Professional writing assistance',
              'Comprehensive research summaries',
              'Contextual understanding'
            ],
            isActive: healthCheck.activeService === 'Anthropic Claude',
            isPro: true
          }
        ]
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching AI settings:', error);
      res.status(500).json({ error: 'Failed to fetch AI settings' });
    }
  });

  // Update Pro AI setting
  app.post('/api/ai/settings', async (req: Request, res: Response) => {
    try {
      const { enableProAI } = req.body;
      
      if (typeof enableProAI !== 'boolean') {
        return res.status(400).json({ error: 'enableProAI must be a boolean' });
      }

      // Update the setting
      isProAIUserSetting = enableProAI;
      
      // Update environment variable for current session
      process.env.IS_PRO_AI_USER = enableProAI.toString();

      // Get updated model status
      const healthCheck = await checkAIServiceHealth();
      
      const response: AISettingsResponse = {
        currentModel: healthCheck.activeService,
        isProAIUser: isProAIUserSetting,
        availableModels: [
          {
            name: 'Mistral 7B',
            description: 'Fast and efficient AI model included with your Smart Site',
            features: [
              'Smart assistant responses',
              'Basic content summarization', 
              'Simple content generation',
              'Quick insights analysis'
            ],
            isActive: healthCheck.activeService === 'Mistral 7B',
            isPro: false
          },
          {
            name: 'OpenAI GPT-4o',
            description: 'Advanced AI model with superior reasoning and creativity',
            features: [
              'Deep trend analysis and insights',
              'SEO-optimized blog generation',
              'Advanced social media content',
              'Strategic meeting summaries',
              'Complex problem solving'
            ],
            isActive: healthCheck.activeService === 'OpenAI GPT-4o',
            isPro: true
          },
          {
            name: 'Anthropic Claude',
            description: 'Thoughtful AI with excellent analytical capabilities',
            features: [
              'Detailed content analysis',
              'Professional writing assistance',
              'Comprehensive research summaries',
              'Contextual understanding'
            ],
            isActive: healthCheck.activeService === 'Anthropic Claude',
            isPro: true
          }
        ]
      };

      res.json(response);
    } catch (error) {
      console.error('Error updating AI settings:', error);
      res.status(500).json({ error: 'Failed to update AI settings' });
    }
  });

  console.log('✅ AI Settings routes registered');
}