import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { Link } from 'wouter';
import { 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle2, 
  CircleCheck,
  Monitor, 
  Smartphone,
  Brush,
  Sparkles,
  PenTool
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const NavigationDemoPage: React.FC = () => {
  const [useNewNavigation, setUseNewNavigation] = useState(true);
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Please Log In</CardTitle>
            <CardDescription>
              You need to be logged in to view this page.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/auth">Log In</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <AdminLayout useNewNavigation={useNewNavigation}>
      <div className="container max-w-6xl mx-auto py-10">
        <Card className="border-primary/10 bg-primary/5 shadow-md mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                  Dynamic Navigation System
                  <span className="ml-2 text-xs font-medium px-2.5 py-0.5 rounded bg-primary/20 text-primary">
                    Preview
                  </span>
                </CardTitle>
                <CardDescription className="mt-2 text-base">
                  Experience our new intuitive, cinematic navigation interface that puts the future of business ownership in your hands.
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="navigation-toggle" className="text-sm font-medium">
                  {useNewNavigation ? 'New Navigation (On)' : 'Classic Navigation'}
                </Label>
                <Switch
                  id="navigation-toggle"
                  checked={useNewNavigation}
                  onCheckedChange={setUseNewNavigation}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 mt-4">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Monitor className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Dynamic Sidebar</h3>
                    <p className="text-sm text-muted-foreground">
                      Intuitive categorization with animated transitions for a fluid experience
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CircleCheck className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Quick Select Menu</h3>
                    <p className="text-sm text-muted-foreground">
                      Pin your favorite tools for one-click access from any page
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Brush className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Cinematic Transitions</h3>
                    <p className="text-sm text-muted-foreground">
                      Smooth animations that enhance the user experience
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 px-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground italic">
              Try pinning your favorite tools by hovering over menu items and clicking the pin icon!
            </p>
            <Button variant="outline" size="sm" className="gap-1" asChild>
              <a href={useNewNavigation ? "/entrepreneur-support" : "/admin/dashboard"} className="no-underline">
                <PenTool className="h-4 w-4" /> Try Different Page
              </a>
            </Button>
          </CardFooter>
        </Card>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Navigation Features</CardTitle>
              <CardDescription>
                Key enhancements in the new navigation system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Intelligent Grouping</h3>
                    <p className="text-sm text-muted-foreground">
                      Tools and pages are organized by function and user journey, not technical structure
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Marketplace Integration</h3>
                    <p className="text-sm text-muted-foreground">
                      Prominent placement of marketplace with clear upgrade paths from basic tools
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Quick Access Wheel</h3>
                    <p className="text-sm text-muted-foreground">
                      Floating action button for pinned tools, accessible from anywhere
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Adaptive Sidebar</h3>
                    <p className="text-sm text-muted-foreground">
                      Collapsible sidebar with tooltips and expanded state memory
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Your Feedback Matters</CardTitle>
              <CardDescription>
                Help us fine-tune the navigation experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                This preview is your chance to experience our vision for a more intuitive, powerful interface. As you 
                explore, consider:
              </p>
              
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>How does pinning your favorite tools change your workflow?</li>
                <li>Is the grouping of items intuitive to your business processes?</li>
                <li>Does the animation speed feel right - too slow, too fast?</li>
                <li>Are tooltips and descriptions helpful when navigating?</li>
              </ul>
              
              <p className="text-sm text-muted-foreground pt-2">
                Note: This is an early preview. Your current navigation preferences and pinned items will be preserved
                during this testing phase.
              </p>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button className="w-full gap-2">
                <ShieldCheck className="h-4 w-4" />
                Send Feedback on Navigation
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default NavigationDemoPage;