import React, { useState, useRef, useEffect } from 'react';
import { useCompanionContext } from '@/hooks/use-companion-context';
import { useAuth } from '@/hooks/use-auth';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MessageSquare, Send, Loader2, Trash2, X, Bug, ToggleRight, Bot, Settings, Info } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from "@/lib/queryClient";

// Define message type for chat
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export function DualModeCompanion() {
  // Get the companion context and auth state
  const { mode, businessIdentity, brandSettings, debugMode, toggleDebugMode, forceMode } = useCompanionContext();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State for the component
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'system',
      content: getWelcomeMessage(mode),
      timestamp: new Date(),
    },
  ]);
  const [messageText, setMessageText] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forcedMode, setForcedMode] = useState<'admin' | 'public' | null>(null);
  const [isError, setIsError] = useState(false);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const drawerBodyRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Function to generate a welcome message based on mode
  function getWelcomeMessage(mode: 'admin' | 'public' | 'debug'): string {
    if (mode === 'admin') {
      return `Hi there! I'm your administrative assistant. I can help you with content creation, SEO, and managing your Progress Accountants platform. Just ask me anything about setting up pages, creating content, or administrative tasks.`;
    } else {
      return `Welcome to Progress Accountants! I'm here to help answer your questions about our services, team, and how we can assist with your accounting needs. How can I help you today?`;
    }
  }

  // Reset the conversation
  const resetConversation = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'system',
        content: getWelcomeMessage(forcedMode || mode),
        timestamp: new Date(),
      },
    ]);
    setConversationId(null);
    setIsError(false);
  };

  // Handle submitting a new message
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim() || isSubmitting) return;
    
    // Add user message to UI
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessageText('');
    setIsSubmitting(true);
    setIsError(false);
    
    try {
      // Get current mode, respecting any debug overrides
      const currentMode = forcedMode || mode;
      
      // Send to API
      const response = await apiRequest('POST', '/api/companion/chat', {
        message: userMessage.content,
        conversationId,
        mode: currentMode,
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from assistant');
      }
      
      const data = await response.json();
      
      // Save conversation ID if provided
      if (data.conversationId) {
        setConversationId(data.conversationId);
      }
      
      // Add assistant's response to UI
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting assistant response:', error);
      setIsError(true);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'system',
        content: 'Sorry, there was an error processing your request. Please try again later.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: 'Error',
        description: 'Failed to get response from assistant',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle the debug mode for developers
  const handleToggleDebugMode = () => {
    toggleDebugMode();
    toast({
      title: debugMode ? 'Debug Mode Disabled' : 'Debug Mode Enabled',
      description: debugMode 
        ? 'Assistant will now work in regular mode' 
        : 'You can now override the assistant mode',
    });
  };

  // Change the mode in debug mode
  const handleForceMode = (mode: 'admin' | 'public' | null) => {
    setForcedMode(mode);
    if (mode) {
      forceMode(mode);
      toast({
        title: `Mode Forced: ${mode.toUpperCase()}`,
        description: `Assistant is now in ${mode} mode`,
      });
    } else {
      forceMode(mode === 'admin' ? 'admin' : 'public');
      toast({
        title: 'Mode Reset',
        description: 'Assistant is now using automatic mode detection',
      });
    }
    resetConversation();
  };

  // Format the display message (add proper line breaks for display)
  const formatMessage = (content: string) => {
    return content.split('\\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <>
      {/* Chat trigger button (fixed position, bottom right) */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsOpen(true)}
              className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg"
              style={{ 
                backgroundColor: brandSettings?.color.primary || '#1e3a8a',
                color: 'white',
                zIndex: 100,
              }}
            >
              <MessageSquare size={24} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ask Progress Assistant</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Chat drawer */}
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="h-[85vh] max-w-[450px] mx-auto rounded-t-xl">
          <DrawerHeader className="border-b" style={{ 
            backgroundColor: mode === 'admin' ? brandSettings?.color.primary : brandSettings?.color.secondary,
            color: 'white',
          }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bot className="mr-2" size={20} />
                <DrawerTitle>
                  {mode === 'admin' ? 'Admin Assistant' : 'Progress Assistant'}
                </DrawerTitle>
              </div>
              
              {/* Mode indicator for debug mode */}
              {debugMode && (
                <Badge 
                  variant="outline" 
                  className="text-xs border-white text-white"
                >
                  {forcedMode || mode} mode
                </Badge>
              )}
              
              <DrawerClose>
                <Button variant="ghost" size="icon" className="text-white">
                  <X size={18} />
                </Button>
              </DrawerClose>
            </div>
            
            {/* Brief description based on mode */}
            <CardDescription className="text-gray-100 text-sm mt-1">
              {mode === 'admin' 
                ? 'I can help with admin tasks and content creation' 
                : `Ask questions about ${businessIdentity?.core.businessName || 'our accounting services'}`
              }
            </CardDescription>
          </DrawerHeader>
          
          <div ref={drawerBodyRef} className="px-4 py-0 flex-1 overflow-auto">
            <ScrollArea className="h-[55vh] w-full pr-4">
              <div className="flex flex-col space-y-4 p-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : msg.role === 'system'
                          ? 'bg-muted text-muted-foreground'
                          : 'bg-muted'
                      }`}
                      style={
                        msg.role === 'user'
                          ? { backgroundColor: brandSettings?.color.primary || '#1e3a8a' }
                          : {}
                      }
                    >
                      <div className="text-sm whitespace-pre-wrap">
                        {formatMessage(msg.content)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {/* Error message */}
            {isError && (
              <Alert variant="destructive" className="mt-4 mb-2">
                <AlertDescription>
                  There was an error connecting to the assistant. Please try again.
                </AlertDescription>
              </Alert>
            )}
            
            {/* Debug mode controls */}
            {debugMode && (
              <Card className="mt-4 mb-2 bg-yellow-50 border-yellow-200">
                <CardHeader className="py-2 px-4">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Bug className="w-4 h-4 mr-2" />
                    Debug Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="mode-switch" className="text-xs">Force Mode:</Label>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant={forcedMode === 'public' ? 'default' : 'outline'} 
                        onClick={() => handleForceMode('public')}
                        className="h-7 text-xs"
                      >
                        Public
                      </Button>
                      <Button 
                        size="sm" 
                        variant={forcedMode === 'admin' ? 'default' : 'outline'} 
                        onClick={() => handleForceMode('admin')}
                        className="h-7 text-xs"
                      >
                        Admin
                      </Button>
                      <Button 
                        size="sm" 
                        variant={forcedMode === null ? 'default' : 'outline'} 
                        onClick={() => handleForceMode(null)}
                        className="h-7 text-xs"
                      >
                        Auto
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Chat form */}
            <div className="pt-2 pb-4">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <Textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message..."
                  className="min-h-[80px] flex-1"
                  disabled={isSubmitting}
                />
                <div className="flex flex-col space-y-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !messageText.trim()}
                    className="px-3"
                    style={{ backgroundColor: brandSettings?.color.primary || '#1e3a8a' }}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="px-3"
                    onClick={resetConversation}
                    title="Clear conversation"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                  
                  {/* Debug mode toggle - only visible for admins and super_admins */}
                  {user && ['admin', 'super_admin'].includes(user.userType) && (
                    <Button
                      type="button"
                      variant="outline"
                      className="px-3"
                      onClick={handleToggleDebugMode}
                      title={debugMode ? "Disable debug mode" : "Enable debug mode"}
                    >
                      <Bug className={`h-5 w-5 ${debugMode ? 'text-yellow-500' : ''}`} />
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>
          
          <DrawerFooter className="border-t pt-2 pb-4 px-4">
            <div className="text-xs text-muted-foreground flex items-center justify-between">
              <div className="flex items-center">
                <Info className="h-3 w-3 mr-1" />
                <span>Progress Accountants AI Assistant</span>
              </div>
              {mode === 'admin' ? (
                <Badge variant="outline" className="text-xs">Admin Mode</Badge>
              ) : (
                <Badge variant="outline" className="text-xs">Client Mode</Badge>
              )}
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}