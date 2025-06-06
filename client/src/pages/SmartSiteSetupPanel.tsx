import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Wrench, 
  UserCheck, 
  Copy, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Globe,
  Code,
  CreditCard
} from "lucide-react";

interface SetupRequest {
  hostingProvider: string;
  domainRegistrar: string;
  websiteUrl: string;
  developerContact?: string;
  secureNotes: string;
}

export default function SmartSiteSetupPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [setupData, setSetupData] = useState<SetupRequest>({
    hostingProvider: "",
    domainRegistrar: "",
    websiteUrl: "",
    developerContact: "",
    secureNotes: ""
  });
  const [testResults, setTestResults] = useState<{
    scriptCheck: boolean | null;
    subdomainCheck: boolean | null;
    assistantCheck: boolean | null;
  }>({
    scriptCheck: null,
    subdomainCheck: null,
    assistantCheck: null
  });

  // Generate unique site ID for this user/tenant
  const siteId = user?.id ? `site_${user.id}_${Date.now().toString(36)}` : "DEMO_SITE_ID";

  const embedScript = `<!-- SmartSite Assistant + Tracking -->
<script src="https://cdn.smartsitehub.io/loader.js" data-site-id="${siteId}"></script>`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The embed script has been copied to your clipboard.",
    });
  };

  const downloadPDF = () => {
    // Create a simple text file with setup instructions
    const content = `SmartSite Setup Guide

STEP 1: Create a subdomain
- Suggested: feed.yourdomain.com
- DNS Instructions:
  - Type: CNAME
  - Name: feed
  - Points to: blog.smartsitehub.io

STEP 2: Add embed script
${embedScript}

Place this script in the <head> tag on every page of your website.

STEP 3: Test your connection
Visit /admin/setup to run the setup check and validate your installation.

For support, contact your SmartSite administrator.`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'smartsite-setup-guide.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const runSetupCheck = async () => {
    setTestResults({
      scriptCheck: null,
      subdomainCheck: null,
      assistantCheck: null
    });

    // Simulate setup checks (in real implementation, these would be actual API calls)
    setTimeout(() => {
      setTestResults({
        scriptCheck: Math.random() > 0.3, // 70% success rate
        subdomainCheck: Math.random() > 0.4, // 60% success rate
        assistantCheck: Math.random() > 0.5 // 50% success rate
      });
    }, 2000);
  };

  const submitSetupRequest = useMutation({
    mutationFn: async (data: SetupRequest) => {
      const response = await apiRequest("POST", "/api/setup/request", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Setup request submitted",
        description: "We'll contact you within 24 hours to begin the setup process.",
      });
      setSetupData({
        hostingProvider: "",
        domainRegistrar: "",
        websiteUrl: "",
        developerContact: "",
        secureNotes: ""
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Request failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof SetupRequest, value: string) => {
    setSetupData(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentSetup = () => {
    // In real implementation, this would integrate with LemonSqueezy or Stripe
    toast({
      title: "Payment processing",
      description: "Redirecting to secure payment gateway...",
    });
    // Simulate payment flow
    setTimeout(() => {
      submitSetupRequest.mutate(setupData);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            SmartSite Setup & Integration
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Connect SmartSite to your existing website in just a few steps. 
            Choose to set it up yourself or let our team handle everything for you.
          </p>
        </div>

        {/* Setup Options */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <Tabs defaultValue="diy" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="diy" className="flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  Do It Yourself
                </TabsTrigger>
                <TabsTrigger value="professional" className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Let Us Do It For You
                </TabsTrigger>
              </TabsList>

              {/* DIY Setup Tab */}
              <TabsContent value="diy" className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold mb-2">
                    If you or your developer manage your website, follow these steps
                  </h2>
                  <p className="text-gray-600">Complete setup in under 10 minutes</p>
                </div>

                {/* Step 1: Subdomain */}
                <Card className="border-l-4 border-l-cyan-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-cyan-600" />
                      Step 1: Create a subdomain
                    </CardTitle>
                    <CardDescription>
                      Set up a subdomain for SmartSite's content feeds
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium mb-2">Suggested: feed.yourdomain.com</p>
                      <div className="text-sm space-y-1">
                        <p><strong>DNS Instructions:</strong></p>
                        <p>• Type: CNAME</p>
                        <p>• Name: feed</p>
                        <p>• Points to: blog.smartsitehub.io</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Step 2: Embed Script */}
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5 text-green-600" />
                      Step 2: Add embed script
                    </CardTitle>
                    <CardDescription>
                      Place this script in the &lt;head&gt; tag on every page
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{embedScript}</pre>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => copyToClipboard(embedScript)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Copy className="h-4 w-4" />
                        Copy Script
                      </Button>
                      <Button 
                        onClick={downloadPDF}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download Guide
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Step 3: Test Connection */}
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      Step 3: Test your connection
                    </CardTitle>
                    <CardDescription>
                      Validate that SmartSite is properly installed
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button 
                      onClick={runSetupCheck}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white"
                      disabled={Object.values(testResults).some(v => v === null) && Object.values(testResults).some(v => v !== null)}
                    >
                      {Object.values(testResults).some(v => v === null) && Object.values(testResults).some(v => v !== null) ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Run Setup Check
                    </Button>

                    {Object.values(testResults).some(v => v !== null) && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {testResults.scriptCheck ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className={testResults.scriptCheck ? "text-green-600" : "text-red-600"}>
                            Script is {testResults.scriptCheck ? "live" : "not detected"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {testResults.subdomainCheck ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className={testResults.subdomainCheck ? "text-green-600" : "text-red-600"}>
                            Subdomain {testResults.subdomainCheck ? "resolves correctly" : "not found"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {testResults.assistantCheck ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className={testResults.assistantCheck ? "text-green-600" : "text-red-600"}>
                            Assistant is {testResults.assistantCheck ? "initialized" : "not responding"}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Professional Setup Tab */}
              <TabsContent value="professional" className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold mb-2">
                    Let our team handle the setup
                  </h2>
                  <p className="text-gray-600">Professional installation with 24-hour turnaround</p>
                  <Badge variant="secondary" className="mt-2 bg-cyan-100 text-cyan-800">
                    £99 one-off setup fee
                  </Badge>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Setup Request Form</CardTitle>
                    <CardDescription>
                      Provide your website details and we'll handle the rest
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hosting">Hosting Provider</Label>
                        <Input
                          id="hosting"
                          placeholder="e.g. GoDaddy, Bluehost, AWS"
                          value={setupData.hostingProvider}
                          onChange={(e) => handleInputChange("hostingProvider", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="registrar">Domain Registrar</Label>
                        <Input
                          id="registrar"
                          placeholder="e.g. Namecheap, Google Domains"
                          value={setupData.domainRegistrar}
                          onChange={(e) => handleInputChange("domainRegistrar", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website Login / Admin URL</Label>
                      <Input
                        id="website"
                        placeholder="https://yourdomain.com/wp-admin"
                        value={setupData.websiteUrl}
                        onChange={(e) => handleInputChange("websiteUrl", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="developer">Developer Contact Info (optional)</Label>
                      <Input
                        id="developer"
                        placeholder="Email or phone number"
                        value={setupData.developerContact}
                        onChange={(e) => handleInputChange("developerContact", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Secure Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any passwords, special instructions, or access details"
                        value={setupData.secureNotes}
                        onChange={(e) => handleInputChange("secureNotes", e.target.value)}
                        rows={4}
                      />
                    </div>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        All information is encrypted and securely stored. Our team will contact you 
                        within 24 hours to confirm the setup process.
                      </AlertDescription>
                    </Alert>

                    <Button 
                      onClick={handlePaymentSetup}
                      disabled={!setupData.hostingProvider || !setupData.websiteUrl || submitSetupRequest.isPending}
                      className="w-full bg-cyan-600 hover:bg-cyan-700 text-white flex items-center gap-2"
                    >
                      {submitSetupRequest.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CreditCard className="h-4 w-4" />
                      )}
                      Pay £99 & Submit Setup Request
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}