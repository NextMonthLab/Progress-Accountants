import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle2, 
  BookOpen, 
  FileText, 
  Users, 
  Mail, 
  MessageSquare, 
  Newspaper, 
  Layout, 
  PenSquare, 
  Briefcase,
  Lock,
  Eye
} from 'lucide-react';

// Define module status types
type ModuleStatus = 'active' | 'pending' | 'inactive' | 'locked';

// Define module categories
type ModuleCategory = 'page_templates' | 'campaign_tools' | 'content_tools' | 'utility_modules';

// Define icon types for modules
type IconType = 
  | 'book' 
  | 'file' 
  | 'users' 
  | 'mail' 
  | 'message' 
  | 'news' 
  | 'layout' 
  | 'pen' 
  | 'briefcase';

// Define module interface
interface Module {
  id: string;
  name: string;
  description: string;
  category: ModuleCategory;
  status: ModuleStatus;
  iconType: IconType;
  iconColor: string;
  path?: string; // Path for navigation if the module is already activated
  previewAvailable?: boolean;
  premium?: boolean;
  credits?: number;
}

export default function MarketplacePage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [modules, setModules] = useState<Record<string, Module>>({});
  
  // Load modules from local storage on component mount
  useEffect(() => {
    const savedModules = localStorage.getItem('project_context.modules');
    
    if (savedModules) {
      try {
        const parsedModules = JSON.parse(savedModules);
        setModules(prev => ({...prev, ...parsedModules}));
      } catch (error) {
        console.error('Error parsing stored modules:', error);
        toast({
          title: "Error Loading Marketplace",
          description: "There was a problem loading your modules data.",
          variant: "destructive",
        });
      }
    } else {
      // Initialize with default modules if none exist
      initializeDefaultModules();
    }
  }, [toast]);
  
  // Initialize default modules
  const initializeDefaultModules = () => {
    const defaultModules: Record<string, Module> = {
      case_study_template: {
        id: 'case_study_template',
        name: 'Case Study Template',
        description: 'Tell the story of your client success—auto-formatted and conversion-ready.',
        category: 'page_templates',
        status: 'inactive',
        iconType: 'file',
        iconColor: 'text-blue-500',
        previewAvailable: true
      },
      team_page_template: {
        id: 'team_page_template',
        name: 'Team Page Template',
        description: 'Showcase your team in a clean, on-brand layout.',
        category: 'page_templates',
        status: 'inactive',
        iconType: 'users',
        iconColor: 'text-blue-500'
      },
      pricing_page_template: {
        id: 'pricing_page_template',
        name: 'Pricing Page Template',
        description: 'Display your offers clearly and confidently.',
        category: 'page_templates',
        status: 'inactive',
        iconType: 'layout',
        iconColor: 'text-blue-500'
      },
      lead_tracker: {
        id: 'lead_tracker',
        name: 'Lead Tracker',
        description: 'Track anonymous visitors and convert traffic into opportunities.',
        category: 'campaign_tools',
        status: 'active',
        iconType: 'briefcase',
        iconColor: 'text-green-500',
        path: '/lead-tracker'
      },
      script_builder: {
        id: 'script_builder',
        name: 'Script Builder',
        description: 'Generate pitch scripts for outreach or landing pages.',
        category: 'campaign_tools',
        status: 'inactive',
        iconType: 'message',
        iconColor: 'text-green-500'
      },
      email_campaign_composer: {
        id: 'email_campaign_composer',
        name: 'Email Campaign Composer',
        description: 'Create email sequences using your brand tone and business goals.',
        category: 'campaign_tools',
        status: 'locked',
        iconType: 'mail',
        iconColor: 'text-green-500',
        premium: true,
        credits: 5
      },
      blog_generator: {
        id: 'blog_generator',
        name: 'Blog Generator',
        description: 'Generate SEO-friendly articles based on your expertise and target audience.',
        category: 'content_tools',
        status: 'inactive',
        iconType: 'news',
        iconColor: 'text-purple-500'
      },
      social_post_pack: {
        id: 'social_post_pack',
        name: 'Social Post Pack',
        description: 'Auto-generate branded post series for campaigns, launches, or testimonials.',
        category: 'content_tools',
        status: 'pending',
        iconType: 'pen',
        iconColor: 'text-purple-500'
      },
      brand_guidelines_editor: {
        id: 'brand_guidelines_editor',
        name: 'Brand Guidelines Editor',
        description: 'Update your core visuals and messaging.',
        category: 'utility_modules',
        status: 'active',
        iconType: 'book',
        iconColor: 'text-orange-500',
        path: '/brand-guidelines'
      },
      business_identity_editor: {
        id: 'business_identity_editor',
        name: 'Business Identity Editor',
        description: 'Refine your tone, values, and market focus.',
        category: 'utility_modules',
        status: 'active',
        iconType: 'briefcase',
        iconColor: 'text-orange-500',
        path: '/business-identity'
      }
    };
    
    setModules(defaultModules);
    localStorage.setItem('project_context.modules', JSON.stringify(defaultModules));
  };
  
  // Helper function to render the appropriate icon
  const renderIcon = (iconType: IconType, colorClass: string) => {
    const className = `h-8 w-8 ${colorClass}`;
    
    switch (iconType) {
      case 'book':
        return <BookOpen className={className} />;
      case 'file':
        return <FileText className={className} />;
      case 'users':
        return <Users className={className} />;
      case 'mail':
        return <Mail className={className} />;
      case 'message':
        return <MessageSquare className={className} />;
      case 'news':
        return <Newspaper className={className} />;
      case 'layout':
        return <Layout className={className} />;
      case 'pen':
        return <PenSquare className={className} />;
      case 'briefcase':
        return <Briefcase className={className} />;
      default:
        return <FileText className={className} />;
    }
  };
  
  // Save modules to local storage whenever they change
  useEffect(() => {
    if (Object.keys(modules).length > 0) {
      localStorage.setItem('project_context.modules', JSON.stringify(modules));
    }
  }, [modules]);
  
  // Handle module activation
  const handleActivateModule = (moduleId: string) => {
    setModules(prev => {
      const updatedModules = {...prev};
      
      if (updatedModules[moduleId]) {
        // Check if the module is locked (premium)
        if (updatedModules[moduleId].status === 'locked') {
          toast({
            title: "Premium Feature",
            description: "This feature requires credits to unlock. Coming soon!",
            variant: "default",
          });
          return prev;
        }
        
        // Update the status to active
        updatedModules[moduleId] = {
          ...updatedModules[moduleId],
          status: 'active'
        };
        
        toast({
          title: "Module Activated",
          description: `${updatedModules[moduleId].name} has been activated successfully.`,
          variant: "default",
        });
      }
      
      return updatedModules;
    });
  };
  
  // Handle module preview
  const handlePreviewModule = (moduleId: string) => {
    toast({
      title: "Preview Mode",
      description: `Previewing ${modules[moduleId].name}...`,
      variant: "default",
    });
    
    // In a real implementation, this would open a modal or navigate to a preview page
  };
  
  // Handle opening an active module
  const handleOpenModule = (moduleId: string) => {
    const module = modules[moduleId];
    
    if (module && module.path) {
      setLocation(module.path);
    } else {
      toast({
        title: "Navigation Error",
        description: "This module doesn't have a valid path.",
        variant: "destructive",
      });
    }
  };
  
  // Filter modules by category
  const getFilteredModules = (): Module[] => {
    return Object.values(modules).filter(module => {
      if (activeTab === 'all') return true;
      return module.category === activeTab;
    });
  };
  
  // Get status badge for a module
  const getStatusBadge = (status: ModuleStatus) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Activated</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">Not Active</Badge>;
      case 'locked':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Premium</Badge>;
      default:
        return null;
    }
  };
  
  // Get user-friendly category name
  const getCategoryName = (category: ModuleCategory): string => {
    switch (category) {
      case 'page_templates':
        return 'Page Templates';
      case 'campaign_tools':
        return 'Campaign Tools';
      case 'content_tools':
        return 'Content Tools';
      case 'utility_modules':
        return 'Utility Modules';
      default:
        return 'Other';
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Helmet>
        <title>Marketplace | NextMonth Business OS</title>
      </Helmet>
      
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3 text-[var(--navy)]">Explore the NextMonth Marketplace</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Add new screens, tools, and automations to expand your Business OS. No code. No friction.
          </p>
        </div>
        
        {/* Category Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-5 w-full max-w-4xl mx-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="page_templates">Page Templates</TabsTrigger>
            <TabsTrigger value="campaign_tools">Campaign Tools</TabsTrigger>
            <TabsTrigger value="content_tools">Content Tools</TabsTrigger>
            <TabsTrigger value="utility_modules">Utilities</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {getFilteredModules().map((module) => (
            <Card key={module.id} className={`overflow-hidden transition-all hover:shadow-md ${
              module.status === 'active' ? 'border-green-300 bg-green-50/30' : 
              module.status === 'locked' ? 'border-purple-300 bg-purple-50/20' : 
              'border-gray-200'
            }`}>
              <CardHeader className="pb-3 flex flex-row justify-between items-start gap-4">
                <div className="flex gap-3">
                  <div className="bg-white p-2 rounded-md shadow-sm">
                    {renderIcon(module.iconType, module.iconColor)}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{module.name}</CardTitle>
                    <div className="mt-1">
                      {getStatusBadge(module.status)}
                    </div>
                  </div>
                </div>
                {module.status === 'active' && (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                )}
                {module.status === 'locked' && (
                  <Lock className="h-5 w-5 text-purple-600" />
                )}
              </CardHeader>
              
              <CardContent className="pb-3">
                <p className="text-gray-600">
                  {module.description}
                </p>
                {module.premium && (
                  <div className="mt-2 text-sm font-medium text-purple-600 flex items-center">
                    <span>Premium Feature • {module.credits} credits</span>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="pt-0 flex flex-wrap gap-2">
                {module.status === 'active' ? (
                  <Button 
                    onClick={() => handleOpenModule(module.id)}
                    className="flex-1 bg-[var(--navy)] hover:bg-[var(--navy)]/90"
                  >
                    Open
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleActivateModule(module.id)}
                    className={`flex-1 ${
                      module.status === 'locked' 
                        ? 'bg-purple-600 hover:bg-purple-700' 
                        : 'bg-[var(--navy)] hover:bg-[var(--navy)]/90'
                    }`}
                    disabled={module.status === 'locked'}
                  >
                    {module.status === 'locked' ? 'Unlock (Coming Soon)' : 'Activate'}
                  </Button>
                )}
                
                {module.previewAvailable && (
                  <Button 
                    variant="outline" 
                    onClick={() => handlePreviewModule(module.id)}
                    className="flex-none"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* Category Groups (for mobile and alternative view) */}
        {activeTab === 'all' && (
          <div className="space-y-12 mt-16">
            {(['page_templates', 'campaign_tools', 'content_tools', 'utility_modules'] as ModuleCategory[]).map((category) => {
              const categoryModules = Object.values(modules).filter(m => m.category === category);
              
              if (categoryModules.length === 0) return null;
              
              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-[var(--navy)]">{getCategoryName(category)}</h2>
                    <Button 
                      variant="ghost" 
                      onClick={() => setActiveTab(category)}
                    >
                      View All
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryModules.slice(0, 3).map((module) => (
                      <Card key={module.id} className={`overflow-hidden transition-all hover:shadow-md ${
                        module.status === 'active' ? 'border-green-300 bg-green-50/30' : 
                        module.status === 'locked' ? 'border-purple-300 bg-purple-50/20' : 
                        'border-gray-200'
                      }`}>
                        <CardHeader className="pb-3 flex flex-row justify-between items-start gap-4">
                          <div className="flex gap-3">
                            <div className="bg-white p-2 rounded-md shadow-sm">
                              {renderIcon(module.iconType, module.iconColor)}
                            </div>
                            <div>
                              <CardTitle className="text-xl">{module.name}</CardTitle>
                              <div className="mt-1">
                                {getStatusBadge(module.status)}
                              </div>
                            </div>
                          </div>
                          {module.status === 'active' && (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          )}
                          {module.status === 'locked' && (
                            <Lock className="h-5 w-5 text-purple-600" />
                          )}
                        </CardHeader>
                        
                        <CardContent className="pb-3">
                          <p className="text-gray-600">
                            {module.description}
                          </p>
                          {module.premium && (
                            <div className="mt-2 text-sm font-medium text-purple-600 flex items-center">
                              <span>Premium Feature • {module.credits} credits</span>
                            </div>
                          )}
                        </CardContent>
                        
                        <CardFooter className="pt-0 flex flex-wrap gap-2">
                          {module.status === 'active' ? (
                            <Button 
                              onClick={() => handleOpenModule(module.id)}
                              className="flex-1 bg-[var(--navy)] hover:bg-[var(--navy)]/90"
                            >
                              Open
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => handleActivateModule(module.id)}
                              className={`flex-1 ${
                                module.status === 'locked' 
                                  ? 'bg-purple-600 hover:bg-purple-700' 
                                  : 'bg-[var(--navy)] hover:bg-[var(--navy)]/90'
                              }`}
                              disabled={module.status === 'locked'}
                            >
                              {module.status === 'locked' ? 'Unlock (Coming Soon)' : 'Activate'}
                            </Button>
                          )}
                          
                          {module.previewAvailable && (
                            <Button 
                              variant="outline" 
                              onClick={() => handlePreviewModule(module.id)}
                              className="flex-none"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Preview
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Help Section */}
        <div className="mt-20 p-8 bg-blue-50 rounded-xl border border-blue-100">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Need a custom feature?</h2>
            <p className="text-blue-700 mb-6">
              Don't see what you need? Request a custom feature for your specific business requirements.
            </p>
            <Button 
              onClick={() => setLocation('/scope-request')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Request Custom Feature
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}