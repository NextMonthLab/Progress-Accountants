import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { ColorPicker } from '@/components/ui/color-picker';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { PageBuilderComponent } from '@shared/advanced_page_builder';
import { Slider } from '@/components/ui/slider';
import { 
  Type, 
  ImageIcon, 
  FileText, 
  ExternalLink, 
  Video, 
  Mail,
  Grid2X2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  BoldIcon 
} from 'lucide-react';

interface PageBuilderComponentEditorProps {
  isOpen: boolean;
  onClose: () => void;
  component: PageBuilderComponent;
  onSave: (updatedComponent: PageBuilderComponent) => void;
}

const PageBuilderComponentEditor: React.FC<PageBuilderComponentEditorProps> = ({
  isOpen,
  onClose,
  component,
  onSave
}) => {
  const [editedComponent, setEditedComponent] = useState(component);
  const [activeTab, setActiveTab] = useState('content');

  const handleSave = () => {
    onSave(editedComponent);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties (e.g. content.text)
      const [parent, child] = name.split('.');
      setEditedComponent({
        ...editedComponent,
        [parent]: {
          ...editedComponent[parent],
          [child]: value
        }
      });
    } else {
      setEditedComponent({
        ...editedComponent,
        [name]: value
      });
    }
  };

  const handleContentChange = (key: string, value: string | number | boolean) => {
    setEditedComponent({
      ...editedComponent,
      content: {
        ...editedComponent.content,
        [key]: value
      }
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name.includes('.')) {
      // Handle nested properties (e.g. content.level)
      const [parent, child] = name.split('.');
      setEditedComponent({
        ...editedComponent,
        [parent]: {
          ...editedComponent[parent],
          [child]: value
        }
      });
    } else {
      setEditedComponent({
        ...editedComponent,
        [name]: value
      });
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    if (name.includes('.')) {
      // Handle nested properties
      const [parent, child] = name.split('.');
      setEditedComponent({
        ...editedComponent,
        [parent]: {
          ...editedComponent[parent],
          [child]: checked
        }
      });
    } else {
      setEditedComponent({
        ...editedComponent,
        [name]: checked
      });
    }
  };

  const renderComponentSpecificEditor = () => {
    switch (editedComponent?.type) {
      case 'heading':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="content.text">Heading Text</Label>
              <Textarea
                id="content.text"
                name="content.text"
                value={editedComponent.content?.text || ''}
                onChange={handleChange}
                className="min-h-[100px] mt-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="content.level">Heading Level</Label>
                <Select
                  value={editedComponent.content?.level || 'h2'}
                  onValueChange={(value) => handleSelectChange('content.level', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select heading level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="h1">Heading 1 (H1)</SelectItem>
                    <SelectItem value="h2">Heading 2 (H2)</SelectItem>
                    <SelectItem value="h3">Heading 3 (H3)</SelectItem>
                    <SelectItem value="h4">Heading 4 (H4)</SelectItem>
                    <SelectItem value="h5">Heading 5 (H5)</SelectItem>
                    <SelectItem value="h6">Heading 6 (H6)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="content.alignment">Alignment</Label>
                <Select
                  value={editedComponent.content?.alignment || 'left'}
                  onValueChange={(value) => handleSelectChange('content.alignment', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select alignment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="content.color">Text Color</Label>
              <div className="mt-2">
                <ColorPicker
                  value={editedComponent.content?.color || '#000000'}
                  onChange={(color) => handleContentChange('color', color)}
                />
              </div>
            </div>
          </div>
        );
      
      case 'paragraph':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="content.text">Paragraph Text</Label>
              <Textarea
                id="content.text"
                name="content.text"
                value={editedComponent.content?.text || ''}
                onChange={handleChange}
                className="min-h-[200px] mt-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="content.alignment">Alignment</Label>
                <Select
                  value={editedComponent.content?.alignment || 'left'}
                  onValueChange={(value) => handleSelectChange('content.alignment', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select alignment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                    <SelectItem value="justify">Justify</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="content.size">Text Size</Label>
                <Select
                  value={editedComponent.content?.size || 'medium'}
                  onValueChange={(value) => handleSelectChange('content.size', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="content.bold"
                  checked={editedComponent.content?.bold || false}
                  onCheckedChange={(checked) => 
                    handleSwitchChange('content.bold', checked as boolean)
                  }
                />
                <Label htmlFor="content.bold">Bold</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="content.italic"
                  checked={editedComponent.content?.italic || false}
                  onCheckedChange={(checked) => 
                    handleSwitchChange('content.italic', checked as boolean)
                  }
                />
                <Label htmlFor="content.italic">Italic</Label>
              </div>
            </div>
            <div>
              <Label htmlFor="content.color">Text Color</Label>
              <div className="mt-2">
                <ColorPicker
                  value={editedComponent.content?.color || '#000000'}
                  onChange={(color) => handleContentChange('color', color)}
                />
              </div>
            </div>
          </div>
        );
      
      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="content.src">Image URL</Label>
              <Input
                id="content.src"
                name="content.src"
                value={editedComponent.content?.src || ''}
                onChange={handleChange}
                className="mt-2"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="content.alt">Alt Text</Label>
              <Input
                id="content.alt"
                name="content.alt"
                value={editedComponent.content?.alt || ''}
                onChange={handleChange}
                className="mt-2"
                placeholder="Image description for accessibility"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="content.width">Width (px)</Label>
                <Input
                  id="content.width"
                  name="content.width"
                  type="number"
                  value={editedComponent.content?.width || ''}
                  onChange={handleChange}
                  className="mt-2"
                  placeholder="e.g., 800"
                />
              </div>
              <div>
                <Label htmlFor="content.height">Height (px)</Label>
                <Input
                  id="content.height"
                  name="content.height"
                  type="number"
                  value={editedComponent.content?.height || ''}
                  onChange={handleChange}
                  className="mt-2"
                  placeholder="e.g., 600"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="content.caption">Caption (optional)</Label>
              <Input
                id="content.caption"
                name="content.caption"
                value={editedComponent.content?.caption || ''}
                onChange={handleChange}
                className="mt-2"
                placeholder="Image caption"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="content.responsive"
                checked={editedComponent.content?.responsive !== false}
                onCheckedChange={(checked) => 
                  handleSwitchChange('content.responsive', checked)
                }
              />
              <Label htmlFor="content.responsive">Make image responsive</Label>
            </div>
          </div>
        );
      
      case 'button':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="content.text">Button Text</Label>
              <Input
                id="content.text"
                name="content.text"
                value={editedComponent.content?.text || ''}
                onChange={handleChange}
                className="mt-2"
                placeholder="e.g., Click Me"
              />
            </div>
            <div>
              <Label htmlFor="content.url">Button URL</Label>
              <Input
                id="content.url"
                name="content.url"
                value={editedComponent.content?.url || ''}
                onChange={handleChange}
                className="mt-2"
                placeholder="e.g., /contact"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="content.variant">Button Style</Label>
                <Select
                  value={editedComponent.content?.variant || 'default'}
                  onValueChange={(value) => handleSelectChange('content.variant', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="outline">Outline</SelectItem>
                    <SelectItem value="destructive">Destructive</SelectItem>
                    <SelectItem value="ghost">Ghost</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="content.size">Button Size</Label>
                <Select
                  value={editedComponent.content?.size || 'default'}
                  onValueChange={(value) => handleSelectChange('content.size', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="content.newTab"
                checked={editedComponent.content?.newTab || false}
                onCheckedChange={(checked) => 
                  handleSwitchChange('content.newTab', checked)
                }
              />
              <Label htmlFor="content.newTab">Open in new tab</Label>
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="content.videoUrl">Video URL</Label>
              <Input
                id="content.videoUrl"
                name="content.videoUrl"
                value={editedComponent.content?.videoUrl || ''}
                onChange={handleChange}
                className="mt-2"
                placeholder="e.g., https://www.youtube.com/embed/..."
              />
            </div>
            <div>
              <Label htmlFor="content.posterUrl">Poster Image URL (Optional)</Label>
              <Input
                id="content.posterUrl"
                name="content.posterUrl"
                value={editedComponent.content?.posterUrl || ''}
                onChange={handleChange}
                className="mt-2"
                placeholder="e.g., https://example.com/video-poster.jpg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="content.width">Width (px)</Label>
                <Input
                  id="content.width"
                  name="content.width"
                  type="number"
                  value={editedComponent.content?.width || ''}
                  onChange={handleChange}
                  className="mt-2"
                  placeholder="e.g., 800"
                />
              </div>
              <div>
                <Label htmlFor="content.height">Height (px)</Label>
                <Input
                  id="content.height"
                  name="content.height"
                  type="number"
                  value={editedComponent.content?.height || ''}
                  onChange={handleChange}
                  className="mt-2"
                  placeholder="e.g., 450"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="content.autoplay"
                checked={editedComponent.content?.autoplay || false}
                onCheckedChange={(checked) => 
                  handleSwitchChange('content.autoplay', checked)
                }
              />
              <Label htmlFor="content.autoplay">Autoplay video</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="content.controls"
                checked={editedComponent.content?.controls !== false}
                onCheckedChange={(checked) => 
                  handleSwitchChange('content.controls', checked)
                }
              />
              <Label htmlFor="content.controls">Show controls</Label>
            </div>
          </div>
        );

      case 'feature':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="content.title">Feature Title</Label>
              <Input
                id="content.title"
                name="content.title"
                value={editedComponent.content?.title || ''}
                onChange={handleChange}
                className="mt-2"
                placeholder="e.g., Feature Title"
              />
            </div>
            <div>
              <Label htmlFor="content.content">Feature Description</Label>
              <Textarea
                id="content.content"
                name="content.content"
                value={editedComponent.content?.content || ''}
                onChange={handleChange}
                className="min-h-[150px] mt-2"
                placeholder="Describe this feature..."
              />
            </div>
            <div>
              <Label htmlFor="content.iconName">Icon Name (Optional)</Label>
              <Input
                id="content.iconName"
                name="content.iconName"
                value={editedComponent.content?.iconName || ''}
                onChange={handleChange}
                className="mt-2"
                placeholder="e.g., star"
              />
            </div>
            <div>
              <Label htmlFor="content.imageUrl">Image URL (Optional)</Label>
              <Input
                id="content.imageUrl"
                name="content.imageUrl"
                value={editedComponent.content?.imageUrl || ''}
                onChange={handleChange}
                className="mt-2"
                placeholder="e.g., https://example.com/feature-image.jpg"
              />
            </div>
          </div>
        );

      case 'cta':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="content.heading">CTA Heading</Label>
              <Input
                id="content.heading"
                name="content.heading"
                value={editedComponent.content?.heading || ''}
                onChange={handleChange}
                className="mt-2"
                placeholder="e.g., Ready to Get Started?"
              />
            </div>
            <div>
              <Label htmlFor="content.text">CTA Text</Label>
              <Textarea
                id="content.text"
                name="content.text"
                value={editedComponent.content?.text || ''}
                onChange={handleChange}
                className="min-h-[100px] mt-2"
                placeholder="Supporting text for your call to action..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="content.buttonText">Button Text</Label>
                <Input
                  id="content.buttonText"
                  name="content.buttonText"
                  value={editedComponent.content?.buttonText || ''}
                  onChange={handleChange}
                  className="mt-2"
                  placeholder="e.g., Contact Us"
                />
              </div>
              <div>
                <Label htmlFor="content.buttonUrl">Button URL</Label>
                <Input
                  id="content.buttonUrl"
                  name="content.buttonUrl"
                  value={editedComponent.content?.buttonUrl || ''}
                  onChange={handleChange}
                  className="mt-2"
                  placeholder="e.g., /contact"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="content.variant">Button Style</Label>
                <Select
                  value={editedComponent.content?.variant || 'default'}
                  onValueChange={(value) => handleSelectChange('content.variant', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="outline">Outline</SelectItem>
                    <SelectItem value="destructive">Destructive</SelectItem>
                    <SelectItem value="ghost">Ghost</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="content.backgroundColor">Background Color</Label>
                <div className="mt-2">
                  <ColorPicker
                    value={editedComponent.content?.backgroundColor || '#f5f5f5'}
                    onChange={(color) => handleContentChange('backgroundColor', color)}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Component Name</Label>
              <Input
                id="name"
                name="name"
                value={editedComponent.name || ''}
                onChange={handleChange}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="type">Component Type</Label>
              <Input
                id="type"
                name="type"
                value={editedComponent.type || ''}
                disabled
                className="mt-2"
              />
            </div>
            <div>
              <Label>Content (JSON)</Label>
              <Textarea
                value={JSON.stringify(editedComponent.content || {}, null, 2)}
                onChange={(e) => {
                  try {
                    const content = JSON.parse(e.target.value);
                    setEditedComponent({
                      ...editedComponent,
                      content
                    });
                  } catch (error) {
                    // Invalid JSON, do not update
                  }
                }}
                className="min-h-[200px] mt-2 font-mono text-sm"
              />
            </div>
          </div>
        );
    }
  };

  const renderStyleTab = () => {
    return (
      <div className="space-y-4">
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="style.marginTop">Margin Top (px)</Label>
                <Input
                  id="style.marginTop"
                  name="style.marginTop"
                  type="number"
                  value={editedComponent.style?.marginTop || '0'}
                  onChange={handleChange}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="style.marginBottom">Margin Bottom (px)</Label>
                <Input
                  id="style.marginBottom"
                  name="style.marginBottom"
                  type="number"
                  value={editedComponent.style?.marginBottom || '0'}
                  onChange={handleChange}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="style.paddingTop">Padding Top (px)</Label>
                <Input
                  id="style.paddingTop"
                  name="style.paddingTop"
                  type="number"
                  value={editedComponent.style?.paddingTop || '0'}
                  onChange={handleChange}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="style.paddingBottom">Padding Bottom (px)</Label>
                <Input
                  id="style.paddingBottom"
                  name="style.paddingBottom"
                  type="number"
                  value={editedComponent.style?.paddingBottom || '0'}
                  onChange={handleChange}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="mt-4">
              <Label htmlFor="style.backgroundColor">Background Color</Label>
              <div className="mt-2">
                <ColorPicker
                  value={editedComponent.style?.backgroundColor || 'transparent'}
                  onChange={(color) => {
                    setEditedComponent({
                      ...editedComponent,
                      style: {
                        ...editedComponent.style,
                        backgroundColor: color
                      }
                    });
                  }}
                />
              </div>
            </div>

            <div className="mt-4">
              <Label>Border Radius</Label>
              <div className="mt-2">
                <Slider
                  defaultValue={[editedComponent.style?.borderRadius || 0]}
                  max={20}
                  step={1}
                  onValueChange={(value) => {
                    setEditedComponent({
                      ...editedComponent,
                      style: {
                        ...editedComponent.style,
                        borderRadius: value[0]
                      }
                    });
                  }}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs">0px</span>
                  <span className="text-xs">20px</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderAdvancedTab = () => {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="custom-css">Custom CSS</Label>
          <Textarea
            id="custom-css"
            value={editedComponent.customCSS || ''}
            onChange={(e) => {
              setEditedComponent({
                ...editedComponent,
                customCSS: e.target.value
              });
            }}
            className="min-h-[200px] mt-2 font-mono text-sm"
            placeholder=".my-custom-class { color: blue; }"
          />
        </div>
        <div>
          <Label htmlFor="custom-id">Custom ID</Label>
          <Input
            id="custom-id"
            value={editedComponent.customId || ''}
            onChange={(e) => {
              setEditedComponent({
                ...editedComponent,
                customId: e.target.value
              });
            }}
            className="mt-2"
            placeholder="my-custom-id"
          />
        </div>
        <div>
          <Label htmlFor="custom-class">Custom Classes</Label>
          <Input
            id="custom-class"
            value={editedComponent.customClass || ''}
            onChange={(e) => {
              setEditedComponent({
                ...editedComponent,
                customClass: e.target.value
              });
            }}
            className="mt-2"
            placeholder="my-custom-class another-class"
          />
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <Switch
            id="hidden"
            checked={editedComponent.hidden || false}
            onCheckedChange={(checked) => {
              setEditedComponent({
                ...editedComponent,
                hidden: checked
              });
            }}
          />
          <Label htmlFor="hidden">Hide component (will not be visible on page)</Label>
        </div>
      </div>
    );
  };

  const getComponentTypeIcon = () => {
    switch (editedComponent?.type) {
      case 'heading':
        return <Type className="h-5 w-5" />;
      case 'paragraph':
        return <FileText className="h-5 w-5" />;
      case 'image':
        return <ImageIcon className="h-5 w-5" />;
      case 'button':
        return <ExternalLink className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'form':
        return <Mail className="h-5 w-5" />;
      case 'feature':
        return <Grid2X2 className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {getComponentTypeIcon()}
            <span className="ml-2">
              Edit {editedComponent?.name || 'Component'}
            </span>
          </DialogTitle>
          <DialogDescription>
            Make changes to the {editedComponent?.type} component. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          <TabsContent value="content" className="pt-4">
            {renderComponentSpecificEditor()}
          </TabsContent>
          <TabsContent value="style" className="pt-4">
            {renderStyleTab()}
          </TabsContent>
          <TabsContent value="advanced" className="pt-4">
            {renderAdvancedTab()}
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PageBuilderComponentEditor;

// We now import Checkbox from UI components instead of defining it here

// ColorPicker component is now imported from @/components/ui/color-picker