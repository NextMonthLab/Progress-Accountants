import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from 'react-beautiful-dnd';
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  MoveUp,
  MoveDown,
  Copy,
  Type,
  Image as ImageIcon,
  FileText,
  ExternalLink,
  Video,
  Mail,
  Layout,
  Grid,
  Loader as Spinner
} from 'lucide-react';
import PageBuilderComponentEditor from './PageBuilderComponentEditor';
import { PageBuilderComponent, PageBuilderSection } from '@shared/advanced_page_builder';

interface PageBuilderComponentPanelProps {
  section: PageBuilderSection;
  onUpdateSection: (sectionId: number, updatedSection: PageBuilderSection) => void;
  onRemoveSection: (sectionId: number) => void;
}

const PageBuilderComponentPanel: React.FC<PageBuilderComponentPanelProps> = ({
  section,
  onUpdateSection,
  onRemoveSection
}) => {
  const [editComponentId, setEditComponentId] = useState<number | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [componentToEdit, setComponentToEdit] = useState<PageBuilderComponent | null>(null);

  // Handle opening the editor for a component
  const handleEditComponent = (component: PageBuilderComponent) => {
    setComponentToEdit(component);
    setEditComponentId(component.id);
    setIsEditorOpen(true);
  };

  // Handle saving the edited component
  const handleSaveComponent = (updatedComponent: PageBuilderComponent) => {
    const updatedComponents = section.components.map((comp) => {
      if (comp.id === updatedComponent.id) {
        return updatedComponent;
      }
      return comp;
    });

    onUpdateSection(section.id, {
      ...section,
      components: updatedComponents
    });

    setIsEditorOpen(false);
    setEditComponentId(null);
  };

  // Handle adding a new component
  const handleAddComponent = (componentType: string) => {
    const currentComponents = Array.isArray(section.components) ? section.components : [];
    const newComponent = {
      id: Date.now(),
      name: `New ${componentType.charAt(0).toUpperCase() + componentType.slice(1)}`,
      type: componentType,
      sectionId: section.id,
      order: currentComponents.length,
      content: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Set default content based on component type
    switch (componentType) {
      case 'heading':
        newComponent.content = { text: 'New Heading', level: 'h2' };
        break;
      case 'paragraph':
        newComponent.content = { text: 'New paragraph text goes here.' };
        break;
      case 'image':
        newComponent.content = { src: '', alt: 'Image description', width: 800, height: 600 };
        break;
      case 'button':
        newComponent.content = { text: 'Click Me', url: '#', variant: 'default' };
        break;
      case 'feature':
        newComponent.content = { title: 'Feature', content: 'Feature description' };
        break;
      case 'video':
        newComponent.content = { videoUrl: '', posterUrl: '', autoplay: false };
        break;
      case 'cta':
        newComponent.content = { 
          heading: 'Ready to Get Started?', 
          text: 'Join thousands of satisfied customers who have already made the smart choice.',
          buttonText: 'Contact Us',
          buttonUrl: '/contact'
        };
        break;
    }

    onUpdateSection(section.id, {
      ...section,
      components: [...currentComponents, newComponent]
    });

    // Open the editor for the new component
    handleEditComponent(newComponent);
  };

  // Handle removing a component
  const handleRemoveComponent = (componentId: number) => {
    if (window.confirm('Are you sure you want to delete this component? This action cannot be undone.')) {
      const updatedComponents = section.components.filter((comp) => comp.id !== componentId);

      onUpdateSection(section.id, {
        ...section,
        components: updatedComponents
      });
    }
  };

  // Handle duplicating a component
  const handleDuplicateComponent = (component: PageBuilderComponent) => {
    const duplicatedComponent = {
      ...component,
      id: Date.now(),
      name: `${component.name} (Copy)`,
      order: section.components.length
    };

    onUpdateSection(section.id, {
      ...section,
      components: [...section.components, duplicatedComponent]
    });
  };

  // Handle reordering components
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(section.components);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update orders
    const updatedComponents = items.map((comp: PageBuilderComponent, index) => ({
      ...comp,
      order: index
    }));

    onUpdateSection(section.id, {
      ...section,
      components: updatedComponents
    });
  };

  // Handle moving a component up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;

    const components = [...section.components];
    [components[index - 1], components[index]] = [components[index], components[index - 1]];

    // Update orders
    const updatedComponents = components.map((comp: PageBuilderComponent, idx) => ({
      ...comp,
      order: idx
    }));

    onUpdateSection(section.id, {
      ...section,
      components: updatedComponents
    });
  };

  // Handle moving a component down
  const handleMoveDown = (index: number) => {
    if (index === section.components.length - 1) return;

    const components = [...section.components];
    [components[index], components[index + 1]] = [components[index + 1], components[index]];

    // Update orders
    const updatedComponents = components.map((comp: PageBuilderComponent, idx) => ({
      ...comp,
      order: idx
    }));

    onUpdateSection(section.id, {
      ...section,
      components: updatedComponents
    });
  };

  const getComponentTypeIcon = (type: string) => {
    switch (type) {
      case 'heading':
        return <Type className="h-4 w-4" />;
      case 'paragraph':
        return <FileText className="h-4 w-4" />;
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      case 'button':
        return <ExternalLink className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'form':
        return <Mail className="h-4 w-4" />;
      case 'feature':
        return <Grid className="h-4 w-4" />;
      case 'cta':
        return <Layout className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Render placeholder if section is undefined or null
  if (!section) {
    return (
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl text-gray-900 dark:text-gray-100">Section Not Found</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            The section data could not be loaded. Please try refreshing the page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4 p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              If this issue persists, please check your connection or contact support.
            </p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="flex items-center gap-2"
            >
              Refresh Page
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Additional validation for section data
  if (!section.id) {
    return (
      <Card className="mb-6 border-amber-200 dark:border-amber-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl text-amber-800 dark:text-amber-200">Invalid Section Data</CardTitle>
          <CardDescription className="text-amber-600 dark:text-amber-400">
            This section appears to be missing required data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4 p-6">
            <p className="text-sm text-amber-600 dark:text-amber-400 text-center">
              Section ID: {section.id || 'Missing'}<br />
              Section Name: {section.name || 'Missing'}
            </p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="flex items-center gap-2"
            >
              Refresh Page
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
          {section?.name || 'Section Content'}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Manage the components in this section
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Label htmlFor="section-name">Section Name</Label>
          <Input
            id="section-name"
            value={section?.name || ''}
            onChange={(e) => onUpdateSection(section.id, { ...section, name: e.target.value })}
            className="mt-1"
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="section-type">Section Type</Label>
          <Select
            value={section.type || 'standard'}
            onValueChange={(value) => onUpdateSection(section.id, { ...section, type: value })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select section type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="hero">Hero</SelectItem>
              <SelectItem value="features">Features</SelectItem>
              <SelectItem value="cta">Call to Action</SelectItem>
              <SelectItem value="testimonials">Testimonials</SelectItem>
              <SelectItem value="gallery">Gallery</SelectItem>
              <SelectItem value="contact">Contact</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <Label className="text-gray-900 dark:text-gray-100">Components</Label>
          {Array.isArray(section.components) && section.components.length > 0 ? (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="components">
                {(provided) => (
                  <div
                    className="space-y-2 mt-2"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {section.components
                      .sort((a: PageBuilderComponent, b: PageBuilderComponent) => a.order - b.order)
                      .map((component: PageBuilderComponent, index: number) => (
                        <Draggable
                          key={component.id}
                          draggableId={component.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="flex items-center space-x-2 border rounded-md p-3 bg-card"
                            >
                              <div {...provided.dragHandleProps} className="cursor-grab">
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                              </div>

                              <div className="flex-1 flex items-center">
                                <span className="mr-2">
                                  {getComponentTypeIcon(component.type)}
                                </span>
                                <span className="font-medium truncate">
                                  {component.name}
                                </span>
                              </div>

                              <div className="flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleMoveUp(index)}
                                  disabled={index === 0}
                                  title="Move Up"
                                >
                                  <MoveUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleMoveDown(index)}
                                  disabled={index === section.components.length - 1}
                                  title="Move Down"
                                >
                                  <MoveDown className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDuplicateComponent(component)}
                                  title="Duplicate"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditComponent(component)}
                                  title="Edit"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveComponent(component.id)}
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <div className="text-center py-8 border rounded-md bg-muted/50 mt-2">
              <p className="text-muted-foreground mb-2">No components added yet</p>
              <p className="text-sm text-muted-foreground mb-4">Add components to build your section</p>
            </div>
          )}
        </div>

        <div className="mt-4">
          <Label>Add New Component</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddComponent('heading')}
              className="justify-start"
            >
              <Type className="h-4 w-4 mr-2" />
              Heading
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddComponent('paragraph')}
              className="justify-start"
            >
              <FileText className="h-4 w-4 mr-2" />
              Paragraph
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddComponent('image')}
              className="justify-start"
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Image
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddComponent('button')}
              className="justify-start"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Button
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddComponent('video')}
              className="justify-start"
            >
              <Video className="h-4 w-4 mr-2" />
              Video
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddComponent('feature')}
              className="justify-start"
            >
              <Grid className="h-4 w-4 mr-2" />
              Feature
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddComponent('cta')}
              className="justify-start"
            >
              <Layout className="h-4 w-4 mr-2" />
              Call to Action
            </Button>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button 
            variant="destructive" 
            onClick={() => onRemoveSection(section.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Section
          </Button>
        </div>

        {componentToEdit && (
          <PageBuilderComponentEditor
            isOpen={isEditorOpen}
            onClose={() => setIsEditorOpen(false)}
            component={componentToEdit}
            onSave={handleSaveComponent}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PageBuilderComponentPanel;