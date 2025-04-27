import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, CheckCircle2, LockKeyhole } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { cn } from '@/lib/utils';

// Emblem type definition
interface Emblem {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  icon: React.ReactNode;
}

/**
 * Emblem Gallery Component
 * 
 * This component displays the user's unlocked emblems in an elegant, organized gallery.
 * It's part of the cinematic gamification system in the Blueprint Blueprint.
 * 
 * @since v1.1.1
 */
export default function EmblemGallery() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [emblems, setEmblems] = useState<Emblem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'unlocked'>('all');
  
  // Get emblem data
  useEffect(() => {
    const loadEmblems = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const response = await apiRequest('GET', `/api/onboarding/${user.id}`);
        const data = await response.json();
        
        // Map the API data to emblems
        const mappedEmblems: Emblem[] = [
          {
            id: 'identity-emblem',
            name: 'Identity Activated',
            description: 'Your business identity has been established',
            unlocked: data.data?.some((step: any) => step.stage === 'identity' && step.status === 'completed') || false,
            unlockedAt: data.data?.find((step: any) => step.stage === 'identity' && step.status === 'completed')?.updatedAt,
            icon: <CheckCircle2 className="h-6 w-6" />
          },
          {
            id: 'foundation-emblem',
            name: 'Beacon Deployed',
            description: 'Your core pages are now operational',
            unlocked: data.data?.some((step: any) => step.stage === 'foundation' && step.status === 'completed') || false,
            unlockedAt: data.data?.find((step: any) => step.stage === 'foundation' && step.status === 'completed')?.updatedAt,
            icon: <CheckCircle2 className="h-6 w-6" />
          },
          {
            id: 'media-emblem',
            name: 'Signal Online',
            description: 'Your visual identity is established',
            unlocked: data.data?.some((step: any) => step.stage === 'media' && step.status === 'completed') || false,
            unlockedAt: data.data?.find((step: any) => step.stage === 'media' && step.status === 'completed')?.updatedAt,
            icon: <CheckCircle2 className="h-6 w-6" />
          },
          {
            id: 'tool-emblem',
            name: 'Systems Engaged',
            description: 'You\'ve connected your first extension',
            unlocked: data.data?.some((step: any) => step.stage === 'tool' && step.status === 'completed') || false,
            unlockedAt: data.data?.find((step: any) => step.stage === 'tool' && step.status === 'completed')?.updatedAt,
            icon: <CheckCircle2 className="h-6 w-6" />
          },
          {
            id: 'blueprint-emblem',
            name: 'Blueprint Locked',
            description: 'Your business architecture is secured',
            unlocked: data.data?.some((step: any) => step.stage === 'blueprint' && step.status === 'completed') || false,
            unlockedAt: data.data?.find((step: any) => step.stage === 'blueprint' && step.status === 'completed')?.updatedAt,
            icon: <CheckCircle2 className="h-6 w-6" />
          }
        ];
        
        setEmblems(mappedEmblems);
      } catch (error) {
        console.error('Error loading emblems:', error);
        toast({
          title: 'Error loading emblems',
          description: 'Unable to retrieve your achievement data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadEmblems();
  }, [user, toast]);
  
  // Calculate statistics
  const totalEmblems = emblems.length;
  const unlockedEmblems = emblems.filter(emblem => emblem.unlocked).length;
  const unlockedPercentage = totalEmblems > 0 ? (unlockedEmblems / totalEmblems) * 100 : 0;
  
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Emblems</CardTitle>
          <CardDescription>Loading your accomplishments...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Your Emblems</CardTitle>
            <CardDescription>Track your blueprint activation progress</CardDescription>
          </div>
          <Badge variant="outline" className="text-primary border-primary">
            {unlockedEmblems}/{totalEmblems} Unlocked
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="all" onValueChange={(value) => setActiveTab(value as 'all' | 'unlocked')}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Emblems</TabsTrigger>
            <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {emblems.map((emblem) => (
                <TooltipProvider key={emblem.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className={cn(
                          "flex flex-col items-center justify-center p-4 rounded-lg transition-all duration-300 cursor-pointer h-32",
                          emblem.unlocked 
                            ? "bg-primary/10 hover:bg-primary/15 border border-primary/20" 
                            : "bg-muted/30 opacity-60 hover:opacity-80 border border-muted"
                        )}
                      >
                        <div 
                          className={cn(
                            "h-12 w-12 rounded-full flex items-center justify-center mb-2",
                            emblem.unlocked ? "bg-primary/20" : "bg-muted"
                          )}
                        >
                          {emblem.unlocked ? (
                            emblem.icon
                          ) : (
                            <LockKeyhole className="h-6 w-6 text-muted-foreground/50" />
                          )}
                        </div>
                        <p className={cn(
                          "text-sm font-medium text-center",
                          !emblem.unlocked && "text-muted-foreground"
                        )}>
                          {emblem.name}
                        </p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1 p-1">
                        <p className="font-medium">{emblem.name}</p>
                        <p className="text-xs">{emblem.description}</p>
                        {emblem.unlocked && emblem.unlockedAt && (
                          <p className="text-xs text-muted-foreground">
                            Unlocked on {formatDate(emblem.unlockedAt)}
                          </p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="unlocked" className="mt-0">
            {unlockedEmblems === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                <p>No emblems unlocked yet.</p>
                <p className="text-sm mt-1">Complete onboarding steps to earn emblems.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {emblems.filter(emblem => emblem.unlocked).map((emblem) => (
                  <TooltipProvider key={emblem.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div 
                          className="flex flex-col items-center justify-center p-4 rounded-lg bg-primary/10 hover:bg-primary/15 border border-primary/20 transition-all duration-300 cursor-pointer h-32"
                        >
                          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                            {emblem.icon}
                          </div>
                          <p className="text-sm font-medium text-center">{emblem.name}</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1 p-1">
                          <p className="font-medium">{emblem.name}</p>
                          <p className="text-xs">{emblem.description}</p>
                          {emblem.unlockedAt && (
                            <p className="text-xs text-muted-foreground">
                              Unlocked on {formatDate(emblem.unlockedAt)}
                            </p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t pt-4 pb-3">
        <div className="w-full">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-muted-foreground">Blueprint Activation</span>
            <span className="font-medium">{unlockedPercentage.toFixed(0)}%</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500" 
              style={{ width: `${unlockedPercentage}%` }}
            ></div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}