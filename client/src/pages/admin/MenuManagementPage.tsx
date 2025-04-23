import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import AdminLayout from "@/layouts/AdminLayout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { MenuItem } from "@shared/navigation_menu";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Menu,
  GripVertical,
  Plus,
  Pencil,
  Trash2,
  Link as LinkIcon,
  ExternalLink,
  Eye,
  AlertCircle
} from "lucide-react";

export default function MenuManagementPage() {
  const [activeTab, setActiveTab] = useState("header");
  const [openDialog, setOpenDialog] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    label: "",
    url: "",
    icon: "",
    parentId: null,
    isExternal: false
  });

  // Fetch menu items
  const { data: menuItems, isLoading, refetch } = useQuery({
    queryKey: ['/api/navigation/items', activeTab],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", `/api/navigation/items?location=${activeTab}`);
        if (!res.ok) throw new Error("Failed to fetch menu items");
        const data = await res.json();
        return data.items || [];
      } catch (error) {
        console.error("Error fetching menu items:", error);
        // Return empty array for now during development
        return [];
      }
    }
  });

  // Fetch all pages for selection
  const { data: availablePages } = useQuery({
    queryKey: ['/api/pages/all'],
    queryFn: async () => {
      try {
        // Try to fetch from API
        const res = await apiRequest("GET", "/api/pages/all");
        if (!res.ok) throw new Error("Failed to fetch pages");
        const data = await res.json();
        setPages(data || []);
        return data;
      } catch (error) {
        console.error("Error fetching pages:", error);
        // Return empty array for now during development
        return [];
      }
    }
  });

  // Fetch page builder pages
  const { data: pageBuilderPages } = useQuery({
    queryKey: ['/api/page-builder/pages'],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/page-builder/pages");
        if (!res.ok) throw new Error("Failed to fetch page builder pages");
        const data = await res.json();
        
        // Add page builder pages to available pages
        if (data?.data && Array.isArray(data.data)) {
          const formattedPages = data.data.map((page: any) => ({
            id: page.id,
            title: page.name || page.title,
            path: page.path || ("/" + page.slug),
            description: page.description
          }));
          
          setPages(prev => [...prev, ...formattedPages]);
        }
        
        return data.data || [];
      } catch (error) {
        console.error("Error fetching page builder pages:", error);
        return [];
      }
    }
  });

  // Save menu item mutation
  const saveItemMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editItem) {
        // Update existing item
        const res = await apiRequest("PUT", `/api/navigation/items/${editItem.id}`, data);
        return res.json();
      } else {
        // Create new item
        const res = await apiRequest("POST", "/api/navigation/items", {
          ...data,
          location: activeTab
        });
        return res.json();
      }
    },
    onSuccess: () => {
      toast({
        title: editItem ? "Menu item updated" : "Menu item added",
        description: `The menu item has been ${editItem ? "updated" : "added"} successfully.`
      });
      refetch();
      setOpenDialog(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${editItem ? "update" : "add"} menu item: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  });

  // Delete menu item mutation
  const deleteItemMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/navigation/items/${id}`);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Menu item deleted",
        description: "The menu item has been deleted successfully."
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete menu item: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  });

  // Reorder menu items mutation
  const reorderItemsMutation = useMutation({
    mutationFn: async (items: MenuItem[]) => {
      const res = await apiRequest("PUT", `/api/navigation/reorder?location=${activeTab}`, { items });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Menu order updated",
        description: "The menu items have been reordered successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to reorder menu items: ${(error as Error).message}`,
        variant: "destructive"
      });
      refetch(); // Refetch to reset the order
    }
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handlePageSelect = (pageUrl: string) => {
    setFormData({ ...formData, url: pageUrl });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.label || !formData.url) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    saveItemMutation.mutate({
      ...formData,
      order: editItem?.order || (menuItems?.length || 0)
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      deleteItemMutation.mutate(id);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditItem(item);
    setFormData({
      label: item.label,
      url: item.url,
      icon: item.icon || "",
      parentId: item.parentId,
      isExternal: item.isExternal
    });
    setOpenDialog(true);
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination || !menuItems) return;
    
    if (destination.index === source.index) return;
    
    const items = Array.from(menuItems);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);
    
    // Update order property
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));
    
    // Optimistic update
    // @ts-ignore - This is fine for reordering UI display
    refetch();
    
    // Send to server
    reorderItemsMutation.mutate(updatedItems);
  };

  const resetForm = () => {
    setFormData({
      label: "",
      url: "",
      icon: "",
      parentId: null,
      isExternal: false
    });
    setEditItem(null);
  };

  const handleAddNew = () => {
    resetForm();
    setOpenDialog(true);
  };

  return (
    <AdminLayout>
      <div className="container px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Navigation Menu Management</h1>
          <Button onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add Menu Item
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Menu className="h-5 w-5" />
              Manage Navigation Menus
            </CardTitle>
            <CardDescription>Configure your website navigation menus. Drag and drop to reorder items.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="header" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="header">Header Menu</TabsTrigger>
                <TabsTrigger value="footer">Footer Menu</TabsTrigger>
                <TabsTrigger value="sidebar">Sidebar Menu</TabsTrigger>
              </TabsList>
              
              <TabsContent value="header">
                <MenuItemsSection 
                  items={menuItems || []} 
                  isLoading={isLoading}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onDragEnd={handleDragEnd}
                  title="Header Menu Items"
                  description="These items appear in the main navigation bar at the top of your website."
                />
              </TabsContent>
              
              <TabsContent value="footer">
                <MenuItemsSection 
                  items={menuItems || []} 
                  isLoading={isLoading}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onDragEnd={handleDragEnd}
                  title="Footer Menu Items"
                  description="These items appear in the footer section at the bottom of your website."
                />
              </TabsContent>
              
              <TabsContent value="sidebar">
                <MenuItemsSection 
                  items={menuItems || []} 
                  isLoading={isLoading}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onDragEnd={handleDragEnd}
                  title="Sidebar Menu Items"
                  description="These items appear in the sidebar navigation on your website."
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Edit/Add Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editItem ? "Edit Menu Item" : "Add Menu Item"}</DialogTitle>
            <DialogDescription>
              {editItem 
                ? "Update the details of this menu item."
                : "Add a new item to your navigation menu."
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="label">Label <span className="text-red-500">*</span></Label>
                <Input
                  id="label"
                  name="label"
                  value={formData.label}
                  onChange={handleFormChange}
                  placeholder="e.g., About Us"
                  required
                />
                <p className="text-xs text-muted-foreground">The text shown in the menu</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="icon">Icon (optional)</Label>
                <Input
                  id="icon"
                  name="icon"
                  value={formData.icon}
                  onChange={handleFormChange}
                  placeholder="e.g., HomeIcon"
                />
                <p className="text-xs text-muted-foreground">Name of icon to display (from Lucide)</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="url">URL / Path <span className="text-red-500">*</span></Label>
              <div className="flex gap-2">
                <Input
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleFormChange}
                  placeholder="e.g., /about or https://example.com"
                  required
                  className="flex-1"
                />
                <Select
                  value=""
                  onValueChange={handlePageSelect}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select a page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Select a page</SelectItem>
                    {pages.map((page) => (
                      <SelectItem key={page.id || page.path} value={page.path}>
                        {page.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-muted-foreground">Enter a URL directly or select from your existing pages</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isExternal"
                checked={formData.isExternal}
                onCheckedChange={(checked) => 
                  handleCheckboxChange("isExternal", checked as boolean)
                }
              />
              <Label htmlFor="isExternal" className="cursor-pointer">External link (opens in new tab)</Label>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpenDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saveItemMutation.isPending}>
                {saveItemMutation.isPending ? "Saving..." : editItem ? "Update Item" : "Add Item"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

interface MenuItemsSectionProps {
  items: MenuItem[];
  isLoading: boolean;
  title: string;
  description: string;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: number) => void;
  onDragEnd: (result: DropResult) => void;
}

function MenuItemsSection({ 
  items, 
  isLoading, 
  title, 
  description, 
  onEdit, 
  onDelete, 
  onDragEnd 
}: MenuItemsSectionProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col space-y-2 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-32 bg-gray-200 rounded w-full mt-4"></div>
      </div>
    );
  }
  
  if (items.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg bg-muted/50">
        <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <h3 className="text-lg font-semibold">No Menu Items</h3>
        <p className="text-muted-foreground">
          Click "Add Menu Item" to create your first navigation item.
        </p>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">{title}</h2>
      <p className="text-muted-foreground mb-4">{description}</p>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="menu-items">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead style={{ width: 50 }}></TableHead>
                    <TableHead>Label</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead className="text-center">External</TableHead>
                    <TableHead style={{ width: 100 }}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => (
                    <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                      {(provided) => (
                        <TableRow
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <TableCell>
                            <div
                              className="cursor-move flex justify-center"
                              {...provided.dragHandleProps}
                            >
                              <GripVertical className="h-5 w-5 text-muted-foreground" />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium flex items-center gap-2">
                            {item.icon ? <LinkIcon className="h-4 w-4" /> : null}
                            {item.label}
                          </TableCell>
                          <TableCell className="text-muted-foreground truncate max-w-[200px]">
                            {item.url}
                          </TableCell>
                          <TableCell className="text-center">
                            {item.isExternal ? (
                              <ExternalLink className="h-4 w-4 inline-block" />
                            ) : (
                              <LinkIcon className="h-4 w-4 inline-block" />
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onEdit(item)}
                                title="Edit item"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onDelete(item.id)}
                                title="Delete item"
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </TableBody>
              </Table>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}