// Navigation Menu Types

export interface MenuItem {
  id: number;
  label: string;
  url: string;
  parentId: number | null;
  order: number;
  icon?: string;
  isExternal: boolean;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface MenuGroup {
  id: number;
  label: string;
  items: MenuItem[];
}

export interface NavigationMenu {
  id: number;
  name: string;
  location: 'header' | 'footer' | 'sidebar';
  items: MenuItem[];
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}