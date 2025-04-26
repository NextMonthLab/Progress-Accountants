// TEMPORARY SIMPLIFIED VERSION FOR DEBUGGING
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/hooks/use-auth';
import { LayoutDashboard } from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Emergency Admin Dashboard</CardTitle>
          <CardDescription>Debug version to restore functionality</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">This is an emergency simplified version of the admin dashboard.</p>
          <p className="font-medium">Username: {user?.username || 'Not logged in'}</p>
          <p className="font-medium">User Role: {user?.userType || 'Unknown'}</p>
          <p className="font-medium">User ID: {user?.id || 'Unknown'}</p>
        </CardContent>
        <CardFooter>
          <Button className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard Action
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}