import { ReactNode } from "react";
import { motion, useAnimation, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { scrollAnimationConfig } from "@/lib/animations";

interface ScrollAnimationWrapperProps {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
  threshold?: number;
  rootMargin?: string;
  viewportOnce?: boolean;
  as?: React.ElementType;
}

export function ScrollAnimationWrapper({
  children,
  variants,
  className = "",
  delay = 0,
  threshold = scrollAnimationConfig.threshold,
  rootMargin = scrollAnimationConfig.rootMargin,
  viewportOnce = scrollAnimationConfig.once,
  as = "div"
}: ScrollAnimationWrapperProps) {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: viewportOnce,
    threshold,
    rootMargin
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const defaultVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay
      }
    }
  };

  const MotionComponent = motion[as as keyof typeof motion] || motion.div;

  return (
    <MotionComponent
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={variants || defaultVariants}
      className={className}
    >
      {children}
    </MotionComponent>
  );
}

// Additional export for different animation types
export function FadeInOnScroll({ children, className = "", delay = 0, ...props }) {
  const variants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay
      }
    }
  };

  return (
    <ScrollAnimationWrapper
      variants={variants}
      className={className}
      delay={delay}
      {...props}
    >
      {children}
    </ScrollAnimationWrapper>
  );
}

export function SlideUpOnScroll({ children, className = "", delay = 0, ...props }) {
  const variants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay
      }
    }
  };

  return (
    <ScrollAnimationWrapper
      variants={variants}
      className={className}
      delay={delay}
      {...props}
    >
      {children}
    </ScrollAnimationWrapper>
  );
}

export function SlideInFromLeftOnScroll({ children, className = "", delay = 0, ...props }) {
  const variants: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay
      }
    }
  };

  return (
    <ScrollAnimationWrapper
      variants={variants}
      className={className}
      delay={delay}
      {...props}
    >
      {children}
    </ScrollAnimationWrapper>
  );
}

export function SlideInFromRightOnScroll({ children, className = "", delay = 0, ...props }) {
  const variants: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay
      }
    }
  };

  return (
    <ScrollAnimationWrapper
      variants={variants}
      className={className}
      delay={delay}
      {...props}
    >
      {children}
    </ScrollAnimationWrapper>
  );
}

export function ScaleUpOnScroll({ children, className = "", delay = 0, ...props }) {
  const variants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay
      }
    }
  };

  return (
    <ScrollAnimationWrapper
      variants={variants}
      className={className}
      delay={delay}
      {...props}
    >
      {children}
    </ScrollAnimationWrapper>
  );
}