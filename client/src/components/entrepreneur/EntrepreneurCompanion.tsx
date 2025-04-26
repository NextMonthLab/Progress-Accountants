import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export function EntrepreneurCompanion() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-message",
      content: "Hello! I'm your Entrepreneur Companion. How can I assist with your business today?",
      role: "assistant",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message to the conversation
    const userMessage: Message = {
      id: uuidv4(),
      content: inputMessage,
      role: "user",
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, we would call an API endpoint that uses OpenAI
      // Generate AI response based on the conversation history
      const aiResponse = generateMockResponse(inputMessage);
      
      // Add AI response to the conversation
      const assistantMessage: Message = {
        id: uuidv4(),
        content: aiResponse,
        role: "assistant",
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      toast({
        title: "Error",
        description: "Unable to generate a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearConversation = () => {
    setMessages([
      {
        id: "welcome-message",
        content: "Hello! I'm your Entrepreneur Companion. How can I assist with your business today?",
        role: "assistant",
        timestamp: new Date()
      }
    ]);
    
    toast({
      title: "Conversation cleared",
      description: "Starting a fresh conversation",
    });
  };

  // Simple mock response generator - in a real implementation this would call an LLM API
  const generateMockResponse = (userMessage: string): string => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes("goal") || lowerCaseMessage.includes("plan")) {
      return "Setting clear, measurable goals is essential for any entrepreneur. Consider using the SMART framework: Specific, Measurable, Achievable, Relevant, and Time-bound. What specific area of your business are you looking to improve?";
    } else if (lowerCaseMessage.includes("market") || lowerCaseMessage.includes("customer")) {
      return "Understanding your market and customers is crucial. Have you conducted any customer research or surveys recently? If not, even simple conversations with 5-10 existing customers can provide valuable insights.";
    } else if (lowerCaseMessage.includes("problem") || lowerCaseMessage.includes("challenge") || lowerCaseMessage.includes("issue")) {
      return "Challenges are part of every entrepreneurial journey. Let's break this down: What's the specific challenge you're facing? Who does it affect? What have you tried so far to address it?";
    } else if (lowerCaseMessage.includes("growth") || lowerCaseMessage.includes("scale")) {
      return "Growth requires both strategy and systems. Before scaling, ensure your core operations are documented and somewhat automated. What aspect of your business are you looking to grow specifically?";
    } else if (lowerCaseMessage.includes("finance") || lowerCaseMessage.includes("money") || lowerCaseMessage.includes("funding")) {
      return "Financial health is the foundation of business sustainability. It's important to regularly review your cash flow, pricing strategy, and expense management. Have you established a financial dashboard with key metrics for your business?";
    } else {
      return "Thank you for sharing that. As an entrepreneur, it's important to balance strategic thinking with day-to-day execution. Is there a specific area of your business where you'd like more focused guidance?";
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto space-y-4 mb-4 max-h-[220px]">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
          >
            <div 
              className={`px-3 py-2 rounded-lg max-w-[85%] ${
                message.role === "assistant" 
                  ? "bg-secondary/30 text-secondary-foreground" 
                  : "bg-primary text-primary-foreground"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <div className="text-xs mt-1 opacity-70 text-right">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="px-3 py-2 rounded-lg bg-secondary/30 text-secondary-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={clearConversation}
          title="Clear conversation"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Textarea 
          placeholder="Ask for business advice..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[60px] resize-none"
          disabled={isLoading}
        />
        <Button 
          onClick={handleSendMessage} 
          disabled={!inputMessage.trim() || isLoading}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}