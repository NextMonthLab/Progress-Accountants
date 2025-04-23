import { useState, useEffect } from 'react';
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useTenant } from "@/hooks/use-tenant";
import AdminLayout from "@/layouts/AdminLayout";
import { Loader2, PlusCircle, Trash2, Edit, Save, X, ArrowUpDown, ExternalLink, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { NavigationMenu, MenuItem, MenuTreeItem, menuLocations } from '@shared/navigation_menu';
import { queryClient, apiRequest } from "@/lib/queryClient";

const MenuManagementPage = () => {
  const { tenant } = useTenant();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('menus');
  const [selectedMenu, setSelectedMenu] = useState<NavigationMenu | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [isCreateMenuDialogOpen, setIsCreateMenuDialogOpen] = useState(false);
  const [isCreateMenuItemDialogOpen, setIsCreateMenuItemDialogOpen] = useState(false);
  const [isEditMenuDialogOpen, setIsEditMenuDialogOpen] = useState(false);
  const [isEditMenuItemDialogOpen, setIsEditMenuItemDialogOpen] = useState(false);
  const [expandedMenuItems, setExpandedMenuItems] = useState<Record<number, boolean>>({});
  
  // Form states
  const [newMenuForm, setNewMenuForm] = useState({
    name: '',
    slug: '',
    description: '',
    location: 'header',
    isActive: true
  });
  
  const [newMenuItemForm, setNewMenuItemForm] = useState({
    label: '',
    url: '',
    icon: '',
    parentId: null as number | null,
    isExternal: false,
    isVisible: true,
    requiredRole: '' as string | null
  });
  
  const [editMenuForm, setEditMenuForm] = useState({
    name: '',
    slug: '',
    description: '',
    location: '',
    isActive: true
  });
  
  const [editMenuItemForm, setEditMenuItemForm] = useState({
    label: '',
    url: '',
    icon: '',
    parentId: null as number | null,
    isExternal: false,
    isVisible: true,
    requiredRole: '' as string | null
  });
  
  // Fetch menus
  const { 
    data: menus, 
    isLoading: isLoadingMenus,
    refetch: refetchMenus 
  } = useQuery({
    queryKey: ['/api/navigation/menus', tenant?.id],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/navigation/menus?tenantId=${tenant?.id}`);
      const data = await response.json();
      return data.data as NavigationMenu[];
    },
    enabled: !!tenant?.id
  });
  
  // Fetch menu items for selected menu
  const { 
    data: menuItems, 
    isLoading: isLoadingMenuItems,
    refetch: refetchMenuItems
  } = useQuery({
    queryKey: ['/api/navigation/menu-items', selectedMenu?.id],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/navigation/menus/${selectedMenu?.id}/items/hierarchy`);
      const data = await response.json();
      return data.data as MenuTreeItem[];
    },
    enabled: !!selectedMenu?.id
  });
  
  // Create menu mutation
  const createMenuMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/navigation/menus', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Menu created successfully",
        variant: "default"
      });
      setIsCreateMenuDialogOpen(false);
      refetchMenus();
      resetNewMenuForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error creating menu",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Update menu mutation
  const updateMenuMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('PUT', `/api/navigation/menus/${selectedMenu?.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Menu updated successfully",
        variant: "default"
      });
      setIsEditMenuDialogOpen(false);
      refetchMenus();
    },
    onError: (error: any) => {
      toast({
        title: "Error updating menu",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Delete menu mutation
  const deleteMenuMutation = useMutation({
    mutationFn: async (menuId: number) => {
      const response = await apiRequest('DELETE', `/api/navigation/menus/${menuId}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Menu deleted successfully",
        variant: "default"
      });
      setSelectedMenu(null);
      refetchMenus();
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting menu",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Create menu item mutation
  const createMenuItemMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/navigation/items', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Menu item created successfully",
        variant: "default"
      });
      setIsCreateMenuItemDialogOpen(false);
      refetchMenuItems();
      resetNewMenuItemForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error creating menu item",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Update menu item mutation
  const updateMenuItemMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('PUT', `/api/navigation/items/${selectedMenuItem?.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Menu item updated successfully",
        variant: "default"
      });
      setIsEditMenuItemDialogOpen(false);
      refetchMenuItems();
      setSelectedMenuItem(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error updating menu item",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Delete menu item mutation
  const deleteMenuItemMutation = useMutation({
    mutationFn: async (itemId: number) => {
      const response = await apiRequest('DELETE', `/api/navigation/items/${itemId}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Menu item deleted successfully",
        variant: "default"
      });
      refetchMenuItems();
      setSelectedMenuItem(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting menu item",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Reorder menu items mutation
  const reorderMenuItemsMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/navigation/items/reorder', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Menu items reordered successfully",
        variant: "default"
      });
      refetchMenuItems();
    },
    onError: (error: any) => {
      toast({
        title: "Error reordering menu items",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  const resetNewMenuForm = () => {
    setNewMenuForm({
      name: '',
      slug: '',
      description: '',
      location: 'header',
      isActive: true
    });
  };
  
  const resetNewMenuItemForm = () => {
    setNewMenuItemForm({
      label: '',
      url: '',
      icon: '',
      parentId: null,
      isExternal: false,
      isVisible: true,
      requiredRole: null
    });
  };
  
  const handleMenuSelection = (menu: NavigationMenu) => {
    setSelectedMenu(menu);
    setActiveTab('items');
  };
  
  const handleCreateMenu = () => {
    if (!tenant?.id) return;
    
    if (!newMenuForm.name) {
      toast({
        title: "Menu name is required",
        variant: "destructive"
      });
      return;
    }
    
    if (!newMenuForm.slug) {
      toast({
        title: "Menu slug is required",
        variant: "destructive"
      });
      return;
    }
    
    createMenuMutation.mutate({
      ...newMenuForm,
      tenantId: tenant.id
    });
  };
  
  const handleEditMenu = () => {
    if (!selectedMenu) return;
    
    if (!editMenuForm.name) {
      toast({
        title: "Menu name is required",
        variant: "destructive"
      });
      return;
    }
    
    if (!editMenuForm.slug) {
      toast({
        title: "Menu slug is required",
        variant: "destructive"
      });
      return;
    }
    
    updateMenuMutation.mutate(editMenuForm);
  };
  
  const handleDeleteMenu = (menuId: number) => {
    if (confirm('Are you sure you want to delete this menu? This will also delete all menu items.')) {
      deleteMenuMutation.mutate(menuId);
    }
  };
  
  const handleCreateMenuItem = () => {
    if (!selectedMenu) return;
    
    if (!newMenuItemForm.label) {
      toast({
        title: "Menu item label is required",
        variant: "destructive"
      });
      return;
    }
    
    if (!newMenuItemForm.url) {
      toast({
        title: "Menu item URL is required",
        variant: "destructive"
      });
      return;
    }
    
    createMenuItemMutation.mutate({
      ...newMenuItemForm,
      menuId: selectedMenu.id
    });
  };
  
  const handleEditMenuItem = () => {
    if (!selectedMenuItem) return;
    
    if (!editMenuItemForm.label) {
      toast({
        title: "Menu item label is required",
        variant: "destructive"
      });
      return;
    }
    
    if (!editMenuItemForm.url) {
      toast({
        title: "Menu item URL is required",
        variant: "destructive"
      });
      return;
    }
    
    updateMenuItemMutation.mutate(editMenuItemForm);
  };
  
  const handleDeleteMenuItem = (itemId: number) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      deleteMenuItemMutation.mutate(itemId);
    }
  };
  
  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(menuItems || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update the order values
    const updatedItems = items.map((item, index) => ({
      id: item.id,
      order: index
    }));
    
    reorderMenuItemsMutation.mutate({ items: updatedItems });
  };
  
  const toggleMenuItemExpanded = (itemId: number) => {
    setExpandedMenuItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };
  
  const handleNewMenuFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMenuForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Auto-generate slug from name if slug is empty
    if (name === 'name' && !newMenuForm.slug) {
      const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      setNewMenuForm(prev => ({
        ...prev,
        slug
      }));
    }
  };
  
  const handleEditMenuFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditMenuForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNewMenuItemFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMenuItemForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleEditMenuItemFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditMenuItemForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleEditMenu = (menu: NavigationMenu) => {
    setEditMenuForm({
      name: menu.name,
      slug: menu.slug,
      description: menu.description || '',
      location: menu.location,
      isActive: menu.isActive
    });
    setIsEditMenuDialogOpen(true);
  };
  
  const handleEditMenuItem = (item: MenuItem) => {
    setSelectedMenuItem(item);
    setEditMenuItemForm({
      label: item.label,
      url: item.url,
      icon: item.icon || '',
      parentId: item.parentId,
      isExternal: item.isExternal,
      isVisible: item.isVisible,
      requiredRole: item.requiredRole || null
    });
    setIsEditMenuItemDialogOpen(true);
  };
  
  const renderMenuItems = (items: MenuTreeItem[], level = 0) => {
    if (!items || items.length === 0) return null;
    
    return (
      <ul className={`space-y-1 ${level > 0 ? 'ml-6' : ''}`}>
        {items.map((item, index) => (
          <li key={item.id} className="relative">
            <div className="flex items-center justify-between py-2 px-3 hover:bg-muted rounded-md">
              <div className="flex items-center gap-2">
                {item.children && item.children.length > 0 ? (
                  <button 
                    onClick={() => toggleMenuItemExpanded(item.id)}
                    className="h-5 w-5 inline-flex items-center justify-center"
                  >
                    {expandedMenuItems[item.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                ) : (
                  <span className="h-5 w-5"></span>
                )}
                <span className="font-medium">{item.label}</span>
                {item.isExternal && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
                {!item.isVisible && <Badge variant="outline" className="ml-2 text-xs">Hidden</Badge>}
                {item.requiredRole && <Badge className="ml-2 text-xs">{item.requiredRole}</Badge>}
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleEditMenuItem(item)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDeleteMenuItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {item.children && item.children.length > 0 && expandedMenuItems[item.id] && (
              renderMenuItems(item.children, level + 1)
            )}
          </li>
        ))}
      </ul>
    );
  };
  
  return (
    <AdminLayout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Menu Management</h1>
            <p className="text-muted-foreground">Create and manage navigation menus for your site</p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="menus">Menus</TabsTrigger>
            <TabsTrigger value="items" disabled={!selectedMenu}>Menu Items</TabsTrigger>
          </TabsList>
          
          <TabsContent value="menus" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Navigation Menus</h2>
              <Dialog open={isCreateMenuDialogOpen} onOpenChange={setIsCreateMenuDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Menu
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Navigation Menu</DialogTitle>
                    <DialogDescription>
                      Add a new navigation menu to your site.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Menu Name</Label>
                      <Input 
                        id="name" 
                        name="name"
                        placeholder="Main Navigation" 
                        value={newMenuForm.name}
                        onChange={handleNewMenuFormChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="slug">Menu Slug</Label>
                      <Input 
                        id="slug" 
                        name="slug"
                        placeholder="main-navigation" 
                        value={newMenuForm.slug}
                        onChange={handleNewMenuFormChange}
                      />
                      <p className="text-sm text-muted-foreground">Used as a unique identifier for this menu</p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea 
                        id="description" 
                        name="description"
                        placeholder="Main site navigation" 
                        value={newMenuForm.description}
                        onChange={handleNewMenuFormChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="location">Menu Location</Label>
                      <Select 
                        name="location"
                        value={newMenuForm.location} 
                        onValueChange={(value) => setNewMenuForm(prev => ({ ...prev, location: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {menuLocations.map(location => (
                            <SelectItem key={location.value} value={location.value}>
                              {location.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        id="isActive"
                        checked={newMenuForm.isActive}
                        onCheckedChange={(checked) => setNewMenuForm(prev => ({ ...prev, isActive: checked }))}
                      />
                      <Label htmlFor="isActive">Active</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateMenuDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateMenu} disabled={createMenuMutation.isPending}>
                      {createMenuMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Menu
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {isLoadingMenus ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : menus && menus.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menus.map(menu => (
                  <Card key={menu.id} className={selectedMenu?.id === menu.id ? 'border-primary' : ''}>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span className="truncate">{menu.name}</span>
                        {!menu.isActive && <Badge variant="outline">Inactive</Badge>}
                      </CardTitle>
                      <CardDescription>
                        Location: {menuLocations.find(loc => loc.value === menu.location)?.label || menu.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {menu.description && <p className="text-sm text-muted-foreground mb-4">{menu.description}</p>}
                      <div className="text-sm">
                        <span className="font-medium">Slug:</span> {menu.slug}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm" onClick={() => handleMenuSelection(menu)}>
                        Manage Items
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditMenu(menu)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteMenu(menu.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <p className="text-muted-foreground mb-4">No menus found. Create your first menu.</p>
                  <Button variant="outline" onClick={() => setIsCreateMenuDialogOpen(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Menu
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="items" className="space-y-4">
            {selectedMenu && (
              <>
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-medium">Menu Items for "{selectedMenu.name}"</h2>
                    <p className="text-muted-foreground">Manage menu items and their hierarchy</p>
                  </div>
                  <Dialog open={isCreateMenuItemDialogOpen} onOpenChange={setIsCreateMenuItemDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Menu Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Menu Item</DialogTitle>
                        <DialogDescription>
                          Add a new item to the "{selectedMenu.name}" menu.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="label">Label</Label>
                          <Input 
                            id="label" 
                            name="label"
                            placeholder="Home" 
                            value={newMenuItemForm.label}
                            onChange={handleNewMenuItemFormChange}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="url">URL</Label>
                          <Input 
                            id="url" 
                            name="url"
                            placeholder="/" 
                            value={newMenuItemForm.url}
                            onChange={handleNewMenuItemFormChange}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="icon">Icon (Optional)</Label>
                          <Input 
                            id="icon" 
                            name="icon"
                            placeholder="home" 
                            value={newMenuItemForm.icon}
                            onChange={handleNewMenuItemFormChange}
                          />
                          <p className="text-sm text-muted-foreground">Lucide icon name (if used)</p>
                        </div>
                        {menuItems && menuItems.length > 0 && (
                          <div className="grid gap-2">
                            <Label htmlFor="parentId">Parent Item (Optional)</Label>
                            <Select 
                              value={newMenuItemForm.parentId?.toString() || ''}
                              onValueChange={(value) => setNewMenuItemForm(prev => ({ 
                                ...prev, 
                                parentId: value ? parseInt(value) : null 
                              }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="No parent (top level)" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">No parent (top level)</SelectItem>
                                {menuItems.map(item => (
                                  <SelectItem key={item.id} value={item.id.toString()}>
                                    {item.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Switch 
                            id="isExternal"
                            checked={newMenuItemForm.isExternal}
                            onCheckedChange={(checked) => setNewMenuItemForm(prev => ({ ...prev, isExternal: checked }))}
                          />
                          <Label htmlFor="isExternal">External Link</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch 
                            id="isVisible"
                            checked={newMenuItemForm.isVisible}
                            onCheckedChange={(checked) => setNewMenuItemForm(prev => ({ ...prev, isVisible: checked }))}
                          />
                          <Label htmlFor="isVisible">Visible</Label>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="requiredRole">Required Role (Optional)</Label>
                          <Select 
                            value={newMenuItemForm.requiredRole || ''}
                            onValueChange={(value) => setNewMenuItemForm(prev => ({ 
                              ...prev, 
                              requiredRole: value || null
                            }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="None (visible to all)" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">None (visible to all)</SelectItem>
                              <SelectItem value="client">Client</SelectItem>
                              <SelectItem value="editor">Editor</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="super_admin">Super Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-sm text-muted-foreground">If set, item will only be visible to users with this role or higher</p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateMenuItemDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateMenuItem} disabled={createMenuItemMutation.isPending}>
                          {createMenuItemMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Add Item
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {isLoadingMenuItems ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : menuItems && menuItems.length > 0 ? (
                  <div className="border rounded-md p-4 bg-card">
                    {renderMenuItems(menuItems)}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <p className="text-muted-foreground mb-4">No menu items found. Add your first item.</p>
                      <Button variant="outline" onClick={() => setIsCreateMenuItemDialogOpen(true)}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Menu Item
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Edit Menu Dialog */}
      <Dialog open={isEditMenuDialogOpen} onOpenChange={setIsEditMenuDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Menu</DialogTitle>
            <DialogDescription>
              Update the navigation menu details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Menu Name</Label>
              <Input 
                id="edit-name" 
                name="name"
                value={editMenuForm.name}
                onChange={handleEditMenuFormChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-slug">Menu Slug</Label>
              <Input 
                id="edit-slug" 
                name="slug"
                value={editMenuForm.slug}
                onChange={handleEditMenuFormChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Textarea 
                id="edit-description" 
                name="description"
                value={editMenuForm.description}
                onChange={handleEditMenuFormChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-location">Menu Location</Label>
              <Select 
                name="location"
                value={editMenuForm.location} 
                onValueChange={(value) => setEditMenuForm(prev => ({ ...prev, location: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {menuLocations.map(location => (
                    <SelectItem key={location.value} value={location.value}>
                      {location.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Switch 
                id="edit-isActive"
                checked={editMenuForm.isActive}
                onCheckedChange={(checked) => setEditMenuForm(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="edit-isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditMenuDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditMenu} disabled={updateMenuMutation.isPending}>
              {updateMenuMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Menu Item Dialog */}
      <Dialog open={isEditMenuItemDialogOpen} onOpenChange={setIsEditMenuItemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
            <DialogDescription>
              Update the menu item details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-item-label">Label</Label>
              <Input 
                id="edit-item-label" 
                name="label"
                value={editMenuItemForm.label}
                onChange={handleEditMenuItemFormChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-item-url">URL</Label>
              <Input 
                id="edit-item-url" 
                name="url"
                value={editMenuItemForm.url}
                onChange={handleEditMenuItemFormChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-item-icon">Icon (Optional)</Label>
              <Input 
                id="edit-item-icon" 
                name="icon"
                value={editMenuItemForm.icon || ''}
                onChange={handleEditMenuItemFormChange}
              />
              <p className="text-sm text-muted-foreground">Lucide icon name (if used)</p>
            </div>
            {menuItems && menuItems.length > 0 && selectedMenuItem && (
              <div className="grid gap-2">
                <Label htmlFor="edit-item-parentId">Parent Item (Optional)</Label>
                <Select 
                  value={editMenuItemForm.parentId?.toString() || ''}
                  onValueChange={(value) => setEditMenuItemForm(prev => ({ 
                    ...prev, 
                    parentId: value ? parseInt(value) : null 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="No parent (top level)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No parent (top level)</SelectItem>
                    {menuItems.filter(item => item.id !== selectedMenuItem.id).map(item => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Switch 
                id="edit-item-isExternal"
                checked={editMenuItemForm.isExternal}
                onCheckedChange={(checked) => setEditMenuItemForm(prev => ({ ...prev, isExternal: checked }))}
              />
              <Label htmlFor="edit-item-isExternal">External Link</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch 
                id="edit-item-isVisible"
                checked={editMenuItemForm.isVisible}
                onCheckedChange={(checked) => setEditMenuItemForm(prev => ({ ...prev, isVisible: checked }))}
              />
              <Label htmlFor="edit-item-isVisible">Visible</Label>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-item-requiredRole">Required Role (Optional)</Label>
              <Select 
                value={editMenuItemForm.requiredRole || ''}
                onValueChange={(value) => setEditMenuItemForm(prev => ({ 
                  ...prev, 
                  requiredRole: value || null
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="None (visible to all)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None (visible to all)</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditMenuItemDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditMenuItem} disabled={updateMenuItemMutation.isPending}>
              {updateMenuItemMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default MenuManagementPage;