import React from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useClientData } from '@/hooks/use-client-data';
import { useTenant } from '@/hooks/use-tenant';
import SEOHeaders from '@/components/SEOHeaders';
import { FileIcon, FileText, Download, Clock, Loader2 } from 'lucide-react';

// Helper function to get the icon for each resource category
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'tax-guide':
      return <FileText className="h-5 w-5" />;
    case 'financial-template':
      return <FileIcon className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

// Helper function to get the badge color for each category
const getCategoryBadgeVariant = (category: string) => {
  switch (category) {
    case 'tax-guide':
      return 'default';
    case 'financial-template':
      return 'secondary';
    case 'accounting-tool':
      return 'outline';
    case 'business-planning':
      return 'destructive';
    default:
      return 'default';
  }
};

export default function ResourcesPage() {
  const { clientData } = useClientData();
  const { tenant } = useTenant();

  // Fetch resources (published only)
  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['/api/public-resources'],
  });

  return (
    <PublicLayout>
      <SEOHeaders 
        title="Resources | Progress Accountants"
        description="Download free resources, guides, and templates from Progress Accountants"
      />
      
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 px-6">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-4">Resources & Downloads</h1>
          <p className="text-xl max-w-2xl">
            Access our collection of free guides, templates, and tools to help you manage your finances and grow your business.
          </p>
        </div>
      </section>
      
      {/* Resources List */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : resources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resources.map((resource: any) => (
                <div 
                  key={resource.id} 
                  className="bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {resource.imageUrl && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={resource.imageUrl} 
                        alt={resource.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center mb-2">
                      <Badge variant={getCategoryBadgeVariant(resource.category || resource.type)}>
                        {(resource.category || resource.type || 'resource').replace(/-/g, ' ')}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {resource.description}
                    </p>
                    <Button 
                      asChild
                      className="w-full"
                    >
                      <a 
                        href={resource.fileUrl || resource.link}
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No resources available yet</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're working on creating valuable resources for you. Please check back soon!
              </p>
            </div>
          )}
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="bg-muted py-12 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Need Something Specific?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            If you're looking for a specific resource or have questions about our services, our team is here to help.
          </p>
          <Button size="lg" asChild>
            <a href="/contact">Contact Us</a>
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
}