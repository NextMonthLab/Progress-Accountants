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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudUpload, Database, DownloadCloud, Server } from 'lucide-react';

/**
 * SOT Manager Page
 * Admin interface for managing Source of Truth integration
 */
export default function SotManagerPage() {
  return (
    <AdminLayout>
      <Helmet>
        <title>SOT Manager - Progress Accountants</title>
      </Helmet>
      
      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Source of Truth Manager</h1>
            <p className="text-muted-foreground mt-1">
              Manage client profile data and synchronization with the NextMonth SOT system
            </p>
          </div>
          <div className="flex space-x-2">
            <CloudUpload className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Database className="h-5 w-5 mr-2 text-primary" />
                Declaration
              </CardTitle>
              <CardDescription>
                Instance declaration metadata
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Define and update the metadata for this Progress Accountants instance in the SOT system.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Server className="h-5 w-5 mr-2 text-primary" />
                Client Profile
              </CardTitle>
              <CardDescription>
                Business identity & metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Maintain a complete profile of this client instance including business details and feature usage.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <DownloadCloud className="h-5 w-5 mr-2 text-primary" />
                Sync Logs
              </CardTitle>
              <CardDescription>
                SOT system interaction logs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                View history of synchronization events between this instance and the NextMonth SOT system.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <SotJsonSender />
      </div>
    </AdminLayout>
  );
}