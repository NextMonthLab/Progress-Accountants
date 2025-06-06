import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useNavigation } from '@/contexts/NavigationContext';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import {
  Plus,
  X,
  Pin,
  PinOff,
  MoreVertical,
  ChevronUp,
  ChevronDown,
  Menu as MenuIcon
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NavigationItem, NavigationLink } from '@/types/navigation';
import { Button } from '@/components/ui/button';

type QuickSelectItemProps = {
  item: NavigationLink;
  onRemove: (id: string) => void;
};

const QuickSelectItem: React.FC<QuickSelectItemProps> = ({ item, onRemove }) => {
  const [location] = useLocation();
  const isActive = location === item.href || location.startsWith(item.href + '/');
  
  // Get the Lucide icon dynamically
  const IconComponent = (LucideIcons as any)[item.icon] || LucideIcons.Circle;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative group">
            <Link
              href={item.href}
              className={cn(
                "flex items-center justify-center p-2 rounded-full w-10 h-10 transition-all duration-200",
                isActive 
                  ? "bg-primary text-white" 
                  : "bg-background border border-border hover:bg-muted"
              )}
            >
              <IconComponent className="h-5 w-5" />
              {item.badge && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full" />
              )}
            </Link>
            <button
              onClick={() => onRemove(item.id)}
              className="absolute -top-2 -right-2 bg-destructive text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={10}>
          <p>{item.title}</p>
          {item.badge && (
            <p className="text-xs text-muted-foreground">{item.badge.text}</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const QuickSelectMenu: React.FC = () => {
  // Pin tools functionality has been replaced with AI Navigation Assistant
  return null;
};

export default QuickSelectMenu;