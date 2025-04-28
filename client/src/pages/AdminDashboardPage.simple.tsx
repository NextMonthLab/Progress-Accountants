import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard } from "lucide-react";

export default function AdminDashboardPageSimple() {
  return (
    <div className="container px-4 py-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-white border border-gray-200">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LayoutDashboard className="h-5 w-5" />
                  Simple Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We've temporarily simplified the dashboard to address memory issues. 
                  The full dashboard with all features will be available soon.
                </p>
                <Button className="mt-4">Refresh</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="content" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Content Section</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Content management temporarily simplified.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tools" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Tools Section</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Tools management temporarily simplified.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Section</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Analytics temporarily simplified.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}