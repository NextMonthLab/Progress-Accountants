import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send, Paperclip, MoreHorizontal } from "lucide-react";

export default function MessageThread() {
  const messages = [
    {
      id: 1,
      sender: "Sarah Johnson",
      role: "Accountant",
      message: "Hi! I've reviewed your Q4 expenses. There are a few receipts missing from December. Could you upload them when convenient?",
      timestamp: "2 hours ago",
      isFromTeam: true,
      urgent: false
    },
    {
      id: 2,
      sender: "You",
      role: "Client",
      message: "Thanks Sarah. I'll gather those receipts today and upload them by end of business.",
      timestamp: "1 hour ago",
      isFromTeam: false,
      urgent: false
    },
    {
      id: 3,
      sender: "Mark Thompson",
      role: "Tax Advisor",
      message: "Regarding your Corporation Tax planning meeting next week - I've prepared some preliminary calculations. The meeting is confirmed for Tuesday at 2 PM.",
      timestamp: "45 minutes ago",
      isFromTeam: true,
      urgent: true
    }
  ];

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Recent Messages</h2>
        <Badge variant="outline" className="text-blue-600 border-blue-600">
          3 Unread
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
            {messages.map((message) => (
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
            ))}
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