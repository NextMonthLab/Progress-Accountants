import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export interface AIGatewayRequest {
  prompt: string;
  context?: object;
  taskType: 'assistant' | 'insight-trends' | 'social-post' | 'blog-post' | 'theme-to-blog' | 'theme-to-agenda' | 'theme-to-product-ideas';
  temperature?: number;
  maxTokens?: number;
  tenantId?: string;
}

export interface AIGatewayResponse {
  status: 'success' | 'error' | 'limit-exceeded';
  data: string;
  taskType: string;
  error?: string;
  message?: string;
  fallbackAvailable?: boolean;
}

export interface UsageAlert {
  show: boolean;
  message: string;
  fallbackAvailable: boolean;
  taskType: string;
  originalRequest: AIGatewayRequest;
}

export function useAIGateway() {
  const { toast } = useToast();
  const [usageAlert, setUsageAlert] = useState<UsageAlert>({
    show: false,
    message: '',
    fallbackAvailable: false,
    taskType: '',
    originalRequest: { prompt: '', taskType: 'assistant' }
  });

  const aiGatewayMutation = useMutation({
    mutationFn: async (request: AIGatewayRequest): Promise<AIGatewayResponse> => {
      const response = await apiRequest('POST', '/api/ai/gateway', request);
      return response.json();
    },
    onSuccess: (data: AIGatewayResponse, variables: AIGatewayRequest) => {
      if (data.status === 'limit-exceeded') {
        setUsageAlert({
          show: true,
          message: data.message || 'You have reached your AI usage limit.',
          fallbackAvailable: data.fallbackAvailable || false,
          taskType: data.taskType,
          originalRequest: variables
        });
      } else if (data.status === 'error') {
        toast({
          title: 'AI Request Failed',
          description: data.error || 'An error occurred while processing your request.',
          variant: 'destructive',
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Connection Error',
        description: 'Failed to connect to AI service. Please try again.',
        variant: 'destructive',
      });
    }
  });

  const fallbackMutation = useMutation({
    mutationFn: async (request: AIGatewayRequest): Promise<AIGatewayResponse> => {
      const response = await apiRequest('POST', '/api/ai/gateway/fallback', request);
      return response.json();
    },
    onSuccess: (data: AIGatewayResponse) => {
      if (data.status === 'error') {
        toast({
          title: 'Fallback Request Failed',
          description: data.error || 'An error occurred while processing your fallback request.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Request Completed',
          description: 'Your request was processed using basic AI (Mistral 7B).',
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Fallback Failed',
        description: 'Failed to process your request with basic AI. Please try again.',
        variant: 'destructive',
      });
    }
  });

  const logFallbackAcceptance = async (tenantId: string, taskType: string) => {
    try {
      await apiRequest('POST', '/api/ai/usage/fallback', {
        tenantId,
        taskType
      });
    } catch (error) {
      console.warn('Failed to log fallback acceptance:', error);
    }
  };

  const handleUseFallback = async () => {
    if (!usageAlert.originalRequest) return;

    // Log that user accepted fallback
    await logFallbackAcceptance(
      usageAlert.originalRequest.tenantId || "00000000-0000-0000-0000-000000000000",
      usageAlert.taskType
    );

    // Execute the fallback request
    fallbackMutation.mutate(usageAlert.originalRequest);
    
    // Close the alert
    setUsageAlert(prev => ({ ...prev, show: false }));
  };

  const handleDismissAlert = () => {
    setUsageAlert(prev => ({ ...prev, show: false }));
  };

  const executeAIRequest = (request: AIGatewayRequest) => {
    aiGatewayMutation.mutate(request);
  };

  // Convenience methods for specific task types
  const generateProductIdeas = async (theme: string, context?: object): Promise<AIGatewayResponse> => {
    return new Promise((resolve, reject) => {
      const request: AIGatewayRequest = {
        prompt: `Generate innovative product or service ideas based on this theme and business context: ${theme}. Focus on actionable, market-ready concepts with clear value propositions.`,
        context,
        taskType: 'theme-to-product-ideas'
      };

      aiGatewayMutation.mutate(request, {
        onSuccess: (data) => resolve(data),
        onError: (error) => reject(error)
      });
    });
  };

  return {
    executeAIRequest,
    generateProductIdeas,
    handleUseFallback,
    handleDismissAlert,
    usageAlert,
    isLoading: aiGatewayMutation.isPending || fallbackMutation.isPending,
    response: aiGatewayMutation.data || fallbackMutation.data,
    error: aiGatewayMutation.error || fallbackMutation.error,
    isSuccess: aiGatewayMutation.isSuccess || fallbackMutation.isSuccess
  };
}