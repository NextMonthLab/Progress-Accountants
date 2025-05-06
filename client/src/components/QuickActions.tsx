import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  PlusCircle,
  FileText,
  Settings,
  Users,
  BarChart,
  BookCopy,
  LightbulbIcon,
  Share2,
  Menu,
  FileImage,
  CircleHelp
} from 'lucide-react';
import { useLocation } from 'wouter';

const QuickActions: React.FC = () => {
  const [, navigate] = useLocation();

  // Common actions that should be quickly accessible from anywhere in the admin panel
  const commonActions = [
    {
      label: 'Create New Page',
      icon: <PlusCircle className="h-4 w-4" />,
      action: () => navigate('/page-builder/new'),
      shortcut: '⌘N',
    },
    {
      label: 'Upload Media',
      icon: <FileImage className="h-4 w-4" />,
      action: () => navigate('/media'),
      shortcut: '⌘U',
    },
    {
      label: 'Generate Social Post',
      icon: <Share2 className="h-4 w-4" />,
      action: () => navigate('/tools/social-media-generator'),
      shortcut: '⌘S',
    },
    {
      label: 'Create Blog Post',
      icon: <BookCopy className="h-4 w-4" />,
      action: () => navigate('/tools/blog-post-generator'),
      shortcut: '⌘B',
    }
  ];

  // Management actions
  const managementActions = [
    {
      label: 'View Analytics',
      icon: <BarChart className="h-4 w-4" />,
      action: () => navigate('/admin/analytics'),
      shortcut: '⌘A',
    },
    {
      label: 'Manage Team',
      icon: <Users className="h-4 w-4" />,
      action: () => navigate('/admin/team'),
      shortcut: '⌘T',
    },
    {
      label: 'Site Settings',
      icon: <Settings className="h-4 w-4" />,
      action: () => navigate('/admin/settings'),
      shortcut: '⌘,',
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 border-dashed bg-background/80 backdrop-blur-sm"
        >
          <Menu className="h-4 w-4" />
          <span className="hidden sm:inline-block">Quick Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>Create Content</DropdownMenuLabel>
        {commonActions.map((action, index) => (
          <DropdownMenuItem key={index} onClick={action.action}>
            {action.icon}
            <span>{action.label}</span>
            {action.shortcut && (
              <DropdownMenuShortcut>{action.shortcut}</DropdownMenuShortcut>
            )}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Management</DropdownMenuLabel>
        
        {managementActions.map((action, index) => (
          <DropdownMenuItem key={index} onClick={action.action}>
            {action.icon}
            <span>{action.label}</span>
            {action.shortcut && (
              <DropdownMenuShortcut>{action.shortcut}</DropdownMenuShortcut>
            )}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/admin/help-center')}>
          <CircleHelp className="h-4 w-4" />
          <span>Help & Resources</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/admin/smart-suggestions')}>
          <LightbulbIcon className="h-4 w-4" />
          <span>AI Suggestions</span>
          <DropdownMenuShortcut>⌘I</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default QuickActions;