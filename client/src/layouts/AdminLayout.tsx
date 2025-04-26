import { ReactNode } from "react";
import AdminSidebar from "@/components/AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  console.log("AdminLayout rendered with children:", children ? "has children" : "no children");
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Admin Sidebar */}
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
    </div>
  );
}