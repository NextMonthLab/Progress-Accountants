import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PublicLayout from "@/layouts/PublicLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useClientData } from "@/hooks/use-client-data";
import { Loader2, Search, FileText, FileSpreadsheet, Calculator, BookOpen, ExternalLink } from "lucide-react";
import { SEOHeaders } from "@/components/SEOHeaders";

type Resource = {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  link?: string;
  isPublished: boolean;
  type: 'guide' | 'template' | 'calculator' | 'article';
};

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState<'all' | 'guide' | 'template' | 'calculator' | 'article'>('all');
  const { businessData } = useClientData();
  
  // Fetch resources
  const { data, isLoading, error } = useQuery<{ resources: Resource[] }>({
    queryKey: ['/api/pages/resources/public'],
  });

  // Filter resources based on search and tab
  const filteredResources = data?.resources
    .filter(resource => resource.isPublished)
    .filter(resource => 
      searchQuery === "" || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(resource => 
      currentTab === 'all' || resource.type === currentTab
    ) || [];

  // Get the appropriate icon for each resource type
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'guide':
        return <FileText className="h-5 w-5" />;
      case 'template':
        return <FileSpreadsheet className="h-5 w-5" />;
      case 'calculator':
        return <Calculator className="h-5 w-5" />;
      case 'article':
        return <BookOpen className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <PublicLayout>
      <SEOHeaders
        title={`Resources | ${businessData?.core?.businessName || 'Progress Accountants'}`}
        description="Access our library of guides, templates, calculators and articles to help you manage your business finances."
        path="/resources"
      />
      
      <div className="py-12 bg-gradient-to-b from-primary/10 to-transparent">
        <div className="container px-6 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight text-primary">
              Business Resource Library
            </h1>
            <p className="mt-4 text-xl text-muted-foreground">
              Access our collection of guides, templates, calculators, and articles designed to help you 
              manage your business finances more effectively.
            </p>
            
            {/* Search bar */}
            <div className="mt-8 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text" 
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container px-6 mx-auto py-12">
        {/* Resource type tabs */}
        <Tabs 
          defaultValue="all" 
          value={currentTab}
          onValueChange={(value) => setCurrentTab(value as any)}
          className="w-full max-w-4xl mx-auto mb-8"
        >
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="guide">Guides</TabsTrigger>
            <TabsTrigger value="template">Templates</TabsTrigger>
            <TabsTrigger value="calculator">Calculators</TabsTrigger>
            <TabsTrigger value="article">Articles</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Resources grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading resources...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading resources. Please try again later.</p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery ? "No resources match your search criteria." : "No resources available at this time."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-primary">
          {resource.type === 'guide' && <FileText className="h-5 w-5" />}
          {resource.type === 'template' && <FileSpreadsheet className="h-5 w-5" />}
          {resource.type === 'calculator' && <Calculator className="h-5 w-5" />}
          {resource.type === 'article' && <BookOpen className="h-5 w-5" />}
          <p className="text-sm font-medium capitalize">{resource.type}</p>
        </div>
        <CardTitle className="text-xl">{resource.title}</CardTitle>
      </CardHeader>
      
      {resource.imageUrl && (
        <div className="px-6 py-2">
          <img 
            src={resource.imageUrl} 
            alt={resource.title}
            className="rounded-md w-full h-48 object-cover" 
          />
        </div>
      )}
      
      <CardContent className="flex-grow">
        <CardDescription className="text-base text-foreground/80">
          {resource.description}
        </CardDescription>
      </CardContent>
      
      <CardFooter>
        {resource.link && (
          <Button asChild className="w-full">
            <a href={resource.link} target="_blank" rel="noopener noreferrer">
              Access Resource
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}