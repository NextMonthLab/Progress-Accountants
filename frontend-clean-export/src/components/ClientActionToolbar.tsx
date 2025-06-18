import React, { useState } from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Button 
} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  Textarea 
} from "@/components/ui/textarea";
import { 
  Label 
} from "@/components/ui/label";
import { 
  Input 
} from "@/components/ui/input";
import {
  AlertCircle,
  MessageSquarePlus,
  PlusCircle,
  Bell,
  Calendar,
  ChevronsUpDown,
  Clock,
  Save,
  Send,
  User,
  BellRing
} from "lucide-react";
import { AssignedStaff, ClientData, ProgressStage } from '@/lib/types';

interface ClientActionToolbarProps {
  client: ClientData;
  staffMembers: AssignedStaff[];
  onUpdateClient: (updatedData: Partial<ClientData>) => void;
  onSendMessage: (clientId: number, message: string) => void;
  onCreateTask: (clientId: number, title: string, description: string, dueDate: string) => void;
  isSending?: boolean;
  isCreatingTask?: boolean;
}

export function ClientActionToolbar({
  client,
  staffMembers,
  onUpdateClient,
  onSendMessage,
  onCreateTask,
  isSending = false,
  isCreatingTask = false
}: ClientActionToolbarProps) {
  const [messageText, setMessageText] = useState('');
  const [quickMessageOpen, setQuickMessageOpen] = useState(false);
  
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  
  // Handle status change
  const handleStatusChange = (newStage: ProgressStage) => {
    onUpdateClient({ progressStage: newStage });
  };
  
  // Handle staff assignment change
  const handleStaffAssignmentChange = (staffId: string) => {
    const selectedStaff = staffMembers.find(s => s.id.toString() === staffId);
    if (selectedStaff) {
      // Check if this staff is already assigned
      const isAlreadyAssigned = client.assignedStaff.some(s => s.id === selectedStaff.id);
      
      if (!isAlreadyAssigned) {
        // Add the staff member to assigned staff
        onUpdateClient({
          assignedStaff: [...client.assignedStaff, selectedStaff]
        });
      }
    }
  };
  
  // Handle primary staff change
  const handlePrimaryStaffChange = (staffId: string) => {
    const selectedStaff = staffMembers.find(s => s.id.toString() === staffId);
    if (selectedStaff) {
      // Reorder the staff array to put the selected staff first
      const otherStaff = client.assignedStaff.filter(s => s.id !== selectedStaff.id);
      onUpdateClient({
        assignedStaff: [selectedStaff, ...otherStaff]
      });
    }
  };
  
  // Handle send message
  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(client.id, messageText);
      setMessageText('');
      setQuickMessageOpen(false);
    }
  };
  
  // Handle create task
  const handleCreateTask = () => {
    if (taskTitle.trim() && taskDueDate) {
      onCreateTask(client.id, taskTitle, taskDescription, taskDueDate);
      setTaskTitle('');
      setTaskDescription('');
      setTaskDueDate('');
      setTaskDialogOpen(false);
    }
  };

  // Get current assigned staff names for display
  const getAssignedStaffNames = () => {
    if (client.assignedStaff.length === 0) return 'None';
    if (client.assignedStaff.length === 1) return client.assignedStaff[0].name;
    return `${client.assignedStaff[0].name} +${client.assignedStaff.length - 1}`;
  };

  // Get color for progress stage
  const getProgressStageColor = (stage: ProgressStage) => {
    switch (stage) {
      case 'Onboarding': return 'text-blue-600';
      case 'Active': return 'text-green-600';
      case 'Review': return 'text-amber-600';
      case 'TaxReturn': return 'text-purple-600';
      case 'YearEnd': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Get tomorrow's date in YYYY-MM-DD format for the default task due date
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <Card className="mb-4 border-t-2" style={{ borderTopColor: 'var(--navy, #0F172A)' }}>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Client Stage/Status Dropdown */}
            <div className="flex flex-col">
              <Label htmlFor="client-status" className="mb-1 text-xs text-gray-500">
                Status
              </Label>
              <Select
                value={client.progressStage}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger id="client-status" className="w-[140px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Onboarding" className="text-blue-600">Onboarding</SelectItem>
                  <SelectItem value="Active" className="text-green-600">Active</SelectItem>
                  <SelectItem value="Review" className="text-amber-600">Review</SelectItem>
                  <SelectItem value="TaxReturn" className="text-purple-600">Tax Return</SelectItem>
                  <SelectItem value="YearEnd" className="text-red-600">Year End</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Staff Assignment */}
            <div className="flex flex-col">
              <Label htmlFor="assign-staff" className="mb-1 text-xs text-gray-500">
                Primary Staff
              </Label>
              <Select
                value={client.assignedStaff.length > 0 ? client.assignedStaff[0].id.toString() : ""}
                onValueChange={handlePrimaryStaffChange}
              >
                <SelectTrigger id="assign-staff" className="w-[180px]">
                  <SelectValue placeholder="Assign staff" />
                </SelectTrigger>
                <SelectContent>
                  {staffMembers.map(staff => (
                    <SelectItem 
                      key={staff.id} 
                      value={staff.id.toString()}
                      className="flex items-center"
                    >
                      <div className="flex items-center">
                        <User className="h-3.5 w-3.5 mr-2 text-gray-500" />
                        {staff.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Add Additional Staff */}
            <div className="flex flex-col">
              <Label htmlFor="add-staff" className="mb-1 text-xs text-gray-500">
                Add Staff
              </Label>
              <Select
                value=""
                onValueChange={handleStaffAssignmentChange}
              >
                <SelectTrigger id="add-staff" className="w-[150px]">
                  <SelectValue placeholder="Add staff" />
                </SelectTrigger>
                <SelectContent>
                  {staffMembers
                    .filter(staff => !client.assignedStaff.some(s => s.id === staff.id))
                    .map(staff => (
                      <SelectItem 
                        key={staff.id} 
                        value={staff.id.toString()}
                        className="flex items-center"
                      >
                        <div className="flex items-center">
                          <PlusCircle className="h-3.5 w-3.5 mr-2 text-gray-500" />
                          {staff.name}
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            {/* Quick Message Button */}
            <Popover open={quickMessageOpen} onOpenChange={setQuickMessageOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-10" style={{ borderColor: 'var(--navy, #0F172A)', color: 'var(--navy, #0F172A)' }}>
                  <MessageSquarePlus className="h-4 w-4 mr-2" />
                  Quick Message
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">Send a quick message</h3>
                  <p className="text-xs text-gray-500">
                    This will be sent directly to {client.contactName}.
                  </p>
                  <Textarea
                    placeholder="Type your message here..."
                    className="min-h-[100px]"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setQuickMessageOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleSendMessage}
                      disabled={!messageText.trim() || isSending}
                      style={{ backgroundColor: 'var(--navy, #0F172A)' }}
                    >
                      {isSending ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Create Task Button */}
            <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
              <DialogTrigger asChild>
                <Button style={{ backgroundColor: 'var(--navy, #0F172A)' }}>
                  <BellRing className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create a new task for {client.contactName}</DialogTitle>
                  <DialogDescription>
                    Fill out the details below to create a task.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="task-title" className="text-sm">
                      Task Title
                    </Label>
                    <Input
                      id="task-title"
                      placeholder="E.g. Upload Q4 Bank Statements"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="task-description" className="text-sm">
                      Description
                    </Label>
                    <Textarea
                      id="task-description"
                      placeholder="Provide details about the task"
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="task-due-date" className="text-sm">
                      Due Date
                    </Label>
                    <Input
                      id="task-due-date"
                      type="date"
                      defaultValue={getTomorrowDate()}
                      value={taskDueDate}
                      onChange={(e) => setTaskDueDate(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setTaskDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    style={{ backgroundColor: 'var(--navy, #0F172A)' }} 
                    onClick={handleCreateTask}
                    disabled={!taskTitle.trim() || !taskDueDate || isCreatingTask}
                  >
                    {isCreatingTask ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      <>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Task
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ClientActionToolbar;