import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { storage } from '../storage';
import { AIEventLogger } from './ai-event-logger';

// Configuration for AI usage limits
const DEFAULT_PRO_AI_LIMIT = 100; // calls per month
const FALLBACK_AVAILABLE = true;

// Function to check AI usage limits
async function checkUsageLimits(tenantId: string, isProAIUser: boolean): Promise<{
  allowed: boolean;
  currentUsage: number;
  limit: number;
  message?: string;
}> {
  try {
    // Get current month usage for this tenant
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const usageStats = await storage.getAIUsageStats(tenantId, startOfMonth, endOfMonth);
    
    if (!isProAIUser) {
      // Free users have unlimited Mistral access
      return {
        allowed: true,
        currentUsage: usageStats.totalCalls,
        limit: -1 // Unlimited
      };
    }

    // Pro AI users have monthly limits
    const limit = DEFAULT_PRO_AI_LIMIT;
    const allowed = usageStats.currentMonthUsage < limit;

    return {
      allowed,
      currentUsage: usageStats.currentMonthUsage,
      limit,
      message: allowed ? undefined : "You have reached your Pro AI usage limit for this month."
    };
  } catch (error) {
    console.error('[AI Gateway] Error checking usage limits:', error);
    // On error, allow the request to proceed to avoid blocking users
    return {
      allowed: true,
      currentUsage: 0,
      limit: DEFAULT_PRO_AI_LIMIT
    };
  }
}

// AI Gateway Types
export interface AIGatewayRequest {
  prompt: string;
  context?: object;
  taskType: 'assistant' | 'insight-trends' | 'social-post' | 'blog-post' | 'theme-to-blog' | 'theme-to-agenda' | 'theme-to-product-ideas';
  temperature?: number;
  maxTokens?: number;
}

export interface AIGatewayResponse {
  status: 'success' | 'error' | 'limit-exceeded';
  data: string;
  taskType: string;
  error?: string;
  message?: string;
  fallbackAvailable?: boolean;
}

// Configuration
const IS_PRO_AI_USER = process.env.IS_PRO_AI_USER === 'true' || false;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MISTRAL_API_URL = process.env.MISTRAL_API_URL || 'http://localhost:11434'; // Default Ollama URL

// Initialize AI clients
const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;
const anthropic = ANTHROPIC_API_KEY ? new Anthropic({ apiKey: ANTHROPIC_API_KEY }) : null;

// Task-specific prompts and configurations
const TASK_CONFIGS = {
  'assistant': {
    systemPrompt: 'You are a helpful SmartSite admin assistant. Provide clear, actionable guidance for managing the admin panel.',
    defaultTemperature: 0.7,
    defaultMaxTokens: 500
  },
  'insight-trends': {
    systemPrompt: 'Analyze the provided insights data and identify key trends, patterns, and actionable recommendations.',
    defaultTemperature: 0.3,
    defaultMaxTokens: 800
  },
  'social-post': {
    systemPrompt: 'Generate engaging social media content that is professional, on-brand, and optimized for engagement.',
    defaultTemperature: 0.8,
    defaultMaxTokens: 300
  },
  'blog-post': {
    systemPrompt: 'Write a comprehensive, well-structured blog post that provides value to readers and maintains professional tone.',
    defaultTemperature: 0.7,
    defaultMaxTokens: 1500
  },
  'theme-to-blog': {
    systemPrompt: 'Convert the provided theme or insight into a complete blog article with clear structure, engaging content, and professional tone.',
    defaultTemperature: 0.7,
    defaultMaxTokens: 1500
  },
  'theme-to-agenda': {
    systemPrompt: 'Transform the provided theme into a structured meeting agenda with clear objectives, discussion points, and action items.',
    defaultTemperature: 0.5,
    defaultMaxTokens: 800
  },
  'theme-to-product-ideas': {
    systemPrompt: `You are an Innovation Strategist with expertise in product development and market analysis. Generate creative, commercially viable product or service ideas based on provided themes and business context.

OUTPUT FORMAT:
Return exactly 5 product ideas in the following JSON structure:
{
  "ideas": [
    {
      "title": "Product/Service Name",
      "description": "Clear 2-3 sentence description of the product/service",
      "targetAudience": "Specific target market or customer segment",
      "valueProposition": "Key benefit and competitive advantage",
      "category": "Product category (e.g., Software, Service, Physical Product)"
    }
  ]
}

REQUIREMENTS:
- Each idea must be distinct and innovative
- Focus on practical, implementable solutions
- Consider market demand and feasibility
- Ensure ideas align with the provided business context
- Make value propositions compelling and specific`,
    defaultTemperature: 0.8,
    defaultMaxTokens: 1500
  }
};

