// Hook for CRM dashboard data and operations
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { crmApi } from '@/lib/api';
import { 
  ClientData, 
  ClientTask, 
  ClientMessage, 
  ClientDocument, 
  ClientNote,
  ActivityLogEntry
} from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

// Default staff ID for testing purposes
const DEFAULT_STAFF_ID = 1;
const DEFAULT_STAFF_NAME = "Sarah Williams";

export function useCrm(staffId: number = DEFAULT_STAFF_ID, staffName: string = DEFAULT_STAFF_NAME) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch all clients
  const { 
    data: clients, 
    isLoading: isClientsLoading, 
    error: clientsError 
  } = useQuery<ClientData[]>({
    queryKey: ['crmClients'],
    queryFn: async () => {
      const response = await crmApi.getAllClients();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch client data');
      }
      return response.data!;
    }
  });
  
  // Fetch single client details
  const useClientDetails = (clientId?: number) => {
    const { 
      data: client, 
      isLoading, 
      error 
    } = useQuery<ClientData>({
      queryKey: ['crmClient', clientId],
      queryFn: async () => {
        if (!clientId) throw new Error('Client ID is required');
        const response = await crmApi.getClientById(clientId);
        if (!response.success) {
          throw new Error(response.error || 'Failed to fetch client details');
        }
        return response.data!;
      },
      enabled: !!clientId // Only run if clientId is provided
    });
    
    return { client, isLoading, error };
  };
  
  // Fetch activity log
  const useActivityLog = (clientId?: number) => {
    const { 
      data: activityLog, 
      isLoading, 
      error 
    } = useQuery<ActivityLogEntry[]>({
      queryKey: ['crmActivityLog', clientId],
      queryFn: async () => {
        const response = await crmApi.getActivityLog(clientId);
        if (!response.success) {
          throw new Error(response.error || 'Failed to fetch activity log');
        }
        return response.data!;
      }
    });
    
    return { activityLog, isLoading, error };
  };
  
  // Mutation to add a note
  const addNoteMutation = useMutation({
    mutationFn: async ({ 
      clientId, 
      content, 
      isPrivate 
    }: { 
      clientId: number; 
      content: string; 
      isPrivate: boolean; 
    }) => {
      const response = await crmApi.addNote(clientId, content, isPrivate, staffId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to add note');
      }
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch client data after adding a note
      queryClient.invalidateQueries({ queryKey: ['crmClient', data.clientId] });
      queryClient.invalidateQueries({ queryKey: ['crmActivityLog', data.clientId] });
      
      toast({
        title: "Note added",
        description: "Note has been added successfully.",
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
  
  // Mutation to update task status
  const updateTaskStatusMutation = useMutation({
    mutationFn: async ({ 
      clientId, 
      taskId, 
      status 
    }: { 
      clientId: number; 
      taskId: number; 
      status: 'pending' | 'overdue' | 'completed'; 
    }) => {
      const response = await crmApi.updateTaskStatus(clientId, taskId, status, staffId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update task status');
      }
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch client data after updating task
      queryClient.invalidateQueries({ queryKey: ['crmClient', data.clientId] });
      queryClient.invalidateQueries({ queryKey: ['crmActivityLog', data.clientId] });
      
      toast({
        title: "Task updated",
        description: `Task has been marked as ${data.status}.`,
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
  
  // Mutation to send message to client
  const sendMessageMutation = useMutation({
    mutationFn: async ({ 
      clientId, 
      content 
    }: { 
      clientId: number; 
      content: string; 
    }) => {
      const response = await crmApi.sendMessageToClient(
        clientId, 
        content, 
        staffId, 
        staffName
      );
      if (!response.success) {
        throw new Error(response.error || 'Failed to send message');
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Optimistically update the UI
      queryClient.setQueryData(['crmClient', variables.clientId], (oldData: ClientData | undefined) => {
        if (!oldData) return undefined;
        return {
          ...oldData,
          messages: [data, ...oldData.messages]
        };
      });
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['crmActivityLog', variables.clientId] });
      
      toast({
        title: "Message sent",
        description: "Message has been sent to the client.",
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
  
  // Mutation to upload document for client
  const uploadDocumentMutation = useMutation({
    mutationFn: async ({ 
      clientId, 
      file 
    }: { 
      clientId: number; 
      file: { name: string; type: string; size: string; }; 
    }) => {
      const response = await crmApi.uploadDocumentForClient(clientId, file, staffId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to upload document');
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['crmClient', variables.clientId] });
      queryClient.invalidateQueries({ queryKey: ['crmActivityLog', variables.clientId] });
      
      toast({
        title: "Document uploaded",
        description: `"${data.name}" has been uploaded for the client.`,
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
  
  // Mutation to create task for client
  const createTaskMutation = useMutation({
    mutationFn: async ({ 
      clientId, 
      task 
    }: { 
      clientId: number; 
      task: Omit<ClientTask, 'id' | 'createdAt'>; 
    }) => {
      const response = await crmApi.createTask(clientId, task, staffId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create task');
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['crmClient', variables.clientId] });
      queryClient.invalidateQueries({ queryKey: ['crmActivityLog', variables.clientId] });
      
      toast({
        title: "Task created",
        description: `Task "${data.title}" has been created successfully.`,
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
  
  return {
    // Main client list data
    clients,
    isClientsLoading,
    clientsError,
    
    // Hooks for client details and activity log
    useClientDetails,
    useActivityLog,
    
    // Mutations
    addNote: addNoteMutation.mutate,
    isAddingNote: addNoteMutation.isPending,
    
    updateTaskStatus: updateTaskStatusMutation.mutate,
    isUpdatingTask: updateTaskStatusMutation.isPending,
    
    sendMessage: sendMessageMutation.mutate,
    isSendingMessage: sendMessageMutation.isPending,
    
    uploadDocument: uploadDocumentMutation.mutate,
    isUploadingDocument: uploadDocumentMutation.isPending,
    
    createTask: createTaskMutation.mutate,
    isCreatingTask: createTaskMutation.isPending,
    
    // Staff info
    staffId,
    staffName,
  };
}