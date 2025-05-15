import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const AgoraProfileTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Test the API endpoint directly
        const response = await fetch('/api/agora/pillars');
        
        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const retryFetch = () => {
    setData([]);
    setError(null);
    setIsLoading(true);
    
    // Manual API test with pillars fetch
    fetch('/api/agora/pillars')
      .then(response => {
        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('API response:', data);
        setData(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error in retry fetch:', err);
        setError(err instanceof Error ? err.message : String(err));
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-medium">Testing API Connection...</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Agora Profile Test Page</h1>
      
      {error ? (
        <Card className="mb-6 border-red-500">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{error}</p>
            <Button onClick={retryFetch}>Retry</Button>
          </CardContent>
        </Card>
      ) : null}
      
      <Card>
        <CardHeader>
          <CardTitle>API Response</CardTitle>
        </CardHeader>
        <CardContent>
          {data.length > 0 ? (
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          ) : (
            <p>No data received from API.</p>
          )}
          <Button onClick={retryFetch} className="mt-4">
            Test API Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgoraProfileTest;