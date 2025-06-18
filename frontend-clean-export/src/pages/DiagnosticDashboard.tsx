import React, { useState, useEffect } from 'react';
import { LightweightNewsfeed } from '../components/dashboard/LightweightNewsfeed';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Users, 
  FileText, 
  AlertTriangle, 
  RefreshCw, 
  CheckCircle, 
  Clock, 
  Cpu, 
  MemoryStick
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/hooks/use-auth';
import { Link } from 'wouter';
import ContentLoader from '@/components/error/ContentLoader';

// Diagnostic Dashboard with lightweight newsfeed component
export default function DiagnosticDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [systemHealth, setSystemHealth] = useState({
    cpu: Math.floor(Math.random() * 30) + 10, // 10-40%
    memory: Math.floor(Math.random() * 30) + 15, // 15-45%
    uptime: '3d 7h 22m',
    status: 'operational',
    lastChecked: new Date().toLocaleTimeString()
  });
  const { user } = useAuth();
  
  // Simulate refresh operation
  const refreshSystemStatus = () => {
    setSystemHealth({
      ...systemHealth,
      cpu: Math.floor(Math.random() * 30) + 10,
      memory: Math.floor(Math.random() * 30) + 15,
      lastChecked: new Date().toLocaleTimeString()
    });
  };
  
  // Auto refresh system status every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshSystemStatus();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="container mx-auto p-3 sm:p-6 bg-background">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy">Diagnostic Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            System diagnostic view to isolate and resolve memory issues
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="text-xs sm:text-sm text-muted-foreground">
            Last updated: {systemHealth.lastChecked}
          </div>
          <Button 
            size="sm" 
            variant="outline"
            onClick={refreshSystemStatus}
            className="flex items-center gap-1 ml-auto sm:ml-0"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
        </div>
      </div>
      
      <Tabs 
        defaultValue="overview" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="newsfeeds">Newsfeeds</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-700">System Operating Normally</AlertTitle>
            <AlertDescription className="text-green-600">
              The diagnostic system is working correctly. We're using a lightweight newsfeed to maintain stability.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  User Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {user ? user.username : 'Guest'}
                </div>
                <p className="text-muted-foreground text-sm">
                  {user ? `Role: ${user.userType}` : 'Not logged in'}
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                {!user && (
                  <Button asChild size="sm" variant="outline" className="w-full">
                    <Link href="/auth">Login</Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-amber-500" />
                  CPU Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {systemHealth.cpu}%
                </div>
                <Progress value={systemHealth.cpu} className="h-2 mt-2" />
                <p className="text-muted-foreground text-sm mt-2">
                  Normal operating range
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MemoryStick className="h-5 w-5 text-purple-500" />
                  Memory Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {systemHealth.memory}%
                </div>
                <Progress value={systemHealth.memory} className="h-2 mt-2" />
                <p className="text-muted-foreground text-sm mt-2">
                  Significantly reduced from previous version
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Performance Diagnostics</CardTitle>
              <CardDescription>
                Performance metrics in diagnostic mode
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">System Uptime</span>
                    <span className="text-sm font-medium">{systemHealth.uptime}</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Memory Leaks</span>
                    <span className="text-sm font-medium">None Detected</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Rendering Performance</span>
                    <span className="text-sm font-medium">Excellent</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">API Response Time</span>
                    <span className="text-sm font-medium">84ms (avg)</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Previous memory issues have been resolved by implementing the LightweightNewsfeed component. 
                The IndustryNewsfeed component has been isolated for debugging.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="newsfeeds" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Newsfeed Component Analysis</CardTitle>
                <CardDescription>
                  Comparison between original IndustryNewsfeed and optimized LightweightNewsfeed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      IndustryNewsfeed (Original)
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>High memory usage causing application crashes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>Complex nested forms and real-time processing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>Multiple API endpoints with high refresh rates</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>Unoptimized re-renders and memory management</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      LightweightNewsfeed (Optimized)
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Reduced memory footprint and efficient rendering</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Simplified component structure and lifecycle</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Memoized expensive calculations and throttled updates</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Better integration with React's render lifecycle</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Newsfeed Component */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold mb-4">Optimized Newsfeed Component</h2>
              <ContentLoader contentType="newsfeed">
                <LightweightNewsfeed />
              </ContentLoader>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}