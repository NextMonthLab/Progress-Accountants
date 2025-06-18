import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { useNavigation } from '@/contexts/NavigationContext';

interface Shortcut {
  key: string;
  description: string;
  action: () => void;
  scope: 'global' | 'admin' | 'page-editor';
}

interface KeyboardShortcutsContextType {
  shortcuts: Shortcut[];
  registerShortcut: (shortcut: Shortcut) => void;
  unregisterShortcut: (key: string) => void;
  showShortcutsDialog: () => void;
}

export const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType | null>(null);

interface KeyboardShortcutsProviderProps {
  children: ReactNode;
}

export const KeyboardShortcutsProvider: React.FC<KeyboardShortcutsProviderProps> = ({ children }) => {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { toggleSidebar } = useNavigation();

  // Register a new keyboard shortcut
  const registerShortcut = (shortcut: Shortcut) => {
    setShortcuts(prevShortcuts => {
      // Check if shortcut already exists
      const exists = prevShortcuts.find(s => s.key === shortcut.key);
      if (exists) {
        return prevShortcuts.map(s => s.key === shortcut.key ? shortcut : s);
      }
      return [...prevShortcuts, shortcut];
    });
  };

  // Unregister a keyboard shortcut
  const unregisterShortcut = (key: string) => {
    setShortcuts(prevShortcuts => prevShortcuts.filter(s => s.key !== key));
  };

  // Show keyboard shortcuts dialog
  const showShortcutsDialog = () => {
    setShowDialog(true);
  };

  // Initialize default shortcuts
  useEffect(() => {
    const defaultShortcuts: Shortcut[] = [
      {
        key: 'g+d',
        description: 'Go to Dashboard',
        action: () => navigate('/admin/dashboard'),
        scope: 'global'
      },
      {
        key: 'g+p',
        description: 'Go to Pages',
        action: () => navigate('/admin/pages'),
        scope: 'global'
      },
      {
        key: 'g+s',
        description: 'Go to Settings',
        action: () => navigate('/admin/settings'),
        scope: 'global'
      },
      {
        key: '/',
        description: 'Focus search',
        action: () => {
          const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
          }
        },
        scope: 'global'
      },
      {
        key: 'b',
        description: 'Toggle sidebar',
        action: () => toggleSidebar(),
        scope: 'global'
      },
      {
        key: '?',
        description: 'Show keyboard shortcuts',
        action: showShortcutsDialog,
        scope: 'global'
      }
    ];

    // Register default shortcuts
    defaultShortcuts.forEach(shortcut => registerShortcut(shortcut));
  }, [navigate, toggleSidebar]);

  // Handle keyboard events
  useEffect(() => {
    const keyMap = new Map<string, number>();
    const keyTimeout = 1000; // Time in ms to reset key combination

    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip if user is typing in an input field
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      const now = Date.now();

      // Add current key to the map with timestamp
      keyMap.set(key, now);

      // Remove old keys (older than keyTimeout)
      keyMap.forEach((timestamp, mapKey) => {
        if (now - timestamp > keyTimeout) {
          keyMap.delete(mapKey);
        }
      });

      // Get current key sequence
      const currentKeys = Array.from(keyMap.keys()).sort().join('+');

      // Check if the sequence matches any shortcut
      const matchedShortcut = shortcuts.find(s => s.key === currentKeys || s.key === key);
      
      if (matchedShortcut) {
        event.preventDefault();
        matchedShortcut.action();
        
        // Show toast to confirm shortcut
        toast({
          title: 'Shortcut activated',
          description: matchedShortcut.description
        });
        
        // Clear the key map after a successful action
        keyMap.clear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts, toast]);

  return (
    <KeyboardShortcutsContext.Provider
      value={{
        shortcuts,
        registerShortcut,
        unregisterShortcut,
        showShortcutsDialog
      }}
    >
      {children}
      
      {/* Keyboard Shortcuts Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-md shadow-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Keyboard Shortcuts</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shortcuts.map((shortcut, index) => (
                <div key={index} className="flex justify-between border-b border-gray-100 py-2">
                  <span className="font-medium">{shortcut.description}</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">{shortcut.key}</kbd>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                onClick={() => setShowDialog(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </KeyboardShortcutsContext.Provider>
  );
};

export const useKeyboardShortcuts = () => {
  const context = useContext(KeyboardShortcutsContext);
  if (!context) {
    throw new Error('useKeyboardShortcuts must be used within a KeyboardShortcutsProvider');
  }
  return context;
};