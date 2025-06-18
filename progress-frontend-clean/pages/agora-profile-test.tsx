import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AgoraProfileTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pillarsData, setPillarsData] = useState<any[]>([]);
  const [nudgesData, setNudgesData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('pillars');

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const fetchData = async (endpoint: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Test the API endpoint directly with auth bypass for testing
      const response = await fetch(`/api/agora/${endpoint}?bypassAuth=true`);
      
      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }
      
      const result = await response.json();
      if (endpoint === 'pillars') {
        setPillarsData(result);
      } else if (endpoint === 'nudges') {
        setNudgesData(result);
      }
    } catch (err) {
      console.error(`Error fetching ${endpoint} data:`, err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };
  
  const retryFetch = () => {
    if (activeTab === 'pillars') {
      setPillarsData([]);
    } else if (activeTab === 'nudges') {
      setNudgesData([]);
    }
    setError(null);
    setIsLoading(true);
    
    // Manual API test with active tab endpoint and auth bypass
    fetch(`/api/agora/${activeTab}?bypassAuth=true`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log(`${activeTab} API response:`, data);
        if (activeTab === 'pillars') {
          setPillarsData(data);
        } else if (activeTab === 'nudges') {
          setNudgesData(data);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error(`Error in ${activeTab} retry fetch:`, err);
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
      
      <Tabs 
        defaultValue="pillars" 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value)}
        className="mb-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pillars">Pillars</TabsTrigger>
          <TabsTrigger value="nudges">Whisper Nudges</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pillars">
          <Card>
            <CardHeader>
              <CardTitle>Pillars API Response</CardTitle>
            </CardHeader>
            <CardContent>
              {pillarsData.length > 0 ? (
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
                  {JSON.stringify(pillarsData, null, 2)}
                </pre>
              ) : (
                <p>No pillars data received from API.</p>
              )}
              <Button onClick={retryFetch} className="mt-4">
                Test Pillars API Again
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="nudges">
          <Card>
            <CardHeader>
              <CardTitle>Whisper Nudges API Response</CardTitle>
            </CardHeader>
            <CardContent>
              {nudgesData.length > 0 ? (
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
                  {JSON.stringify(nudgesData, null, 2)}
                </pre>
              ) : (
                <p>No nudges data received from API.</p>
              )}
              <Button onClick={retryFetch} className="mt-4">
                Test Nudges API Again
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgoraProfileTest;