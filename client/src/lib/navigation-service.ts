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
      id: 'dashboard',
      title: 'Main Dashboard',
      icon: 'LayoutDashboard',
      type: 'link',
      href: '/admin/dashboard',
      description: 'View your site performance at a glance',
      category: 'quick_actions',
      pinnedOrder: 1,
    },
    {
      id: 'view_insights',
      title: 'Insights Dashboard',
      icon: 'BarChart2',
      type: 'link',
      href: '/admin/insights-dashboard',
      description: 'View client feedback and content insights',
      category: 'quick_actions',
      pinnedOrder: 2,
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
      pinnedOrder: 3,
    },

    // Removed page builder navigation (front-end editing)
    {
      id: 'blog_post_generator',
      title: 'Blog Post Generator',
      icon: 'BookOpen',
      type: 'link',
      href: '/admin/blog-post-generator',
      requiresStaff: true,
      description: 'Generate blog posts with AI',
      category: 'create_publish',
      pinnedOrder: 2,
    },
    {
      id: 'social_media_generator',
      title: 'Social Media Generator',
      icon: 'Share2',
      type: 'link',
      href: '/admin/content/social-posts',
      requiresStaff: true,
      description: 'Generate social media posts with AI',
      category: 'create_publish',
      pinnedOrder: 3,
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
    /* Removed duplicate Insights Dashboard entry - using only the Quick Actions version */

    
    // SETTINGS & ADVANCED
    // ===================

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
      id: 'ai_assistant_settings',
      title: 'AI Assistant Settings',
      icon: 'Bot',
      type: 'link',
      href: '/admin/ai-assistant-settings',
      requiresStaff: true,
      description: 'Configure AI assistant for website frontend and backend',
      category: 'settings_advanced',
      pinnedOrder: 3,
    },

    



    
    // SEO & INTEGRATIONS
    // ===================

    
    // ADVANCED TOOLS
    // =============

    /* Removed third duplicate Insights Dashboard entry - using only the Quick Actions version */
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
      title: 'Business DNA',
      icon: 'CircleUser',
      type: 'link',
      href: '/business-identity',
      requiresStaff: true,
      description: 'Your company information',
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