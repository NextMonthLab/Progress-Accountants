import React, { useMemo } from 'react';
import { 
  Avatar, 
  AvatarImage, 
  AvatarFallback 
} from "@/components/ui/avatar";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
  Badge 
} from "@/components/ui/badge";
import { 
  Download, 
  FileText 
} from "lucide-react";
import { 
  Card,
  CardContent 
} from "@/components/ui/card";
import { ClientMessage } from '@/lib/types';

export interface MessageThreadProps {
  messages: ClientMessage[];
  mode: 'client' | 'staff';
  currentUserId: number;
  onDownloadAttachment?: (attachmentUrl: string, attachmentName: string) => void;
  className?: string;
  emptyMessage?: string;
}

type GroupedMessages = {
  date: string;
  messages: ClientMessage[];
}

export function MessageThread({
  messages,
  mode,
  currentUserId,
  onDownloadAttachment,
  className = "",
  emptyMessage = "No messages to display."
}: MessageThreadProps) {
  // Group messages by date
  const groupedMessages = useMemo(() => {
    if (!messages || messages.length === 0) return [];
    
    const groups: GroupedMessages[] = [];
    let currentGroup: GroupedMessages | null = null;
    
    messages.forEach(message => {
      const messageDate = new Date(message.timestamp).toLocaleDateString();
      
      if (!currentGroup || currentGroup.date !== messageDate) {
        if (currentGroup) {
          groups.push(currentGroup);
        }
        currentGroup = {
          date: messageDate,
          messages: [message]
        };
      } else {
        currentGroup.messages.push(message);
      }
    });
    
    if (currentGroup) {
      groups.push(currentGroup);
    }
    
    return groups;
  }, [messages]);

  // Format timestamp for display
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Format date header for display
  const formatDateHeader = (dateString: string) => {
    const messageDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return new Date(dateString).toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  };

  // Get the avatar initials from the sender name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  // Determine if the message is from the current user
  const isOwnMessage = (message: ClientMessage) => {
    return message.sender.id === currentUserId;
  };
  
  // Safe access to avatar property which may not exist in all messages
  const getSenderAvatar = (sender: ClientMessage['sender']) => {
    return (sender as any).avatar || undefined;
  };

  // Render message attachments if any
  const renderAttachments = (message: ClientMessage) => {
    if (!message.attachments || message.attachments.length === 0) return null;
    
    return (
      <div className="mt-2 space-y-1">
        {message.attachments.map((attachment, index) => (
          <div key={index} className="flex items-center bg-gray-50 p-1.5 rounded text-sm">
            <FileText className="h-4 w-4 mr-1.5 text-gray-500" />
            <span className="flex-1 truncate">{attachment.name}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    className="ml-2 text-blue-600 hover:text-blue-800"
                    onClick={() => onDownloadAttachment?.(attachment.url, attachment.name)}
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download attachment</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
      </div>
    );
  };

  if (!messages || messages.length === 0) {
    return (
      <div className="flex justify-center items-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {groupedMessages.map((group, groupIndex) => (
        <div key={groupIndex} className="space-y-4">
          <div className="flex items-center">
            <div className="flex-grow h-px bg-gray-200"></div>
            <span className="px-3 text-sm text-gray-500 font-medium">
              {formatDateHeader(group.date)}
            </span>
            <div className="flex-grow h-px bg-gray-200"></div>
          </div>
          
          {group.messages.map((message, messageIndex) => {
            const isOwn = isOwnMessage(message);
            const showSender = messageIndex === 0 || 
                              group.messages[messageIndex - 1].sender.id !== message.sender.id;
            
            return (
              <div 
                key={message.id} 
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${isOwn ? 'order-2' : 'order-1'}`}>
                  {/* Sender info */}
                  {showSender && (
                    <div className={`flex items-center mb-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      {!isOwn && (
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={getSenderAvatar(message.sender)} alt={message.sender.name} />
                          <AvatarFallback 
                            className={message.sender.isStaff ? 
                              "bg-navy text-white" : 
                              "bg-orange-100 text-orange-700"} 
                            style={{ 
                              backgroundColor: message.sender.isStaff ? 'var(--navy, #0F172A)' : undefined,
                              fontSize: '0.65rem' 
                            }}
                          >
                            {getInitials(message.sender.name)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <span className="text-sm font-medium">
                        {message.sender.name}
                      </span>
                      {message.sender.isStaff && (
                        <Badge variant="outline" className="ml-1.5 px-1.5 py-0 text-[10px] h-4 border-navy text-navy"
                          style={{ borderColor: 'var(--navy, #0F172A)', color: 'var(--navy, #0F172A)' }}
                        >
                          STAFF
                        </Badge>
                      )}
                      {isOwn && (
                        <Avatar className="h-6 w-6 ml-2">
                          <AvatarImage src={getSenderAvatar(message.sender)} alt={message.sender.name} />
                          <AvatarFallback 
                            className={message.sender.isStaff ? 
                              "bg-navy text-white" : 
                              "bg-orange-100 text-orange-700"} 
                            style={{ 
                              backgroundColor: message.sender.isStaff ? 'var(--navy, #0F172A)' : undefined,
                              fontSize: '0.65rem' 
                            }}
                          >
                            {getInitials(message.sender.name)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  )}
                  
                  {/* Message content */}
                  <div 
                    className={`rounded-lg p-3 ${isOwn ? 
                      'bg-blue-50 text-blue-900 rounded-tr-none' : 
                      (message.sender.isStaff ? 
                        'bg-navy-50 text-navy-900 rounded-tl-none' : 
                        'bg-gray-100 text-gray-900 rounded-tl-none'
                      )}`}
                    style={message.sender.isStaff && !isOwn ? {
                      backgroundColor: 'rgba(15, 23, 42, 0.05)', /* Very light navy */
                      color: 'var(--navy, #0F172A)'
                    } : {}}
                  >
                    <p className="text-sm">
                      {message.content}
                    </p>
                    {renderAttachments(message)}
                    <div className={`text-[11px] mt-1 text-gray-500 ${isOwn ? 'text-right' : 'text-left'}`}>
                      {formatTime(message.timestamp)}
                      {!message.read && mode === 'staff' && !isOwn && (
                        <span className="ml-1.5 inline-block w-2 h-2 rounded-full bg-blue-500" 
                          title="Unread by client" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default MessageThread;