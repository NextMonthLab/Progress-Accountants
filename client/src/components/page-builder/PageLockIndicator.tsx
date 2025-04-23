import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Lock, Copy, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';
import { toast } from '@/hooks/use-toast';
import LockedPageModal from './LockedPageModal';

interface PageLockIndicatorProps {
  isLocked: boolean;
  origin: 'builder' | 'template' | 'pro';
  pageId: number;
  pageName: string;
}

const PageLockIndicator: React.FC<PageLockIndicatorProps> = ({
  isLocked,
  origin,
  pageId,
  pageName
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Clone page mutation
  const cloneMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/page-builder/pages/${pageId}/clone`);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/page-builder/pages'] });
      
      toast({
        title: "Page cloned successfully",
        description: "You can now edit your copy of this template.",
        duration: 5000
      });
      
      // Navigate to the new page
      window.location.href = `/page-builder/${data.data.id}`;
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to clone page: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  });

  const handleClonePage = () => {
    cloneMutation.mutate();
  };

  const getOriginText = () => {
    switch (origin) {
      case 'template':
        return 'This is a template page';
      case 'pro':
        return 'This is a professional design';
      default:
        return 'This page is locked';
    }
  };

  return (
    <>
      <Alert className="mb-6 border-amber-500 bg-amber-50 dark:bg-amber-950/30">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-400">
          <Lock className="h-4 w-4" /> {getOriginText()}
        </AlertTitle>
        <AlertDescription className="text-amber-700 dark:text-amber-300 mt-2">
          <p className="mb-3">
            This page is locked and cannot be edited directly. To make changes, 
            you need to create an editable copy.
          </p>
          <div className="flex flex-wrap gap-3 mt-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white border-amber-500 text-amber-700 hover:bg-amber-50"
              onClick={handleClonePage}
              disabled={cloneMutation.isPending}
            >
              <Copy className="h-4 w-4 mr-2" />
              {cloneMutation.isPending ? "Creating Copy..." : "Create Editable Copy"}
            </Button>
            <Button
              variant="link"
              size="sm"
              className="text-amber-700 hover:text-amber-800"
              onClick={() => setIsModalOpen(true)}
            >
              Learn More
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      <LockedPageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        origin={origin}
        onClone={handleClonePage}
        isPending={cloneMutation.isPending}
      />
    </>
  );
};

export default PageLockIndicator;