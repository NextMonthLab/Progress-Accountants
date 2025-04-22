import React from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  tenant?: any;
}

const PageBuilderPreview: React.FC<PageBuilderPreviewProps> = ({
  page,
  deviceType,
  tenant
}) => {
  const renderComponent = (component: PageBuilderComponent) => {
    const { type, content } = component;
    
    switch (type) {
      case 'heading':
        const HeadingTag = content?.level || 'h2';
        return (
          <HeadingTag className={cn(
            "font-bold",
            {
              'text-4xl mb-6': HeadingTag === 'h1',
              'text-3xl mb-5': HeadingTag === 'h2',
              'text-2xl mb-4': HeadingTag === 'h3',
              'text-xl mb-3': HeadingTag === 'h4',
              'text-lg mb-2': HeadingTag === 'h5',
              'text-base mb-2': HeadingTag === 'h6',
            }
          )}>
            {content?.text || 'Heading'}
          </HeadingTag>
        );
        
      case 'paragraph':
        return (
          <p className="leading-relaxed mb-4">
            {content?.text || 'Paragraph text goes here.'}
          </p>
        );
        
      case 'image':
        return (
          <div className="mb-4">
            {content?.src ? (
              <img 
                src={content.src} 
                alt={content.alt || ''} 
                width={content.width || 400}
                height={content.height || 300}
                className="max-w-full h-auto"
              />
            ) : (
              <div 
                className="bg-muted border flex items-center justify-center"
                style={{ width: content?.width || 400, height: content?.height || 300 }}
              >
                <span className="text-muted-foreground">Image Placeholder</span>
              </div>
            )}
          </div>
        );
        
      case 'button':
        return (
          <div className="mb-4">
            <button 
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium",
                {
                  'bg-primary text-primary-foreground hover:bg-primary/90': content?.variant === 'default' || !content?.variant,
                  'bg-secondary text-secondary-foreground hover:bg-secondary/90': content?.variant === 'secondary',
                  'border border-input bg-background hover:bg-accent hover:text-accent-foreground': content?.variant === 'outline',
                  'hover:underline hover:bg-transparent': content?.variant === 'link',
                }
              )}
            >
              {content?.text || 'Button'}
            </button>
          </div>
        );
        
      case 'list':
        if (content?.listType === 'numbered') {
          return (
            <ol className="list-decimal list-inside mb-4 pl-4 space-y-1">
              {(content?.items || ['Item 1', 'Item 2', 'Item 3']).map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ol>
          );
        } else {
          return (
            <ul className="list-disc list-inside mb-4 pl-4 space-y-1">
              {(content?.items || ['Item 1', 'Item 2', 'Item 3']).map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          );
        }
        
      case 'divider':
        return (
          <hr 
            className="my-6" 
            style={{ 
              borderTopStyle: content?.style || 'solid',
              borderTopColor: content?.color || '#e0e0e0'
            }} 
          />
        );
        
      case 'spacer':
        return (
          <div style={{ height: `${content?.height || 40}px` }} />
        );
        
      case 'card':
        return (
          <Card className="mb-4">
            {content?.image && (
              <div className="h-40 overflow-hidden">
                <img 
                  src={content.image} 
                  alt={content.title || 'Card'} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2">{content?.title || 'Card Title'}</h3>
              <p className="text-muted-foreground">{content?.content || 'Card content goes here.'}</p>
            </CardContent>
          </Card>
        );
        
      case 'cta':
        return (
          <div className="bg-primary/5 border rounded-lg p-6 mb-6 text-center">
            <h3 className="font-bold text-2xl mb-3">{content?.heading || 'Call to Action'}</h3>
            <p className="text-muted-foreground mb-4">{content?.text || 'Take action now with our amazing offer!'}</p>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium">
              {content?.buttonText || 'Get Started'}
            </button>
          </div>
        );
        
      default:
        return (
          <div className="border border-dashed p-4 mb-4 text-muted-foreground text-center">
            {component.type} component
          </div>
        );
    }
  };
  
  const renderSectionColumns = (section: PageBuilderSection) => {
    // If there are no components, show a placeholder
    if (!section.components || section.components.length === 0) {
      return (
        <div className="border border-dashed rounded-md p-8 text-center text-muted-foreground">
          This section is empty. Add components to see them here.
        </div>
      );
    }
    
    switch (section.layout) {
      case 'single':
        return (
          <div className="space-y-4">
            {section.components.map(component => (
              <div key={component.id}>
                {renderComponent(component)}
              </div>
            ))}
          </div>
        );
        
      case 'two-column':
        // Split components roughly in half for two columns
        const midpoint = Math.ceil(section.components.length / 2);
        const firstColumn = section.components.slice(0, midpoint);
        const secondColumn = section.components.slice(midpoint);
        
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              {firstColumn.map(component => (
                <div key={component.id}>
                  {renderComponent(component)}
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {secondColumn.map(component => (
                <div key={component.id}>
                  {renderComponent(component)}
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'three-column':
        // Split components into three groups for three columns
        const oneThird = Math.ceil(section.components.length / 3);
        const twoThirds = oneThird * 2;
        const firstCol = section.components.slice(0, oneThird);
        const secondCol = section.components.slice(oneThird, twoThirds);
        const thirdCol = section.components.slice(twoThirds);
        
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-4">
              {firstCol.map(component => (
                <div key={component.id}>
                  {renderComponent(component)}
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {secondCol.map(component => (
                <div key={component.id}>
                  {renderComponent(component)}
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {thirdCol.map(component => (
                <div key={component.id}>
                  {renderComponent(component)}
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'sidebar-left':
        // Split with 1/3 left and 2/3 right
        const sidebarLeft = section.components.slice(0, Math.ceil(section.components.length / 3));
        const mainContentRight = section.components.slice(Math.ceil(section.components.length / 3));
        
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 space-y-4">
              {sidebarLeft.map(component => (
                <div key={component.id}>
                  {renderComponent(component)}
                </div>
              ))}
            </div>
            <div className="md:col-span-2 space-y-4">
              {mainContentRight.map(component => (
                <div key={component.id}>
                  {renderComponent(component)}
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'sidebar-right':
        // Split with 2/3 left and 1/3 right
        const mainContentLeft = section.components.slice(0, Math.ceil(section.components.length * 2 / 3));
        const sidebarRight = section.components.slice(Math.ceil(section.components.length * 2 / 3));
        
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-4">
              {mainContentLeft.map(component => (
                <div key={component.id}>
                  {renderComponent(component)}
                </div>
              ))}
            </div>
            <div className="md:col-span-1 space-y-4">
              {sidebarRight.map(component => (
                <div key={component.id}>
                  {renderComponent(component)}
                </div>
              ))}
            </div>
          </div>
        );
        
      default:
        return (
          <div className="space-y-4">
            {section.components.map(component => (
              <div key={component.id}>
                {renderComponent(component)}
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className={cn(
      "border rounded-md mx-auto overflow-y-auto bg-white",
      {
        "w-full": deviceType === "desktop",
        "w-[768px]": deviceType === "tablet",
        "w-[375px]": deviceType === "mobile",
      }
    )}>
      <div className="sticky top-0 z-10 bg-muted border-b p-2 flex justify-between items-center">
        <div className="text-xs text-muted-foreground">
          {deviceType === "desktop" ? "Desktop Preview" : 
           deviceType === "tablet" ? "Tablet Preview" : 
           "Mobile Preview"}
        </div>
        <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
          {page.isPublished ? "Published" : "Draft"}
        </div>
      </div>
      
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
        
        {(page.sections && page.sections.length > 0) ? (
          <div className="space-y-8">
            {page.sections.map(section => (
              <div 
                key={section.id} 
                className="rounded-md overflow-hidden"
                style={{ 
                  backgroundColor: section.settings?.backgroundColor || '#ffffff',
                  padding: section.settings?.padding
                    ? `${section.settings.padding.top || 0}px ${section.settings.padding.right || 0}px ${section.settings.padding.bottom || 0}px ${section.settings.padding.left || 0}px`
                    : undefined
                }}
              >
                <div 
                  className={cn(
                    { "max-w-screen-lg mx-auto": !section.settings?.fullWidth }
                  )}
                >
                  {renderSectionColumns(section)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-dashed rounded-md p-8 text-center text-muted-foreground">
            This page is empty. Add sections and components to build your page.
          </div>
        )}
      </div>
    </div>
  );
};

export default PageBuilderPreview;