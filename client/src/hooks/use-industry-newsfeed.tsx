import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useTenant } from '@/hooks/use-tenant';
import { NewsfeedConfig, NewsItem, IndustryCategory, PREDEFINED_FEEDS } from '@shared/newsfeed_types';
import { apiRequest } from '@/lib/queryClient';

export function useIndustryNewsfeed() {
  const { tenant } = useTenant();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const tenantId = tenant?.id;
  const industry = tenant?.industry as IndustryCategory;
  const [fetchError, setFetchError] = useState<Error | null>(null);

  // Get a predefined feed based on tenant industry - extracted outside as a reusable function
  const getPredefinedFeedForIndustry = useCallback((): NewsfeedConfig => {
    if (!industry || !PREDEFINED_FEEDS[industry]) {
      return PREDEFINED_FEEDS[IndustryCategory.ACCOUNTING];
    }
    return PREDEFINED_FEEDS[industry];
  }, [industry]);

  // Fetch newsfeed configuration and news items with additional error handling
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['/api/newsfeed/industry'],
    queryFn: async () => {
      try {
        const controller = new AbortController();
        // Set a timeout to prevent hanging requests
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch('/api/newsfeed/industry', {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch industry news: ${response.status} ${response.statusText}`);
        }
        
        const responseData = await response.json();
        
        // Validate response structure to prevent issues
        if (!responseData.items || !responseData.config) {
          console.warn('Invalid newsfeed response structure', responseData);
          return {
            items: [],
            config: getPredefinedFeedForIndustry()
          };
        }
        
        // Limit number of items to prevent memory issues
        if (Array.isArray(responseData.items) && responseData.items.length > 10) {
          responseData.items = responseData.items.slice(0, 10);
        }
        
        setFetchError(null);
        return responseData;
      } catch (e) {
        console.error('Error fetching newsfeed:', e);
        const error = e instanceof Error ? e : new Error('Unknown error fetching newsfeed');
        setFetchError(error);
        
        // Return a valid structure with empty data to prevent UI errors
        return {
          items: [],
          config: getPredefinedFeedForIndustry()
        };
      }
    },
    enabled: !!tenantId,
    retry: 1, // Only retry once to avoid excessive requests
    staleTime: 5 * 60 * 1000, // 5 minutes - don't fetch too frequently
    refetchOnWindowFocus: false, // Prevent excessive refetching
    refetchOnReconnect: false,
  });

  // Update newsfeed configuration mutation with additional error handling
  const updateConfigMutation = useMutation({
    mutationFn: async (config: NewsfeedConfig) => {
      try {
        // Validate incoming config before sending to avoid issues
        if (!config.url || !config.source || !config.displaySettings) {
          throw new Error('Invalid configuration: missing required fields');
        }
        
        // Limit item count to prevent memory issues
        if (config.displaySettings.itemCount > 10) {
          config.displaySettings.itemCount = 10;
        }
        
        const response = await apiRequest('POST', '/api/newsfeed/config', config);
        return response.json();
      } catch (e) {
        console.error('Error updating newsfeed config:', e);
        const error = e instanceof Error ? e : new Error('Unknown error updating configuration');
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Newsfeed Updated",
        description: "Your industry newsfeed settings have been updated",
      });
      // Invalidate cache to refresh data
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

  // The effective error can come from either the query or our state
  const effectiveError = error || fetchError;

  return {
    newsItems: data?.items as NewsItem[] || [],
    newsConfig: data?.config as NewsfeedConfig || getPredefinedFeedForIndustry(),
    isLoading,
    error: effectiveError,
    refetch,
    updateConfig: updateConfigMutation.mutate,
    isUpdating: updateConfigMutation.isPending,
    industry
  };
}

export default useIndustryNewsfeed;