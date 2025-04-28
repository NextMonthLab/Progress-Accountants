import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Check, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

/**
 * Component for sending JSON directly to SOT
 */
export function SotJsonSender() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('declaration');
  const [jsonInput, setJsonInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Sample templates for each type
  const templates = {
    declaration: `{
  "instanceId": "progress-accountants-001",
  "instanceType": "client_site",
  "blueprintVersion": "1.1.1",
  "toolsSupported": ["crm", "financial_dashboard", "content_management"],
  "callbackUrl": "https://yoursite.com/api/sot/callback",
  "status": "active",
  "isTemplate": true,
  "isCloneable": true
}`,
    metrics: `{
  "id": 1,
  "totalPages": 12,
  "installedTools": ["crm", "financial_dashboard", "content_management"],
  "lastSyncAt": "${new Date().toISOString()}"
}`,
    logs: `{
  "id": 1,
  "eventType": "manual_update",
  "status": "success",
  "details": "Updated homepage design to include new industry section"
}`
  };

  // Set template based on active tab
  const setTemplate = () => {
    setJsonInput(templates[activeTab as keyof typeof templates] || '');
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setError(null);
    setResponse(null);
  };

  // Format JSON for display
  const formatJson = (json: any) => {
    try {
      return JSON.stringify(json, null, 2);
    } catch (e) {
      return 'Invalid JSON';
    }
  };

  // Send JSON to SOT
  const sendToSot = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Parse JSON to validate
      const jsonData = JSON.parse(jsonInput);
      
      // Determine endpoint based on active tab
      let endpoint = '';
      switch (activeTab) {
        case 'declaration':
          endpoint = '/api/sot/declaration';
          break;
        case 'metrics':
          endpoint = '/api/sot/metrics';
          break;
        case 'logs':
          endpoint = '/api/sot/logs';
          break;
        default:
          throw new Error('Invalid tab selected');
      }

      // Send the request
      const response = await apiRequest('POST', endpoint, jsonData);
      const data = await response.json();
      
      if (response.ok) {
        setResponse(data);
        toast({
          title: 'Success',
          description: `Successfully sent JSON to SOT ${activeTab} endpoint`,
          variant: 'default',
        });
      } else {
        throw new Error(data.error || 'Failed to send data to SOT');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while sending JSON to SOT');
      toast({
        title: 'Error',
        description: err.message || 'Failed to send JSON to SOT',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Trigger a sync with SOT
  const triggerSync = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const response = await apiRequest('POST', '/api/sot/sync', {});
      const data = await response.json();
      
      if (response.ok) {
        setResponse(data);
        toast({
          title: 'Success',
          description: 'Successfully triggered SOT sync',
          variant: 'default',
        });
      } else {
        throw new Error(data.error || 'Failed to trigger SOT sync');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while triggering SOT sync');
      toast({
        title: 'Error',
        description: err.message || 'Failed to trigger SOT sync',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-navy">SOT JSON Sender</CardTitle>
        <CardDescription>Send JSON data directly to SOT endpoints</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="declaration">Declaration</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="logs">Sync Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="declaration" className="space-y-4">
            <p className="text-sm text-gray-600">
              SOT declarations define your instance's capabilities and configuration within the SOT system.
            </p>
          </TabsContent>
          
          <TabsContent value="metrics" className="space-y-4">
            <p className="text-sm text-gray-600">
              SOT metrics track your instance's usage and installed components.
            </p>
          </TabsContent>
          
          <TabsContent value="logs" className="space-y-4">
            <p className="text-sm text-gray-600">
              Sync logs record interactions between your instance and the SOT system.
            </p>
          </TabsContent>
        </Tabs>

        <div className="mb-4 mt-4">
          <Button 
            variant="outline" 
            className="mb-2 text-sm" 
            onClick={setTemplate}
          >
            Load Template
          </Button>
        </div>

        <Textarea
          placeholder={`Enter your JSON for ${activeTab}...`}
          className="h-64 mb-4 font-mono text-sm"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
        />

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {response && (
          <div className="p-4 bg-gray-50 border rounded-md mb-4 overflow-auto max-h-64">
            <h4 className="font-medium mb-2 flex items-center">
              <Check className="h-4 w-4 text-green-500 mr-2" />
              Response
            </h4>
            <pre className="text-xs text-gray-700 whitespace-pre-wrap">{formatJson(response)}</pre>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Button 
          variant="default" 
          className="w-full bg-navy hover:bg-navy/90"
          onClick={sendToSot}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Send to SOT'
          )}
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={triggerSync}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Syncing...
            </>
          ) : (
            'Trigger Sync'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default SotJsonSender;