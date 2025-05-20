import { 
  NavigationItem, 
  NavigationLink, 
  NavigationSubmenu, 
  NavigationItemCategory
} from '@/types/navigation';

// Define the new navigation structure with main collapsible groups
export const NAVIGATION_GROUPS = [
  {
    id: 'quick_actions',
    title: 'Quick Actions',
    icon: 'Zap',
    category: 'quick_actions',
    defaultExpanded: true,
  },
  {
    id: 'create_publish',
    title: 'Create & Publish',
    icon: 'PenTool',
    category: 'create_publish',
    defaultExpanded: true,
  },
  {
    id: 'manage_monitor',
    title: 'Manage & Monitor',
    icon: 'BarChart',
    category: 'manage_monitor',
    defaultExpanded: false,
  },
  {
    id: 'settings_advanced',
    title: 'Settings & Advanced',
    icon: 'Settings',
    category: 'settings_advanced',
    defaultExpanded: false,
  }
];

// For user preference storage
export const NAVIGATION_MODES = {
  BEGINNER: 'beginner',
  ADVANCED: 'advanced'
};

// Default to beginner mode initially
export const DEFAULT_NAV_MODE = NAVIGATION_MODES.BEGINNER;

// Map the current sidebar items to our new navigation structure
export const mapSidebarToNavigation = (): NavigationItem[] => {
  // This is a conversion function that allows us to transform our current
  // sidebar structure into the new dynamic navigation system format
  
  const navigationItems: NavigationItem[] = [
    // QUICK ACTIONS SECTION
    // ======================
    /* Removed Edit Homepage from menu as requested
    {
      id: 'edit_homepage',
      title: 'Edit Homepage',
      icon: 'Home',
      type: 'link',
      href: '/page-builder/home',
      description: 'Edit your website homepage',
      category: 'quick_actions',
      pinnedOrder: 1,
    },
    */
    {
      id: 'create_new_page',
      title: 'Create New Page',
      icon: 'FileText',
      type: 'link',
      href: '/page-builder/new',
      description: 'Create a new page for your website',
      category: 'quick_actions',
      pinnedOrder: 2,
    },
    {
      id: 'view_insights',
      title: 'View Insights',
      icon: 'BarChart2',
      type: 'link',
      href: '/admin/insights-dashboard',
      description: 'View client feedback and content suggestions',
      category: 'quick_actions',
      pinnedOrder: 3,
    },
    {
      id: 'update_branding',
      title: 'Update Branding',
      icon: 'Palette',
      type: 'link',
      href: '/brand-center',
      description: 'Update your brand colors and styles',
      category: 'quick_actions',
      pinnedOrder: 4,
    },
    
    // Moving previous items to new categories
    {
      id: 'view_website',
      title: 'View Website',
      icon: 'Globe',
      type: 'link',
      href: '/',
      description: 'Open your public website in a new tab',
      category: 'quick_actions',
      pinnedOrder: 5,
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: 'LayoutDashboard',
      type: 'link',
      href: '/admin/dashboard',
      description: 'View your site performance at a glance',
      category: 'manage_monitor',
      pinnedOrder: 1,
    },

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
          category: 'create_publish',
        },
        {
          id: 'create_page',
          title: 'Create New Page',
          icon: 'PlusCircle',
          type: 'link',
          href: '/page-builder/new',
          requiresStaff: true,
          category: 'create_publish',
        },
        {
          id: 'page_templates',
          title: 'Page Templates',
          icon: 'Layout',
          type: 'link',
          href: '/page-builder/templates',
          requiresStaff: true,
          category: 'create_publish',
        }
      ],
      requiresStaff: true,
      category: 'create_publish',
      pinnedOrder: 1,
    },
    {
      id: 'blog_content',
      title: 'Blog Content',
      icon: 'BookOpen',
      type: 'link',
      href: '/blog',
      requiresStaff: true,
      description: 'Create and manage blog posts',
      category: 'create_publish',
      pinnedOrder: 2,
    },
    {
      id: 'social_media_content',
      title: 'Social Media Content',
      icon: 'Share2',
      type: 'link',
      href: '/social-media',
      requiresStaff: true,
      description: 'Create social media posts',
      category: 'create_publish',
      pinnedOrder: 3,
    },
    {
      id: 'media_hub',
      title: 'Media Library',
      icon: 'FileImage',
      type: 'link',
      href: '/media',
      requiresStaff: true,
      description: 'Manage images, videos and documents',
      category: 'create_publish',
      pinnedOrder: 4,
    },
    // ANALYTICS & MANAGEMENT ITEMS
    // ========================
    {
      id: 'analytics_dashboard',
      title: 'Analytics',
      icon: 'LineChart',
      type: 'link',
      href: '/analytics',
      description: 'View website analytics and traffic',
      category: 'manage_monitor',
      pinnedOrder: 2,
    },
    {
      id: 'insights_dashboard',
      title: 'Insights Dashboard',
      icon: 'PieChart',
      type: 'link',
      href: '/admin/insights-dashboard',
      description: 'Get business insights and recommendations',
      category: 'manage_monitor',
      pinnedOrder: 3,
    },
    {
      id: 'system_health',
      title: 'System Health',
      icon: 'ActivitySquare',
      type: 'link',
      href: '/system-health',
      description: 'View system performance and alerts',
      category: 'manage_monitor',
      pinnedOrder: 4,
    },
    {
      id: 'forms_submissions',
      title: 'Form Submissions',
      icon: 'ClipboardCheck',
      type: 'link',
      href: '/form-submissions',
      description: 'Manage website form submissions',
      category: 'manage_monitor',
      pinnedOrder: 5,
    },
    
    // SETTINGS & ADVANCED
    // ===================
    {
      id: 'site_branding',
      title: 'Site Branding',
      icon: 'Palette',
      type: 'link',
      href: '/brand-center',
      requiresStaff: true,
      description: 'Manage site colors, logos, and brand identity',
      category: 'settings_advanced',
      pinnedOrder: 1,
    },
    {
      id: 'user_management',
      title: 'User Management',
      icon: 'Users',
      type: 'link',
      href: '/users',
      requiresStaff: true,
      description: 'Manage user accounts and permissions',
      category: 'settings_advanced',
      pinnedOrder: 2,
    },
    {
      id: 'companion_settings',
      title: 'Companion Settings',
      icon: 'MessageSquare',
      type: 'link',
      href: '/companion-settings',
      requiresStaff: true,
      description: 'Configure AI assistant behavior',
      category: 'settings_advanced',
      pinnedOrder: 3,
    },
    {
      id: 'admin_settings',
      title: 'Admin Settings',
      icon: 'Settings',
      type: 'link',
      href: '/admin/settings',
      requiresStaff: true,
      description: 'Advanced system configuration',
      category: 'settings_advanced',
      pinnedOrder: 4,
    },
    
    // BLOG AND SOCIAL MEDIA
    // ======================
    {
      id: 'blog_post_generator',
      title: 'Blog Post Generator',
      icon: 'BookOpen',
      type: 'link',
      href: '/tools/blog-post-generator',
      badge: { text: 'AI', variant: 'beta' },
      description: 'Generate blog content with AI',
      category: 'create_publish',
      pinnedOrder: 5,
    },
    {
      id: 'social_media_generator',
      title: 'Social Media Generator',
      icon: 'Share2',
      type: 'link',
      href: '/tools/social-media-generator',
      badge: { text: 'AI', variant: 'beta' },
      description: 'Create social media content with AI',
      category: 'create_publish',
      pinnedOrder: 6,
    },
    {
      id: 'homepage_setup',
      title: 'Homepage Builder',
      icon: 'Home',
      type: 'link',
      href: '/homepage-setup',
      requiresStaff: true,
      description: 'Configure your site homepage',
      category: 'create_publish',
      pinnedOrder: 7,
    },
    {
      id: 'foundation_pages',
      title: 'Foundation Pages',
      icon: 'Layout',
      type: 'link',
      href: '/foundation-pages',
      requiresStaff: true,
      description: 'Manage essential pages',
      category: 'create_publish',
      pinnedOrder: 8,
    },
    {
      id: 'launch_ready',
      title: 'Launch Checklist',
      icon: 'FastForward',
      type: 'link',
      href: '/launch-ready',
      requiresStaff: true,
      description: 'Prepare your site for launch',
      category: 'manage_monitor',
      pinnedOrder: 6,
    },
    
    // SEO & INTEGRATIONS
    // ===================
    {
      id: 'seo_settings',
      title: 'SEO Settings',
      icon: 'Search',
      type: 'link',
      href: '/seo',
      requiresStaff: true,
      description: 'Manage search engine optimization',
      category: 'settings_advanced',
      pinnedOrder: 5,
    },
    {
      id: 'integrations',
      title: 'Integrations',
      icon: 'Link',
      type: 'link',
      href: '/integrations',
      requiresStaff: true,
      description: 'Connect with third-party services',
      category: 'settings_advanced',
      pinnedOrder: 6,
    },
    
    // ADVANCED TOOLS
    // =============
    {
      id: 'client_registration',
      title: 'Client Registration',
      icon: 'UserPlus',
      type: 'link',
      href: '/client-registration',
      requiresStaff: true,
      description: 'Register and manage clients',
      category: 'settings_advanced',
      pinnedOrder: 7,
    },

    {
      id: 'insights_dashboard_updated',
      title: 'Business Insights',
      icon: 'TrendingUp',
      type: 'link',
      href: '/insights-dashboard',
      requiresStaff: true,
      description: 'Actionable business intelligence',
      category: 'manage_monitor',
      pinnedOrder: 7,
    },
    /* Removed CRM for Hetzner v1 deployment
    {
      id: 'crm',
      title: 'Client CRM',
      icon: 'Users',
      type: 'link',
      href: '/admin/crm',
      requiresStaff: true,
      description: 'Manage client relationships',
      badge: { text: 'Pro', variant: 'pro' },
      category: 'admin_tools',
    },
    */
    
    // WEBSITE SETTINGS
    // ==============
    {
      id: 'navigation_menus',
      title: 'Navigation Menus',
      icon: 'ListOrdered',
      type: 'link',
      href: '/admin/menu-management',
      requiresStaff: true,
      description: 'Configure site navigation',
      category: 'website_setup',
    },
    /* Removed SEO Settings for Hetzner v1 deployment
    {
      id: 'seo_manager',
      title: 'SEO Settings',
      icon: 'Search',
      type: 'link',
      href: '/admin/seo',
      requiresStaff: true,
      description: 'Optimize for search engines',
      category: 'website_setup',
    },
    */
    {
      id: 'domain_settings',
      title: 'Domain Settings',
      icon: 'Link',
      type: 'link',
      href: '/admin/domain-mapping',
      requiresStaff: true,
      description: 'Manage custom domains',
      badge: { text: 'New', variant: 'new' },
      category: 'website_setup',
    },
    
    // BRAND CENTER
    // ===========
    /* Removed Brand Guidelines for Hetzner v1 deployment
    {
      id: 'brand_guidelines',
      title: 'Brand Guidelines',
      icon: 'PaintBucket',
      type: 'link',
      href: '/brand-guidelines',
      requiresStaff: true,
      description: 'Define your brand identity',
      category: 'brand_center',
    },
    */
    {
      id: 'business_identity',
      title: 'Business Profile',
      icon: 'CircleUser',
      type: 'link',
      href: '/business-identity',
      requiresStaff: true,
      description: 'Your company information',
      category: 'brand_center',
    },
    {
      id: 'site_branding',
      title: 'Visual Branding',
      icon: 'Palette',
      type: 'link',
      href: '/admin/site-branding',
      requiresStaff: true,
      description: 'Logo, colors and visual elements',
      category: 'brand_center',
    },

    /* Temporarily removed Growth & Networking section for Hetzner deployment
    // GROWTH & NETWORKING
    // ==================
    {
      id: 'business_network',
      title: 'Business Network',
      icon: 'Network',
      type: 'link',
      href: '/business-network',
      description: 'Connect with other businesses',
      badge: { text: 'New', variant: 'new' },
      category: 'personal_growth',
    },
    {
      id: 'business_discover',
      title: 'Discover',
      icon: 'Globe',
      type: 'link',
      href: '/business-discover',
      description: 'Find new opportunities',
      badge: { text: 'New', variant: 'new' },
      category: 'personal_growth',
    },
    {
      id: 'entrepreneur_support',
      title: 'Entrepreneur Resources',
      icon: 'Lightbulb',
      type: 'link',
      href: '/entrepreneur-support',
      description: 'Tools to help your business grow',
      badge: { text: 'New', variant: 'new' },
      category: 'personal_growth',
    },
    */
    
    // SYSTEM & ADMINISTRATION
    // ======================
    /* Removed Account for Hetzner v1 deployment
    {
      id: 'account',
      title: 'My Account',
      icon: 'User',
      type: 'link',
      href: '/account',
      description: 'Manage your user account',
      category: 'system',
    },
    */
    {
      id: 'admin_settings',
      title: 'System Settings',
      icon: 'Settings',
      type: 'link',
      href: '/admin/settings',
      requiresStaff: true,
      description: 'Configure system preferences',
      category: 'system',
    },
    {
      id: 'ai_companion',
      title: 'AI Assistant Settings',
      icon: 'Bot',
      type: 'link',
      href: '/admin/companion-settings',
      requiresStaff: true,
      description: 'Configure AI behavior',
      category: 'system',
    },
    /* Removed Diagnostics for Hetzner v1 deployment
    {
      id: 'diagnostics_dashboard',
      title: 'System Health',
      icon: 'ActivitySquare',
      type: 'link',
      href: '/diagnostics',
      requiresStaff: true,
      requiresSuperAdmin: false,
      description: 'Monitor system performance',
      badge: { text: 'Admin', variant: 'pro' },
      category: 'system',
    },
    */
    /* Removed Site Inventory for Hetzner v1 deployment
    {
      id: 'site_inventory',
      title: 'Site Inventory',
      icon: 'ClipboardList',
      type: 'link',
      href: '/admin/site-inventory',
      requiresStaff: true,
      description: 'Snapshot of site content',
      badge: { text: 'New', variant: 'new' },
      category: 'system',
    },
    */
    /* Removed SOT Management for Hetzner v1 deployment
    {
      id: 'sot_management',
      title: 'Source of Truth',
      icon: 'Shield',
      type: 'link',
      href: '/admin/sot-management',
      requiresStaff: true,
      requiresSuperAdmin: true,
      description: 'System registry and core data',
      badge: { text: 'Admin', variant: 'pro' },
      category: 'system',
    },
    */
    /* Removed Blueprint Management for Hetzner v1 deployment
    {
      id: 'blueprint_management',
      title: 'Blueprint Management',
      icon: 'Cpu',
      type: 'link',
      href: '/admin/blueprint-management',
      requiresStaff: true,
      requiresSuperAdmin: true,
      description: 'Manage system blueprints',
      badge: { text: 'Admin', variant: 'pro' },
      category: 'system',
    },
    */
    /* Removed Clone Template for Hetzner v1 deployment
    {
      id: 'clone_template',
      title: 'Site Templates',
      icon: 'Copy',
      type: 'link',
      href: '/admin/clone-template',
      requiresStaff: true,
      requiresSuperAdmin: true,
      description: 'Template management',
      badge: { text: 'Admin', variant: 'pro' },
      category: 'system',
    },
    */
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