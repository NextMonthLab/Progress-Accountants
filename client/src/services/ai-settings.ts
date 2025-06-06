import { apiRequest } from '@/lib/queryClient';

export interface AIModel {
  name: string;
  description: string;
  features: string[];
  isActive: boolean;
  isPro: boolean;
}

export interface AISettingsResponse {
  currentModel: string;
  isProAIUser: boolean;
  availableModels: AIModel[];
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
  }
};