import React from 'react';
import { SotJsonSender } from '@/components/admin/SotJsonSender';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Helmet } from 'react-helmet';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { CloudUpload, AlertTriangle, Database, GitBranch, Settings } from 'lucide-react';

/**
 * SOT Manager Page
 * Admin interface for managing Source of Truth integration
 */
export default function SotManagerPage() {
  return (
    <AdminLayout>
      <Helmet>
        <title>SOT Manager | Progress Accountants Admin</title>
      </Helmet>
      
      <div className="p-6 space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Source of Truth Manager</h1>
          <p className="text-muted-foreground">
            Manage client profile synchronization with the NextMonth Source of Truth system
          </p>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          <Card className="col-span-1">
            <CardHeader className="bg-primary-50 dark:bg-primary-900/10 border-b">
              <CardTitle className="flex items-center text-sm font-medium">
                <CloudUpload className="mr-2 h-4 w-4 text-primary" />
                Client Profile
              </CardTitle>
              <CardDescription className="text-xs">
                Sync status
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <p className="text-sm">Active</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Last sync: 3 hours ago
              </p>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader className="bg-primary-50 dark:bg-primary-900/10 border-b">
              <CardTitle className="flex items-center text-sm font-medium">
                <Database className="mr-2 h-4 w-4 text-primary" />
                Data Collection
              </CardTitle>
              <CardDescription className="text-xs">
                Data points
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-xs text-muted-foreground">Pages</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-xs text-muted-foreground">Tools</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader className="bg-primary-50 dark:bg-primary-900/10 border-b">
              <CardTitle className="flex items-center text-sm font-medium">
                <GitBranch className="mr-2 h-4 w-4 text-primary" />
                Tenant Status
              </CardTitle>
              <CardDescription className="text-xs">
                Instance type
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <p className="text-sm">Primary Instance</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Template: Business Professional
              </p>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader className="bg-yellow-50 dark:bg-yellow-900/10 border-b">
              <CardTitle className="flex items-center text-sm font-medium">
                <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
                Requirements
              </CardTitle>
              <CardDescription className="text-xs">
                System checks
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs">Business ID</p>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                    <p className="text-xs">Valid</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs">API Access</p>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                    <p className="text-xs">Enabled</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="client-profile" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="client-profile">Client Profile</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="client-profile">
            <SotJsonSender />
          </TabsContent>
          
          <TabsContent value="config">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5 text-primary" />
                  SOT Configuration
                </CardTitle>
                <CardDescription>
                  Configure SOT synchronization settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Configuration options will be available in a future update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}