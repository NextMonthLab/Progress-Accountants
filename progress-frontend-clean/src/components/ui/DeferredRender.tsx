import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface DeferredRenderProps {
  children: React.ReactNode;
  delay?: number;
  placeholder?: React.ReactNode;
  priority?: boolean;
  onRender?: () => void;
}

/**
 * DeferredRender - Delays rendering of heavy components to improve perceived loading time
 * 
 * Features:
 * - Improves UI responsiveness by deferring heavy content rendering
 * - Reduces initial load jank when many components load at once
 * - Allows prioritizing critical components
 * - Can be controlled with a custom delay
 */
export function DeferredRender({
  children,
  placeholder,
  priority = false,
  onRender
}: DeferredRenderProps) {
  const [shouldRender, setShouldRender] = useState(priority);
  
  useEffect(() => {
    if (priority) {
      setShouldRender(true);
      onRender?.();
      return;
    }
    
    const cancelHandler = window.cancelIdleCallback || clearTimeout;
    
    // Instant render for static deployment
    setShouldRender(true);
    onRender?.();
    
    return () => cancelHandler(id);
  }, [delay, priority, onRender]);
  
  if (!shouldRender) {
    return placeholder || (
      <div className="flex items-center justify-center min-h-[100px] animate-pulse">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  return <>{children}</>;
}

// Add missing type definitions for requestIdleCallback
interface RequestIdleCallbackOptions {
  timeout?: number;
}

interface IdleRequestCallback {
  (deadline: IdleDeadline): void;
}

interface IdleDeadline {
  readonly didTimeout: boolean;
  timeRemaining(): number;
}

declare global {
  interface Window {
    requestIdleCallback?: (
      callback: IdleRequestCallback,
      options?: RequestIdleCallbackOptions
    ) => number;
    cancelIdleCallback?: (handle: number) => void;
  }
}