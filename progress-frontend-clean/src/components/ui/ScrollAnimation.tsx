import { ReactNode } from 'react';

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

// Instant render wrapper - no animations for static deployment
export function ScrollAnimation({ children, className = '', id, style }: ScrollAnimationProps) {
  return (
    <div className={className} id={id} style={style}>
      {children}
    </div>
  );
}

// Simple wrappers that just render content instantly
export function FadeIn({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function SlideUp({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function SlideDown({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function SlideInLeft({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function SlideInRight({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function ScaleIn({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}