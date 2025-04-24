import { useState, useEffect } from 'react';
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAllSeoConfigs, updateSeoConfigPriorities } from '@/lib/api';
import { GripVertical, RefreshCw, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

// Type for SEO Config items
type SEOConfigItem = {
  id: number;
  routePath: string;
  title: string;
  priority: number | null;
  changeFrequency: string | null;
};

// Sortable item component with drag handle
function SortableItem({ id, routePath, title, priority }: SEOConfigItem) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="bg-white dark:bg-gray-800 rounded-lg border p-3 mb-2 flex items-center gap-2"
    >
      <div 
        {...attributes} 
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
      >
        <GripVertical size={16} />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{routePath}</div>
      </div>
      <Badge variant={getPriorityBadgeVariant(priority)}>
        {formatPriority(priority)}
      </Badge>
    </div>
  );
}

// Helper functions for display
function formatPriority(priority: number | null): string {
  if (priority === null) return 'Not set';
  return priority.toString();
}

function getPriorityBadgeVariant(priority: number | null): "default" | "secondary" | "destructive" | "outline" {
  if (priority === null) return "outline";
  if (priority >= 0.8) return "default";
  if (priority >= 0.5) return "secondary";
  return "outline";
}

export default function SEOPriorityManager({ onClose }: { onClose: () => void }) {
  const [configs, setConfigs] = useState<SEOConfigItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load SEO configs on mount
  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    setLoading(true);
    try {
      const data = await fetchAllSeoConfigs();
      
      // Sort by priority (highest first) then by path
      const sortedData = [...data].sort((a, b) => {
        if (a.priority === null && b.priority === null) return a.routePath.localeCompare(b.routePath);
        if (a.priority === null) return 1;
        if (b.priority === null) return -1;
        return b.priority - a.priority;
      });
      
      setConfigs(sortedData);
    } catch (error) {
      console.error('Failed to load SEO configs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load SEO configurations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      return;
    }

    setConfigs((configs) => {
      const oldIndex = configs.findIndex((config) => config.id === active.id);
      const newIndex = configs.findIndex((config) => config.id === over.id);
      
      return arrayMove(configs, oldIndex, newIndex);
    });
  };

  const savePriorities = async () => {
    setSaving(true);
    try {
      // Assign priorities based on position - higher items get higher priority
      const totalItems = configs.length;
      const priorities = configs.map((config, index) => {
        // Calculate priority: 1.0 for first item, decreasing by 0.1 down to 0.1
        // Ensure no priority goes below 0.1 or above 1.0
        const calculatedPriority = Math.max(0.1, Math.min(1.0, 1.0 - (index * (0.9 / (totalItems - 1 || 1)))));
        // Round to one decimal place
        const priority = Math.round(calculatedPriority * 10) / 10;
        
        return {
          id: config.id,
          priority
        };
      });
      
      await updateSeoConfigPriorities(priorities);
      
      toast({
        title: 'Success',
        description: 'Page priorities have been updated',
        variant: 'default',
      });
      
      loadConfigs(); // Reload to show updated values
    } catch (error) {
      console.error('Failed to save priorities:', error);
      toast({
        title: 'Error',
        description: 'Failed to update page priorities',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Manage Page Priorities</CardTitle>
        <CardDescription>
          Drag and drop pages to set their relative importance. Pages at the top will have higher priority.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : configs.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No SEO configurations found
          </div>
        ) : (
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={configs.map(c => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="max-h-[400px] overflow-y-auto">
                {configs.map((config) => (
                  <SortableItem key={config.id} {...config} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CardContent>
      
      <CardFooter className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={savePriorities} disabled={saving || loading || configs.length === 0}>
          {saving && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          Save Priorities
        </Button>
      </CardFooter>
    </Card>
  );
}