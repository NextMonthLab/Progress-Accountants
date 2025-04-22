import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Heading1,
  TextIcon,
  Image,
  List,
  ListOrdered,
  Divide,
  PanelBottomOpen,
  Square,
  Layout,
  CreditCard,
  MousePointerClick,
  AlignCenter,
  AlignLeft,
  AlignRight,
  LayoutGrid,
  Rows3,
  Columns3,
  LayoutPanelLeft,
  LayoutPanelTop,
  Plus,
  Mail,
  Play,
  FileText,
  MapPin,
  Users,
  Star,
  LucideIcon
} from "lucide-react";

interface ComponentType {
  name: string;
  type: string;
  icon: LucideIcon;
  description: string;
  category: 'basic' | 'layout' | 'media' | 'interactive' | 'advanced';
}

interface PageBuilderComponentPanelProps {
  onAddSection: (sectionType: string) => void;
  onAddComponent: (sectionId: number, componentType: string) => void;
  currentSectionId: number | undefined;
}

const componentTypes: ComponentType[] = [
  // Basic components
  {
    name: "Heading",
    type: "heading",
    icon: Heading1,
    description: "Add a heading to your page",
    category: "basic"
  },
  {
    name: "Paragraph",
    type: "paragraph",
    icon: TextIcon,
    description: "Add a paragraph of text",
    category: "basic"
  },
  {
    name: "Image",
    type: "image",
    icon: Image,
    description: "Add an image",
    category: "basic"
  },
  {
    name: "Button",
    type: "button",
    icon: MousePointerClick,
    description: "Add a clickable button",
    category: "basic"
  },
  {
    name: "List",
    type: "list",
    icon: List,
    description: "Add a bulleted or numbered list",
    category: "basic"
  },
  {
    name: "Divider",
    type: "divider",
    icon: Divide,
    description: "Add a horizontal line",
    category: "basic"
  },
  {
    name: "Spacer",
    type: "spacer",
    icon: PanelBottomOpen,
    description: "Add empty space",
    category: "basic"
  },
  
  // Layout components
  {
    name: "Card",
    type: "card",
    icon: CreditCard,
    description: "Add a card with title and content",
    category: "layout"
  },
  {
    name: "Grid",
    type: "grid",
    icon: LayoutGrid,
    description: "Add a responsive grid layout",
    category: "layout"
  },
  {
    name: "Container",
    type: "container",
    icon: Square,
    description: "Add a container for components",
    category: "layout"
  },
  {
    name: "Columns",
    type: "columns",
    icon: Columns3,
    description: "Add a multi-column layout",
    category: "layout"
  },
  {
    name: "Rows",
    type: "rows",
    icon: Rows3,
    description: "Add a multi-row layout",
    category: "layout"
  },
  
  // Media components
  {
    name: "Gallery",
    type: "gallery",
    icon: Layout,
    description: "Add an image gallery",
    category: "media"
  },
  {
    name: "Video",
    type: "video",
    icon: Play,
    description: "Add a video player",
    category: "media"
  },
  {
    name: "Icon",
    type: "icon",
    icon: Star,
    description: "Add an icon",
    category: "media"
  },
  
  // Interactive components
  {
    name: "Form",
    type: "form",
    icon: FileText,
    description: "Add a contact form",
    category: "interactive"
  },
  {
    name: "Map",
    type: "map",
    icon: MapPin,
    description: "Add a location map",
    category: "interactive"
  },
  {
    name: "Accordion",
    type: "accordion",
    icon: AlignLeft,
    description: "Add expandable content sections",
    category: "interactive"
  },
  
  // Advanced components
  {
    name: "Call to Action",
    type: "cta",
    icon: Mail,
    description: "Add a call to action section",
    category: "advanced"
  },
  {
    name: "Testimonial",
    type: "testimonial",
    icon: Users,
    description: "Add a customer testimonial",
    category: "advanced"
  }
];

