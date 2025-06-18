import { ReactNode } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
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
  delay = 0,
  duration = 0.6,
  direction = 'up',
  threshold = 0.2,
  rootMargin = '-50px 0px',
  triggerOnce = true,
  type = 'fade-slide',
  id,
  style
}: ScrollAnimationProps) {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce,
    threshold,
    rootMargin
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

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

  const variants = {
    hidden: {
      opacity: initialOpacity,
      y: initialY,
      x: initialX,
      scale: initialScale
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration,
        ease: 'easeOut',
        delay
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={variants}
      className={className}
      id={id}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// Define a type for the pre-configured components
interface AnimationComponentProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  id?: string;
  style?: React.CSSProperties;
}

// Pre-configured components for common animations
export function FadeIn({ className = '', delay = 0, children, ...props }: AnimationComponentProps) {
  return (
    <ScrollAnimation 
      className={className} 
      delay={delay} 
      type="fade" 
      direction="none"
      {...props}
    >
      {children}
    </ScrollAnimation>
  );
}

export function SlideUp({ className = '', delay = 0, children, ...props }: AnimationComponentProps) {
  return (
    <ScrollAnimation 
      className={className} 
      delay={delay} 
      type="fade-slide" 
      direction="up"
      {...props}
    >
      {children}
    </ScrollAnimation>
  );
}

export function SlideDown({ className = '', delay = 0, children, ...props }: AnimationComponentProps) {
  return (
    <ScrollAnimation 
      className={className} 
      delay={delay} 
      type="fade-slide" 
      direction="down"
      {...props}
    >
      {children}
    </ScrollAnimation>
  );
}

export function SlideInLeft({ className = '', delay = 0, children, ...props }: AnimationComponentProps) {
  return (
    <ScrollAnimation 
      className={className} 
      delay={delay} 
      type="fade-slide" 
      direction="right"
      {...props}
    >
      {children}
    </ScrollAnimation>
  );
}

export function SlideInRight({ className = '', delay = 0, children, ...props }: AnimationComponentProps) {
  return (
    <ScrollAnimation 
      className={className} 
      delay={delay} 
      type="fade-slide" 
      direction="left"
      {...props}
    >
      {children}
    </ScrollAnimation>
  );
}

export function ScaleIn({ className = '', delay = 0, children, ...props }: AnimationComponentProps) {
  return (
    <ScrollAnimation 
      className={className} 
      delay={delay} 
      type="scale" 
      direction="none"
      {...props}
    >
      {children}
    </ScrollAnimation>
  );
}