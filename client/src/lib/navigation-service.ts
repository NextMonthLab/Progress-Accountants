import { 
  NavigationItem, 
  NavigationLink, 
  NavigationSubmenu, 
  NavigationItemCategory
} from '@/types/navigation';

// Map the current sidebar items to our new navigation structure
export const mapSidebarToNavigation = (): NavigationItem[] => {
  // This is a conversion function that allows us to transform our current
  // sidebar structure into the new dynamic navigation system format
  
  const navigationItems: NavigationItem[] = [
    // Command Center / Admin Tools
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: 'LayoutDashboard',
      type: 'link',
      href: '/admin/dashboard',
      description: 'Modern dashboard with enhanced UI and improved contrast',
      badge: { text: 'Upgraded', variant: 'updated' },
      category: 'admin_tools',
    },
    {
      id: 'crm',
      title: 'Client CRM',
      icon: 'Users',
      type: 'link',
      href: '/admin/crm',
      requiresStaff: true,
      badge: { text: 'Pro', variant: 'pro' },
      category: 'admin_tools',
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: 'BarChart',
      type: 'link',
      href: '/admin/analytics',
      requiresStaff: true,
      badge: { text: 'New', variant: 'new' },
      isNew: true,
      category: 'admin_tools',
    },
    {
      id: 'insights_dashboard',
      title: 'Insights Dashboard',
      icon: 'TrendingUp',
      type: 'link',
      href: '/admin/insights-dashboard',
      requiresStaff: true,
      badge: { text: 'New', variant: 'new' },
      isNew: true,
      category: 'admin_tools',
    },
    
    // Creator Tools
    {
      id: 'page_builder',
      title: 'Page Builder',
      icon: 'Layers',
      type: 'submenu',
      items: [
        {
          id: 'all_pages',
          title: 'All Pages',
          icon: 'FileText',
          type: 'link',
          href: '/page-builder',
          requiresStaff: true,
          category: 'creator_tools',
        },
        {
          id: 'create_page',
          title: 'Create New Page',
          icon: 'PlusCircle',
          type: 'link',
          href: '/page-builder/new',
          requiresStaff: true,
          badge: { text: 'Updated', variant: 'updated' },
          category: 'creator_tools',
        },
        {
          id: 'page_templates',
          title: 'Page Templates',
          icon: 'Layout',
          type: 'link',
          href: '/page-builder/templates',
          requiresStaff: true,
          category: 'creator_tools',
        }
      ],
      requiresStaff: true,
      isNew: true,
      category: 'creator_tools',
    },
    {
      id: 'media_hub',
      title: 'Media Hub',
      icon: 'FileImage',
      type: 'link',
      href: '/media',
      requiresStaff: true,
      badge: { text: 'Enhanced', variant: 'updated' },
      category: 'creator_tools',
    },
    {
      id: 'social_media_generator',
      title: 'Social Media Generator',
      icon: 'Newspaper',
      type: 'link',
      href: '/tools/social-media-generator',
      requiresStaff: true,
      badge: { text: 'New', variant: 'new' },
      category: 'creator_tools',
    },
    {
      id: 'blog_post_generator',
      title: 'Blog Post Generator',
      icon: 'FileText',
      type: 'link',
      href: '/tools/blog-post-generator',
      requiresStaff: true,
      badge: { text: 'New', variant: 'new' },
      isNew: true,
      category: 'creator_tools',
    },
    {
      id: 'news_blog',
      title: 'News & Blog',
      icon: 'Newspaper',
      type: 'link',
      href: '/news',
      requiresStaff: true,
      badge: { text: 'New', variant: 'new' },
      isNew: true,
      category: 'creator_tools',
    },
    
    // Personal Growth
    {
      id: 'business_network',
      title: 'Business Network',
      icon: 'Users',
      type: 'link',
      href: '/business-network',
      badge: { text: 'New', variant: 'new' },
      isNew: true,
      category: 'personal_growth',
    },
    {
      id: 'business_discover',
      title: 'Business Discover',
      icon: 'Globe',
      type: 'link',
      href: '/business-discover',
      badge: { text: 'New', variant: 'new' },
      isNew: true,
      category: 'personal_growth',
    },
    {
      id: 'entrepreneur_support',
      title: 'Entrepreneur Support',
      icon: 'Lightbulb',
      type: 'link',
      href: '/entrepreneur-support',
      badge: { text: 'New', variant: 'new' },
      isNew: true,
      category: 'personal_growth',
    },
    
    // Brand Center
    {
      id: 'brand_guidelines',
      title: 'Brand Guidelines',
      icon: 'PaintBucket',
      type: 'link',
      href: '/brand-guidelines',
      requiresStaff: true,
      description: 'Define your brand\'s visual identity',
      category: 'brand_center',
    },
    {
      id: 'business_identity',
      title: 'Business Identity',
      icon: 'CircleUser',
      type: 'link',
      href: '/business-identity',
      requiresStaff: true,
      category: 'brand_center',
    },
    {
      id: 'site_branding',
      title: 'Site Branding',
      icon: 'Image',
      type: 'link',
      href: '/admin/site-branding',
      requiresStaff: true,
      category: 'brand_center',
    },
    
    // Website Setup / Page Builders
    {
      id: 'homepage_setup',
      title: 'Homepage Setup',
      icon: 'Home',
      type: 'link',
      href: '/homepage-setup',
      requiresStaff: true,
      category: 'page_builders',
    },
    {
      id: 'foundation_pages',
      title: 'Foundation Pages',
      icon: 'Layout',
      type: 'link',
      href: '/foundation-pages',
      requiresStaff: true,
      category: 'page_builders',
    },
    {
      id: 'navigation_menus',
      title: 'Navigation Menus',
      icon: 'ListOrdered',
      type: 'link',
      href: '/admin/menu-management',
      requiresStaff: true,
      category: 'website_setup',
    },
    {
      id: 'seo_manager',
      title: 'SEO Manager',
      icon: 'Globe',
      type: 'link',
      href: '/admin/seo',
      requiresStaff: true,
      category: 'website_setup',
    },
    {
      id: 'domain_settings',
      title: 'Domain Settings',
      icon: 'Link',
      type: 'link',
      href: '/admin/domain-mapping',
      requiresStaff: true,
      badge: { text: 'New', variant: 'new' },
      category: 'website_setup',
    },
    {
      id: 'launch_ready',
      title: 'Launch Ready',
      icon: 'FastForward',
      type: 'link',
      href: '/launch-ready',
      requiresStaff: true,
      category: 'page_builders',
    },
    
    // Marketplace - Special category with prominence
    {
      id: 'marketplace',
      title: 'Marketplace',
      icon: 'ShoppingCart',
      type: 'link',
      href: '/marketplace',
      badge: { text: 'New Tools', variant: 'new' },
      isNew: true,
      description: 'Discover and install powerful tools to enhance your site',
      category: 'marketplace',
    },
    
    // System
    {
      id: 'account',
      title: 'Account',
      icon: 'User',
      type: 'link',
      href: '/account',
      category: 'system',
    },
    {
      id: 'admin_settings',
      title: 'Admin Settings',
      icon: 'Settings',
      type: 'link',
      href: '/admin/settings',
      requiresStaff: true,
      category: 'system',
    },
    {
      id: 'ai_companion',
      title: 'AI Companion',
      icon: 'MessageCircle',
      type: 'link',
      href: '/admin/companion-settings',
      requiresStaff: true,
      category: 'system',
    },
    {
      id: 'conversation_insights',
      title: 'Conversation Insights',
      icon: 'Sparkles',
      type: 'link',
      href: '/admin/conversation-insights',
      requiresStaff: true,
      badge: { text: 'New', variant: 'new' },
      isNew: true,
      category: 'system',
    },
    {
      id: 'blueprint_management',
      title: 'Blueprint Management',
      icon: 'Cpu',
      type: 'link',
      href: '/admin/blueprint-management',
      requiresStaff: true,
      badge: { text: 'New', variant: 'new' },
      isNew: true,
      category: 'system',
    },
    {
      id: 'clone_template',
      title: 'Clone Template',
      icon: 'Lightbulb',
      type: 'link',
      href: '/admin/clone-template',
      requiresStaff: true,
      badge: { text: 'New', variant: 'new' },
      isNew: true,
      category: 'system',
    },
  ];
  
  return navigationItems;
};

// Function to fetch navigation data from the API (or mock data for now)
export const fetchNavigationData = async (): Promise<NavigationItem[]> => {
  try {
    // In a real implementation, this would fetch from the API
    // For now, return the mapped data
    return Promise.resolve(mapSidebarToNavigation());
  } catch (error) {
    console.error('Error fetching navigation data:', error);
    return [];
  }
};