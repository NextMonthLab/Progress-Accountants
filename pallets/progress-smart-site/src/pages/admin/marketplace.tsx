import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { MarketplaceToolGrid } from '@/components/marketplace/MarketplaceToolGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Download, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState('browse');
  
  // Fetch credit usage data
  const { data: creditUsage, isLoading: isLoadingCredits } = useQuery({
    queryKey: ['/api/marketplace/credits/usage'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/marketplace/credits/usage');
      return res.json();
    }
  });

  return (
    <AdminLayout 
      title="Tool Marketplace" 
      subtitle="Discover and install tools for your site"
      breadcrumbs={[{ label: 'Marketplace', href: '/admin/marketplace' }]}
    >
      <Tabs defaultValue="browse" className="space-y-6" onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="browse">Browse Tools</TabsTrigger>
            <TabsTrigger value="installed">Installed Tools</TabsTrigger>
            <TabsTrigger value="credits">Credit Usage</TabsTrigger>
          </TabsList>
          
          {activeTab === 'credits' && (
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Usage Data
            </Button>
          )}
        </div>

        <TabsContent value="browse" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Available Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground mt-1">Across 6 categories</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">New Tools This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500">+2 from last month</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Available Credits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isLoadingCredits ? '...' : (500 - (creditUsage?.total || 0))}</div>
                <p className="text-xs text-muted-foreground mt-1">Out of 500 monthly allowance</p>
              </CardContent>
            </Card>
          </div>
          
          <MarketplaceToolGrid />
        </TabsContent>
        
        <TabsContent value="installed">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Installed Tools</h2>
            <p>Manage your installed tools and their settings.</p>
            
            {/* Will be implemented in a future update */}
            <Card className="border-dashed">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                <p className="text-muted-foreground">Your installed tools will appear here.</p>
                <p className="text-sm text-muted-foreground">Browse the marketplace to find and install tools.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="credits">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">Credit Usage Overview</h2>
                <p className="text-muted-foreground">Monitor your tool credit consumption</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{isLoadingCredits ? '...' : creditUsage?.total || 0}</div>
                <p className="text-sm text-muted-foreground">Credits used this month</p>
              </div>
            </div>
            
            <div className="h-[300px] flex items-center justify-center border rounded-md">
              <div className="flex flex-col items-center text-center">
                <BarChart3 className="h-16 w-16 text-muted-foreground/50 mb-2" />
                <h3 className="text-lg font-medium">Usage Chart</h3>
                <p className="text-sm text-muted-foreground">
                  Credit usage visualization coming in the next update
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Recent Usage</h3>
              
              {isLoadingCredits ? (
                <div className="flex items-center justify-center h-24">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-4">
                  {creditUsage?.logs?.map((log: any) => (
                    <Card key={log.id}>
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{log.toolName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(log.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <span className="font-bold">{log.credits}</span>
                          <span className="text-sm text-muted-foreground ml-1">credits</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}