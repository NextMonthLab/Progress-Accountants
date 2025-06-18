import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Cpu, Zap, MessageSquare } from 'lucide-react';
import { aiGateway, AIGatewayRequest, AIGatewayResponse, AIServiceHealth } from '@/services/ai-gateway';

interface AIGatewayDemoProps {
  className?: string;
}

export default function AIGatewayDemo({ className }: AIGatewayDemoProps) {
  const [prompt, setPrompt] = useState('');
  const [taskType, setTaskType] = useState<AIGatewayRequest['taskType']>('assistant');
  const [response, setResponse] = useState<AIGatewayResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [healthStatus, setHealthStatus] = useState<AIServiceHealth | null>(null);
  const [showHealth, setShowHealth] = useState(false);

  const taskTypes = [
    { value: 'assistant', label: 'Admin Assistant', icon: MessageSquare },
    { value: 'insight-trends', label: 'Insight Trends', icon: Zap },
    { value: 'social-post', label: 'Social Post', icon: MessageSquare },
    { value: 'blog-post', label: 'Blog Post', icon: MessageSquare },
    { value: 'theme-to-blog', label: 'Theme to Blog', icon: MessageSquare },
    { value: 'theme-to-agenda', label: 'Theme to Agenda', icon: MessageSquare },
  ];

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setResponse(null);
    
    try {
      const result = await aiGateway.sendRequest({
        prompt: prompt.trim(),
        taskType,
        context: { demo: true, timestamp: new Date().toISOString() }
      });
      
      setResponse(result);
    } catch (error) {
      setResponse({
        status: 'error',
        data: '',
        taskType,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkHealth = async () => {
    setShowHealth(true);
    try {
      const health = await aiGateway.checkHealth();
      if (health.status === 'success' && health.services) {
        setHealthStatus(health.services);
      }
    } catch (error) {
      console.error('Health check failed:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                AI Gateway Demo
              </CardTitle>
              <CardDescription>
                Test the unified AI Gateway with different task types and models
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={checkHealth}>
              Check Health
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Health Status */}
          {showHealth && healthStatus && (
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">AI Service Status</h4>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Active: {healthStatus.activeService}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${healthStatus.proAI ? 'bg-green-500' : 'bg-gray-300'}`} />
                    Pro AI (GPT-4o)
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${healthStatus.anthropic ? 'bg-green-500' : 'bg-gray-300'}`} />
                    Anthropic
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${healthStatus.mistral ? 'bg-green-500' : 'bg-gray-300'}`} />
                    Mistral 7B
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Task Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Task Type</label>
            <Select value={taskType} onValueChange={(value) => setTaskType(value as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {taskTypes.map((task) => (
                  <SelectItem key={task.value} value={task.value}>
                    <div className="flex items-center gap-2">
                      <task.icon className="h-4 w-4" />
                      {task.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Prompt Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Prompt</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your request..."
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit} 
            disabled={!prompt.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Send Request'
            )}
          </Button>

          {/* Response Display */}
          {response && (
            <Card className={`border-2 ${getStatusColor(response.status)}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Response</CardTitle>
                  <Badge variant="outline" className={getStatusColor(response.status)}>
                    {response.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {response.status === 'success' ? (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Task: {response.taskType}
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap">{response.data}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-red-600 text-sm">
                    <strong>Error:</strong> {response.error || 'Unknown error occurred'}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Usage Examples */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <h4 className="font-medium mb-2">Example Prompts</h4>
              <div className="space-y-1 text-sm text-blue-800">
                <div><strong>Assistant:</strong> "How do I configure SEO settings?"</div>
                <div><strong>Social Post:</strong> "Create a LinkedIn post about AI automation benefits"</div>
                <div><strong>Blog Post:</strong> "Write about digital transformation in accounting"</div>
                <div><strong>Insight Trends:</strong> "What patterns do you see in client engagement?"</div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}