import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet';
import { Send, RefreshCw, CheckCircle, Loader2, XCircle, MailIcon, Star, ListPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion } from 'framer-motion';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatResponse {
  success: boolean;
  message: string;
  conversationId: string;
  structuredData: any | null;
  isScreened?: boolean;
  screeningResult?: {
    category: 'template_ready' | 'simple_custom' | 'wishlist';
    response: string;
    shouldSubmitToDev: boolean;
    wishlistSubmitted?: boolean;
    matchedModule?: string;
  };
  wishlistSubmitted?: boolean;
}

// Define possible states for the assistant flow
type AssistantState = 'chatting' | 'confirm' | 'sending' | 'success' | 'error' | 'wishlist_submitted';

export default function ScopeRequestPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [structuredData, setStructuredData] = useState<any | null>(null);
  const [assistantState, setAssistantState] = useState<AssistantState>('chatting');
  const [errorMessage, setErrorMessage] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Start a new conversation
  const resetConversation = () => {
    setMessages([]);
    setConversationId(null);
    setStructuredData(null);
    setInput('');
    setAssistantState('chatting');
    setErrorMessage('');
    
    // Add welcome message
    const welcomeMessage: ChatMessage = {
      role: 'assistant',
      content: 'Hi there! I\'m here to help you scope your new feature request. What would you like to build?'
    };
    setMessages([welcomeMessage]);
  };
  
  // Initialize with a welcome message
  useEffect(() => {
    resetConversation();
  }, []);
  
  // Check if the message asks for confirmation
  const isConfirmationMessage = (content: string): boolean => {
    const confirmationPhrases = [
      'shall i send it', 
      'send it to nextmonth', 
      'send to nextmonth',
      'structured this request'
    ];
    
    return confirmationPhrases.some(phrase => 
      content.toLowerCase().includes(phrase)
    );
  };
  
  // Check if the user is confirming
  const isUserConfirming = (content: string): boolean => {
    const confirmPhrases = [
      'yes', 
      'yeah', 
      'sure', 
      'ok',
      'okay',
      'send it',
      'please',
      'confirm',
      'go ahead'
    ];
    
    const lowercaseContent = content.toLowerCase().trim();
    
    return confirmPhrases.some(phrase => 
      lowercaseContent === phrase || 
      lowercaseContent.includes(`${phrase} please`) ||
      lowercaseContent.includes(`yes ${phrase}`) ||
      lowercaseContent.includes(`${phrase} yes`) ||
      lowercaseContent.startsWith(`${phrase} `)
    );
  };
  
  // Extract JSON from text if it exists
  const extractJSON = (text: string): any | null => {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.error("Failed to parse JSON from response:", err);
    }
    return null;
  };
  
  // Handle sending a message
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    // Add user message to UI
    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Check if we're in confirm state and user is confirming
    if (assistantState === 'confirm' && isUserConfirming(userMessage.content)) {
      await handleSendToNextMonthDev();
      return;
    }
    
    try {
      // Send message to API
      console.log('Sending message to API:', userMessage.content);
      const response = await fetch('/api/scope-request/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          conversationId: conversationId || undefined
        })
      });
      
      if (!response.ok) {
        console.error('API response not OK:', response.status, response.statusText);
        throw new Error(`Failed to send message: ${response.status} ${response.statusText}`);
      }
      
      const data: ChatResponse = await response.json();
      console.log('Received response:', data);
      
      // Check if this is a screened response
      if (data.isScreened && data.screeningResult) {
        const { category, shouldSubmitToDev, matchedModule } = data.screeningResult;
        
        // Add assistant message to UI
        const assistantMessage: ChatMessage = { 
          role: 'assistant', 
          content: data.message 
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        // Handle based on category
        if (category === 'template_ready' || category === 'simple_custom') {
          if (shouldSubmitToDev) {
            // Create structured data if needed
            if (!structuredData) {
              const newStructuredData = {
                project: "progress_accountants",
                type: "screen_request",
                payload: {
                  screen_name: matchedModule || "new_screen",
                  description: `Auto-generated request for ${matchedModule || "new feature"}`,
                  features: [`${category === 'template_ready' ? 'Template' : 'Custom'} screen: ${matchedModule || "general"}`]
                }
              };
              setStructuredData(newStructuredData);
            }
            setAssistantState('confirm');
          }
        } else if (category === 'wishlist') {
          // Handle wishlist item submission
          if (data.wishlistSubmitted) {
            // Show success animation for wishlist
            setTimeout(() => {
              setAssistantState('wishlist_submitted');
              
              // After showing the animation, go back to chatting
              setTimeout(() => {
                setAssistantState('chatting');
              }, 3000);
            }, 500);
          }
        }
      }
      // Check if the response includes JSON or structured data
      else if (data.structuredData || (data.message && data.message.includes('{"project":'))) {
        // Store structured data
        if (data.structuredData) {
          setStructuredData(data.structuredData);
        } else {
          const extracted = extractJSON(data.message);
          if (extracted) {
            setStructuredData(extracted);
          }
        }
        
        // Don't show the JSON in the chat
        const displayMessage = "Great! I've structured this request. Shall I send it to NextMonth Dev for review?";
        
        // Add assistant message to UI with the modified content
        const assistantMessage: ChatMessage = { 
          role: 'assistant', 
          content: displayMessage
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setAssistantState('confirm');
      } else {
        // Regular message without JSON
        const assistantMessage: ChatMessage = { 
          role: 'assistant', 
          content: data.message 
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        // Check if the message is asking for confirmation
        if (isConfirmationMessage(data.message)) {
          setAssistantState('confirm');
        }
      }
      
      // Save conversation ID
      if (data.conversationId) {
        setConversationId(data.conversationId);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      let errorMessage = 'Failed to communicate with the assistant. Please try again.';
      if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Send the finalized request to NextMonth Dev
  const handleSendToNextMonthDev = async () => {
    if (!structuredData) {
      console.error("No structured data to send");
      return;
    }
    
    setAssistantState('sending');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/scope-request/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestData: structuredData })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send request to NextMonth Dev');
      }
      
      // Successful request
      setAssistantState('success');
      
      toast({
        title: 'Success!',
        description: 'Your request has been sent to NextMonth Dev.',
        variant: 'default'
      });
      
    } catch (error) {
      console.error('Error sending to NextMonth Dev:', error);
      setAssistantState('error');
      const errorMsg = error instanceof Error ? error.message : 'An unknown error occurred';
      setErrorMessage(errorMsg);
      
      toast({
        title: 'Error',
        description: 'Failed to send request to NextMonth Dev. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle retry after error
  const handleRetry = () => {
    if (assistantState === 'error') {
      handleSendToNextMonthDev();
    }
  };

  // Render the sending animation state
  const renderSendingState = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <motion.div
        animate={{
          y: [0, -15, 0],
          opacity: [1, 0.8, 1]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="mb-6"
      >
        <MailIcon size={48} className="text-[var(--orange)]" />
      </motion.div>
      <h3 className="text-xl font-medium mb-2 text-center">Sending your request to NextMonth Dev…</h3>
      <p className="text-gray-500 text-center">This will just take a moment</p>
    </div>
  );
  
  // Render the success state
  const renderSuccessState = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6 bg-green-100 p-4 rounded-full"
      >
        <CheckCircle size={48} className="text-green-600" />
      </motion.div>
      
      <h3 className="text-xl font-medium mb-4 text-center">All done!</h3>
      <p className="text-gray-700 text-center mb-8 max-w-md">
        Your request has been received by the Dev team. They'll begin work on your new screen shortly.
      </p>
      
      <Button
        onClick={resetConversation}
        style={{ 
          backgroundColor: 'var(--navy)',
          color: 'white' 
        }}
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Start Another Request
      </Button>
    </div>
  );
  
  // Render the error state
  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6 bg-red-100 p-4 rounded-full"
      >
        <XCircle size={48} className="text-red-600" />
      </motion.div>
      
      <h3 className="text-xl font-medium mb-4 text-center">Something went wrong</h3>
      <p className="text-gray-700 text-center mb-8 max-w-md">
        Something went wrong while sending your request. Please try again or reach out for support.
      </p>
      
      <div className="flex space-x-4">
        <Button
          variant="outline"
          onClick={resetConversation}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Start Over
        </Button>
        
        <Button
          onClick={handleRetry}
          style={{ 
            backgroundColor: 'var(--orange)',
            color: 'white' 
          }}
        >
          <Send className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    </div>
  );
  
  // Render the chat interface
  const renderChatInterface = () => (
    <>
      <div className="flex flex-col space-y-4 h-[400px] overflow-y-auto mb-4 p-4 bg-gray-50 rounded-md">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-[var(--orange)] text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={assistantState === 'confirm' 
            ? "Type 'Yes' to confirm or ask for changes..." 
            : "Type your message here..."}
          className="resize-none"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={isLoading || !input.trim()}
          style={{ 
            backgroundColor: assistantState === 'confirm' ? 'var(--navy)' : 'var(--orange)',
            color: 'white' 
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
      
      <div className="mt-4 flex justify-between">
        <Button 
          variant="outline" 
          onClick={resetConversation}
          disabled={isLoading}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          New Conversation
        </Button>
        
        {assistantState === 'confirm' && (
          <Button
            onClick={handleSendToNextMonthDev}
            disabled={isLoading}
            style={{ 
              backgroundColor: 'var(--navy)',
              color: 'white' 
            }}
          >
            <Send className="h-4 w-4 mr-2" />
            Send to NextMonth Dev
          </Button>
        )}
      </div>
    </>
  );
  
  // Render the main content based on state
  const renderMainContent = () => {
    switch (assistantState) {
      case 'sending':
        return renderSendingState();
      case 'success':
        return renderSuccessState();
      case 'error':
        return renderErrorState();
      case 'chatting':
      case 'confirm':
      default:
        return renderChatInterface();
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Helmet>
        <title>New Feature Request | Progress Accountants</title>
      </Helmet>

      <div className="container mx-auto max-w-5xl px-4">
        <Card className="shadow-lg">
          <CardHeader className="bg-[var(--navy)] text-white">
            <CardTitle className="text-2xl">New Feature Request</CardTitle>
            <CardDescription className="text-gray-200">
              Use the assistant below to scope your idea. Once you're ready, it'll send your request to the Dev team.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            {renderMainContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}