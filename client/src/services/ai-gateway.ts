// AI Gateway Client Service
// Unified interface for all AI features in the SmartSite admin panel

export interface AIGatewayRequest {
  prompt: string;
  context?: object;
  taskType: 'assistant' | 'insight-trends' | 'social-post' | 'blog-post' | 'theme-to-blog' | 'theme-to-agenda';
  temperature?: number;
  maxTokens?: number;
}

export interface AIGatewayResponse {
  status: 'success' | 'error';
  data: string;
  taskType: string;
  error?: string;
}

export interface AIServiceHealth {
  proAI: boolean;
  mistral: boolean;
  anthropic: boolean;
  activeService: string;
}

class AIGatewayClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api/ai';
  }

  /**
   * Send request to AI Gateway
   */
  async sendRequest(request: AIGatewayRequest): Promise<AIGatewayResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/gateway`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('AI Gateway request failed:', error);
      return {
        status: 'error',
        data: '',
        taskType: request.taskType,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  /**
   * Admin Assistant - General help and guidance
   */
  async askAssistant(prompt: string, context?: object): Promise<AIGatewayResponse> {
    return this.sendRequest({
      prompt,
      context,
      taskType: 'assistant'
    });
  }

  /**
   * Insight Trends - Analyze insights data for patterns
   */
  async analyzeInsightTrends(insights: object[], prompt?: string): Promise<AIGatewayResponse> {
    return this.sendRequest({
      prompt: prompt || 'Analyze these insights and identify key trends, patterns, and actionable recommendations.',
      context: { insights },
      taskType: 'insight-trends'
    });
  }

  /**
   * Social Media Generator - Create engaging social posts
   */
  async generateSocialPost(prompt: string, context?: object): Promise<AIGatewayResponse> {
    return this.sendRequest({
      prompt,
      context,
      taskType: 'social-post',
      temperature: 0.8 // Higher creativity for social content
    });
  }

  /**
   * Blog Post Generator - Write comprehensive blog posts
   */
  async generateBlogPost(prompt: string, context?: object): Promise<AIGatewayResponse> {
    return this.sendRequest({
      prompt,
      context,
      taskType: 'blog-post',
      maxTokens: 1500
    });
  }

  /**
   * Theme to Blog - Convert themes/insights into blog articles
   */
  async themeToBlog(theme: string, context?: object): Promise<AIGatewayResponse> {
    return this.sendRequest({
      prompt: `Convert this theme into a complete blog article: ${theme}`,
      context,
      taskType: 'theme-to-blog',
      maxTokens: 1500
    });
  }

  /**
   * Theme to Agenda - Transform themes into meeting agendas
   */
  async themeToAgenda(theme: string, context?: object): Promise<AIGatewayResponse> {
    return this.sendRequest({
      prompt: `Create a structured meeting agenda based on this theme: ${theme}`,
      context,
      taskType: 'theme-to-agenda'
    });
  }

  /**
   * Check AI service health
   */
  async checkHealth(): Promise<{ status: string; services?: AIServiceHealth; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('AI Gateway health check failed:', error);
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  /**
   * Get available task types
   */
  async getTaskTypes(): Promise<{ status: string; taskTypes?: any[]; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/tasks`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get task types:', error);
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }
}

// Export singleton instance
export const aiGateway = new AIGatewayClient();

// Export helper functions for specific use cases
export const aiAssistant = {
  ask: (prompt: string, context?: object) => aiGateway.askAssistant(prompt, context)
};

export const aiInsights = {
  analyzeTrends: (insights: object[], prompt?: string) => aiGateway.analyzeInsightTrends(insights, prompt)
};

export const aiContent = {
  generateSocialPost: (prompt: string, context?: object) => aiGateway.generateSocialPost(prompt, context),
  generateBlogPost: (prompt: string, context?: object) => aiGateway.generateBlogPost(prompt, context),
  themeToBlog: (theme: string, context?: object) => aiGateway.themeToBlog(theme, context),
  themeToAgenda: (theme: string, context?: object) => aiGateway.themeToAgenda(theme, context)
};

export default aiGateway;