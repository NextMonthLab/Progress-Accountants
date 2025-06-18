import React from 'react';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigation } from '@/contexts/NavigationContext';

const MobileSidebarToggle: React.FC = () => {
  const { isMobile, navigationState, toggleMobileSidebar } = useNavigation();
  const { mobileSidebarCollapsed } = navigationState;

  // Only show this component on mobile devices when sidebar is collapsed
  if (!isMobile || !mobileSidebarCollapsed) {
    return null;
  }

  return (
    <button
      onClick={toggleMobileSidebar}
      className={cn(
        "fixed left-4 top-4 z-30",
        "p-2 rounded-full bg-white border border-gray-200 shadow-md",
        "text-gray-700 hover:text-[var(--orange)] hover:border-[var(--orange)]",
        "transition-all duration-150"
      )}
      aria-label="Open menu"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
};

export default MobileSidebarToggle;