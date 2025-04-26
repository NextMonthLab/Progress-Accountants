import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, LayoutDashboard } from "lucide-react";
import { useAuth } from '@/hooks/use-auth';
import AdminSidebar from "@/components/AdminSidebar";

/**
 * EMERGENCY STANDALONE VERSION - Entrepreneur Support Page
 */

const EntrepreneurSupport = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Include admin sidebar directly in the page */}
      <AdminSidebar />
      
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Entrepreneur Support (Admin)</h1>
        
        <Card className="border-orange-200 mb-6">
          <CardHeader className="bg-orange-50">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <div>
                <CardTitle>Emergency Standalone Page</CardTitle>
                <CardDescription>Emergency version to bypass layout issues</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <p className="mb-4 text-orange-800 bg-orange-50 p-3 rounded-md border border-orange-200">
              This is an emergency standalone version that bypasses the layout system entirely by including the sidebar directly in the page.
            </p>
            <div className="grid gap-2 p-4 bg-gray-50 rounded-md">
              <p className="font-medium">Username: {user?.username || 'Not logged in'}</p>
              <p className="font-medium">User Role: {user?.userType || 'Unknown'}</p>
              <p className="font-medium">Page Route: /admin/entrepreneur-support</p>
            </div>
          </CardContent>
        </Card>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Business News</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="border-b pb-2">
                  <h3 className="font-semibold">Small Business Tax Changes for 2025</h3>
                  <p className="text-sm text-muted-foreground">
                    New tax regulations that affect solo entrepreneurs and small business owners.
                  </p>
                </li>
                <li className="border-b pb-2">
                  <h3 className="font-semibold">5 Productivity Tips for Entrepreneurs</h3>
                  <p className="text-sm text-muted-foreground">
                    How to maximize your productivity when working alone.
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Business Journal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Track your business journey, record ideas, and reflect on challenges.
              </p>
              <div className="bg-muted p-4 rounded-md">
                <p className="italic">
                  "Use this space to document your entrepreneurial journey - your thoughts, 
                  ideas, challenges, and opportunities."
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Personalized Business Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  Set aside specific time for administrative tasks each week to improve efficiency.
                </p>
                <p>
                  Consider creating a monthly newsletter to stay connected with your clients.
                </p>
                <p>
                  Research shows that solo entrepreneurs who document their journey are 
                  more likely to achieve their business goals.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
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
};

export default EntrepreneurSupport;