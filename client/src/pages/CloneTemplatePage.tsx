import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowRight, Check } from 'lucide-react';
import SiteVariantSelector from '@/components/site-variant/SiteVariantSelector';
import AdminLayout from '@/layouts/AdminLayout';
import { type SiteVariantConfig } from '@shared/site_variants';

type CloneStep = 'template' | 'variant' | 'confirmation' | 'processing' | 'complete';

const CloneTemplatePage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState<CloneStep>('template');
  const [templateId, setTemplateId] = useState<string>('progress-template');
  const [tenantId, setTenantId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<SiteVariantConfig | null>(null);
  const { toast } = useToast();

  // Handle template selection
  const handleTemplateSelect = (id: string) => {
    setTemplateId(id);
  };

  // Proceed to variant selection
  const handleProceedToVariant = async () => {
    try {
      setIsProcessing(true);
      
      // In a real implementation, we would call an API to start the cloning process
      // and get the new tenant ID. For now, we'll use a placeholder tenant ID
      // that would be created by the server.
      
      // Simulating API call to create a new tenant
      const response = await apiRequest(
        'POST', 
        '/api/tenant/clone', 
        { templateId }
      );
      
      if (!response.ok) {
        throw new Error('Failed to initialize template cloning');
      }
      
      const data = await response.json();
      setTenantId(data.tenantId);
      
      // Move to variant selection step
      setCurrentStep('variant');
    } catch (error) {
      console.error('Error initializing template clone:', error);
      toast({
        title: "Error",
        description: "Failed to initialize template cloning. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle variant selection
  const handleVariantSelected = (variant: SiteVariantConfig) => {
    setSelectedVariant(variant);
  };

  // Complete variant selection and move to confirmation
  const handleVariantSelectionComplete = () => {
    setCurrentStep('confirmation');
  };

  // Proceed with cloning
  const handleProceedWithCloning = async () => {
    try {
      setIsProcessing(true);
      setCurrentStep('processing');
      
      // In a real implementation, we would call an API to finalize the cloning process
      // For now, we'll simulate a delay to represent the cloning process
      
      setTimeout(() => {
        setCurrentStep('complete');
        setIsProcessing(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error during template cloning:', error);
      toast({
        title: "Error",
        description: "An error occurred during the cloning process. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  // Go to the newly created tenant
  const handleGoToNewTenant = () => {
    // Navigate to the new tenant's dashboard
    setLocation(`/admin/dashboard?tenantId=${tenantId}`);
  };

  return (
    <AdminLayout>
      <div className="container max-w-4xl py-10">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Clone Template</h1>
        
        <div className="mb-8">
          <div className="flex items-center">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
              currentStep === 'template' ? 'bg-primary text-primary-foreground' : 
              currentStep === 'variant' || currentStep === 'confirmation' || currentStep === 'processing' || currentStep === 'complete' ? 
              'bg-primary text-primary-foreground' : 'border border-input bg-background'
            }`}>
              {currentStep === 'template' ? '1' : <Check className="h-5 w-5" />}
            </div>
            <div className="ml-4 flex-1">
              <p className="font-medium">Select Template</p>
              <p className="text-sm text-muted-foreground">Choose which template to clone</p>
            </div>
          </div>
          
          <div className="my-2 ml-5 h-[calc(28px)] w-px bg-border"></div>
          
          <div className="flex items-center">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
              currentStep === 'variant' ? 'bg-primary text-primary-foreground' : 
              currentStep === 'confirmation' || currentStep === 'processing' || currentStep === 'complete' ? 
              'bg-primary text-primary-foreground' : 'border border-input bg-background'
            }`}>
              {currentStep === 'variant' ? '2' : 
               currentStep === 'confirmation' || currentStep === 'processing' || currentStep === 'complete' ? 
               <Check className="h-5 w-5" /> : '2'}
            </div>
            <div className="ml-4 flex-1">
              <p className="font-medium">Configure Variant</p>
              <p className="text-sm text-muted-foreground">Select site variant configuration</p>
            </div>
          </div>
          
          <div className="my-2 ml-5 h-[calc(28px)] w-px bg-border"></div>
          
          <div className="flex items-center">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
              currentStep === 'confirmation' ? 'bg-primary text-primary-foreground' : 
              currentStep === 'processing' || currentStep === 'complete' ? 
              'bg-primary text-primary-foreground' : 'border border-input bg-background'
            }`}>
              {currentStep === 'confirmation' ? '3' : 
               currentStep === 'processing' || currentStep === 'complete' ? 
               <Check className="h-5 w-5" /> : '3'}
            </div>
            <div className="ml-4 flex-1">
              <p className="font-medium">Confirmation</p>
              <p className="text-sm text-muted-foreground">Review and confirm your selections</p>
            </div>
          </div>
          
          <div className="my-2 ml-5 h-[calc(28px)] w-px bg-border"></div>
          
          <div className="flex items-center">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
              currentStep === 'processing' || currentStep === 'complete' ? 
              'bg-primary text-primary-foreground' : 'border border-input bg-background'
            }`}>
              {currentStep === 'complete' ? <Check className="h-5 w-5" /> : '4'}
            </div>
            <div className="ml-4 flex-1">
              <p className="font-medium">Complete</p>
              <p className="text-sm text-muted-foreground">Finalize and access your new site</p>
            </div>
          </div>
        </div>
        
        <div className="mt-10">
          {currentStep === 'template' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">Select Template</h2>
              
              <div className="grid grid-cols-1 gap-4">
                <Card className={`cursor-pointer transition-all ${templateId === 'progress-template' ? 'border-2 border-primary' : ''}`}
                      onClick={() => handleTemplateSelect('progress-template')}>
                  <CardHeader>
                    <CardTitle>Progress Accountants</CardTitle>
                    <CardDescription>Professional accounting firm template with full client management</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Includes comprehensive client dashboard, financial reporting tools, and professional brand design.</p>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="text-xs text-muted-foreground">Latest Version: 1.1.1</div>
                    {templateId === 'progress-template' && (
                      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-primary">
                        Selected
                      </div>
                    )}
                  </CardFooter>
                </Card>
              </div>
              
              <div className="flex justify-end mt-8">
                <Button onClick={handleProceedToVariant} disabled={!templateId || isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
          
          {currentStep === 'variant' && tenantId && (
            <SiteVariantSelector 
              tenantId={tenantId} 
              onVariantSelected={handleVariantSelected}
              onComplete={handleVariantSelectionComplete}
            />
          )}
          
          {currentStep === 'confirmation' && selectedVariant && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">Confirm Your Selections</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Review Your Configuration</CardTitle>
                  <CardDescription>Please review your selections before proceeding</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium">Selected Template:</h3>
                    <p>Progress Accountants</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium">Selected Variant:</h3>
                    <p className="font-bold">{selectedVariant.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">{selectedVariant.description}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium">Enabled Features:</h3>
                    <ul className="list-disc list-inside mt-1">
                      {Object.entries(selectedVariant.features)
                        .filter(([_, enabled]) => enabled)
                        .map(([feature]) => (
                          <li key={feature} className="text-sm">
                            {feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </li>
                        ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep('variant')}>
                    Back
                  </Button>
                  <Button onClick={handleProceedWithCloning} disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Proceed with Cloning"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
          
          {currentStep === 'processing' && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <h2 className="text-2xl font-bold mt-6">Cloning in Progress</h2>
              <p className="text-center text-muted-foreground max-w-sm mt-2">
                We're creating your new site with the selected configuration. This may take a few moments.
              </p>
            </div>
          )}
          
          {currentStep === 'complete' && (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-100 p-3">
                  <Check className="h-10 w-10 text-green-600" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold tracking-tight">Cloning Complete!</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Your new site has been created successfully. You can now access it and start customizing.
              </p>
              
              <div className="pt-4">
                <Button size="lg" onClick={handleGoToNewTenant}>
                  Go to New Site
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default CloneTemplatePage;