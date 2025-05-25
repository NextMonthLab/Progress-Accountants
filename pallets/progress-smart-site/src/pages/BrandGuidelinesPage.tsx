import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
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
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  Save, 
  RefreshCw,
  Plus,
  X,
  Clock,
  FileText,
  Palette,
  MessageSquare,
  Building,
  Link as LinkIcon
} from 'lucide-react';

// Interface for brand guidelines data structure
interface BrandGuidelines {
  brandIdentity: {
    businessName: string;
    tagline: string;
    missionStatement: string;
    toneOfVoice: string[];
  };
  visualStyle: {
    primaryColor: string;
    secondaryColor: string;
    fontPreference: string;
    logoUrl: string;
  };
  messagingPreferences: {
    writingStyle: string;
    examplePhrases: string;
    wordsToAvoid: string;
  };
  brandMaterials: {
    guidelinesUrl: string;
    exampleAssetsUrls: string[];
    referenceWebsite: string;
  };
  lastUpdated: string;
}

// Default brand guidelines values
const defaultBrandGuidelines: BrandGuidelines = {
  brandIdentity: {
    businessName: 'Progress Accountants',
    tagline: 'Financial clarity for forward-thinking businesses',
    missionStatement: 'We provide innovative accounting solutions that empower businesses to make confident financial decisions and achieve sustainable growth.',
    toneOfVoice: ['Professional', 'Friendly', 'Approachable'],
  },
  visualStyle: {
    primaryColor: '#192d4e', // Navy blue
    secondaryColor: '#e37222', // Burnt orange
    fontPreference: 'Open Sans',
    logoUrl: '',
  },
  messagingPreferences: {
    writingStyle: 'Professional',
    examplePhrases: 'Financial peace of mind\nBeyond the numbers\nYour success is our business\nGrowth-focused accounting',
    wordsToAvoid: 'cheap, discount, basic, complicated, confusing',
  },
  brandMaterials: {
    guidelinesUrl: '',
    exampleAssetsUrls: [],
    referenceWebsite: 'https://www.progressaccountants.com',
  },
  lastUpdated: new Date().toISOString(),
};

// Font options
const fontOptions = [
  'Open Sans', 
  'Montserrat', 
  'Roboto', 
  'Lato', 
  'Poppins', 
  'Raleway', 
  'Source Sans Pro',
  'Nunito',
  'Playfair Display',
  'Merriweather',
  'PT Sans',
  'Oswald',
  'Ubuntu',
  'Cabin',
  'Custom...'
];

// Writing style options
const writingStyleOptions = [
  'Professional', 
  'Conversational', 
  'Friendly', 
  'Formal', 
  'Authoritative', 
  'Casual',
  'Technical',
  'Inspirational',
  'Humorous',
  'Direct',
  'Educational',
  'Storytelling',
  'Custom...'
];

// Available tone of voice options
const toneOptions = [
  'Professional', 
  'Friendly', 
  'Approachable', 
  'Confident', 
  'Authoritative', 
  'Helpful',
  'Empathetic',
  'Inspirational',
  'Trustworthy',
  'Expert',
  'Innovative',
  'Transparent',
  'Warm',
  'Respectful',
];

