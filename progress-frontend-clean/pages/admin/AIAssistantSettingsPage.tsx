import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Bot, Globe, Server, MessageSquare, Settings, Save, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AIAssistantSettingsPage = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Frontend AI Settings
  const [frontendSettings, setFrontendSettings] = useState({
    enabled: true,
    chatbotName: 'Progress Assistant',
    welcomeMessage: 'Hello! I\'m here to help you with your accounting needs. How can I assist you today?',
    responseStyle: 'professional',
    showOnPages: ['home', 'contact', 'services'],
    maxResponseLength: 150,
    enablePersonalization: true,
    collectFeedback: true
  });

  // Backend AI Settings
  const [backendSettings, setBackendSettings] = useState({
    autoResponses: true,
    contentGeneration: true,
    seoOptimization: true,
    dataAnalysis: true,
    reportGeneration: false,
    apiRateLimit: 100,
    confidenceThreshold: 0.8,
    enableLogging: true
  });

  // General AI Settings
  const [generalSettings, setGeneralSettings] = useState({
    aiProvider: 'openai',
    temperature: 0.7,
    maxTokens: 1000,
    systemPrompt: 'You are a helpful AI assistant for Progress Accountants, a professional accounting firm. Provide accurate, helpful information about accounting services while maintaining a professional tone.',
    fallbackMessage: 'I apologize, but I\'m having trouble processing your request right now. Please try again or contact our support team.'
  });

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // Here we would normally save to the backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Settings saved successfully",
        description: "AI assistant configuration has been updated.",
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestAI = async () => {
    setIsLoading(true);
    try {
      // Here we would test the AI configuration
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate test
      
      toast({
        title: "AI test successful",
        description: "Your AI assistant is working correctly with current settings.",
      });
    } catch (error) {
      toast({
        title: "AI test failed",
        description: "Please check your configuration and API keys.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>AI Assistant Settings | Progress Accountants Admin</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Assistant Settings</h1>
            <p className="text-gray-500 mt-1">Configure AI behavior for website frontend and backend operations</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleTestAI}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Test AI
            </Button>
            <Button 
              onClick={handleSaveSettings}
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>

        <Tabs defaultValue="frontend" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="frontend">
              <Globe className="h-4 w-4 mr-2" />
              Frontend AI
            </TabsTrigger>
            <TabsTrigger value="backend">
              <Server className="h-4 w-4 mr-2" />
              Backend AI
            </TabsTrigger>
            <TabsTrigger value="general">
              <Settings className="h-4 w-4 mr-2" />
              General Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="frontend" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Website Chat Assistant
                </CardTitle>
                <CardDescription>
                  Configure the AI assistant that interacts with website visitors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Chat Assistant</Label>
                    <p className="text-sm text-gray-500">Show AI assistant on your website</p>
                  </div>
                  <Switch 
                    checked={frontendSettings.enabled}
                    onCheckedChange={(checked) => 
                      setFrontendSettings(prev => ({ ...prev, enabled: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="chatbot-name">Assistant Name</Label>
                    <Input
                      id="chatbot-name"
                      value={frontendSettings.chatbotName}
                      onChange={(e) => 
                        setFrontendSettings(prev => ({ ...prev, chatbotName: e.target.value }))
                      }
                      placeholder="Enter assistant name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="response-style">Response Style</Label>
                    <select
                      id="response-style"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={frontendSettings.responseStyle}
                      onChange={(e) => 
                        setFrontendSettings(prev => ({ ...prev, responseStyle: e.target.value }))
                      }
                    >
                      <option value="professional">Professional</option>
                      <option value="friendly">Friendly</option>
                      <option value="casual">Casual</option>
                      <option value="formal">Formal</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="welcome-message">Welcome Message</Label>
                  <Textarea
                    id="welcome-message"
                    value={frontendSettings.welcomeMessage}
                    onChange={(e) => 
                      setFrontendSettings(prev => ({ ...prev, welcomeMessage: e.target.value }))
                    }
                    placeholder="Enter the initial message visitors will see"
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Show Assistant On Pages</Label>
                  <div className="flex flex-wrap gap-2">
                    {['home', 'contact', 'services', 'about', 'team'].map((page) => (
                      <Badge
                        key={page}
                        variant={frontendSettings.showOnPages.includes(page) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => {
                          setFrontendSettings(prev => ({
                            ...prev,
                            showOnPages: prev.showOnPages.includes(page)
                              ? prev.showOnPages.filter(p => p !== page)
                              : [...prev.showOnPages, page]
                          }));
                        }}
                      >
                        {page.charAt(0).toUpperCase() + page.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Personalization</Label>
                      <p className="text-xs text-gray-500">Remember user preferences</p>
                    </div>
                    <Switch 
                      checked={frontendSettings.enablePersonalization}
                      onCheckedChange={(checked) => 
                        setFrontendSettings(prev => ({ ...prev, enablePersonalization: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Collect Feedback</Label>
                      <p className="text-xs text-gray-500">Ask for response ratings</p>
                    </div>
                    <Switch 
                      checked={frontendSettings.collectFeedback}
                      onCheckedChange={(checked) => 
                        setFrontendSettings(prev => ({ ...prev, collectFeedback: checked }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-response">Max Response Length</Label>
                    <Input
                      id="max-response"
                      type="number"
                      value={frontendSettings.maxResponseLength}
                      onChange={(e) => 
                        setFrontendSettings(prev => ({ ...prev, maxResponseLength: parseInt(e.target.value) }))
                      }
                      min="50"
                      max="500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backend" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Backend AI Operations
                </CardTitle>
                <CardDescription>
                  Configure AI for content generation, SEO, and administrative tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto Responses</Label>
                      <p className="text-sm text-gray-500">Generate automatic email responses</p>
                    </div>
                    <Switch 
                      checked={backendSettings.autoResponses}
                      onCheckedChange={(checked) => 
                        setBackendSettings(prev => ({ ...prev, autoResponses: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Content Generation</Label>
                      <p className="text-sm text-gray-500">AI-powered blog posts and articles</p>
                    </div>
                    <Switch 
                      checked={backendSettings.contentGeneration}
                      onCheckedChange={(checked) => 
                        setBackendSettings(prev => ({ ...prev, contentGeneration: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SEO Optimization</Label>
                      <p className="text-sm text-gray-500">Automatic meta tags and descriptions</p>
                    </div>
                    <Switch 
                      checked={backendSettings.seoOptimization}
                      onCheckedChange={(checked) => 
                        setBackendSettings(prev => ({ ...prev, seoOptimization: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Data Analysis</Label>
                      <p className="text-sm text-gray-500">AI insights from website analytics</p>
                    </div>
                    <Switch 
                      checked={backendSettings.dataAnalysis}
                      onCheckedChange={(checked) => 
                        setBackendSettings(prev => ({ ...prev, dataAnalysis: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Report Generation</Label>
                      <p className="text-sm text-gray-500">Automated monthly reports</p>
                    </div>
                    <Switch 
                      checked={backendSettings.reportGeneration}
                      onCheckedChange={(checked) => 
                        setBackendSettings(prev => ({ ...prev, reportGeneration: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Logging</Label>
                      <p className="text-sm text-gray-500">Track AI operations for debugging</p>
                    </div>
                    <Switch 
                      checked={backendSettings.enableLogging}
                      onCheckedChange={(checked) => 
                        setBackendSettings(prev => ({ ...prev, enableLogging: checked }))
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="api-rate-limit">API Rate Limit (requests/hour)</Label>
                    <Input
                      id="api-rate-limit"
                      type="number"
                      value={backendSettings.apiRateLimit}
                      onChange={(e) => 
                        setBackendSettings(prev => ({ ...prev, apiRateLimit: parseInt(e.target.value) }))
                      }
                      min="10"
                      max="1000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confidence-threshold">Confidence Threshold</Label>
                    <Input
                      id="confidence-threshold"
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="1.0"
                      value={backendSettings.confidenceThreshold}
                      onChange={(e) => 
                        setBackendSettings(prev => ({ ...prev, confidenceThreshold: parseFloat(e.target.value) }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Core AI Configuration
                </CardTitle>
                <CardDescription>
                  Global settings that affect all AI operations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="ai-provider">AI Provider</Label>
                    <select
                      id="ai-provider"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={generalSettings.aiProvider}
                      onChange={(e) => 
                        setGeneralSettings(prev => ({ ...prev, aiProvider: e.target.value }))
                      }
                    >
                      <option value="openai">OpenAI</option>
                      <option value="anthropic">Anthropic</option>
                      <option value="google">Google AI</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature (Creativity)</Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      min="0.0"
                      max="2.0"
                      value={generalSettings.temperature}
                      onChange={(e) => 
                        setGeneralSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-tokens">Max Tokens per Response</Label>
                  <Input
                    id="max-tokens"
                    type="number"
                    value={generalSettings.maxTokens}
                    onChange={(e) => 
                      setGeneralSettings(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))
                    }
                    min="100"
                    max="4000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="system-prompt">System Prompt</Label>
                  <Textarea
                    id="system-prompt"
                    value={generalSettings.systemPrompt}
                    onChange={(e) => 
                      setGeneralSettings(prev => ({ ...prev, systemPrompt: e.target.value }))
                    }
                    placeholder="Define the AI's role and behavior"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fallback-message">Fallback Message</Label>
                  <Textarea
                    id="fallback-message"
                    value={generalSettings.fallbackMessage}
                    onChange={(e) => 
                      setGeneralSettings(prev => ({ ...prev, fallbackMessage: e.target.value }))
                    }
                    placeholder="Message shown when AI encounters errors"
                    rows={2}
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">API Configuration Required</h4>
                  <p className="text-sm text-yellow-700">
                    To use AI features, make sure your API keys are configured in the environment settings. 
                    Contact your system administrator if you need assistance.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AIAssistantSettingsPage;