import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { registerCompanionConsole, getBlueprintStatus, exportBlueprintPackage, notifyGuardian, exportBlueprintV111, autoPublishBlueprintV111 } from '@/lib/blueprint';
import { AlertTriangle, Check, Clock, Package, Router, Send, ShieldCheck, ThumbsUp, Zap } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

// Client ID for Progress Accountants
const CLIENT_ID = 'progress-accountants';

// Define blueprint status interface
interface BlueprintStatus {
  clientId: string;
  blueprintVersion: string;
  exportReady: boolean;
  handoffStatus: string;
  lastExported: string | null;
  moduleCount: number;
}

export default function BlueprintManagerPage() {
  const [blueprintStatus, setBlueprintStatus] = useState<BlueprintStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [exportV111Loading, setExportV111Loading] = useState(false);
  const [publishV111Loading, setPublishV111Loading] = useState(false);
  const { toast } = useToast();

  // Fetch blueprint status on mount
  useEffect(() => {
    const fetchBlueprintStatus = async () => {
      try {
        const status = await getBlueprintStatus();
        setBlueprintStatus(status);
      } catch (error) {
        console.error('Error fetching blueprint status:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load blueprint status',
        });
      }
    };

    fetchBlueprintStatus();
  }, [toast]);

  // Handler for registering CompanionConsole module
  const handleRegisterCompanionConsole = async () => {
    setRegisterLoading(true);
    try {
      const result = await registerCompanionConsole(CLIENT_ID);
      toast({
        title: 'Success',
        description: 'CompanionConsole module registered successfully',
      });
      
      // Update blueprint status
      if (blueprintStatus) {
        setBlueprintStatus({
          ...blueprintStatus,
          blueprintVersion: '1.1.1',
          moduleCount: blueprintStatus.moduleCount + 1
        });
      }
    } catch (error) {
      console.error('Error registering CompanionConsole:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to register CompanionConsole module',
      });
    } finally {
      setRegisterLoading(false);
    }
  };

  // Handler for exporting blueprint package
  const handleExportBlueprint = async () => {
    setExportLoading(true);
    try {
      const result = await exportBlueprintPackage(CLIENT_ID);
      toast({
        title: 'Success',
        description: 'Blueprint package exported successfully',
      });
      
      // Update status to show export ready
      if (blueprintStatus) {
        setBlueprintStatus({
          ...blueprintStatus,
          exportReady: true,
          lastExported: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error exporting blueprint:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to export blueprint package',
      });
    } finally {
      setExportLoading(false);
    }
  };

  // Handler for notifying Guardian
  const handleNotifyGuardian = async () => {
    setNotifyLoading(true);
    try {
      const result = await notifyGuardian(CLIENT_ID);
      toast({
        title: 'Success',
        description: 'Guardian notified successfully',
      });
      
      // Update handoff status
      if (blueprintStatus) {
        setBlueprintStatus({
          ...blueprintStatus,
          handoffStatus: 'completed'
        });
      }
    } catch (error) {
      console.error('Error notifying Guardian:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to notify Guardian',
      });
    } finally {
      setNotifyLoading(false);
    }
  };
  
  // Handler for exporting Blueprint v1.1.1
  const handleExportBlueprintV111 = async () => {
    setExportV111Loading(true);
    try {
      const result = await exportBlueprintV111(CLIENT_ID);
      toast({
        title: 'Success',
        description: 'Blueprint v1.1.1 exported successfully with all announcement modules',
      });
      
      // Update status
      if (blueprintStatus) {
        setBlueprintStatus({
          ...blueprintStatus,
          blueprintVersion: '1.1.1',
          exportReady: true,
          lastExported: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error exporting Blueprint v1.1.1:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to export Blueprint v1.1.1',
      });
    } finally {
      setExportV111Loading(false);
    }
  };
  
  // Handler for auto-publishing Blueprint v1.1.1 to Vault
  const handlePublishBlueprintV111 = async () => {
    setPublishV111Loading(true);
    try {
      const result = await autoPublishBlueprintV111(CLIENT_ID);
      toast({
        title: 'Success',
        description: 'Blueprint v1.1.1 auto-published to Vault as default version',
      });
      
      // Update status
      if (blueprintStatus) {
        setBlueprintStatus({
          ...blueprintStatus,
          blueprintVersion: '1.1.1',
          exportReady: true,
          handoffStatus: 'completed',
          lastExported: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error auto-publishing Blueprint v1.1.1:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to auto-publish Blueprint v1.1.1 to Vault',
      });
    } finally {
      setPublishV111Loading(false);
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleString();
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-2">Blueprint Manager</h1>
        <p className="text-muted-foreground mb-8">
          Manage your client blueprint for deployment across the NextMonth ecosystem.
        </p>

        {/* Blueprint Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Router className="h-5 w-5" />
                Blueprint Status
              </CardTitle>
              <CardDescription>
                Current status of your client blueprint configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              {blueprintStatus ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Client ID:</span>
                    <Badge variant="outline">{blueprintStatus.clientId}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Version:</span>
                    <Badge variant="secondary">v{blueprintStatus.blueprintVersion}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Modules:</span>
                    <Badge variant="outline">{blueprintStatus.moduleCount || 0}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Export Ready:</span>
                    {blueprintStatus.exportReady ? (
                      <Badge variant="secondary" className="bg-green-600">
                        <Check className="h-3 w-3 mr-1" /> Ready
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <Clock className="h-3 w-3 mr-1" /> Pending
                      </Badge>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Handoff Status:</span>
                    {blueprintStatus.handoffStatus === 'completed' ? (
                      <Badge variant="secondary" className="bg-green-600">
                        <ThumbsUp className="h-3 w-3 mr-1" /> Completed
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <Clock className="h-3 w-3 mr-1" /> {blueprintStatus.handoffStatus || 'In Progress'}
                      </Badge>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Last Exported:</span>
                    <span className="text-sm text-muted-foreground">
                      {formatTimestamp(blueprintStatus.lastExported)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Companion Console
              </CardTitle>
              <CardDescription>
                AI-powered support interface with context-aware guidance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm">
                  The Companion Console provides an intelligent support system that offers:
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                  <li>Context-aware assistance based on the current screen</li>
                  <li>Integration with OpenAI for intelligent responses</li>
                  <li>Vault logging for support interactions</li>
                  <li>Feedback escalation to development team</li>
                  <li>Optional toggle in client registry</li>
                </ul>
                <div className="flex flex-col mt-4">
                  <span className="text-sm font-medium mb-1">Status:</span>
                  {blueprintStatus?.blueprintVersion === '1.1.1' ? (
                    <Badge className="self-start bg-green-600" variant="secondary">
                      <Check className="h-3 w-3 mr-1" /> Included in v1.1.1
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="self-start">
                      <AlertTriangle className="h-3 w-3 mr-1" /> Not registered
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleRegisterCompanionConsole} 
                disabled={registerLoading || blueprintStatus?.blueprintVersion === '1.1.1'}
                className="w-full"
              >
                {registerLoading ? 'Registering...' : 'Register Module'}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Separator className="my-8" />

        {/* Export and Handoff Controls */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Export Controls</h2>
          <p className="text-muted-foreground">
            Export your blueprint package to the NextMonth Vault and notify Guardian when ready.
          </p>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <Button
                onClick={handleExportBlueprint}
                disabled={exportLoading || !blueprintStatus?.clientId}
                variant="default"
                className="flex-1"
              >
                <Package className="mr-2 h-4 w-4" />
                {exportLoading ? 'Exporting...' : 'Export Blueprint Package'}
              </Button>

              <Button
                onClick={handleNotifyGuardian}
                disabled={notifyLoading || !blueprintStatus?.exportReady}
                variant="outline"
                className="flex-1"
              >
                <Send className="mr-2 h-4 w-4" />
                {notifyLoading ? 'Notifying...' : 'Notify Guardian'}
              </Button>
            </div>
            
            <div className="border border-dashed border-primary/50 rounded-md p-4 mt-2">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                Blueprint v1.1.1 Export
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Export Blueprint v1.1.1 with Companion Console and all announcement modules, properly tagged for automatic upgrades.
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleExportBlueprintV111}
                  disabled={exportV111Loading || !blueprintStatus?.clientId}
                  variant="secondary"
                  className="w-full"
                >
                  <Zap className="mr-2 h-4 w-4 text-yellow-500" />
                  {exportV111Loading ? 'Exporting v1.1.1...' : 'Export Blueprint v1.1.1'}
                </Button>
                
                <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md p-3 mt-2">
                  <h4 className="text-sm font-semibold flex items-center text-amber-800 dark:text-amber-300">
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Auto-Publish to Vault
                  </h4>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-1 mb-3">
                    Auto-publish Blueprint v1.1.1 to the Vault as the <strong>default version</strong> for all new clients.
                    This will set v1.1.1 as the active version for onboarding.
                  </p>
                  <Button
                    onClick={handlePublishBlueprintV111}
                    disabled={publishV111Loading || !blueprintStatus?.clientId || blueprintStatus?.blueprintVersion !== '1.1.1'}
                    variant="outline"
                    className="w-full bg-amber-100 dark:bg-amber-900 border-amber-300 dark:border-amber-700 hover:bg-amber-200 dark:hover:bg-amber-800 text-amber-900 dark:text-amber-200"
                  >
                    <Router className="mr-2 h-4 w-4" />
                    {publishV111Loading ? 'Publishing to Vault...' : 'Auto-Publish to Vault as Default'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted rounded-md p-4 mt-4">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Exporting the blueprint package will create a snapshot of all
              configured modules and settings. Notifying Guardian will mark the blueprint as ready
              for deployment.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}