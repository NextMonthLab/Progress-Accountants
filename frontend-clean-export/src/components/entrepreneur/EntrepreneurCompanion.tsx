import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const EntrepreneurCompanion: React.FC = () => {
  const { toast } = useToast();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your personal Entrepreneur Companion. How can I assist with your business today?',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Add assistant response
      const assistantMessage: Message = {
        role: 'assistant',
        content: getSimulatedResponse(inputValue),
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };
  
  // Function to generate simulated responses
  const getSimulatedResponse = (userMessage: string): string => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes('marketing') || lowerCaseMessage.includes('promote')) {
      return "Marketing is crucial for small businesses. Consider starting with a strong social media presence and engaging content that resonates with your target audience. What specific aspect of marketing are you struggling with?";
    } else if (lowerCaseMessage.includes('pricing') || lowerCaseMessage.includes('charge')) {
      return "Pricing strategy can make or break your business. Consider value-based pricing rather than just competing on cost. Your unique value proposition should inform your price points. Have you analyzed what your competitors are charging?";
    } else if (lowerCaseMessage.includes('time') || lowerCaseMessage.includes('productivity')) {
      return "Time management is a common challenge for entrepreneurs. Try time-blocking your day and focusing on high-impact activities first. Have you considered delegating or automating some of your routine tasks?";
    } else if (lowerCaseMessage.includes('funding') || lowerCaseMessage.includes('money') || lowerCaseMessage.includes('finance')) {
      return "Financing options for entrepreneurs include bootstrapping, angel investors, small business loans, and crowdfunding. Each has pros and cons. What stage is your business in, and what amount of funding are you looking for?";
    } else if (lowerCaseMessage.includes('scale') || lowerCaseMessage.includes('grow')) {
      return "Scaling requires systematizing your processes and potentially delegating responsibilities. Have you documented your core business processes yet? That's often the first step to sustainable growth.";
    } else {
      return "That's an interesting point about your business. Would you like me to help you develop an action plan, provide resources, or brainstorm solutions?";
    }
  };

  return (
    <div className="flex flex-col h-[400px]">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-4 py-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="animate-pulse">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-auto">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          <Textarea 
            placeholder="Ask anything about your business..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="min-h-[60px] resize-none"
          />
          <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}>
            <SendHorizonal className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};