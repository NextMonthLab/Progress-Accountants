import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useTenant } from '@/hooks/use-tenant';
import { NewsfeedConfig, NewsItem, IndustryCategory, PREDEFINED_FEEDS } from '@shared/newsfeed_types';
import { queryClient, apiRequest } from '@/lib/queryClient';

export function useIndustryNewsfeed() {
  const { tenant } = useTenant();
  const { toast } = useToast();
  const tenantId = tenant?.id;
  const industry = tenant?.industry as IndustryCategory;

  // Fetch newsfeed configuration and news items
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['/api/newsfeed/industry'],
    queryFn: async () => {
      const response = await fetch('/api/newsfeed/industry');
      if (!response.ok) {
        throw new Error('Failed to fetch industry news');
      }
      return response.json();
    },
    enabled: !!tenantId,
  });

  // Update newsfeed configuration mutation
  const updateConfigMutation = useMutation({
    mutationFn: async (config: NewsfeedConfig) => {
      const response = await apiRequest('POST', '/api/newsfeed/config', config);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Newsfeed Updated",
        description: "Your industry newsfeed settings have been updated",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/newsfeed/industry'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Get a predefined feed based on tenant industry
  const getPredefinedFeedForIndustry = (): NewsfeedConfig | undefined => {
    if (!industry) return PREDEFINED_FEEDS[IndustryCategory.ACCOUNTING];
    return PREDEFINED_FEEDS[industry] || PREDEFINED_FEEDS[IndustryCategory.ACCOUNTING];
  };

  return {
    newsItems: data?.items as NewsItem[] || [],
    newsConfig: data?.config as NewsfeedConfig || getPredefinedFeedForIndustry(),
    isLoading,
    error,
    refetch,
    updateConfig: updateConfigMutation.mutate,
    isUpdating: updateConfigMutation.isPending,
    industry
  };
}

export default useIndustryNewsfeed;