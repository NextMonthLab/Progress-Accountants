import { ReactNode } from "react";
import SimpleSidebar from "@/components/navigation/SimpleSidebar";
import SmartContextBanner from "@/components/SmartContextBanner";

interface AdminLayoutProps {
  children: ReactNode;
  useNewNavigation?: boolean;
}

export default function AdminLayout({ children, useNewNavigation = true }: AdminLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Use Simple Sidebar for now to ensure functionality */}
      <SimpleSidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        <SmartContextBanner />
        
        <main className="flex-1 px-6">
          {children}
        </main>
        
        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 mt-auto">
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
    </div>
  );
}