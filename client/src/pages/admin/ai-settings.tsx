import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Brain, Zap, Check, Star } from 'lucide-react';
import { aiSettingsService, type AISettingsResponse } from '@/services/ai-settings';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function AISettingsPage() {
  const { toast } = useToast();
  const [isToggling, setIsToggling] = useState(false);

  const { data: settings, isLoading, error } = useQuery<AISettingsResponse>({
    queryKey: ['/api/ai/settings'],
    queryFn: () => aiSettingsService.getSettings(),
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (enableProAI: boolean) => aiSettingsService.updateSettings({ enableProAI }),
    onSuccess: (data) => {
      queryClient.setQueryData(['/api/ai/settings'], data);
      toast({
        title: data.isProAIUser ? "Pro AI Activated" : "Pro AI Deactivated",
        description: data.isProAIUser 
          ? "You now have access to advanced AI models for enhanced content generation."
          : "Switched back to Mistral 7B for basic AI assistance.",
      });
    },
    onError: (error) => {
      toast({
        title: "Settings Update Failed",
        description: error.message || "Failed to update AI settings. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsToggling(false);
    }
  });

  const handleToggleProAI = () => {
    if (!settings || isToggling) return;
    
    setIsToggling(true);
    updateSettingsMutation.mutate(!settings.isProAIUser);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load AI settings. Please refresh the page and try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (!settings) return null;

  const currentModel = settings.availableModels.find(model => model.isActive);
  const proModels = settings.availableModels.filter(model => model.isPro);
  const freeModels = settings.availableModels.filter(model => !model.isPro);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Settings</h1>
        <p className="text-muted-foreground">
          Manage your Smart Site AI configuration and model preferences
        </p>
      </div>

      {/* Current AI Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Current AI Model
          </CardTitle>
          <CardDescription>
            Your Smart Site is currently powered by this AI model
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-lg">{currentModel?.name}</div>
                <div className="text-sm text-muted-foreground">
                  {currentModel?.description}
                </div>
              </div>
            </div>
            <Badge variant={settings.isProAIUser ? "default" : "secondary"}>
              {settings.isProAIUser ? "Pro AI" : "Standard"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Pro AI Toggle */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Pro AI Access
          </CardTitle>
          <CardDescription>
            Enable advanced AI models for superior content generation and analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-medium">
                {settings.isProAIUser ? "Pro AI is Active" : "Pro AI is Inactive"}
              </div>
              <div className="text-sm text-muted-foreground">
                {settings.isProAIUser 
                  ? "You have access to advanced AI models for enhanced performance"
                  : "Upgrade to unlock advanced AI models and superior capabilities"
                }
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={settings.isProAIUser}
                onCheckedChange={handleToggleProAI}
                disabled={isToggling}
              />
              {isToggling && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Models */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Available AI Models</h2>
        
        {/* Free Models */}
        <div>
          <h3 className="text-lg font-medium mb-3 text-muted-foreground">Included Models</h3>
          <div className="space-y-3">
            {freeModels.map((model) => (
              <Card key={model.name} className={model.isActive ? "ring-2 ring-primary" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{model.name}</h4>
                        {model.isActive && (
                          <Badge variant="default" className="text-xs">
                            <Check className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {model.description}
                      </p>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Capabilities:</div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {model.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="h-1 w-1 bg-muted-foreground rounded-full" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pro Models */}
        <div>
          <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            Pro AI Models
          </h3>
          <div className="space-y-3">
            {proModels.map((model) => (
              <Card key={model.name} className={model.isActive ? "ring-2 ring-primary" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{model.name}</h4>
                        <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-600">
                          <Star className="h-3 w-3 mr-1" />
                          Pro
                        </Badge>
                        {model.isActive && (
                          <Badge variant="default" className="text-xs">
                            <Check className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {model.description}
                      </p>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Advanced Capabilities:</div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {model.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Zap className="h-3 w-3 text-yellow-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Information Panel */}
      <Alert className="mt-6">
        <Brain className="h-4 w-4" />
        <AlertDescription>
          <strong>Your Smart Site AI is powered by {currentModel?.name} by default.</strong>
          {!settings.isProAIUser && (
            <span> Unlock advanced AI models to generate better blogs, deeper insights, and superior content.</span>
          )}
          {settings.isProAIUser && (
            <span> You have access to advanced AI models for enhanced content generation and strategic analysis.</span>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}