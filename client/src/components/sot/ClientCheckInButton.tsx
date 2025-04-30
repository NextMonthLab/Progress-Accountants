import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, RefreshCw, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * ClientCheckInButton Component
 * 
 * Provides a UI button to trigger the NextMonth SOT client check-in process
 */
export function ClientCheckInButton() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const handleClientCheckIn = async () => {
    setLoading(true);
    setStatus('idle');
    
    try {
      const response = await fetch('/client-check-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to check in: ${response.statusText}`);
      }
      
      // Handle success
      setStatus('success');
      toast({
        title: 'Check-in Successful',
        description: 'Successfully registered with NextMonth SOT system',
        variant: 'default',
      });
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
      
    } catch (error) {
      console.error('Error during client check-in:', error);
      setStatus('error');
      toast({
        title: 'Check-in Failed',
        description: error instanceof Error ? error.message : 'Failed to connect to NextMonth SOT',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={status === 'success' ? 'outline' : status === 'error' ? 'destructive' : 'default'}
      onClick={handleClientCheckIn}
      disabled={loading}
      className="flex items-center gap-2"
    >
      {loading ? (
        <RefreshCw className="h-4 w-4 animate-spin" />
      ) : status === 'success' ? (
        <Check className="h-4 w-4" />
      ) : status === 'error' ? (
        <AlertCircle className="h-4 w-4" />
      ) : (
        <RefreshCw className="h-4 w-4" />
      )}
      {loading ? 'Submitting...' : status === 'success' ? 'Registered!' : status === 'error' ? 'Failed' : 'Register with NextMonth'}
    </Button>
  );
}