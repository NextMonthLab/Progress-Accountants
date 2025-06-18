import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send, Paperclip, MoreHorizontal, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { smartFetch } from "@/utils/smartFetch";

interface Message {
  id: number;
  sender: string;
  role: string;
  message: string;
  timestamp: string;
  isFromTeam: boolean;
  urgent: boolean;
}

interface MessageSummary {
  unreadCount: number;
  totalCount: number;
}

export default function MessageThread() {
  const [messageText, setMessageText] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages, isLoading: messagesLoading, error: messagesError } = useQuery<Message[]>({
    queryKey: ['/api/messages/:tenantId/recent'],
    queryFn: () => smartFetch('/api/messages/:tenantId/recent'),
  });

  const { data: summary } = useQuery<MessageSummary>({
    queryKey: ['/api/messages/:tenantId/summary'],
    queryFn: () => smartFetch('/api/messages/:tenantId/summary'),
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      try {
        console.log('Message submission data:', { content });
        const response = await smartFetch('/api/messages/:tenantId/send', {
          method: 'POST',
          body: JSON.stringify({ content, clientId: 1 }) // Using default client ID for now
        });
        
        const result = await response.json();
        console.log('Message submission response:', result);
        return result;
      } catch (error) {
        console.error('Message submission failed:', error);
        console.error('Full fetch URL:', import.meta.env.VITE_ADMIN_API + '/api/messages/progress-accountants-uk/send');
        console.error('VITE_ADMIN_API value:', import.meta.env.VITE_ADMIN_API);
        
        // Log additional error details if available
        if (error instanceof Response) {
          console.error('Status code:', error.status);
          console.error('Status text:', error.statusText);
          try {
            const errorText = await error.text();
            console.error('Response text:', errorText);
          } catch (e) {
            console.error('Could not read response text:', e);
          }
        }
        throw error;
      }
    },
    onSuccess: () => {
      // Clear the input and refresh messages
      setMessageText('');
      queryClient.invalidateQueries({ queryKey: ['/api/messages/:tenantId/recent'] });
      queryClient.invalidateQueries({ queryKey: ['/api/messages/:tenantId/summary'] });
      
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Could not send message",
        description: "⚠️ Could not send message. Check connection to SmartSite Admin Panel.",
        variant: "destructive",
      });
    }
  });

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    sendMessageMutation.mutate(messageText);
  };

  if (messagesLoading) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Messages</h2>
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </section>
    );
  }

  if (messagesError) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Messages</h2>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Unable to load messages. Please try again later.</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Recent Messages</h2>
        <Badge variant="outline" className="text-blue-600 border-blue-600">
          {summary?.unreadCount || 0} Unread
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Communication Hub
          </CardTitle>
          <CardDescription>Stay connected with your accounting team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {messages && messages.length > 0 ? (
              messages.map((message) => (
                <div key={message.id} className={`flex space-x-3 ${!message.isFromTeam ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {message.sender.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`flex-1 ${!message.isFromTeam ? 'text-right' : ''}`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-medium">{message.sender}</p>
                      <Badge variant="outline">{message.role}</Badge>
                      {message.urgent && (
                        <Badge variant="destructive">Urgent</Badge>
                      )}
                    </div>
                    <div className={`p-3 rounded-lg ${
                      message.isFromTeam 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'bg-blue-600 text-white'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{message.timestamp}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No messages yet</p>
                <p className="text-sm mt-1">Your conversations will appear here</p>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 border border-dashed border-gray-300 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <input 
                  type="text" 
                  placeholder="Type your message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={sendMessageMutation.isPending}
                />
              </div>
              <Button variant="outline" size="sm">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                onClick={handleSendMessage}
                disabled={sendMessageMutation.isPending || !messageText.trim()}
              >
                {sendMessageMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
            <p>Response time: Usually within 4 hours</p>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4 mr-1" />
              View All Messages
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}