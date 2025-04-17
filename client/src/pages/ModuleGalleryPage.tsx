import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  ModuleItem, 
  availableModules, 
  groupModulesByStatus, 
  getStatusBadgeColor,
  getStatusText
} from '@/lib/moduleData';
import { Package2, ShoppingCart, Check, AlertCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function ModuleGalleryPage() {
  const { toast } = useToast();
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [requesting, setRequesting] = useState<string | null>(null);
  const moduleGroups = groupModulesByStatus();
  
  const getStatusIcon = (status: ModuleItem['status']) => {
    switch (status) {
      case 'complete':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'CPT_ready':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'designed':
        return <Package2 className="h-4 w-4 text-purple-600" />;
      case 'dev_in_progress':
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      default:
        return null;
    }
  };
  
  const handleRequestModule = async (module: ModuleItem) => {
    setRequesting(module.screen_name);
    
    try {
      // Prepare the structured request data
      const requestData = {
        project: 'progress_accountants',
        type: 'module_request',
        payload: {
          screen_name: module.screen_name,
          description: module.description,
          status: module.status,
          business_id: 'progress_123', // Would be dynamic in a real implementation
        }
      };
      
      // Send the request to the API
      const response = await fetch('/api/scope-request/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestData })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send module request');
      }
      
      // Show success toast
      toast({
        title: 'Module Requested',
        description: `Your request for the ${module.screen_name} module has been sent to NextMonth Dev.`,
        variant: 'default',
      });
      
      // Play success sound
      try {
        const { playModuleRequestSound } = await import('@/lib/generateSound');
        await playModuleRequestSound(0.3);
      } catch (e) {
        console.log('Audio error:', e);
      }
    } catch (error) {
      console.error('Error requesting module:', error);
      
      toast({
        title: 'Request Failed',
        description: 'There was an error sending your module request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setRequesting(null);
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Helmet>
        <title>Module Gallery | Progress Accountants</title>
      </Helmet>
      
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--navy)] mb-4">Module Gallery</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Browse and request pre-built screens and features that can be instantly activated for your Progress Accountants platform.
          </p>
        </div>
        
        {Object.entries(moduleGroups).map(([groupName, modules]) => (
          modules.length > 0 && (
            <div key={groupName} className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 text-[var(--navy)] border-b pb-2">
                {groupName} <span className="text-gray-500 text-lg font-normal">({modules.length})</span>
              </h2>
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {modules.map((module) => (
                  <motion.div key={module.screen_name} variants={cardVariants}>
                    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl font-bold text-[var(--navy)]">
                            {module.screen_name}
                          </CardTitle>
                          <Badge 
                            variant="outline" 
                            className={`${getStatusBadgeColor(module.status)}`}
                          >
                            <span className="flex items-center gap-1">
                              {getStatusIcon(module.status)}
                              {getStatusText(module.status)}
                            </span>
                          </Badge>
                        </div>
                        <CardDescription className="text-gray-600 line-clamp-2">
                          {module.description}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="flex-grow">
                        <p className="text-sm text-gray-500">
                          {module.description}
                        </p>
                      </CardContent>
                      
                      <CardFooter className="pt-2 border-t">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                onClick={() => handleRequestModule(module)}
                                className="w-full"
                                style={{ 
                                  backgroundColor: module.status === 'complete' ? 'var(--navy)' : 'var(--orange)'
                                }}
                                disabled={requesting === module.screen_name}
                              >
                                {requesting === module.screen_name ? (
                                  <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                    Requesting...
                                  </span>
                                ) : (
                                  <span className="flex items-center">
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    Request This Module
                                  </span>
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{module.status === 'complete' 
                                ? 'This module is ready to install immediately' 
                                : 'This module is still in development but can be prioritized for your account'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}