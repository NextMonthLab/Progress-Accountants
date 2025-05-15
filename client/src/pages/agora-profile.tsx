import React, { useState, useEffect, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Calendar, Clock, Edit, Plus, AlertCircle, X, Bookmark, ExternalLink, Loader2 } from 'lucide-react';

// Placeholder types (will be imported from @shared/agora later)
type Pillar = {
  id: string;
  name: string;
  description?: string;
  color: string;
  businessId: string;
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
};

type Space = {
  id: string;
  name: string;
  description?: string;
  pillarId?: string;
  businessId: string;
  status: 'active' | 'completed' | 'paused';
  priority: number;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  isArchived: boolean;
};

type Nudge = {
  message: string;
  actionId?: string;
  priority: number;
};

const AgoraProfilePage: React.FC = () => {
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);
  const [dismissedNudges, setDismissedNudges] = useState<Set<number>>(new Set());

  // Fetch pillars for the business
  const { 
    data: pillars = [], 
    isLoading: isPillarsLoading, 
    error: pillarsError 
  } = useQuery<Pillar[]>({
    queryKey: ['/api/agora/pillars'],
    retry: 1,
    refetchOnWindowFocus: false
  });

  // Fetch spaces for the business, filtered by pillar if selected
  const { 
    data: spaces = [], 
    isLoading: isSpacesLoading,
    error: spacesError
  } = useQuery<Space[]>({
    queryKey: selectedPillar 
      ? ['/api/agora/pillars', selectedPillar, 'spaces'] 
      : ['/api/agora/spaces'],
    retry: 1,
    refetchOnWindowFocus: false
  });

  // Fetch nudge suggestions
  const { 
    data: nudges = [], 
    isLoading: isNudgesLoading,
    error: nudgesError
  } = useQuery<Nudge[]>({
    queryKey: ['/api/agora/nudges'],
    retry: 1,
    refetchOnWindowFocus: false
  });

  // Filter out dismissed nudges
  const activeNudges = nudges.filter((_, index) => !dismissedNudges.has(index));

  // Handle nudge dismissal
  const dismissNudge = (index: number) => {
    setDismissedNudges(prev => new Set([...prev, index]));
  };

  // Get count of spaces for each pillar
  const getSpaceCountForPillar = (pillarId: string) => {
    return spaces.filter(space => space.pillarId === pillarId).length;
  };

  // Format date to display in a readable format
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  };

  // Get appropriate color for space status badge
  const getStatusColor = (status: 'active' | 'completed' | 'paused') => {
    switch (status) {
      case 'active': return 'bg-green-500 hover:bg-green-600';
      case 'completed': return 'bg-blue-500 hover:bg-blue-600';
      case 'paused': return 'bg-amber-500 hover:bg-amber-600';
      default: return 'bg-slate-500 hover:bg-slate-600';
    }
  };

  // Get a color for a pillar based on its ID (for demo purposes)
  const getPillarColor = (pillar: Pillar) => {
    return pillar.color || '#008080'; // Default to teal if no color specified
  };

  // Show a loading state when any of the critical data is loading
  const isLoading = isPillarsLoading || isSpacesLoading || isNudgesLoading;
  const hasError = pillarsError || spacesError || nudgesError;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-medium">Loading your Agora Profile...</h2>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <Alert variant="destructive" className="mb-4 w-full max-w-lg">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was a problem loading your Agora Profile. Please try again later.
          </AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Your Business, Seen Clearly</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Agora helps you focus on what matters most—one Space at a time.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-8">
        {/* Pillars Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Pillars</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Pillar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a New Pillar</DialogTitle>
                  <DialogDescription>
                    Create a new business pillar to organize your spaces.
                  </DialogDescription>
                </DialogHeader>
                {/* Pillar creation form would go here */}
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Create Pillar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pillars.length > 0 ? (
              pillars.map(pillar => (
                <Card 
                  key={pillar.id}
                  className="cursor-pointer transition-all hover:shadow-md"
                  onClick={() => setSelectedPillar(pillar.id === selectedPillar ? null : pillar.id)}
                  style={{ borderLeft: `4px solid ${getPillarColor(pillar)}` }}
                >
                  <CardHeader className="pb-2">
                    <CardTitle>{pillar.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      {pillar.description || "No description provided."}
                    </p>
                    <div className="flex items-center text-xs text-slate-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Updated {formatDate(pillar.updatedAt)}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Badge variant="outline">
                      {getSpaceCountForPillar(pillar.id)} Spaces
                    </Badge>
                    {selectedPillar === pillar.id && (
                      <Badge className="ml-2" variant="secondary">Selected</Badge>
                    )}
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card className="col-span-full">
                <CardHeader>
                  <CardTitle>No Pillars Yet</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400">
                    Start by creating your first business pillar to organize your spaces.
                  </p>
                </CardContent>
                <CardFooter>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Pillar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add a New Pillar</DialogTitle>
                        <DialogDescription>
                          Create a new business pillar to organize your spaces.
                        </DialogDescription>
                      </DialogHeader>
                      {/* Pillar creation form would go here */}
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button>Create Pillar</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            )}
          </div>
        </section>

        {/* Spaces Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">
              Spaces
              {selectedPillar && pillars.find(p => p.id === selectedPillar) && (
                <span className="ml-2 text-lg font-normal text-slate-500">
                  in {pillars.find(p => p.id === selectedPillar)?.name}
                </span>
              )}
            </h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Space
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a New Space</DialogTitle>
                  <DialogDescription>
                    Add a new business space to track an important initiative.
                  </DialogDescription>
                </DialogHeader>
                {/* Space creation form would go here */}
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Create Space</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <ScrollArea className="h-[380px] w-full rounded-md border p-4">
            <div className="flex space-x-4 pb-4 overflow-x-auto">
              {spaces.length > 0 ? (
                spaces.map(space => (
                  <Card key={space.id} className="min-w-[280px] max-w-[280px]">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-lg">{space.name}</CardTitle>
                        <Badge className={getStatusColor(space.status)}>
                          {space.status.charAt(0).toUpperCase() + space.status.slice(1)}
                        </Badge>
                      </div>
                      {space.pillarId && pillars.find(p => p.id === space.pillarId) && (
                        <CardDescription>
                          {pillars.find(p => p.id === space.pillarId)?.name}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        {space.description || "No description provided."}
                      </p>
                      
                      {/* Progress bar */}
                      <div className="w-full bg-slate-200 rounded-full h-2.5 mb-4 dark:bg-slate-700">
                        <div 
                          className="bg-teal-600 h-2.5 rounded-full dark:bg-teal-500" 
                          style={{ width: `${space.progress}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-slate-500">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Updated {formatDate(space.updatedAt)}</span>
                        </div>
                        {space.dueDate && (
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Due {formatDate(space.dueDate)}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">
                        Open Space
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card className="min-w-full">
                  <CardHeader>
                    <CardTitle>No Spaces Yet</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-400">
                      Create your first business space to start tracking an important initiative.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Your First Space
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create a New Space</DialogTitle>
                          <DialogDescription>
                            Add a new business space to track an important initiative.
                          </DialogDescription>
                        </DialogHeader>
                        {/* Space creation form would go here */}
                        <DialogFooter>
                          <Button variant="outline">Cancel</Button>
                          <Button>Create Space</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              )}
            </div>
          </ScrollArea>
        </section>

        {/* Whisper Suggestions Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Whisper Suggestions</h2>
          
          {activeNudges.length > 0 ? (
            <div className="space-y-4">
              {activeNudges.map((nudge, index) => (
                <Alert key={index} className="relative">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="ml-2">Business Insight</AlertTitle>
                  <AlertDescription className="ml-2">
                    {nudge.message}
                  </AlertDescription>
                  <div className="absolute top-2 right-2 space-x-2">
                    <Button size="sm" variant="outline" onClick={() => dismissNudge(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                    {nudge.actionId && (
                      <Button size="sm">
                        Act Now
                      </Button>
                    )}
                  </div>
                </Alert>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Active Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  As your business activity grows, Agora will provide personalized insights and suggestions here.
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Companion App Download Prompt */}
        <section className="mt-8 text-center">
          <Card className="bg-slate-50 dark:bg-slate-900">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Want to manage your business Spaces on the go?</h3>
              <Button className="mt-2" variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                Download the Agora Companion App
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default AgoraProfilePage;