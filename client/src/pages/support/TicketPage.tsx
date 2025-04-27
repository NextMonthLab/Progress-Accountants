import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, ArrowLeft, TicketIcon, PlusCircle, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';

export default function TicketPage() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [issueSummary, setIssueSummary] = useState('');
  const [stepsAttempted, setStepsAttempted] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<'form' | 'success' | 'escalated'>('form');

  // Extract sessionId from URL query params if available
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const sid = query.get('sessionId');
    if (sid) {
      setSessionId(sid);
    }
  }, []);

  const handleAddStep = () => {
    setStepsAttempted([...stepsAttempted, '']);
  };

  const handleChangeStep = (index: number, value: string) => {
    const newSteps = [...stepsAttempted];
    newSteps[index] = value;
    setStepsAttempted(newSteps);
  };

  const handleSubmitTicket = async () => {
    if (!issueSummary.trim()) return;
    
    setLoading(true);
    
    try {
      // Filter out empty steps
      const filteredSteps = stepsAttempted.filter(step => step.trim());
      
      // Get browser and environment info for context
      const systemContext = {
        page: window.location.pathname,
        browser: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        timestamp: new Date().toISOString()
      };
      
      const payload = {
        issueSummary,
        stepsAttempted: filteredSteps,
        systemContext,
        sessionId
      };
      
      const response = await apiRequest('POST', '/api/support/ticket', payload);
      
      if (!response.ok) {
        throw new Error('Failed to create support ticket');
      }
      
      // In a real implementation, you might handle different outcomes
      setStage('success');
    } catch (error) {
      console.error('Error creating support ticket:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to create support ticket',
        description: 'There was a problem submitting your support ticket. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEscalate = async () => {
    if (!sessionId) return;
    
    setLoading(true);
    
    try {
      const response = await apiRequest('POST', `/api/support/session/${sessionId}/escalate`);
      
      if (!response.ok) {
        throw new Error('Failed to escalate support request');
      }
      
      setStage('escalated');
    } catch (error) {
      console.error('Error escalating support request:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to escalate',
        description: 'There was a problem escalating your support request. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-12">
      <Card className="shadow-lg border-2 border-primary/10">
        <CardHeader className="bg-primary/5">
          <div className="flex items-center space-x-2">
            <TicketIcon className="h-6 w-6 text-primary" />
            <CardTitle>Self-Resolving Ticket Engine</CardTitle>
          </div>
          <CardDescription>
            Let's solve your issue together through structured troubleshooting
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          {stage === 'form' && (
            <div className="space-y-6">
              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="font-medium">Let's solve your issue together. Please answer a few questions.</p>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="issueSummary">Summarize your issue:</Label>
                  <Textarea 
                    id="issueSummary"
                    placeholder="Briefly describe what's not working..."
                    value={issueSummary}
                    onChange={(e) => setIssueSummary(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Steps you've already tried:</Label>
                  
                  {stepsAttempted.map((step, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        value={step}
                        onChange={(e) => handleChangeStep(index, e.target.value)}
                        placeholder={`Step ${index + 1}...`}
                      />
                      {index === stepsAttempted.length - 1 && (
                        <Button 
                          type="button" 
                          size="icon" 
                          variant="ghost"
                          onClick={handleAddStep}
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="pt-2 flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setLocation('/support/assistant')}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Assistant
                  </Button>
                  
                  <div className="space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={handleEscalate}
                      disabled={loading}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Request Human Help
                    </Button>
                    
                    <Button 
                      onClick={handleSubmitTicket}
                      disabled={loading || !issueSummary.trim()}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>Submit Ticket</>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {stage === 'success' && (
            <div className="space-y-6">
              <div className="bg-green-100 p-4 rounded-lg flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-800">Support ticket created successfully!</p>
                  <p className="text-green-700 text-sm mt-1">
                    Your ticket has been submitted and we'll work on resolving your issue.
                    In a real implementation, this system would attempt to automatically
                    resolve common issues based on your input.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setLocation('/support/assistant')}
                >
                  Return to Support Home
                </Button>
                
                <Button onClick={handleEscalate}>
                  Request Human Help
                </Button>
              </div>
            </div>
          )}
          
          {stage === 'escalated' && (
            <div className="space-y-6">
              <div className="bg-blue-100 p-4 rounded-lg flex items-start">
                <MessageCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-800">Your request has been escalated to human support</p>
                  <p className="text-blue-700 text-sm mt-1">
                    A support team member will review your issue and reach out to you.
                    Thank you for your patience.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-center pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setLocation('/support/assistant')}
                >
                  Return to Support Home
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="bg-muted/50 flex justify-between">
          <p className="text-xs text-muted-foreground">
            Session ID: {sessionId || 'No session attached'}
          </p>
          
          <p className="text-xs text-muted-foreground">
            {user ? `Logged in as: ${user.username}` : 'Not logged in'}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}