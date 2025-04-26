import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  NavigationState, 
  NavigationItem, 
  NavigationGroup,
  DEFAULT_NAVIGATION_GROUPS
} from '@/types/navigation';
import { fetchNavigationData } from '@/lib/navigation-service';

interface NavigationContextType {
  navigationItems: NavigationItem[];
  navigationGroups: NavigationGroup[];
  navigationState: NavigationState;
  setNavigationState: React.Dispatch<React.SetStateAction<NavigationState>>;
  addPinnedItem: (itemId: string) => void;
  removePinnedItem: (itemId: string) => void;
  toggleGroup: (groupId: string) => void;
  toggleSubmenu: (submenuId: string) => void;
  toggleSidebar: () => void;
  toggleQuickSelect: () => void;
  getItemsForQuickSelect: () => NavigationItem[];
  getGroupItems: (groupId: string) => NavigationItem[];
  isLoading: boolean;
}

const DEFAULT_NAVIGATION_STATE: NavigationState = {
  pinnedItems: [],
  expandedGroups: ['admin_tools', 'creator_tools'], // Default expanded groups
  expandedSubmenus: [],
  sidebarCollapsed: false,
  quickSelectEnabled: true,
};

const NavigationContext = createContext<NavigationContextType | null>(null);

// Simple local storage hook
const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const [navigationGroups, setNavigationGroups] = useState<NavigationGroup[]>(DEFAULT_NAVIGATION_GROUPS);
  const [navigationState, setNavigationState] = useLocalStorage<NavigationState>(
    'navigation_state',
    DEFAULT_NAVIGATION_STATE
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNavigationData = async () => {
      setIsLoading(true);
      try {
        // Fetch navigation items from our service
        const items = await fetchNavigationData();
        setNavigationItems(items);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading navigation items:', error);
        setIsLoading(false);
      }
    };

    loadNavigationData();
  }, []);

  const addPinnedItem = (itemId: string) => {
    setNavigationState(prev => ({
      ...prev,
      pinnedItems: [...prev.pinnedItems, itemId]
    }));
  };

  const removePinnedItem = (itemId: string) => {
    setNavigationState(prev => ({
      ...prev,
      pinnedItems: prev.pinnedItems.filter(id => id !== itemId)
    }));
  };

  const toggleGroup = (groupId: string) => {
    setNavigationState(prev => ({
      ...prev,
      expandedGroups: prev.expandedGroups.includes(groupId)
        ? prev.expandedGroups.filter(id => id !== groupId)
        : [...prev.expandedGroups, groupId]
    }));
  };

  const toggleSubmenu = (submenuId: string) => {
    setNavigationState(prev => ({
      ...prev,
      expandedSubmenus: prev.expandedSubmenus.includes(submenuId)
        ? prev.expandedSubmenus.filter(id => id !== submenuId)
        : [...prev.expandedSubmenus, submenuId]
    }));
  };

  const toggleSidebar = () => {
    setNavigationState(prev => ({
      ...prev,
      sidebarCollapsed: !prev.sidebarCollapsed
    }));
  };

  const toggleQuickSelect = () => {
    setNavigationState(prev => ({
      ...prev,
      quickSelectEnabled: !prev.quickSelectEnabled
    }));
  };

  const getItemsForQuickSelect = (): NavigationItem[] => {
    return navigationItems.filter(item => 
      navigationState.pinnedItems.includes(item.id)
    ).sort((a, b) => {
      // Sort by pinnedOrder if available, otherwise by title
      if (a.pinnedOrder !== undefined && b.pinnedOrder !== undefined) {
        return a.pinnedOrder - b.pinnedOrder;
      }
      return a.title.localeCompare(b.title);
    });
  };

  const getGroupItems = (groupId: string): NavigationItem[] => {
    // Find the matching group
    const group = navigationGroups.find(g => g.id === groupId);
    if (!group) return [];
    
    // Return items that match the group's category
    return navigationItems.filter(item => item.category === group.category);
  };

  return (
    <NavigationContext.Provider
      value={{
        navigationItems,
        navigationGroups,
        navigationState,
        setNavigationState,
        addPinnedItem,
        removePinnedItem,
        toggleGroup,
        toggleSubmenu,
        toggleSidebar,
        toggleQuickSelect,
        getItemsForQuickSelect,
        getGroupItems,
        isLoading
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};