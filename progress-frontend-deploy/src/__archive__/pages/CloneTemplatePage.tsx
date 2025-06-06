import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, Copy, FileWarning, LoaderCircle, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import SiteVariantSelector from '@/components/site-variant/SiteVariantSelector';
import AdminLayout from '@/layouts/AdminLayout';
import { SiteVariantConfig } from '@shared/site_variants';
import { useAuth } from '@/hooks/use-auth';

// Steps of the cloning process
type CloneStep = 'template' | 'variant' | 'confirmation' | 'processing' | 'complete';

const CloneTemplatePage: React.FC = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<CloneStep>('template');
  const [selectedVariant, setSelectedVariant] = useState<SiteVariantConfig | null>(null);
  const [cloneStatus, setCloneStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newTenantId, setNewTenantId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Check if user has super admin privileges
  const isSuperAdmin = user?.isSuperAdmin || user?.userType === 'super_admin';
  
  const handleTemplateSelect = async () => {
    try {
      // In a real implementation, we would verify the template selection
      // For now, we'll just move to the variant selection step
      setCurrentStep('variant');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to select template. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleVariantSelected = (variant: SiteVariantConfig) => {
    setSelectedVariant(variant);
  };
  
  const handleVariantConfirmed = () => {
    setCurrentStep('confirmation');
  };
  
  const handleConfirmClone = async () => {
    if (!selectedVariant) {
      toast({
        title: "Error",
        description: "Please select a site variant first",
        variant: "destructive"
      });
      return;
    }
    
    // Check if user has super admin privileges before proceeding
    if (!isSuperAdmin) {
      toast({
        title: "Permission Denied",
        description: "Template cloning is restricted to super administrators only. Please contact a system administrator for assistance.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setCloneStatus('loading');
      setCurrentStep('processing');
      
      // Call API to clone the template with the selected variant
      const response = await apiRequest('POST', '/api/tenant/clone', {
        templateId: 'progress-template', // Default template ID
        variantId: selectedVariant.id,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to clone template');
      }
      
      const data = await response.json();
      setNewTenantId(data.tenantId);
      setCloneStatus('success');
      setCurrentStep('complete');
      
      toast({
        title: "Success",
        description: "Template cloned successfully!",
      });
    } catch (error) {
      console.error('Error cloning template:', error);
      setCloneStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to clone template. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const resetProcess = () => {
    setCurrentStep('template');
    setSelectedVariant(null);
    setCloneStatus('idle');
    setNewTenantId(null);
    setErrorMessage(null);
  };
  
  const navigateToNewTenant = () => {
    if (newTenantId) {
      navigate(`/admin/tenant/${newTenantId}/dashboard`);
    }
  };
  
  // Helper to copy tenant ID to clipboard
  const copyTenantId = () => {
    if (newTenantId) {
      navigator.clipboard.writeText(newTenantId);
      toast({
        title: "Copied",
        description: "Tenant ID copied to clipboard",
      });
    }
  };

  return (
      <div className="container max-w-4xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Clone Template</h1>
          <p className="text-muted-foreground mt-2">
            Create a new instance of the Progress platform with your preferred configuration
          </p>
        </div>
        
        {!isSuperAdmin && (
          <Alert variant="destructive" className="mb-6">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Restricted Access</AlertTitle>
            <AlertDescription>
              Template cloning is restricted to super administrators only. You can browse the options, but you won't be able to create a new instance. Please contact a system administrator if you need to clone a template.
            </AlertDescription>
          </Alert>
        )}
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Template Cloning Wizard</CardTitle>
              <div className="flex items-center space-x-2">
                <div className={`h-2 w-8 rounded-full ${currentStep === 'template' || currentStep === 'variant' || currentStep === 'confirmation' || currentStep === 'processing' || currentStep === 'complete' ? 'bg-primary' : 'bg-muted'}`}></div>
                <div className={`h-2 w-8 rounded-full ${currentStep === 'variant' || currentStep === 'confirmation' || currentStep === 'processing' || currentStep === 'complete' ? 'bg-primary' : 'bg-muted'}`}></div>
                <div className={`h-2 w-8 rounded-full ${currentStep === 'confirmation' || currentStep === 'processing' || currentStep === 'complete' ? 'bg-primary' : 'bg-muted'}`}></div>
                <div className={`h-2 w-8 rounded-full ${currentStep === 'processing' || currentStep === 'complete' ? 'bg-primary' : 'bg-muted'}`}></div>
                <div className={`h-2 w-8 rounded-full ${currentStep === 'complete' ? 'bg-primary' : 'bg-muted'}`}></div>
              </div>
            </div>
            <CardDescription>
              {currentStep === 'template' && "Step 1: Select the template you want to clone"}
              {currentStep === 'variant' && "Step 2: Configure site variant options"}
              {currentStep === 'confirmation' && "Step 3: Review and confirm your selection"}
              {currentStep === 'processing' && "Step 4: Cloning in progress"}
              {currentStep === 'complete' && "Complete: Your new instance is ready"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {currentStep === 'template' && (
              <div className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Template Selection</AlertTitle>
                  <AlertDescription>
                    Currently only the Progress Accountants template is available for cloning.
                  </AlertDescription>
                </Alert>
                
                <Card className="border-2 border-primary">
                  <CardHeader>
                    <CardTitle>Progress Accountants Template</CardTitle>
                    <CardDescription>
                      Professional website template for accountants with comprehensive features
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Features:</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          <li>Comprehensive client management</li>
                          <li>Financial dashboard and reporting</li>
                          <li>Content creation and blogging tools</li>
                          <li>Business networking</li>
                          <li>Professional design with navy and orange theme</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Ideal for:</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          <li>Accounting and financial firms</li>
                          <li>Tax preparation services</li>
                          <li>Business consulting</li>
                          <li>Financial advisory services</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-end">
                  <Button onClick={handleTemplateSelect}>
                    Continue to Configuration
                  </Button>
                </div>
              </div>
            )}
            
            {currentStep === 'variant' && (
              <SiteVariantSelector 
                tenantId="temporary-id" // Will be replaced with actual ID later
                onVariantSelected={handleVariantSelected}
                onComplete={handleVariantConfirmed}
              />
            )}
            
            {currentStep === 'confirmation' && selectedVariant && (
              <div className="space-y-6">
                <Alert className="bg-muted">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Ready to Clone</AlertTitle>
                  <AlertDescription>
                    Please review your configuration before proceeding.
                  </AlertDescription>
                </Alert>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2">Template Details:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p><strong>Template:</strong> Progress Accountants Template</p>
                      <p><strong>Site Variant:</strong> {selectedVariant.name}</p>
                    </div>
                    <div>
                      <p><strong>Website Type:</strong> {selectedVariant.websiteUsageType}</p>
                      <p><strong>User Type:</strong> {selectedVariant.userType}</p>
                    </div>
                  </div>
                </div>
                
                <Alert className="border-amber-200 bg-amber-50 text-amber-800">
                  <FileWarning className="h-4 w-4" />
                  <AlertTitle>Important Note</AlertTitle>
                  <AlertDescription>
                    This process will create a new tenant with its own configuration. The process may take a few moments to complete.
                  </AlertDescription>
                </Alert>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">NextMonth Ecosystem Architecture</CardTitle>
                    <CardDescription>
                      Understanding how your site connects to the broader network
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Independent Planet</h4>
                      <p className="text-sm text-muted-foreground">
                        Your new site is an independent planet - self-sufficient unless it chooses to connect:
                      </p>
                      <ul className="list-disc list-inside text-sm space-y-1 pl-4">
                        <li>Separate database or namespace</li>
                        <li>Separate user accounts</li>
                        <li>Separate public pages</li>
                        <li>Complete control over your business data</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">NextMonthDev: The Mothership</h4>
                      <p className="text-sm text-muted-foreground">
                        The central authority that supports all sites:
                      </p>
                      <ul className="list-disc list-inside text-sm space-y-1 pl-4">
                        <li>Stores system-wide tools (the Marketplace)</li>
                        <li>Maintains blueprints and system upgrades</li>
                        <li>Monitors health via Mission Control</li>
                        <li>Does NOT store your business data directly</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">NextMonth Hub: The Interstellar Relay</h4>
                      <p className="text-sm text-muted-foreground">
                        The secure service layer that enables optional connectivity:
                      </p>
                      <ul className="list-disc list-inside text-sm space-y-1 pl-4">
                        <li>Only shares data explicitly marked for networking (opt-in)</li>
                        <li>Routes messages between sites without direct database access</li>
                        <li>Enables cross-site business networking</li>
                        <li>Maintains strict privacy boundaries</li>
                      </ul>
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-medium mb-2">Security & Privacy Highlights</h4>
                      <ul className="list-disc list-inside text-sm space-y-1 pl-4">
                        <li><strong>All networking is opt-in</strong> - you control what leaves your site</li>
                        <li><strong>User data stays local</strong> - only authorized profiles/posts are shared</li>
                        <li><strong>Secure message routing</strong> - no direct database connections between sites</li>
                        <li><strong>Local profiles with selective sharing</strong> - public aspects can be networked</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setCurrentStep('variant')}>
                    Back
                  </Button>
                  <Button onClick={handleConfirmClone}>
                    Clone Template
                  </Button>
                </div>
              </div>
            )}
            
            {currentStep === 'processing' && (
              <div className="py-12 flex flex-col items-center justify-center">
                <LoaderCircle className="h-12 w-12 animate-spin text-primary mb-4" />
                <h3 className="text-lg font-medium mb-2">Cloning in Progress</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Please wait while we create your new tenant instance. This may take a few moments to complete.
                </p>
              </div>
            )}
            
            {currentStep === 'complete' && (
              <div className="space-y-6">
                {cloneStatus === 'success' && (
                  <div className="py-8 flex flex-col items-center justify-center">
                    <div className="bg-green-100 text-green-600 rounded-full p-4 mb-4">
                      <CheckCircle2 className="h-12 w-12" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Cloning Successful!</h3>
                    <p className="text-muted-foreground text-center max-w-md mb-6">
                      Your new tenant instance has been created successfully.
                    </p>

                    <div className="border rounded-lg p-4 w-full max-w-md mb-6">
                      <h4 className="font-medium mb-2 text-center">NextMonth Ecosystem</h4>
                      <div className="flex flex-col items-center space-y-4">
                        <div className="bg-blue-100 p-3 rounded-lg w-full max-w-sm text-center font-medium">
                          NextMonthDev<br/>
                          <span className="text-xs font-normal text-blue-700">The Mothership</span>
                        </div>
                        
                        <div className="h-4 w-px bg-gray-300"></div>
                        
                        <div className="bg-indigo-100 p-3 rounded-lg w-full max-w-sm text-center font-medium">
                          NextMonth Hub API<br/>
                          <span className="text-xs font-normal text-indigo-700">The Interstellar Relay</span>
                        </div>
                        
                        <div className="h-8 w-px bg-gray-300 relative">
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                            <span className="text-xs">Secure API</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                          <div className="bg-green-100 p-3 rounded-lg text-center text-sm font-medium">
                            Client Site A<br/>
                            <span className="text-xs font-normal text-green-700">Independent Planet</span>
                          </div>
                          <div className="bg-primary/20 p-3 rounded-lg text-center text-sm font-medium border-2 border-primary">
                            Your New Site<br/>
                            <span className="text-xs font-normal text-primary/80">Independent Planet</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-center mt-4 text-muted-foreground">
                        Each site is a self-sufficient planet that can optionally share data through the interstellar relay.
                        <br/>Private data never leaves your planet unless you explicitly choose to share it.
                      </p>
                    </div>
                    
                    {newTenantId && (
                      <div className="bg-muted rounded-lg p-4 w-full max-w-md flex justify-between items-center">
                        <span className="font-mono text-sm truncate max-w-[250px]">{newTenantId}</span>
                        <Button size="sm" variant="ghost" onClick={copyTenantId}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    
                    <div className="flex justify-center mt-8 space-x-3">
                      <Button variant="outline" onClick={resetProcess}>
                        Clone Another
                      </Button>
                      <Button onClick={navigateToNewTenant}>
                        Go to New Instance
                      </Button>
                    </div>
                  </div>
                )}
                
                {cloneStatus === 'error' && (
                  <div className="py-8 flex flex-col items-center justify-center">
                    <div className="bg-red-100 text-red-600 rounded-full p-4 mb-4">
                      <AlertCircle className="h-12 w-12" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Cloning Failed</h3>
                    <p className="text-muted-foreground text-center max-w-md mb-6">
                      There was an error while creating your new tenant instance.
                    </p>
                    
                    {errorMessage && (
                      <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                          {errorMessage}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <Button onClick={resetProcess}>
                      Try Again
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
  );
};

export default CloneTemplatePage;