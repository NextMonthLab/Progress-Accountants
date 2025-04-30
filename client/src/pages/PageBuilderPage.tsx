import React, { useEffect } from "react";
import DynamicSidebar from "@/components/navigation/DynamicSidebar";
import { NavigationProvider } from "@/contexts/NavigationContext";
import PageBuilderContent from "@/components/page-builder/PageBuilderContent";
import { useParams, useLocation } from "wouter";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

// Render directly without additional layouts 
const PageBuilderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNewPage = id === "new";
  const [, navigate] = useLocation();

  // Debug API call status
  useEffect(() => {
    if (!isNewPage) {
      const pageId = parseInt(id);
      console.log("Attempting to fetch page with ID:", pageId);
      
      fetch(`/api/page-builder/pages/${pageId}`)
        .then((res) => {
          console.log("API Response status:", res.status);
          return res.json().then(data => {
            console.log("API Response data:", data);
            return data;
          }).catch(err => {
            console.error("Error parsing JSON:", err);
            throw err;
          });
        })
        .catch((err) => {
          console.error("Error fetching page:", err);
        });
    }
  }, [id, isNewPage]);

  // For new page, double check the API status
  useEffect(() => {
    if (isNewPage) {
      fetch('/api/page-builder/status')
        .then(res => {
          console.log("Page builder status check response:", res.status);
          return res.json();
        })
        .then(data => {
          console.log("Page builder status data:", data);
        })
        .catch(err => {
          console.error("Error checking page builder status:", err);
        });
    }
  }, [isNewPage]);

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