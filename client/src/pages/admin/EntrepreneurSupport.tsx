import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Simple Entrepreneur Support Page - in admin folder
 */
const EntrepreneurSupport = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Entrepreneur Support Hub (Admin Folder)</h1>
      
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
    </div>
  );
};

export default EntrepreneurSupport;