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
export function FadeIn({ children, className = '', ...props }: AnimationComponentProps) {
  return (
    <ScrollAnimation 
      className={className} 
      type="fade" 
      direction="none"
      duration={0.4}
      {...props}
    >
      {children}
    </ScrollAnimation>
  );
}

export function SlideUp({ children, className = '', ...props }: AnimationComponentProps) {
  return (
    <ScrollAnimation 
      className={className} 
      type="fade-slide" 
      direction="up"
      duration={0.4}
      {...props}
    >
      {children}
    </ScrollAnimation>
  );
}

export function SlideDown({ children, className = '', ...props }: AnimationComponentProps) {
  return (
    <ScrollAnimation 
      className={className} 
      type="fade-slide" 
      direction="down"
      duration={0.4}
      {...props}
    >
      {children}
    </ScrollAnimation>
  );
}

export function SlideInLeft({ children, className = '', ...props }: AnimationComponentProps) {
  return (
    <ScrollAnimation 
      className={className} 
      type="fade-slide" 
      direction="right"
      duration={0.4}
      {...props}
    >
      {children}
    </ScrollAnimation>
  );
}

export function SlideInRight({ children, className = '', ...props }: AnimationComponentProps) {
  return (
    <ScrollAnimation 
      className={className} 
      type="fade-slide" 
      direction="left"
      duration={0.4}
      {...props}
    >
      {children}
    </ScrollAnimation>
  );
}

export function ScaleIn({ children, className = '', ...props }: AnimationComponentProps) {
  return (
    <ScrollAnimation 
      className={className} 
      type="scale" 
      direction="none"
      duration={0.4}
      {...props}
    >
      {children}
    </ScrollAnimation>
  );
}