export default function BrandGuidelinesPage() {
  const { toast } = useToast();
  const [guidelines, setGuidelines] = useState<BrandGuidelines>(defaultBrandGuidelines);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("visual");
  const [selectedTones, setSelectedTones] = useState<string[]>(defaultBrandGuidelines.brandIdentity.toneOfVoice);
  const [newTone, setNewTone] = useState<string>("");
  const [customFont, setCustomFont] = useState<string>("");
  const [customWritingStyle, setCustomWritingStyle] = useState<string>("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [guidelinesFile, setGuidelinesFile] = useState<File | null>(null);
  const [savedSuccessfully, setSavedSuccessfully] = useState<boolean>(false);

  // Load brand guidelines from localStorage on component mount
  useEffect(() => {
    const savedGuidelines = localStorage.getItem('brand_guidelines');
    if (savedGuidelines) {
      try {
        const parsedGuidelines = JSON.parse(savedGuidelines);
        setGuidelines(parsedGuidelines);
        setSelectedTones(parsedGuidelines.brandIdentity.toneOfVoice || []);
      } catch (error) {
        console.error('Error parsing saved brand guidelines:', error);
        toast({
          title: 'Error Loading Guidelines',
          description: 'There was a problem loading your saved brand guidelines. Default values have been loaded.',
          variant: 'destructive',
        });
      }
    }
  }, [toast]);

  // Handle form input changes for nested properties
  const handleInputChange = (
    section: keyof BrandGuidelines,
    field: string,
    value: string | string[]
  ) => {
    setGuidelines(prev => {
      // Create a copy of the guidelines object
      const newGuidelines = { ...prev };
      
      // Create a copy of the section object
      const sectionObj = JSON.parse(JSON.stringify(prev[section]));
      
      // Update the field in the section
      sectionObj[field] = value;
      
      // Update the section in the guidelines
      newGuidelines[section] = sectionObj;
      
      return newGuidelines;
    });
  };

  // Handle tone of voice selection
  const toggleTone = (tone: string) => {
    setSelectedTones(prev => 
      prev.includes(tone)
        ? prev.filter(t => t !== tone)
        : [...prev, tone]
    );
    
    // Update the guidelines object
    setGuidelines(prev => {
      const newGuidelines = JSON.parse(JSON.stringify(prev));
      
      newGuidelines.brandIdentity.toneOfVoice = selectedTones.includes(tone)
        ? selectedTones.filter(t => t !== tone)
        : [...selectedTones, tone];
      
      return newGuidelines;
    });
  };

  // Add custom tone
  const addCustomTone = () => {
    if (newTone.trim() && !selectedTones.includes(newTone.trim())) {
      const updatedTones = [...selectedTones, newTone.trim()];
      setSelectedTones(updatedTones);
      
      setGuidelines(prev => {
        const newGuidelines = JSON.parse(JSON.stringify(prev));
        newGuidelines.brandIdentity.toneOfVoice = updatedTones;
        return newGuidelines;
      });
      
      setNewTone('');
    }
  };

  // Handle font preference change
  const handleFontChange = (value: string) => {
    if (value === 'Custom...') {
      // If custom, don't update yet, wait for custom input
      setCustomFont('');
    } else {
      handleInputChange('visualStyle', 'fontPreference', value);
    }
  };

  // Handle writing style change
  const handleWritingStyleChange = (value: string) => {
    if (value === 'Custom...') {
      // If custom, don't update yet, wait for custom input
      setCustomWritingStyle('');
    } else {
      handleInputChange('messagingPreferences', 'writingStyle', value);
    }
  };

  // Handle custom font input
  const applyCustomFont = () => {
    if (customFont.trim()) {
      handleInputChange('visualStyle', 'fontPreference', customFont.trim());
    }
  };

  // Handle custom writing style input
  const applyCustomWritingStyle = () => {
    if (customWritingStyle.trim()) {
      handleInputChange('messagingPreferences', 'writingStyle', customWritingStyle.trim());
    }
  };

  // Handle logo file selection
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
      
      // For demo purposes, create an object URL
      // In a real app, you'd upload this to a server and get a URL back
      const objectUrl = URL.createObjectURL(e.target.files[0]);
      handleInputChange('visualStyle', 'logoUrl', objectUrl);
    }
  };

  // Handle guidelines file upload
  const handleGuidelinesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setGuidelinesFile(e.target.files[0]);
      
      // For demo purposes, create an object URL
      // In a real app, you'd upload this to a server and get a URL back
      const objectUrl = URL.createObjectURL(e.target.files[0]);
      handleInputChange('brandMaterials', 'guidelinesUrl', objectUrl);
    }
  };

  // Save the brand guidelines
  const saveGuidelines = () => {
    setIsLoading(true);
    
    // Format the data with the latest timestamp
    const updatedGuidelines = JSON.parse(JSON.stringify(guidelines));
    updatedGuidelines.lastUpdated = new Date().toISOString();
    
    try {
      // In a real application, you'd send this to an API endpoint
      // For this demo, we'll save to localStorage
      localStorage.setItem('brand_guidelines', JSON.stringify(updatedGuidelines));
      
      // Update the state to reflect the save
      setGuidelines(updatedGuidelines);
      setSavedSuccessfully(true);
      
      // Show success toast
      toast({
        title: 'Brand Guidelines Saved',
        description: 'Your brand guidelines have been successfully updated.',
        variant: 'default',
      });
      
      // Reset saved message after a delay
      setTimeout(() => {
        setSavedSuccessfully(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving brand guidelines:', error);
      
      toast({
        title: 'Save Failed',
        description: 'There was an error saving your brand guidelines. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to defaults
  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all brand guidelines to the default values? This cannot be undone.')) {
      setGuidelines(defaultBrandGuidelines);
      setSelectedTones(defaultBrandGuidelines.brandIdentity.toneOfVoice);
      setLogoFile(null);
      setGuidelinesFile(null);
      
      toast({
        title: 'Guidelines Reset',
        description: 'Brand guidelines have been reset to default values. Save to apply these changes.',
        variant: 'default',
      });
    }
  };

  // Format the last updated date
  const formatLastUpdated = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return 'Never';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Helmet>
        <title>Brand Guidelines | Progress Accountants</title>
      </Helmet>
      
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-[var(--navy)] mb-3">Brand Guidelines</h1>
          <p className="text-gray-600 mb-6">
            NextMonth uses this information to generate visual styles, messaging preferences, and brand materials for all your pages, campaigns, and content. You can update these guidelines at any time—changes will apply to all content going forward.
          </p>

          <Tabs 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="visual" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Visual Style</span>
                <span className="inline sm:hidden">Visual</span>
              </TabsTrigger>
              <TabsTrigger value="messaging" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Messaging</span>
                <span className="inline sm:hidden">Messaging</span>
              </TabsTrigger>
              <TabsTrigger value="materials" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Brand Materials</span>
                <span className="inline sm:hidden">Materials</span>
              </TabsTrigger>
            </TabsList>



            {/* Visual Style Tab */}
            <TabsContent value="visual" className="pt-2">
              <Card>
                <CardHeader>
                  <CardTitle>Visual Style</CardTitle>
                  <CardDescription>
                    Define the visual elements that make your brand recognizable
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Primary Brand Color</Label>
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded border"
                          style={{ backgroundColor: guidelines.visualStyle.primaryColor }}
                        ></div>
                        <Input 
                          id="primaryColor" 
                          type="color"
                          value={guidelines.visualStyle.primaryColor} 
                          onChange={(e) => handleInputChange('visualStyle', 'primaryColor', e.target.value)}
                          className="w-16 h-10 p-1"
                        />
                        <Input 
                          value={guidelines.visualStyle.primaryColor} 
                          onChange={(e) => handleInputChange('visualStyle', 'primaryColor', e.target.value)}
                          className="flex-grow"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="secondaryColor">Secondary Color</Label>
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded border"
                          style={{ backgroundColor: guidelines.visualStyle.secondaryColor }}
                        ></div>
                        <Input 
                          id="secondaryColor" 
                          type="color"
                          value={guidelines.visualStyle.secondaryColor} 
                          onChange={(e) => handleInputChange('visualStyle', 'secondaryColor', e.target.value)}
                          className="w-16 h-10 p-1"
                        />
                        <Input 
                          value={guidelines.visualStyle.secondaryColor} 
                          onChange={(e) => handleInputChange('visualStyle', 'secondaryColor', e.target.value)}
                          className="flex-grow"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fontPreference">Font Preference</Label>
                    {guidelines.visualStyle.fontPreference !== 'Custom...' ? (
                      <Select 
                        value={guidelines.visualStyle.fontPreference}
                        onValueChange={handleFontChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a font" />
                        </SelectTrigger>
                        <SelectContent>
                          {fontOptions.map(font => (
                            <SelectItem key={font} value={font}>{font}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Input 
                          placeholder="Enter custom font name" 
                          value={customFont}
                          onChange={(e) => setCustomFont(e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={applyCustomFont}
                        >
                          Apply
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => handleFontChange(fontOptions[0])}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="logoUpload">Logo Upload</Label>
                    
                    <div className="border rounded-md p-4">
                      {guidelines.visualStyle.logoUrl ? (
                        <div className="flex flex-col items-center gap-3">
                          <img 
                            src={guidelines.visualStyle.logoUrl} 
                            alt="Company Logo" 
                            className="max-w-full max-h-40 object-contain mb-2"
                          />
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                handleInputChange('visualStyle', 'logoUrl', '');
                                setLogoFile(null);
                              }}
                            >
                              Remove
                            </Button>
                            <Label 
                              htmlFor="logo-upload" 
                              className="h-9 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                            >
                              Replace
                            </Label>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center p-6 border-dashed border-2 rounded-md">
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500 mb-2">Drag and drop your logo here, or click to browse</p>
                          <Label 
                            htmlFor="logo-upload" 
                            className="h-9 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                          >
                            Upload Logo
                          </Label>
                        </div>
                      )}
                      <Input 
                        id="logo-upload"
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Messaging Preferences Tab */}
            <TabsContent value="messaging" className="pt-2">
              <Card>
                <CardHeader>
                  <CardTitle>Messaging Preferences</CardTitle>
                  <CardDescription>
                    Define how you communicate with your audience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="writingStyle">Preferred Writing Style</Label>
                    {guidelines.messagingPreferences.writingStyle !== 'Custom...' ? (
                      <Select 
                        value={guidelines.messagingPreferences.writingStyle}
                        onValueChange={handleWritingStyleChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a writing style" />
                        </SelectTrigger>
                        <SelectContent>
                          {writingStyleOptions.map(style => (
                            <SelectItem key={style} value={style}>{style}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Input 
                          placeholder="Enter custom writing style" 
                          value={customWritingStyle}
                          onChange={(e) => setCustomWritingStyle(e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={applyCustomWritingStyle}
                        >
                          Apply
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => handleWritingStyleChange(writingStyleOptions[0])}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="examplePhrases">Example Phrases / Headlines</Label>
                    <Textarea 
                      id="examplePhrases" 
                      value={guidelines.messagingPreferences.examplePhrases} 
                      onChange={(e) => handleInputChange('messagingPreferences', 'examplePhrases', e.target.value)}
                      placeholder="Add phrases that exemplify your brand voice (one per line)"
                      rows={4}
                    />
                    <p className="text-xs text-gray-500">Add phrases or headlines that exemplify your brand voice, one per line</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="wordsToAvoid">Words to Avoid</Label>
                    <Textarea 
                      id="wordsToAvoid" 
                      value={guidelines.messagingPreferences.wordsToAvoid} 
                      onChange={(e) => handleInputChange('messagingPreferences', 'wordsToAvoid', e.target.value)}
                      placeholder="Words or phrases to avoid in your communications (comma-separated)"
                      rows={3}
                    />
                    <p className="text-xs text-gray-500">Words or phrases that should not be used in your brand communications (comma-separated)</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Brand Materials Tab */}
            <TabsContent value="materials" className="pt-2">
              <Card>
                <CardHeader>
                  <CardTitle>Brand Materials</CardTitle>
                  <CardDescription>
                    Upload additional reference materials
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="guidelinesUpload">Brand Guidelines PDF (optional)</Label>
                    
                    <div className="border rounded-md p-4">
                      {guidelines.brandMaterials.guidelinesUrl ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-[var(--navy)]" />
                            <a 
                              href={guidelines.brandMaterials.guidelinesUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {guidelinesFile?.name || 'Brand Guidelines Document'}
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                handleInputChange('brandMaterials', 'guidelinesUrl', '');
                                setGuidelinesFile(null);
                              }}
                            >
                              Remove
                            </Button>
                            <Label 
                              htmlFor="guidelines-upload" 
                              className="h-9 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                            >
                              Replace
                            </Label>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center p-6 border-dashed border-2 rounded-md">
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500 mb-2">Upload your official brand guidelines document (PDF format preferred)</p>
                          <Label 
                            htmlFor="guidelines-upload" 
                            className="h-9 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                          >
                            Upload Document
                          </Label>
                        </div>
                      )}
                      <Input 
                        id="guidelines-upload"
                        type="file" 
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={handleGuidelinesUpload}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="referenceWebsite">Reference Website or Inspiration (URL)</Label>
                    <div className="flex items-center">
                      <div className="bg-slate-100 p-2 rounded-l-md border-y border-l">
                        <LinkIcon className="h-5 w-5 text-slate-500" />
                      </div>
                      <Input 
                        id="referenceWebsite" 
                        value={guidelines.brandMaterials.referenceWebsite} 
                        onChange={(e) => handleInputChange('brandMaterials', 'referenceWebsite', e.target.value)}
                        placeholder="https://example.com"
                        className="rounded-l-none"
                      />
                    </div>
                    <p className="text-xs text-gray-500">Enter a URL for a website that has design elements or content you'd like to reference</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Clock className="h-4 w-4" />
              <span>Last updated: {formatLastUpdated(guidelines.lastUpdated)}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={resetToDefaults}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reset to Defaults</span>
              </Button>
              
              <Button
                type="button"
                onClick={saveGuidelines}
                disabled={isLoading}
                className="flex items-center gap-2 bg-[var(--orange)] hover:bg-[var(--orange)]/90 text-white"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {savedSuccessfully ? (
                      <span>Saved ✓</span>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}