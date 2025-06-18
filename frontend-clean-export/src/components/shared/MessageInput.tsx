import React, { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { 
  Button 
} from "@/components/ui/button";
import { 
  Textarea 
} from "@/components/ui/textarea";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
  Send, 
  Paperclip, 
  Image, 
  X 
} from "lucide-react";

export interface MessageInputProps {
  onSendMessage: (message: string, attachments?: File[]) => void;
  placeholder?: string;
  buttonText?: string;
  isSending?: boolean;
  allowAttachments?: boolean;
  maxAttachments?: number;
  className?: string;
  mode?: 'client' | 'staff';
}

export function MessageInput({
  onSendMessage,
  placeholder = "Type a message...",
  buttonText = "Send",
  isSending = false,
  allowAttachments = true,
  maxAttachments = 3,
  className = "",
  mode = 'client'
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle message change
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  // Handle send button click or Enter key (with Shift+Enter for new line)
  const handleSendMessage = (e?: FormEvent) => {
    if (e) e.preventDefault();
    
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message, attachments.length > 0 ? attachments : undefined);
      setMessage("");
      setAttachments([]);
    }
  };

  // Handle file selection
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      // Check if adding these files would exceed the max
      if (attachments.length + newFiles.length <= maxAttachments) {
        setAttachments(prevAttachments => [...prevAttachments, ...newFiles]);
      }
      // Reset the input so the same file can be selected again if removed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Trigger file input click
  const handleAttachClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Remove an attachment
  const removeAttachment = (index: number) => {
    setAttachments(prevAttachments => 
      prevAttachments.filter((_, i) => i !== index)
    );
  };

  // Format file size for display
  const formatFileSize = (size: number) => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  // Handle textarea keydown (for Shift+Enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <form onSubmit={handleSendMessage} className={`${className}`}>
      {/* Attachment display area */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 p-2 bg-gray-50 rounded border">
          {attachments.map((file, index) => (
            <div key={index} className="flex items-center bg-white px-2 py-1 rounded text-sm border">
              {file.type.startsWith('image/') ? (
                <Image className="h-3.5 w-3.5 mr-1 text-blue-500" />
              ) : (
                <Paperclip className="h-3.5 w-3.5 mr-1 text-gray-500" />
              )}
              <span className="truncate max-w-[150px]">{file.name}</span>
              <span className="ml-1 text-xs text-gray-500">({formatFileSize(file.size)})</span>
              <button 
                type="button"
                className="ml-1 text-gray-400 hover:text-gray-600"
                onClick={() => removeAttachment(index)}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Input area */}
      <div className="flex items-end border rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-blue-300">
        <Textarea 
          value={message}
          onChange={handleMessageChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 min-h-[80px] max-h-[200px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
        />
        
        <div className="flex items-center p-2">
          {allowAttachments && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="icon"
                    className="rounded-full h-8 w-8"
                    onClick={handleAttachClick}
                    disabled={attachments.length >= maxAttachments || isSending}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{attachments.length >= maxAttachments 
                    ? `Maximum ${maxAttachments} attachments` 
                    : 'Add attachment'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            multiple={maxAttachments > 1}
          />
          
          <Button 
            type="submit"
            disabled={(!message.trim() && attachments.length === 0) || isSending}
            className={mode === 'staff' ? 'bg-navy hover:bg-navy/90' : ''}
            style={mode === 'staff' ? { backgroundColor: 'var(--navy, #0F172A)' } : {}}
          >
            {isSending ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : (
              <>
                <Send className="h-4 w-4 mr-1" /> {buttonText}
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Character count and max attachment info */}
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>{message.length} characters</span>
        {allowAttachments && (
          <span>{attachments.length} / {maxAttachments} attachments</span>
        )}
      </div>
    </form>
  );
}

export default MessageInput;