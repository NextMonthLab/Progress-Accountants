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
  Eye,
  FileSpreadsheet,
  LineChart,
  Calculator,
  BarChart3
} from 'lucide-react';

// Define item status types
type ItemStatus = 'active' | 'pending' | 'inactive' | 'locked';

// Define item categories
type ItemCategory = 'page_templates' | 'tools' | 'calculators' | 'dashboards';

// Define item types - essential for enforcing ecosystem structure
type ItemType = 'page' | 'tool';

// Define marketplace item interface
interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  status: ItemStatus;
  icon: React.ReactNode;
  type: ItemType; // New field to enforce ecosystem structure differentiation
  path?: string; // Path for navigation if the item is already activated
  previewAvailable?: boolean;
  premium?: boolean;
  credits?: number;
}

export default function EnhancedMarketplacePage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [items, setItems] = useState<Record<string, MarketplaceItem>>({});
  
  // Load items from local storage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem('project_context.marketplace_items');
    
    if (savedItems) {
      try {
        const parsedItems = JSON.parse(savedItems);
        setItems(prev => ({...prev, ...parsedItems}));
      } catch (error) {
        console.error('Error parsing stored marketplace items:', error);
        toast({
          title: "Error Loading Marketplace",
          description: "There was a problem loading your marketplace data.",
          variant: "destructive",
        });
      }
    } else {
      // Initialize with default items if none exist
      initializeDefaultItems();
    }
  }, [toast]);
  
  // Initialize default items
  const initializeDefaultItems = () => {
    const defaultItems: Record<string, MarketplaceItem> = {
      case_study_template: {
        id: 'case_study_template',
        name: 'Case Study Page',
        description: 'Tell the story of your client success—auto-formatted and conversion-ready.',
        category: 'page_templates',
        status: 'inactive',
        type: 'page',
        icon: <FileText className="h-8 w-8 text-blue-500" />,
        previewAvailable: true
      },
      team_page_template: {
        id: 'team_page_template',
        name: 'Team Page',
        description: 'Showcase your team in a clean, on-brand layout.',
        category: 'page_templates',
        status: 'inactive',
        type: 'page',
        icon: <Users className="h-8 w-8 text-blue-500" />
      },
      pricing_page_template: {
        id: 'pricing_page_template',
        name: 'Pricing Page',
        description: 'Display your offers clearly and confidently.',
        category: 'page_templates',
        status: 'inactive',
        type: 'page',
        icon: <Layout className="h-8 w-8 text-blue-500" />
      },
      lead_tracker: {
        id: 'lead_tracker',
        name: 'Lead Tracker',
        description: 'Track anonymous visitors and convert traffic into opportunities.',
        category: 'tools',
        status: 'active',
        type: 'tool',
        icon: <Briefcase className="h-8 w-8 text-green-500" />,
        path: '/lead-tracker'
      },
      script_builder: {
        id: 'script_builder',
        name: 'Script Builder',
        description: 'Generate pitch scripts for outreach or landing pages.',
        category: 'tools',
        status: 'inactive',
        type: 'tool',
        icon: <MessageSquare className="h-8 w-8 text-green-500" />
      },
      email_campaign_composer: {
        id: 'email_campaign_composer',
        name: 'Email Campaign Composer',
        description: 'Create email sequences using your brand tone and business goals.',
        category: 'tools',
        status: 'locked',
        type: 'tool',
        icon: <Mail className="h-8 w-8 text-green-500" />,
        premium: true,
        credits: 5
      },
      blog_generator: {
        id: 'blog_generator',
        name: 'Blog Generator',
        description: 'Generate SEO-friendly articles based on your expertise and target audience.',
        category: 'tools',
        status: 'inactive',
        type: 'tool',
        icon: <Newspaper className="h-8 w-8 text-purple-500" />
      },
      social_post_pack: {
        id: 'social_post_pack',
        name: 'Social Post Pack',
        description: 'Auto-generate branded post series for campaigns, launches, or testimonials.',
        category: 'tools',
        status: 'pending',
        type: 'tool',
        icon: <PenSquare className="h-8 w-8 text-purple-500" />
      },
      profitability_calculator: {
        id: 'profitability_calculator',
        name: 'Profitability Calculator',
        description: 'Interactive tool for clients to forecast financial outcomes based on different scenarios.',
        category: 'calculators',
        status: 'inactive',
        type: 'tool',
        icon: <Calculator className="h-8 w-8 text-orange-500" />
      },
      tax_savings_estimator: {
        id: 'tax_savings_estimator',
        name: 'Tax Savings Estimator',
        description: 'Help clients visualize potential tax savings with different strategies.',
        category: 'calculators',
        status: 'inactive',
        type: 'tool',
        icon: <LineChart className="h-8 w-8 text-orange-500" />
      },
      financial_dashboard: {
        id: 'financial_dashboard',
        name: 'Financial Performance Dashboard',
        description: 'Real-time view of key financial metrics and business performance.',
        category: 'dashboards',
        status: 'inactive',
        type: 'tool',
        icon: <BarChart3 className="h-8 w-8 text-purple-500" />
      },
      brand_guidelines_editor: {
        id: 'brand_guidelines_editor',
        name: 'Brand Guidelines Editor',
        description: 'Update your core visuals and messaging.',
        category: 'tools',
        status: 'active',
        type: 'page',
        icon: <BookOpen className="h-8 w-8 text-orange-500" />,
        path: '/brand-guidelines'
      },
      business_identity_editor: {
        id: 'business_identity_editor',
        name: 'Business Identity Editor',
        description: 'Refine your tone, values, and market focus.',
        category: 'tools',
        status: 'active',
        type: 'page',
        icon: <Briefcase className="h-8 w-8 text-orange-500" />,
        path: '/business-identity'
      }
    };
    
    setItems(defaultItems);
    localStorage.setItem('project_context.marketplace_items', JSON.stringify(defaultItems));
  };
  
  // Save items to local storage whenever they change
  useEffect(() => {
    if (Object.keys(items).length > 0) {
      localStorage.setItem('project_context.marketplace_items', JSON.stringify(items));
    }
  }, [items]);
  
  // Handle item activation
  const handleActivateItem = (itemId: string) => {
    setItems(prev => {
      const updatedItems = {...prev};
      
      if (updatedItems[itemId]) {
        // Check if the item is locked (premium)
        if (updatedItems[itemId].status === 'locked') {
          toast({
            title: "Premium Feature",
            description: "This feature requires credits to unlock. Coming soon!",
            variant: "default",
          });
          return prev;
        }
        
        // Update the status to active
        updatedItems[itemId] = {
          ...updatedItems[itemId],
          status: 'active'
        };
        
        // Use the correct terminology based on the item type
        const itemType = updatedItems[itemId].type === 'page' ? 'Page' : 'Tool';
        
        toast({
          title: `${itemType} Activated`,
          description: `${updatedItems[itemId].name} has been activated successfully.`,
          variant: "default",
        });
      }
      
      return updatedItems;
    });
  };
  
  // Handle item preview
  const handlePreviewItem = (itemId: string) => {
    const itemType = items[itemId].type === 'page' ? 'Page' : 'Tool';
    
    toast({
      title: "Preview Mode",
      description: `Previewing ${items[itemId].name} ${itemType.toLowerCase()}...`,
      variant: "default",
    });
    
    // In a real implementation, this would open a modal or navigate to a preview page
  };
  
  // Handle opening an active item
  const handleOpenItem = (itemId: string) => {
    const item = items[itemId];
    
    if (item && item.path) {
      setLocation(item.path);
    } else {
      toast({
        title: "Navigation Error",
        description: "This item doesn't have a valid path.",
        variant: "destructive",
      });
    }
  };
  
  // Filter items by category
  const getFilteredItems = (): MarketplaceItem[] => {
    return Object.values(items).filter(item => {
      if (activeTab === 'all') return true;
      return item.category === activeTab;
    });
  };
  
  // Get status badge for an item
  const getStatusBadge = (status: ItemStatus, type: ItemType) => {
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
  
  // Get type badge
  const getTypeBadge = (type: ItemType) => {
    if (type === 'page') {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 ml-2">Page</Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 ml-2">Tool</Badge>;
    }
  }
  
  // Get user-friendly category name
  const getCategoryName = (category: ItemCategory): string => {
    switch (category) {
      case 'page_templates':
        return 'Page Templates';
      case 'tools':
        return 'Tools';
      case 'calculators':
        return 'Calculators';
      case 'dashboards':
        return 'Dashboards';
      default:
        return 'Other';
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Helmet>
        <title>Marketplace | Progress Accountants</title>
      </Helmet>
      
      <div className="container mx-auto px-4 max-w-7xl">
        {/* New banner */}
        <div className="bg-gradient-to-r from-[var(--navy)] to-[var(--navy)]/90 rounded-xl p-6 mb-10 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Transform Your Accounting Practice</h2>
              <p className="text-white/90">
                Browse our curated collection of pages and tools designed for accounting firms. Find, install, and launch with just a few clicks.
              </p>
            </div>
            <Button 
              onClick={() => {}} 
              className="bg-white text-[var(--navy)] hover:bg-white/90 px-6 shrink-0"
            >
              View Getting Started Guide
            </Button>
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 text-[var(--navy)]">Marketplace</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Add new pages, tools, and automations to enhance your Progress Accountants platform. No code. No friction.
          </p>
        </div>
        
        {/* Category Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-5 w-full max-w-4xl mx-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="page_templates">Pages</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="calculators">Calculators</TabsTrigger>
            <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Item Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {getFilteredItems().map((item) => (
            <Card key={item.id} className={`overflow-hidden transition-all hover:shadow-md ${
              item.status === 'active' ? 'border-green-300 bg-green-50/30' : 
              item.status === 'locked' ? 'border-purple-300 bg-purple-50/20' : 
              'border-gray-200'
            }`}>
              <CardHeader className="pb-3 flex flex-row justify-between items-start gap-4">
                <div className="flex gap-3">
                  <div className="bg-white p-2 rounded-md shadow-sm">
                    {item.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl flex items-center">
                      {item.name}
                      {getTypeBadge(item.type)}
                    </CardTitle>
                    <div className="mt-1 flex gap-2">
                      {getStatusBadge(item.status, item.type)}
                    </div>
                  </div>
                </div>
                {item.status === 'active' && (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                )}
                {item.status === 'locked' && (
                  <Lock className="h-5 w-5 text-purple-600" />
                )}
              </CardHeader>
              
              <CardContent className="pb-3">
                <p className="text-gray-600">
                  {item.description}
                </p>
                {item.premium && (
                  <div className="mt-2 text-sm font-medium text-purple-600 flex items-center">
                    <span>Premium Feature • {item.credits} credits</span>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="pt-0 flex flex-wrap gap-2">
                {item.status === 'active' ? (
                  <Button 
                    onClick={() => handleOpenItem(item.id)}
                    className="flex-1 bg-[var(--navy)] hover:bg-[var(--navy)]/90"
                  >
                    Open
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleActivateItem(item.id)}
                    className={`flex-1 ${
                      item.status === 'locked' 
                        ? 'bg-purple-600 hover:bg-purple-700' 
                        : 'bg-[var(--navy)] hover:bg-[var(--navy)]/90'
                    }`}
                    disabled={item.status === 'locked'}
                  >
                    {item.status === 'locked' ? 'Unlock (Coming Soon)' : `Activate ${item.type === 'page' ? 'Page' : 'Tool'}`}
                  </Button>
                )}
                
                {item.previewAvailable && (
                  <Button 
                    variant="outline" 
                    onClick={() => handlePreviewItem(item.id)}
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
            {(['page_templates', 'tools', 'calculators', 'dashboards'] as ItemCategory[]).map((category) => {
              const categoryItems = Object.values(items).filter(i => i.category === category);
              
              if (categoryItems.length === 0) return null;
              
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
                    {categoryItems.slice(0, 3).map((item) => (
                      <Card key={item.id} className={`overflow-hidden transition-all hover:shadow-md ${
                        item.status === 'active' ? 'border-green-300 bg-green-50/30' : 
                        item.status === 'locked' ? 'border-purple-300 bg-purple-50/20' : 
                        'border-gray-200'
                      }`}>
                        <CardHeader className="pb-3 flex flex-row justify-between items-start gap-4">
                          <div className="flex gap-3">
                            <div className="bg-white p-2 rounded-md shadow-sm">
                              {item.icon}
                            </div>
                            <div>
                              <CardTitle className="text-xl flex items-center">
                                {item.name}
                                {getTypeBadge(item.type)}
                              </CardTitle>
                              <div className="mt-1">
                                {getStatusBadge(item.status, item.type)}
                              </div>
                            </div>
                          </div>
                          {item.status === 'active' && (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          )}
                          {item.status === 'locked' && (
                            <Lock className="h-5 w-5 text-purple-600" />
                          )}
                        </CardHeader>
                        
                        <CardContent className="pb-3">
                          <p className="text-gray-600">
                            {item.description}
                          </p>
                          {item.premium && (
                            <div className="mt-2 text-sm font-medium text-purple-600 flex items-center">
                              <span>Premium Feature • {item.credits} credits</span>
                            </div>
                          )}
                        </CardContent>
                        
                        <CardFooter className="pt-0 flex flex-wrap gap-2">
                          {item.status === 'active' ? (
                            <Button 
                              onClick={() => handleOpenItem(item.id)}
                              className="flex-1 bg-[var(--navy)] hover:bg-[var(--navy)]/90"
                            >
                              Open
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => handleActivateItem(item.id)}
                              className={`flex-1 ${
                                item.status === 'locked' 
                                  ? 'bg-purple-600 hover:bg-purple-700' 
                                  : 'bg-[var(--navy)] hover:bg-[var(--navy)]/90'
                              }`}
                              disabled={item.status === 'locked'}
                            >
                              {item.status === 'locked' ? 'Unlock (Coming Soon)' : `Activate ${item.type === 'page' ? 'Page' : 'Tool'}`}
                            </Button>
                          )}
                          
                          {item.previewAvailable && (
                            <Button 
                              variant="outline" 
                              onClick={() => handlePreviewItem(item.id)}
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
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Need a custom page?</h2>
            <p className="text-blue-700 mb-6">
              Don't see what you need? Request a custom page for your specific business requirements.
            </p>
            <Button 
              onClick={() => window.location.href = '/scope-request'}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Request Custom Page
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}