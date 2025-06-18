import { Button } from "@/components/ui/button";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function AdminBackupButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const triggerBackup = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/admin/backup");
      const data = await response.json();
      
      toast({
        title: "Backup initiated",
        description: data.message,
        variant: "default",
      });
    } catch (error) {
      console.error("Backup error:", error);
      toast({
        title: "Backup failed",
        description: error instanceof Error ? error.message : "An error occurred while initiating backup",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={triggerBackup} 
      disabled={isLoading} 
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Backing up...
        </>
      ) : (
        "Trigger Backup"
      )}
    </Button>
  );
}