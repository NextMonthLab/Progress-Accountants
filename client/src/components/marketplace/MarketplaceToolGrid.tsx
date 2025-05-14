import React, { useState } from 'react';
import { ExternalTool } from '@shared/marketplace';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Loader2, Download, Star, Tag, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const MarketplaceToolGrid = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get all available tools
  const { data: tools, isLoading } = useQuery({
    queryKey: ['/api/marketplace/tools'],
    queryFn: async () => {
      const response = await fetch('/api/marketplace/tools');
      if (!response.ok) {
        throw new Error('Failed to fetch tools');
      }
      return response.json();
    },
  });

  // Get installed tools to show installation status
  const { data: installedTools } = useQuery({
    queryKey: ['/api/marketplace/tools/installed'],
    queryFn: async () => {
      const response = await fetch('/api/marketplace/tools/installed');
      if (!response.ok) {
        return []; // Return empty array if not installed yet
      }
      return response.json();
    },
  });

  // Install tool mutation
  const installMutation = useMutation({
    mutationFn: async (toolId: string) => {
      const response = await fetch('/api/marketplace/tools/install', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ toolId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to install tool');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate queries to refetch the installed tools
      queryClient.invalidateQueries({ queryKey: ['/api/marketplace/tools/installed'] });
      queryClient.invalidateQueries({ queryKey: ['/api/marketplace/credits/usage'] });
      
      toast({
        title: 'Tool installed successfully',
        description: 'The tool has been added to your installed tools.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Installation failed',
        description: error.message,
        variant: 'default',
      });
    },
  });

  // Filter and sort the tools based on search query and category filter
  const filteredTools = React.useMemo(() => {
    if (!tools) return [];
    
    return tools.filter((tool: ExternalTool) => {
      const matchesSearch = 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        categoryFilter === 'all' || 
        (tool.category && tool.category.toLowerCase() === categoryFilter.toLowerCase());
      
      return matchesSearch && matchesCategory;
    });
  }, [tools, searchQuery, categoryFilter]);

  // Extract unique categories for the filter dropdown
  const categories = React.useMemo(() => {
    if (!tools) return [];
    
    const uniqueCategories = new Set<string>();
    tools.forEach((tool: ExternalTool) => {
      if (tool.category) {
        uniqueCategories.add(tool.category);
      }
    });
    
    return Array.from(uniqueCategories).sort();
  }, [tools]);

  // Check if a tool is already installed
  const isToolInstalled = (toolId: string) => {
    if (!installedTools) return false;
    return installedTools.some((installation: any) => installation.toolId === toolId);
  };

  // Handle tool installation
  const handleInstall = (tool: ExternalTool) => {
    if (isToolInstalled(tool.id)) {
      toast({
        title: 'Tool already installed',
        description: 'This tool is already installed on your site.',
        variant: 'default',
      });
      return;
    }
    
    installMutation.mutate(tool.id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!tools || tools.length === 0) {
    return (
      <div className="text-center p-12 border rounded-lg bg-muted/20">
        <p className="text-xl font-medium mb-2">No tools available</p>
        <p className="text-muted-foreground">
          There are currently no tools available in the marketplace. Please check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 min-w-[200px]">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category.toLowerCase()}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool: ExternalTool) => (
          <Card key={tool.id} className="overflow-hidden">
            <CardHeader className="relative pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{tool.name}</CardTitle>
                {tool.rating && (
                  <Badge 
                    variant="outline" 
                    className="flex items-center gap-1 bg-amber-50 text-amber-800 border-amber-200"
                  >
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    {tool.rating.toFixed(1)}
                  </Badge>
                )}
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <span>By {tool.publisher || tool.builder}</span>
                {tool.downloads && (
                  <span className="ml-2 flex items-center">
                    <Download className="h-3 w-3 mr-1" /> 
                    {tool.downloads}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">{tool.description}</p>
              <div className="flex flex-wrap gap-2">
                {tool.tags && tool.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
                {tool.category && (
                  <Badge className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/20">
                    {tool.category}
                  </Badge>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2 border-t">
              <div>
                {tool.isFree ? (
                  <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                    Free
                  </Badge>
                ) : (
                  <div className="font-medium">
                    {tool.credits || tool.price} credits
                  </div>
                )}
              </div>
              <Button
                onClick={() => handleInstall(tool)}
                disabled={
                  installMutation.isPending || 
                  isToolInstalled(tool.id)
                }
                className={`${
                  isToolInstalled(tool.id)
                    ? 'bg-muted hover:bg-muted text-muted-foreground cursor-not-allowed'
                    : ''
                }`}
              >
                {installMutation.isPending && installMutation.variables === tool.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Installing...
                  </>
                ) : isToolInstalled(tool.id) ? (
                  'Installed'
                ) : (
                  'Install'
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center p-8 border rounded-lg bg-muted/20">
          <p className="text-xl font-medium mb-2">No results found</p>
          <p className="text-muted-foreground">
            No tools match your search. Try using different keywords or filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default MarketplaceToolGrid;