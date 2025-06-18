import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { 
  Star, 
  Award, 
  Sparkles, 
  Rocket, 
  Medal, 
  Zap, 
  Crown,
  BookOpen,
  PenTool,
  Share,
  Users,
  Globe,
  LineChart,
  Search,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Define emblem types
interface Emblem {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  unlockedAt?: Date;
}

// Props interface
interface EmblemGalleryProps {
  layout?: 'grid' | 'carousel';
  showLocked?: boolean;
}

// Default emblems
const defaultEmblems: Emblem[] = [
  {
    id: 'pioneer',
    name: 'Pioneer',
    description: 'Completed the initial platform onboarding',
    icon: <Rocket className="h-8 w-8 text-orange-500" />,
    unlocked: false
  },
  {
    id: 'navigator',
    name: 'Navigator',
    description: 'Explored all main sections of the platform',
    icon: <Sparkles className="h-8 w-8 text-emerald-500" />,
    unlocked: false
  },
  {
    id: 'content_creator',
    name: 'Content Creator',
    description: 'Published your first piece of content',
    icon: <PenTool className="h-8 w-8 text-blue-500" />,
    unlocked: false
  },
  {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Created your first social media post',
    icon: <Share className="h-8 w-8 text-indigo-500" />,
    unlocked: false
  },
  {
    id: 'team_builder',
    name: 'Team Builder',
    description: 'Added your first team member',
    icon: <Users className="h-8 w-8 text-amber-500" />,
    unlocked: false
  },
  {
    id: 'site_master',
    name: 'Site Master',
    description: 'Published your website successfully',
    icon: <Globe className="h-8 w-8 text-teal-500" />,
    unlocked: false
  },
  {
    id: 'insight_analyst',
    name: 'Insight Analyst',
    description: 'Reviewed your first analytics report',
    icon: <LineChart className="h-8 w-8 text-violet-500" />,
    unlocked: false
  },
  {
    id: 'seo_explorer',
    name: 'SEO Explorer',
    description: 'Optimized your first page for search engines',
    icon: <Search className="h-8 w-8 text-rose-500" />,
    unlocked: false
  },
  {
    id: 'blueprint_architect',
    name: 'Blueprint Architect',
    description: 'Created your first site blueprint',
    icon: <Shield className="h-8 w-8 text-cyan-500" />,
    unlocked: false
  },
  {
    id: 'mastery',
    name: 'Platform Mastery',
    description: 'Unlocked all platform emblems',
    icon: <Crown className="h-8 w-8 text-yellow-500" />,
    unlocked: false
  }
];

const EmblemGallery: React.FC<EmblemGalleryProps> = ({ 
  layout = 'grid',
  showLocked = true
}) => {
  const { user } = useAuth();
  
  const { data, isLoading } = useQuery({
    queryKey: ['/api/emblems', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      try {
        const response = await fetch(`/api/onboarding/${user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch emblems');
        }
        
        const data = await response.json();
        
        // Process emblems from onboarding data
        const unlockedEmblems = data.data
          .filter((stage: any) => stage.status === 'completed')
          .map((stage: any) => {
            // Map stage to emblem if possible
            const emblemId = stage.stage.replace('stage_', ''); 
            return {
              emblemId,
              unlockedAt: new Date(stage.updated_at)
            };
          });
        
        return {
          emblems: defaultEmblems.map(emblem => {
            const matchingEmblem = unlockedEmblems.find((e: any) => 
              e.emblemId === emblem.id || 
              (e.emblemId === 'complete' && emblem.id === 'mastery')
            );
            
            if (matchingEmblem) {
              return {
                ...emblem,
                unlocked: true,
                unlockedAt: matchingEmblem.unlockedAt
              };
            }
            
            return emblem;
          })
        };
      } catch (error) {
        console.error('Error fetching emblems:', error);
        return { emblems: defaultEmblems };
      }
    },
    enabled: !!user?.id,
  });
  
  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="w-full flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Get emblems from data or use defaults
  const emblems = data?.emblems || defaultEmblems;
  
  // Filter emblems based on showLocked prop
  const filteredEmblems = showLocked ? emblems : emblems.filter(emblem => emblem.unlocked);
  
  if (filteredEmblems.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-gray-50">
        <p className="text-muted-foreground">No emblems found. Complete onboarding tasks to earn emblems!</p>
      </div>
    );
  }
  
  // Grid layout
  if (layout === 'grid') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {filteredEmblems.map((emblem) => (
          <EmblemCard key={emblem.id} emblem={emblem} />
        ))}
      </div>
    );
  }
  
  // Carousel layout
  return (
    <div className="flex overflow-x-auto py-4 pb-6 space-x-4 snap-x">
      {filteredEmblems.map((emblem) => (
        <div key={emblem.id} className="snap-center shrink-0 w-64">
          <EmblemCard emblem={emblem} />
        </div>
      ))}
    </div>
  );
};

// Single emblem card component
const EmblemCard: React.FC<{ emblem: Emblem }> = ({ emblem }) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Card className={`overflow-hidden transition-all duration-300 ${emblem.unlocked ? 'bg-white shadow-md' : 'bg-gray-100/60 saturate-0'}`}>
            <CardHeader className="p-3 pb-0">
              <CardTitle className="text-sm truncate">{emblem.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex flex-col items-center justify-center h-24">
              <div className={`transform transition-all duration-300 ${emblem.unlocked ? 'scale-110' : 'opacity-50'}`}>
                {emblem.icon}
              </div>
            </CardContent>
            <CardFooter className="p-3 pt-0">
              <CardDescription className="text-xs">
                {emblem.unlocked 
                  ? <span className="text-emerald-600 font-medium">Unlocked</span>
                  : <span className="text-muted-foreground">Locked</span>
                }
              </CardDescription>
            </CardFooter>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="top" className="p-3 max-w-xs">
          <div className="space-y-2">
            <h4 className="font-semibold">{emblem.name}</h4>
            <p className="text-sm">{emblem.description}</p>
            {emblem.unlocked && emblem.unlockedAt && (
              <p className="text-xs text-muted-foreground">
                Unlocked on {emblem.unlockedAt.toLocaleDateString()}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default EmblemGallery;