import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Brain, Zap, Check, Star, TrendingUp, AlertTriangle, TestTube } from 'lucide-react';
import { aiSettingsService, type AISettingsResponse, type AIUsageStats } from '@/services/ai-settings';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAIGateway } from '@/hooks/use-ai-gateway';
import { AIUsageLimitModal } from '@/components/ai-usage-limit-modal';

export default function AISettingsPage() {
  const { toast } = useToast();
  const [isToggling, setIsToggling] = useState(false);
  const [testPrompt, setTestPrompt] = useState("Write a brief social media post about accounting best practices.");
  
  const {
    executeAIRequest,
    handleUseFallback,
    handleDismissAlert,
    usageAlert,
    isLoading: aiLoading,
    response: aiResponse,
    isSuccess: aiSuccess
  } = useAIGateway();

  const { data: settings, isLoading, error } = useQuery<AISettingsResponse>({
    queryKey: ['/api/ai/settings'],
    queryFn: () => aiSettingsService.getSettings(),
  });

  const { data: usageStats, isLoading: usageLoading } = useQuery<AIUsageStats>({
    queryKey: ['/api/ai/usage'],
    queryFn: () => aiSettingsService.getUsageStats(),
    refetchInterval: 30000, // Refetch every 30 seconds
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

      {/* AI Usage Tracking */}
      {usageStats && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              AI Usage This Month
            </CardTitle>
            <CardDescription>
              Track your AI model usage and monitor your monthly limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Usage Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Current Usage</span>
                  <span className="font-mono">
                    {usageStats.currentMonthUsage} / {usageStats.isProAIUser ? 'Unlimited' : usageStats.proAILimit} calls
                  </span>
                </div>
                {!usageStats.isProAIUser && (
                  <Progress 
                    value={Math.min((usageStats.currentMonthUsage / usageStats.proAILimit) * 100, 100)}
                    className={`h-2 ${
                      usageStats.currentMonthUsage >= usageStats.proAILimit ? 'bg-red-100' :
                      usageStats.currentMonthUsage >= usageStats.proAILimit * 0.8 ? 'bg-yellow-100' : 
                      'bg-green-100'
                    }`}
                  />
                )}
              </div>

              {/* Usage Statistics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Most Used Model</div>
                  <div className="font-medium">{usageStats.mostUsedModel || 'N/A'}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Total AI Calls</div>
                  <div className="font-medium">{usageStats.totalCalls}</div>
                </div>
              </div>

              {/* Usage Warnings */}
              {!usageStats.isProAIUser && (
                <>
                  {usageStats.currentMonthUsage >= usageStats.proAILimit && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        You've reached your monthly AI limit. Upgrade to Pro AI for unlimited access.
                      </AlertDescription>
                    </Alert>
                  )}
                  {usageStats.currentMonthUsage >= usageStats.proAILimit * 0.8 && 
                   usageStats.currentMonthUsage < usageStats.proAILimit && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        You're approaching your monthly AI limit ({Math.round((usageStats.currentMonthUsage / usageStats.proAILimit) * 100)}% used).
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading state for usage stats */}
      {usageLoading && !usageStats && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              AI Usage This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      )}

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

      {/* AI Limit Testing Interface */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <TestTube className="h-5 w-5 text-blue-600" />
            <div>
              <CardTitle>AI Limit Enforcement Test</CardTitle>
              <CardDescription>
                Test the usage limit enforcement system and fallback mechanisms
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Test Prompt</label>
            <Textarea
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
              placeholder="Enter a prompt to test AI functionality..."
              className="min-h-[80px]"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => executeAIRequest({
                prompt: testPrompt,
                taskType: 'social-post',
                tenantId: "00000000-0000-0000-0000-000000000000"
              })}
              disabled={aiLoading || !testPrompt.trim()}
              className="flex items-center gap-2"
            >
              {aiLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Test AI Request
                </>
              )}
            </Button>

            {aiSuccess && aiResponse && (
              <Badge variant="outline" className="text-green-600 border-green-200">
                ✓ Request Completed
              </Badge>
            )}
          </div>

          {aiSuccess && aiResponse && aiResponse.status === 'success' && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/10 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  AI Response
                </span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300 whitespace-pre-wrap">
                {aiResponse.data}
              </p>
            </div>
          )}

          <div className="text-xs text-muted-foreground mt-2">
            <p><strong>How it works:</strong></p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>If you're under your usage limit, the request processes normally with your selected AI model</li>
              <li>If you've exceeded your Pro AI limit, you'll see a modal offering Mistral 7B as an alternative</li>
              <li>Usage limits reset monthly and are tracked in real-time</li>
              <li>Fallback requests are unlimited and don't count toward your Pro AI usage</li>
            </ul>
          </div>
        </CardContent>
      </Card>

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

      {/* Usage Limit Modal */}
      <AIUsageLimitModal
        usageAlert={usageAlert}
        onUseFallback={handleUseFallback}
        onDismiss={handleDismissAlert}
        isLoading={aiLoading}
      />
    </div>
  );
}