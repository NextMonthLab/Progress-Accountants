import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send, Paperclip, MoreHorizontal, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
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
  const { data: messages, isLoading: messagesLoading, error: messagesError } = useQuery<Message[]>({
    queryKey: ['/api/messages/:tenantId/recent'],
    queryFn: () => smartFetch('/api/messages/:tenantId/recent'),
  });

  const { data: summary } = useQuery<MessageSummary>({
    queryKey: ['/api/messages/:tenantId/summary'],
    queryFn: () => smartFetch('/api/messages/:tenantId/summary'),
  });

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
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button variant="outline" size="sm">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button size="sm">
                <Send className="h-4 w-4" />
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