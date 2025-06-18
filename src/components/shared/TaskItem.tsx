import React from 'react';
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  Badge,
  BadgeProps 
} from "@/components/ui/badge";
import { 
  Button 
} from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
  Clock, 
  FileUp, 
  CheckCircle,
  AlertCircle,
  FileText,
  ExternalLink 
} from "lucide-react";
import { ClientTask } from '@/lib/types';

export interface TaskItemProps {
  task: ClientTask;
  mode: 'client' | 'staff';
  onCompleteTask?: (taskId: number) => void;
  onUploadFile?: (taskId: number) => void;
  onReviewTask?: (taskId: number) => void;
  className?: string;
  isCompleting?: boolean;
  isUploading?: boolean;
}

export function TaskItem({ 
  task, 
  mode, 
  onCompleteTask, 
  onUploadFile, 
  onReviewTask,
  className = "",
  isCompleting = false,
  isUploading = false
}: TaskItemProps) {
  // Derive task type from description or name
  const getTaskType = (): 'upload' | 'review' | 'action' => {
    const lowerDesc = task.description.toLowerCase();
    const lowerTitle = task.title.toLowerCase();
    
    if (lowerDesc.includes('upload') || lowerTitle.includes('upload') || 
        lowerDesc.includes('send') || lowerTitle.includes('send') ||
        lowerDesc.includes('submit') || lowerTitle.includes('submit')) {
      return 'upload';
    } else if (lowerDesc.includes('review') || lowerTitle.includes('review') ||
              lowerDesc.includes('check') || lowerTitle.includes('check') ||
              lowerDesc.includes('approve') || lowerTitle.includes('approve')) {
      return 'review';
    } else {
      return 'action';
    }
  };

  const taskType = getTaskType();
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Check if task is overdue
  const isTaskOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && status !== 'completed';
  };

  // Get appropriate badge variant based on task status
  const getTaskBadgeVariant = (status: string): { variant: BadgeProps["variant"], color: string } => {
    switch (status) {
      case 'completed':
        return { variant: "outline", color: 'green' };
      case 'overdue':
        return { variant: "default", color: 'red' };
      default:
        return { variant: "secondary", color: 'var(--orange, #F59E0B)' };
    }
  };

  // Handle task action - different for client vs staff
  const handleTaskAction = () => {
    if (task.status === 'completed') return;
    
    if (taskType === 'upload') {
      onUploadFile?.(task.id);
    } else if (taskType === 'review') {
      onReviewTask?.(task.id);
    } else {
      onCompleteTask?.(task.id);
    }
  };

  // Get button label based on task type and mode
  const getActionButtonLabel = () => {
    if (task.status === 'completed') return 'Completed';
    
    if (taskType === 'upload') {
      return (
        <>
          <FileUp className="h-4 w-4 mr-1" /> Upload
        </>
      );
    } else if (taskType === 'review') {
      return (
        <>
          <FileText className="h-4 w-4 mr-1" /> Review
        </>
      );
    } else {
      return (
        <>
          <CheckCircle className="h-4 w-4 mr-1" /> {mode === 'client' ? 'Mark Done' : 'Mark Complete'}
        </>
      );
    }
  };

  // Get the left border color based on status
  const getBorderColor = () => {
    if (task.status === 'overdue') return 'red';
    if (task.status === 'completed') return 'green';
    return 'var(--orange, #F59E0B)';
  };

  // Get assigned to display (for staff mode)
  const getAssignedToDisplay = () => {
    if (mode !== 'staff' || !task.assignedTo) return null;
    
    return (
      <div className="text-xs text-gray-500 mt-1">
        Assigned to: Staff #{task.assignedTo}
      </div>
    );
  };

  return (
    <Card 
      className={`border-l-4 transition-all hover:shadow-md ${className}`} 
      style={{ borderLeftColor: getBorderColor() }}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-start">
              <h3 className="font-medium" style={{ color: 'var(--navy, #0F172A)' }}>
                {task.title}
              </h3>
              {task.status === 'overdue' && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertCircle className="h-4 w-4 ml-1 text-red-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This task is overdue</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {task.description}
            </p>
            {getAssignedToDisplay()}
            <div className="flex items-center mt-2 text-sm">
              <Clock className="h-4 w-4 mr-1 text-gray-500" />
              <span 
                className={isTaskOverdue(task.dueDate, task.status) ? 'text-red-600 font-medium' : 'text-gray-600'}
              >
                Due: {formatDate(task.dueDate)}
              </span>
              <Badge 
                className="ml-3" 
                variant={getTaskBadgeVariant(task.status).variant}
                style={{ 
                  backgroundColor: task.status === 'overdue' 
                    ? 'red' 
                    : (task.status === 'completed' ? undefined : 'var(--orange, #F59E0B)') 
                }}
              >
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </Badge>
            </div>
          </div>
          <div>
            <Button 
              variant={task.status === 'completed' ? "ghost" : "outline"} 
              size="sm" 
              className="flex items-center"
              style={task.status !== 'completed' ? { 
                color: 'var(--navy, #0F172A)', 
                borderColor: 'var(--navy, #0F172A)' 
              } : {}}
              onClick={handleTaskAction}
              disabled={task.status === 'completed' || isCompleting || isUploading}
            >
              {isCompleting || isUploading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isUploading ? 'Uploading...' : 'Processing...'}
                </span>
              ) : getActionButtonLabel()}
            </Button>
            {mode === 'staff' && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2"
                title="View full details"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default TaskItem;