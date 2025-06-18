import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { PaintBucket, Loader2, Copy, CheckCircle2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface ColorPalette {
  id: number;
  tenantId: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  backgroundColor: string;
  additionalColors: string[];
  mood: string;
  industry: string;
  createdAt: string;
  updatedAt: string;
}

interface AIColorPaletteGeneratorProps {
  tenantId: string;
  onApplyPalette: (palette: ColorPalette) => void;
}

const AIColorPaletteGenerator: React.FC<AIColorPaletteGeneratorProps> = ({
  tenantId,
  onApplyPalette
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [colorPalettes, setColorPalettes] = useState<ColorPalette[]>([]);
  const [selectedPalette, setSelectedPalette] = useState<number | null>(null);
  const [industry, setIndustry] = useState('accounting');
  const [mood, setMood] = useState('professional');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  
  const { toast } = useToast();

  // Fetch existing color palettes
  const fetchColorPalettes = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('GET', `/api/ai-design/colors/${tenantId}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setColorPalettes(data.data);
        if (data.data.length > 0) {
          setSelectedPalette(0);
        }
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to fetch color palettes',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching color palettes:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while fetching color palettes',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate new color palettes
  const generateColorPalettes = async () => {
    setIsGenerating(true);
    try {
      const response = await apiRequest('POST', '/api/ai-design/colors/generate', {
        tenantId,
        industry,
        mood
      });
      const data = await response.json();
      
      if (data.success && data.data) {
        setColorPalettes(prev => [...data.data, ...prev]);
        setSelectedPalette(0);
        toast({
          title: 'Color palettes generated',
          description: 'New color palettes have been generated successfully',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to generate color palettes',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error generating color palettes:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while generating color palettes',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Initialize by fetching color palettes
  useEffect(() => {
    fetchColorPalettes();
  }, [tenantId]);

  // Copy color to clipboard
  const copyColorToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    
    // Reset the copied state after a delay
    setTimeout(() => {
      setCopiedColor(null);
    }, 2000);
  };

  // Apply the selected palette
  const handleApplyPalette = () => {
    if (selectedPalette === null || !colorPalettes[selectedPalette]) {
      toast({
        title: 'No palette selected',
        description: 'Please select a color palette to apply',
        variant: 'destructive',
      });
      return;
    }

    onApplyPalette(colorPalettes[selectedPalette]);
    
    toast({
      title: 'Palette applied',
      description: 'The selected color palette has been applied',
      variant: 'default',
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <PaintBucket className="h-5 w-5 text-primary" />
          AI Color Palette Generator
        </CardTitle>
        <CardDescription>
          Generate harmonious color palettes for your website based on industry and mood
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="accounting">Accounting</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="hospitality">Hospitality</SelectItem>
                  <SelectItem value="construction">Construction</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="real-estate">Real Estate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mood">Mood</Label>
              <Select value={mood} onValueChange={setMood}>
                <SelectTrigger id="mood">
                  <SelectValue placeholder="Select mood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="energetic">Energetic</SelectItem>
                  <SelectItem value="calming">Calming</SelectItem>
                  <SelectItem value="luxurious">Luxurious</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="minimalist">Minimalist</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={generateColorPalettes} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate New Palettes
              </>
            )}
          </Button>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading color palettes...</span>
            </div>
          ) : (
            <>
              {colorPalettes.length > 0 ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="paletteSelect">Select Palette</Label>
                    <Select 
                      value={selectedPalette !== null ? selectedPalette.toString() : ''} 
                      onValueChange={(value) => setSelectedPalette(parseInt(value))}
                    >
                      <SelectTrigger id="paletteSelect">
                        <SelectValue placeholder="Select color palette" />
                      </SelectTrigger>
                      <SelectContent>
                        {colorPalettes.map((palette, index) => (
                          <SelectItem key={index} value={index.toString()}>
                            {palette.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedPalette !== null && colorPalettes[selectedPalette] && (
                    <div className="space-y-4">
                      <div className="border rounded-md p-4">
                        <h4 className="font-medium mb-3">{colorPalettes[selectedPalette].name}</h4>
                        
                        <div className="grid grid-cols-5 gap-3 mb-4">
                          {['primary', 'secondary', 'accent', 'text', 'background'].map((colorType, idx) => {
                            const colorKey = `${colorType}Color` as keyof ColorPalette;
                            const colorValue = colorPalettes[selectedPalette][colorKey] as string;
                            return (
                              <div key={idx} className="flex flex-col items-center">
                                <div className="relative group">
                                  <div 
                                    className="w-12 h-12 rounded-md border cursor-pointer transition-transform group-hover:scale-110" 
                                    style={{ backgroundColor: colorValue }}
                                    onClick={() => copyColorToClipboard(colorValue)}
                                  />
                                  <button 
                                    className="absolute -top-2 -right-2 bg-background border rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => copyColorToClipboard(colorValue)}
                                  >
                                    {copiedColor === colorValue ? (
                                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                                    ) : (
                                      <Copy className="h-3 w-3 text-muted-foreground" />
                                    )}
                                  </button>
                                </div>
                                <span className="text-xs text-muted-foreground mt-1 capitalize">{colorType}</span>
                                <span className="text-xs font-mono mt-0.5">{colorValue}</span>
                              </div>
                            );
                          })}
                        </div>

                        {colorPalettes[selectedPalette].additionalColors && 
                         colorPalettes[selectedPalette].additionalColors.length > 0 && (
                          <div className="mt-4">
                            <h5 className="text-sm font-medium mb-2">Additional Colors</h5>
                            <div className="flex flex-wrap gap-2">
                              {colorPalettes[selectedPalette].additionalColors.map((color, idx) => (
                                <div key={idx} className="relative group">
                                  <div 
                                    className="w-8 h-8 rounded-md border cursor-pointer transition-transform group-hover:scale-110" 
                                    style={{ backgroundColor: color }}
                                    onClick={() => copyColorToClipboard(color)}
                                    title={color}
                                  />
                                  <button 
                                    className="absolute -top-2 -right-2 bg-background border rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => copyColorToClipboard(color)}
                                  >
                                    {copiedColor === color ? (
                                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                                    ) : (
                                      <Copy className="h-3 w-3 text-muted-foreground" />
                                    )}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div>Mood: <span className="capitalize">{colorPalettes[selectedPalette].mood}</span></div>
                        <div>Industry: <span className="capitalize">{colorPalettes[selectedPalette].industry}</span></div>
                      </div>

                      <Button onClick={handleApplyPalette} className="w-full">
                        Apply This Color Palette
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <PaintBucket className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground mb-4">No color palettes available yet</p>
                  <Button onClick={generateColorPalettes} disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Generate Color Palettes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground">
          {colorPalettes.length} palettes available
        </div>
        <Button variant="ghost" size="sm" onClick={fetchColorPalettes} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIColorPaletteGenerator;