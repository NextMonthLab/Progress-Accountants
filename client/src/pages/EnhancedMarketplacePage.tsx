import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useSearchParams } from '@/hooks/use-search-params';
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
  Filter,
  ChevronDown,
  X,
  Sliders,
  Search
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";

// Define module status types
type ModuleStatus = 'active' | 'pending' | 'inactive' | 'locked';

// Define module categories
type ModuleCategory = 'page_templates' | 'campaign_tools' | 'content_tools' | 'utility_modules';

// Define module type
type ModuleType = 'internal' | 'client-facing' | 'automation';

// Define module interface with enhanced properties
interface Module {
  id: string;
  name: string;
  description: string;
  category: ModuleCategory;
  status: ModuleStatus;
  type: ModuleType;
  icon: React.ReactNode;
  path?: string; // Path for navigation if the module is already activated
  previewAvailable?: boolean;
  premium?: boolean;
  credits?: number;
  tags?: string[]; // New property for tags/chips
}

// Filter interface
interface Filters {
  status: string[];
  category: string[];
  type: string[];
  tags: string[];
  search: string;
}

export default function EnhancedMarketplacePage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [modules, setModules] = useState<Record<string, Module>>({});
  const [filteredModules, setFilteredModules] = useState<Module[]>([]);
  const [filters, setFilters] = useState<Filters>({
    status: [],
    category: [],
    type: [],
    tags: [],
    search: ''
  });
  const [allTags, setAllTags] = useState<string[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Get search params from URL
  const { searchParams, setSearchParams } = useSearchParams();

  // Load filters from URL
  useEffect(() => {
    const statusFilter = searchParams.get('status')?.split(',') || [];
    const categoryFilter = searchParams.get('category')?.split(',') || [];
    const typeFilter = searchParams.get('type')?.split(',') || [];
    const tagsFilter = searchParams.get('tags')?.split(',') || [];
    const searchFilter = searchParams.get('search') || '';

    setFilters({
      status: statusFilter,
      category: categoryFilter,
      type: typeFilter,
      tags: tagsFilter.filter(t => t !== ''),
      search: searchFilter
    });
  }, [searchParams]);

  // Update URL when filters change
  useEffect(() => {
    const params: Record<string, string> = {};
    
    if (filters.status.length > 0) params.status = filters.status.join(',');
    if (filters.category.length > 0) params.category = filters.category.join(',');
    if (filters.type.length > 0) params.type = filters.type.join(',');
    if (filters.tags.length > 0) params.tags = filters.tags.join(',');
    if (filters.search) params.search = filters.search;
    
    setSearchParams(params);
  }, [filters, setSearchParams]);
  
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

  // After modules are loaded, extract all unique tags
  useEffect(() => {
    if (Object.keys(modules).length > 0) {
      const tags = new Set<string>();
      Object.values(modules).forEach(module => {
        module.tags?.forEach(tag => tags.add(tag));
      });
      setAllTags(Array.from(tags));
    }
  }, [modules]);

  // Filter modules whenever filters change
  useEffect(() => {
    const filtered = Object.values(modules).filter(module => {
      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(module.status)) {
        return false;
      }
      
      // Category filter
      if (filters.category.length > 0 && !filters.category.includes(module.category)) {
        return false;
      }
      
      // Type filter
      if (filters.type.length > 0 && !filters.type.includes(module.type)) {
        return false;
      }
      
      // Tags filter
      if (filters.tags.length > 0 && !filters.tags.some(tag => module.tags?.includes(tag))) {
        return false;
      }
      
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          module.name.toLowerCase().includes(searchLower) ||
          module.description.toLowerCase().includes(searchLower) ||
          module.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    });
    
    setFilteredModules(filtered);
  }, [modules, filters]);
  
  // Initialize default modules
  const initializeDefaultModules = () => {
    const defaultModules: Record<string, Module> = {
      case_study_template: {
        id: 'case_study_template',
        name: 'Case Study Template',
        description: 'Tell the story of your client success—auto-formatted and conversion-ready.',
        category: 'page_templates',
        type: 'client-facing',
        status: 'inactive',
        icon: <FileText className="h-8 w-8 text-blue-500" />,
        previewAvailable: true,
        tags: ['Marketing', 'Content']
      },
      team_page_template: {
        id: 'team_page_template',
        name: 'Team Page Template',
        description: 'Showcase your team in a clean, on-brand layout.',
        category: 'page_templates',
        type: 'client-facing',
        status: 'inactive',
        icon: <Users className="h-8 w-8 text-blue-500" />,
        tags: ['Creative', 'Branding']
      },
      pricing_page_template: {
        id: 'pricing_page_template',
        name: 'Pricing Page Template',
        description: 'Display your offers clearly and confidently.',
        category: 'page_templates',
        type: 'client-facing',
        status: 'inactive',
        icon: <Layout className="h-8 w-8 text-blue-500" />,
        tags: ['Sales', 'Finance']
      },
      lead_tracker: {
        id: 'lead_tracker',
        name: 'Lead Tracker',
        description: 'Track anonymous visitors and convert traffic into opportunities.',
        category: 'campaign_tools',
        type: 'internal',
        status: 'active',
        icon: <Briefcase className="h-8 w-8 text-green-500" />,
        path: '/lead-tracker',
        tags: ['Sales', 'Marketing', 'Data']
      },
      script_builder: {
        id: 'script_builder',
        name: 'Script Builder',
        description: 'Generate pitch scripts for outreach or landing pages.',
        category: 'campaign_tools',
        type: 'internal',
        status: 'inactive',
        icon: <MessageSquare className="h-8 w-8 text-green-500" />,
        tags: ['Sales', 'AI-Powered', 'Content']
      },
      email_campaign_composer: {
        id: 'email_campaign_composer',
        name: 'Email Campaign Composer',
        description: 'Create email sequences using your brand tone and business goals.',
        category: 'campaign_tools',
        type: 'automation',
        status: 'locked',
        icon: <Mail className="h-8 w-8 text-green-500" />,
        premium: true,
        credits: 5,
        tags: ['Marketing', 'Automation', 'Content']
      },
      blog_generator: {
        id: 'blog_generator',
        name: 'Blog Generator',
        description: 'Generate SEO-friendly articles based on your expertise and target audience.',
        category: 'content_tools',
        type: 'automation',
        status: 'inactive',
        icon: <Newspaper className="h-8 w-8 text-purple-500" />,
        tags: ['Marketing', 'AI-Powered', 'Content']
      },
      social_post_pack: {
        id: 'social_post_pack',
        name: 'Social Post Pack',
        description: 'Auto-generate branded post series for campaigns, launches, or testimonials.',
        category: 'content_tools',
        type: 'automation',
        status: 'pending',
        icon: <PenSquare className="h-8 w-8 text-purple-500" />,
        tags: ['Marketing', 'Social Media', 'Content']
      },
      brand_guidelines_editor: {
        id: 'brand_guidelines_editor',
        name: 'Brand Guidelines Editor',
        description: 'Update your core visuals and messaging.',
        category: 'utility_modules',
        type: 'internal',
        status: 'active',
        icon: <BookOpen className="h-8 w-8 text-orange-500" />,
        path: '/brand-guidelines',
        tags: ['Branding', 'Design']
      },
      business_identity_editor: {
        id: 'business_identity_editor',
        name: 'Business Identity Editor',
        description: 'Refine your tone, values, and market focus.',
        category: 'utility_modules',
        type: 'internal',
        status: 'active',
        icon: <Briefcase className="h-8 w-8 text-orange-500" />,
        path: '/business-identity',
        tags: ['Branding', 'Planning']
      }
    };
    
    setModules(defaultModules);
    localStorage.setItem('project_context.modules', JSON.stringify(defaultModules));
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
          title: "Tool Activated",
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
        description: "This tool doesn't have a valid path.",
        variant: "destructive",
      });
    }
  };

  // Helpers for filter management
  const toggleFilterItem = (filterType: keyof Filters, item: string) => {
    setFilters(prev => {
      const filterArray = prev[filterType] as string[];
      const newArray = filterArray.includes(item) 
        ? filterArray.filter(i => i !== item)
        : [...filterArray, item];
      
      return {
        ...prev,
        [filterType]: newArray
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      status: [],
      category: [],
      type: [],
      tags: [],
      search: ''
    });
  };

  // Helper to set search filter
  const handleSearchChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      search: value
    }));
  };
  
  // Get status badge for a module
  const getStatusBadge = (status: ModuleStatus) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Ready</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">In Beta</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">Available</Badge>;
      case 'locked':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Coming Soon</Badge>;
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

  // Get user-friendly type name
  const getTypeName = (type: ModuleType): string => {
    switch (type) {
      case 'internal':
        return 'Internal Tool';
      case 'client-facing':
        return 'Client-Facing';
      case 'automation':
        return 'Automation';
      default:
        return 'Other';
    }
  };

  // Get the appropriate action button based on module status
  const getActionButton = (module: Module) => {
    switch (module.status) {
      case 'active':
        return (
          <Button 
            onClick={() => handleOpenModule(module.id)}
            className="w-full bg-[var(--navy)] hover:bg-[var(--navy)]/90"
          >
            Open
          </Button>
        );
      case 'locked':
        return (
          <Button 
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled
          >
            Request Access
          </Button>
        );
      case 'pending':
        return (
          <Button 
            className="w-full bg-yellow-600 hover:bg-yellow-700"
            onClick={() => handlePreviewModule(module.id)}
          >
            Preview Beta
          </Button>
        );
      default:
        return (
          <Button 
            onClick={() => handleActivateModule(module.id)}
            className="w-full bg-[var(--navy)] hover:bg-[var(--navy)]/90"
          >
            Install
          </Button>
        );
    }
  };

  // Calculate active filter count
  const activeFilterCount = 
    filters.status.length + 
    filters.category.length + 
    filters.type.length + 
    filters.tags.length + 
    (filters.search ? 1 : 0);
  
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
                Browse our curated collection of specialized tools designed for accounting firms. Find, install, and launch with just a few clicks.
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
            Discover and install tools, pages, and automations to enhance your business platform.
          </p>
        </div>
        
        {/* Desktop Filter Controls */}
        <div className="hidden md:block bg-white rounded-lg shadow-sm mb-8 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-medium text-[var(--navy)]">Filters</h2>
            </div>
            
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500">
                Clear All ({activeFilterCount})
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search tools..."
                  className="pl-9"
                  value={filters.search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
                {filters.search && (
                  <button 
                    onClick={() => handleSearchChange('')}
                    className="absolute right-2.5 top-2.5 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Status Filter */}
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center gap-2">
                      <span>Status</span>
                      {filters.status.length > 0 && (
                        <Badge variant="secondary" className="ml-1">{filters.status.length}</Badge>
                      )}
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={filters.status.includes('active')}
                    onCheckedChange={(checked: boolean) => {
                      if (checked) toggleFilterItem('status', 'active');
                      else toggleFilterItem('status', 'active');
                    }}
                  >
                    Ready
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.status.includes('pending')}
                    onCheckedChange={() => toggleFilterItem('status', 'pending')}
                  >
                    In Beta
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.status.includes('inactive')}
                    onCheckedChange={() => toggleFilterItem('status', 'inactive')}
                  >
                    Available
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.status.includes('locked')}
                    onCheckedChange={() => toggleFilterItem('status', 'locked')}
                  >
                    Coming Soon
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Category Filter */}
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center gap-2">
                      <span>Category</span>
                      {filters.category.length > 0 && (
                        <Badge variant="secondary" className="ml-1">{filters.category.length}</Badge>
                      )}
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={filters.category.includes('page_templates')}
                    onCheckedChange={() => toggleFilterItem('category', 'page_templates')}
                  >
                    Page Templates
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.category.includes('campaign_tools')}
                    onCheckedChange={() => toggleFilterItem('category', 'campaign_tools')}
                  >
                    Campaign Tools
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.category.includes('content_tools')}
                    onCheckedChange={() => toggleFilterItem('category', 'content_tools')}
                  >
                    Content Tools
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.category.includes('utility_modules')}
                    onCheckedChange={() => toggleFilterItem('category', 'utility_modules')}
                  >
                    Utility Modules
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Type Filter */}
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center gap-2">
                      <span>Type</span>
                      {filters.type.length > 0 && (
                        <Badge variant="secondary" className="ml-1">{filters.type.length}</Badge>
                      )}
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={filters.type.includes('internal')}
                    onCheckedChange={() => toggleFilterItem('type', 'internal')}
                  >
                    Internal Tool
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.type.includes('client-facing')}
                    onCheckedChange={() => toggleFilterItem('type', 'client-facing')}
                  >
                    Client-Facing
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.type.includes('automation')}
                    onCheckedChange={() => toggleFilterItem('type', 'automation')}
                  >
                    Automation
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Tags Filter */}
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center gap-2">
                      <span>Tags</span>
                      {filters.tags.length > 0 && (
                        <Badge variant="secondary" className="ml-1">{filters.tags.length}</Badge>
                      )}
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56" align="end">
                  <div className="space-y-2">
                    <h4 className="font-medium">Filter by Tags</h4>
                    <Separator />
                    <div className="max-h-[200px] overflow-y-auto space-y-1 pt-1">
                      {allTags.map(tag => (
                        <div key={tag} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`tag-${tag}`}
                            checked={filters.tags.includes(tag)}
                            onChange={() => toggleFilterItem('tags', tag)}
                            className="h-4 w-4 rounded border-gray-300 text-[var(--navy)] focus:ring-[var(--navy)]"
                          />
                          <label htmlFor={`tag-${tag}`} className="text-sm">{tag}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {/* Active Filter Pills */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {filters.search && (
                <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
                  Search: {filters.search}
                  <button onClick={() => handleSearchChange('')}>
                    <X className="h-3 w-3 ml-1" />
                  </button>
                </Badge>
              )}
              
              {filters.status.map(status => (
                <Badge key={status} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                  {status === 'active' ? 'Ready' : 
                   status === 'pending' ? 'In Beta' : 
                   status === 'inactive' ? 'Available' : 
                   status === 'locked' ? 'Coming Soon' : status}
                  <button onClick={() => toggleFilterItem('status', status)}>
                    <X className="h-3 w-3 ml-1" />
                  </button>
                </Badge>
              ))}
              
              {filters.category.map(category => (
                <Badge key={category} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                  {getCategoryName(category as ModuleCategory)}
                  <button onClick={() => toggleFilterItem('category', category)}>
                    <X className="h-3 w-3 ml-1" />
                  </button>
                </Badge>
              ))}
              
              {filters.type.map(type => (
                <Badge key={type} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                  {getTypeName(type as ModuleType)}
                  <button onClick={() => toggleFilterItem('type', type)}>
                    <X className="h-3 w-3 ml-1" />
                  </button>
                </Badge>
              ))}
              
              {filters.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                  {tag}
                  <button onClick={() => toggleFilterItem('tags', tag)}>
                    <X className="h-3 w-3 ml-1" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Filter Controls */}
        <div className="md:hidden mb-6 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search tools..."
              className="pl-9"
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            {filters.search && (
              <button 
                onClick={() => handleSearchChange('')}
                className="absolute right-2.5 top-2.5 text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <Drawer open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline" size="icon" className="flex-none relative">
                <Sliders className="h-4 w-4" />
                {activeFilterCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Filter Tools</DrawerTitle>
                <DrawerDescription>
                  Narrow down available tools by applying filters
                </DrawerDescription>
              </DrawerHeader>
              <div className="p-4 space-y-4">
                {/* Status Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Status</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['active', 'pending', 'inactive', 'locked'].map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`mobile-status-${status}`}
                          checked={filters.status.includes(status)}
                          onChange={() => toggleFilterItem('status', status)}
                          className="h-4 w-4 rounded border-gray-300 text-[var(--navy)] focus:ring-[var(--navy)]"
                        />
                        <label htmlFor={`mobile-status-${status}`} className="text-sm">
                          {status === 'active' ? 'Ready' : 
                           status === 'pending' ? 'In Beta' : 
                           status === 'inactive' ? 'Available' : 
                           'Coming Soon'}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Category Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Category</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {['page_templates', 'campaign_tools', 'content_tools', 'utility_modules'].map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`mobile-category-${category}`}
                          checked={filters.category.includes(category)}
                          onChange={() => toggleFilterItem('category', category)}
                          className="h-4 w-4 rounded border-gray-300 text-[var(--navy)] focus:ring-[var(--navy)]"
                        />
                        <label htmlFor={`mobile-category-${category}`} className="text-sm">
                          {getCategoryName(category as ModuleCategory)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Type Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Type</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {['internal', 'client-facing', 'automation'].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`mobile-type-${type}`}
                          checked={filters.type.includes(type)}
                          onChange={() => toggleFilterItem('type', type)}
                          className="h-4 w-4 rounded border-gray-300 text-[var(--navy)] focus:ring-[var(--navy)]"
                        />
                        <label htmlFor={`mobile-type-${type}`} className="text-sm">
                          {getTypeName(type as ModuleType)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Tags Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Tags</h3>
                  <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                    {allTags.map((tag) => (
                      <div key={tag} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`mobile-tag-${tag}`}
                          checked={filters.tags.includes(tag)}
                          onChange={() => toggleFilterItem('tags', tag)}
                          className="h-4 w-4 rounded border-gray-300 text-[var(--navy)] focus:ring-[var(--navy)]"
                        />
                        <label htmlFor={`mobile-tag-${tag}`} className="text-sm">{tag}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DrawerFooter>
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="mb-2"
                >
                  Clear All Filters
                </Button>
                <DrawerClose asChild>
                  <Button>Apply Filters</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
        
        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-500">
            Showing {filteredModules.length} tool{filteredModules.length !== 1 ? 's' : ''}
            {activeFilterCount > 0 ? ' (filtered)' : ''}
          </p>
          {activeFilterCount > 0 && (
            <Button 
              variant="link" 
              onClick={clearFilters} 
              className="text-sm p-0 h-auto"
            >
              Clear Filters
            </Button>
          )}
        </div>
        
        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredModules.map((module) => (
            <Card key={module.id} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-bold">{module.name}</CardTitle>
                  <div>
                    {getStatusBadge(module.status)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pb-2">
                <p className="text-gray-600 text-sm mb-3">
                  {module.description}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {module.tags?.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5 font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                {module.premium && (
                  <div className="text-xs font-medium text-purple-600 mb-2 flex items-center">
                    <Lock className="h-3 w-3 mr-1" />
                    <span>Premium Feature • {module.credits} credits</span>
                  </div>
                )}
              </CardContent>
              
              <CardFooter>
                <div className="w-full flex gap-2">
                  {getActionButton(module)}
                  
                  {module.previewAvailable && module.status !== 'active' && module.status !== 'pending' && (
                    <Button 
                      variant="outline" 
                      onClick={() => handlePreviewModule(module.id)}
                      className="flex-none"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* No Results Message */}
        {filteredModules.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No tools found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              We couldn't find any tools matching your current filters. Try adjusting your search or clearing filters.
            </p>
            <Button onClick={clearFilters}>
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}