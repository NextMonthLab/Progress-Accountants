import React from 'react';

interface DeferredRenderProps {
  children: React.ReactNode;
  placeholder?: React.ReactNode;
}

// Instant render for static deployment - preserves visual aesthetics without backend delays
export function DeferredRender({ children }: DeferredRenderProps) {
  return <>{children}</>;
}

// Add missing type definitions for requestIdleCallback
interface RequestIdleCallbackOptions {
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