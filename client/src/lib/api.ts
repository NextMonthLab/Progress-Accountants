// Mock API service for local development
import { 
  ApiResponse, 
  ClientData, 
  ClientDashboardData,
  ActivityLogEntry,
  ClientTask,
  ClientMessage,
  ClientDocument
} from './types';
import { 
  mockClients, 
  mockClientDashboard, 
  mockActivityLog 
} from './mockData';

// In-memory storage (would be replaced with real API calls)
let clients = [...mockClients];
let clientDashboard = { ...mockClientDashboard };
let activityLog = [...mockActivityLog];

// Helper functions

// Generate unique ID for new entities
const generateId = (entityType: string): number => {
  switch(entityType) {
    case 'client': return Math.max(...clients.map(c => c.id)) + 1;
    case 'task': return Math.max(...clients.flatMap(c => c.tasks.map(t => t.id)), 
                               ...clientDashboard.tasks.map(t => t.id)) + 1;
    case 'message': return Math.max(...clients.flatMap(c => c.messages.map(m => m.id)),
                                  ...clientDashboard.messages.map(m => m.id)) + 1;
    case 'document': return Math.max(...clients.flatMap(c => c.documents.map(d => d.id))) + 1;
    case 'activity': return Math.max(...activityLog.map(a => a.id)) + 1;
    default: return Date.now();
  }
};

// Get current timestamp
const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

// Add entry to activity log
const logActivity = (
  userId: number, 
  userType: 'staff' | 'client',
  actionType: ActivityLogEntry['actionType'],
  entityType: ActivityLogEntry['entityType'],
  entityId: number | undefined,
  description: string,
  metadata?: Record<string, any>
): ActivityLogEntry => {
  const newLogEntry: ActivityLogEntry = {
    id: generateId('activity'),
    userId,
    userType,
    actionType,
    entityType,
    entityId,
    description,
    timestamp: getCurrentTimestamp(),
    metadata
  };
  
  activityLog = [newLogEntry, ...activityLog];
  console.log('Activity logged:', newLogEntry);
  return newLogEntry;
};

// API functions
// These would be replaced with actual API calls to the backend

// Client Dashboard API
export const clientDashboardApi = {
  // Get client dashboard data
  getClientDashboard: async (clientId: number): Promise<ApiResponse<ClientDashboardData>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Log the activity
    logActivity(
      clientId,
      'client',
      'view',
      'client',
      clientId,
      `Viewed client dashboard for client ID ${clientId}`
    );
    
    return {
      success: true,
      data: clientDashboard
    };
  },
  
  // Mark task as done
  completeTask: async (taskId: number, clientId: number): Promise<ApiResponse<{ taskId: number }>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find and update the task in client dashboard
    const taskIndex = clientDashboard.tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex !== -1) {
      // Update task status
      clientDashboard.tasks[taskIndex].status = 'completed';
      
      // Log the activity
      logActivity(
        clientId,
        'client',
        'complete',
        'task',
        taskId,
        `Completed task "${clientDashboard.tasks[taskIndex].title}"`
      );
      
      return {
        success: true,
        data: { taskId },
        message: 'Task marked as completed'
      };
    }
    
    return {
      success: false,
      error: 'Task not found'
    };
  },
  
  // Send a message
  sendMessage: async (
    content: string, 
    clientId: number,
    attachments?: { name: string, url: string }[]
  ): Promise<ApiResponse<ClientMessage>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create new message
    const newMessage: ClientMessage = {
      id: generateId('message'),
      sender: {
        id: clientId,
        name: `${clientDashboard.client.firstName} ${clientDashboard.client.lastName}`,
        isStaff: false
      },
      content,
      timestamp: getCurrentTimestamp(),
      read: false,
      attachments
    };
    
    // Add to client dashboard messages
    clientDashboard.messages = [newMessage, ...clientDashboard.messages];
    
    // Also add to the client messages in CRM
    const clientIndex = clients.findIndex(c => c.id === clientId);
    if (clientIndex !== -1) {
      clients[clientIndex].messages = [newMessage, ...clients[clientIndex].messages];
    }
    
    // Log the activity
    logActivity(
      clientId,
      'client',
      'message',
      'message',
      newMessage.id,
      `Sent message: "${content.substring(0, 30)}${content.length > 30 ? '...' : ''}"`
    );
    
    return {
      success: true,
      data: newMessage,
      message: 'Message sent successfully'
    };
  },
  
  // Upload a file
  uploadDocument: async (
    file: { name: string, type: string, size: string },
    clientId: number
  ): Promise<ApiResponse<ClientDocument>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Create new document object
    const newDocument: ClientDocument = {
      id: generateId('document'),
      name: file.name,
      type: file.type,
      uploadedBy: clientId,
      isStaffUpload: false,
      uploadDate: getCurrentTimestamp().split('T')[0],
      size: file.size,
      url: "#", // This would be a real URL in production
      category: determineCategory(file.name)
    };
    
    // Add to client's documents in CRM
    const clientIndex = clients.findIndex(c => c.id === clientId);
    if (clientIndex !== -1) {
      clients[clientIndex].documents = [newDocument, ...clients[clientIndex].documents];
    }
    
    // Log the activity
    logActivity(
      clientId,
      'client',
      'upload',
      'document',
      newDocument.id,
      `Uploaded document "${file.name}"`
    );
    
    return {
      success: true,
      data: newDocument,
      message: 'Document uploaded successfully'
    };
  },
  
  // Get activity log for client
  getActivityLog: async (clientId: number): Promise<ApiResponse<ActivityLogEntry[]>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Filter activity log for this client
    const clientActivityLog = activityLog.filter(
      log => log.userId === clientId || 
      (log.entityType === 'client' && log.entityId === clientId)
    );
    
    return {
      success: true,
      data: clientActivityLog
    };
  }
};

