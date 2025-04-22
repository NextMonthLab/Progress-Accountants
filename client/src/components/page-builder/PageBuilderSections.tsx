import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  GripVertical,
  ChevronDown,
  ChevronUp,
  Settings,
  Trash2,
  Plus,
  Copy,
  Edit,
  Eye,
  Layers
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface PageBuilderComponent {
  id: number;
  name: string;
  type: string;
  sectionId: number;
  order: number;
  content: any;
  createdAt: string;
  updatedAt: string;
  parentId?: number;
  children?: PageBuilderComponent[];
}

interface PageBuilderSection {
  id: number;
  name: string;
  type: string;
  pageId: number;
  order: number;
  layout: 'single' | 'two-column' | 'three-column' | 'sidebar-left' | 'sidebar-right' | 'custom';
  settings: any;
  components: PageBuilderComponent[];
  createdAt: string;
  updatedAt: string;
}

interface PageBuilderSectionsProps {
  sections: PageBuilderSection[];
  onUpdateSection: (sectionId: number, updatedSection: Partial<PageBuilderSection>) => void;
  onRemoveSection: (sectionId: number) => void;
  onReorderSections: (newOrder: PageBuilderSection[]) => void;
  onAddComponent: (sectionId: number, componentType: string) => void;
  onUpdateComponent: (sectionId: number, componentId: number, updatedComponent: Partial<PageBuilderComponent>) => void;
  onRemoveComponent: (sectionId: number, componentId: number) => void;
  onReorderComponents: (sectionId: number, newOrder: PageBuilderComponent[]) => void;
}

