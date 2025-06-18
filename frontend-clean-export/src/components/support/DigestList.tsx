import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, BookOpen, Mail, MailCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { formatDistanceToNow } from 'date-fns';

interface SupportDigest {
  id: number;
  title: string;
  issueDescription: string;
  resolutionSummary: string;
  systemStatus: string;
  nextTip: string;
  digestType: string;
  read: boolean;
  delivered: boolean;
  emailSent: boolean;
  createdAt: string;
}

interface DigestListProps {
  userId: number;
}

const DigestList: React.FC<DigestListProps> = ({ userId }) => {
  const { toast } = useToast();
  const [expandedDigestId, setExpandedDigestId] = useState<number | null>(null);

  // Fetch digests for the user
  const { data, isLoading, error } = useQuery<{ count: number, digests: SupportDigest[] }>({
    queryKey: ['/api/support/digest/user', userId],
    queryFn: () => apiRequest('GET', `/api/support/digest/user/${userId}`).then(res => res.json()),
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (digestId: number) => {
      return apiRequest('PUT', `/api/support/digest/${digestId}/read`).then(res => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/support/digest/user', userId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to mark digest as read.",
        variant: "destructive",
      });
    }
  });

  // Expanded digest details - mark as read automatically
  useEffect(() => {
    if (expandedDigestId && data?.digests) {
      const digest = data.digests.find(d => d.id === expandedDigestId);
      if (digest && !digest.read) {
        markAsReadMutation.mutate(expandedDigestId);
      }
    }
  }, [expandedDigestId, data?.digests]);

  // Handle digest card click - toggle expanded state
  const handleDigestClick = (digestId: number) => {
    setExpandedDigestId(expandedDigestId === digestId ? null : digestId);
  };

  // Get appropriate badge styling based on digest type
  const getDigestBadge = (digestType: string) => {
    switch(digestType) {
      case 'ticket_resolved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Ticket Resolved</Badge>;
      case 'self_resolved':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Self Help</Badge>;
      case 'system_health':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">System Update</Badge>;
      default:
        return <Badge variant="outline">Support</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Failed to load support digests. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  if (!data?.digests || data.digests.length === 0) {
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>No Digests Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You don't have any support digests yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Your Support Digests</h2>
      
      {data.digests.map((digest) => (
        <Card 
          key={digest.id} 
          className={`transition-all cursor-pointer mb-4 ${!digest.read ? 'border-primary shadow-md' : ''}`}
          onClick={() => handleDigestClick(digest.id)}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{digest.title}</CardTitle>
              {getDigestBadge(digest.digestType)}
            </div>
            <CardDescription className="flex justify-between items-center">
              <span>{formatDistanceToNow(new Date(digest.createdAt), { addSuffix: true })}</span>
              {!digest.read && (
                <Badge variant="default" className="ml-2 bg-primary">New</Badge>
              )}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <p className="text-sm text-gray-600">{digest.issueDescription}</p>
            
            {expandedDigestId === digest.id && (
              <div className="mt-4 space-y-3 text-sm animate-fadeIn">
                <div>
                  <h4 className="font-semibold mb-1">Resolution</h4>
                  <p>{digest.resolutionSummary}</p>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
                  <h4 className="font-semibold mb-1 text-blue-700">Helpful Tip</h4>
                  <p className="text-blue-600">{digest.nextTip}</p>
                </div>
                
                <div className="pt-2">
                  <h4 className="font-semibold mb-1">System Status</h4>
                  <Badge variant={digest.systemStatus === 'healthy' ? 'outline' : 'destructive'}>
                    {digest.systemStatus.charAt(0).toUpperCase() + digest.systemStatus.slice(1)}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
          
          {expandedDigestId === digest.id && (
            <CardFooter className="pt-0 flex justify-between">
              <Button variant="ghost" size="sm" className="text-gray-500">
                <BookOpen className="h-4 w-4 mr-1" />
                {digest.read ? 'Read' : 'Mark as read'}
              </Button>
              
              <Button variant="ghost" size="sm" className="text-gray-500">
                {digest.emailSent ? (
                  <>
                    <MailCheck className="h-4 w-4 mr-1" />
                    Email Sent
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-1" />
                    Send to Email
                  </>
                )}
              </Button>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
};

export default DigestList;