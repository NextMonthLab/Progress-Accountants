import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Bot, MessageSquare, Zap, Settings2, Save } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { AutopilotSettings, InsertAutopilotSettings } from "@shared/schema";

export default function AutopilotControlPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch current autopilot settings
  const { data: settings, isLoading } = useQuery<AutopilotSettings>({
    queryKey: ["/api/autopilot/settings"],
    enabled: !!user,
  });

  // Form state
  const [formData, setFormData] = useState<Partial<InsertAutopilotSettings>>({
    blogAutopilotEnabled: false,
    postingFrequency: "weekly",
    contentSources: [],
    aiTonePreference: "professional",
    reviewBeforePublish: true,
    emailNotifyOnLiveChat: false,
    notifyOnlyHighLeadScore: false,
    leadScoreThreshold: 70,
    autoPauseAssistant: false,
  });

  // Update form data when settings load
  React.useEffect(() => {
    if (settings) {
      setFormData({
        blogAutopilotEnabled: Boolean(settings.blogAutopilotEnabled),
        postingFrequency: settings.postingFrequency || "weekly",
        contentSources: Array.isArray(settings.contentSources) ? settings.contentSources : [],
        aiTonePreference: settings.aiTonePreference || "professional",
        reviewBeforePublish: Boolean(settings.reviewBeforePublish ?? true),
        emailNotifyOnLiveChat: Boolean(settings.emailNotifyOnLiveChat),
        notifyOnlyHighLeadScore: Boolean(settings.notifyOnlyHighLeadScore),
        leadScoreThreshold: settings.leadScoreThreshold || 70,
        autoPauseAssistant: Boolean(settings.autoPauseAssistant),
      });
    }
  }, [settings]);

  // Save settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: async (data: Partial<InsertAutopilotSettings>) => {
      const response = await apiRequest("POST", "/api/autopilot/settings", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/autopilot/settings"] });
      toast({
        title: "Settings saved",
        description: "Your autopilot settings have been updated successfully.",
      });
      setIsUpdating(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to save settings",
        description: error.message,
        variant: "destructive",
      });
      setIsUpdating(false);
    },
  });

  const handleSave = () => {
    setIsUpdating(true);
    saveSettingsMutation.mutate(formData);
  };

  const updateFormData = (field: keyof InsertAutopilotSettings, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleContentSource = (source: string) => {
    const currentSources = Array.isArray(formData.contentSources) ? formData.contentSources : [];
    const updated = currentSources.includes(source)
      ? currentSources.filter((s: string) => s !== source)
      : [...currentSources, source];
    updateFormData("contentSources", updated);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Bot className="h-8 w-8 text-teal-400" />
          SmartSite Autopilot
        </h1>
        <p className="text-gray-400">
          Configure automated content generation and intelligent notification systems
        </p>
      </div>

      <div className="grid gap-6">
        {/* Blog Autopilot Section */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-teal-400" />
              Blog Autopilot
            </CardTitle>
            <CardDescription>
              Automatically generate and publish blog content based on your business insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Enable Blog Autopilot */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-white font-medium">Enable Blog Autopilot</Label>
                <p className="text-sm text-gray-400">
                  Automatically generate blog posts from your business data
                </p>
              </div>
              <Switch
                checked={Boolean(formData.blogAutopilotEnabled)}
                onCheckedChange={(checked) => updateFormData("blogAutopilotEnabled", checked)}
              />
            </div>

            {formData.blogAutopilotEnabled && (
              <>
                <Separator className="bg-gray-700" />
                
                {/* Posting Frequency */}
                <div className="space-y-2">
                  <Label className="text-white font-medium">Posting Frequency</Label>
                  <Select
                    value={formData.postingFrequency || ""}
                    onValueChange={(value) => updateFormData("postingFrequency", value)}
                  >
                    <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="fortnightly">Fortnightly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Content Sources */}
                <div className="space-y-3">
                  <Label className="text-white font-medium">Content Sources</Label>
                  <p className="text-sm text-gray-400">
                    Select what data sources to use for content generation
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "chat_questions", label: "Chat Questions", description: "Common user inquiries" },
                      { id: "lead_insights", label: "Lead Insights", description: "Customer behavior patterns" },
                      { id: "market_trends", label: "Market Trends", description: "Industry developments" },
                    ].map((source) => (
                      <Button
                        key={source.id}
                        variant={Array.isArray(formData.contentSources) && formData.contentSources.includes(source.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleContentSource(source.id)}
                        className={`${
                          Array.isArray(formData.contentSources) && formData.contentSources.includes(source.id)
                            ? "bg-teal-600 hover:bg-teal-700 text-white border-teal-600"
                            : "bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-600"
                        }`}
                      >
                        {source.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* AI Tone Preference */}
                <div className="space-y-2">
                  <Label className="text-white font-medium">AI Tone Preference</Label>
                  <Select
                    value={formData.aiTonePreference || ""}
                    onValueChange={(value) => updateFormData("aiTonePreference", value)}
                  >
                    <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="authoritative">Authoritative</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Review Before Publish */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-white font-medium">Review Before Publish</Label>
                    <p className="text-sm text-gray-400">
                      Send drafts to Admin Panel for approval before publishing
                    </p>
                  </div>
                  <Switch
                    checked={formData.reviewBeforePublish}
                    onCheckedChange={(checked) => updateFormData("reviewBeforePublish", checked)}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Chat Override Notifications Section */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-teal-400" />
              Chat Override Notifications
            </CardTitle>
            <CardDescription>
              Configure when you want to be alerted and take control of conversations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Notifications */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-white font-medium">Email Notifications for Live Chat</Label>
                <p className="text-sm text-gray-400">
                  Get notified by email when a user starts chatting
                </p>
              </div>
              <Switch
                checked={formData.emailNotifyOnLiveChat}
                onCheckedChange={(checked) => updateFormData("emailNotifyOnLiveChat", checked)}
              />
            </div>

            {/* High Lead Score Only */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-white font-medium">Notify Only for High-Value Leads</Label>
                <p className="text-sm text-gray-400">
                  Only send notifications when lead score exceeds threshold
                </p>
              </div>
              <Switch
                checked={formData.notifyOnlyHighLeadScore}
                onCheckedChange={(checked) => updateFormData("notifyOnlyHighLeadScore", checked)}
              />
            </div>

            {formData.notifyOnlyHighLeadScore && (
              <div className="space-y-2">
                <Label className="text-white font-medium">Lead Score Threshold</Label>
                <Select
                  value={formData.leadScoreThreshold?.toString()}
                  onValueChange={(value) => updateFormData("leadScoreThreshold", parseInt(value))}
                >
                  <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50+</SelectItem>
                    <SelectItem value="60">60+</SelectItem>
                    <SelectItem value="70">70+</SelectItem>
                    <SelectItem value="80">80+</SelectItem>
                    <SelectItem value="90">90+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Auto-pause Assistant */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-white font-medium">Auto-pause Assistant</Label>
                <p className="text-sm text-gray-400">
                  Automatically pause the AI assistant when you open a conversation
                </p>
              </div>
              <Switch
                checked={formData.autoPauseAssistant}
                onCheckedChange={(checked) => updateFormData("autoPauseAssistant", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Integration Status */}
        <Alert className="bg-blue-900/20 border-blue-700">
          <AlertCircle className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-200">
            <strong>Integration Ready:</strong> External systems can trigger blog generation via{" "}
            <code className="bg-gray-800 px-2 py-1 rounded text-teal-400">/api/autopilot/trigger-blog</code>{" "}
            and send email alerts via{" "}
            <code className="bg-gray-800 px-2 py-1 rounded text-teal-400">/api/autopilot/notify-takeover</code>
          </AlertDescription>
        </Alert>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isUpdating}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            {isUpdating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}