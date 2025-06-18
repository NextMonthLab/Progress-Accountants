import { useState, useEffect, useRef } from 'react';
import { MessageSquareIcon, SendIcon, XCircleIcon, Info, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
};

export const CompanionConsole = ({ clientId = 'progress-accountants' }: { clientId?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'system',
      content: 'Welcome to the Companion Console! How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newMessage,
          clientId,
          context: {
            currentPage: window.location.pathname,
            timestamp: new Date().toISOString(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.message || 'I apologize, but I couldn\'t process your request at this time.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'system',
          content: 'There was an error processing your request. Please try again later.',
          timestamp: new Date(),
        },
      ]);
      
      toast({
        variant: 'destructive',
        title: 'Communication Error',
        description: 'Failed to send your message. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const reportIssue = async () => {
    toast({
      title: 'Feedback Submitted',
      description: 'Your feedback has been sent to the development team.',
    });
    
    try {
      await fetch('/api/support/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId,
          context: window.location.pathname,
          messages: messages.filter(m => m.role !== 'system'),
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Error sending feedback:', error);
    }
  };

  return (
    <>
      {/* Floating button */}
      <Button
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        variant="default"
      >
        <MessageSquareIcon className="h-6 w-6" />
      </Button>

      {/* Chat console */}
      {isOpen && (
        <Card className="fixed bottom-20 right-4 flex flex-col w-80 sm:w-96 h-96 shadow-xl rounded-lg overflow-hidden z-50 border">
          <div className="flex items-center justify-between bg-primary text-primary-foreground p-3">
            <h3 className="font-semibold">Companion Console</h3>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 rounded-full">
              <XCircleIcon className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : message.role === 'system'
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-secondary'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isSubmitting && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                  <div className="flex space-x-2 items-center">
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t">
            <div className="flex items-center space-x-2">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="resize-none text-sm"
                rows={2}
                disabled={isSubmitting}
              />
              <Button 
                onClick={handleSendMessage} 
                size="icon"
                disabled={isSubmitting || !newMessage.trim()}
              >
                <SendIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <button 
                className="flex items-center hover:text-foreground" 
                onClick={() => toast({
                  title: "About Companion Console",
                  description: "Context-aware AI assistance integrated with your system. Powered by NextMonth Tech.",
                })}
              >
                <Info className="h-3 w-3 mr-1" /> About
              </button>
              <button className="flex items-center hover:text-foreground" onClick={reportIssue}>
                <Flag className="h-3 w-3 mr-1" /> Report Issue
              </button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default CompanionConsole;