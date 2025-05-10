import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/hooks/use-auth';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  PlayCircle, 
  Calendar, 
  Clock, 
  Sparkles, 
  ExternalLink,
  Tag
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface InstalledTool {
  id: number;
  title: string;
  description: string;
  installedAt: string;
  builder: string;
  isFree: boolean;
  lastUsed?: string;
  tags?: string[];
  isUpdated?: boolean;
}

interface InstalledToolsResponse {
  tools: InstalledTool[];
  count: number;
}

export default function MyToolsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sortMethod, setSortMethod] = useState<'recent' | 'used'>('recent');
  const [activeTool, setActiveTool] = useState<number | null>(null);
  
  // Fetch installed tools
  const { 
    data: installedToolsData = { tools: [], count: 0 } as InstalledToolsResponse, 
    isLoading 
  } = useQuery<InstalledToolsResponse>({
    queryKey: ['/api/tools/access/installed'],
    enabled: !!user,
  });
  
  // Track tool usage
  const launchToolMutation = useMutation({
    mutationFn: async (toolId: number) => {
      const response = await apiRequest('GET', `/api/tools/render/${toolId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to launch tool");
      }
      return await response.json();
    },
    onSuccess: (data, toolId) => {
      setActiveTool(toolId);
      toast({
        title: "Tool launched",
        description: "The tool has been launched successfully",
        variant: "default"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Launch failed",
        description: error.message || "An error occurred while launching the tool",
        variant: "destructive"
      });
    }
  });
  
  // Sort tools based on selected method
  const sortedTools = [...installedToolsData.tools].sort((a, b) => {
    if (sortMethod === 'recent') {
      return new Date(b.installedAt).getTime() - new Date(a.installedAt).getTime();
    } else {
      // If lastUsed is available, sort by it, otherwise fall back to installedAt
      const aTime = a.lastUsed ? new Date(a.lastUsed).getTime() : new Date(a.installedAt).getTime();
      const bTime = b.lastUsed ? new Date(b.lastUsed).getTime() : new Date(b.installedAt).getTime();
      return bTime - aTime;
    }
  });
  
  const handleLaunchTool = (toolId: number) => {
    launchToolMutation.mutate(toolId);
  };
  
  const closeActiveTool = () => {
    setActiveTool(null);
  };
  
  return (
    <div className="container mx-auto p-4 pt-24 min-h-screen">
      <Helmet>
        <title>My Tools - NextMonth</title>
      </Helmet>
      
      <div className="flex flex-col space-y-6">
        {/* Header with title and sorting options */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--navy)]">My Tools</h1>
            <p className="text-gray-600 mt-1">
              Access and launch tools you've installed from the Marketplace
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <div className="bg-gray-100 rounded-lg p-1">
              <Button
                variant={sortMethod === 'recent' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSortMethod('recent')}
                className={sortMethod === 'recent' ? 'bg-teal-600 text-white hover:bg-teal-700' : ''}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Recently Added
              </Button>
              <Button
                variant={sortMethod === 'used' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSortMethod('used')}
                className={sortMethod === 'used' ? 'bg-teal-600 text-white hover:bg-teal-700' : ''}
              >
                <Clock className="h-4 w-4 mr-2" />
                Most Used
              </Button>
            </div>
          </div>
        </div>
        
        {/* Active Tool View */}
        {activeTool && (
          <div className="bg-white rounded-lg shadow-lg p-4 mb-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {installedToolsData.tools.find(t => t.id === activeTool)?.title}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={closeActiveTool}
              >
                Close Tool
              </Button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 h-[500px] flex items-center justify-center">
              <iframe 
                src={`/api/tools/render/${activeTool}`}
                className="w-full h-full border-0 rounded"
                title={installedToolsData.tools.find(t => t.id === activeTool)?.title}
              />
            </div>
          </div>
        )}
        
        {/* Tools Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="flex flex-col h-full">
                <CardHeader>
                  <Skeleton className="h-7 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="flex-grow">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : installedToolsData.count === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="mb-4 bg-gray-100 inline-flex items-center justify-center w-16 h-16 rounded-full">
              <Tag className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No tools installed yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-4">
              Visit the Marketplace to discover and install tools to enhance your accounting platform.
            </p>
            <Button 
              variant="default" 
              className="bg-gradient-to-r from-[#36d1dc] to-[#5b86e5] hover:from-[#5b86e5] hover:to-[#36d1dc] text-white"
              onClick={() => window.location.href = '/marketplace'}
            >
              Browse Marketplace
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTools.map((tool) => (
              <Card 
                key={tool.id} 
                className="flex flex-col h-full hover:shadow-md transition-shadow duration-200 bg-white relative overflow-hidden"
              >
                {tool.isUpdated && (
                  <div className="absolute top-0 right-0">
                    <Badge className="bg-amber-100 text-amber-800 border-0 m-3 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> Updated
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <h3 className="text-xl font-semibold">{tool.title}</h3>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Added {formatDistanceToNow(new Date(tool.installedAt))} ago
                  </div>
                  {tool.lastUsed && (
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Last used {formatDistanceToNow(new Date(tool.lastUsed))} ago
                    </div>
                  )}
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600 mb-4">{tool.description}</p>
                  {tool.tags && tool.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {tool.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-50">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-gradient-to-r from-[#36d1dc] to-[#5b86e5] hover:from-[#5b86e5] hover:to-[#36d1dc] text-white"
                    onClick={() => handleLaunchTool(tool.id)}
                    disabled={launchToolMutation.isPending}
                  >
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Launch Tool
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}