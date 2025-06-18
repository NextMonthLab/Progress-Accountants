import React, { useEffect, useState } from 'react';

// Define confetti particle properties
interface Particle {
  x: number;
  y: number;
  color: string;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

// Define props
interface ConfettiProps {
  duration?: number;
  particleCount?: number;
}

// Color palette for confetti
const COLORS = [
  '#1E63F9', // Blue
  '#F28C1B', // Orange - customized for Progress Accountants orange
  '#26C281', // Green
  '#F1C40F', // Yellow
  '#9B59B6', // Purple
  '#E74C3C', // Red
];

export function Confetti({ duration = 3000, particleCount = 200 }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [frame, setFrame] = useState<number | null>(null);
  const [active, setActive] = useState(true);

  // Initialize canvas and particles
  useEffect(() => {
    // Create particles
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * -window.innerHeight / 2, // Start above the viewport
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 10 + 5,
        speedX: Math.random() * 6 - 3,
        speedY: Math.random() * 8 + 5,
        opacity: 1,
      });
    }
    
    setParticles(newParticles);
    
    // Set duration timeout
    const timer = setTimeout(() => {
      setActive(false);
    }, duration);
    
    return () => {
      clearTimeout(timer);
      if (frame) {
        cancelAnimationFrame(frame);
      }
    };
  }, [particleCount, duration]);

  // Set up canvas once component mounts
  useEffect(() => {
    const canvasElement = document.getElementById('confetti-canvas') as HTMLCanvasElement;
    if (canvasElement) {
      canvasElement.width = window.innerWidth;
      canvasElement.height = window.innerHeight;
      
      const ctx = canvasElement.getContext('2d');
      if (ctx) {
        setCanvas(canvasElement);
        setContext(ctx);
      }
    }
    
    // Handle resize
    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [canvas]);

  // Animation loop
  useEffect(() => {
    if (!context || !canvas || !active) return;
    
    const animate = () => {
      if (!context || !canvas || !active) return;
      
      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      const updatedParticles = [...particles];
      
      for (let i = 0; i < updatedParticles.length; i++) {
        const p = updatedParticles[i];
        
        // Update position
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Add some natural movement (flutter)
        p.x += Math.sin(p.y / 100) * 0.5;
        
        // Fade out at bottom of screen
        if (p.y > canvas.height * 0.8) {
          p.opacity -= 0.01;
        }
        
        // Draw particle
        context.beginPath();
        context.fillStyle = p.color;
        context.globalAlpha = p.opacity;
        context.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        context.fill();
        
        // Create some rectangular confetti too
        if (i % 3 === 0) {
          context.fillRect(p.x, p.y, p.size * 1.5, p.size * 0.5);
        }
        
        // Remove if off-screen or transparent
        if (p.y > canvas.height || p.opacity <= 0) {
          // Reset the particle to the top if animation is still active
          if (active) {
            p.y = Math.random() * -100;
            p.x = Math.random() * canvas.width;
            p.opacity = 1;
            p.speedY = Math.random() * 8 + 5;
          }
        }
      }
      
      setParticles(updatedParticles);
      
      // Request next frame
      const nextFrame = requestAnimationFrame(animate);
      setFrame(nextFrame);
    };
    
    const frameId = requestAnimationFrame(animate);
    setFrame(frameId);
    
    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [context, canvas, particles, active]);

  return (
    <canvas
      id="confetti-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}