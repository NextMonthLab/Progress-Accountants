import { useState, useRef, useEffect } from 'react';
import { 
  Drawer, 
  DrawerContent,
  DrawerHeader,
  DrawerFooter, 
  DrawerTitle,
  DrawerDescription,
  DrawerClose
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  Send,
  Loader2,
  MessageCircle,
  X,
  Trash2,
  Info,
  Bug 
} from 'lucide-react';
import { useCompanionContext } from '@/hooks/use-companion-context';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/queryClient';
import { v4 as uuidv4 } from 'uuid';

// For our companion message format
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

// Helper to format code blocks and text
function formatMessage(text: string): React.ReactNode {
  // Basic markdown-like formatting for code blocks
  const parts = text.split(/```([\s\S]*?)```/);
  return parts.map((part, index) => {
    // Odd indexes are code blocks
    if (index % 2 === 1) {
      return (
        <div key={index} className="bg-gray-100 rounded p-2 my-2 font-mono text-xs overflow-x-auto">
          {part.trim()}
        </div>
      );
    }
    
    // Even indexes are regular text
    return part.split('\n').map((line, i) => (
      <span key={`${index}-${i}`}>
        {line}
        {i < part.split('\n').length - 1 && <br />}
      </span>
    ));
  });
}

export function DualModeCompanion() {
  // Get context data from provider
  const { 
    mode, 
    businessIdentity, 
    brandSettings, 
    isLoading,
    error,
    debugMode,
    toggleDebugMode,
    forceMode
  } = useCompanionContext();
  
  const { user } = useAuth();
  
  // State variables
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [forcedMode, setForcedMode] = useState<'admin' | 'public' | null>(null);
  
  // References
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const drawerBodyRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Get welcome message based on context
  function getWelcomeMessage(mode: 'admin' | 'public' | 'debug'): string {
    if (mode === 'debug') {
      return 'Debug mode is active. You can now test both admin and public modes regardless of your current page.';
    }
    
    if (mode === 'admin') {
      return 'Hi there! I can help you with content creation, platform management, and administrative tasks. What would you like assistance with today?';
    }
    
    return 'Welcome to Progress Accountants! How can I help you with your accounting needs today?';
  }
  
  // Initialize the chat with a welcome message
  useEffect(() => {
    if (open && messages.length === 0) {
      const userMessage: ChatMessage = {
        id: uuidv4(),
        role: 'user',
        content: 'Hi there!',
        timestamp: new Date()
      };
      
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: getWelcomeMessage(mode),
        timestamp: new Date()
      };
      
      setMessages([userMessage, assistantMessage]);
    }
  }, [open, mode, messages.length]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || isSubmitting) return;
    
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };
    
    // Add user message to chat
    setMessages((prev) => [...prev, userMessage]);
    setMessageText('');
    setIsSubmitting(true);
    setIsError(false);

    try {
      // Call API with the current mode
      const response = await apiRequest(
        'POST',
        '/api/companion/chat',
        {
          message: userMessage.content,
          conversationId,
          mode: debugMode ? forcedMode || mode : mode
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to get response');
      }
      
      const data = await response.json();
      
      // Set conversation ID for continuity
      if (!conversationId) {
        setConversationId(data.conversationId);
      }
      
      // Add assistant response to chat
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsError(true);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Sorry, I experienced an error. Please try again.',
        timestamp: new Date()
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Reset conversation
  const resetConversation = () => {
    setMessages([]);
    setConversationId(null);
  };
  
  // Toggle debug mode
  const handleToggleDebugMode = () => {
    toggleDebugMode();
    // Reset forced mode when toggling debug
    setForcedMode(null);
  };
  
  // Force a specific mode for testing
  const handleForceMode = (newMode: 'admin' | 'public' | null) => {
    setForcedMode(newMode);
    forceMode(newMode || mode);
  };
  
  return (
    <>
      {/* Floating button to open chat */}
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full p-3 shadow-lg text-white"
        style={{ 
          background: 'linear-gradient(135deg, #4F46E5 60%, #E935C1 40%)',
          border: 'none'
        }}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
      
      {/* Chat drawer */}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[90vh] sm:max-w-[500px] mx-auto rounded-t-lg bg-white">
          <DrawerHeader className="text-white rounded-t-lg px-4 py-3" 
            style={{ 
              background: 'linear-gradient(135deg, #4F46E5 60%, #E935C1 40%)'
            }}
          >
            <div className="flex justify-between items-center">
              <DrawerTitle className="text-white text-lg">
                {mode === 'admin' ? 'Admin Assistant' : 'Progress Accountants'}
              </DrawerTitle>
              <DrawerClose className="text-white">
                <X className="h-5 w-5" />
              </DrawerClose>
            </div>
            
            {/* Brief description based on mode */}
            <CardDescription className="text-gray-100 text-sm mt-1">
              {mode === 'admin' 
                ? 'I can help with admin tasks and content creation' 
                : 'Ask questions about our accounting services'
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
                          ? 'text-white'
                          : msg.role === 'system'
                          ? 'bg-muted text-muted-foreground'
                          : 'bg-muted'
                      }`}
                      style={
                        msg.role === 'user'
                          ? { background: 'linear-gradient(135deg, #4F46E5 60%, #E935C1 40%)' }
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
                    className="px-3 text-white border-none"
                    style={{ 
                      background: 'linear-gradient(135deg, #4F46E5 60%, #E935C1 40%)',
                      border: 'none'
                    }}
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