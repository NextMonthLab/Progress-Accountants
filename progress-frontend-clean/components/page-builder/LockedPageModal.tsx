import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Lock, Lightbulb, Layers, PencilRuler, Paintbrush } from 'lucide-react';

interface LockedPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  origin: 'builder' | 'template' | 'pro';
  onClone: () => void;
  isPending: boolean;
}

const LockedPageModal: React.FC<LockedPageModalProps> = ({
  isOpen,
  onClose,
  origin,
  onClone,
  isPending
}) => {
  const getTitle = () => {
    switch (origin) {
      case 'template':
        return 'About Templates';
      case 'pro':
        return 'About Professional Designs';
      default:
        return 'About Locked Pages';
    }
  };

  const getDescription = () => {
    switch (origin) {
      case 'template':
        return 'Templates provide a starting point for your pages.';
      case 'pro':
        return 'Professional designs are expertly crafted pages included with the Pro tier.';
      default:
        return 'This page has been locked to preserve its design.';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-amber-500" /> {getTitle()}
          </DialogTitle>
          <DialogDescription>
            {getDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <h3 className="text-lg font-medium mb-3">About {origin === 'pro' ? 'Professional Designs' : 'Templates'}</h3>
          
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="mt-0.5">
                <PencilRuler className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Expertly Designed</h4>
                <p className="text-sm text-muted-foreground">
                  {origin === 'pro' 
                    ? 'Our professional designs are created by experienced designers following best practices.'
                    : 'Templates are designed to provide a solid foundation for your pages.'}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="mt-0.5">
                <Layers className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Optimized Structure</h4>
                <p className="text-sm text-muted-foreground">
                  The layout is structured for optimal user experience and SEO performance.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="mt-0.5">
                <Paintbrush className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Customizable Copies</h4>
                <p className="text-sm text-muted-foreground">
                  Create a copy to customize the design while maintaining the original template.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="mt-0.5">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Recommended Approach</h4>
                <p className="text-sm text-muted-foreground">
                  We recommend creating a copy rather than building from scratch to maintain design quality.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onClone} disabled={isPending}>
            <Copy className="h-4 w-4 mr-2" />
            {isPending ? "Creating Copy..." : "Create Editable Copy"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LockedPageModal;