import React from 'react';

interface PremiumLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function PremiumLoader({ size = 'md', text, className = '' }: PremiumLoaderProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      {/* Sophisticated multi-ring spinner */}
      <div className="relative">
        {/* Outer ring */}
        <div className={`${sizeClasses[size]} border-4 border-gray-200 dark:border-gray-700 rounded-full animate-spin`}>
          <div className="absolute inset-0 border-4 border-transparent border-t-cyan-500 rounded-full animate-spin"></div>
        </div>
        
        {/* Middle ring */}
        <div className={`absolute inset-1 ${size === 'lg' ? 'w-12 h-12' : size === 'md' ? 'w-8 h-8' : 'w-4 h-4'} border-2 border-gray-100 dark:border-gray-600 rounded-full animate-spin`} 
             style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}>
          <div className="absolute inset-0 border-2 border-transparent border-t-blue-400 rounded-full animate-spin" 
               style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        
        {/* Inner ring */}
        <div className={`absolute inset-2 ${size === 'lg' ? 'w-8 h-8' : size === 'md' ? 'w-4 h-4' : 'w-2 h-2'} border border-gray-50 dark:border-gray-500 rounded-full animate-spin`}
             style={{ animationDuration: '2s' }}>
          <div className="absolute inset-0 border border-transparent border-t-indigo-400 rounded-full animate-spin"
               style={{ animationDuration: '2s' }}></div>
        </div>
        
        {/* Center dot */}
        <div className={`absolute inset-0 flex items-center justify-center`}>
          <div className={`${size === 'lg' ? 'w-2 h-2' : size === 'md' ? 'w-1.5 h-1.5' : 'w-1 h-1'} bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse`}></div>
        </div>
      </div>

      {/* Loading text with subtle animation */}
      {text && (
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 animate-pulse">
            {text}
          </p>
          <div className="flex justify-center mt-2 space-x-1">
            <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      )}
    </div>
  );
}

// Full-screen premium loading overlay
export function PremiumLoadingOverlay({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
        <PremiumLoader size="lg" text={text} />
      </div>
    </div>
  );
}

// Card-specific premium skeleton loader
export function PremiumCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`border-l-4 border-l-cyan-500 bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-lg p-6 animate-pulse ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
        </div>
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
    </div>
  );
}