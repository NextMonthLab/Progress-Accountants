import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Check, Zap } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Badge } from '@/components/ui/badge';
import AdminLayout from "@/layouts/AdminLayout";

// Interface for subscription plan data
interface PlanData {
  name: string;
  price: string;
  features: string[];
  limit: number;
  isPopular?: boolean;
}

// Interface for BusinessIdentity data
interface BusinessIdentity {
  core: {
    businessName: string;
    tagline?: string;
    description?: string;
  };
}

// Sample subscription plans
const subscriptionPlans: PlanData[] = [
  {
    name: "Starter",
    price: "$49",
    features: [
      "10 Social Media Posts/mo",
      "Basic Analytics",
      "Email Support",
      "1 User Account"
    ],
    limit: 10
  },
  {
    name: "Pro",
    price: "$99",
    features: [
      "50 Social Media Posts/mo",
      "Advanced Analytics",
      "Priority Support",
      "3 User Accounts",
      "Custom Branding"
    ],
    limit: 50,
    isPopular: true
  },
  {
    name: "Elite",
    price: "$199",
    features: [
      "Unlimited Social Media Posts",
      "Premium Analytics",
      "24/7 Dedicated Support",
      "10 User Accounts",
      "Custom Branding",
      "API Access"
    ],
    limit: -1
  }
];

export default function AccountPage() {
  const [currentPlan, setCurrentPlan] = useState("Pro"); // Default to Pro plan
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Placeholder usage data
  const postsGenerated = 23;
  const maxPosts = 50; // Based on Pro plan
  const usagePercentage = (postsGenerated / maxPosts) * 100;
  
  // Get business identity data
  const { data: businessIdentity } = useQuery<BusinessIdentity>({
    queryKey: ['/api/business-identity'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/business-identity');
      return await res.json();
    }
  });
  
  const businessName = businessIdentity?.core?.businessName || 'Your Business';
  
  // Function to handle upgrade button click
  const handleUpgradeClick = () => {
    setIsDialogOpen(true);
  };
  
  return (
    <AdminLayout>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your subscription and account details
          </p>
        </div>
        
        <div className="grid gap-6">
          {/* Welcome and Current Plan Section */}
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {businessName}</CardTitle>
              <CardDescription>
                Here's an overview of your current subscription
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Current Plan</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl font-bold text-primary">{currentPlan}</span>
                    <Badge variant="outline" className="bg-primary/10 hover:bg-primary/10">Active</Badge>
                  </div>
                </div>
                <Button variant="outline" onClick={handleUpgradeClick}>
                  Change Plan
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Posts Generated This Month</span>
                  <span className="font-medium">{postsGenerated}/{maxPosts}</span>
                </div>
                <Progress value={usagePercentage} className="h-2" />
              </div>
            </CardContent>
          </Card>
          
          {/* Subscription Plans Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Need more power?</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {subscriptionPlans.map((plan) => (
                <Card key={plan.name} className={`relative overflow-hidden ${plan.name === currentPlan ? 'border-primary ring-1 ring-primary' : ''}`}>
                  {plan.isPopular && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-md">
                      Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>
                      <span className="text-3xl font-bold">{plan.price}</span>/month
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="h-4 w-4 mr-2 text-primary" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant={plan.name === currentPlan ? "outline" : "default"}
                      className="w-full"
                      disabled={plan.name === currentPlan}
                      onClick={handleUpgradeClick}
                    >
                      {plan.name === currentPlan ? "Current Plan" : "Upgrade"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Account Details Section - Placeholder for future expansion */}
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>
                Manage your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-muted-foreground">admin@progressaccountants.com</p>
                </div>
                <div>
                  <h3 className="font-medium">Account Created</h3>
                  <p className="text-muted-foreground">April 25, 2025</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Edit Profile</Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Upgrade Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Coming Soon</DialogTitle>
              <DialogDescription>
                This feature is coming soon! Please contact support to upgrade your plan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}