import React from 'react';
import { Badge } from './AdminButtons';
import { cn } from '@/lib/utils';
import { LightbulbIcon, Wrench, Users } from 'lucide-react';

interface SmartContextBannerProps {
  className?: string;
}

export function SmartContextBanner({ className }: SmartContextBannerProps) {
  // This would typically come from an API or context
  const lastActivity = "30 minutes ago";
  const suggestions = [
    { id: 1, text: "Complete your site configuration setup" },
    { id: 2, text: "Add more team members to collaborate on content" }
  ];

  return (
    <div className={cn(
      "w-full border-b dark:border-[#1D1D1D] border-gray-200 bg-gradient-to-r from-white to-gray-50 dark:from-[#0A0A0A] dark:to-[#121212]",
      className
    )}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-2">
              <div className="flex items-center rounded-md bg-gradient-to-r from-[#3CBFAE]/10 to-[#F65C9A]/10 dark:from-[#3CBFAE]/20 dark:to-[#F65C9A]/20 px-3 py-1.5">
                <LightbulbIcon className="h-4 w-4 text-[#F65C9A] mr-2" />
                <span className="text-sm font-medium dark:text-white text-gray-900">Smart Context</span>
              </div>
              
              <div className="flex items-center rounded-md bg-gray-100 dark:bg-[#1D1D1D] px-3 py-1.5">
                <Wrench className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Admin Tools</span>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Last activity: {lastActivity}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center rounded-md bg-white dark:bg-[#121212] border dark:border-[#1D1D1D] border-gray-200 shadow-sm px-3 py-1.5">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Quick Actions</span>
            </div>
            
            <div className="flex items-center rounded-md bg-white dark:bg-[#121212] border dark:border-[#1D1D1D] border-gray-200 shadow-sm px-3 py-1.5">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Notifications</span>
            </div>
            
            <div className="flex items-center rounded-md bg-gradient-to-r from-[#3CBFAE] to-[#F65C9A] px-3 py-1.5 shadow-lg hover:shadow-[0_4px_16px_rgba(246,92,154,0.25)] transition-all duration-300">
              <span className="text-sm font-medium text-white">View Website</span>
            </div>
            
            <button className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Dismiss
            </button>
          </div>
        </div>
        
        {suggestions.length > 0 && (
          <div className="mt-2 flex items-center space-x-3">
            <div className="flex items-center text-[#F65C9A] dark:text-[#F65C9A] font-medium text-sm">
              <span className="mr-1">💡</span> Smart suggestions:
            </div>
            
            <div className="flex flex-wrap gap-2">
              {suggestions.map(suggestion => (
                <div key={suggestion.id} className="rounded-md bg-white dark:bg-[#121212] border dark:border-[#1D1D1D] border-gray-200 px-3 py-1 text-xs text-gray-700 dark:text-gray-300">
                  {suggestion.text}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}