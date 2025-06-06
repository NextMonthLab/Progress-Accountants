import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  RadioGroup, 
  RadioGroupItem 
} from "@/components/ui/radio-group";
import { 
  Label 
} from "@/components/ui/label";
import { 
  Badge 
} from "@/components/ui/badge";
import { 
  Button 
} from "@/components/ui/button";
import { 
  Separator 
} from "@/components/ui/separator";
import { 
  Switch 
} from "@/components/ui/switch";
import { 
  RefreshCw, 
  Plus 
} from "lucide-react";

// Import our shared components
import TaskItem from '@/components/shared/TaskItem';
import MessageThread from '@/components/shared/MessageThread';
import MessageInput from '@/components/shared/MessageInput';

// Import types
import { ClientTask, ClientMessage } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function ComponentDemo() {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'client' | 'staff'>('client');
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  
  // Mock user IDs for demo
  const CLIENT_ID = 101;
  const STAFF_ID = 201;
  
  // State for messages
  const [messages, setMessages] = useState<ClientMessage[]>([
    {
      id: 1,
      sender: {
        id: STAFF_ID,
        name: 'Sarah Williams',
        isStaff: true
      },
      content: 'Hello! I\'ve reviewed your March transactions and everything looks good. The quarterly report will be ready by Friday.',
      timestamp: '2025-04-12T10:30:00',
      read: true
    },
    {
      id: 2,
      sender: {
        id: CLIENT_ID,
        name: 'Alex Johnson',
        isStaff: false
      },
      content: 'That\'s great news, thanks! I was wondering if we could schedule a call to discuss some upcoming changes to the business.',
      timestamp: '2025-04-12T10:45:00',
      read: true
    },
    {
      id: 3,
      sender: {
        id: STAFF_ID,
        name: 'Sarah Williams',
        isStaff: true
      },
      content: 'Absolutely! I have availability next Tuesday afternoon or Wednesday morning. Would either of those work for you?',
      timestamp: '2025-04-12T11:15:00',
      read: false,
      attachments: [
        {
          name: 'March_Transactions_Summary.pdf',
          url: '#'
        }
      ]
    }
  ]);
  
  // State for tasks
  const [tasks, setTasks] = useState<ClientTask[]>([
    {
      id: 1,
      title: 'Upload Q4 bank statements',
      description: 'We need your recent bank statements to complete your quarterly reconciliation.',
      dueDate: '2025-04-20',
      status: 'pending',
      assignedTo: STAFF_ID,
      createdAt: '2025-04-01T09:00:00'
    },
    {
      id: 2,
      title: 'Review draft VAT return',
      description: 'Your VAT return has been prepared. Please review and approve.',
      dueDate: '2025-04-25',
      status: 'pending',
      assignedTo: STAFF_ID,
      createdAt: '2025-04-05T14:30:00'
    },
    {
      id: 3,
      title: 'Update business contact details',
      description: 'Please confirm your current business address and phone number.',
      dueDate: '2025-04-15',
      status: 'overdue',
      assignedTo: CLIENT_ID,
      createdAt: '2025-04-10T11:15:00'
    }
  ]);
  
  // State for loading indicators
  const [isCompletingTask, setIsCompletingTask] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  
  // Handler for completing a task
  const handleCompleteTask = (taskId: number) => {
    setIsCompletingTask(true);
    
    // Simulate API call
    setTimeout(() => {
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId 
            ? { ...task, status: 'completed' } 
            : task
        )
      );
      
      toast({
        title: "Task completed",
        description: "The task has been marked as complete.",
      });
      
      setIsCompletingTask(false);
    }, 1500);
  };
  
  // Handler for uploading a file
  const handleUploadFile = (taskId: number) => {
    setIsUploadingFile(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "File uploaded",
        description: "Your file has been uploaded successfully.",
      });
      
      // Complete the task
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId 
            ? { ...task, status: 'completed' } 
            : task
        )
      );
      
      setIsUploadingFile(false);
    }, 2000);
  };
  
  // Handler for reviewing a task
  const handleReviewTask = (taskId: number) => {
    toast({
      title: "Review started",
      description: "You are now reviewing this task.",
    });
  };
  
  // Handler for sending a message
  const handleSendMessage = (content: string, attachments?: File[]) => {
    setIsSendingMessage(true);
    
    // Simulate API call
    setTimeout(() => {
      const newMessage: ClientMessage = {
        id: Math.floor(Math.random() * 1000) + 10, // Random ID for demo
        sender: {
          id: viewMode === 'client' ? CLIENT_ID : STAFF_ID,
          name: viewMode === 'client' ? 'Alex Johnson' : 'Sarah Williams',
          isStaff: viewMode === 'staff'
        },
        content,
        timestamp: new Date().toISOString(),
        read: false,
        attachments: attachments 
          ? attachments.map(file => ({ 
              name: file.name, 
              url: URL.createObjectURL(file) 
            })) 
          : undefined
      };
      
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setIsSendingMessage(false);
      
      if (showDebugInfo) {
        console.log('Sent message:', newMessage);
      }
    }, 1000);
  };
  
  // Handler for downloading an attachment
  const handleDownloadAttachment = (url: string, name: string) => {
    toast({
      title: "Download started",
      description: `Downloading ${name}...`,
    });
    
    if (showDebugInfo) {
      console.log('Download attachment:', { url, name });
    }
  };
  
  // Handler for adding a new task
  const handleAddTask = () => {
    const newTask: ClientTask = {
      id: Math.floor(Math.random() * 1000) + 10, // Random ID for demo
      title: viewMode === 'client' 
        ? 'Review financial projections' 
        : 'Complete client onboarding',
      description: viewMode === 'client'
        ? 'Please review the financial projections for the next quarter'
        : 'Complete all onboarding steps for the new client',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
      status: 'pending',
      assignedTo: viewMode === 'client' ? CLIENT_ID : STAFF_ID,
      createdAt: new Date().toISOString()
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
    
    toast({
      title: "Task added",
      description: `New task "${newTask.title}" has been added.`,
    });
    
    if (showDebugInfo) {
      console.log('Added task:', newTask);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--navy, #0F172A)' }}>
        Component Demo
      </h1>
      <p className="text-gray-600 mb-6">
        This page demonstrates reusable components shared between client and staff interfaces.
      </p>
      
      {/* Mode switcher */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Component Mode</CardTitle>
          <CardDescription>
            Toggle between client and staff modes to see how components behave.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <RadioGroup 
              defaultValue="client" 
              value={viewMode}
              onValueChange={(value) => setViewMode(value as 'client' | 'staff')}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="client" id="client" />
                <Label htmlFor="client">Client Mode</Label>
                <Badge className="ml-1 bg-orange-100 text-orange-800">Client</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="staff" id="staff" />
                <Label htmlFor="staff">Staff Mode</Label>
                <Badge className="ml-1" style={{ backgroundColor: 'var(--navy, #0F172A)' }}>Staff</Badge>
              </div>
            </RadioGroup>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="debug-mode" 
                checked={showDebugInfo}
                onCheckedChange={setShowDebugInfo}
              />
              <Label htmlFor="debug-mode">Show Debug Info</Label>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setTasks([...tasks]);
                setMessages([...messages]);
                toast({
                  title: "Components refreshed",
                  description: "All components have been refreshed.",
                });
              }}
            >
              <RefreshCw className="h-4 w-4 mr-1" /> Refresh
            </Button>
          </div>
          
          {showDebugInfo && (
            <div className="mt-4 p-3 bg-gray-50 rounded text-xs font-mono">
              <p>Current Mode: <strong>{viewMode}</strong></p>
              <p>Current User ID: <strong>{viewMode === 'client' ? CLIENT_ID : STAFF_ID}</strong></p>
              <p>Tasks: <strong>{tasks.length}</strong></p>
              <p>Messages: <strong>{messages.length}</strong></p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Task components demo */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Task Components</CardTitle>
              <Button variant="outline" size="sm" onClick={handleAddTask}>
                <Plus className="h-4 w-4 mr-1" /> Add Task
              </Button>
            </div>
            <CardDescription>
              TaskItem component shared between client dashboard and CRM view.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasks.map(task => (
              <TaskItem 
                key={task.id}
                task={task}
                mode={viewMode}
                onCompleteTask={handleCompleteTask}
                onUploadFile={handleUploadFile}
                onReviewTask={handleReviewTask}
                isCompleting={isCompletingTask}
                isUploading={isUploadingFile}
              />
            ))}
            
            {showDebugInfo && (
              <div className="mt-4 p-3 bg-gray-50 rounded text-xs font-mono">
                <p>onCompleteTask - Marks a task as completed</p>
                <p>onUploadFile - Opens file picker and uploads</p>
                <p>onReviewTask - Opens review interface</p>
                <p>Staff can see assignee, clients cannot</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Messaging components demo */}
        <Card>
          <CardHeader>
            <CardTitle>Messaging Components</CardTitle>
            <CardDescription>
              MessageThread and MessageInput components for client-staff communication.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-gray-50 mb-4" style={{ height: '350px', overflowY: 'auto' }}>
              <MessageThread 
                messages={messages}
                mode={viewMode}
                currentUserId={viewMode === 'client' ? CLIENT_ID : STAFF_ID}
                onDownloadAttachment={handleDownloadAttachment}
              />
            </div>
            
            <Separator className="my-4" />
            
            <MessageInput 
              onSendMessage={handleSendMessage}
              placeholder={viewMode === 'client' 
                ? "Type a message to your accountant..." 
                : "Type a message to the client..."}
              isSending={isSendingMessage}
              mode={viewMode}
            />
            
            {showDebugInfo && (
              <div className="mt-4 p-3 bg-gray-50 rounded text-xs font-mono">
                <p>Messages are grouped by date</p>
                <p>Own messages shown on right, others on left</p>
                <p>Staff messages have different styling than client</p>
                <p>MessageInput supports attachments and Shift+Enter</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-10 text-center">
        <p className="text-gray-500">
          These components are designed to be reused across the Progress Accountants platform, 
          providing a consistent experience for both clients and staff.
        </p>
      </div>
    </div>
  );
}