import React from "react";
import DynamicSidebar from "@/components/navigation/DynamicSidebar";
import { NavigationProvider } from "@/contexts/NavigationContext";
import PageBuilderContent from "@/components/page-builder/PageBuilderContent";

// Render directly without additional layouts 
const PageBuilderPage: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <NavigationProvider>
        <DynamicSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto">
            <PageBuilderContent />
          </div>
        </div>
      </NavigationProvider>
    </div>
  );
};

export default PageBuilderPage;