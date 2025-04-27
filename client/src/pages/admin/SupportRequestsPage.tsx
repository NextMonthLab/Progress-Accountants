import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  TicketIcon, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2,
  FileDown,
  Search,
  ArrowUpDown,
  Download,
  MessageSquare,
  InfoIcon,
  CalendarIcon,
  MonitorIcon,
  SortAsc,
  SortDesc,
  XCircle,
  User,
  Mail,
  BellOff,
  Bell
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';

// Define ticket status types
type TicketStatus = 'new' | 'in-progress' | 'resolved' | 'escalated';

// Interface for the support ticket type
interface SupportTicket {
  id: number;
  ticketId: string;
  userId: number | null;
  sessionId: string;
  issueSummary: string;
  systemPart?: string;
  status: TicketStatus;
  priority: 'low' | 'medium' | 'high';
  systemContext: any; // This contains device, browser info, etc.
  stepsAttempted?: string[];
  resolution?: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: number;
  adminNotes?: string;
  // User info may be separate, but we'll add it for display
  userName?: string;
  userEmail?: string;
}

export default function SupportRequestsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // State for filtering, sorting and search
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof SupportTicket>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [viewingTicketId, setViewingTicketId] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<string>('');
  
  // Get tickets from API
  const { 
    data: ticketsData,
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['/api/admin/support-requests'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/support-requests');
      const data = await response.json();
      return data;
    }
  });
  
  // Mutation for updating ticket status
  const updateTicketMutation = useMutation({
    mutationFn: async ({ 
      ticketId, 
      status, 
      adminNotes 
    }: { 
      ticketId: string, 
      status?: string, 
      adminNotes?: string 
    }) => {
      const updateData: any = {};
      if (status) updateData.status = status;
      if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
      
      const response = await apiRequest('PUT', `/api/support/ticket/${ticketId}`, updateData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Ticket updated",
        description: "The ticket has been successfully updated.",
      });
      
      // Invalidate the query to refetch the tickets
      queryClient.invalidateQueries({ queryKey: ['/api/admin/support-requests'] });
      refetch();
    },
    onError: (error) => {
      console.error('Error updating ticket:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was a problem updating the ticket. Please try again.",
      });
    }
  });
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle sort
  const handleSort = (field: keyof SupportTicket) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to desc for new field
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // View ticket details
  const handleViewTicket = async (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setUpdateStatus(ticket.status);
    setAdminNote(ticket.adminNotes || '');
    setViewingTicketId(ticket.ticketId);
  };
  
  // Handle closing the detail view
  const handleCloseDetail = () => {
    setSelectedTicket(null);
    setViewingTicketId(null);
  };
  
  // Handle saving admin notes
  const handleSaveNotes = async () => {
    if (!selectedTicket) return;
    
    try {
      await updateTicketMutation.mutateAsync({ 
        ticketId: selectedTicket.ticketId, 
        adminNotes: adminNote 
      });
      
      setIsEditingNotes(false);
      
      // Update the local state
      setSelectedTicket(prev => prev ? { ...prev, adminNotes: adminNote } : null);
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };
  
  // Handle updating ticket status
  const handleStatusUpdate = async () => {
    if (!selectedTicket || updateStatus === selectedTicket.status) return;
    
    try {
      await updateTicketMutation.mutateAsync({ 
        ticketId: selectedTicket.ticketId, 
        status: updateStatus 
      });
      
      // Update the local state
      setSelectedTicket(prev => prev ? { ...prev, status: updateStatus as TicketStatus } : null);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  
  // Export ticket as JSON
  const handleExportTicket = (ticket: SupportTicket) => {
    const dataStr = JSON.stringify(ticket, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `ticket_${ticket.ticketId}_${new Date().toISOString()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Ticket exported",
      description: "The ticket data has been exported as JSON.",
    });
  };
  
  // Filter and sort tickets
  const filteredAndSortedTickets = (() => {
    if (!ticketsData?.tickets) return [];
    
    let filtered = [...ticketsData.tickets];
    
    // Filter by status if not "all"
    if (activeTab !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === activeTab);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(ticket => 
        ticket.issueSummary.toLowerCase().includes(query) ||
        ticket.ticketId.toLowerCase().includes(query) ||
        (ticket.userName && ticket.userName.toLowerCase().includes(query)) ||
        (ticket.systemPart && ticket.systemPart.toLowerCase().includes(query))
      );
    }
    
    // Sort tickets
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    return filtered;
  })();
  
  // Get counts for badges
  const getCounts = () => {
    if (!ticketsData?.tickets) return { new: 0, inProgress: 0, resolved: 0, escalated: 0, total: 0 };
    
    const counts = {
      new: ticketsData.tickets.filter(t => t.status === 'new').length,
      inProgress: ticketsData.tickets.filter(t => t.status === 'in-progress').length,
      resolved: ticketsData.tickets.filter(t => t.status === 'resolved').length,
      escalated: ticketsData.tickets.filter(t => t.status === 'escalated').length,
      total: ticketsData.tickets.length
    };
    
    return counts;
  };
  
  const counts = getCounts();
  
  // Handle mock data for initial development
  const useMockData = !ticketsData?.tickets || ticketsData.tickets.length === 0;
  
  // Generate mock tickets for demo purposes if no real data available
  const mockTickets: SupportTicket[] = [
    {
      id: 1,
      ticketId: 'TICKET-001',
      userId: 101,
      sessionId: 'session-123',
      issueSummary: 'Unable to upload images to media library',
      systemPart: 'Media Upload',
      status: 'new',
      priority: 'high',
      systemContext: {
        device: 'Desktop',
        browser: 'Chrome',
        viewport: {
          width: 1920,
          height: 1080
        },
        timestamp: new Date().toISOString()
      },
      stepsAttempted: [
        'Tried uploading smaller image',
        'Cleared browser cache',
        'Used different file format'
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userName: 'John Smith',
      userEmail: 'john@example.com'
    },
    {
      id: 2,
      ticketId: 'TICKET-002',
      userId: 102,
      sessionId: 'session-456',
      issueSummary: 'Dashboard charts not loading correctly',
      systemPart: 'Dashboard',
      status: 'in-progress',
      priority: 'medium',
      systemContext: {
        device: 'Tablet',
        browser: 'Safari',
        viewport: {
          width: 1024,
          height: 768
        },
        timestamp: new Date().toISOString()
      },
      adminNotes: 'User is experiencing intermittent connectivity issues. Asked them to try on desktop.',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      assignedTo: 1,
      userName: 'Lisa Johnson',
      userEmail: 'lisa@example.com'
    },
    {
      id: 3,
      ticketId: 'TICKET-003',
      userId: 103,
      sessionId: 'session-789',
      issueSummary: 'Password reset email not received',
      systemPart: 'Authentication',
      status: 'resolved',
      priority: 'high',
      systemContext: {
        device: 'Mobile',
        browser: 'Firefox',
        viewport: {
          width: 375,
          height: 812
        },
        timestamp: new Date().toISOString()
      },
      resolution: 'Email was in spam folder. User found it and reset their password successfully.',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
      adminNotes: 'Initial troubleshooting via email. Found issue was with email filtering.',
      userName: 'Mark Taylor',
      userEmail: 'mark@example.com'
    },
    {
      id: 4,
      ticketId: 'TICKET-004',
      userId: 104,
      sessionId: 'session-101',
      issueSummary: 'Calendar booking feature showing error',
      systemPart: 'Calendar/Booking',
      status: 'escalated',
      priority: 'high',
      systemContext: {
        device: 'Desktop',
        browser: 'Edge',
        viewport: {
          width: 1440,
          height: 900
        },
        timestamp: new Date().toISOString()
      },
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      updatedAt: new Date().toISOString(), // today
      adminNotes: 'Complex issue involving calendar sync. Escalated to dev team.',
      userName: 'Sarah Wilson',
      userEmail: 'sarah@example.com'
    }
  ];
  
  // Use mock data for initial development if no real data available
  const displayTickets = useMockData ? mockTickets : filteredAndSortedTickets;
  
  // Status Badge component
  const StatusBadge = ({ status }: { status: TicketStatus }) => {
    switch (status) {
      case 'new':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertTriangle className="h-3 w-3 mr-1 text-red-500" />
            New
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1 text-yellow-500" />
            In Progress
          </Badge>
        );
      case 'resolved':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
            Resolved
          </Badge>
        );
      case 'escalated':
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Bell className="h-3 w-3 mr-1 text-purple-500" />
            Escalated
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container max-w-7xl mx-auto py-8">
      <Card className="shadow-lg border-2 border-primary/10">
        <CardHeader className="bg-primary/5">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="h-6 w-6 text-primary" />
            <CardTitle>Support Requests Admin Panel</CardTitle>
          </div>
          <CardDescription>
            View and manage support tickets from all users
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="mt-4 text-muted-foreground">Loading support requests...</p>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error loading support requests</AlertTitle>
              <AlertDescription>
                There was a problem loading the support requests. Please try again.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-6">
              {/* Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tickets..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-xs"
                    onClick={() => handleSort('createdAt')}
                  >
                    Date
                    {sortField === 'createdAt' && (
                      sortDirection === 'asc' ? 
                        <SortAsc className="ml-1 h-3 w-3" /> : 
                        <SortDesc className="ml-1 h-3 w-3" />
                    )}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-xs"
                    onClick={() => handleSort('priority')}
                  >
                    Priority
                    {sortField === 'priority' && (
                      sortDirection === 'asc' ? 
                        <SortAsc className="ml-1 h-3 w-3" /> : 
                        <SortDesc className="ml-1 h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
              
              {/* Tabs */}
              <Tabs defaultValue="all" onValueChange={handleTabChange}>
                <TabsList className="mb-4">
                  <TabsTrigger value="all">
                    All <Badge className="ml-2 bg-gray-500">{counts.total}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="new">
                    New <Badge className="ml-2 bg-red-500">{counts.new}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="in-progress">
                    In Progress <Badge className="ml-2 bg-yellow-500">{counts.inProgress}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="escalated">
                    Escalated <Badge className="ml-2 bg-purple-500">{counts.escalated}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="resolved">
                    Resolved <Badge className="ml-2 bg-green-500">{counts.resolved}</Badge>
                  </TabsTrigger>
                </TabsList>
                
                {/* Tickets Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px]">Ticket ID</TableHead>
                        <TableHead>Issue Summary</TableHead>
                        <TableHead className="w-[150px]">Area Affected</TableHead>
                        <TableHead className="w-[150px]">
                          <div className="flex items-center">
                            <span>Submission Date</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="ml-1 h-6 w-6 p-0"
                              onClick={() => handleSort('createdAt')}
                            >
                              <ArrowUpDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableHead>
                        <TableHead className="w-[120px]">Status</TableHead>
                        <TableHead className="w-[150px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayTickets.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <BellOff className="h-12 w-12 mb-2 text-muted-foreground/50" />
                              <p>No tickets found</p>
                              {searchQuery && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="mt-2"
                                  onClick={() => setSearchQuery('')}
                                >
                                  Clear search
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        displayTickets.map((ticket) => (
                          <TableRow key={ticket.id}>
                            <TableCell className="font-medium">{ticket.ticketId}</TableCell>
                            <TableCell>{ticket.issueSummary}</TableCell>
                            <TableCell>{ticket.systemPart || 'General'}</TableCell>
                            <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <StatusBadge status={ticket.status} />
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewTicket(ticket)}
                              >
                                View Full Ticket
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Tabs>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="bg-muted/50 flex justify-between">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Tip:</span> Use the search field to find tickets by summary, ID, or user name
          </p>
          
          <p className="text-xs text-muted-foreground">
            {user ? `Logged in as: ${user.username}` : 'Not logged in'}
          </p>
        </CardFooter>
      </Card>
      
      {/* Ticket Detail Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && handleCloseDetail()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedTicket && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <TicketIcon className="h-5 w-5" />
                  Ticket {selectedTicket.ticketId}
                </DialogTitle>
                <DialogDescription>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <StatusBadge status={selectedTicket.status} />
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      Priority: {selectedTicket.priority}
                    </Badge>
                  </div>
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
                {/* Left column */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">User Information</h3>
                    <Card className="p-4 bg-muted/20">
                      <div className="flex gap-4 items-center">
                        <User className="h-12 w-12 text-muted-foreground p-2 bg-muted rounded-full" />
                        <div>
                          <p className="font-medium">{selectedTicket.userName || 'Anonymous User'}</p>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {selectedTicket.userEmail || 'Email not available'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            User ID: {selectedTicket.userId || 'Not logged in'}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Ticket Details</h3>
                    <Card className="p-4 bg-muted/20">
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">What were they trying to do?</p>
                          <p className="text-sm">{selectedTicket.issueSummary}</p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">System part affected</p>
                          <p className="text-sm">{selectedTicket.systemPart || 'Not specified'}</p>
                        </div>
                        
                        {selectedTicket.systemContext?.device && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Device</p>
                            <p className="text-sm flex items-center">
                              <MonitorIcon className="h-3 w-3 mr-1" />
                              {selectedTicket.systemContext.device}
                            </p>
                          </div>
                        )}
                        
                        {selectedTicket.systemContext?.browser && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Browser</p>
                            <p className="text-sm">{selectedTicket.systemContext.browser}</p>
                          </div>
                        )}
                        
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Submission Date</p>
                          <p className="text-sm flex items-center">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            {new Date(selectedTicket.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                  
                  {selectedTicket.stepsAttempted && selectedTicket.stepsAttempted.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Steps Attempted</h3>
                      <Card className="p-4 bg-muted/20">
                        <ul className="text-sm space-y-1 list-disc pl-5">
                          {selectedTicket.stepsAttempted.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ul>
                      </Card>
                    </div>
                  )}
                </div>
                
                {/* Right column */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-muted-foreground">Admin Notes</h3>
                      {!isEditingNotes ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setIsEditingNotes(true)}
                        >
                          Edit Notes
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setIsEditingNotes(false);
                              setAdminNote(selectedTicket.adminNotes || '');
                            }}
                          >
                            Cancel
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={handleSaveNotes}
                            disabled={updateTicketMutation.isPending}
                          >
                            {updateTicketMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : 'Save Notes'}
                          </Button>
                        </div>
                      )}
                    </div>
                    <Card className="p-4 bg-muted/20">
                      {isEditingNotes ? (
                        <Textarea
                          placeholder="Add notes about this ticket..."
                          value={adminNote}
                          onChange={(e) => setAdminNote(e.target.value)}
                          className="min-h-[150px]"
                        />
                      ) : adminNote ? (
                        <p className="text-sm whitespace-pre-wrap">{adminNote}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No admin notes yet.</p>
                      )}
                    </Card>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Update Status</h3>
                    <Card className="p-4 bg-muted/20">
                      <div className="space-y-4">
                        <Select
                          value={updateStatus}
                          onValueChange={setUpdateStatus}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="escalated">Escalated</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button
                          className="w-full"
                          disabled={
                            updateStatus === selectedTicket.status ||
                            updateTicketMutation.isPending
                          }
                          onClick={handleStatusUpdate}
                        >
                          {updateTicketMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Updating...
                            </>
                          ) : 'Update Status'}
                        </Button>
                      </div>
                    </Card>
                  </div>
                  
                  {selectedTicket.resolution && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Resolution</h3>
                      <Card className="p-4 bg-muted/20">
                        <p className="text-sm">{selectedTicket.resolution}</p>
                      </Card>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Export</h3>
                    <Card className="p-4 bg-muted/20">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleExportTicket(selectedTicket)}
                      >
                        <FileDown className="mr-2 h-4 w-4" />
                        Export Ticket JSON
                      </Button>
                    </Card>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex justify-between items-center gap-2">
                <p className="text-xs text-muted-foreground">
                  Session ID: {selectedTicket.sessionId}
                </p>
                <Button variant="outline" onClick={handleCloseDetail}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}