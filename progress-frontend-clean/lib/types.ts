// Shared data types for client and CRM dashboards

export type ServiceType = 'Accounting' | 'Tax' | 'Payroll' | 'VAT' | 'Advisory' | 'PodcastStudio';
export type ProgressStage = 'Onboarding' | 'Active' | 'Review' | 'TaxReturn' | 'YearEnd';
export type AlertType = 'overdue' | 'message' | 'document' | 'important';
export type TaskStatus = 'pending' | 'overdue' | 'completed';
export type ServiceStatus = 'Not Started' | 'In Progress' | 'Under Review' | 'Complete';

export interface AssignedStaff {
  id: number;
  name: string;
  position: string;
  avatar?: string;
  email: string;
}

export interface ClientTask {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  assignedTo: number; // staff ID
  createdAt: string;
}

export interface ClientNote {
  id: number;
  content: string;
  createdBy: number; // staff ID
  createdAt: string;
  isPrivate: boolean;
}

export interface ClientMessage {
  id: number;
  sender: {
    id: number;
    name: string;
    isStaff: boolean;
  };
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: {
    name: string;
    url: string;
  }[];
}

export interface ClientDocument {
  id: number;
  name: string;
  type: string;
  uploadedBy: number; // staff or client ID
  isStaffUpload: boolean;
  uploadDate: string;
  size: string;
  url: string;
  category: 'Tax' | 'Financial' | 'Legal' | 'Other';
}

export interface ServiceStatusDetails {
  serviceType: ServiceType;
  status: ServiceStatus;
  progress: number;
  nextDeadline?: string;
  notes?: string;
}

export interface ClientData {
  id: number;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  industry: string;
  assignedStaff: AssignedStaff[];
  services: ServiceType[];
  progressStage: ProgressStage;
  alerts: AlertType[];
  lastContact: string; // ISO date string
  onboardingDate: string; // ISO date string
  tasks: ClientTask[];
  notes: ClientNote[];
  messages: ClientMessage[];
  documents: ClientDocument[];
  serviceStatus: ServiceStatusDetails[];
}

export interface ClientDashboardData {
  client: {
    id: number;
    firstName: string;
    lastName: string;
    businessName: string;
    accountManager: {
      name: string;
      avatar: string;
    }
  };
  tasks: ClientTask[];
  messages: ClientMessage[];
  serviceProgress: {
    id: number;
    name: ServiceType;
    progress: number;
    nextStep: string;
    dueDate: string;
  }[];
  announcements: {
    id: number;
    title: string;
    content: string;
    date: string;
    priority: 'low' | 'medium' | 'high';
  }[];
}

export interface ActivityLogEntry {
  id: number;
  userId: number;
  userType: 'staff' | 'client';
  actionType: 'view' | 'update' | 'create' | 'delete' | 'login' | 'message' | 'upload' | 'download' | 'complete';
  entityType: 'task' | 'note' | 'message' | 'document' | 'service' | 'client' | 'system';
  entityId?: number;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Response types for API calls
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}