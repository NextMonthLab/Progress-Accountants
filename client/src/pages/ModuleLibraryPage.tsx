import React, { useState, useEffect } from 'react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { 
  Package2, 
  ShoppingCart, 
  Check, 
  Filter, 
  Tag, 
  X,
  RefreshCw,
  Download
} from 'lucide-react';
import { useAuth } from '@/components/ClientDataProvider';
import { playModuleRequestSound } from '@/lib/generateSound';

// Define the module interface based on the API response
interface Module {
  screen_name: string;
  zone: string;
  tags: string[];
  status: string;
  plugin_zip_url?: string;
  description?: string;
}

export default function ModuleLibraryPage() {
  const { toast } = useToast();
  const { isStaff } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [filteredModules, setFilteredModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [zoneFilter, setZoneFilter] = useState<string>('all');
  const [tagFilters, setTagFilters] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [allZones, setAllZones] = useState<string[]>([]);
  const [requestingModule, setRequestingModule] = useState<string | null>(null);
  const [requestedModules, setRequestedModules] = useState<string[]>([]);

  // Fetch modules from the NextMonth Vault API
  useEffect(() => {
    async function fetchModules() {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('https://nextmonth.co.uk/wp-json/nextmonth/v1/screens');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch modules: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setModules(data);
          setFilteredModules(data);
          
          // Extract unique tags and zones for filters
          const tags = new Set<string>();
          const zones = new Set<string>();
          
          data.forEach(module => {
            if (module.zone) zones.add(module.zone);
            if (Array.isArray(module.tags)) {
              module.tags.forEach(tag => tags.add(tag));
            }
          });
          
          setAllTags(Array.from(tags).sort());
          setAllZones(Array.from(zones).sort());
        } else {
          throw new Error('Invalid response format from API');
        }
      } catch (err) {
        console.error('Error fetching modules:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch modules');
        
        // In a real app, we might want to add retry logic here
        toast({
          title: 'Error Loading Modules',
          description: 'Could not load modules from the NextMonth Vault. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchModules();
  }, [toast]);

  // Apply filters whenever filter state changes
  useEffect(() => {
    const filtered = modules.filter(module => {
      // Apply zone filter
      if (zoneFilter !== 'all' && module.zone !== zoneFilter) {
        return false;
      }
      
      // Apply tag filters
      if (tagFilters.length > 0) {
        if (!module.tags) return false;
        
        // Check if the module has at least one of the selected tags
        const hasSelectedTag = module.tags.some(tag => tagFilters.includes(tag));
        if (!hasSelectedTag) return false;
      }
      
      return true;
    });
    
    setFilteredModules(filtered);
  }, [modules, zoneFilter, tagFilters]);

  // Toggle a tag filter on/off
  const toggleTagFilter = (tag: string) => {
    setTagFilters(prev => 
      prev.includes(tag)
        ? prev.filter((t: string) => t !== tag)
        : [...prev, tag]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setZoneFilter('all');
    setTagFilters([]);
  };

  // Handle module request
  const handleRequestModule = async (module: Module) => {
    setRequestingModule(module.screen_name);
    
    try {
      // Prepare the structured request data
      const requestData = {
        project: 'progress_accountants',
        type: 'module_request',
        payload: {
          screen_name: module.screen_name,
          description: module.description || `${module.screen_name} module from ${module.zone} zone`,
          status: module.status || 'available',
          zone: module.zone,
          tags: module.tags || [],
          business_id: 'progress_accountants'
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
      
      // Add to requested modules
      setRequestedModules(prev => [...prev, module.screen_name]);
      
      // Show success toast
      toast({
        title: 'Module Requested',
        description: `Your request for the ${module.screen_name} module has been sent to NextMonth Dev.`,
        variant: 'default',
      });
      
      // Play success sound
      await playModuleRequestSound(0.3);
      
    } catch (error) {
      console.error('Error requesting module:', error);
      
      toast({
        title: 'Request Failed',
        description: 'There was an error sending your module request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setRequestingModule(null);
    }
  };

  // Animation variants
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

  // Get status badge styling based on status
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'beta':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'in development':
      case 'development':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'planned':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Get zone badge styling
  const getZoneBadge = (zone: string) => {
    switch (zone?.toLowerCase()) {
      case 'accounting':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'client':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'marketing':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'team':
        return 'bg-pink-100 text-pink-800 border-pink-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Helmet>
        <title>Module Library | Progress Accountants</title>
      </Helmet>
      
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[var(--navy)] mb-4">Module Library</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Browse and request modules from the NextMonth ecosystem to enhance your Progress Accountants platform.
          </p>
        </div>
        
        {/* Filter Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-medium text-[var(--navy)]">Filter Modules</h2>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Zone Filter */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-sm font-medium text-gray-600">Zone:</span>
                <Select
                  value={zoneFilter}
                  onValueChange={setZoneFilter}
                >
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Select Zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Zones</SelectItem>
                    {allZones.map(zone => (
                      <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Reset Button */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={resetFilters}
                className="ml-auto md:ml-0"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>
          </div>
          
          {/* Tag Filters */}
          {allTags.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-600">Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className={`cursor-pointer ${
                      tagFilters.includes(tag) 
                        ? 'bg-[var(--orange)] text-white hover:bg-[var(--orange)]' 
                        : 'bg-transparent hover:bg-gray-100'
                    }`}
                    onClick={() => toggleTagFilter(tag)}
                  >
                    {tag}
                    {tagFilters.includes(tag) && (
                      <X className="ml-1 h-3 w-3" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--navy)]"></div>
          </div>
        )}
        
        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium text-red-800 mb-2">Could Not Load Modules</h3>
            <p className="text-red-600">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        )}
        
        {/* Empty State */}
        {!isLoading && !error && filteredModules.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <Package2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No Modules Found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              No modules match your current filters. Try adjusting your filter criteria or check back later for new additions.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={resetFilters}
            >
              Reset Filters
            </Button>
          </div>
        )}
        
        {/* Module Grid */}
        {!isLoading && !error && filteredModules.length > 0 && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredModules.map((module) => (
              <motion.div key={module.screen_name} variants={cardVariants}>
                <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-xl font-bold text-[var(--navy)]">
                        {module.screen_name}
                      </CardTitle>
                      <Badge 
                        variant="outline" 
                        className={getStatusBadge(module.status)}
                      >
                        {module.status || 'Unknown'}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center mt-1">
                      <Badge 
                        variant="outline" 
                        className={getZoneBadge(module.zone)}
                      >
                        {module.zone || 'General'}
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-grow pb-2">
                    {/* Tags */}
                    {module.tags && module.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {module.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-500">
                      {module.description || `${module.screen_name} module for the ${module.zone || 'general'} zone.`}
                    </p>
                  </CardContent>
                  
                  <CardFooter className="pt-2 border-t flex justify-between items-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex-grow">
                            <Button 
                              onClick={() => handleRequestModule(module)}
                              className="w-full"
                              style={{ 
                                backgroundColor: requestedModules.includes(module.screen_name) 
                                  ? 'var(--navy)' 
                                  : 'var(--orange)'
                              }}
                              disabled={requestingModule === module.screen_name}
                            >
                              {requestingModule === module.screen_name ? (
                                <span className="flex items-center">
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                  </svg>
                                  Requesting...
                                </span>
                              ) : (
                                <span className="flex items-center">
                                  {requestedModules.includes(module.screen_name) ? (
                                    <>
                                      <Check className="mr-2 h-4 w-4" />
                                      Requested
                                    </>
                                  ) : (
                                    <>
                                      <ShoppingCart className="mr-2 h-4 w-4" />
                                      Request Module
                                    </>
                                  )}
                                </span>
                              )}
                            </Button>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {requestedModules.includes(module.screen_name)
                              ? 'This module has been requested'
                              : 'Request this module for your account'}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    {/* Admin-only download link */}
                    {isStaff && module.plugin_zip_url && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="ml-2" 
                              asChild
                            >
                              <a href={module.plugin_zip_url} target="_blank" rel="noopener noreferrer">
                                <Download className="h-4 w-4" />
                              </a>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Download Module ZIP (Admin Only)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}