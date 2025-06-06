import { Router } from 'express';
import { processAIRequest, checkAIServiceHealth, AIGatewayRequest, processAIRequestWithFallback } from '../services/ai-gateway';
import { storage } from '../storage';

const router = Router();

// POST /api/ai/gateway - Main AI Gateway endpoint
router.post('/gateway', async (req, res) => {
  try {
    const { prompt, context, taskType, temperature, maxTokens, tenantId } = req.body;

    // Validate required fields
    if (!prompt || !taskType) {
      return res.status(400).json({
        status: 'error',
        data: '',
        taskType: taskType || 'unknown',
        error: 'Missing required fields: prompt and taskType'
      });
    }

    // Validate taskType
    const validTaskTypes = ['assistant', 'insight-trends', 'social-post', 'blog-post', 'theme-to-blog', 'theme-to-agenda'];
    if (!validTaskTypes.includes(taskType)) {
      return res.status(400).json({
        status: 'error',
        data: '',
        taskType,
        error: `Invalid taskType. Must be one of: ${validTaskTypes.join(', ')}`
      });
    }

    // Validate optional numeric parameters
    if (temperature !== undefined && (typeof temperature !== 'number' || temperature < 0 || temperature > 2)) {
      return res.status(400).json({
        status: 'error',
        data: '',
        taskType,
        error: 'Temperature must be a number between 0 and 2'
      });
    }

    if (maxTokens !== undefined && (typeof maxTokens !== 'number' || maxTokens < 1 || maxTokens > 4000)) {
      return res.status(400).json({
        status: 'error',
        data: '',
        taskType,
        error: 'maxTokens must be a number between 1 and 4000'
      });
    }

    // Process the AI request
    const aiRequest: AIGatewayRequest = {
      prompt,
      context,
      taskType,
      temperature,
      maxTokens
    };

    const response = await processAIRequest(aiRequest, tenantId || "00000000-0000-0000-0000-000000000000");
    
    // Log the request for monitoring
    console.log(`[AI Gateway] ${taskType} request processed - Status: ${response.status}`);
    
    return res.json(response);

  } catch (error) {
    console.error('[AI Gateway] Unexpected error:', error);
    return res.status(500).json({
      status: 'error',
      data: '',
      taskType: req.body.taskType || 'unknown',
      error: 'Internal server error'
    });
  }
});

// POST /api/ai/gateway/fallback - Fallback endpoint for Mistral when limits exceeded
router.post('/gateway/fallback', async (req, res) => {
  try {
    const { prompt, context, taskType, temperature, maxTokens, tenantId } = req.body;

    // Validate required fields
    if (!prompt || !taskType) {
      return res.status(400).json({
        status: 'error',
        data: '',
        taskType: taskType || 'unknown',
        error: 'Missing required fields: prompt and taskType'
      });
    }

    // Validate taskType
    const validTaskTypes = ['assistant', 'insight-trends', 'social-post', 'blog-post', 'theme-to-blog', 'theme-to-agenda'];
    if (!validTaskTypes.includes(taskType)) {
      return res.status(400).json({
        status: 'error',
        data: '',
        taskType,
        error: `Invalid taskType. Must be one of: ${validTaskTypes.join(', ')}`
      });
    }

    // Process the AI request with forced Mistral fallback
    const aiRequest: AIGatewayRequest = {
      prompt,
      context,
      taskType,
      temperature,
      maxTokens
    };

    const response = await processAIRequestWithFallback(aiRequest, tenantId || "00000000-0000-0000-0000-000000000000");
    
    // Log the fallback request for monitoring
    console.log(`[AI Gateway] ${taskType} fallback request processed - Status: ${response.status}`);
    
    return res.json(response);

  } catch (error) {
    console.error('[AI Gateway] Fallback endpoint error:', error);
    return res.status(500).json({
      status: 'error',
      data: '',
      taskType: req.body.taskType || 'unknown',
      error: 'Internal server error'
    });
  }
});

// POST /api/ai/usage/fallback - Track fallback usage acceptance
router.post('/usage/fallback', async (req, res) => {
  try {
    const { tenantId, taskType } = req.body;
    
    // Log that user accepted fallback (for analytics)
    await storage.logAiUsage({
      tenantId: tenantId || "00000000-0000-0000-0000-000000000000",
      modelUsed: 'mistral-7b-fallback-accepted',
      taskType: taskType || 'assistant',
      success: true,
      responseTimeMs: 0,
      errorMessage: null
    });

    return res.json({ success: true, message: 'Fallback usage logged' });
  } catch (error) {
    console.error('[AI Gateway] Error logging fallback usage:', error);
    return res.status(500).json({ success: false, error: 'Failed to log fallback usage' });
  }
});

// GET /api/ai/health - Check AI service health
router.get('/health', async (req, res) => {
  try {
    const healthStatus = await checkAIServiceHealth();
    return res.json({
      status: 'success',
      services: healthStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[AI Gateway] Health check error:', error);
    return res.status(500).json({
      status: 'error',
      error: 'Failed to check AI service health'
    });
  }
});

// GET /api/ai/tasks - List available task types
router.get('/tasks', (req, res) => {
  const taskTypes = [
    {
      type: 'assistant',
      description: 'SmartSite admin assistant for general help and guidance'
    },
    {
      type: 'insight-trends',
      description: 'Analyze insights data to identify trends and patterns'
    },
    {
      type: 'social-post',
      description: 'Generate engaging social media content'
    },
    {
      type: 'blog-post',
      description: 'Write comprehensive blog posts'
    },
    {
      type: 'theme-to-blog',
      description: 'Convert themes or insights into blog articles'
    },
    {
      type: 'theme-to-agenda',
      description: 'Transform themes into structured meeting agendas'
    }
  ];

  return res.json({
    status: 'success',
    taskTypes
  });
});

export default router;