const sectionTypes = [
  {
    name: "Content Section",
    type: "content",
    icon: Layout,
    description: "Basic content section with customizable components"
  },
  {
    name: "Hero Section",
    type: "hero",
    icon: AlignCenter,
    description: "Large hero banner for page intros"
  },
  {
    name: "Feature Grid",
    type: "feature-grid",
    icon: LayoutGrid,
    description: "Display features in a grid layout"
  },
  {
    name: "Two Column",
    type: "two-column",
    icon: Columns3,
    description: "Two column layout for content"
  },
  {
    name: "Sidebar Left",
    type: "sidebar-left",
    icon: LayoutPanelLeft,
    description: "Content with left sidebar"
  },
  {
    name: "Sidebar Right",
    type: "sidebar-right",
    icon: LayoutPanelTop,
    description: "Content with right sidebar"
  },
  {
    name: "CTA Section",
    type: "cta-section",
    icon: Mail,
    description: "Call to action section with button"
  }
];

const PageBuilderComponentPanel: React.FC<PageBuilderComponentPanelProps> = ({
  onAddSection,
  onAddComponent,
  currentSectionId
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Add Section</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-60 pr-4">
            <div className="space-y-2">
              {sectionTypes.map((section) => (
                <Button
                  key={section.type}
                  variant="outline"
                  className="w-full justify-start h-auto py-3 px-4"
                  onClick={() => onAddSection(section.type)}
                >
                  <div className="flex items-start">
                    <section.icon className="h-5 w-5 mr-3 text-primary" />
                    <div className="text-left">
                      <div className="font-medium">{section.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {section.description}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Add Component</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="layout">Layout</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="interactive">Forms</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            {['basic', 'layout', 'media', 'interactive', 'advanced'].map((category) => (
              <TabsContent key={category} value={category} className="space-y-4">
                <ScrollArea className="h-96 pr-4">
                  <div className="space-y-2">
                    {componentTypes
                      .filter((comp) => comp.category === category)
                      .map((component) => (
                        <Button
                          key={component.type}
                          variant="outline"
                          className="w-full justify-start h-auto py-3 px-4"
                          onClick={() => {
                            if (currentSectionId !== undefined) {
                              onAddComponent(currentSectionId, component.type);
                            } else {
                              // If no section is selected, show a message or create a new section first
                              alert("Please select or create a section first");
                            }
                          }}
                          disabled={currentSectionId === undefined}
                        >
                          <div className="flex items-start">
                            <component.icon className="h-5 w-5 mr-3 text-primary" />
                            <div className="text-left">
                              <div className="font-medium">{component.name}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {component.description}
                              </div>
                            </div>
                          </div>
                        </Button>
                      ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="headers">
              <AccordionTrigger>Header Templates</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => onAddSection('hero')}>
                    <div className="flex items-center">
                      <AlignCenter className="h-4 w-4 mr-2" />
                      <span>Hero Banner</span>
                    </div>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => onAddSection('nav-header')}>
                    <div className="flex items-center">
                      <AlignRight className="h-4 w-4 mr-2" />
                      <span>Navigation Header</span>
                    </div>
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="content">
              <AccordionTrigger>Content Templates</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => onAddSection('feature-grid')}>
                    <div className="flex items-center">
                      <LayoutGrid className="h-4 w-4 mr-2" />
                      <span>Feature Grid</span>
                    </div>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => onAddSection('testimonials')}>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Testimonials</span>
                    </div>
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="footers">
              <AccordionTrigger>Footer Templates</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => onAddSection('simple-footer')}>
                    <div className="flex items-center">
                      <AlignLeft className="h-4 w-4 mr-2" />
                      <span>Simple Footer</span>
                    </div>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => onAddSection('multi-column-footer')}>
                    <div className="flex items-center">
                      <Columns3 className="h-4 w-4 mr-2" />
                      <span>Multi-Column Footer</span>
                    </div>
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default PageBuilderComponentPanel;