// CRM API
export const crmApi = {
  // Get all clients
  getAllClients: async (): Promise<ApiResponse<ClientData[]>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Log the activity
    logActivity(
      1, // Assuming staff ID 1 for demo
      'staff',
      'view',
      'client',
      undefined,
      'Viewed all clients'
    );
    
    return {
      success: true,
      data: clients
    };
  },
  
  // Get client by ID
  getClientById: async (clientId: number): Promise<ApiResponse<ClientData>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const client = clients.find(c => c.id === clientId);
    
    if (!client) {
      return {
        success: false,
        error: 'Client not found'
      };
    }
    
    // Log the activity
    logActivity(
      1, // Assuming staff ID 1 for demo
      'staff',
      'view',
      'client',
      clientId,
      `Viewed client "${client.businessName}"`
    );
    
    return {
      success: true,
      data: client
    };
  },
  
  // Add a note to client
  addNote: async (
    clientId: number, 
    content: string, 
    isPrivate: boolean, 
    staffId: number
  ): Promise<ApiResponse<{ clientId: number, noteId: number }>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const clientIndex = clients.findIndex(c => c.id === clientId);
    
    if (clientIndex === -1) {
      return {
        success: false,
        error: 'Client not found'
      };
    }
    
    // Create new note
    const newNote = {
      id: Math.max(...clients.flatMap(c => c.notes.map(n => n.id))) + 1,
      content,
      createdBy: staffId,
      createdAt: getCurrentTimestamp(),
      isPrivate
    };
    
    // Add note to client
    clients[clientIndex].notes = [newNote, ...clients[clientIndex].notes];
    
    // Log the activity
    logActivity(
      staffId,
      'staff',
      'create',
      'note',
      newNote.id,
      `Added ${isPrivate ? 'private' : ''} note to client "${clients[clientIndex].businessName}"`,
      { isPrivate }
    );
    
    return {
      success: true,
      data: { clientId, noteId: newNote.id },
      message: 'Note added successfully'
    };
  },
  
  // Update task status
  updateTaskStatus: async (
    clientId: number,
    taskId: number,
    status: 'pending' | 'overdue' | 'completed',
    staffId: number
  ): Promise<ApiResponse<{ clientId: number, taskId: number, status: string }>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const clientIndex = clients.findIndex(c => c.id === clientId);
    
    if (clientIndex === -1) {
      return {
        success: false,
        error: 'Client not found'
      };
    }
    
    const taskIndex = clients[clientIndex].tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
      return {
        success: false,
        error: 'Task not found'
      };
    }
    
    const oldStatus = clients[clientIndex].tasks[taskIndex].status;
    
    // Update task status
    clients[clientIndex].tasks[taskIndex].status = status;
    
    // Log the activity
    logActivity(
      staffId,
      'staff',
      'update',
      'task',
      taskId,
      `Updated task "${clients[clientIndex].tasks[taskIndex].title}" status from ${oldStatus} to ${status}`,
      { previousStatus: oldStatus, status }
    );
    
    return {
      success: true,
      data: { clientId, taskId, status },
      message: 'Task status updated successfully'
    };
  },
  
  // Send message to client
  sendMessageToClient: async (
    clientId: number,
    content: string,
    staffId: number,
    staffName: string,
    attachments?: { name: string, url: string }[]
  ): Promise<ApiResponse<ClientMessage>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const clientIndex = clients.findIndex(c => c.id === clientId);
    
    if (clientIndex === -1) {
      return {
        success: false,
        error: 'Client not found'
      };
    }
    
    // Create new message
    const newMessage: ClientMessage = {
      id: generateId('message'),
      sender: {
        id: staffId,
        name: staffName,
        isStaff: true
      },
      content,
      timestamp: getCurrentTimestamp(),
      read: false,
      attachments
    };
    
    // Add to client messages
    clients[clientIndex].messages = [newMessage, ...clients[clientIndex].messages];
    
    // Add to client dashboard messages if this is the active client
    if (clientDashboard.client.id === clientId) {
      clientDashboard.messages = [newMessage, ...clientDashboard.messages];
    }
    
    // Update last contact timestamp
    clients[clientIndex].lastContact = newMessage.timestamp;
    
    // Add message alert if not already present
    if (!clients[clientIndex].alerts.includes('message')) {
      clients[clientIndex].alerts.push('message');
    }
    
    // Log the activity
    logActivity(
      staffId,
      'staff',
      'message',
      'message',
      newMessage.id,
      `Sent message to ${clients[clientIndex].contactName}: "${content.substring(0, 30)}${content.length > 30 ? '...' : ''}"`,
      { clientId }
    );
    
    return {
      success: true,
      data: newMessage,
      message: 'Message sent successfully'
    };
  },
  
  // Upload document for client
  uploadDocumentForClient: async (
    clientId: number,
    file: { name: string, type: string, size: string },
    staffId: number
  ): Promise<ApiResponse<ClientDocument>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const clientIndex = clients.findIndex(c => c.id === clientId);
    
    if (clientIndex === -1) {
      return {
        success: false,
        error: 'Client not found'
      };
    }
    
    // Create new document
    const newDocument: ClientDocument = {
      id: generateId('document'),
      name: file.name,
      type: file.type,
      uploadedBy: staffId,
      isStaffUpload: true,
      uploadDate: getCurrentTimestamp().split('T')[0],
      size: file.size,
      url: "#", // This would be a real URL in production
      category: determineCategory(file.name)
    };
    
    // Add to client documents
    clients[clientIndex].documents = [newDocument, ...clients[clientIndex].documents];
    
    // Add document alert if not already present
    if (!clients[clientIndex].alerts.includes('document')) {
      clients[clientIndex].alerts.push('document');
    }
    
    // Log the activity
    logActivity(
      staffId,
      'staff',
      'upload',
      'document',
      newDocument.id,
      `Uploaded document "${file.name}" for client ${clients[clientIndex].businessName}`,
      { clientId }
    );
    
    return {
      success: true,
      data: newDocument,
      message: 'Document uploaded successfully'
    };
  },
  
  // Create task for client
  createTask: async (
    clientId: number,
    task: Omit<ClientTask, 'id' | 'createdAt'>,
    staffId: number
  ): Promise<ApiResponse<ClientTask>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const clientIndex = clients.findIndex(c => c.id === clientId);
    
    if (clientIndex === -1) {
      return {
        success: false,
        error: 'Client not found'
      };
    }
    
    // Create new task
    const newTask: ClientTask = {
      id: generateId('task'),
      ...task,
      createdAt: getCurrentTimestamp()
    };
    
    // Add to client tasks
    clients[clientIndex].tasks = [newTask, ...clients[clientIndex].tasks];
    
    // Log the activity
    logActivity(
      staffId,
      'staff',
      'create',
      'task',
      newTask.id,
      `Created task "${newTask.title}" for client ${clients[clientIndex].businessName}`,
      { clientId, dueDate: newTask.dueDate }
    );
    
    return {
      success: true,
      data: newTask,
      message: 'Task created successfully'
    };
  },
  
  // Get activity log for all clients or specific client
  getActivityLog: async (clientId?: number): Promise<ApiResponse<ActivityLogEntry[]>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredLog = activityLog;
    
    // Filter by client if specified
    if (clientId) {
      filteredLog = activityLog.filter(log => 
        log.userId === clientId || 
        (log.entityType === 'client' && log.entityId === clientId)
      );
    }
    
    return {
      success: true,
      data: filteredLog
    };
  }
};

// Helper to determine document category based on filename
function determineCategory(filename: string): 'Tax' | 'Financial' | 'Legal' | 'Other' {
  const lowercase = filename.toLowerCase();
  
  if (lowercase.includes('tax') || 
      lowercase.includes('vat') || 
      lowercase.includes('return')) {
    return 'Tax';
  }
  
  if (lowercase.includes('bank') || 
      lowercase.includes('statement') || 
      lowercase.includes('invoice') || 
      lowercase.includes('receipt') || 
      lowercase.includes('financial') || 
      lowercase.includes('account')) {
    return 'Financial';
  }
  
  if (lowercase.includes('contract') || 
      lowercase.includes('agreement') || 
      lowercase.includes('legal') || 
      lowercase.includes('compliance')) {
    return 'Legal';
  }
  
  return 'Other';
}