// EMERGENCY STANDALONE VERSION FOR DEBUGGING
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/hooks/use-auth';
import { LayoutDashboard, AlertTriangle } from 'lucide-react';
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Include admin sidebar directly in the page */}
      <AdminSidebar />
      
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        
        <Card className="border-orange-200">
          <CardHeader className="bg-orange-50">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <div>
                <CardTitle>Emergency Admin Dashboard</CardTitle>
                <CardDescription>Emergency version to bypass layout issues</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <p className="mb-4 text-orange-800 bg-orange-50 p-3 rounded-md border border-orange-200">
              This is an emergency standalone version of the admin dashboard with the sidebar directly included in the page. This bypasses the layout system entirely.
            </p>
            <div className="grid gap-2 p-4 bg-gray-50 rounded-md">
              <p className="font-medium">Username: {user?.username || 'Not logged in'}</p>
              <p className="font-medium">User Role: {user?.userType || 'Unknown'}</p>
              <p className="font-medium">User ID: {user?.id || 'Unknown'}</p>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 flex justify-between">
            <div className="text-sm text-gray-500">
              This page includes its own sidebar to bypass layout issues
            </div>
            <Button className="flex items-center gap-2" variant="outline">
              <LayoutDashboard className="h-4 w-4" />
              Test Functionality
            </Button>
          </CardFooter>
        </Card>
        
        {/* Powered by NextMonth footer */}
        <div className="mt-auto pt-8 pb-4 border-t border-gray-200 dark:border-gray-800">
          <a 
            href="https://nextmonth.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity"
          >
            <span className="text-xs text-muted-foreground">Powered by</span>
            <img 
              src="https://res.cloudinary.com/drl0fxrkq/image/upload/v1744814862/New_Logo_wwntva.png" 
              alt="NextMonth Logo" 
              className="h-10"
            />
          </a>
        </div>
      </div>
    </div>
  );
}