import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  Search, 
  Bell, 
  User, 
  AlertCircle,
  PlusCircle,
  MessageSquare,
  FileUp
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from '@/hooks/use-toast';

// Import our shared components
import TaskItem from '@/components/shared/TaskItem';
import MessageThread from '@/components/shared/MessageThread';
import MessageInput from '@/components/shared/MessageInput';

// Import our new admin components
import CRMSidebar from '@/components/CRMSidebar';
import ClientActionToolbar from '@/components/ClientActionToolbar';

// Import types
import { 
  ClientData, 
  ServiceType, 
  ProgressStage, 
  AlertType, 
  AssignedStaff, 
  ClientTask, 
  ClientNote, 
  ClientMessage, 
  ClientDocument, 
  ServiceStatusDetails 
} from '@/lib/types';

// Import mock data for initial state
import { mockClients } from '@/lib/mockData';

// Staff members mock data
const staffMembers: AssignedStaff[] = [
  {
    id: 1,
    name: 'Sarah Williams',
    position: 'Senior Accountant',
    email: 'sarah.williams@progress.com'
  },
  {
    id: 2,
    name: 'David Thompson',
    position: 'Tax Specialist',
    email: 'david.thompson@progress.com'
  },
  {
    id: 3,
    name: 'Lisa Carter',
    position: 'Account Manager',
    email: 'lisa.carter@progress.com'
  },
  {
    id: 4,
    name: 'Michael Scott',
    position: 'Financial Advisor',
    email: 'michael.scott@progress.com'
  },
  {
    id: 5,
    name: 'Emily Parker',
    position: 'Payroll Specialist',
    email: 'emily.parker@progress.com'
  }
];

