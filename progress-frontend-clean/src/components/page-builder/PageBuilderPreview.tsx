import React from "react";
import { Card } from "@/components/ui/card";
import { FormComponent, MapComponent, AccordionComponent } from "./PageBuilderInteractiveComponents";

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

interface PageBuilderPage {
  id: number;
  tenantId: string;
  title: string;
  path: string;
  description: string;
  pageType: 'core' | 'custom' | 'automation';
  isPublished: boolean;
  publishedAt?: string;
  seoSettings: {
    title?: string;
    description?: string;
    keywords?: string[];
    primaryKeyword?: string;
    seoGoal?: 'local' | 'industry' | 'conversion' | 'technical';
    ogImage?: string;
    canonical?: string;
  };
  seoScore?: number;
  createdAt: string;
  updatedAt: string;
  sections: PageBuilderSection[];
}

interface PageBuilderPreviewProps {
  page: PageBuilderPage;
  deviceType: "desktop" | "tablet" | "mobile";
}

const PageBuilderPreview: React.FC<PageBuilderPreviewProps> = ({ page, deviceType }) => {
  // Set device-specific width
  const getDeviceWidth = () => {
    switch (deviceType) {
      case "mobile":
        return "375px";
      case "tablet":
        return "768px";
      case "desktop":
      default:
        return "100%";
    }
  };
  
  // Render component preview
  const renderComponent = (component: PageBuilderComponent) => {
    switch (component.type) {
      case 'heading':
        return renderHeading(component);
      case 'paragraph':
        return renderParagraph(component);
      case 'image':
        return renderImage(component);
      case 'button':
        return renderButton(component);
      case 'list':
        return renderList(component);
      case 'divider':
        return renderDivider(component);
      case 'spacer':
        return renderSpacer(component);
      case 'card':
        return renderCard(component);
      case 'cta':
        return renderCta(component);
      case 'form':
        return <FormComponent content={component.content || {}} />;
      case 'map':
        return <MapComponent content={component.content || {}} />;
      case 'accordion':
        return <AccordionComponent content={component.content || {}} />;
      default:
        return <div className="p-4 border border-dashed border-gray-300 rounded">Component: {component.type}</div>;
    }
  };
  
  // Render heading component
  const renderHeading = (component: PageBuilderComponent) => {
    const { text, level = 'h2' } = component.content || {};
    
    switch (level) {
      case 'h1':
        return <h1 className="text-4xl font-bold">{text || 'Heading 1'}</h1>;
      case 'h2':
        return <h2 className="text-3xl font-bold">{text || 'Heading 2'}</h2>;
      case 'h3':
        return <h3 className="text-2xl font-bold">{text || 'Heading 3'}</h3>;
      case 'h4':
        return <h4 className="text-xl font-bold">{text || 'Heading 4'}</h4>;
      case 'h5':
        return <h5 className="text-lg font-bold">{text || 'Heading 5'}</h5>;
      case 'h6':
        return <h6 className="text-base font-bold">{text || 'Heading 6'}</h6>;
      default:
        return <h2 className="text-3xl font-bold">{text || 'Heading'}</h2>;
    }
  };
  
  // Render paragraph component
  const renderParagraph = (component: PageBuilderComponent) => {
    const { text } = component.content || {};
    return <p className="text-base">{text || 'Paragraph text here'}</p>;
  };
  
  // Render image component
  const renderImage = (component: PageBuilderComponent) => {
    const { src, alt, width, height } = component.content || {};
    if (!src) {
      return (
        <div className="flex items-center justify-center bg-gray-100 border border-gray-200 rounded-md" style={{ width: width || 400, height: height || 300 }}>
          <span className="text-gray-400">Image Placeholder</span>
        </div>
      );
    }
    return <img src={src} alt={alt || ''} width={width || 400} height={height || 300} className="rounded-md" />;
  };
  
  // Render button component
  const renderButton = (component: PageBuilderComponent) => {
    const { text, url, variant = 'default' } = component.content || {};
    let className = "px-4 py-2 rounded";
    
    switch (variant) {
      case 'default':
        className += " bg-primary text-primary-foreground hover:bg-primary/90";
        break;
      case 'outline':
        className += " border border-input bg-background hover:bg-accent hover:text-accent-foreground";
        break;
      case 'secondary':
        className += " bg-secondary text-secondary-foreground hover:bg-secondary/80";
        break;
      case 'ghost':
        className += " hover:bg-accent hover:text-accent-foreground";
        break;
      case 'link':
        className += " text-primary underline-offset-4 hover:underline";
        break;
      default:
        className += " bg-primary text-primary-foreground hover:bg-primary/90";
    }
    
    return <button className={className}>{text || 'Button'}</button>;
  };
  
  // Render list component
  const renderList = (component: PageBuilderComponent) => {
    const { listType = 'bullet', items = [] } = component.content || {};
    
    if (listType === 'numbered') {
      return (
        <ol className="list-decimal pl-5">
          {items.map((item: string, index: number) => (
            <li key={index} className="mb-1">{item}</li>
          ))}
          {items.length === 0 && <li>Item 1</li>}
        </ol>
      );
    }
    
    return (
      <ul className="list-disc pl-5">
        {items.map((item: string, index: number) => (
          <li key={index} className="mb-1">{item}</li>
        ))}
        {items.length === 0 && <li>Item 1</li>}
      </ul>
    );
  };
  
  // Render divider component
  const renderDivider = (component: PageBuilderComponent) => {
    const { style = 'solid', color = '#e0e0e0' } = component.content || {};
    let borderStyle = 'border-solid';
    
    switch (style) {
      case 'dashed':
        borderStyle = 'border-dashed';
        break;
      case 'dotted':
        borderStyle = 'border-dotted';
        break;
      default:
        borderStyle = 'border-solid';
    }
    
    return <hr className={`border-t ${borderStyle}`} style={{ borderColor: color }} />;
  };
  
  // Render spacer component
  const renderSpacer = (component: PageBuilderComponent) => {
    const { height = 40 } = component.content || {};
    return <div style={{ height }} />;
  };
  
  // Render card component
  const renderCard = (component: PageBuilderComponent) => {
    const { title, content, image } = component.content || {};
    
    return (
      <Card className="overflow-hidden border rounded-lg">
        {image && (
          <div className="h-40 bg-gray-100">
            <img src={image} alt={title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-4">
          <h3 className="text-lg font-medium mb-2">{title || 'Card Title'}</h3>
          <p className="text-sm text-gray-500">{content || 'Card content goes here'}</p>
        </div>
      </Card>
    );
  };
  
  // Render call to action component
  const renderCta = (component: PageBuilderComponent) => {
    const { heading, text, buttonText, buttonUrl } = component.content || {};
    
    return (
      <div className="bg-secondary/30 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">{heading || 'Call to Action'}</h3>
        <p className="mb-4">{text || 'Take action now with our amazing offer!'}</p>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">
          {buttonText || 'Get Started'}
        </button>
      </div>
    );
  };
  
  // Render section based on layout
  const renderSection = (section: PageBuilderSection) => {
    const { components, layout, settings = {} } = section;
    const { backgroundColor = '#ffffff', padding = { top: 48, right: 24, bottom: 48, left: 24 }, fullWidth = false } = settings;
    
    // Sort components by order
    const sortedComponents = [...components].sort((a, b) => a.order - b.order);
    
    // Render layout
    switch (layout) {
      case 'single':
        return (
          <div 
            className={`${fullWidth ? 'w-full' : 'container mx-auto'} rounded`}
            style={{ 
              backgroundColor, 
              paddingTop: padding.top, 
              paddingRight: padding.right, 
              paddingBottom: padding.bottom, 
              paddingLeft: padding.left 
            }}
          >
            <div className="space-y-4">
              {sortedComponents.map((component) => (
                <div key={component.id}>
                  {renderComponent(component)}
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'two-column':
        // Split components into two columns
        const leftComponents = sortedComponents.filter((_, index) => index % 2 === 0);
        const rightComponents = sortedComponents.filter((_, index) => index % 2 === 1);
        
        return (
          <div 
            className={`${fullWidth ? 'w-full' : 'container mx-auto'} rounded`}
            style={{ 
              backgroundColor, 
              paddingTop: padding.top, 
              paddingRight: padding.right, 
              paddingBottom: padding.bottom, 
              paddingLeft: padding.left 
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {leftComponents.map((component) => (
                  <div key={component.id}>
                    {renderComponent(component)}
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {rightComponents.map((component) => (
                  <div key={component.id}>
                    {renderComponent(component)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'three-column':
        // Split components into three columns
        const col1Components = sortedComponents.filter((_, index) => index % 3 === 0);
        const col2Components = sortedComponents.filter((_, index) => index % 3 === 1);
        const col3Components = sortedComponents.filter((_, index) => index % 3 === 2);
        
        return (
          <div 
            className={`${fullWidth ? 'w-full' : 'container mx-auto'} rounded`}
            style={{ 
              backgroundColor, 
              paddingTop: padding.top, 
              paddingRight: padding.right, 
              paddingBottom: padding.bottom, 
              paddingLeft: padding.left 
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                {col1Components.map((component) => (
                  <div key={component.id}>
                    {renderComponent(component)}
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {col2Components.map((component) => (
                  <div key={component.id}>
                    {renderComponent(component)}
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {col3Components.map((component) => (
                  <div key={component.id}>
                    {renderComponent(component)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'sidebar-left':
        // Split components with 1/3 for sidebar and 2/3 for main content
        const sidebarLeftComponents = sortedComponents.filter((_, index) => index % 3 === 0);
        const mainRightComponents = sortedComponents.filter((_, index) => index % 3 !== 0);
        
        return (
          <div 
            className={`${fullWidth ? 'w-full' : 'container mx-auto'} rounded`}
            style={{ 
              backgroundColor, 
              paddingTop: padding.top, 
              paddingRight: padding.right, 
              paddingBottom: padding.bottom, 
              paddingLeft: padding.left 
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                {sidebarLeftComponents.map((component) => (
                  <div key={component.id}>
                    {renderComponent(component)}
                  </div>
                ))}
              </div>
              <div className="md:col-span-2 space-y-4">
                {mainRightComponents.map((component) => (
                  <div key={component.id}>
                    {renderComponent(component)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'sidebar-right':
        // Split components with 2/3 for main content and 1/3 for sidebar
        const mainLeftComponents = sortedComponents.filter((_, index) => index % 3 !== 2);
        const sidebarRightComponents = sortedComponents.filter((_, index) => index % 3 === 2);
        
        return (
          <div 
            className={`${fullWidth ? 'w-full' : 'container mx-auto'} rounded`}
            style={{ 
              backgroundColor, 
              paddingTop: padding.top, 
              paddingRight: padding.right, 
              paddingBottom: padding.bottom, 
              paddingLeft: padding.left 
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                {mainLeftComponents.map((component) => (
                  <div key={component.id}>
                    {renderComponent(component)}
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {sidebarRightComponents.map((component) => (
                  <div key={component.id}>
                    {renderComponent(component)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div 
            className={`${fullWidth ? 'w-full' : 'container mx-auto'} rounded`}
            style={{ 
              backgroundColor, 
              paddingTop: padding.top, 
              paddingRight: padding.right, 
              paddingBottom: padding.bottom, 
              paddingLeft: padding.left 
            }}
          >
            <div className="space-y-4">
              {sortedComponents.map((component) => (
                <div key={component.id}>
                  {renderComponent(component)}
                </div>
              ))}
            </div>
          </div>
        );
    }
  };
  
  // Sort sections by order
  const sortedSections = [...page.sections].sort((a, b) => a.order - b.order);
  
  return (
    <div 
      className="border rounded-md overflow-auto mx-auto"
      style={{ 
        width: getDeviceWidth(),
        maxWidth: "100%",
        height: deviceType === "desktop" ? "80vh" : "70vh",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      }}
    >
      <div className="bg-gray-100 border-b border-gray-200 p-2">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">{page.path}</div>
          <div className="text-xs text-gray-500">Preview Mode</div>
        </div>
      </div>
      
      <div className="bg-white overflow-y-auto" style={{ height: "calc(100% - 36px)" }}>
        {/* Page header with title (optional) */}
        <header className="py-8 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">{page.title}</h1>
            {page.description && (
              <p className="text-gray-500 mt-2">{page.description}</p>
            )}
          </div>
        </header>
        
        {/* Page sections */}
        <div className="space-y-8 pb-16">
          {sortedSections.map((section) => (
            <div key={section.id} className="border-b border-gray-100 py-8">
              {renderSection(section)}
            </div>
          ))}
          
          {sortedSections.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No sections added yet</h3>
              <p className="text-gray-500 mt-1">Add sections to your page to see a preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageBuilderPreview;