import { useState, useEffect } from "react";
import { useTenant } from "@/hooks/use-tenant";
import { useAuth } from "@/components/ClientDataProvider";
import { Loader2 } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Theme interface
interface ThemeSettings {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  radius: number;
  header: {
    position: "fixed" | "absolute" | "relative";
    style: "minimal" | "standard" | "expanded";
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    scale: "small" | "medium" | "large";
  };
  animations: {
    enabled: boolean;
    intensity: "subtle" | "medium" | "expressive";
  };
  darkMode: {
    enabled: boolean;
    default: "light" | "dark" | "system";
  };
}

export default function ThemeManagementPage() {
  const { user } = useAuth();
  const tenantId = user?.tenantId;
  const { updateThemeMutation } = useTenant();
  
  // Default theme settings
  const defaultTheme: ThemeSettings = {
    primary: "#003366", // Navy blue
    secondary: "#d95e23", // Burnt orange
    accent: "#52b2d0", // Light blue accent
    background: "#ffffff",
    text: "#333333",
    radius: 6,
    header: {
      position: "fixed",
      style: "standard"
    },
    typography: {
      headingFont: "Inter",
      bodyFont: "Inter",
      scale: "medium"
    },
    animations: {
      enabled: true,
      intensity: "subtle"
    },
    darkMode: {
      enabled: true,
      default: "light"
    }
  };
  
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);
  const [activeTab, setActiveTab] = useState("colors");
  const [isLoading, setIsLoading] = useState(true);
  
  // Load existing theme if available
  useEffect(() => {
    const loadTheme = async () => {
      if (!tenantId) {
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`/api/tenants/${tenantId}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data.theme) {
            setTheme(data.data.theme);
          }
        }
      } catch (error) {
        console.error("Error loading theme:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTheme();
  }, [tenantId]);
  
  const handleColorChange = (colorName: keyof Pick<ThemeSettings, 'primary' | 'secondary' | 'accent' | 'background' | 'text'>, value: string) => {
    setTheme({
      ...theme,
      [colorName]: value
    });
  };
  
  const handleTypographyChange = (field: keyof ThemeSettings['typography'], value: string) => {
    setTheme({
      ...theme,
      typography: {
        ...theme.typography,
        [field]: value
      }
    });
  };
  
  const handleHeaderChange = (field: keyof ThemeSettings['header'], value: string) => {
    setTheme({
      ...theme,
      header: {
        ...theme.header,
        [field]: value
      }
    });
  };
  
  const handleDarkModeChange = (field: keyof ThemeSettings['darkMode'], value: any) => {
    setTheme({
      ...theme,
      darkMode: {
        ...theme.darkMode,
        [field]: value
      }
    });
  };
  
  const handleAnimationsChange = (field: keyof ThemeSettings['animations'], value: any) => {
    setTheme({
      ...theme,
      animations: {
        ...theme.animations,
        [field]: value
      }
    });
  };
  
  const handleRadiusChange = (value: number[]) => {
    setTheme({
      ...theme,
      radius: value[0]
    });
  };
  
  const saveTheme = () => {
    if (!tenantId) return;
    
    updateThemeMutation.mutate({
      tenantId,
      theme
    });
  };
  
  // Generate sample preview styles based on current theme
  const previewStyles = {
    backgroundColor: theme.background,
    color: theme.text,
    padding: "2rem",
    borderRadius: `${theme.radius}px`,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "all 0.2s ease-in-out"
  };
  
  const buttonPreviewStyles = {
    backgroundColor: theme.primary,
    color: "#ffffff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: `${theme.radius}px`,
    cursor: "pointer"
  };
  
  const accentPreviewStyles = {
    backgroundColor: theme.accent,
    color: "#ffffff",
    padding: "0.25rem 0.5rem",
    borderRadius: `${theme.radius / 2}px`,
    display: "inline-block",
    fontSize: "0.875rem"
  };
  
  const secondaryPreviewStyles = {
    backgroundColor: theme.secondary,
    color: "#ffffff",
    padding: "0.5rem 1rem",
    borderRadius: `${theme.radius}px`,
    marginLeft: "0.5rem"
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Theme Management</h1>
      <p className="text-gray-500 mb-8">
        Customize the visual appearance of your tenant's interface.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="typography">Typography</TabsTrigger>
              <TabsTrigger value="layout">Layout</TabsTrigger>
              <TabsTrigger value="effects">Effects</TabsTrigger>
            </TabsList>
            
            {/* Colors Tab */}
            <TabsContent value="colors">
              <Card>
                <CardHeader>
                  <CardTitle>Color Scheme</CardTitle>
                  <CardDescription>
                    Define the primary colors used throughout the interface.
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="primary-color">Primary Color</Label>
                        <div 
                          className="w-6 h-6 rounded-full border border-gray-300" 
                          style={{ backgroundColor: theme.primary }}
                        />
                      </div>
                      <div className="flex gap-2 items-center">
                        <Input
                          id="primary-color"
                          type="color"
                          value={theme.primary}
                          onChange={(e) => handleColorChange('primary', e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          type="text"
                          value={theme.primary}
                          onChange={(e) => handleColorChange('primary', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="secondary-color">Secondary Color</Label>
                        <div 
                          className="w-6 h-6 rounded-full border border-gray-300" 
                          style={{ backgroundColor: theme.secondary }}
                        />
                      </div>
                      <div className="flex gap-2 items-center">
                        <Input
                          id="secondary-color"
                          type="color"
                          value={theme.secondary}
                          onChange={(e) => handleColorChange('secondary', e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          type="text"
                          value={theme.secondary}
                          onChange={(e) => handleColorChange('secondary', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="accent-color">Accent Color</Label>
                        <div 
                          className="w-6 h-6 rounded-full border border-gray-300" 
                          style={{ backgroundColor: theme.accent }}
                        />
                      </div>
                      <div className="flex gap-2 items-center">
                        <Input
                          id="accent-color"
                          type="color"
                          value={theme.accent}
                          onChange={(e) => handleColorChange('accent', e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          type="text"
                          value={theme.accent}
                          onChange={(e) => handleColorChange('accent', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="background-color">Background Color</Label>
                        <div 
                          className="w-6 h-6 rounded-full border border-gray-300" 
                          style={{ backgroundColor: theme.background }}
                        />
                      </div>
                      <div className="flex gap-2 items-center">
                        <Input
                          id="background-color"
                          type="color"
                          value={theme.background}
                          onChange={(e) => handleColorChange('background', e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          type="text"
                          value={theme.background}
                          onChange={(e) => handleColorChange('background', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="text-color">Text Color</Label>
                        <div 
                          className="w-6 h-6 rounded-full border border-gray-300" 
                          style={{ backgroundColor: theme.text }}
                        />
                      </div>
                      <div className="flex gap-2 items-center">
                        <Input
                          id="text-color"
                          type="color"
                          value={theme.text}
                          onChange={(e) => handleColorChange('text', e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          type="text"
                          value={theme.text}
                          onChange={(e) => handleColorChange('text', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Typography Tab */}
            <TabsContent value="typography">
              <Card>
                <CardHeader>
                  <CardTitle>Typography</CardTitle>
                  <CardDescription>
                    Customize the fonts and text settings used in the interface.
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="heading-font">Heading Font</Label>
                      <Select 
                        value={theme.typography.headingFont}
                        onValueChange={(value) => handleTypographyChange("headingFont", value)}
                      >
                        <SelectTrigger id="heading-font">
                          <SelectValue placeholder="Select heading font" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Roboto">Roboto</SelectItem>
                          <SelectItem value="Open Sans">Open Sans</SelectItem>
                          <SelectItem value="Montserrat">Montserrat</SelectItem>
                          <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="body-font">Body Font</Label>
                      <Select 
                        value={theme.typography.bodyFont}
                        onValueChange={(value) => handleTypographyChange("bodyFont", value)}
                      >
                        <SelectTrigger id="body-font">
                          <SelectValue placeholder="Select body font" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Roboto">Roboto</SelectItem>
                          <SelectItem value="Open Sans">Open Sans</SelectItem>
                          <SelectItem value="Lato">Lato</SelectItem>
                          <SelectItem value="Source Sans Pro">Source Sans Pro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="font-scale">Font Scale</Label>
                      <Select 
                        value={theme.typography.scale}
                        onValueChange={(value) => handleTypographyChange("scale", value)}
                      >
                        <SelectTrigger id="font-scale">
                          <SelectValue placeholder="Select font scale" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground mt-1">
                        Adjusts the size of all text throughout the interface.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Layout Tab */}
            <TabsContent value="layout">
              <Card>
                <CardHeader>
                  <CardTitle>Layout Settings</CardTitle>
                  <CardDescription>
                    Customize layout and spacing elements.
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="corner-radius">Corner Radius</Label>
                      <div className="pt-2">
                        <Slider
                          defaultValue={[theme.radius]}
                          max={16}
                          step={1}
                          onValueChange={handleRadiusChange}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {theme.radius}px - Controls the roundness of corners on buttons, cards, and other UI elements
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="header-position">Header Position</Label>
                      <Select 
                        value={theme.header.position}
                        onValueChange={(value) => handleHeaderChange("position", value)}
                      >
                        <SelectTrigger id="header-position">
                          <SelectValue placeholder="Select header position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">Fixed (sticky)</SelectItem>
                          <SelectItem value="absolute">Absolute</SelectItem>
                          <SelectItem value="relative">Relative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="header-style">Header Style</Label>
                      <Select 
                        value={theme.header.style}
                        onValueChange={(value) => handleHeaderChange("style", value)}
                      >
                        <SelectTrigger id="header-style">
                          <SelectValue placeholder="Select header style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minimal">Minimal</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="expanded">Expanded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Effects Tab */}
            <TabsContent value="effects">
              <Card>
                <CardHeader>
                  <CardTitle>Visual Effects</CardTitle>
                  <CardDescription>
                    Configure animations and visual enhancements.
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Enable Animations</h3>
                        <p className="text-sm text-muted-foreground">
                          Toggle animations throughout the interface
                        </p>
                      </div>
                      <Switch
                        checked={theme.animations.enabled}
                        onCheckedChange={(checked) => handleAnimationsChange("enabled", checked)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label htmlFor="animation-intensity">Animation Intensity</Label>
                      <Select 
                        value={theme.animations.intensity}
                        onValueChange={(value) => handleAnimationsChange("intensity", value)}
                        disabled={!theme.animations.enabled}
                      >
                        <SelectTrigger id="animation-intensity">
                          <SelectValue placeholder="Select animation intensity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="subtle">Subtle</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="expressive">Expressive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Dark Mode Support</h3>
                        <p className="text-sm text-muted-foreground">
                          Enable dark mode support for the interface
                        </p>
                      </div>
                      <Switch
                        checked={theme.darkMode.enabled}
                        onCheckedChange={(checked) => handleDarkModeChange("enabled", checked)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="default-mode">Default Mode</Label>
                      <Select 
                        value={theme.darkMode.default}
                        onValueChange={(value) => handleDarkModeChange("default", value)}
                        disabled={!theme.darkMode.enabled}
                      >
                        <SelectTrigger id="default-mode">
                          <SelectValue placeholder="Select default mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground mt-1">
                        The default color mode when users first visit
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Live Preview */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>
                Visual representation of your theme settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div style={previewStyles} className="mb-4 overflow-hidden">
                <h3 style={{ color: theme.text, marginBottom: "1rem", fontFamily: theme.typography.headingFont }}>
                  Sample Heading
                </h3>
                <p style={{ color: theme.text, marginBottom: "1rem", fontFamily: theme.typography.bodyFont }}>
                  This is a preview of your theme settings. It shows how colors and components will look.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <button style={buttonPreviewStyles}>
                    Primary Button
                  </button>
                  <button style={secondaryPreviewStyles}>
                    Secondary
                  </button>
                </div>
                <div className="mt-4">
                  <span style={accentPreviewStyles}>Accent Element</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-end mt-8">
        <Button 
          variant="outline" 
          className="mr-2"
          onClick={() => setTheme(defaultTheme)}
        >
          Reset to Default
        </Button>
        
        <Button 
          onClick={saveTheme}
          disabled={updateThemeMutation.isPending}
        >
          {updateThemeMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : "Save Theme"}
        </Button>
      </div>
    </div>
  );
}