import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { ExternalTool, ToolInstallation } from '@shared/marketplace';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export function MarketplaceToolGrid() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Fetch available tools from marketplace
  const { data: tools, isLoading: isLoadingTools } = useQuery<ExternalTool[]>({
    queryKey: ['/api/marketplace/tools'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/marketplace/tools');
      return res.json();
    }
  });

  // Fetch installed tools
  const { data: installedTools, isLoading: isLoadingInstalled } = useQuery<ToolInstallation[]>({
    queryKey: ['/api/marketplace/tools/installed'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/marketplace/tools/installed');
      return res.json();
    }
  });

  // Install tool mutation
  const installToolMutation = useMutation({
    mutationFn: async (toolId: string) => {
      const res = await apiRequest('POST', '/api/marketplace/tools/install', { toolId });
      return res.json();
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
  const filteredTools = tools?.filter(tool => {
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || tool.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  }) || [];

  // Check if a tool is already installed
  const isToolInstalled = (toolId: string) => {
    return installedTools?.some(tool => tool.toolId === toolId) || false;
  };

  // Get unique categories from tools
  const categoriesSet = new Set(tools?.map(tool => tool.category) || []);
  const categories = Array.from(categoriesSet);

  // Loading state
  if (isLoadingTools || isLoadingInstalled) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tools..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredTools.length === 0 ? (
        <div className="flex items-center justify-center h-64 border rounded-md">
          <p className="text-muted-foreground">No tools found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => (
            <Card key={tool.id} className="overflow-hidden flex flex-col h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{tool.name}</CardTitle>
                  {tool.isFree ? (
                    <Badge variant="secondary">Free</Badge>
                  ) : (
                    <Badge className="bg-gradient-to-r from-[#36d1dc] to-[#5b86e5] hover:from-[#5b86e5] hover:to-[#36d1dc]">
                      {tool.credits} Credits
                    </Badge>
                  )}
                </div>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2 flex-grow">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Version:</span> {tool.version}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Category:</span>{' '}
                    {tool.category.charAt(0).toUpperCase() + tool.category.slice(1)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Installs:</span> {tool.installCount}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Rating:</span> {tool.rating} / 5
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {isToolInstalled(tool.id) ? (
                  <Button variant="secondary" className="w-full" disabled>
                    Installed
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-gradient-to-r from-[#f953c6] to-[#ff6b6b] hover:from-[#ff6b6b] hover:to-[#f953c6]"
                    onClick={() => installToolMutation.mutate(tool.id)}
                    disabled={installToolMutation.isPending}
                  >
                    {installToolMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Installing...
                      </>
                    ) : (
                      'Install Tool'
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}