const PageBuilderSections: React.FC<PageBuilderSectionsProps> = ({
  sections,
  onUpdateSection,
  onRemoveSection,
  onReorderSections,
  onAddComponent,
  onUpdateComponent,
  onRemoveComponent,
  onReorderComponents
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});
  const [expandedComponents, setExpandedComponents] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<string>("content");

  // Toggle section expanded state
  const toggleSectionExpanded = (sectionId: number) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Toggle component expanded state
  const toggleComponentExpanded = (sectionId: number, componentId: number) => {
    const key = `${sectionId}-${componentId}`;
    setExpandedComponents(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Check if section is expanded
  const isSectionExpanded = (sectionId: number) => {
    return expandedSections[sectionId] || false;
  };

  // Check if component is expanded
  const isComponentExpanded = (sectionId: number, componentId: number) => {
    const key = `${sectionId}-${componentId}`;
    return expandedComponents[key] || false;
  };

  // Handle section drag end
  const handleSectionDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update order property for each section
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));
    
    onReorderSections(updatedItems);
  };

  // Handle component drag end
  const handleComponentDragEnd = (result: any, sectionId: number) => {
    if (!result.destination) return;
    
    const sectionIndex = sections.findIndex(section => section.id === sectionId);
    if (sectionIndex === -1) return;
    
    const sectionComponents = Array.from(sections[sectionIndex].components || []);
    const [reorderedItem] = sectionComponents.splice(result.source.index, 1);
    sectionComponents.splice(result.destination.index, 0, reorderedItem);
    
    // Update order property for each component
    const updatedComponents = sectionComponents.map((item, index) => ({
      ...item,
      order: index
    }));
    
    onReorderComponents(sectionId, updatedComponents);
  };

  // Handle section name change
  const handleSectionNameChange = (sectionId: number, name: string) => {
    onUpdateSection(sectionId, { name });
  };

  // Handle section layout change
  const handleSectionLayoutChange = (sectionId: number, layout: PageBuilderSection['layout']) => {
    onUpdateSection(sectionId, { layout });
  };

  // Handle section settings change
  const handleSectionSettingsChange = (sectionId: number, settings: any) => {
    onUpdateSection(sectionId, { settings });
  };

  // Handle component name change
  const handleComponentNameChange = (sectionId: number, componentId: number, name: string) => {
    onUpdateComponent(sectionId, componentId, { name });
  };

  // Handle component content change
  const handleComponentContentChange = (
    sectionId: number, 
    componentId: number, 
    content: any
  ) => {
    onUpdateComponent(sectionId, componentId, { content });
  };

  // Duplicate a section
  const handleDuplicateSection = (section: PageBuilderSection) => {
    const newSection: PageBuilderSection = {
      ...section,
      id: Date.now(), // Temporary ID that will be replaced on the server
      name: `${section.name} (Copy)`,
      components: section.components.map(component => ({
        ...component,
        id: Date.now() + component.id, // Temporary ID
        sectionId: Date.now() // This will be updated when the section is saved
      }))
    };
    
    // Add the new section after the current one
    const sectionIndex = sections.findIndex(s => s.id === section.id);
    const newSections = [...sections];
    newSections.splice(sectionIndex + 1, 0, newSection);
    
    // Update order property
    const updatedSections = newSections.map((section, index) => ({
      ...section,
      order: index
    }));
    
    onReorderSections(updatedSections);
    
    toast({
      title: "Section duplicated",
      description: `${section.name} has been duplicated.`
    });
  };

  // Duplicate a component
  const handleDuplicateComponent = (section: PageBuilderSection, component: PageBuilderComponent) => {
    const newComponent: PageBuilderComponent = {
      ...component,
      id: Date.now(), // Temporary ID
      name: `${component.name} (Copy)`,
      order: component.order + 1
    };
    
    // Add the new component after the current one
    const componentIndex = section.components.findIndex(c => c.id === component.id);
    const newComponents = [...section.components];
    newComponents.splice(componentIndex + 1, 0, newComponent);
    
    // Update order property
    const updatedComponents = newComponents.map((component, index) => ({
      ...component,
      order: index
    }));
    
    onReorderComponents(section.id, updatedComponents);
    
    toast({
      title: "Component duplicated",
      description: `${component.name} has been duplicated.`
    });
  };

  // Render component editor based on component type
  const renderComponentEditor = (component: PageBuilderComponent, sectionId: number) => {
    const { type, content } = component;
    
    switch (type) {
      case 'heading':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`component-${component.id}-text`}>Heading Text</Label>
              <Input 
                id={`component-${component.id}-text`}
                value={content?.text || ''}
                onChange={(e) => handleComponentContentChange(sectionId, component.id, {
                  ...content,
                  text: e.target.value
                })}
                placeholder="Enter heading text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`component-${component.id}-level`}>Heading Level</Label>
              <Select 
                value={content?.level || 'h2'} 
                onValueChange={(value) => handleComponentContentChange(sectionId, component.id, {
                  ...content,
                  level: value
                })}
              >
                <SelectTrigger id={`component-${component.id}-level`}>
                  <SelectValue placeholder="Select heading level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="h1">H1 - Main Heading</SelectItem>
                  <SelectItem value="h2">H2 - Section Heading</SelectItem>
                  <SelectItem value="h3">H3 - Subsection Heading</SelectItem>
                  <SelectItem value="h4">H4 - Minor Heading</SelectItem>
                  <SelectItem value="h5">H5 - Small Heading</SelectItem>
                  <SelectItem value="h6">H6 - Tiny Heading</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case 'paragraph':
        return (
          <div className="space-y-2">
            <Label htmlFor={`component-${component.id}-text`}>Paragraph Text</Label>
            <Textarea 
              id={`component-${component.id}-text`}
              value={content?.text || ''}
              onChange={(e) => handleComponentContentChange(sectionId, component.id, {
                ...content,
                text: e.target.value
              })}
              placeholder="Enter paragraph text"
              rows={4}
            />
          </div>
        );
        
      case 'image':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`component-${component.id}-src`}>Image URL</Label>
              <Input 
                id={`component-${component.id}-src`}
                value={content?.src || ''}
                onChange={(e) => handleComponentContentChange(sectionId, component.id, {
                  ...content,
                  src: e.target.value
                })}
                placeholder="Enter image URL"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`component-${component.id}-alt`}>Alt Text</Label>
              <Input 
                id={`component-${component.id}-alt`}
                value={content?.alt || ''}
                onChange={(e) => handleComponentContentChange(sectionId, component.id, {
                  ...content,
                  alt: e.target.value
                })}
                placeholder="Enter alt text for accessibility"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`component-${component.id}-width`}>Width</Label>
                <Input 
                  id={`component-${component.id}-width`}
                  type="number"
                  value={content?.width || 400}
                  onChange={(e) => handleComponentContentChange(sectionId, component.id, {
                    ...content,
                    width: parseInt(e.target.value) || 400
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`component-${component.id}-height`}>Height</Label>
                <Input 
                  id={`component-${component.id}-height`}
                  type="number"
                  value={content?.height || 300}
                  onChange={(e) => handleComponentContentChange(sectionId, component.id, {
                    ...content,
                    height: parseInt(e.target.value) || 300
                  })}
                />
              </div>
            </div>
          </div>
        );
        
      case 'button':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`component-${component.id}-text`}>Button Text</Label>
              <Input 
                id={`component-${component.id}-text`}
                value={content?.text || ''}
                onChange={(e) => handleComponentContentChange(sectionId, component.id, {
                  ...content,
                  text: e.target.value
                })}
                placeholder="Enter button text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`component-${component.id}-url`}>Button URL</Label>
              <Input 
                id={`component-${component.id}-url`}
                value={content?.url || '#'}
                onChange={(e) => handleComponentContentChange(sectionId, component.id, {
                  ...content,
                  url: e.target.value
                })}
                placeholder="Enter button URL"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`component-${component.id}-variant`}>Button Style</Label>
              <Select 
                value={content?.variant || 'default'} 
                onValueChange={(value) => handleComponentContentChange(sectionId, component.id, {
                  ...content,
                  variant: value
                })}
              >
                <SelectTrigger id={`component-${component.id}-variant`}>
                  <SelectValue placeholder="Select button style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                  <SelectItem value="ghost">Ghost</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case 'list':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`component-${component.id}-listType`}>List Type</Label>
              <Select 
                value={content?.listType || 'bullet'} 
                onValueChange={(value) => handleComponentContentChange(sectionId, component.id, {
                  ...content,
                  listType: value
                })}
              >
                <SelectTrigger id={`component-${component.id}-listType`}>
                  <SelectValue placeholder="Select list type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bullet">Bullet (Unordered)</SelectItem>
                  <SelectItem value="numbered">Numbered (Ordered)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>List Items</Label>
              <div className="space-y-2">
                {(content?.items || []).map((item: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input 
                      value={item}
                      onChange={(e) => {
                        const newItems = [...(content?.items || [])];
                        newItems[index] = e.target.value;
                        handleComponentContentChange(sectionId, component.id, {
                          ...content,
                          items: newItems
                        });
                      }}
                      placeholder={`Item ${index + 1}`}
                    />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        const newItems = [...(content?.items || [])];
                        newItems.splice(index, 1);
                        handleComponentContentChange(sectionId, component.id, {
                          ...content,
                          items: newItems
                        });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    const newItems = [...(content?.items || []), ''];
                    handleComponentContentChange(sectionId, component.id, {
                      ...content,
                      items: newItems
                    });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </div>
          </div>
        );
        
      case 'divider':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`component-${component.id}-style`}>Divider Style</Label>
              <Select 
                value={content?.style || 'solid'} 
                onValueChange={(value) => handleComponentContentChange(sectionId, component.id, {
                  ...content,
                  style: value
                })}
              >
                <SelectTrigger id={`component-${component.id}-style`}>
                  <SelectValue placeholder="Select divider style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                  <SelectItem value="dotted">Dotted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`component-${component.id}-color`}>Color</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id={`component-${component.id}-color`}
                  type="color"
                  value={content?.color || '#e0e0e0'}
                  onChange={(e) => handleComponentContentChange(sectionId, component.id, {
                    ...content,
                    color: e.target.value
                  })}
                  className="w-12 h-12 p-1"
                />
                <Input 
                  value={content?.color || '#e0e0e0'}
                  onChange={(e) => handleComponentContentChange(sectionId, component.id, {
                    ...content,
                    color: e.target.value
                  })}
                  placeholder="Color hex value"
                />
              </div>
            </div>
          </div>
        );
        
      case 'spacer':
        return (
          <div className="space-y-2">
            <Label htmlFor={`component-${component.id}-height`}>Height (pixels)</Label>
            <Input 
              id={`component-${component.id}-height`}
              type="number"
              value={content?.height || 40}
              onChange={(e) => handleComponentContentChange(sectionId, component.id, {
                ...content,
                height: parseInt(e.target.value) || 40
              })}
            />
          </div>
        );
        
      case 'card':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`component-${component.id}-title`}>Card Title</Label>
              <Input 
                id={`component-${component.id}-title`}
                value={content?.title || ''}
                onChange={(e) => handleComponentContentChange(sectionId, component.id, {
                  ...content,
                  title: e.target.value
                })}
                placeholder="Enter card title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`component-${component.id}-content`}>Card Content</Label>
              <Textarea 
                id={`component-${component.id}-content`}
                value={content?.content || ''}
                onChange={(e) => handleComponentContentChange(sectionId, component.id, {
                  ...content,
                  content: e.target.value
                })}
                placeholder="Enter card content"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`component-${component.id}-image`}>Card Image URL</Label>
              <Input 
                id={`component-${component.id}-image`}
                value={content?.image || ''}
                onChange={(e) => handleComponentContentChange(sectionId, component.id, {
                  ...content,
                  image: e.target.value
                })}
                placeholder="Enter image URL (optional)"
              />
            </div>
          </div>
        );
        
      case 'cta':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`component-${component.id}-heading`}>Heading</Label>
              <Input 
                id={`component-${component.id}-heading`}
                value={content?.heading || ''}
                onChange={(e) => handleComponentContentChange(sectionId, component.id, {
                  ...content,
                  heading: e.target.value
                })}
                placeholder="Enter CTA heading"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`component-${component.id}-text`}>Text</Label>
              <Textarea 
                id={`component-${component.id}-text`}
                value={content?.text || ''}
                onChange={(e) => handleComponentContentChange(sectionId, component.id, {
                  ...content,
                  text: e.target.value
                })}
                placeholder="Enter CTA text"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`component-${component.id}-buttonText`}>Button Text</Label>
              <Input 
                id={`component-${component.id}-buttonText`}
                value={content?.buttonText || ''}
                onChange={(e) => handleComponentContentChange(sectionId, component.id, {
                  ...content,
                  buttonText: e.target.value
                })}
                placeholder="Enter button text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`component-${component.id}-buttonUrl`}>Button URL</Label>
              <Input 
                id={`component-${component.id}-buttonUrl`}
                value={content?.buttonUrl || '#'}
                onChange={(e) => handleComponentContentChange(sectionId, component.id, {
                  ...content,
                  buttonUrl: e.target.value
                })}
                placeholder="Enter button URL"
              />
            </div>
          </div>
        );
        
      default:
        return (
          <div className="text-sm text-muted-foreground p-4 border border-dashed rounded-md">
            No editor available for component type: {type}
          </div>
        );
    }
  };

  // Render preview based on component type
  const renderComponentPreview = (component: PageBuilderComponent) => {
    const { type, content } = component;
    
    switch (type) {
      case 'heading':
        switch (content?.level || 'h2') {
          case 'h1': return <h1 className="text-2xl font-bold">{content?.text || 'Heading'}</h1>;
          case 'h2': return <h2 className="text-xl font-bold">{content?.text || 'Heading'}</h2>;
          case 'h3': return <h3 className="text-lg font-bold">{content?.text || 'Heading'}</h3>;
          case 'h4': return <h4 className="text-base font-bold">{content?.text || 'Heading'}</h4>;
          case 'h5': return <h5 className="text-sm font-bold">{content?.text || 'Heading'}</h5>;
          case 'h6': return <h6 className="text-xs font-bold">{content?.text || 'Heading'}</h6>;
          default: return <h2 className="text-xl font-bold">{content?.text || 'Heading'}</h2>;
        }
        
      case 'paragraph':
        return <p className="text-sm">{content?.text || 'Paragraph text'}</p>;
        
      case 'image':
        return (
          <div className="border rounded-md overflow-hidden flex items-center justify-center bg-muted/30 h-24">
            {content?.src ? (
              <img 
                src={content.src} 
                alt={content.alt || 'Image'} 
                className="max-h-full object-contain" 
              />
            ) : (
              <div className="text-xs text-muted-foreground">Image</div>
            )}
          </div>
        );
        
      case 'button':
        return (
          <Button variant={content?.variant || 'default'} size="sm" className="pointer-events-none">
            {content?.text || 'Button'}
          </Button>
        );
        
      case 'list':
        if (content?.listType === 'numbered') {
          return (
            <ol className="list-decimal list-inside text-sm">
              {(content?.items || ['Item 1', 'Item 2']).map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ol>
          );
        } else {
          return (
            <ul className="list-disc list-inside text-sm">
              {(content?.items || ['Item 1', 'Item 2']).map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          );
        }
        
      case 'divider':
        return (
          <div 
            className="w-full my-2" 
            style={{ 
              borderTopWidth: '1px',
              borderTopStyle: content?.style || 'solid',
              borderTopColor: content?.color || '#e0e0e0'
            }} 
          />
        );
        
      case 'spacer':
        return (
          <div 
            className="w-full bg-muted/20 flex items-center justify-center text-xs text-muted-foreground"
            style={{ height: `${content?.height || 40}px` }}
          >
            Spacer ({content?.height || 40}px)
          </div>
        );
        
      case 'card':
        return (
          <div className="border rounded-md p-3 text-sm">
            {content?.image && (
              <div className="h-12 bg-muted/30 mb-2 rounded flex items-center justify-center overflow-hidden">
                <span className="text-xs text-muted-foreground">Card Image</span>
              </div>
            )}
            <div className="font-medium mb-1">{content?.title || 'Card Title'}</div>
            <div className="text-xs text-muted-foreground">{content?.content || 'Card content'}</div>
          </div>
        );
        
      case 'cta':
        return (
          <div className="border rounded-md p-3 text-sm">
            <div className="font-medium mb-1">{content?.heading || 'Call to Action'}</div>
            <div className="text-xs text-muted-foreground mb-2">{content?.text || 'CTA text'}</div>
            <Button size="sm" variant="default" className="pointer-events-none">
              {content?.buttonText || 'Get Started'}
            </Button>
          </div>
        );
        
      default:
        return (
          <div className="text-xs text-muted-foreground p-2 border border-dashed rounded-md">
            {component.type} component
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <DragDropContext onDragEnd={handleSectionDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {sections.map((section, index) => (
                <Draggable key={section.id} draggableId={section.id.toString()} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="border rounded-md bg-card text-card-foreground shadow-sm"
                    >
                      <div className="flex items-center justify-between p-4 border-b">
                        <div className="flex items-center">
                          <div
                            {...provided.dragHandleProps}
                            className="mr-2 text-muted-foreground cursor-grab"
                          >
                            <GripVertical className="h-5 w-5" />
                          </div>
                          <div>
                            <Input
                              value={section.name}
                              onChange={(e) => handleSectionNameChange(section.id, e.target.value)}
                              className="font-medium"
                              placeholder="Section Name"
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDuplicateSection(section)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Settings className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <Tabs defaultValue="layout" className="w-full">
                                <TabsList className="grid grid-cols-2 mb-2">
                                  <TabsTrigger value="layout">Layout</TabsTrigger>
                                  <TabsTrigger value="settings">Settings</TabsTrigger>
                                </TabsList>
                                <TabsContent value="layout" className="space-y-4">
                                  <div className="space-y-2">
                                    <Label>Layout Type</Label>
                                    <Select
                                      value={section.layout}
                                      onValueChange={(value) => handleSectionLayoutChange(
                                        section.id, 
                                        value as PageBuilderSection['layout']
                                      )}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select layout" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="single">Single Column</SelectItem>
                                        <SelectItem value="two-column">Two Columns</SelectItem>
                                        <SelectItem value="three-column">Three Columns</SelectItem>
                                        <SelectItem value="sidebar-left">Sidebar Left</SelectItem>
                                        <SelectItem value="sidebar-right">Sidebar Right</SelectItem>
                                        <SelectItem value="custom">Custom</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </TabsContent>
                                <TabsContent value="settings" className="space-y-4">
                                  <div className="space-y-2">
                                    <Label>Background Color</Label>
                                    <div className="flex gap-2">
                                      <Input
                                        type="color"
                                        value={section.settings?.backgroundColor || '#ffffff'}
                                        onChange={(e) => handleSectionSettingsChange(section.id, {
                                          ...section.settings,
                                          backgroundColor: e.target.value
                                        })}
                                        className="w-10 h-10 p-1"
                                      />
                                      <Input
                                        value={section.settings?.backgroundColor || '#ffffff'}
                                        onChange={(e) => handleSectionSettingsChange(section.id, {
                                          ...section.settings,
                                          backgroundColor: e.target.value
                                        })}
                                        placeholder="Background color"
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <Label>Full Width</Label>
                                      <input
                                        type="checkbox"
                                        checked={section.settings?.fullWidth || false}
                                        onChange={(e) => handleSectionSettingsChange(section.id, {
                                          ...section.settings,
                                          fullWidth: e.target.checked
                                        })}
                                        className="toggle"
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Padding (px)</Label>
                                    <div className="grid grid-cols-4 gap-2">
                                      <div className="space-y-1">
                                        <Label className="text-xs">Top</Label>
                                        <Input
                                          type="number"
                                          value={section.settings?.padding?.top || 48}
                                          onChange={(e) => handleSectionSettingsChange(section.id, {
                                            ...section.settings,
                                            padding: {
                                              ...section.settings?.padding,
                                              top: parseInt(e.target.value) || 0
                                            }
                                          })}
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <Label className="text-xs">Right</Label>
                                        <Input
                                          type="number"
                                          value={section.settings?.padding?.right || 24}
                                          onChange={(e) => handleSectionSettingsChange(section.id, {
                                            ...section.settings,
                                            padding: {
                                              ...section.settings?.padding,
                                              right: parseInt(e.target.value) || 0
                                            }
                                          })}
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <Label className="text-xs">Bottom</Label>
                                        <Input
                                          type="number"
                                          value={section.settings?.padding?.bottom || 48}
                                          onChange={(e) => handleSectionSettingsChange(section.id, {
                                            ...section.settings,
                                            padding: {
                                              ...section.settings?.padding,
                                              bottom: parseInt(e.target.value) || 0
                                            }
                                          })}
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <Label className="text-xs">Left</Label>
                                        <Input
                                          type="number"
                                          value={section.settings?.padding?.left || 24}
                                          onChange={(e) => handleSectionSettingsChange(section.id, {
                                            ...section.settings,
                                            padding: {
                                              ...section.settings?.padding,
                                              left: parseInt(e.target.value) || 0
                                            }
                                          })}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </TabsContent>
                              </Tabs>
                            </PopoverContent>
                          </Popover>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSectionExpanded(section.id)}
                          >
                            {isSectionExpanded(section.id) ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveSection(section.id)}
                            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {isSectionExpanded(section.id) && (
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <Layers className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span className="text-sm font-medium">Components</span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onAddComponent(section.id, 'heading')}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Component
                            </Button>
                          </div>

                          <DragDropContext
                            onDragEnd={(result) => handleComponentDragEnd(result, section.id)}
                          >
                            <Droppable droppableId={`section-${section.id}-components`}>
                              {(provided) => (
                                <div
                                  {...provided.droppableProps}
                                  ref={provided.innerRef}
                                  className="space-y-2"
                                >
                                  {section.components && section.components.length > 0 ? (
                                    section.components.map((component, index) => (
                                      <Draggable
                                        key={component.id}
                                        draggableId={`component-${component.id}`}
                                        index={index}
                                      >
                                        {(provided) => (
                                          <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className="border rounded-md bg-background"
                                          >
                                            <div
                                              className="flex items-center justify-between p-3 border-b"
                                            >
                                              <div className="flex items-center">
                                                <div
                                                  {...provided.dragHandleProps}
                                                  className="mr-2 text-muted-foreground cursor-grab"
                                                >
                                                  <GripVertical className="h-4 w-4" />
                                                </div>
                                                <div>
                                                  <Input
                                                    value={component.name}
                                                    onChange={(e) => handleComponentNameChange(
                                                      section.id,
                                                      component.id,
                                                      e.target.value
                                                    )}
                                                    className="text-sm h-8"
                                                    placeholder="Component Name"
                                                  />
                                                </div>
                                              </div>
                                              <div className="flex items-center space-x-1">
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => handleDuplicateComponent(section, component)}
                                                >
                                                  <Copy className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => toggleComponentExpanded(section.id, component.id)}
                                                >
                                                  {isComponentExpanded(section.id, component.id) ? (
                                                    <ChevronUp className="h-3.5 w-3.5" />
                                                  ) : (
                                                    <ChevronDown className="h-3.5 w-3.5" />
                                                  )}
                                                </Button>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => onRemoveComponent(section.id, component.id)}
                                                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                                >
                                                  <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                              </div>
                                            </div>

                                            {isComponentExpanded(section.id, component.id) && (
                                              <div className="p-3">
                                                <Tabs defaultValue="content">
                                                  <TabsList className="grid grid-cols-2 mb-3">
                                                    <TabsTrigger value="content">
                                                      <Edit className="h-3.5 w-3.5 mr-1.5" />
                                                      Content
                                                    </TabsTrigger>
                                                    <TabsTrigger value="preview">
                                                      <Eye className="h-3.5 w-3.5 mr-1.5" />
                                                      Preview
                                                    </TabsTrigger>
                                                  </TabsList>
                                                  <TabsContent value="content">
                                                    {renderComponentEditor(component, section.id)}
                                                  </TabsContent>
                                                  <TabsContent value="preview">
                                                    <div className="p-4 border rounded-md">
                                                      {renderComponentPreview(component)}
                                                    </div>
                                                  </TabsContent>
                                                </Tabs>
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </Draggable>
                                    ))
                                  ) : (
                                    <div className="flex items-center justify-center h-24 border border-dashed rounded-md">
                                      <div className="text-center">
                                        <p className="text-sm text-muted-foreground mb-2">
                                          No components yet
                                        </p>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => onAddComponent(section.id, 'heading')}
                                        >
                                          <Plus className="h-4 w-4 mr-2" />
                                          Add Component
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </DragDropContext>
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {sections.length === 0 && (
        <div className="text-center p-12 border border-dashed rounded-lg">
          <h3 className="font-medium mb-2">No sections yet</h3>
          <p className="text-muted-foreground mb-4">Add a section to start building your page</p>
          <Button onClick={() => onAddComponent(0, 'hero')}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Hero Section
          </Button>
        </div>
      )}
    </div>
  );
};

export default PageBuilderSections;