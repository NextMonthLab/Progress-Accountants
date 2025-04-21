import React, { useState } from 'react';
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
  Wrench,
  FilePlus,
  Workflow, 
  Puzzle,
  ChevronRight,
  Code,
  LayoutGrid,
  Clock,
  FileText,
  BookOpen,
  Users,
  Calendar,
  Image
} from 'lucide-react';
import { PoweredBy } from '@/components/PoweredBy';

export default function ToolsLandingPage() {
  const [, navigate] = useLocation();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  
  // Define the category interface to fix TypeScript errors
  interface ToolCategory {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    action: string;
    path: string;
    color: string;
    iconBg: string;
    shadow: string;
    comingSoon?: boolean;
  }

  // Define tool categories with their details
  const toolCategories: ToolCategory[] = [
    {
      id: 'social-media-generator',
      title: 'Social Media Generator',
      description: 'Create optimized posts for any social media platform with AI assistance.',
      icon: <Image className="h-10 w-10 text-indigo-600" />,
      action: 'Create Posts',
      path: '/tools/social-media-generator',
      color: 'bg-indigo-50',
      iconBg: 'bg-indigo-100',
      shadow: 'shadow-indigo-100'
    },
    {
      id: 'create-form',
      title: 'Create a Form',
      description: 'Build a custom form to collect information from your clients.',
      icon: <FileText className="h-10 w-10 text-blue-600" />,
      action: 'Create Form',
      path: '/tools/create/form',
      color: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      shadow: 'shadow-blue-100'
    },
    {
      id: 'create-calculator',
      title: 'Build a Calculator',
      description: 'Create interactive calculators to help your clients make decisions.',
      icon: <Wrench className="h-10 w-10 text-purple-600" />,
      action: 'Create Calculator',
      path: '/tools/create/calculator',
      color: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      shadow: 'shadow-purple-100'
    },
    {
      id: 'create-dashboard',
      title: 'Design a Dashboard',
      description: 'Visualize important metrics and data for your clients.',
      icon: <LayoutGrid className="h-10 w-10 text-orange-600" />,
      action: 'Create Dashboard',
      path: '/tools/create/dashboard',
      color: 'bg-orange-50',
      iconBg: 'bg-orange-100',
      shadow: 'shadow-orange-100'
    },
    {
      id: 'create-embed',
      title: 'Add External Embed',
      description: 'Integrate external content and tools into your client portal.',
      icon: <Puzzle className="h-10 w-10 text-green-600" />,
      action: 'Create Embed',
      path: '/tools/create/embed',
      color: 'bg-green-50',
      iconBg: 'bg-green-100',
      shadow: 'shadow-green-100'
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
        className={`${category.color} border-0 transition-all duration-300 ${
          hoveredCard === category.id 
            ? `shadow-lg ${category.shadow} -translate-y-1` 
            : 'shadow-sm hover:shadow-md'
        } ${category.comingSoon ? 'opacity-80' : 'cursor-pointer'}`}
        onClick={() => handleCategoryClick(category.path, category.comingSoon)}
        onMouseEnter={() => setHoveredCard(category.id)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <CardHeader>
          <div className={`${category.iconBg} w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
            hoveredCard === category.id ? 'scale-110' : ''
          }`}>
            {category.icon}
          </div>
          <CardTitle className="text-2xl flex items-center">
            {category.title}
            {category.comingSoon && (
              <span className="ml-2 text-xs bg-gray-200 text-gray-700 py-1 px-2 rounded-full">
                Coming Soon
              </span>
            )}
          </CardTitle>
          <CardDescription className="text-gray-700 text-base mt-1">
            {category.description}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button 
            variant={category.comingSoon ? "outline" : "default"} 
            className={`mt-2 ${category.comingSoon ? '' : 'bg-[var(--navy)] hover:bg-[var(--navy)]/90'}`}
            disabled={category.comingSoon}
          >
            {category.action}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    ));
  };
  
  // Render popular tools section
  const renderPopularTools = () => {
    const popularTools = [
      {
        icon: <Code className="h-5 w-5 text-blue-600" />,
        title: "Client Portal",
        description: "Secure document sharing",
        bgColor: "bg-blue-100"
      },
      {
        icon: <LayoutGrid className="h-5 w-5 text-purple-600" />,
        title: "Business Dashboard",
        description: "Real-time data visualization",
        bgColor: "bg-purple-100"
      },
      {
        icon: <Clock className="h-5 w-5 text-orange-600" />,
        title: "Reminder System",
        description: "Automated client notifications",
        bgColor: "bg-orange-100"
      },
      {
        icon: <FileText className="h-5 w-5 text-green-600" />,
        title: "Template Library",
        description: "Pre-built forms and documents",
        bgColor: "bg-green-100"
      },
      {
        icon: <BookOpen className="h-5 w-5 text-red-600" />,
        title: "Knowledge Base",
        description: "Client resources & guides",
        bgColor: "bg-red-100"
      },
      {
        icon: <Users className="h-5 w-5 text-indigo-600" />,
        title: "Team Dashboard",
        description: "Staff collaboration tools",
        bgColor: "bg-indigo-100"
      }
    ];

    return (
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Business Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {popularTools.map((tool, index) => (
            <div 
              key={index} 
              className="p-4 bg-white rounded-lg shadow-sm flex items-center space-x-3 transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className={`${tool.bgColor} p-3 rounded-full`}>
                {tool.icon}
              </div>
              <div>
                <h3 className="font-medium">{tool.title}</h3>
                <p className="text-sm text-gray-500">{tool.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <Button 
            className="bg-[var(--navy)] hover:bg-[var(--navy)]/90 text-white px-6"
            onClick={() => navigate('/marketplace')}
          >
            Explore Marketplace
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  };
  
  // Render upcoming events (placeholder, currently disabled)
  const renderUpcomingEvents = () => {
    // Function kept for future implementation but returns null
    return null;
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Helmet>
        <title>Smart Tools Hub | Progress Accountants</title>
      </Helmet>
      
      <div className="container mx-auto px-4">
        <div className="mb-12 max-w-4xl">
          <h1 className="text-5xl font-bold text-[var(--navy)] mb-4">
            Let's Build Something Together
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            This space is for launching pages, tools, and smart flows that enhance your existing website.
          </p>
          
          <div className="bg-[var(--navy)]/10 border border-[var(--navy)]/20 rounded-lg p-5 flex items-start space-x-4">
            <div className="bg-[var(--navy)]/20 p-3 rounded-full mt-1 flex-shrink-0">
              <Code className="h-6 w-6 text-[var(--navy)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--navy)] text-lg">Ready for your website</h3>
              <p className="text-[var(--navy)]/70">
                All tools created here can be embedded into your existing website using a simple
                integration script or our WordPress plugin. Need help? Just ask.
              </p>
              <Button 
                variant="link" 
                className="text-[var(--navy)] px-0 py-1 h-auto mt-1"
                onClick={() => navigate('/scope-request')}
              >
                Learn about integration options
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {renderToolCategories()}
        </div>
        
        {renderPopularTools()}
        
        {renderUpcomingEvents()}
        
        <div className="mt-16 text-center">
          <PoweredBy />
        </div>
      </div>
    </div>
  );
}