export default function CRMViewPageEnhanced() {
  const { toast } = useToast();
  
  // State for clients data - initially from mock data
  const [clients, setClients] = useState<ClientData[]>(mockClients);
  
  // State for selected client
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilters, setServiceFilters] = useState<ServiceType[]>([]);
  const [stageFilters, setStageFilters] = useState<ProgressStage[]>([]);
  
  // State for UI actions
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);
  
  // Calculate counts for sidebar
  const calculateServiceCounts = () => {
    const counts: Record<ServiceType, number> = {
      'Accounting': 0,
      'Tax': 0,
      'Payroll': 0,
      'VAT': 0,
      'Advisory': 0,
      'PodcastStudio': 0
    };
    
    clients.forEach(client => {
      client.services.forEach(service => {
        counts[service]++;
      });
    });
    
    return counts;
  };
  
  const calculateStageCounts = () => {
    const counts: Record<ProgressStage, number> = {
      'Onboarding': 0,
      'Active': 0,
      'Review': 0,
      'TaxReturn': 0,
      'YearEnd': 0
    };
    
    clients.forEach(client => {
      counts[client.progressStage]++;
    });
    
    return counts;
  };
  
  // Initialize with the first client selected
  useEffect(() => {
    if (clients.length > 0 && !selectedClient) {
      setSelectedClient(clients[0]);
    }
  }, [clients, selectedClient]);
  
  // Filter clients based on search term and filters
  const filteredClients = clients.filter(client => {
    // Search term filter
    const matchesSearch = searchTerm === '' || 
      client.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Service type filter
    const matchesService = serviceFilters.length === 0 || 
      client.services.some(service => serviceFilters.includes(service));
    
    // Progress stage filter
    const matchesStage = stageFilters.length === 0 || 
      stageFilters.includes(client.progressStage);
    
    return matchesSearch && matchesService && matchesStage;
  });
  
  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setServiceFilters([]);
    setStageFilters([]);
  };
  
  // Handle client selection
  const handleClientSelect = (client: ClientData) => {
    setSelectedClient(client);
  };
  
  // Handle updating a client
  const handleUpdateClient = (clientId: number, updatedData: Partial<ClientData>) => {
    setClients(prevClients => 
      prevClients.map(client => 
        client.id === clientId 
          ? { ...client, ...updatedData } 
          : client
      )
    );
    
    if (selectedClient && selectedClient.id === clientId) {
      setSelectedClient(prev => prev ? { ...prev, ...updatedData } : null);
    }
    
    toast({
      title: "Client updated",
      description: "The client information has been updated successfully.",
    });
  };
  
  // Handle sending a message
  const handleSendMessage = (clientId: number, message: string) => {
    setIsSendingMessage(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const newMessage: ClientMessage = {
        id: Math.floor(Math.random() * 1000) + 100, // Generate a random ID
        sender: {
          id: 1, // Current staff ID
          name: 'Sarah Williams',
          isStaff: true
        },
        content: message,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      setClients(prevClients => 
        prevClients.map(client => 
          client.id === clientId 
            ? { 
                ...client, 
                messages: [newMessage, ...client.messages],
                lastContact: new Date().toISOString()
              } 
            : client
        )
      );
      
      if (selectedClient && selectedClient.id === clientId) {
        setSelectedClient(prev => 
          prev 
            ? { 
                ...prev, 
                messages: [newMessage, ...prev.messages],
                lastContact: new Date().toISOString()
              } 
            : null
        );
      }
      
      toast({
        title: "Message sent",
        description: "Your message has been sent to the client.",
      });
      
      setIsSendingMessage(false);
    }, 1000);
  };
  
  // Handle creating a task
  const handleCreateTask = (clientId: number, title: string, description: string, dueDate: string) => {
    setIsCreatingTask(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const newTask: ClientTask = {
        id: Math.floor(Math.random() * 1000) + 100, // Generate a random ID
        title,
        description,
        dueDate,
        status: 'pending',
        assignedTo: 1, // Current staff ID
        createdAt: new Date().toISOString()
      };
      
      setClients(prevClients => 
        prevClients.map(client => 
          client.id === clientId 
            ? { ...client, tasks: [newTask, ...client.tasks] } 
            : client
        )
      );
      
      if (selectedClient && selectedClient.id === clientId) {
        setSelectedClient(prev => 
          prev 
            ? { ...prev, tasks: [newTask, ...prev.tasks] } 
            : null
        );
      }
      
      toast({
        title: "Task created",
        description: `Task "${title}" has been created successfully.`,
      });
      
      setIsCreatingTask(false);
    }, 1000);
  };
  
  // Handle completing a task
  const handleCompleteTask = (clientId: number, taskId: number) => {
    setClients(prevClients => 
      prevClients.map(client => 
        client.id === clientId 
          ? { 
              ...client, 
              tasks: client.tasks.map(task => 
                task.id === taskId 
                  ? { ...task, status: 'completed' } 
                  : task
              ) 
            } 
          : client
      )
    );
    
    if (selectedClient && selectedClient.id === clientId) {
      setSelectedClient(prev => 
        prev 
          ? { 
              ...prev, 
              tasks: prev.tasks.map(task => 
                task.id === taskId 
                  ? { ...task, status: 'completed' } 
                  : task
              ) 
            } 
          : null
      );
    }
    
    toast({
      title: "Task completed",
      description: "The task has been marked as complete.",
    });
  };
  
  // Handle adding a note
  const handleAddNote = (clientId: number, content: string, isPrivate: boolean = true) => {
    setIsCreatingNote(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const newNote: ClientNote = {
        id: Math.floor(Math.random() * 1000) + 100, // Generate a random ID
        content,
        createdBy: 1, // Current staff ID
        createdAt: new Date().toISOString(),
        isPrivate
      };
      
      setClients(prevClients => 
        prevClients.map(client => 
          client.id === clientId 
            ? { ...client, notes: [newNote, ...client.notes] } 
            : client
        )
      );
      
      if (selectedClient && selectedClient.id === clientId) {
        setSelectedClient(prev => 
          prev 
            ? { ...prev, notes: [newNote, ...prev.notes] } 
            : null
        );
      }
      
      toast({
        title: "Note added",
        description: "Your note has been added successfully.",
      });
      
      setIsCreatingNote(false);
    }, 1000);
  };
  
  // Handle document upload
  const handleUploadDocument = (clientId: number, file: { name: string, type: string, size: string }) => {
    setIsUploadingDocument(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const newDocument: ClientDocument = {
        id: Math.floor(Math.random() * 1000) + 100, // Generate a random ID
        name: file.name,
        type: file.type,
        uploadedBy: 1, // Current staff ID
        isStaffUpload: true,
        uploadDate: new Date().toISOString(),
        size: file.size,
        url: '#', // In a real app, this would be a URL to the document
        category: determineCategory(file.name)
      };
      
      setClients(prevClients => 
        prevClients.map(client => 
          client.id === clientId 
            ? { ...client, documents: [newDocument, ...client.documents] } 
            : client
        )
      );
      
      if (selectedClient && selectedClient.id === clientId) {
        setSelectedClient(prev => 
          prev 
            ? { ...prev, documents: [newDocument, ...prev.documents] } 
            : null
        );
      }
      
      toast({
        title: "Document uploaded",
        description: `Document "${file.name}" has been uploaded successfully.`,
      });
      
      setIsUploadingDocument(false);
    }, 1500);
  };
  
  // Determine document category based on filename
  const determineCategory = (filename: string): 'Tax' | 'Financial' | 'Legal' | 'Other' => {
    const lowerFilename = filename.toLowerCase();
    
    if (lowerFilename.includes('tax') || lowerFilename.includes('vat') || lowerFilename.includes('hmrc')) {
      return 'Tax';
    } else if (
      lowerFilename.includes('financ') || 
      lowerFilename.includes('account') || 
      lowerFilename.includes('report') ||
      lowerFilename.includes('statement') ||
      lowerFilename.includes('invoice')
    ) {
      return 'Financial';
    } else if (
      lowerFilename.includes('contract') || 
      lowerFilename.includes('agreement') || 
      lowerFilename.includes('legal') ||
      lowerFilename.includes('terms')
    ) {
      return 'Legal';
    } else {
      return 'Other';
    }
  };
  
  // Utility function to format dates
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get service badge color
  const getServiceBadgeColor = (service: ServiceType) => {
    switch (service) {
      case 'Accounting': return 'bg-blue-100 text-blue-800';
      case 'Tax': return 'bg-green-100 text-green-800';
      case 'Payroll': return 'bg-purple-100 text-purple-800';
      case 'VAT': return 'bg-pink-100 text-pink-800';
      case 'Advisory': return 'bg-amber-100 text-amber-800';
      case 'PodcastStudio': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get stage badge color
  const getStageBadgeColor = (stage: ProgressStage) => {
    switch (stage) {
      case 'Onboarding': return 'bg-blue-100 text-blue-800';
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Review': return 'bg-amber-100 text-amber-800';
      case 'TaxReturn': return 'bg-purple-100 text-purple-800';
      case 'YearEnd': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get alert icon
  const getAlertIcon = (alertType: AlertType) => {
    switch (alertType) {
      case 'overdue': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'message': return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'document': return <FileUp className="h-4 w-4 text-green-500" />;
      case 'important': return <Bell className="h-4 w-4 text-amber-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Get service progress color
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-amber-500';
    return 'bg-blue-500';
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--navy, #0F172A)' }}>
          Client Management
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar with Filters */}
        <CRMSidebar
          serviceFilters={serviceFilters}
          setServiceFilters={setServiceFilters}
          stageFilters={stageFilters}
          setStageFilters={setStageFilters}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          resetFilters={resetFilters}
          onCreateClient={() => toast({
            title: "Create client",
            description: "This feature is coming soon!",
          })}
          serviceTypeCounts={calculateServiceCounts()}
          stageCounts={calculateStageCounts()}
        />

        {/* Main Content Area */}
        <div className="flex-1">
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold" style={{ color: 'var(--navy, #0F172A)' }}>
                  Clients ({filteredClients.length})
                </CardTitle>
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  Clear Filters
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {filteredClients.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No clients found matching your filters. Try adjusting your search criteria.
                </div>
              ) : (
                <div className="divide-y">
                  {filteredClients.map((client) => (
                    <div 
                      key={client.id} 
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${selectedClient?.id === client.id ? 'bg-gray-50 border-l-4' : ''}`}
                      style={{ borderLeftColor: selectedClient?.id === client.id ? 'var(--navy, #0F172A)' : 'transparent' }}
                      onClick={() => handleClientSelect(client)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium" style={{ color: 'var(--navy, #0F172A)' }}>
                            {client.businessName}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {client.contactName} • {client.email}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={`${getStageBadgeColor(client.progressStage)}`}>
                              {client.progressStage}
                            </Badge>
                            {client.alerts.length > 0 && (
                              <Badge variant="outline" className="text-red-600 border-red-200 flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {client.alerts.length} Alert{client.alerts.length > 1 ? 's' : ''}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex flex-wrap gap-1 mb-2 justify-end">
                            {client.services.map((service) => (
                              <Badge 
                                key={service} 
                                variant="secondary" 
                                className={`text-xs ${getServiceBadgeColor(service)}`}
                              >
                                {service}
                              </Badge>
                            ))}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Last Contact: {formatDate(client.lastContact)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Selected Client Details */}
          {selectedClient && (
            <div>
              {/* Client Header */}
              <Card className="mb-4">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                      <h2 className="text-2xl font-bold" style={{ color: 'var(--navy, #0F172A)' }}>
                        {selectedClient.businessName}
                      </h2>
                      <p className="text-gray-600 mt-1">
                        {selectedClient.contactName} • {selectedClient.email} • {selectedClient.phone}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge className={`${getStageBadgeColor(selectedClient.progressStage)}`}>
                          {selectedClient.progressStage}
                        </Badge>
                        <Badge variant="outline" className="text-gray-600">
                          {selectedClient.industry}
                        </Badge>
                        <div className="text-sm text-gray-500">
                          Client since {formatDate(selectedClient.onboardingDate)}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {selectedClient.services.map((service) => (
                        <Badge 
                          key={service} 
                          className={`${getServiceBadgeColor(service)}`}
                        >
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Client Action Toolbar */}
              <ClientActionToolbar
                client={selectedClient}
                staffMembers={staffMembers}
                onUpdateClient={(updatedData) => handleUpdateClient(selectedClient.id, updatedData)}
                onSendMessage={(clientId, message) => handleSendMessage(clientId, message)}
                onCreateTask={(clientId, title, description, dueDate) => 
                  handleCreateTask(clientId, title, description, dueDate)
                }
                isSending={isSendingMessage}
                isCreatingTask={isCreatingTask}
              />
              
              {/* Client Tabs */}
              <Tabs defaultValue="overview" className="mt-6">
                <TabsList className="grid grid-cols-5 mb-6 w-full max-w-3xl">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="messages">Messages</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>
                
                {/* Overview Tab */}
                <TabsContent value="overview">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Assigned Staff */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold" style={{ color: 'var(--navy, #0F172A)' }}>
                          Assigned Staff
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedClient.assignedStaff.length === 0 ? (
                          <p className="py-4 text-gray-500">No staff assigned.</p>
                        ) : (
                          <div className="space-y-3">
                            {selectedClient.assignedStaff.map((staff, index) => (
                              <div key={staff.id} className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarFallback className="bg-navy text-white" style={{ backgroundColor: 'var(--navy, #0F172A)' }}>
                                    {staff.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{staff.name}</div>
                                  <div className="text-sm text-gray-500">{staff.position}</div>
                                </div>
                                {index === 0 && (
                                  <Badge className="ml-auto" style={{ backgroundColor: 'var(--navy, #0F172A)' }}>
                                    Primary
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    {/* Alerts */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold" style={{ color: 'var(--navy, #0F172A)' }}>
                          Alerts
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedClient.alerts.length === 0 ? (
                          <p className="py-4 text-gray-500">No active alerts.</p>
                        ) : (
                          <div className="space-y-2">
                            {selectedClient.alerts.map((alert, index) => (
                              <div key={index} className="flex items-start gap-2 p-2 rounded bg-gray-50">
                                <div className="mt-0.5">
                                  {getAlertIcon(alert)}
                                </div>
                                <div>
                                  <div className="font-medium">
                                    {alert === 'overdue' && 'Overdue Tasks'}
                                    {alert === 'message' && 'Unread Messages'}
                                    {alert === 'document' && 'New Documents'}
                                    {alert === 'important' && 'Important Notice'}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {alert === 'overdue' && 'Client has overdue tasks that need attention.'}
                                    {alert === 'message' && 'There are unread messages from this client.'}
                                    {alert === 'document' && 'Client has uploaded new documents.'}
                                    {alert === 'important' && 'This client requires urgent attention.'}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    {/* Service Status */}
                    <Card className="md:col-span-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold" style={{ color: 'var(--navy, #0F172A)' }}>
                          Service Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedClient.serviceStatus.length === 0 ? (
                          <p className="py-4 text-gray-500">No active services.</p>
                        ) : (
                          <div className="space-y-6">
                            {selectedClient.serviceStatus.map((service) => (
                              <div key={service.serviceType} className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <Badge 
                                      className={`${getServiceBadgeColor(service.serviceType)}`}
                                    >
                                      {service.serviceType}
                                    </Badge>
                                    <span className="text-sm font-medium">
                                      {service.status}
                                    </span>
                                  </div>
                                  <span className="text-sm font-medium">
                                    {service.progress}%
                                  </span>
                                </div>
                                <Progress 
                                  value={service.progress} 
                                  className={`h-2 ${getProgressColor(service.progress)}`} 
                                />
                                <div className="flex justify-between text-sm text-gray-500">
                                  <div>
                                    {service.notes || 'No additional notes'}
                                  </div>
                                  {service.nextDeadline && (
                                    <div className="flex items-center">
                                      <Clock className="h-3.5 w-3.5 mr-1" />
                                      Next deadline: {formatDate(service.nextDeadline)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                {/* Tasks Tab */}
                <TabsContent value="tasks">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg font-semibold" style={{ color: 'var(--navy, #0F172A)' }}>
                          Tasks
                        </CardTitle>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => toast({
                            title: "Create task",
                            description: "Use the 'Create Task' button in the toolbar above.",
                          })}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          New Task
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {selectedClient.tasks.length === 0 ? (
                        <p className="py-8 text-center text-gray-500">
                          No tasks for this client. Create one using the button above.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {selectedClient.tasks.map((task) => (
                            <TaskItem 
                              key={task.id}
                              task={task}
                              mode="staff"
                              onCompleteTask={() => handleCompleteTask(selectedClient.id, task.id)}
                              isCompleting={isCreatingTask}
                            />
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Messages Tab */}
                <TabsContent value="messages">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-semibold" style={{ color: 'var(--navy, #0F172A)' }}>
                        Messages
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4 p-4 border rounded-lg bg-gray-50">
                        <MessageInput 
                          onSendMessage={(message) => handleSendMessage(selectedClient.id, message)}
                          placeholder="Type a message to send to the client..."
                          isSending={isSendingMessage}
                          mode="staff"
                        />
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <div className="max-h-[500px] overflow-y-auto p-1">
                        <MessageThread 
                          messages={selectedClient.messages}
                          mode="staff"
                          currentUserId={1} // Current staff ID
                          onDownloadAttachment={(url, name) => {
                            toast({
                              title: "Download started",
                              description: `Downloading ${name}...`,
                            });
                          }}
                          emptyMessage="No messages with this client yet."
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Documents Tab */}
                <TabsContent value="documents">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg font-semibold" style={{ color: 'var(--navy, #0F172A)' }}>
                          Documents
                        </CardTitle>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            // Simulate file selection - in real app would open file browser
                            const mockFile = { 
                              name: 'Financial_Report_2025Q1.pdf', 
                              type: 'application/pdf', 
                              size: '1.2 MB' 
                            };
                            handleUploadDocument(selectedClient.id, mockFile);
                          }}
                          disabled={isUploadingDocument}
                        >
                          {isUploadingDocument ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <FileUp className="h-4 w-4 mr-2" />
                              Upload Document
                            </>
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {selectedClient.documents.length === 0 ? (
                        <p className="py-8 text-center text-gray-500">
                          No documents found for this client.
                        </p>
                      ) : (
                        <div className="space-y-1">
                          {selectedClient.documents.map((document) => (
                            <div 
                              key={document.id} 
                              className="flex items-center p-2 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
                            >
                              <FileText className="h-5 w-5 mr-3 text-gray-400" />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{document.name}</div>
                                <div className="flex items-center text-xs text-gray-500">
                                  <span className="truncate">
                                    {document.isStaffUpload ? 'Uploaded by staff' : 'Uploaded by client'} • {formatDate(document.uploadDate)}
                                  </span>
                                </div>
                              </div>
                              <Badge className="ml-2 mr-2">
                                {document.category}
                              </Badge>
                              <div className="text-xs text-gray-500 whitespace-nowrap">
                                {document.size}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Notes Tab */}
                <TabsContent value="notes">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg font-semibold" style={{ color: 'var(--navy, #0F172A)' }}>
                          Notes
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4 p-4 border rounded-lg bg-gray-50">
                        <Textarea 
                          placeholder="Add a note about this client..."
                          className="mb-3"
                          id="new-note"
                          disabled={isCreatingNote}
                        />
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={isCreatingNote}
                            onClick={() => {
                              const noteText = (document.getElementById('new-note') as HTMLTextAreaElement)?.value;
                              if (noteText?.trim()) {
                                handleAddNote(selectedClient.id, noteText, true);
                                (document.getElementById('new-note') as HTMLTextAreaElement).value = '';
                              }
                            }}
                          >
                            Add as Private Note
                          </Button>
                          <Button 
                            size="sm"
                            disabled={isCreatingNote}
                            onClick={() => {
                              const noteText = (document.getElementById('new-note') as HTMLTextAreaElement)?.value;
                              if (noteText?.trim()) {
                                handleAddNote(selectedClient.id, noteText, false);
                                (document.getElementById('new-note') as HTMLTextAreaElement).value = '';
                              }
                            }}
                            style={{ backgroundColor: 'var(--navy, #0F172A)' }}
                          >
                            {isCreatingNote ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Adding...
                              </>
                            ) : (
                              <>Add as Shared Note</>
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <Separator className="my-6" />
                      
                      {selectedClient.notes.length === 0 ? (
                        <p className="py-4 text-center text-gray-500">
                          No notes for this client yet.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {selectedClient.notes.map((note) => (
                            <div key={note.id} className="p-4 rounded-lg bg-gray-50 border">
                              <div className="flex justify-between items-start mb-2">
                                <div className="font-medium flex items-center">
                                  <User className="h-4 w-4 mr-1 text-gray-500" />
                                  Staff #{note.createdBy}
                                  {note.isPrivate ? (
                                    <Badge variant="outline" className="ml-2 text-xs">Private</Badge>
                                  ) : (
                                    <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-700 border-green-200">Shared</Badge>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {formatDate(note.createdAt)}
                                </div>
                              </div>
                              <p className="text-gray-700">
                                {note.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}