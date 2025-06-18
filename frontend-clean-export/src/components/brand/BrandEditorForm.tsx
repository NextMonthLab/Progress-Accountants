import { useEffect, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { saveBrandVersion } from '@/lib/api';
import { useToast } from "@/hooks/use-toast";
import { BrandVersion } from './BrandVersionList';

// Form validation schema
const brandVersionSchema = z.object({
  id: z.number().optional(),
  versionNumber: z.string().min(1, "Version number is required"),
  versionName: z.string().min(1, "Version name is required"),
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color").nullable().optional(),
  secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color").nullable().optional(),
  accentColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color").nullable().optional(),
  logoUrl: z.string().url("Must be a valid URL").nullable().optional(),
  typography: z.any().optional(),
  brandIdentityData: z.any().optional(),
  brandVoiceData: z.any().optional(),
  brandAssets: z.any().optional(),
});

type BrandVersionFormValues = z.infer<typeof brandVersionSchema>;

interface BrandEditorFormProps {
  isOpen: boolean;
  onClose: () => void;
  version?: BrandVersion | null;
  onSaved: () => void;
}

export function BrandEditorForm({ isOpen, onClose, version, onSaved }: BrandEditorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("colors");
  const { toast } = useToast();

  // Initialize form with default values or existing version
  const form = useForm<BrandVersionFormValues>({
    resolver: zodResolver(brandVersionSchema),
    defaultValues: {
      id: version?.id,
      versionNumber: version?.versionNumber || getDefaultVersionNumber(),
      versionName: version?.versionName || '',
      primaryColor: version?.primaryColor || '#003366', // Navy blue default
      secondaryColor: version?.secondaryColor || '#E65C00', // Burnt orange default
      accentColor: version?.accentColor || '#4A90E2', // Blue accent default
      logoUrl: version?.logoUrl || null,
      typography: version?.typography || getDefaultTypography(),
      brandIdentityData: version?.brandIdentityData || getDefaultBrandIdentity(),
      brandVoiceData: version?.brandVoiceData || getDefaultBrandVoice(),
      brandAssets: version?.brandAssets || {},
    },
  });

  // Update form values when version changes
  useEffect(() => {
    if (version) {
      form.reset({
        id: version.id,
        versionNumber: version.versionNumber,
        versionName: version.versionName || '',
        primaryColor: version.primaryColor || '#003366',
        secondaryColor: version.secondaryColor || '#E65C00',
        accentColor: version.accentColor || '#4A90E2',
        logoUrl: version.logoUrl,
        typography: version.typography || getDefaultTypography(),
        brandIdentityData: version.brandIdentityData || getDefaultBrandIdentity(),
        brandVoiceData: version.brandVoiceData || getDefaultBrandVoice(),
        brandAssets: version.brandAssets || {},
      });
    } else {
      form.reset({
        id: undefined,
        versionNumber: getDefaultVersionNumber(),
        versionName: '',
        primaryColor: '#003366', // Navy blue default
        secondaryColor: '#E65C00', // Burnt orange default
        accentColor: '#4A90E2', // Blue accent default
        logoUrl: null,
        typography: getDefaultTypography(),
        brandIdentityData: getDefaultBrandIdentity(),
        brandVoiceData: getDefaultBrandVoice(),
        brandAssets: {},
      });
    }
  }, [version, form]);

  function getDefaultVersionNumber() {
    const today = new Date();
    return `v${today.getFullYear()}.${today.getMonth() + 1}.${today.getDate()}`;
  }

  function getDefaultTypography() {
    return {
      primaryFont: "Inter, sans-serif",
      secondaryFont: "Georgia, serif",
      headingSettings: {
        fontWeight: "bold",
        letterSpacing: "-0.025em",
      },
      bodySettings: {
        fontWeight: "normal",
        lineHeight: "1.5",
      }
    };
  }

  function getDefaultBrandIdentity() {
    return {
      mission: "To provide transparent, technology-driven accounting services that help businesses grow confidently.",
      values: ["Transparency", "Excellence", "Innovation", "Reliability"],
      targetAudience: ["Small businesses", "Creative industries", "Technology startups"]
    };
  }

  function getDefaultBrandVoice() {
    return {
      tone: "Professional yet approachable",
      keyPhrases: ["Transparent accounting", "Financial clarity", "Business growth"],
      messageGuidelines: "Always emphasize value and clarity. Avoid jargon that might confuse clients."
    };
  }

  const onSubmit = async (values: BrandVersionFormValues) => {
    setIsSubmitting(true);
    try {
      await saveBrandVersion(values);
      toast({
        title: "Brand Version Saved",
        description: "Your brand version has been successfully saved",
      });
      onSaved();
      onClose();
    } catch (error) {
      console.error('Failed to save brand version:', error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your brand version",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{version ? 'Edit Brand Version' : 'Create New Brand Version'}</DialogTitle>
          <DialogDescription>
            Define or update the brand styling and identity elements
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="versionNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Version Number*</FormLabel>
                    <FormControl>
                      <Input placeholder="v1.0.0" {...field} />
                    </FormControl>
                    <FormDescription>
                      Semantic version number (e.g., v1.0.0)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="versionName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Version Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Spring 2025 Refresh" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormDescription>
                      Descriptive name for this brand version
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="colors">Colors</TabsTrigger>
                <TabsTrigger value="typography">Typography</TabsTrigger>
                <TabsTrigger value="identity">Identity</TabsTrigger>
                <TabsTrigger value="assets">Assets</TabsTrigger>
              </TabsList>

              {/* Colors Tab */}
              <TabsContent value="colors" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="primaryColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Color</FormLabel>
                        <div className="flex gap-2">
                          <div className="flex-shrink-0 w-8 h-8 rounded-md border" style={{ backgroundColor: field.value || '#003366' }} />
                          <FormControl>
                            <Input type="text" placeholder="#003366" {...field} value={field.value || ''} />
                          </FormControl>
                        </div>
                        <FormDescription>
                          Main brand color (hex code)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="secondaryColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secondary Color</FormLabel>
                        <div className="flex gap-2">
                          <div className="flex-shrink-0 w-8 h-8 rounded-md border" style={{ backgroundColor: field.value || '#E65C00' }} />
                          <FormControl>
                            <Input type="text" placeholder="#E65C00" {...field} value={field.value || ''} />
                          </FormControl>
                        </div>
                        <FormDescription>
                          Secondary brand color (hex code)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accentColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Accent Color</FormLabel>
                        <div className="flex gap-2">
                          <div className="flex-shrink-0 w-8 h-8 rounded-md border" style={{ backgroundColor: field.value || '#4A90E2' }} />
                          <FormControl>
                            <Input type="text" placeholder="#4A90E2" {...field} value={field.value || ''} />
                          </FormControl>
                        </div>
                        <FormDescription>
                          Accent color for highlights (hex code)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-6 p-5 border rounded-md">
                  <h3 className="font-medium mb-3">Color Preview</h3>
                  <div className="space-y-3">
                    <div className="h-12 rounded-md flex items-center justify-center font-bold text-white" 
                      style={{ backgroundColor: form.watch('primaryColor') || '#003366' }}>
                      Primary Color
                    </div>
                    <div className="h-12 rounded-md flex items-center justify-center font-bold text-white" 
                      style={{ backgroundColor: form.watch('secondaryColor') || '#E65C00' }}>
                      Secondary Color
                    </div>
                    <div className="h-12 rounded-md flex items-center justify-center font-bold text-white" 
                      style={{ backgroundColor: form.watch('accentColor') || '#4A90E2' }}>
                      Accent Color
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div className="h-6 rounded-md" style={{ backgroundColor: form.watch('primaryColor') || '#003366' }}></div>
                      <div className="h-6 rounded-md" style={{ backgroundColor: form.watch('secondaryColor') || '#E65C00' }}></div>
                      <div className="h-6 rounded-md" style={{ backgroundColor: form.watch('accentColor') || '#4A90E2' }}></div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Typography Tab */}
              <TabsContent value="typography" className="space-y-4">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="primary-font">
                    <AccordionTrigger>Primary Font</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <div className="grid grid-cols-1 gap-2">
                          <FormItem>
                            <FormLabel>Font Family</FormLabel>
                            <Select
                              value={form.watch('typography')?.primaryFont || "Inter, sans-serif"}
                              onValueChange={(value) => {
                                const typography = form.getValues('typography') || {};
                                form.setValue('typography', {
                                  ...typography,
                                  primaryFont: value
                                });
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a font" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Inter, sans-serif">Inter</SelectItem>
                                <SelectItem value="'Roboto', sans-serif">Roboto</SelectItem>
                                <SelectItem value="'Open Sans', sans-serif">Open Sans</SelectItem>
                                <SelectItem value="'Montserrat', sans-serif">Montserrat</SelectItem>
                                <SelectItem value="'Poppins', sans-serif">Poppins</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        </div>

                        <div className="p-4 border rounded-md">
                          <p className="text-lg mb-2 font-medium">Sample Text</p>
                          <p style={{ fontFamily: form.watch('typography')?.primaryFont || "Inter, sans-serif" }}>
                            This is a sample of the primary font that will be used for body text across the site.
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="secondary-font">
                    <AccordionTrigger>Secondary Font</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <div className="grid grid-cols-1 gap-2">
                          <FormItem>
                            <FormLabel>Font Family</FormLabel>
                            <Select
                              value={form.watch('typography')?.secondaryFont || "Georgia, serif"}
                              onValueChange={(value) => {
                                const typography = form.getValues('typography') || {};
                                form.setValue('typography', {
                                  ...typography,
                                  secondaryFont: value
                                });
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a font" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Georgia, serif">Georgia</SelectItem>
                                <SelectItem value="'Playfair Display', serif">Playfair Display</SelectItem>
                                <SelectItem value="'Merriweather', serif">Merriweather</SelectItem>
                                <SelectItem value="'Lora', serif">Lora</SelectItem>
                                <SelectItem value="'Crimson Text', serif">Crimson Text</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        </div>

                        <div className="p-4 border rounded-md">
                          <p className="text-lg mb-2 font-medium">Sample Text</p>
                          <p style={{ fontFamily: form.watch('typography')?.secondaryFont || "Georgia, serif" }}>
                            This is a sample of the secondary font that will be used for headings and accent text.
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="heading-settings">
                    <AccordionTrigger>Heading Settings</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-4">
                          <FormItem>
                            <FormLabel>Font Weight</FormLabel>
                            <Select
                              value={form.watch('typography')?.headingSettings?.fontWeight || "bold"}
                              onValueChange={(value) => {
                                const typography = form.getValues('typography') || {};
                                const headingSettings = typography.headingSettings || {};
                                form.setValue('typography', {
                                  ...typography,
                                  headingSettings: {
                                    ...headingSettings,
                                    fontWeight: value
                                  }
                                });
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select weight" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="semibold">Semibold</SelectItem>
                                <SelectItem value="bold">Bold</SelectItem>
                                <SelectItem value="extrabold">Extra Bold</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>

                          <FormItem>
                            <FormLabel>Letter Spacing</FormLabel>
                            <Select
                              value={form.watch('typography')?.headingSettings?.letterSpacing || "-0.025em"}
                              onValueChange={(value) => {
                                const typography = form.getValues('typography') || {};
                                const headingSettings = typography.headingSettings || {};
                                form.setValue('typography', {
                                  ...typography,
                                  headingSettings: {
                                    ...headingSettings,
                                    letterSpacing: value
                                  }
                                });
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select spacing" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="-0.05em">Tight (-0.05em)</SelectItem>
                                <SelectItem value="-0.025em">Slightly Tight (-0.025em)</SelectItem>
                                <SelectItem value="0">Normal (0)</SelectItem>
                                <SelectItem value="0.025em">Slightly Wide (0.025em)</SelectItem>
                                <SelectItem value="0.05em">Wide (0.05em)</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        </div>

                        <div className="p-4 border rounded-md">
                          <div 
                            style={{ 
                              fontFamily: form.watch('typography')?.secondaryFont || "Georgia, serif",
                              fontWeight: form.watch('typography')?.headingSettings?.fontWeight || "bold",
                              letterSpacing: form.watch('typography')?.headingSettings?.letterSpacing || "-0.025em"
                            }}
                          >
                            <h1 className="text-3xl mb-2">Heading 1 Example</h1>
                            <h2 className="text-2xl mb-2">Heading 2 Example</h2>
                            <h3 className="text-xl mb-2">Heading 3 Example</h3>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>

              {/* Identity Tab */}
              <TabsContent value="identity" className="space-y-4">
                <FormItem>
                  <FormLabel>Brand Mission</FormLabel>
                  <Textarea 
                    value={form.watch('brandIdentityData')?.mission || ""}
                    onChange={(e) => {
                      const brandIdentityData = form.getValues('brandIdentityData') || {};
                      form.setValue('brandIdentityData', {
                        ...brandIdentityData,
                        mission: e.target.value
                      });
                    }}
                    placeholder="Enter your brand mission statement"
                    rows={3}
                  />
                  <FormDescription>
                    A clear statement of your brand's purpose
                  </FormDescription>
                </FormItem>

                <FormItem>
                  <FormLabel>Logo URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/logo.png" 
                      {...form.register('logoUrl')}
                      value={form.watch('logoUrl') || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    URL to your primary logo image
                  </FormDescription>
                  <FormMessage />
                </FormItem>

                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-3">Logo Preview</h3>
                  {form.watch('logoUrl') ? (
                    <div className="flex justify-center p-4 bg-gray-50 rounded">
                      <img 
                        src={form.watch('logoUrl')} 
                        alt="Brand Logo" 
                        className="max-h-32 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x100?text=Invalid+Image+URL';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-32 bg-gray-50 rounded text-gray-400">
                      No logo URL provided
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Assets Tab */}
              <TabsContent value="assets" className="space-y-4">
                <div className="border rounded-md p-4 text-center space-y-2">
                  <p className="text-muted-foreground">
                    This area will allow for uploading and managing brand assets such as
                    additional logos, image treatments, icon sets, and other visual elements.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Feature coming soon - currently only supported through direct Vault API integration.
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {version ? 'Update' : 'Create'} Brand Version
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}