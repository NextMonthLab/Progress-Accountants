import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { Home, CheckSquare, Layers, ShieldAlert } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import SystemReadinessCheck from '@/components/support/SystemReadinessCheck';

const SystemReadinessPage = () => {
  const { user } = useAuth();
  
  // Fetch tenant ID (default to the system tenant ID if not available)
  const { data: tenantData, isLoading: tenantLoading } = useQuery({
    queryKey: ['/api/tenant/current'],
    queryFn: () => apiRequest('GET', '/api/tenant/00000000-0000-0000-0000-000000000000').then(res => res.json()),
  });
  
  const tenantId = tenantData?.id || '00000000-0000-0000-0000-000000000000';
  
  // Check if user is authorized (super_admin or admin)
  const isAuthorized = user && (user.userType === 'super_admin' || user.userType === 'admin');
  
  if (tenantLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-[500px] w-full rounded-lg" />
      </div>
    );
  }
  
  if (!isAuthorized) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Unauthorized Access</CardTitle>
            <CardDescription>
              You need administrator privileges to access the System Readiness Check.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please contact your system administrator if you believe you should have access to this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/dashboard"><Home className="h-4 w-4" /></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/support-requests">Support</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink>System Readiness</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        
        <h1 className="text-3xl font-bold mt-2 mb-1">Support System Readiness Check</h1>
        <p className="text-muted-foreground">
          Verify that all support system components are ready for deployment
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-9">
          <SystemReadinessCheck />
        </div>
        
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <p>
                  Before deploying the Support System, ensure all components have been verified and tested.
                </p>
                
                <div>
                  <h4 className="font-medium mb-1 flex items-center">
                    <Layers className="h-4 w-4 mr-1" />
                    Core Components
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Instant Help Assistant</li>
                    <li>Self-Resolving Ticket Engine</li>
                    <li>Admin Support Panel</li>
                    <li>Proactive Health Monitoring</li>
                    <li>Personalized Support Digest</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1 flex items-center">
                    <CheckSquare className="h-4 w-4 mr-1" />
                    User Experience
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Smooth user journeys</li>
                    <li>No dead ends in support flow</li>
                    <li>Helpful suggestions provided</li>
                    <li>Proper error handling</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1 flex items-center">
                    <ShieldAlert className="h-4 w-4 mr-1" />
                    System Integrity
                  </h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Clean typography</li>
                    <li>Subtle animations</li>
                    <li>Integrated look and feel</li>
                    <li>Graceful degradation</li>
                  </ul>
                </div>
                
                <div className="pt-2">
                  <p className="text-muted-foreground">
                    Once all checks pass, the system will be certified as ready for deployment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SystemReadinessPage;