import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useNavigate } from "wouter";

interface LockedPageModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  pageId: number;
  pageName: string;
}

export default function LockedPageModal({ isOpen, setIsOpen, pageId, pageName }: LockedPageModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Mutation for cloning a locked page to an editable one
  const clonePageMutation = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      const res = await apiRequest("POST", `/api/page-builder/pages/${pageId}/clone`, {});
      return await res.json();
    },
    onSuccess: (data) => {
      setIsLoading(false);
      toast({
        title: "Page cloned successfully",
        description: "You can now edit this new copy of the page.",
        variant: "default"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/page-builder/pages"] });
      navigate(`/page-builder/edit/${data.id}`);
    },
    onError: (error: any) => {
      setIsLoading(false);
      toast({
        title: "Failed to clone page",
        description: error.message || "An error occurred while cloning the page.",
        variant: "destructive"
      });
    }
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center mb-2">
            <span className="bg-amber-100 text-amber-800 font-medium text-xs py-1 px-2 rounded mr-2">PRO DESIGN</span>
            <AlertDialogTitle>Professional Design - Not Editable</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            <p className="mb-4">
              This page was custom-built by our design team and can't be edited directly in the builder. 
            </p>
            <p className="mb-4 text-sm font-medium">
              "{pageName}" is part of your professional starter package.
            </p>
            <div className="border-t border-b border-border py-3 my-4">
              <h4 className="font-medium mb-2">Options:</h4>
              <ul className="list-disc pl-5 text-sm space-y-1.5">
                <li>View this page but keep it as-is</li>
                <li>Create an editable copy in the page builder</li>
                <li>Request a custom layout from our team</li>
              </ul>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>View Only</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              clonePageMutation.mutate();
            }}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? "Creating..." : "Create Editable Copy"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}