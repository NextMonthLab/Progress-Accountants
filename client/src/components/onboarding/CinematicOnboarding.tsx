import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ease: "easeOut",
      duration: 0.6
    }
  }
};

interface CinematicHeroProps {
  title: string;
  subtitle?: string;
  backgroundClass?: string;
  children?: ReactNode;
}

export function CinematicHero({ 
  title, 
  subtitle, 
  backgroundClass = "from-blue-900 to-indigo-900",
  children 
}: CinematicHeroProps) {
  return (
    <div className={cn(
      "relative min-h-[300px] flex items-center overflow-hidden",
      "rounded-xl px-8 py-12 mb-8 bg-gradient-to-br", 
      backgroundClass
    )}>
      <motion.div
        className="relative z-10 w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          variants={itemVariants}
          className="text-3xl md:text-4xl font-bold text-white mb-4"
        >
          {title}
        </motion.h1>
        
        {subtitle && (
          <motion.p 
            variants={itemVariants}
            className="text-lg text-white/80 max-w-2xl mb-6"
          >
            {subtitle}
          </motion.p>
        )}
        
        {children && (
          <motion.div variants={itemVariants}>
            {children}
          </motion.div>
        )}
      </motion.div>
      
      {/* Background animated effects */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute h-40 w-40 bg-white/10 rounded-full -top-10 -right-10 blur-xl" />
        <div className="absolute h-60 w-60 bg-white/5 rounded-full -bottom-20 -left-20 blur-xl" />
        <motion.div
          className="absolute h-20 w-20 bg-white/20 rounded-full top-1/3 left-1/4 blur-md"
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
}

interface StageCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  active?: boolean;
  completed?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export function StageCard({ 
  title, 
  description, 
  icon, 
  active = false, 
  completed = false,
  onClick,
  disabled = false
}: StageCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      className={cn(
        "relative p-6 rounded-lg transition-all duration-300 cursor-pointer",
        "border border-transparent hover:border-white/20",
        active ? "bg-white/15 shadow-lg" : "bg-white/5",
        disabled && "opacity-60 pointer-events-none"
      )}
      onClick={!disabled ? onClick : undefined}
    >
      <div className="flex items-start gap-4">
        {icon && (
          <div className={cn(
            "p-2.5 rounded-md",
            active ? "bg-blue-600/30 text-blue-300" : "bg-white/10 text-white/70"
          )}>
            {icon}
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium text-white">{title}</h3>
            {completed && (
              <Badge variant="success" className="bg-green-600/20 text-green-400 border-green-800">
                Completed
              </Badge>
            )}
            {active && !completed && (
              <Badge variant="default" className="bg-blue-600/20 text-blue-400 border-blue-800">
                In Progress
              </Badge>
            )}
          </div>
          
          {description && (
            <p className="text-sm text-white/70">{description}</p>
          )}
        </div>
      </div>
      
      {active && (
        <motion.div
          className="absolute inset-0 rounded-lg border border-blue-400/30"
          animate={{ 
            boxShadow: ["0 0 0 0 rgba(59, 130, 246, 0)", "0 0 0 4px rgba(59, 130, 246, 0.1)", "0 0 0 0 rgba(59, 130, 246, 0)"]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      )}
    </motion.div>
  );
}

interface OnboardingProgressProps {
  stages: string[];
  currentStage: string;
  completedStages: string[];
}

export function OnboardingProgress({ 
  stages, 
  currentStage, 
  completedStages 
}: OnboardingProgressProps) {
  const currentIndex = stages.indexOf(currentStage);
  const progress = (currentIndex / (stages.length - 1)) * 100;
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-white/60">Progress</span>
        <span className="text-sm font-medium text-white">
          {Math.round(progress)}%
        </span>
      </div>
      
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-600 to-indigo-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      
      <div className="flex justify-between mt-2">
        {stages.map((stage, index) => {
          const isCompleted = completedStages.includes(stage);
          const isCurrent = stage === currentStage;
          
          return (
            <div 
              key={stage}
              className="flex flex-col items-center"
              style={{ width: `${100 / stages.length}%` }}
            >
              <div 
                className={cn(
                  "w-3 h-3 rounded-full mb-1",
                  isCompleted ? "bg-green-500" : 
                  isCurrent ? "bg-blue-500" : 
                  "bg-white/30"
                )}
              />
              <span className={cn(
                "text-xs text-center line-clamp-1",
                isCompleted ? "text-green-500" : 
                isCurrent ? "text-blue-400" : 
                "text-white/50"
              )}>
                {`Step ${index + 1}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface OnboardingLayoutProps {
  children: ReactNode;
  backgroundStyle?: "default" | "dark" | "gradient";
}

export function OnboardingLayout({ 
  children,
  backgroundStyle = "default"
}: OnboardingLayoutProps) {
  let bgClass = "bg-white dark:bg-gray-950";
  
  if (backgroundStyle === "dark") {
    bgClass = "bg-gray-950 text-white";
  } else if (backgroundStyle === "gradient") {
    bgClass = "bg-gradient-to-b from-gray-900 to-gray-950 text-white";
  }
  
  return (
    <div className={cn("min-h-screen", bgClass)}>
      <div className="max-w-screen-lg mx-auto px-4 py-8">
        {children}
      </div>
      
      {backgroundStyle === "gradient" && (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -inset-[10px] opacity-20">
            <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[80px] animate-pulse" />
            <div className="absolute top-2/3 right-1/4 w-64 h-64 bg-indigo-600 rounded-full mix-blend-screen filter blur-[60px] animate-pulse" 
                 style={{ animationDelay: '1s', animationDuration: '5s' }} />
            <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-cyan-600 rounded-full mix-blend-screen filter blur-[70px] animate-pulse" 
                 style={{ animationDelay: '2s', animationDuration: '7s' }} />
          </div>
        </div>
      )}
    </div>
  );
}