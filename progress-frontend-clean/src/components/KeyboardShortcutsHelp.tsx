import React from 'react';
import { HelpCircle, X } from 'lucide-react';
import { useKeyboardShortcuts } from '@/contexts/KeyboardShortcutsContext';
import { Button } from '@/components/ui/button';

interface KeyboardShortcutsHelpProps {
  className?: string;
}

const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({ className }) => {
  const { showShortcutsDialog } = useKeyboardShortcuts();

  return (
    <Button
      variant="ghost" 
      size="sm"
      className={`h-8 w-8 p-0 ${className}`}
      onClick={showShortcutsDialog}
      title="Keyboard Shortcuts"
    >
      <HelpCircle className="h-4 w-4" />
      <span className="sr-only">Keyboard Shortcuts</span>
    </Button>
  );
};

export default KeyboardShortcutsHelp;