import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Copy, CheckCircle, Code, Globe, BarChart3, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminEmbedCodeGenerator() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [chatEnabled, setChatEnabled] = useState(true);
  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [eventsEnabled, setEventsEnabled] = useState(true);

  // Get tenant info
  const { data: tenant } = useQuery({
    queryKey: ['/api/tenant/00000000-0000-0000-0000-000000000000']
  });

  const tenantId = tenant?.id || '00000000-0000-0000-0000-000000000000';
  const currentDomain = window.location.origin;
  
  const embedCode = `<script src="${currentDomain}/embed.js?tenantId=${tenantId}" async></script>`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Embed code has been copied successfully",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy the code manually",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Embed on Your Site</h1>
        <p className="text-lg text-gray-600">
          Add AI-powered features to any website with a single line of code
        </p>
      </div>

      <div className="grid gap-8">
        {/* Main Embed Code Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-blue-600" />
              Your Embed Code
            </CardTitle>
            <CardDescription>
              Paste this one line of code into your existing website. It will instantly enable your AI Chat Assistant and traffic tracking. Works with any CMS, site builder, or custom site - no backend integration required.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Embed Code Display */}
            <div className="space-y-3">
              <Label htmlFor="embedCode" className="text-sm font-medium">
                Copy and paste this code into your website
              </Label>
              <div className="relative">
                <Textarea
                  id="embedCode"
                  value={embedCode}
                  readOnly
                  className="font-mono text-sm bg-gray-50 border-2 border-dashed border-gray-300 min-h-[80px] resize-none"
                />
                <Button
                  onClick={handleCopyCode}
                  className="absolute top-2 right-2"
                  size="sm"
                  variant={copied ? "default" : "outline"}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Code
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Installation Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Where to place this code:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>WordPress:</strong> Add to your theme's header.php or use a plugin like "Insert Headers and Footers"</li>
                <li>• <strong>Shopify:</strong> Add to theme.liquid in the &lt;head&gt; section</li>
                <li>• <strong>Squarespace:</strong> Go to Settings → Advanced → Code Injection → Header</li>
                <li>• <strong>Wix:</strong> Add via the Custom Code feature in the site editor</li>
                <li>• <strong>Custom HTML:</strong> Place anywhere in the &lt;head&gt; or before the closing &lt;/body&gt; tag</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Features Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-600" />
              Embed Features
            </CardTitle>
            <CardDescription>
              Configure what functionality will be enabled on your embedded sites
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6">
              {/* Chat Assistant Toggle */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-purple-600" />
                  <div>
                    <Label htmlFor="chat-toggle" className="font-medium">AI Chat Assistant</Label>
                    <p className="text-sm text-gray-600">Shows a floating chat button on embedded sites</p>
                  </div>
                </div>
                <Switch
                  id="chat-toggle"
                  checked={chatEnabled}
                  onCheckedChange={setChatEnabled}
                />
              </div>

              {/* Page Tracking Toggle */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <div>
                    <Label htmlFor="tracking-toggle" className="font-medium">Page View Tracking</Label>
                    <p className="text-sm text-gray-600">Automatically tracks page visits and user sessions</p>
                  </div>
                </div>
                <Switch
                  id="tracking-toggle"
                  checked={trackingEnabled}
                  onCheckedChange={setTrackingEnabled}
                />
              </div>

              {/* Custom Events Toggle */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Code className="h-5 w-5 text-orange-600" />
                  <div>
                    <Label htmlFor="events-toggle" className="font-medium">Custom Event Tracking</Label>
                    <p className="text-sm text-gray-600">Enables advanced event tracking via JavaScript API</p>
                  </div>
                </div>
                <Switch
                  id="events-toggle"
                  checked={eventsEnabled}
                  onCheckedChange={setEventsEnabled}
                />
              </div>
            </div>

            {eventsEnabled && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-900 mb-2">Custom Event Tracking API:</h4>
                <div className="text-sm text-orange-800 space-y-2">
                  <p>Once embedded, use this JavaScript API to track custom events:</p>
                  <code className="block bg-white p-2 rounded border font-mono text-xs">
                    window.NextMonthSmartSite.trackEvent('button_clicked', {`{ userId: 123, page: 'checkout' }`});
                  </code>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tenant Information */}
        <Card>
          <CardHeader>
            <CardTitle>Integration Details</CardTitle>
            <CardDescription>
              Technical information about your embed integration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Tenant ID</Label>
                <Input value={tenantId} readOnly className="font-mono text-sm" />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Embed Script URL</Label>
                <Input value={`${currentDomain}/embed.js`} readOnly className="font-mono text-sm" />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Analytics Endpoint</Label>
                <Input value={`${currentDomain}/api/analytics`} readOnly className="font-mono text-sm" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What Happens Next */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">What happens after embedding?</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800">
            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-1 mt-1">
                  <MessageCircle className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">AI Chat Assistant appears</p>
                  <p className="text-sm text-blue-700">A floating chat button will appear on every page of your website</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-1 mt-1">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Automatic tracking begins</p>
                  <p className="text-sm text-blue-700">Page views, sessions, and user interactions are tracked automatically</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-1 mt-1">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Data appears in your admin</p>
                  <p className="text-sm text-blue-700">View all analytics and chat data in your SmartSite admin dashboard</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}