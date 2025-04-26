import { useState } from "react";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export function EntrepreneurCompanion() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hi there! I'm your personal entrepreneur assistant. I have access to your journal insights and can provide personalized support. How can I help you today?",
      role: "assistant",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // In a real implementation, this would call an API endpoint
      // that has access to the user's journal entries, mood trends, etc.
      
      // For now, simulate a response with appropriate delay
      setTimeout(() => {
        // Simulated personalized responses based on the user input
        let response = "";
        const inputLower = input.toLowerCase();
        
        if (inputLower.includes("stress") || inputLower.includes("overwhelmed")) {
          response = "I notice from your recent journal entries that you've been feeling some pressure. Remember to take short breaks - even 5 minutes of stepping away can help reset your focus. Would you like some specific stress management techniques for entrepreneurs?";
        } else if (inputLower.includes("idea") || inputLower.includes("new business")) {
          response = "That sounds interesting! Your journal shows you've been thinking creatively lately. Would you like me to help you outline this idea or connect it with your existing business goals?";
        } else if (inputLower.includes("tired") || inputLower.includes("exhausted")) {
          response = "I've noticed patterns in your entries suggesting you might be overworking. Remember that sustainable entrepreneurship requires rest too. Could we look at your schedule to find some recovery time?";
        } else if (inputLower.includes("goal") || inputLower.includes("plan")) {
          response = "Setting clear goals is crucial. Based on your previous entries, you tend to accomplish more when you break large goals into smaller weekly targets. Would you like to create a structured plan together?";
        } else {
          response = "Thank you for sharing that. As your entrepreneur companion, I'm here to support your journey. Is there a specific aspect of your business you'd like guidance on today?";
        }
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response,
          role: "assistant",
          timestamp: new Date()
        };
        
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Message failed",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[350px]">
      <ScrollArea className="flex-1 p-4 border rounded-md mb-4 bg-background">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${
                message.role === "assistant" ? "justify-start" : "justify-end"
              }`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%] ${
                message.role === "assistant" 
                  ? "bg-secondary/20 text-secondary-foreground" 
                  : "bg-primary/10 text-primary-foreground"
              } p-3 rounded-lg`}>
                {message.role === "assistant" ? (
                  <Bot className="h-5 w-5 mt-0.5 flex-shrink-0" />
                ) : (
                  <User className="h-5 w-5 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-secondary/20 text-secondary-foreground p-3 rounded-lg flex items-center space-x-2">
                <Bot className="h-5 w-5 flex-shrink-0" />
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        <div className="flex-1">
          <Textarea
            placeholder="Ask me anything about your business..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="resize-none"
            rows={2}
            disabled={isLoading}
          />
        </div>
        <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}