import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Layout, 
  Code, 
  PenTool, 
  Layers, 
  Box, 
  ChevronRight,
  LayoutGrid 
} from 'lucide-react';
import { PoweredBy } from '@/components/PoweredBy';

export default function ToolsLandingPage() {
  const [, navigate] = useLocation();
  
  // Define tool categories with their details
  const toolCategories = [
    {
      id: 'build-tool',
      title: 'Build a Tool',
      description: 'Create custom tools that automate processes and streamline your workflow',
      icon: <PenTool className="h-10 w-10 text-blue-600" />,
      action: 'Start Building',
      path: '/tools-dashboard',
      color: 'bg-blue-50',
      iconBg: 'bg-blue-100'
    },
    {
      id: 'add-page',
      title: 'Add a Page',
      description: 'Design and deploy custom pages that integrate with your existing website',
      icon: <Layout className="h-10 w-10 text-purple-600" />,
      action: 'Create Page',
      path: '/module-gallery',
      color: 'bg-purple-50',
      iconBg: 'bg-purple-100'
    },
    {
      id: 'create-flow',
      title: 'Create a Flow',
      description: 'Build automated workflows to connect your tools and streamline processes',
      icon: <Layers className="h-10 w-10 text-orange-600" />,
      action: 'Design Flow',
      path: '/marketplace',
      color: 'bg-orange-50',
      iconBg: 'bg-orange-100',
      comingSoon: true
    },
    {
      id: 'browse-blueprint',
      title: 'Browse Blueprint Features',
      description: 'Explore ready-made modules from the NextMonth Vault',
      icon: <Box className="h-10 w-10 text-green-600" />,
      action: 'Explore Modules',
      path: '/module-library',
      color: 'bg-green-50',
      iconBg: 'bg-green-100'
    }
  ];
  
  // Handle navigation
  const handleCategoryClick = (path: string, comingSoon?: boolean) => {
    if (comingSoon) return;
    navigate(path);
  };
  
  // Render the grid of tool categories
  const renderToolCategories = () => {
    return toolCategories.map(category => (
      <Card 
        key={category.id}
        className={`${category.color} border-0 transition-all hover:shadow-md ${
          category.comingSoon ? 'opacity-70' : 'cursor-pointer'
        }`}
        onClick={() => handleCategoryClick(category.path, category.comingSoon)}
      >
        <CardHeader>
          <div className={`${category.iconBg} w-16 h-16 rounded-full flex items-center justify-center mb-3`}>
            {category.icon}
          </div>
          <CardTitle className="text-xl flex items-center">
            {category.title}
            {category.comingSoon && (
              <span className="ml-2 text-xs bg-gray-200 text-gray-700 py-1 px-2 rounded-full">
                Coming Soon
              </span>
            )}
          </CardTitle>
          <CardDescription className="text-gray-700">
            {category.description}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button 
            variant={category.comingSoon ? "outline" : "default"} 
            className="mt-2"
            disabled={category.comingSoon}
          >
            {category.action}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    ));
  };
  
  // Render suggested tools section
  const renderSuggestedTools = () => {
    return (
      <Card className="p-6 bg-white shadow-sm mt-12">
        <CardHeader className="px-0 pb-2">
          <CardTitle className="text-xl">Suggested for Your Accounting Practice</CardTitle>
          <CardDescription>
            Popular tools used by accounting professionals
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Code className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Client Portal</h3>
                <p className="text-sm text-gray-500">Secure document sharing</p>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-full">
                <LayoutGrid className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium">Financial Dashboard</h3>
                <p className="text-sm text-gray-500">Real-time data visualization</p>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg flex items-center space-x-3">
              <div className="bg-orange-100 p-2 rounded-full">
                <Layers className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-medium">Tax Reminder System</h3>
                <p className="text-sm text-gray-500">Automated client notifications</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-0 pt-2">
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => navigate('/module-gallery')}>
            View All Pre-Built Tools
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Helmet>
        <title>Smart Tools Hub | Progress Accountants</title>
      </Helmet>
      
      <div className="container mx-auto px-4">
        <div className="mb-8 max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your Smart Tools Hub
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            You've chosen to use NextMonth as a toolkit, not a website builder. From here, 
            you can build branded screens, launch features, and connect everything to your existing site.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-full mt-1">
              <Box className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-800">Connect to Your Website</h3>
              <p className="text-sm text-blue-600">
                All tools created here can be embedded directly into your existing website using our simple
                integration script or WordPress plugin.
              </p>
              <Button 
                variant="link" 
                className="text-blue-700 px-0 py-1 h-auto"
                onClick={() => navigate('/scope-request')}
              >
                Ask about integration options
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {renderToolCategories()}
        </div>
        
        {renderSuggestedTools()}
        
        <div className="mt-16 text-center">
          <PoweredBy />
        </div>
      </div>
    </div>
  );
}