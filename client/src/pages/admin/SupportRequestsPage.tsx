import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TicketIcon, ShieldAlert, Clock, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';

// This is a placeholder component for the admin view
// In a real implementation, this would display actual support requests
export default function SupportRequestsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading state for demo purposes
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container max-w-6xl mx-auto py-8">
      <Card className="shadow-lg border-2 border-primary/10">
        <CardHeader className="bg-primary/5">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="h-6 w-6 text-primary" />
            <CardTitle>Support Requests Admin Panel</CardTitle>
          </div>
          <CardDescription>
            View and manage escalated support requests
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="mt-4 text-muted-foreground">Loading support requests...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <Alert variant="default" className="bg-blue-50 border-blue-200">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">Coming Soon</AlertTitle>
                <AlertDescription className="text-blue-700">
                  This is a placeholder for the Admin Support Requests panel. 
                  In the final implementation, this screen would display all escalated 
                  support requests that require human intervention.
                </AlertDescription>
              </Alert>
              
              <Tabs defaultValue="new">
                <TabsList className="mb-4">
                  <TabsTrigger value="new">
                    New Requests <Badge className="ml-2 bg-red-500">3</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="in-progress">
                    In Progress <Badge className="ml-2 bg-yellow-500">2</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="resolved">
                    Resolved <Badge className="ml-2 bg-green-500">8</Badge>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="new" className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <RequestCard 
                      key={i}
                      id={`ticket_demo_${i}`}
                      status="new"
                      title="Media Upload Issue"
                      description="User is unable to upload images to the media library"
                      timestamp={new Date().toISOString()}
                    />
                  ))}
                </TabsContent>
                
                <TabsContent value="in-progress" className="space-y-4">
                  {[1, 2].map((_, i) => (
                    <RequestCard 
                      key={i}
                      id={`ticket_progress_${i}`}
                      status="in-progress"
                      title="Dashboard Data Not Loading"
                      description="User reports that financial dashboard charts aren't loading"
                      timestamp={new Date().toISOString()}
                    />
                  ))}
                </TabsContent>
                
                <TabsContent value="resolved" className="space-y-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((_, i) => (
                    <RequestCard 
                      key={i}
                      id={`ticket_resolved_${i}`}
                      status="resolved"
                      title="Password Reset Required"
                      description="User needed assistance with password reset flow"
                      timestamp={new Date().toISOString()}
                    />
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="bg-muted/50 flex justify-between">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Coming in Stage 2:</span> Full ticket management system
          </p>
          
          <p className="text-xs text-muted-foreground">
            {user ? `Logged in as: ${user.username}` : 'Not logged in'}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

interface RequestCardProps {
  id: string;
  status: 'new' | 'in-progress' | 'resolved';
  title: string;
  description: string;
  timestamp: string;
}

function RequestCard({ id, status, title, description, timestamp }: RequestCardProps) {
  const getStatusBadge = () => {
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
    }
  };
  
  return (
    <Card className={`
      border 
      ${status === 'new' ? 'border-red-200 bg-red-50/30' : ''} 
      ${status === 'in-progress' ? 'border-yellow-200 bg-yellow-50/30' : ''} 
      ${status === 'resolved' ? 'border-green-200 bg-green-50/30' : ''} 
    `}>
      <CardContent className="pt-4 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <TicketIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{id}</span>
              {getStatusBadge()}
            </div>
            <h3 className="font-medium mt-1">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          
          <div className="flex gap-2">
            <Button size="sm" variant="outline">View Details</Button>
            {status !== 'resolved' && (
              <Button size="sm" variant={status === 'new' ? 'default' : 'secondary'}>
                {status === 'new' ? 'Accept' : 'Resolve'}
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-2 border-t text-xs text-muted-foreground">
          <span>Submitted: {new Date(timestamp).toLocaleString()}</span>
          <span>
            {status === 'in-progress' ? 'Assigned to: Admin User' : ''}
            {status === 'resolved' ? 'Resolved by: Admin User' : ''}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}