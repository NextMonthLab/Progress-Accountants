import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Sparkles, Command, Search, X, ArrowRight, Brain, CheckSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Interface for command results
interface CommandResult {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
}

// Smart Command Bar component - provides natural language command interface
const SmartCommandBar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [results, setResults] = useState<CommandResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [_, navigate] = useLocation();

  // Register keyboard shortcut for command bar (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  // Focus input when dialog opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setInput('');
      setResults([]);
    }
  }, [open]);

  // Process natural language commands
  useEffect(() => {
    if (!input) {
      setResults([]);
      return;
    }

    setLoading(true);

    // This would ideally be an API call to process natural language
    // For demo purposes, we're using a simple pattern matching approach
    const processCommand = () => {
      const commands: CommandResult[] = [];
      const inputLower = input.toLowerCase();

      // Navigation commands
      if (inputLower.includes('dashboard') || inputLower.includes('home')) {
        commands.push({
          id: 'goto-dashboard',
          title: 'Go to Dashboard',
          description: 'Navigate to the main dashboard',
          icon: <ArrowRight className="h-4 w-4" />,
          action: () => navigate('/admin/dashboard')
        });
      }

      // Create/add commands
      if (inputLower.includes('create') || inputLower.includes('add') || inputLower.includes('new')) {
        if (inputLower.includes('page') || inputLower.includes('post')) {
          commands.push({
            id: 'create-page',
            title: 'Create New Page',
            description: 'Create a new website page',
            icon: <CheckSquare className="h-4 w-4" />,
            action: () => navigate('/admin/pages/create')
          });
        }
        
        if (inputLower.includes('post') || inputLower.includes('social')) {
          commands.push({
            id: 'create-social',
            title: 'Create Social Media Post',
            description: 'Open the social media post generator',
            icon: <CheckSquare className="h-4 w-4" />,
            action: () => navigate('/admin/social-media-generator')
          });
        }
      }

      // Analysis/report commands
      if (inputLower.includes('analytics') || inputLower.includes('report') || inputLower.includes('stats')) {
        commands.push({
          id: 'view-analytics',
          title: 'View Analytics',
          description: 'Check your website performance stats',
          icon: <CheckSquare className="h-4 w-4" />,
          action: () => navigate('/admin/analytics')
        });
      }

      // AI commands
      if (inputLower.includes('ai') || inputLower.includes('suggest') || inputLower.includes('recommend')) {
        commands.push({
          id: 'ai-suggestions',
          title: 'Get AI Suggestions',
          description: 'See AI-powered recommendations for your site',
          icon: <Brain className="h-4 w-4" />,
          action: () => navigate('/admin/ai-suggestions')
        });
      }

      // If no commands match, provide a default help command
      if (commands.length === 0) {
        commands.push({
          id: 'ai-process',
          title: `AI Processing: "${input}"`,
          description: 'Let the AI assistant handle this request',
          icon: <Brain className="h-4 w-4" />,
          action: () => {
            // This would connect to an actual AI backend
            alert(`The AI is processing your request: "${input}"`);
            setOpen(false);
          }
        });
      }

      setResults(commands);
      setLoading(false);
    };

    // Simulate API processing delay
    const timeout = setTimeout(processCommand, 300);
    return () => clearTimeout(timeout);
  }, [input, navigate]);

  // Handle keyboard navigation in results
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault();
      executeCommand(results[selectedIndex]);
    }
  };

  // Execute a command and close the command bar
  const executeCommand = (command: CommandResult) => {
    command.action();
    setOpen(false);
  };

  return (
    <>
      {/* Floating button to open command bar */}
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 rounded-full p-3 bg-gradient-to-r from-[var(--navy)] to-[var(--navy)]/80 hover:from-[var(--orange)] hover:to-[var(--orange)]/80 shadow-lg"
        aria-label="Open Smart Command"
      >
        <Command className="h-5 w-5 text-white" />
      </Button>

      {/* Command Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg border-0 shadow-xl">
          <DialogHeader className="border-b pb-2">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-[var(--orange)]" />
              <span>Smart Command</span>
              <span className="ml-auto text-sm text-muted-foreground">
                Type a command or ask a question
              </span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="relative">
            <div className="flex items-center border-b px-3">
              <Search className="h-4 w-4 text-muted-foreground mr-2" />
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type what you want to do..."
                className="flex-1 py-3 px-1 bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground"
              />
              {input && (
                <button 
                  onClick={() => setInput('')}
                  className="ml-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-6 w-6 border-2 border-[var(--orange)] border-t-transparent rounded-full"></div>
              </div>
            )}
            
            {/* Results */}
            {!loading && results.length > 0 && (
              <div className="max-h-[300px] overflow-y-auto py-2">
                {results.map((result, index) => (
                  <button
                    key={result.id}
                    className={cn(
                      "w-full flex items-start px-3 py-2 text-left hover:bg-slate-100 transition-colors",
                      selectedIndex === index && "bg-slate-100"
                    )}
                    onClick={() => executeCommand(result)}
                  >
                    <div className="flex-shrink-0 mr-3 mt-1">
                      {result.icon}
                    </div>
                    <div>
                      <div className="font-medium">{result.title}</div>
                      <div className="text-sm text-muted-foreground">{result.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {/* No results */}
            {!loading && input && results.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                <p>No commands found. Try something else!</p>
              </div>
            )}
            
            {/* Initial state */}
            {!loading && !input && (
              <div className="py-6 px-3">
                <div className="text-center text-muted-foreground mb-4">
                  <p className="mb-2">Try asking for things like:</p>
                  <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
                    <div className="bg-slate-50 p-2 rounded text-sm">"Create a new page"</div>
                    <div className="bg-slate-50 p-2 rounded text-sm">"Show analytics"</div>
                    <div className="bg-slate-50 p-2 rounded text-sm">"Get AI suggestions"</div>
                    <div className="bg-slate-50 p-2 rounded text-sm">"Go to dashboard"</div>
                  </div>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  Press <kbd className="px-1 py-0.5 bg-slate-100 border rounded text-xs">ESC</kbd> to close 
                  or <kbd className="px-1 py-0.5 bg-slate-100 border rounded text-xs">↑</kbd> <kbd className="px-1 py-0.5 bg-slate-100 border rounded text-xs">↓</kbd> to navigate
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SmartCommandBar;