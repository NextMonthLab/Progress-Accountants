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
  toggleMobileSidebar: () => void;
  toggleQuickSelect: () => void;
  toggleFocusedMode: () => void; // Toggle focused mode on/off
  getItemsForQuickSelect: () => NavigationItem[];
  getGroupItems: (groupId: string) => NavigationItem[];
  isLoading: boolean;
  isMobile: boolean;
}

const DEFAULT_NAVIGATION_STATE: NavigationState = {
  pinnedItems: [],
  expandedGroups: ['admin_tools', 'creator_tools'], // Default expanded groups
  expandedSubmenus: [],
  sidebarCollapsed: false,
  mobileSidebarCollapsed: true, // Default to collapsed on mobile
  quickSelectEnabled: true,
  focusedMode: false, // Default to normal mode (not focused)
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
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  // Check if we're on a mobile device
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

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

  const toggleMobileSidebar = () => {
    setNavigationState(prev => ({
      ...prev,
      mobileSidebarCollapsed: !prev.mobileSidebarCollapsed
    }));
  };

  const toggleQuickSelect = () => {
    setNavigationState(prev => ({
      ...prev,
      quickSelectEnabled: !prev.quickSelectEnabled
    }));
  };
  
  const toggleFocusedMode = () => {
    setNavigationState(prev => {
      const newState = {
        ...prev,
        focusedMode: !prev.focusedMode
      };
      console.log("NavigationContext: Toggling focused mode. Current:", prev.focusedMode, "New:", newState.focusedMode);
      
      // Force update localStorage
      try {
        window.localStorage.setItem('navigation_state', JSON.stringify(newState));
      } catch (error) {
        console.error("Failed to update localStorage:", error);
      }
      
      return newState;
    });
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
        toggleMobileSidebar,
        toggleQuickSelect,
        toggleFocusedMode,
        getItemsForQuickSelect,
        getGroupItems,
        isLoading,
        isMobile
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