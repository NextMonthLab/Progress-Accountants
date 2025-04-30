import React, { useEffect, useState, useMemo } from "react";
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
  const [isStatusOk, setIsStatusOk] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  // Validate ID parameter to prevent NaN issues
  const validId = useMemo(() => {
    if (isNewPage) return null;
    
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      console.error("Invalid page ID (NaN):", id);
      return null;
    }
    
    return parsedId;
  }, [id, isNewPage]);

  // Check if page builder is initialized
  useEffect(() => {
    fetch('/api/page-builder/status')
      .then(res => {
        console.log("Page builder status check response:", res.status);
        if (!res.ok) {
          setIsStatusOk(false);
          setStatusError(`Status check failed with status: ${res.status}`);
          throw new Error(`Status check failed with status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("Page builder status data:", data);
        setIsStatusOk(data.initialized);
        if (!data.initialized) {
          setStatusError("Page builder is not initialized");
        }
      })
      .catch(err => {
        console.error("Error checking page builder status:", err);
        setIsStatusOk(false);
        setStatusError(err.message);
      });
  }, []);

  // Debug API call status for existing pages
  useEffect(() => {
    if (!isNewPage && validId) {
      console.log("Attempting to fetch page with ID:", validId);
      
      fetch(`/api/page-builder/pages/${validId}`)
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
  }, [validId, isNewPage]);
  
  // Show error if invalid ID
  if (!isNewPage && validId === null) {
    return (
      <div className="p-8">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Invalid Page ID
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>The page ID "{id}" is invalid. Please select a valid page.</p>
            <Button 
              className="mt-4" 
              variant="outline" 
              onClick={() => navigate("/page-builder")}
            >
              Back to Pages
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Show error if page builder not initialized
  if (!isStatusOk && statusError) {
    return (
      <div className="p-8">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Page Builder Not Ready
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>The page builder system is not properly initialized: {statusError}</p>
            <Button 
              className="mt-4" 
              variant="outline" 
              onClick={() => navigate("/page-builder")}
            >
              Go to Page Builder
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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