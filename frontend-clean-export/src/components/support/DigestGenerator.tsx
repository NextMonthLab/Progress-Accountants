import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

// Schema for system digest form
const systemDigestSchema = z.object({
  issue: z.string().min(10, 'Issue description must be at least 10 characters'),
  resolution: z.string().min(10, 'Resolution summary must be at least 10 characters'),
  userId: z.number().optional(),
  tenantId: z.string(),
});

type SystemDigestFormValues = z.infer<typeof systemDigestSchema>;

interface DigestGeneratorProps {
  tenantId: string;
  userId?: number;
  ticketId?: number;
  sessionId?: number;
  type: 'ticket' | 'session' | 'system';
  onSuccess?: () => void;
}

const DigestGenerator: React.FC<DigestGeneratorProps> = ({ 
  tenantId, 
  userId, 
  ticketId,
  sessionId, 
  type,
  onSuccess 
}) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  // Set up form for system digest
  const form = useForm<SystemDigestFormValues>({
    resolver: zodResolver(systemDigestSchema),
    defaultValues: {
      issue: '',
      resolution: '',
      userId: userId,
      tenantId: tenantId,
    },
  });

  // Mutation for ticket digest
  const generateTicketDigestMutation = useMutation({
    mutationFn: () => {
      return apiRequest('POST', `/api/support/digest/ticket/${ticketId}`).then(res => res.json());
    },
    onSuccess: (data) => {
      toast({
        title: "Digest Generated",
        description: "Support digest has been generated successfully.",
      });
      if (onSuccess) onSuccess();
      queryClient.invalidateQueries({ queryKey: ['/api/support/digest/user'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate ticket digest.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsGenerating(false);
    }
  });

  // Mutation for session digest
  const generateSessionDigestMutation = useMutation({
    mutationFn: () => {
      return apiRequest('POST', `/api/support/digest/session/${sessionId}`).then(res => res.json());
    },
    onSuccess: (data) => {
      toast({
        title: "Digest Generated",
        description: "Support digest has been generated successfully.",
      });
      if (onSuccess) onSuccess();
      queryClient.invalidateQueries({ queryKey: ['/api/support/digest/user'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate session digest.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsGenerating(false);
    }
  });

  // Mutation for system digest
  const generateSystemDigestMutation = useMutation({
    mutationFn: (values: SystemDigestFormValues) => {
      return apiRequest('POST', `/api/support/digest/system`, values).then(res => res.json());
    },
    onSuccess: (data) => {
      toast({
        title: "Digest Generated",
        description: "System digest has been generated successfully.",
      });
      form.reset();
      if (onSuccess) onSuccess();
      queryClient.invalidateQueries({ queryKey: ['/api/support/digest/user'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate system digest.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsGenerating(false);
    }
  });

  // Handle submit based on type
  const handleSubmit = () => {
    setIsGenerating(true);

    if (type === 'ticket' && ticketId) {
      generateTicketDigestMutation.mutate();
    } else if (type === 'session' && sessionId) {
      generateSessionDigestMutation.mutate();
    } else if (type === 'system') {
      form.handleSubmit((values) => {
        generateSystemDigestMutation.mutate(values);
      })();
    }
  };

  // Render button or form based on digest type
  const renderContent = () => {
    switch(type) {
      case 'ticket':
        return (
          <Button 
            onClick={handleSubmit} 
            disabled={isGenerating || !ticketId}
            className="w-full"
          >
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Generate Ticket Digest
          </Button>
        );
        
      case 'session':
        return (
          <Button 
            onClick={handleSubmit} 
            disabled={isGenerating || !sessionId}
            className="w-full"
          >
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Generate Session Digest
          </Button>
        );
        
      case 'system':
        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="issue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the system issue or maintenance that was performed..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="resolution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resolution Summary</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Explain how the issue was resolved..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" disabled={isGenerating} className="w-full">
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Generate System Digest
              </Button>
            </form>
          </Form>
        );
        
      default:
        return <p>Invalid digest type specified.</p>;
    }
  };

  // Render card with appropriate title based on type
  const getCardTitle = () => {
    switch(type) {
      case 'ticket': return 'Generate Ticket Digest';
      case 'session': return 'Generate Session Digest';
      case 'system': return 'Generate System Health Digest';
      default: return 'Generate Digest';
    }
  };

  const getCardDescription = () => {
    switch(type) {
      case 'ticket': return 'Create a support digest for a resolved ticket';
      case 'session': return 'Create a support digest for a completed session';
      case 'system': return 'Create a system health digest for proactive maintenance';
      default: return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getCardTitle()}</CardTitle>
        <CardDescription>{getCardDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default DigestGenerator;