import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { 
  PlusCircle, 
  Settings, 
  Wrench, 
  BarChart3, 
  FileText, 
  Mail, 
  Calendar, 
  Globe,
  PanelLeft,
  Image
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation } from 'wouter';

// Tool category type
type ToolCategory = 'all' | 'marketing' | 'finance' | 'productivity' | 'content';

// Tool item interface
interface ToolItem {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: ToolCategory | ToolCategory[];
  comingSoon?: boolean;
  path?: string;
  isPopular?: boolean;
}

export default function ToolsDashboardPage() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('all');
  
  // Tool items data
  const toolItems: ToolItem[] = [
    {
      id: 'social-media-generator',
      name: 'Social Media Generator',
      description: 'Create optimized posts for any social media platform',
      icon: <Image className="h-6 w-6" />,
      category: ['marketing', 'content'],
      path: '/tools/social-media-generator',
      isPopular: true,
    },
    {
      id: 'financial-dashboard',
      name: 'Financial Dashboard',
      description: 'Track financial metrics, invoices, and client payments',
      icon: <BarChart3 className="h-6 w-6" />,
      category: 'finance',
      path: '/client-dashboard', // existing dashboard
      isPopular: true,
    },
    {
      id: 'document-manager',
      name: 'Document Manager',
      description: 'Store, edit and share client documents securely',
      icon: <FileText className="h-6 w-6" />,
      category: 'productivity',
      path: '/document-manager',
    },
    {
      id: 'email-templates',
      name: 'Email Templates',
      description: 'Create and manage branded email templates',
      icon: <Mail className="h-6 w-6" />,
      category: ['marketing', 'content'],
      comingSoon: true,
    },
    {
      id: 'appointment-scheduler',
      name: 'Appointment Scheduler',
      description: 'Allow clients to book appointments online',
      icon: <Calendar className="h-6 w-6" />,
      category: 'productivity',
      path: '/appointment-scheduler',
    },
    {
      id: 'website-builder',
      name: 'Website Builder',
      description: 'Build and manage your website (optional)',
      icon: <Globe className="h-6 w-6" />,
      category: 'marketing',
      path: '/homepage-setup',
      isPopular: true,
    },
    {
      id: 'module-gallery',
      name: 'Module Gallery',
      description: 'Browse and add pre-built business modules',
      icon: <PanelLeft className="h-6 w-6" />,
      category: ['productivity', 'marketing', 'finance', 'content'],
      path: '/module-gallery',
      isPopular: true,
    },
    {
      id: 'business-toolkit',
      name: 'Business Toolkit',
      description: 'Essential tools for running your accounting practice',
      icon: <Wrench className="h-6 w-6" />,
      category: 'productivity',
      comingSoon: true,
    },
    {
      id: 'settings',
      name: 'Account Settings',
      description: 'Manage your account preferences and details',
      icon: <Settings className="h-6 w-6" />,
      category: 'all',
      path: '/settings',
    },
  ];
  
  // Filter tools based on active category
  const filteredTools = activeCategory === 'all' 
    ? toolItems
    : toolItems.filter(tool => 
        Array.isArray(tool.category) 
          ? tool.category.includes(activeCategory)
          : tool.category === activeCategory
      );
  
  // Handle tool card click
  const handleToolClick = (tool: ToolItem) => {
    if (tool.comingSoon) {
      toast({
        title: "Coming Soon",
        description: `${tool.name} will be available in a future update.`,
        variant: "default",
      });
      return;
    }
    
    if (tool.path) {
      navigate(tool.path);
    }
  };
  
  // Calculate popular tools
  const popularTools = toolItems.filter(tool => tool.isPopular);
  
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <Helmet>
        <title>Tools Dashboard | Progress Accountants</title>
      </Helmet>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tools Dashboard</h1>
            <p className="text-gray-500 mt-1">Create, manage, and launch tools for your business</p>
          </div>
          
          <Button className="bg-blue-600 hover:bg-blue-700">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Custom Tool
          </Button>
        </div>
        
        <Tabs defaultValue="popular" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="popular">Popular Tools</TabsTrigger>
            <TabsTrigger value="all-tools">All Tools</TabsTrigger>
            <TabsTrigger value="my-tools">My Tools</TabsTrigger>
          </TabsList>
          
          <TabsContent value="popular" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularTools.map(tool => (
                <Card 
                  key={tool.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${tool.comingSoon ? 'opacity-70' : ''}`} 
                  onClick={() => handleToolClick(tool)}
                >
                  <CardHeader className="pb-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                      {tool.icon}
                    </div>
                    <CardTitle className="text-xl flex items-center">
                      {tool.name}
                      {tool.comingSoon && (
                        <span className="ml-2 text-xs bg-gray-200 text-gray-700 py-1 px-2 rounded-full">Coming Soon</span>
                      )}
                    </CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="all-tools" className="space-y-6">
            <div className="flex overflow-x-auto pb-2 mb-4 gap-2">
              <Button 
                variant={activeCategory === 'all' ? 'default' : 'outline'}
                className="rounded-full"
                onClick={() => setActiveCategory('all')}
              >
                All
              </Button>
              <Button 
                variant={activeCategory === 'marketing' ? 'default' : 'outline'}
                className="rounded-full"
                onClick={() => setActiveCategory('marketing')}
              >
                Marketing
              </Button>
              <Button 
                variant={activeCategory === 'finance' ? 'default' : 'outline'}
                className="rounded-full"
                onClick={() => setActiveCategory('finance')}
              >
                Finance
              </Button>
              <Button 
                variant={activeCategory === 'productivity' ? 'default' : 'outline'}
                className="rounded-full"
                onClick={() => setActiveCategory('productivity')}
              >
                Productivity
              </Button>
              <Button 
                variant={activeCategory === 'content' ? 'default' : 'outline'}
                className="rounded-full"
                onClick={() => setActiveCategory('content')}
              >
                Content
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map(tool => (
                <Card 
                  key={tool.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${tool.comingSoon ? 'opacity-70' : ''}`} 
                  onClick={() => handleToolClick(tool)}
                >
                  <CardHeader className="pb-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                      {tool.icon}
                    </div>
                    <CardTitle className="text-xl flex items-center">
                      {tool.name}
                      {tool.comingSoon && (
                        <span className="ml-2 text-xs bg-gray-200 text-gray-700 py-1 px-2 rounded-full">Coming Soon</span>
                      )}
                    </CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="my-tools" className="space-y-6">
            <div className="bg-white rounded-lg p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Wrench className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2">No Custom Tools Yet</h3>
              <p className="text-gray-500 mb-6">Create your first custom tool to see it here</p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Your First Tool
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Need Help Setting Up Your Tools?</CardTitle>
              <CardDescription>
                Our team is ready to help you set up and customize tools for your specific business needs.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" onClick={() => navigate('/scope-request')}>
                Request Consultation
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}