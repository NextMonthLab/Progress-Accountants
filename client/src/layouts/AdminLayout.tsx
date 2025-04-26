import { ReactNode } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import DynamicSidebar from "@/components/navigation/DynamicSidebar";
import QuickSelectMenu from "@/components/navigation/QuickSelectMenu";
import { NavigationProvider } from "@/contexts/NavigationContext";

interface AdminLayoutProps {
  children: ReactNode;
  useNewNavigation?: boolean;
}

export default function AdminLayout({ children, useNewNavigation = true }: AdminLayoutProps) {
  // We're now using the new navigation system by default
  const Sidebar = useNewNavigation ? DynamicSidebar : AdminSidebar;
  
  return (
    <div className="flex h-screen overflow-hidden">
      {useNewNavigation ? (
        <NavigationProvider>
          {/* New Dynamic Sidebar */}
          <DynamicSidebar />
          
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto flex flex-col">
            <main className="flex-1 px-6">
              {children}
            </main>
            
            {/* Powered by NextMonth footer */}
            <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-800 mt-auto">
              <a 
                href="https://nextmonth.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity"
              >
                <span className="text-xs text-muted-foreground">Powered by</span>
                <img 
                  src="https://res.cloudinary.com/drl0fxrkq/image/upload/v1744814862/New_Logo_wwntva.png" 
                  alt="NextMonth Logo" 
                  className="h-[3.75rem]"
                />
              </a>
            </div>
            
            {/* Quick Select Menu - floating UI */}
            <QuickSelectMenu />
          </div>
        </NavigationProvider>
      ) : (
        <>
          {/* Current Admin Sidebar */}
          <AdminSidebar />
          
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto flex flex-col">
            <main className="flex-1 px-6">
              {children}
            </main>
            
            {/* Powered by NextMonth footer */}
            <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-800 mt-auto">
              <a 
                href="https://nextmonth.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity"
              >
                <span className="text-xs text-muted-foreground">Powered by</span>
                <img 
                  src="https://res.cloudinary.com/drl0fxrkq/image/upload/v1744814862/New_Logo_wwntva.png" 
                  alt="NextMonth Logo" 
                  className="h-[3.75rem]"
                />
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}