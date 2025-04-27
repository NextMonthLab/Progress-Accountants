export type NavigationItemType = 'link' | 'submenu';
export type NavigationItemCategory = 
  | 'creator_tools' 
  | 'admin_tools' 
  | 'page_builders' 
  | 'personal_growth' 
  | 'marketplace' 
  | 'system'
  | 'brand_center'
  | 'website_setup'
  | 'uncategorized';

export type NavigationGroup = {
  id: string;
  title: string;
  icon: string;
  category: NavigationItemCategory;
};

export type NavigationItemBadge = {
  text: string;
  variant?: 'default' | 'new' | 'updated' | 'beta' | 'pro';
};

export interface BaseNavigationItem {
  id: string;
  title: string;
  icon: string;
  type: NavigationItemType;
  badge?: NavigationItemBadge;
  isNew?: boolean;
  description?: string;
  requiresStaff?: boolean;
  requiresSuperAdmin?: boolean; // Only show to super admins
  category: NavigationItemCategory;
  pinnedOrder?: number; // For Quick Select menu
}

export interface NavigationLink extends BaseNavigationItem {
  type: 'link';
  href: string;
}

export interface NavigationSubmenu extends BaseNavigationItem {
  type: 'submenu';
  items: NavigationLink[];
}

export type NavigationItem = NavigationLink | NavigationSubmenu;

export interface NavigationState {
  pinnedItems: string[]; // IDs of pinned items for Quick Select
  expandedGroups: string[]; // IDs of expanded groups in sidebar
  expandedSubmenus: string[]; // IDs of expanded submenus
  sidebarCollapsed: boolean;
  quickSelectEnabled: boolean;
}

// Default navigation groups
export const DEFAULT_NAVIGATION_GROUPS: NavigationGroup[] = [
  {
    id: 'creator_tools',
    title: 'Creator Tools',
    icon: 'Sparkles',
    category: 'creator_tools',
  },
  {
    id: 'admin_tools',
    title: 'Command Center',
    icon: 'Gauge',
    category: 'admin_tools',
  },
  {
    id: 'page_builders',
    title: 'Page Builders',
    icon: 'SquarePen',
    category: 'page_builders',
  },
  {
    id: 'personal_growth',
    title: 'Personal Growth',
    icon: 'TrendingUp',
    category: 'personal_growth',
  },
  {
    id: 'marketplace',
    title: 'Marketplace',
    icon: 'ShoppingCart',
    category: 'marketplace',
  },
  {
    id: 'brand_center',
    title: 'Brand Center',
    icon: 'Palette',
    category: 'brand_center',
  },
  {
    id: 'website_setup',
    title: 'Website Setup',
    icon: 'Globe',
    category: 'website_setup',
  },
  {
    id: 'system',
    title: 'System',
    icon: 'Settings',
    category: 'system',
  }
];