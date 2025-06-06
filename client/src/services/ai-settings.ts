import { apiRequest } from '@/lib/queryClient';

export interface AIModel {
  name: string;
  description: string;
  features: string[];
  isActive: boolean;
  isPro: boolean;
}

export interface AIUsageStats {
  currentMonthUsage: number;
  proAILimit: number;
  isProAIUser: boolean;
  mostUsedModel: string;
  totalCalls: number;
}

export interface AISettingsResponse {
  currentModel: string;
  isProAIUser: boolean;
  availableModels: AIModel[];
  usage?: AIUsageStats;
}

export interface UpdateAISettingsRequest {
  enableProAI: boolean;
}

export const aiSettingsService = {
  async getSettings(): Promise<AISettingsResponse> {
    const response = await apiRequest('GET', '/api/ai/settings');
    return response.json();
  },

  async updateSettings(data: UpdateAISettingsRequest): Promise<AISettingsResponse> {
    const response = await apiRequest('POST', '/api/ai/settings', data);
    return response.json();
  },

  async getUsageStats(): Promise<AIUsageStats> {
    const response = await apiRequest('GET', '/api/ai/usage');
    return response.json();
  }
};