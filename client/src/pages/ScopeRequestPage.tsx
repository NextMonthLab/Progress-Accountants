import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet';
import { Send, RefreshCw, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatResponse {
  success: boolean;
  message: string;
  conversationId: string;
  structuredData: any | null;
}

export default function ScopeRequestPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [structuredData, setStructuredData] = useState<any | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  
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
    setIsSent(false);
    setInput('');
    
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
  
  // Handle sending a message
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    // Add user message to UI
    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Send message to API
      const response = await fetch('/api/scope-request/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          conversationId
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const data: ChatResponse = await response.json();
      
      // Add assistant message to UI
      const assistantMessage: ChatMessage = { 
        role: 'assistant', 
        content: data.message 
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Save conversation ID
      if (data.conversationId) {
        setConversationId(data.conversationId);
      }
      
      // Check if we received structured data
      if (data.structuredData) {
        setStructuredData(data.structuredData);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to communicate with the assistant. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Send the finalized request to NextMonth Dev
  const sendToNextMonthDev = async () => {
    if (!structuredData || isSending || isSent) return;
    
    setIsSending(true);
    
    try {
      const response = await fetch('/api/scope-request/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestData: structuredData })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send request to NextMonth Dev');
      }
      
      setIsSent(true);
      toast({
        title: 'Success!',
        description: 'Your request has been sent to NextMonth Dev.',
        variant: 'default'
      });
      
    } catch (error) {
      console.error('Error sending to NextMonth Dev:', error);
      toast({
        title: 'Error',
        description: 'Failed to send request to NextMonth Dev. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSending(false);
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
              Use the assistant below to scope your idea. Once you're ready, it'll format everything and send it to the Dev team.
            </CardDescription>
          </CardHeader>
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger 
                value="preview" 
                disabled={!structuredData}
              >
                Review & Send
              </TabsTrigger>
            </TabsList>
            
            {/* Chat Tab */}
            <TabsContent value="chat" className="space-y-4">
              <CardContent className="p-6">
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
                    placeholder="Type your message here..."
                    className="resize-none"
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={isLoading || !input.trim()}
                    style={{ 
                      backgroundColor: 'var(--orange)',
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
              </CardContent>
              
              <CardFooter className="border-t flex justify-between p-4">
                <Button 
                  variant="outline" 
                  onClick={resetConversation}
                  disabled={isLoading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  New Conversation
                </Button>
                
                {structuredData && (
                  <Button
                    onClick={() => setActiveTab('preview')}
                    style={{ 
                      backgroundColor: 'var(--navy)',
                      color: 'white' 
                    }}
                  >
                    Review & Send
                  </Button>
                )}
              </CardFooter>
            </TabsContent>
            
            {/* Preview Tab */}
            <TabsContent value="preview">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--navy)' }}>
                    Feature Request Preview
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Review the details of your feature request below before sending to NextMonth Dev.
                  </p>
                  
                  {structuredData && (
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Project</p>
                            <p className="font-medium" style={{ color: 'var(--navy)' }}>{structuredData.project}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Type</p>
                            <p className="font-medium" style={{ color: 'var(--navy)' }}>{structuredData.type}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-500">Screen Name</p>
                          <p className="font-medium" style={{ color: 'var(--navy)' }}>{structuredData.payload.screen_name}</p>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-500">Description</p>
                          <p className="text-gray-700">{structuredData.payload.description}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-2">Features</p>
                          <ul className="list-disc pl-5 space-y-1">
                            {structuredData.payload.features.map((feature: string, index: number) => (
                              <li key={index} className="text-gray-700">{feature}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {isSent && (
                    <Alert className="mt-4 bg-green-50 border-green-200">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <AlertTitle className="text-green-700">Request Sent!</AlertTitle>
                      <AlertDescription className="text-green-600">
                        Your request has been successfully sent to NextMonth Dev for review.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="border-t flex justify-between p-4">
                <Button 
                  variant="outline"
                  onClick={() => setActiveTab('chat')}
                >
                  Back to Chat
                </Button>
                
                <Button
                  onClick={sendToNextMonthDev}
                  disabled={isSending || isSent}
                  style={{ 
                    backgroundColor: isSent ? 'var(--navy)' : 'var(--orange)',
                    color: 'white' 
                  }}
                >
                  {isSending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : isSent ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Sent to NextMonth Dev
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send to NextMonth Dev
                    </>
                  )}
                </Button>
              </CardFooter>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}