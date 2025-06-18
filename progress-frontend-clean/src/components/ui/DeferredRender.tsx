import React from 'react';

interface DeferredRenderProps {
  children: React.ReactNode;
}

// Instant render for static deployment
export function DeferredRender({ children }: DeferredRenderProps) {
  return <>{children}</>;
}