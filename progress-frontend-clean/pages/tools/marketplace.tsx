import React from 'react';
import { Helmet } from 'react-helmet';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { MarketplaceToolGrid } from '@/components/marketplace/MarketplaceToolGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const MarketplacePage = () => {
  // Credit usage query
  const { data: creditData, isLoading: creditLoading } = useQuery({
    queryKey: ['/api/marketplace/credits/usage'],
    queryFn: async () => {
      const response = await fetch('/api/marketplace/credits/usage');
      if (!response.ok) {
        throw new Error('Failed to fetch credit usage');
      }
      return response.json();
    },
    // Only fetch this when the credits tab is active
    enabled: false,
  });

  return (
    <>
      <Helmet>
        <title>Tool Marketplace | NextMonth</title>
      </Helmet>
      <AdminLayout
        pageTitle="Tool Marketplace"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Tools', href: '/tools' },
          { label: 'Marketplace', href: '/tools/marketplace' },
        ]}
      >
        <div className="container px-4 mx-auto py-6 space-y-8">
          <Tabs defaultValue="discover" className="w-full">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="discover">Discover Tools</TabsTrigger>
              <TabsTrigger value="credits">Credit Usage</TabsTrigger>
            </TabsList>
            
            <TabsContent value="discover" className="mt-6">
              <div className="mx-auto space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground">
                      Browse and install tools from the NextMonth ecosystem. These tools will help you enhance
                      your site's functionality and provide more value to your clients.
                    </p>
                  </CardContent>
                </Card>
                
                <MarketplaceToolGrid />
              </div>
            </TabsContent>
            
            <TabsContent value="credits" className="mt-6">
              <div className="mx-auto space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    {creditLoading ? (
                      <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">Credit Summary</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="p-4 bg-primary/5">
                              <h4 className="text-sm font-medium text-muted-foreground">Total Credits Used</h4>
                              <p className="text-3xl font-bold">{creditData?.total || 0}</p>
                            </Card>
                            <Card className="p-4 bg-primary/5">
                              <h4 className="text-sm font-medium text-muted-foreground">Monthly Allowance</h4>
                              <p className="text-3xl font-bold">500</p>
                            </Card>
                            <Card className="p-4 bg-primary/5">
                              <h4 className="text-sm font-medium text-muted-foreground">Remaining</h4>
                              <p className="text-3xl font-bold">{500 - (creditData?.total || 0)}</p>
                            </Card>
                          </div>
                        </div>
                        
                        {creditData?.logs && creditData.logs.length > 0 ? (
                          <div>
                            <h3 className="text-xl font-semibold mb-2">Recent Credit Usage</h3>
                            <div className="border rounded-md">
                              <table className="min-w-full divide-y divide-border">
                                <thead className="bg-muted/50">
                                  <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Tool</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Credits</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-border">
                                  {creditData.logs.map((log: any) => (
                                    <tr key={log.id}>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm">{log.toolName}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm">{log.credits}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(log.timestamp).toLocaleDateString()}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs ${log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                          {log.status || 'success'}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center p-6 bg-muted/20 rounded-lg">
                            <p className="text-muted-foreground">No credit usage records found.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </AdminLayout>
    </>
  );
};

export default MarketplacePage;