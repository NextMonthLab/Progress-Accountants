import { ReactNode } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  type?: 'fade' | 'slide' | 'scale' | 'fade-slide';
  id?: string;
  style?: React.CSSProperties;
}

export function ScrollAnimation({
  children,
  className = '',
  id,
  style
}: ScrollAnimationProps) {
  // Instant render for static deployment - no animations
  return (
    <div
      className={className}
      id={id}
      style={style}
    >
      {children}
    </div>
  );

  // Set initial states based on direction and type
  let initialX = 0;
  let initialY = 0;
  let initialOpacity = 1;
  let initialScale = 1;

  if (type.includes('slide') || type.includes('fade-slide')) {
    if (direction === 'up') initialY = 50;
    if (direction === 'down') initialY = -50;
    if (direction === 'left') initialX = 50;
    if (direction === 'right') initialX = -50;
  }

  if (type.includes('fade')) {
    initialOpacity = 0;
  }

  if (type === 'scale') {
    initialScale = 0.9;
    initialOpacity = 0;
  }

}

// Define a type for the pre-configured components
interface AnimationComponentProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  id?: string;
  style?: React.CSSProperties;
}

// Pre-configured components for common animations
  return (
    <ScrollAnimation 
      className={className} 
      delay={0} 
      type="fade" 
      direction="none"
      {...props}
    >
      {children}
    </ScrollAnimation>
  );
}

  return (
    <ScrollAnimation 
      className={className} 
      delay={0} 
      type="fade-slide" 
      direction="up"
      {...props}
    >
      {children}
    </ScrollAnimation>
  );
}

  return (
    <ScrollAnimation 
      className={className} 
      delay={0} 
      type="fade-slide" 
      direction="down"
      {...props}
    >
      {children}
    </ScrollAnimation>
  );
}

  return (
    <ScrollAnimation 
      className={className} 
      delay={0} 
      type="fade-slide" 
      direction="right"
      {...props}
    >
      {children}
    </ScrollAnimation>
  );
}

  return (
    <ScrollAnimation 
      className={className} 
      delay={0} 
      type="fade-slide" 
      direction="left"
      {...props}
    >
      {children}
    </ScrollAnimation>
  );
}

  return (
    <ScrollAnimation 
      className={className} 
      delay={0} 
      type="scale" 
      direction="none"
      {...props}
    >
      {children}
    </ScrollAnimation>
  );
}