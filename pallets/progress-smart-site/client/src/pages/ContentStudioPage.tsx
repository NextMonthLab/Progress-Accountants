import { useEffect } from 'react';
import { useLocation } from 'wouter';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BrainCircuit } from 'lucide-react';

export default function ContentStudioPage() {
  const [, setLocation] = useLocation();
  
  // Add a small delay to show loading state before redirecting
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      setLocation('/studio-banbury');
    }, 800);
    
    return () => clearTimeout(redirectTimer);
  }, [setLocation]);
  
  return (
    <AdminLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">AI Content Studio</h1>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BrainCircuit className="h-5 w-5 mr-2" />
              Redirecting to Studio
            </CardTitle>
            <CardDescription>
              You are being redirected to the Progress Podcast & Video Studio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground mb-4">Redirecting to studio page...</p>
              <Button 
                onClick={() => setLocation('/studio-banbury')}
                className="mt-2"
              >
                Go to Studio Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}