import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LifeBuoy, ArrowRight, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';

export default function AssistantPage() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [message, setMessage] = useState('');
  const [stage, setStage] = useState<'intro' | 'question' | 'success' | 'redirect'>('intro');

  // Initialize a support session when the component mounts
  useEffect(() => {
    const createSession = async () => {
      try {
        const response = await apiRequest('POST', '/api/support/session');
        if (!response.ok) {
          throw new Error('Failed to create support session');
        }
        
        const data = await response.json();
        setSessionId(data.session.sessionId);
      } catch (error) {
        console.error('Error creating support session:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to initialize support',
          description: 'There was a problem setting up your support session. Please try again.',
        });
      } finally {
        setInitializing(false);
      }
    };

    createSession();
  }, [toast]);

  const handleSubmitQuestion = async () => {
    if (!message.trim() || !sessionId) return;
    
    setLoading(true);
    
    try {
      const response = await apiRequest('POST', `/api/support/session/${sessionId}/issue`, {
        issue: message
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit question');
      }
      
      // In a real implementation, this would likely connect to an AI service
      // For now, we'll just move to the success state
      setStage('success');
    } catch (error) {
      console.error('Error submitting question:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to submit question',
        description: 'There was a problem submitting your question. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRedirectToTicket = () => {
    setStage('redirect');
    setTimeout(() => {
      setLocation(`/support/ticket?sessionId=${sessionId}`);
    }, 1500);
  };

  if (initializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="mt-4 text-muted-foreground">Initializing support assistant...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-12">
      <Card className="shadow-lg border-2 border-primary/10">
        <CardHeader className="bg-primary/5">
          <div className="flex items-center space-x-2">
            <LifeBuoy className="h-6 w-6 text-primary" />
            <CardTitle>Instant Help Assistant</CardTitle>
          </div>
          <CardDescription>
            Get help right away with your questions and issues
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          {stage === 'intro' && (
            <div className="space-y-6">
              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="font-medium">Welcome to Instant Support. How can we help you?</p>
              </div>
              
              <div className="grid gap-4">
                <Button 
                  variant="outline" 
                  className="justify-between" 
                  onClick={() => setStage('question')}
                >
                  <span className="flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Ask a question
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  className="justify-between"
                  onClick={handleRedirectToTicket}
                >
                  <span className="flex items-center">
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    Create support ticket
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          {stage === 'question' && (
            <div className="space-y-6">
              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="font-medium">Please describe your question or issue:</p>
              </div>
              
              <div className="space-y-4">
                <Textarea 
                  placeholder="Describe what you need help with..." 
                  className="min-h-[120px]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setStage('intro')}
                  >
                    Back
                  </Button>
                  
                  <Button 
                    onClick={handleSubmitQuestion}
                    disabled={loading || !message.trim()}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>Submit Question</>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {stage === 'success' && (
            <div className="space-y-6">
              <div className="bg-green-100 p-4 rounded-lg flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-800">Question submitted successfully!</p>
                  <p className="text-green-700 text-sm mt-1">
                    Thank you for your question. In a real implementation, this would connect
                    to an AI service to provide an immediate response.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Is there anything else you'd like to ask?
                </p>
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setMessage('');
                      setStage('question');
                    }}
                  >
                    Ask Another Question
                  </Button>
                  
                  <Button onClick={handleRedirectToTicket}>
                    Create Support Ticket
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {stage === 'redirect' && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="mt-4 text-muted-foreground">Redirecting to support ticket system...</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="bg-muted/50 flex justify-between">
          <p className="text-xs text-muted-foreground">
            Session ID: {sessionId || 'Initializing...'}
          </p>
          
          <p className="text-xs text-muted-foreground">
            {user ? `Logged in as: ${user.username}` : 'Not logged in'}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}