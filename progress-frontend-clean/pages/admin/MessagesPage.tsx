import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2, Search, Filter, Mail, MailOpen, ExternalLink, Calendar, User, AtSign, Bot, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { apiRequest } from '@/lib/queryClient';

interface Message {
  id: string;
  clientId: string;
  sourceUrl: string | null;
  name: string;
  email: string;
  subject: string;
  messageBody: string;
  archived: boolean;
  autoResponseStatus: 'pending' | 'sent' | 'failed';
  autoResponseText: string | null;
  adminNotes: string | null;
  aiResponse: string | null;
  aiResponseSentAt: string | null;
  createdAt: string;
  updatedAt: string;
  readAt?: string | null;
}

interface MessagesResponse {
  success: boolean;
  messages: Message[];
  pagination: {
    total: number;
    offset: number;
    limit: number;
  };
}

export default function MessagesPage() {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read'>('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [aiAutoResponseEnabled, setAiAutoResponseEnabled] = useState(false);
  
  const queryClient = useQueryClient();
  const limit = 20;

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(0); // Reset to first page when searching
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch messages with search and filtering
  const { data: messagesData, isLoading, error } = useQuery({
    queryKey: ['messages', currentPage, debouncedSearchTerm, filterStatus],
    queryFn: async (): Promise<MessagesResponse> => {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: (currentPage * limit).toString(),
      });

      if (debouncedSearchTerm) {
        params.append('search', debouncedSearchTerm);
      }

      if (filterStatus !== 'all') {
        params.append('status', filterStatus);
      }

      const response = await fetch(`/api/messages?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      return response.json();
    },
  });

  // Mark message as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: string) => {
      return apiRequest(`/api/messages/${messageId}`, {
        method: 'PATCH',
        body: { readAt: new Date().toISOString() },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      if (selectedMessage) {
        setSelectedMessage({
          ...selectedMessage,
          readAt: new Date().toISOString(),
        });
      }
    },
  });

  const handleMarkAsRead = (messageId: string) => {
    markAsReadMutation.mutate(messageId);
  };

  const handleRowClick = (message: Message) => {
    setSelectedMessage(message);
    // Auto-mark as read if unread
    if (!message.readAt) {
      handleMarkAsRead(message.id);
    }
  };

  const isUnread = (message: Message) => !message.readAt;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge variant="default" className="bg-green-100 text-green-800">Auto-replied</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const truncateText = (text: string, maxLength: number = 60) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const totalPages = messagesData ? Math.ceil(messagesData.pagination.total / limit) : 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">
            Manage contact form submissions and inquiries
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {messagesData?.pagination.total || 0} total messages
          </Badge>
        </div>
      </div>

      {/* AI Auto-Response Settings */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bot className="h-5 w-5 text-primary" />
              <div>
                <Label htmlFor="ai-auto-response" className="text-sm font-medium">
                  Auto-respond to new messages with AI
                </Label>
                <p className="text-xs text-muted-foreground">
                  Generate intelligent responses using business identity
                </p>
              </div>
            </div>
            <Switch
              id="ai-auto-response"
              checked={aiAutoResponseEnabled}
              onCheckedChange={setAiAutoResponseEnabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages by name, email, subject, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterStatus} onValueChange={(value: 'all' | 'unread' | 'read') => setFilterStatus(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Messages</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Recent Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading messages...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              Error loading messages. Please try again.
            </div>
          ) : !messagesData?.messages.length ? (
            <div className="text-center py-8 text-muted-foreground">
              No messages found.
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden sm:table-cell">Email</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead className="hidden md:table-cell">Message</TableHead>
                      <TableHead className="hidden lg:table-cell">Received</TableHead>
                      <TableHead className="hidden xl:table-cell">Client</TableHead>
                      <TableHead className="w-24">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messagesData.messages.map((message) => (
                      <TableRow
                        key={message.id}
                        className={`cursor-pointer hover:bg-muted/50 ${
                          isUnread(message) ? 'font-semibold bg-blue-50/50' : ''
                        }`}
                        onClick={() => handleRowClick(message)}
                      >
                        <TableCell>
                          {isUnread(message) ? (
                            <Mail className="h-4 w-4 text-blue-600" />
                          ) : (
                            <MailOpen className="h-4 w-4 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{message.name}</TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">
                          {message.email}
                        </TableCell>
                        <TableCell>{truncateText(message.subject, 40)}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {truncateText(message.messageBody, 50)}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                          {format(new Date(message.createdAt), 'MMM d, HH:mm')}
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          <Badge variant="outline" className="text-xs">
                            {message.clientId}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(message.autoResponseStatus)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {currentPage * limit + 1} to{' '}
                    {Math.min((currentPage + 1) * limit, messagesData.pagination.total)} of{' '}
                    {messagesData.pagination.total} messages
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0}
                    >
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {currentPage + 1} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                      disabled={currentPage === totalPages - 1}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Message Detail Modal */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Message Details
              {selectedMessage && isUnread(selectedMessage) && (
                <Badge className="bg-blue-100 text-blue-800">Unread</Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedMessage && (
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedMessage.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <AtSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedMessage.email}</p>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Subject</p>
                <p className="font-medium text-lg">{selectedMessage.subject}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Message</p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedMessage.messageBody}</p>
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Received</p>
                    <p>{format(new Date(selectedMessage.createdAt), 'PPpp')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Client: {selectedMessage.clientId}</Badge>
                </div>
              </div>

              {selectedMessage.sourceUrl && (
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Source URL</p>
                    <a
                      href={selectedMessage.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {selectedMessage.sourceUrl}
                    </a>
                  </div>
                </div>
              )}

              {/* Auto Response Status */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Auto Response Status</p>
                  {getStatusBadge(selectedMessage.autoResponseStatus)}
                </div>
                {isUnread(selectedMessage) && (
                  <Button
                    onClick={() => handleMarkAsRead(selectedMessage.id)}
                    disabled={markAsReadMutation.isPending}
                    size="sm"
                  >
                    {markAsReadMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <MailOpen className="h-4 w-4 mr-2" />
                    )}
                    Mark as Read
                  </Button>
                )}
              </div>

              {/* AI Auto-Response Display */}
              {selectedMessage.aiResponse && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium">AI Auto-Response Sent</p>
                    {selectedMessage.aiResponseSentAt && (
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {format(new Date(selectedMessage.aiResponseSentAt), 'PPp')}
                      </Badge>
                    )}
                  </div>
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap text-sm">{selectedMessage.aiResponse}</p>
                  </div>
                </div>
              )}

              {selectedMessage.autoResponseText && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Auto Response Sent</p>
                  <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-sm">
                    {selectedMessage.autoResponseText}
                  </div>
                </div>
              )}

              {selectedMessage.adminNotes && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Admin Notes</p>
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-sm">
                    {selectedMessage.adminNotes}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}