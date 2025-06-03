import { ReactNode, lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import DynamicSidebar from "@/components/navigation/DynamicSidebar";
import MobileSidebarToggle from "@/components/navigation/MobileSidebarToggle";
import MobileOverlay from "@/components/navigation/MobileOverlay";
import SmartContextBanner from "@/components/SmartContextBanner";
import { NavigationProvider } from "@/contexts/NavigationContext";

// Lazy load non-critical components
const QuickSelectMenu = lazy(() => import("@/components/navigation/QuickSelectMenu"));
const SmartCommandBar = lazy(() => import("@/components/SmartCommandBar"));

interface AdminLayoutProps {
  children: ReactNode;
  useNewNavigation?: boolean;
}

export default function AdminLayout({ children, useNewNavigation = true }: AdminLayoutProps) {
  // We're now using the new navigation system by default
  const SidebarComponent = useNewNavigation ? DynamicSidebar : AdminSidebar;

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-900">
      {useNewNavigation ? (
        <NavigationProvider>
          {/* New Dynamic Sidebar */}
          <DynamicSidebar />

          {/* Mobile Sidebar Toggle - only visible when sidebar is collapsed on mobile */}
          <MobileSidebarToggle />

          {/* Mobile Overlay - only visible when mobile sidebar is open */}
          <MobileOverlay />

          {/* Main Content with Smart Context Banner */}
          <div className="flex-1 overflow-y-auto flex flex-col bg-white dark:bg-gray-900">
            {/* Smart Context Banner - shows intelligent awareness */}
            <SmartContextBanner />

            <main className="flex-1 px-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
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
                  src="/assets/logos/progress-logo.png" 
                  alt="Progress Accountants Logo" 
                  className="h-[3.75rem]"
                />
              </a>
            </div>

            {/* Quick Select Menu - floating UI */}
            <Suspense fallback={null}>
              <QuickSelectMenu />
            </Suspense>

            {/* Smart Command Bar - intelligent command interface */}
            <Suspense fallback={null}>
              <SmartCommandBar />
            </Suspense>
          </div>
        </NavigationProvider>
      ) : (
        <>
          {/* Current Admin Sidebar */}
          <AdminSidebar />

          {/* Main Content with Smart Context Banner */}
          <div className="flex-1 overflow-y-auto flex flex-col bg-white dark:bg-gray-900">
            {/* Smart Context Banner - shows intelligent awareness */}
            <SmartContextBanner />

            <main className="flex-1 px-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
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
                  src="/assets/logos/progress-logo.png" 
                  alt="Progress Accountants Logo" 
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