import React, { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Search,
  Edit,
  Eye,
  Trash2,
  History,
  ExternalLink,
  Filter,
} from "lucide-react";
import { format } from "date-fns";
import { PageVersionHistory } from "@/components/page-builder/PageVersionHistory";

const PageBuilderListPage: React.FC = () => {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentFilter, setCurrentFilter] = useState("all");
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);
  const [selectedPageId, setSelectedPageId] = useState<number | null>(null);

  // Fetch pages data
  const { data: pagesData, isLoading } = useQuery({
    queryKey: ["/api/page-builder/pages"],
    queryFn: async () => {
      const res = await fetch("/api/page-builder/pages");
      if (!res.ok) throw new Error("Failed to fetch pages");
      return res.json();
    },
  });

  // Filter pages based on search term and current filter
  const filteredPages = React.useMemo(() => {
    if (!pagesData?.data) return [];
    
    let filtered = pagesData.data;
    
    if (searchTerm) {
      filtered = filtered.filter((page: any) => 
        (page.title || page.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (page.path || page.slug || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (currentFilter === "published") {
      filtered = filtered.filter((page: any) => page.isPublished || page.published);
    } else if (currentFilter === "draft") {
      filtered = filtered.filter((page: any) => !page.isPublished && !page.published);
    }
    
    return filtered;
  }, [pagesData, searchTerm, currentFilter]);

  // Handle navigation to edit page
  const handleEditPage = (id: number) => {
    navigate(`/page-builder/${id}`);
  };

  // Handle navigation to view page on frontend
  const handleViewPage = (path: string) => {
    window.open(path, "_blank");
  };

  // Handle opening version history
  const handleOpenVersionHistory = (id: number) => {
    setSelectedPageId(id);
    setVersionHistoryOpen(true);
  };

  // Render loading skeleton
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="container px-8 py-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-10 w-36" />
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <Skeleton className="h-6 w-36 mb-2" />
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 mb-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-32" />
              </div>
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-16 w-full mb-2" />
              <Skeleton className="h-16 w-full mb-2" />
              <Skeleton className="h-16 w-full mb-2" />
              <Skeleton className="h-16 w-full mb-2" />
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pages</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage your website pages
            </p>
          </div>
          <Button onClick={() => navigate("/page-builder/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Page
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <Tabs defaultValue="all" onValueChange={setCurrentFilter}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <TabsList>
                  <TabsTrigger value="all">All Pages</TabsTrigger>
                  <TabsTrigger value="published">Published</TabsTrigger>
                  <TabsTrigger value="draft">Draft</TabsTrigger>
                </TabsList>
                <div className="flex w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search pages..."
                      className="pl-8 w-full sm:w-[280px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </Tabs>
          </CardHeader>
          <CardContent>
            {filteredPages.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-1">No pages found</h3>
                {searchTerm ? (
                  <p className="text-muted-foreground mb-4">
                    No pages match your search criteria
                  </p>
                ) : (
                  <p className="text-muted-foreground mb-4">
                    You haven't created any pages yet
                  </p>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/page-builder/new")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first page
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Path</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPages.map((page: any) => (
                      <TableRow key={page.id}>
                        <TableCell className="font-medium">{page.title || page.name || 'Untitled Page'}</TableCell>
                        <TableCell className="text-muted-foreground">{page.path || `/${page.slug}` || '/'}</TableCell>
                        <TableCell>
                          {page.pageType === 'core' && 'Core Page'}
                          {page.pageType === 'custom' && 'Custom Page'}
                          {page.pageType === 'automation' && 'Automation Page'}
                          {!page.pageType && 'Standard Page'}
                        </TableCell>
                        <TableCell>
                          {(page.isPublished || page.published) ? (
                            <Badge variant="default">Published</Badge>
                          ) : (
                            <Badge variant="secondary">Draft</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {page.updatedAt ? format(new Date(page.updatedAt), "MMM d, yyyy") : 'Just now'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditPage(page.id)}
                              title="Edit Page"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {(page.isPublished || page.published) && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewPage(page.path || `/${page.slug}`)}
                                title="View Published Page"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenVersionHistory(page.id)}
                              title="Version History"
                            >
                              <History className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Version History Dialog */}
        {selectedPageId && (
          <PageVersionHistory
            entityId={selectedPageId}
            entityType="page"
            isOpen={versionHistoryOpen}
            onClose={() => setVersionHistoryOpen(false)}
            onVersionRestore={() => {
              setVersionHistoryOpen(false);
              // Refresh the page list after restore
              // queryClient.invalidateQueries({ queryKey: ['/api/page-builder/pages'] });
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default PageBuilderListPage;