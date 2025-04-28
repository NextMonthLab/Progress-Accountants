import React from 'react';
import { useNavigation } from '@/contexts/NavigationContext';
import { cn } from '@/lib/utils';

const MobileOverlay: React.FC = () => {
  const { isMobile, navigationState, toggleMobileSidebar } = useNavigation();
  const { mobileSidebarCollapsed } = navigationState;

  // Only show overlay on mobile when sidebar is expanded
  if (!isMobile || mobileSidebarCollapsed) {
    return null;
  }

  return (
    <div 
      className={cn(
        "fixed inset-0 bg-black/30 z-40 transition-opacity duration-300",
        mobileSidebarCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
      )}
      onClick={toggleMobileSidebar}
      aria-label="Close mobile menu"
      role="button"
      tabIndex={0}
    />
  );
};

export default MobileOverlay;