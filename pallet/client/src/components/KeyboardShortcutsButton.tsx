import React, { useState } from 'react';
import { HelpCircle, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface KeyboardShortcut {
  key: string;
  description: string;
}

const shortcuts: KeyboardShortcut[] = [
  { key: 'G + D', description: 'Go to Dashboard' },
  { key: 'G + P', description: 'Go to Pages' },
  { key: 'G + S', description: 'Go to Settings' },
  { key: '/', description: 'Focus search' },
  { key: 'B', description: 'Toggle sidebar' },
  { key: '?', description: 'Show keyboard shortcuts' },
  { key: 'ESC', description: 'Close modal or dialog' },
  { key: 'N', description: 'Create new content' },
  { key: 'S', description: 'Save current changes' },
  { key: 'Ctrl + /', description: 'Toggle help' }
];

interface KeyboardShortcutsButtonProps {
  className?: string;
}

const KeyboardShortcutsButton: React.FC<KeyboardShortcutsButtonProps> = ({ className }) => {
  const [showShortcuts, setShowShortcuts] = useState(false);

  return (
    <>
      <Button
        variant="ghost" 
        size="sm"
        className={cn('h-8 w-8 p-0', className)}
        onClick={() => setShowShortcuts(true)}
        title="Keyboard Shortcuts"
      >
        <Keyboard className="h-4 w-4" />
        <span className="sr-only">Keyboard Shortcuts</span>
      </Button>
      
      {showShortcuts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-md shadow-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Keyboard Shortcuts</h2>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setShowShortcuts(false)}
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shortcuts.map((shortcut, index) => (
                <div key={index} className="flex justify-between items-center border-b border-gray-100 py-2">
                  <span className="font-medium">{shortcut.description}</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">{shortcut.key}</kbd>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button
                className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                onClick={() => setShowShortcuts(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KeyboardShortcutsButton;