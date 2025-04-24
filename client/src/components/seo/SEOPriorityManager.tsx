import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, GripVertical, ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Import drag-and-drop library components
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type SeoConfig = {
  id: number;
  title: string;
  routePath: string;
  priority: number | null;
  indexable: boolean;
};

type SortableItemProps = {
  config: SeoConfig;
  index: number;
  totalItems: number;
};

// Individual sortable item component
function SortableItem({ config, index, totalItems }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: config.id });

  // Calculate normalized priority for visual display
  const priorityValue = config.priority !== null ? config.priority : 0.5;

  // Determine badge color based on priority
  let badgeVariant: 
    | "default"
    | "destructive"
    | "outline"
    | "secondary" = "default";

  if (priorityValue >= 0.8) {
    badgeVariant = "default"; // Highest priority
  } else if (priorityValue >= 0.5) {
    badgeVariant = "default"; // Medium-high priority
  } else if (priorityValue >= 0.3) {
    badgeVariant = "secondary"; // Medium-low priority
  } else {
    badgeVariant = "outline"; // Lowest priority
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Determine if this is a high priority item (top 3)
  const isHighPriority = index < 3;
  
  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`flex items-center justify-between p-3 border rounded-md mb-2 group hover:border-primary/50 transition-colors ${
        isHighPriority ? 'bg-primary/5 border-primary/20' : 'bg-white'
      }`}
    >
      <div className="flex items-center gap-3 flex-1 overflow-hidden">
        <div
          {...attributes}
          {...listeners}
          className="flex items-center justify-center p-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 touch-manipulation"
        >
          <GripVertical size={20} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={`font-medium text-sm truncate ${isHighPriority ? 'text-primary' : ''}`}>
            {config.title}
          </h4>
          <p className="text-xs text-muted-foreground truncate">{config.routePath}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Badge variant={badgeVariant}>
          {index === 0 ? "Top" : index === totalItems - 1 ? "Last" : `#${index + 1}`}
        </Badge>
        <div className="text-xs text-muted-foreground w-14 text-right">
          Priority: {priorityValue.toFixed(1)}
        </div>
      </div>
    </div>
  );
}

type SEOPriorityManagerProps = {
  isOpen: boolean;
  onClose: () => void;
  configs: SeoConfig[];
};

export function SEOPriorityManager({ isOpen, onClose, configs }: SEOPriorityManagerProps) {
  const queryClient = useQueryClient();
  
  // Initial sort by priority
  const [items, setItems] = useState(() => {
    return [...configs].sort((a, b) => {
      // Handle null priorities (place at end)
      const priorityA = a.priority ?? 0;
      const priorityB = b.priority ?? 0;
      return priorityB - priorityA; // Higher priority first
    });
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handler for drag end
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  // Move an item up in priority
  const moveUp = (id: number) => {
    setItems((items) => {
      const index = items.findIndex((item) => item.id === id);
      if (index <= 0) return items; // Already at the top
      
      return arrayMove(items, index, index - 1);
    });
  };

  // Move an item down in priority
  const moveDown = (id: number) => {
    setItems((items) => {
      const index = items.findIndex((item) => item.id === id);
      if (index === -1 || index >= items.length - 1) return items; // Already at the bottom
      
      return arrayMove(items, index, index + 1);
    });
  };

  // Calculate new priority values based on position
  const calculatePriorities = () => {
    const totalItems = items.length;
    
    // If there are no items, return an empty array
    if (totalItems === 0) return [];
    
    // Calculate a linear scale for priorities based on position
    return items.map((item, index) => {
      // Higher index means lower priority (we want higher priority at the top)
      // Priority ranges from 1.0 (highest) to 0.1 (lowest) spread across all items
      const priority = index === 0 
        ? 1.0 // Top item is always 1.0
        : index === totalItems - 1
          ? 0.1 // Bottom item is always 0.1
          : 1.0 - (index / (totalItems - 1)) * 0.9; // Linear scale between 1.0 and 0.1
      
      return {
        id: item.id,
        priority: Number(priority.toFixed(1))
      };
    });
  };

  // Save priorities mutation
  const savePrioritiesMutation = useMutation({
    mutationFn: async (priorities: { id: number; priority: number }[]) => {
      const response = await fetch('/api/seo/configs/batch-update-priority', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priorities })
      });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate queries to refetch SEO data
      queryClient.invalidateQueries({ queryKey: ['/api/seo/configs'] });
      
      toast({
        title: "Priorities Updated",
        description: "Page priorities have been successfully updated.",
      });
      
      onClose();
    },
    onError: (error) => {
      console.error('Failed to update priorities:', error);
      toast({
        title: "Failed to Update Priorities",
        description: "There was an error updating the page priorities. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Handle saving priorities
  const handleSave = async () => {
    setIsSubmitting(true);
    
    try {
      const priorities = calculatePriorities();
      await savePrioritiesMutation.mutateAsync(priorities);
    } catch (error) {
      console.error('Error saving priorities:', error);
      // Error is handled by the mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Manage Page Priorities</DialogTitle>
          <DialogDescription>
            Drag and drop pages to set their relative importance for search engines.
            Higher items have higher priority in sitemaps and search results.
          </DialogDescription>
          
          <div className="bg-blue-50 text-blue-700 rounded-md p-3 text-sm mt-2">
            <h3 className="font-medium mb-1">How priorities work:</h3>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Pages at the top have higher priority (1.0) in search engines</li>
              <li>Pages at the bottom have lower priority (0.1)</li>
              <li>The top 3 pages are highlighted as high-priority</li>
              <li>Drag items up and down to change their priority</li>
            </ul>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 min-h-[300px]">
          {items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No SEO configurations found. Create some configurations first.
            </div>
          ) : (
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={items.map(item => item.id)}
                strategy={verticalListSortingStrategy}
              >
                {items.map((config, index) => (
                  <SortableItem 
                    key={config.id} 
                    config={config} 
                    index={index}
                    totalItems={items.length}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>

        <DialogFooter className="pt-2">
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleSave} 
              disabled={isSubmitting || items.length === 0}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Priorities
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}