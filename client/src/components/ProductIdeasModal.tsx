import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Lightbulb, 
  Loader2, 
  Download, 
  Copy, 
  Check, 
  Target,
  Users,
  TrendingUp,
  Sparkles,
  AlertCircle,
  FileText
} from "lucide-react";
import { useAIGateway } from "@/hooks/use-ai-gateway";
import { useToast } from "@/hooks/use-toast";

interface ProductIdea {
  title: string;
  description: string;
  targetAudience: string;
  valueProposition: string;
  category: string;
}

interface ProductIdeasModalProps {
  trigger?: React.ReactNode;
  theme?: string;
  onIdeaSelect?: (idea: ProductIdea) => void;
}

export default function ProductIdeasModal({ 
  trigger, 
  theme: initialTheme = "", 
  onIdeaSelect 
}: ProductIdeasModalProps) {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(initialTheme);
  const [businessContext, setBusinessContext] = useState("");
  const [generatedIdeas, setGeneratedIdeas] = useState<ProductIdea[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const { generateProductIdeas } = useAIGateway();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!theme.trim()) {
      toast({
        title: "Theme Required",
        description: "Please enter a theme to generate product ideas from.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const context = {
        businessContext: businessContext || "General business context",
        industry: "Professional services",
        targetMarket: "Business professionals"
      };

      const response = await generateProductIdeas(theme, context);
      
      if (response.status === 'success') {
        // Parse the AI response to extract structured product ideas
        const ideas = parseProductIdeas(response.data);
        setGeneratedIdeas(ideas);
        
        toast({
          title: "Ideas Generated",
          description: `Generated ${ideas.length} innovative product/service ideas from your theme.`
        });
      } else {
        throw new Error(response.error || "Failed to generate product ideas");
      }
    } catch (error) {
      console.error('Error generating product ideas:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Unable to generate product ideas. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const parseProductIdeas = (aiResponse: string): ProductIdea[] => {
    try {
      // Parse structured AI response into product ideas
      const lines = aiResponse.split('\n').filter(line => line.trim());
      const ideas: ProductIdea[] = [];
      let currentIdea: Partial<ProductIdea> = {};
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        
        if (trimmedLine.match(/^\d+\.|^-|^\*/)) {
          // New idea title
          if (currentIdea.title) {
            ideas.push(currentIdea as ProductIdea);
          }
          currentIdea = {
            title: trimmedLine.replace(/^\d+\.|^-|^\*/, '').trim(),
            description: "",
            targetAudience: "",
            valueProposition: "",
            category: "Product"
          };
        } else if (trimmedLine.toLowerCase().includes('description:') || 
                   trimmedLine.toLowerCase().includes('overview:')) {
          currentIdea.description = trimmedLine.replace(/.*?:/, '').trim();
        } else if (trimmedLine.toLowerCase().includes('target') || 
                   trimmedLine.toLowerCase().includes('audience:')) {
          currentIdea.targetAudience = trimmedLine.replace(/.*?:/, '').trim();
        } else if (trimmedLine.toLowerCase().includes('value') || 
                   trimmedLine.toLowerCase().includes('benefit:')) {
          currentIdea.valueProposition = trimmedLine.replace(/.*?:/, '').trim();
        } else if (currentIdea.title && !currentIdea.description && trimmedLine.length > 20) {
          // Use as description if no explicit description found
          currentIdea.description = trimmedLine;
        }
      }
      
      // Add the last idea
      if (currentIdea.title) {
        ideas.push(currentIdea as ProductIdea);
      }
      
      // If parsing failed, create fallback ideas from the response
      if (ideas.length === 0) {
        const fallbackIdeas = aiResponse.split('\n\n').filter(section => section.trim().length > 30);
        return fallbackIdeas.slice(0, 5).map((section, index) => ({
          title: `Innovation Opportunity ${index + 1}`,
          description: section.trim(),
          targetAudience: "Business professionals",
          valueProposition: "Enhanced efficiency and growth",
          category: "Service"
        }));
      }
      
      return ideas.slice(0, 6); // Limit to 6 ideas
    } catch (error) {
      console.error('Error parsing product ideas:', error);
      return [];
    }
  };

  const copyToClipboard = async (text: string, ideaTitle: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(ideaTitle);
      setTimeout(() => setCopiedId(null), 2000);
      
      toast({
        title: "Copied to Clipboard",
        description: "Product idea details copied successfully."
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  const exportIdeas = () => {
    const exportText = generatedIdeas.map((idea, index) => 
      `${index + 1}. ${idea.title}\n\nDescription: ${idea.description}\n\nTarget Audience: ${idea.targetAudience}\n\nValue Proposition: ${idea.valueProposition}\n\nCategory: ${idea.category}\n\n${'-'.repeat(50)}\n\n`
    ).join('');
    
    const blob = new Blob([`Product/Service Ideas - Generated from Theme: "${theme}"\n\n${exportText}`], 
      { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `product-ideas-${theme.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "Product ideas exported successfully."
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <Lightbulb className="h-4 w-4" />
            Generate Product Ideas
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Product & Service Ideas Generator
          </DialogTitle>
          <DialogDescription>
            Transform themes and insights into innovative business opportunities with AI-powered ideation
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Generate Ideas</TabsTrigger>
            <TabsTrigger value="results" disabled={generatedIdeas.length === 0}>
              View Results ({generatedIdeas.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme or Insight</Label>
                <Input
                  id="theme"
                  placeholder="Enter a theme, trend, or insight to generate ideas from..."
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="context">Business Context (Optional)</Label>
                <Textarea
                  id="context"
                  placeholder="Provide additional context about your business, industry, or target market..."
                  value={businessContext}
                  onChange={(e) => setBusinessContext(e.target.value)}
                  rows={3}
                />
              </div>
              
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !theme.trim()}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Ideas...
                  </>
                ) : (
                  <>
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Generate Product Ideas
                  </>
                )}
              </Button>
              
              {isGenerating && (
                <Alert>
                  <Sparkles className="h-4 w-4" />
                  <AlertDescription>
                    AI is analyzing your theme and generating innovative product and service ideas...
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Generated Ideas</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={exportIdeas}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
            
            <ScrollArea className="h-96">
              <div className="space-y-4 pr-4">
                {generatedIdeas.map((idea, index) => (
                  <Card key={index} className="relative">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-base">{idea.title}</CardTitle>
                          <Badge variant="secondary">{idea.category}</Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(
                            `${idea.title}\n\n${idea.description}\n\nTarget: ${idea.targetAudience}\nValue: ${idea.valueProposition}`,
                            idea.title
                          )}
                        >
                          {copiedId === idea.title ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{idea.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <Users className="h-3 w-3 text-blue-600" />
                          <span className="font-medium">Target:</span>
                          <span className="text-muted-foreground">{idea.targetAudience}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs">
                          <Target className="h-3 w-3 text-green-600" />
                          <span className="font-medium">Value:</span>
                          <span className="text-muted-foreground">{idea.valueProposition}</span>
                        </div>
                      </div>
                      
                      {onIdeaSelect && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => onIdeaSelect(idea)}
                          className="w-full mt-3"
                        >
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Use This Idea
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}