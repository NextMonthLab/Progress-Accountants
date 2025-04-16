// Hook for client dashboard data and operations
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clientDashboardApi } from '@/lib/api';
import { ClientDashboardData, ClientMessage, ClientDocument, ActivityLogEntry } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

// Default client ID for testing purposes
const DEFAULT_CLIENT_ID = 1; 

export function useClientDashboard(clientId: number = DEFAULT_CLIENT_ID) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch the client dashboard data
  const { 
    data: dashboardData, 
    isLoading: isDashboardLoading, 
    error: dashboardError 
  } = useQuery<ClientDashboardData>({
    queryKey: ['clientDashboard', clientId],
    queryFn: async () => {
      const response = await clientDashboardApi.getClientDashboard(clientId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch dashboard data');
      }
      return response.data!;
    }
  });
  
  // Fetch activity log for the client
  const {
    data: activityLog,
    isLoading: isActivityLogLoading,
    error: activityLogError
  } = useQuery<ActivityLogEntry[]>({
    queryKey: ['clientActivityLog', clientId],
    queryFn: async () => {
      const response = await clientDashboardApi.getActivityLog(clientId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch activity log');
      }
      return response.data!;
    }
  });
  
  // Mutation to mark a task as completed
  const completeTaskMutation = useMutation({
    mutationFn: async (taskId: number) => {
      const response = await clientDashboardApi.completeTask(taskId, clientId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to complete task');
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch data after task completion
      queryClient.invalidateQueries({ queryKey: ['clientDashboard', clientId] });
      queryClient.invalidateQueries({ queryKey: ['clientActivityLog', clientId] });
      
      toast({
        title: "Task completed",
        description: "Your task has been marked as completed.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Mutation to send a message
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await clientDashboardApi.sendMessage(content, clientId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to send message');
      }
      return response.data!;
    },
    onSuccess: (newMessage: ClientMessage) => {
      // Optimistically update the UI
      queryClient.setQueryData(['clientDashboard', clientId], (oldData: ClientDashboardData | undefined) => {
        if (!oldData) return undefined;
        return {
          ...oldData,
          messages: [newMessage, ...oldData.messages]
        };
      });
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['clientActivityLog', clientId] });
      
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Mutation to upload a document
  const uploadDocumentMutation = useMutation({
    mutationFn: async (file: { name: string, type: string, size: string }) => {
      const response = await clientDashboardApi.uploadDocument(file, clientId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to upload document');
      }
      return response.data;
    },
    onSuccess: (document: ClientDocument) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['clientDashboard', clientId] });
      queryClient.invalidateQueries({ queryKey: ['clientActivityLog', clientId] });
      
      toast({
        title: "Document uploaded",
        description: `"${document.name}" has been uploaded successfully.`,
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  return {
    // Data
    dashboardData,
    activityLog,
    
    // Loading states
    isDashboardLoading,
    isActivityLogLoading,
    
    // Errors
    dashboardError,
    activityLogError,
    
    // Mutations
    completeTask: completeTaskMutation.mutate,
    isCompletingTask: completeTaskMutation.isPending,
    
    sendMessage: sendMessageMutation.mutate,
    isSendingMessage: sendMessageMutation.isPending,
    
    uploadDocument: uploadDocumentMutation.mutate,
    isUploadingDocument: uploadDocumentMutation.isPending,
    
    // Client info
    clientId,
  };
}