// Mistral/Ollama API call
async function callMistralAPI(prompt: string, systemPrompt: string, temperature: number, maxTokens: number): Promise<string> {
  try {
    const response = await fetch(`${MISTRAL_API_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral:7b',
        prompt: `${systemPrompt}\n\nUser: ${prompt}`,
        stream: false,
        options: {
          temperature,
          num_predict: maxTokens,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response || '';
  } catch (error) {
    console.error('Mistral API call failed:', error);
    throw new Error('Failed to connect to local Mistral API');
  }
}

// OpenAI API call
async function callOpenAIAPI(prompt: string, systemPrompt: string, temperature: number, maxTokens: number): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature,
      max_tokens: maxTokens
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenAI API call failed:', error);
    throw new Error('Failed to call OpenAI API');
  }
}

// Anthropic API call (fallback)
async function callAnthropicAPI(prompt: string, systemPrompt: string, temperature: number, maxTokens: number): Promise<string> {
  if (!anthropic) {
    throw new Error('Anthropic API key not configured');
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514', // the newest Anthropic model is "claude-sonnet-4-20250514" which was released May 14, 2025. Use this by default unless user has already selected claude-3-7-sonnet-20250219
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: [
        { role: 'user', content: prompt }
      ]
    });

    const content = response.content[0];
    if (content && 'text' in content) {
      return content.text;
    }
    return '';
  } catch (error) {
    console.error('Anthropic API call failed:', error);
    throw new Error('Failed to call Anthropic API');
  }
}

// Main AI Gateway function
export async function processAIRequest(request: AIGatewayRequest, tenantId: string = "00000000-0000-0000-0000-000000000000"): Promise<AIGatewayResponse> {
  const startTime = Date.now();
  let modelUsed = '';
  let success = false;
  let errorMessage = '';

  try {
    const { prompt, context, taskType, temperature, maxTokens } = request;
    
    // Get task configuration
    const taskConfig = TASK_CONFIGS[taskType];
    if (!taskConfig) {
      errorMessage = `Unknown task type: ${taskType}`;
      return {
        status: 'error',
        data: '',
        taskType,
        error: errorMessage
      };
    }

    // Check usage limits for Pro AI users
    const usageLimitCheck = await checkUsageLimits(tenantId, IS_PRO_AI_USER);
    
    // If Pro AI user has exceeded their limit, return limit-exceeded response
    if (IS_PRO_AI_USER && !usageLimitCheck.allowed) {
      // Log the limit exceeded event
      try {
        await AIEventLogger.logEvent({
          tenantId,
          eventType: 'usage_limit_exceeded',
          modelUsed: 'gpt-4o',
          tokensUsed: null,
          detail: {
            taskType,
            currentUsage: usageLimitCheck.currentUsage,
            limit: usageLimitCheck.limit,
            fallbackAvailable: FALLBACK_AVAILABLE
          }
        });
      } catch (logError) {
        console.error('Failed to log limit exceeded event:', logError);
      }

      return {
        status: 'limit-exceeded',
        data: '',
        taskType,
        message: usageLimitCheck.message,
        fallbackAvailable: FALLBACK_AVAILABLE
      };
    }

    // Build enhanced prompt with context
    let enhancedPrompt = prompt;
    if (context) {
      enhancedPrompt = `Context: ${JSON.stringify(context)}\n\nRequest: ${prompt}`;
    }

    // Use provided values or defaults
    const finalTemperature = temperature ?? taskConfig.defaultTemperature;
    const finalMaxTokens = maxTokens ?? taskConfig.defaultMaxTokens;
    const systemPrompt = taskConfig.systemPrompt;

    let aiResponse: string;

    // Route to appropriate AI service based on user status and limits
    if (IS_PRO_AI_USER && usageLimitCheck.allowed && OPENAI_API_KEY) {
      // Pro users within limits get OpenAI GPT-4o
      modelUsed = 'gpt-4o';
      aiResponse = await callOpenAIAPI(enhancedPrompt, systemPrompt, finalTemperature, finalMaxTokens);
    } else if (ANTHROPIC_API_KEY) {
      // Fallback to Anthropic if available
      modelUsed = 'claude-3-sonnet';
      aiResponse = await callAnthropicAPI(enhancedPrompt, systemPrompt, finalTemperature, finalMaxTokens);
    } else {
      // Default to local Mistral 7B (unlimited for free users)
      modelUsed = 'mistral-7b';
      aiResponse = await callMistralAPI(enhancedPrompt, systemPrompt, finalTemperature, finalMaxTokens);
    }

    success = true;

    // Log successful AI usage
    try {
      await storage.logAiUsage({
        tenantId,
        taskType,
        modelUsed,
        tokensUsed: null, // Token counting can be added later
        success: true,
        errorMessage: null,
        metadata: {
          temperature: finalTemperature,
          maxTokens: finalMaxTokens,
          promptLength: enhancedPrompt.length,
          responseLength: aiResponse.length,
          processingTimeMs: Date.now() - startTime
        }
      });

      // Log AI event for analytics and Mission Control
      await AIEventLogger.logAiCall({
        tenantId,
        taskType,
        modelUsed,
        tokensUsed: null,
        detail: {
          temperature: finalTemperature,
          maxTokens: finalMaxTokens,
          promptLength: enhancedPrompt.length,
          responseLength: aiResponse.length,
          processingTimeMs: Date.now() - startTime
        }
      });

      // Special logging for product ideas generation
      if (taskType === 'theme-to-product-ideas') {
        await AIEventLogger.logProductIdeasGeneration({
          tenantId,
          modelUsed,
          selectedScope: context?.selectedScope,
          themeSummary: context?.themeSummary,
          tokensUsed: null
        });
      }
    } catch (logError) {
      console.error('Failed to log AI usage:', logError);
      // Don't fail the request if logging fails
    }

    return {
      status: 'success',
      data: aiResponse,
      taskType
    };

  } catch (error) {
    console.error('AI Gateway error:', error);
    errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    // Log failed AI usage
    try {
      await storage.logAiUsage({
        tenantId,
        taskType: request.taskType,
        modelUsed: modelUsed || 'unknown',
        tokensUsed: null,
        success: false,
        errorMessage,
        metadata: {
          processingTimeMs: Date.now() - startTime,
          error: errorMessage
        }
      });

      // Log AI error event for analytics and Mission Control
      await AIEventLogger.logEvent({
        tenantId,
        eventType: 'ai_error',
        modelUsed: modelUsed || 'unknown',
        tokensUsed: null,
        detail: {
          taskType: request.taskType,
          errorMessage,
          processingTimeMs: Date.now() - startTime
        }
      });
    } catch (logError) {
      console.error('Failed to log AI usage error:', logError);
    }

    return {
      status: 'error',
      data: '',
      taskType: request.taskType,
      error: errorMessage
    };
  }
}

// Helper function to check AI service availability
// Fallback function that forces Mistral usage regardless of user status
export async function processAIRequestWithFallback(request: AIGatewayRequest, tenantId: string = "00000000-0000-0000-0000-000000000000"): Promise<AIGatewayResponse> {
  const startTime = Date.now();
  let success = false;
  let errorMessage = '';

  try {
    const { prompt, context, taskType, temperature, maxTokens } = request;
    
    // Get task configuration
    const taskConfig = TASK_CONFIGS[taskType];
    if (!taskConfig) {
      errorMessage = `Unknown task type: ${taskType}`;
      return {
        status: 'error',
        data: '',
        taskType,
        error: errorMessage
      };
    }

    // Build enhanced prompt with context
    let enhancedPrompt = prompt;
    if (context) {
      enhancedPrompt = `Context: ${JSON.stringify(context)}\n\nRequest: ${prompt}`;
    }

    // Use provided values or defaults
    const finalTemperature = temperature ?? taskConfig.defaultTemperature;
    const finalMaxTokens = maxTokens ?? taskConfig.defaultMaxTokens;
    const systemPrompt = taskConfig.systemPrompt;

    // Force use of Mistral 7B
    const aiResponse = await callMistralAPI(enhancedPrompt, systemPrompt, finalTemperature, finalMaxTokens);
    success = true;

    // Log fallback AI usage
    try {
      await storage.logAiUsage({
        tenantId,
        modelUsed: 'mistral-7b-fallback',
        taskType,
        success: true,
        responseTimeMs: Date.now() - startTime,
        errorMessage: null
      });
    } catch (logError) {
      console.error('[AI Gateway] Failed to log fallback usage:', logError);
    }

    return {
      status: 'success',
      data: aiResponse,
      taskType
    };

  } catch (error) {
    success = false;
    errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    // Log failed fallback usage
    try {
      await storage.logAiUsage({
        tenantId,
        modelUsed: 'mistral-7b-fallback',
        taskType: request.taskType,
        success: false,
        responseTimeMs: Date.now() - startTime,
        errorMessage
      });
    } catch (logError) {
      console.error('[AI Gateway] Failed to log failed fallback usage:', logError);
    }

    console.error('[AI Gateway] Fallback request failed:', error);
    return {
      status: 'error',
      data: '',
      taskType: request.taskType,
      error: errorMessage
    };
  }
}

export async function checkAIServiceHealth(): Promise<{
  proAI: boolean;
  mistral: boolean;
  anthropic: boolean;
  activeService: string;
}> {
  return {
    proAI: IS_PRO_AI_USER && !!OPENAI_API_KEY,
    mistral: !!MISTRAL_API_URL,
    anthropic: !!ANTHROPIC_API_KEY,
    activeService: IS_PRO_AI_USER && OPENAI_API_KEY ? 'OpenAI GPT-4o' : 
                   ANTHROPIC_API_KEY ? 'Anthropic Claude' : 'Mistral 7B'
  };
}