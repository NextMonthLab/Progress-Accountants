import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  CheckCircle2, 
  Loader2, 
  ArrowLeft, 
  TicketIcon, 
  LightbulbIcon,
  MessageCircle, 
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

// Define the interfaces for our form and suggestion data structures
interface TicketFormData {
  whatTrying: string;
  systemPart: string;
  errorMessage: {
    hasError: boolean;
    message: string;
  };
  device: 'Desktop' | 'Tablet' | 'Mobile';
  triedRefresh: boolean;
}

interface AutoSuggestion {
  title: string;
  description: string;
  steps: string[];
}

export default function TicketPage() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // State for form values and UI control
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TicketFormData>({
    whatTrying: '',
    systemPart: '',
    errorMessage: { hasError: false, message: '' },
    device: 'Desktop',
    triedRefresh: false
  });
  
  // UI stages
  const [stage, setStage] = useState<'form' | 'suggestions' | 'success' | 'escalated'>('form');
  
  // Auto-suggestions based on form data
  const [suggestions, setSuggestions] = useState<AutoSuggestion[]>([]);
  
  // System parts dynamically loaded (in a real app, this would come from an API)
  const [systemParts, setSystemParts] = useState<string[]>([
    'Media Upload',
    'Page Builder',
    'Content Editor',
    'User Management',
    'Settings',
    'Calendar/Booking',
    'Forms',
    'Reports',
    'Dashboard',
    'Other'
  ]);

  // Extract sessionId from URL query params if available
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const sid = query.get('sessionId');
    if (sid) {
      setSessionId(sid);
    } else {
      // Create a new session if none exists
      createSupportSession();
    }
  }, []);

  // Create a support session if needed
  const createSupportSession = async () => {
    try {
      const response = await apiRequest('POST', '/api/support/session');
      const data = await response.json();
      
      if (data.success && data.session) {
        setSessionId(data.session.sessionId);
      }
    } catch (error) {
      console.error('Error creating support session:', error);
    }
  };

  // Handle form field changes
  const updateFormField = (field: keyof TicketFormData, value: any) => {
    setFormData(prev => {
      if (field === 'errorMessage') {
        // Special handling for the nested errorMessage object
        if (typeof value === 'boolean') {
          return {
            ...prev,
            errorMessage: {
              ...prev.errorMessage,
              hasError: value
            }
          };
        } else {
          return {
            ...prev,
            errorMessage: {
              ...prev.errorMessage,
              message: value
            }
          };
        }
      }
      
      // Handle other fields normally
      return {
        ...prev,
        [field]: value
      };
    });
  };

  // Generate suggestions based on form data
  const generateSuggestions = () => {
    const newSuggestions: AutoSuggestion[] = [];
    
    // Media upload issues
    if (formData.systemPart === 'Media Upload') {
      newSuggestions.push({
        title: "File Size or Format Issue",
        description: "Upload problems are often related to file size limitations or unsupported formats.",
        steps: [
          "Ensure your file is under 10MB for images, 50MB for videos",
          "Check that you're using a supported format (JPG, PNG, MP4, etc.)",
          formData.device !== 'Desktop' ? "Try uploading from a desktop computer if possible" : "Try converting your file to a different format"
        ]
      });
    }
    
    // Calendar/Booking issues
    if (formData.systemPart === 'Calendar/Booking') {
      newSuggestions.push({
        title: "Browser Compatibility Issue",
        description: "Calendar features sometimes have issues with certain browsers or extensions.",
        steps: [
          "Clear your browser cache and cookies",
          "Try using a different browser (Chrome, Firefox, Safari)",
          "Disable browser extensions, especially ad blockers",
          "Ensure your browser is up to date"
        ]
      });
    }
    
    // Content Editor issues
    if (formData.systemPart === 'Content Editor' || formData.systemPart === 'Page Builder') {
      newSuggestions.push({
        title: "Content Save Issue",
        description: "Problems with saving content can often be resolved with these steps.",
        steps: [
          "Try saving as a draft first before publishing",
          "Make sure you're not using special characters in titles",
          "Check your internet connection stability",
          "If using rich text, try simplifying formatting"
        ]
      });
    }
    
    // User login issues
    if (formData.whatTrying.toLowerCase().includes('login') || 
        formData.whatTrying.toLowerCase().includes('sign in')) {
      newSuggestions.push({
        title: "Authentication Problem",
        description: "Login issues can often be resolved without admin help.",
        steps: [
          "Clear your browser cookies",
          "Try the 'Forgot Password' link to reset your credentials",
          "Ensure Caps Lock is not enabled",
          "Check that you're using the correct email address"
        ]
      });
    }
    
    // If no specific suggestions, add a generic one
    if (newSuggestions.length === 0) {
      newSuggestions.push({
        title: "General Troubleshooting",
        description: "Try these general fixes that resolve many common issues.",
        steps: [
          "Clear your browser cache and cookies",
          "Try using a different browser",
          "Ensure your operating system and browser are up to date",
          "Check your internet connection",
          "Try accessing the site in incognito/private mode"
        ]
      });
    }
    
    return newSuggestions;
  };

  // Submit the form and generate suggestions
  const handleSubmitForm = async () => {
    // Validate required fields
    if (!formData.whatTrying.trim() || !formData.systemPart) {
      toast({
        variant: 'destructive',
        title: 'Missing information',
        description: 'Please fill out all required fields.',
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Generate auto-suggestions based on form data
      const newSuggestions = generateSuggestions();
      setSuggestions(newSuggestions);
      
      // Move to the suggestions stage
      setStage('suggestions');
    } catch (error) {
      console.error('Error processing form:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Create a support ticket and move to success stage
  const handleCreateTicket = async () => {
    if (!sessionId) return;
    
    setLoading(true);
    
    try {
      // Get browser and environment info for context
      const systemContext = {
        page: window.location.pathname,
        browser: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        device: formData.device,
        timestamp: new Date().toISOString()
      };
      
      const payload = {
        issueSummary: formData.whatTrying,
        systemPart: formData.systemPart,
        errorMessage: formData.errorMessage.hasError ? formData.errorMessage.message : null,
        triedRefresh: formData.triedRefresh,
        device: formData.device,
        systemContext,
        sessionId
      };
      
      const response = await apiRequest('POST', '/api/support/ticket', payload);
      
      if (!response.ok) {
        throw new Error('Failed to create support ticket');
      }
      
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

  // Escalate the issue to human support
  const handleEscalate = async () => {
    if (!sessionId) return;
    
    setLoading(true);
    
    try {
      const response = await apiRequest('POST', `/api/support/session/${sessionId}/escalate`, {
        issueDetails: formData
      });
      
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

  // Mark issue as resolved
  const handleIssueResolved = async () => {
    if (!sessionId) return;
    
    setLoading(true);
    
    try {
      const response = await apiRequest('POST', `/api/support/session/${sessionId}/resolve`, {
        resolution: "Self-resolved through suggested steps"
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark issue as resolved');
      }
      
      // Show success message and redirect to dashboard
      toast({
        title: "Issue resolved",
        description: "Great! We're glad we could help resolve your issue.",
      });
      
      setTimeout(() => {
        setLocation('/admin/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error marking issue as resolved:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was a problem marking your issue as resolved.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-12">
      <Card className="shadow-lg border-2 border-primary/10">
        <CardHeader className="bg-primary/5 pb-4">
          <div className="flex items-center space-x-2">
            <TicketIcon className="h-6 w-6 text-primary" />
            <CardTitle>Need Help? Let's Solve It Together.</CardTitle>
          </div>
          <CardDescription>
            We'll try to automatically resolve your issue through this self-resolving ticket system
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          {/* Initial Form */}
          {stage === 'form' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="whatTrying">What were you trying to do?</Label>
                    <span className="text-destructive ml-1">*</span>
                  </div>
                  <Textarea 
                    id="whatTrying"
                    placeholder="Describe what you were attempting when you encountered the issue..."
                    value={formData.whatTrying}
                    onChange={(e) => updateFormField('whatTrying', e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="systemPart">Which part of the system were you using?</Label>
                    <span className="text-destructive ml-1">*</span>
                  </div>
                  <Select 
                    value={formData.systemPart} 
                    onValueChange={(value) => updateFormField('systemPart', value)}
                  >
                    <SelectTrigger id="systemPart">
                      <SelectValue placeholder="Select system area" />
                    </SelectTrigger>
                    <SelectContent>
                      {systemParts.map((part) => (
                        <SelectItem key={part} value={part}>{part}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="errorMessage">Did you see an error message?</Label>
                  <RadioGroup
                    value={formData.errorMessage.hasError ? "yes" : "no"}
                    onValueChange={(value) => updateFormField('errorMessage', value === "yes")}
                    className="flex flex-row space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="error-yes" />
                      <Label htmlFor="error-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="error-no" />
                      <Label htmlFor="error-no">No</Label>
                    </div>
                  </RadioGroup>
                  
                  {formData.errorMessage.hasError && (
                    <Textarea
                      placeholder="Please enter the error message you saw..."
                      value={formData.errorMessage.message}
                      onChange={(e) => updateFormField('errorMessage', e.target.value)}
                      className="mt-2"
                    />
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="device">Which device are you on?</Label>
                  <Select 
                    value={formData.device} 
                    onValueChange={(value) => updateFormField('device', value as 'Desktop' | 'Tablet' | 'Mobile')}
                  >
                    <SelectTrigger id="device">
                      <SelectValue placeholder="Select your device" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Desktop">Desktop</SelectItem>
                      <SelectItem value="Tablet">Tablet</SelectItem>
                      <SelectItem value="Mobile">Mobile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="triedRefresh">Have you tried refreshing or reloading the page?</Label>
                  <RadioGroup
                    value={formData.triedRefresh ? "yes" : "no"}
                    onValueChange={(value) => updateFormField('triedRefresh', value === "yes")}
                    className="flex flex-row space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="refresh-yes" />
                      <Label htmlFor="refresh-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="refresh-no" />
                      <Label htmlFor="refresh-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setLocation('/')}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
                
                <Button 
                  onClick={handleSubmitForm}
                  disabled={loading || !formData.whatTrying.trim() || !formData.systemPart}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Submit</>
                  )}
                </Button>
              </div>
            </div>
          )}
          
          {/* Auto-suggestion view */}
          {stage === 'suggestions' && (
            <div className="space-y-6">
              <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                <LightbulbIcon className="h-5 w-5 text-amber-600" />
                <AlertTitle>We have some suggestions that might help</AlertTitle>
                <AlertDescription className="text-amber-700">
                  Based on your description, we've identified some potential solutions to try before escalating.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <Card key={index} className="border-primary/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{suggestion.title}</CardTitle>
                      <CardDescription>{suggestion.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {suggestion.steps.map((step, stepIdx) => (
                          <li key={stepIdx} className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-1 mr-2 flex-shrink-0" />
                            <span className="text-sm">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <p className="text-sm text-center text-muted-foreground">
                Did these suggestions help resolve your issue?
              </p>
              
              <div className="flex justify-center space-x-4 pt-2">
                <Button 
                  variant="outline" 
                  className="border-green-600 text-green-700 hover:bg-green-50"
                  onClick={handleIssueResolved}
                  disabled={loading}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Yes, Problem Solved
                </Button>
                
                <Button 
                  variant="outline"
                  className="border-primary text-primary"
                  onClick={handleCreateTicket}
                  disabled={loading}
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Still Need Help
                </Button>
              </div>
            </div>
          )}
          
          {/* Success view */}
          {stage === 'success' && (
            <div className="space-y-6">
              <div className="bg-green-50 p-6 rounded-lg flex items-start">
                <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-lg text-green-800">Thank You — We're On It!</h3>
                  <p className="text-green-700 mt-2">
                    Your issue has been logged and will be reviewed by our support team.
                    We'll respond as soon as possible.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-center pt-4">
                <Button 
                  onClick={() => setLocation('/')}
                >
                  Return to Dashboard
                </Button>
              </div>
            </div>
          )}
          
          {/* Escalated view */}
          {stage === 'escalated' && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg flex items-start">
                <MessageCircle className="h-6 w-6 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-lg text-blue-800">Your request has been escalated</h3>
                  <p className="text-blue-700 mt-2">
                    A support team member will review your issue and reach out to you.
                    Thank you for your patience.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-center pt-4">
                <Button 
                  onClick={() => setLocation('/')}
                >
                  Return to Dashboard
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="bg-muted/50 flex justify-between text-xs text-muted-foreground">
          <div>
            Session ID: {sessionId || 'Initializing...'}
          </div>
          
          <div>
            {user ? `Logged in as: ${user.username}` : 'Not logged in'}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}