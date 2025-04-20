import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export function CompanionConsole() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [businessId, setBusinessId] = useState<string>("");
  const [screenName, setScreenName] = useState<string>("");
  const [blueprintVersion, setBlueprintVersion] = useState<string>("1.0.0");
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [location] = useLocation();

  // Detect the current screen when component mounts
  useEffect(() => {
    // Parse the screen name from location
    const path = location.split("/").filter(Boolean);
    const currentScreen = path.length > 0 ? path[path.length - 1] : "home";
    setScreenName(currentScreen);

    // For demo purposes, let's set a default business ID
    // In production, this would be fetched from user context/state
    setBusinessId("progress-accountants");

    // Welcome message
    const welcomeMessage: Message = {
      role: "assistant",
      content: `Welcome to the Companion Console. How can I help you with the ${currentScreen} screen?`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [location]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const toggleConsole = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message to chat
    const userMessage: Message = {
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Send message to backend
      const response = await apiRequest("POST", "/api/support/chat", {
        message: inputValue,
        screenName,
        businessId,
        blueprintVersion,
      });
      
      const data = await response.json();
      
      // Add assistant response to chat
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response || "I'm sorry, I couldn't process your request.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Add error message
      const errorMessage: Message = {
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const sendToDev = async () => {
    try {
      // Format conversation for sending to developers
      const conversation = messages.map(msg => `${msg.role}: ${msg.content}`).join("\n");
      
      await apiRequest("POST", "/api/support/escalate", {
        conversation,
        screenName,
        businessId,
        blueprintVersion,
      });
      
      // Confirmation message
      const confirmationMessage: Message = {
        role: "system",
        content: "This conversation has been sent to our development team. They'll review it and get back to you soon.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, confirmationMessage]);
    } catch (error) {
      console.error("Error escalating to dev:", error);
      // Add error message
      const errorMessage: Message = {
        role: "system",
        content: "There was an issue sending this conversation to our development team. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* Floating button */}
      <Button
        onClick={toggleConsole}
        className="rounded-full h-12 w-12 shadow-lg bg-primary hover:bg-primary/90 transition-all duration-300"
        aria-label="Get support"
      >
        {isOpen ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="w-80 md:w-96 h-96 mt-4 shadow-lg animate-in slide-in-from-bottom-5 duration-300">
          <CardHeader className="p-3 border-b bg-muted/50">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">NextMonth Companion</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={sendToDev}
                className="text-xs"
              >
                Send to Dev
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <ScrollArea className="h-[260px] p-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-3 max-w-[85%] ${
                    msg.role === "user" 
                      ? "ml-auto" 
                      : msg.role === "system" 
                        ? "mx-auto text-center" 
                        : "mr-auto"
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : msg.role === "system"
                        ? "bg-muted text-muted-foreground"
                        : "bg-secondary"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center space-x-2 mb-3 max-w-[85%] mr-auto">
                  <div className="p-3 rounded-lg bg-secondary animate-pulse">
                    <div className="flex items-center">
                      <div className="h-1 w-1 rounded-full bg-primary mx-0.5 animate-bounce"></div>
                      <div className="h-1 w-1 rounded-full bg-primary mx-0.5 animate-bounce animation-delay-200"></div>
                      <div className="h-1 w-1 rounded-full bg-primary mx-0.5 animate-bounce animation-delay-500"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </ScrollArea>
          </CardContent>
          
          <CardFooter className="p-3 border-t">
            <div className="flex w-full items-center space-x-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                onClick={sendMessage} 
                size="icon" 
                disabled={!inputValue.trim() || isLoading}
                className="transition-all duration-300"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}