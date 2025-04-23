import { LockIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import LockedPageModal from "./LockedPageModal";

interface PageLockIndicatorProps {
  isLocked: boolean;
  origin: string;
  pageId: number;
  pageName: string;
}

export default function PageLockIndicator({ isLocked, origin, pageId, pageName }: PageLockIndicatorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isLocked) return null;

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="outline" className="bg-amber-50 text-amber-800 hover:bg-amber-100 border-amber-200">
          <LockIcon className="h-3 w-3 mr-1" /> Pro Design
        </Badge>
        <span className="text-sm text-muted-foreground">This page cannot be edited</span>
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-auto" 
          onClick={() => setIsModalOpen(true)}
        >
          Options
        </Button>
      </div>

      <LockedPageModal 
        isOpen={isModalOpen} 
        setIsOpen={setIsModalOpen}
        pageId={pageId}
        pageName={pageName}
      />
    </>
  );
}