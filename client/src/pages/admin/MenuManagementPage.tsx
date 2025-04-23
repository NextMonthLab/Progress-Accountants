import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useTenant } from "@/hooks/use-tenant";
import { 
  Edit, Loader2, PlusCircle, Trash2, 
  ChevronRight, ChevronDown, GripVertical, ExternalLink
} from "lucide-react";
import type { NavigationMenu, MenuItem } from "@shared/navigation_menu";

const menuLocations = [
  { value: "header", label: "Header Navigation" },
  { value: "footer", label: "Footer Navigation" },
  { value: "sidebar", label: "Sidebar Navigation" },
  { value: "mobile", label: "Mobile Navigation" }
];

const MenuManagementPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("menus");
  const [selectedMenu, setSelectedMenu] = useState<NavigationMenu | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  
  // Dialog states
  const [isCreateMenuDialogOpen, setIsCreateMenuDialogOpen] = useState(false);
  const [isEditMenuDialogOpen, setIsEditMenuDialogOpen] = useState(false);
  const [isCreateMenuItemDialogOpen, setIsCreateMenuItemDialogOpen] = useState(false);
  const [isEditMenuItemDialogOpen, setIsEditMenuItemDialogOpen] = useState(false);
  
  // Form states
  const [newMenuForm, setNewMenuForm] = useState({
    name: "",
    slug: "",
    description: "",
    location: "header",
    isActive: true
  });
  
  const [editMenuForm, setEditMenuForm] = useState<Partial<NavigationMenu> & { isActive: boolean }>({
    id: 0,
    name: "",
    slug: "",
    description: "",
    location: "header",
    isActive: true,
    tenantId: ""
  });
  
  const [newMenuItemForm, setNewMenuItemForm] = useState({
    label: "",
    url: "",
    icon: "",
    menuId: 0,
    parentId: null as number | null,
    order: 0,
    isExternal: false,
    isVisible: true,
    requiredRole: null as string | null
  });
  
  const [editMenuItemForm, setEditMenuItemForm] = useState<MenuItem>({
    id: 0,
    label: "",
    url: "",
    icon: "",
    menuId: 0,
    parentId: null,
    order: 0,
    isExternal: false,
    isVisible: true,
    requiredRole: null
  });
  
  // Get tenant context for tenant ID
  const { tenant } = useTenant();

  // Queries
  const { 
    data: menus, 
    isLoading: isLoadingMenus 
  } = useQuery({
    queryKey: ["/api/navigation/menus", tenant?.id],
    queryFn: async () => {
      if (!tenant?.id) return [];
      const response = await fetch(`/api/navigation/menus?tenantId=${tenant.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch menus");
      }
      const responseData = await response.json();
      return responseData.data || [];
    },
    enabled: !!tenant?.id
  });
  
  const { 
    data: menuItems, 
    isLoading: isLoadingMenuItems 
  } = useQuery({
    queryKey: ["/api/navigation/menus", selectedMenu?.id, "items"],
    queryFn: async () => {
      if (!selectedMenu) return [];
      const response = await fetch(`/api/navigation/menus/${selectedMenu.id}/items`);
      if (!response.ok) {
        throw new Error("Failed to fetch menu items");
      }
      const responseData = await response.json();
      return responseData.data || [];
    },
    enabled: !!selectedMenu
  });
  
  // Mutations
  const createMenuMutation = useMutation({
    mutationFn: async (newMenu: typeof newMenuForm) => {
      const response = await fetch("/api/navigation/menus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...newMenu,
          tenantId: tenant?.id
        })
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to create menu");
      }
      
      return response.json() as Promise<NavigationMenu>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/navigation/menus"] });
      setIsCreateMenuDialogOpen(false);
      setNewMenuForm({
        name: "",
        slug: "",
        description: "",
        location: "header",
        isActive: true
      });
      toast({
        title: "Menu Created",
        description: "The menu has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  const updateMenuMutation = useMutation({
    mutationFn: async (updatedMenu: Partial<NavigationMenu>) => {
      const response = await fetch(`/api/navigation/menus/${updatedMenu.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedMenu)
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to update menu");
      }
      
      return response.json() as Promise<NavigationMenu>;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/navigation/menus"] });
      if (selectedMenu && selectedMenu.id === data.id) {
        setSelectedMenu(data);
      }
      setIsEditMenuDialogOpen(false);
      toast({
        title: "Menu Updated",
        description: "The menu has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  const deleteMenuMutation = useMutation({
    mutationFn: async (menuId: number) => {
      const response = await fetch(`/api/navigation/menus/${menuId}`, {
        method: "DELETE"
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to delete menu");
      }
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/navigation/menus"] });
      if (selectedMenu) {
        setSelectedMenu(null);
        setActiveTab("menus");
      }
      toast({
        title: "Menu Deleted",
        description: "The menu has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  const createMenuItemMutation = useMutation({
    mutationFn: async (newMenuItem: typeof newMenuItemForm) => {
      const response = await fetch("/api/navigation/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newMenuItem)
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to create menu item");
      }
      
      return response.json() as Promise<MenuItem>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/navigation/menus", selectedMenu?.id, "items"] });
      setIsCreateMenuItemDialogOpen(false);
      setNewMenuItemForm({
        label: "",
        url: "",
        icon: "",
        menuId: selectedMenu?.id || 0,
        parentId: null,
        order: 0,
        isExternal: false,
        isVisible: true,
        requiredRole: null
      });
      toast({
        title: "Menu Item Created",
        description: "The menu item has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  const updateMenuItemMutation = useMutation({
    mutationFn: async (updatedMenuItem: MenuItem) => {
      const response = await fetch(`/api/navigation/items/${updatedMenuItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedMenuItem)
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to update menu item");
      }
      
      return response.json() as Promise<MenuItem>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/navigation/menus", selectedMenu?.id, "items"] });
      setIsEditMenuItemDialogOpen(false);
      toast({
        title: "Menu Item Updated",
        description: "The menu item has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  const deleteMenuItemMutation = useMutation({
    mutationFn: async (menuItemId: number) => {
      const response = await fetch(`/api/navigation/items/${menuItemId}`, {
        method: "DELETE"
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to delete menu item");
      }
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/navigation/menus", selectedMenu?.id, "items"] });
      setSelectedMenuItem(null);
      toast({
        title: "Menu Item Deleted",
        description: "The menu item has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Event handlers
  const handleNewMenuFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewMenuForm((prev: typeof newMenuForm) => ({ ...prev, [name]: value }));
  };
  
  const handleEditMenuFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditMenuForm((prev: Partial<NavigationMenu> & { isActive: boolean }) => ({ ...prev, [name]: value }));
  };
  
  const handleNewMenuItemFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewMenuItemForm((prev: typeof newMenuItemForm) => ({ ...prev, [name]: value }));
  };
  
  const handleEditMenuItemFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditMenuItemForm((prev: MenuItem) => ({ ...prev, [name]: value }));
  };
  
  const handleCreateMenu = () => {
    createMenuMutation.mutate(newMenuForm);
  };
  
  const handleUpdateMenu = () => {
    updateMenuMutation.mutate(editMenuForm);
  };
  
  const handleDeleteMenu = (menuId: number) => {
    if (window.confirm("Are you sure you want to delete this menu? This will also delete all its menu items.")) {
      deleteMenuMutation.mutate(menuId);
    }
  };
  
  const handleCreateMenuItem = () => {
    if (!selectedMenu) return;
    
    // Ensure boolean values are properly set
    const menuItem = {
      ...newMenuItemForm,
      menuId: selectedMenu.id,
      order: menuItems && menuItems.length > 0 ? menuItems.length : 0,
      isExternal: !!newMenuItemForm.isExternal,
      isVisible: !!newMenuItemForm.isVisible
    };
    
    createMenuItemMutation.mutate(menuItem);
  };
  
  const handleSaveMenuItem = () => {
    // Ensure boolean values are properly set before submitting
    const updatedMenuItem = {
      ...editMenuItemForm,
      isExternal: !!editMenuItemForm.isExternal,
      isVisible: !!editMenuItemForm.isVisible
    };
    
    updateMenuItemMutation.mutate(updatedMenuItem);
  };
  
  const handleDeleteMenuItem = (menuItemId: number) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      deleteMenuItemMutation.mutate(menuItemId);
    }
  };
  
  const handleMenuSelection = (menu: NavigationMenu) => {
    setSelectedMenu(menu);
    setActiveTab("items");
    
    // Set default form for new menu items in this menu
    setNewMenuItemForm((prev: typeof newMenuItemForm) => ({
      ...prev,
      menuId: menu.id
    }));
  };
  
  const handleOpenEditMenuDialog = (menu: NavigationMenu) => {
    setEditMenuForm({
      ...menu,
      isActive: !!menu.isActive // Convert to boolean to ensure it's never null
    });
    setIsEditMenuDialogOpen(true);
  };
  
  const handleOpenEditMenuItemDialog = (item: MenuItem) => {
    setSelectedMenuItem(item);
    // Ensure boolean values are properly set
    setEditMenuItemForm({
      ...item,
      isExternal: !!item.isExternal,
      isVisible: !!item.isVisible
    });
    setIsEditMenuItemDialogOpen(true);
  };
  
  // Renderer for the menu items tree
  const renderMenuItems = (items: MenuItem[] = [], parentId: number | null = null, level = 0) => {
    const filteredItems = items.filter(item => item.parentId === parentId);
    
    if (filteredItems.length === 0) {
      return null;
    }
    
    return (
      <ul className={`space-y-2 ${level > 0 ? 'ml-6 border-l-2 border-gray-200 pl-2' : ''}`}>
        {filteredItems.map(item => (
          <li key={item.id} className="relative">
            <div className="flex items-center justify-between p-2 rounded-md hover:bg-secondary">
              <div className="flex items-center">
                <GripVertical className="h-4 w-4 mr-2 text-muted-foreground" />
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <span className="font-medium">{item.label}</span>
                    {item.isExternal && <ExternalLink className="h-3 w-3 ml-1 text-muted-foreground" />}
                    {!item.isVisible && <Badge variant="outline" className="ml-2 text-xs">Hidden</Badge>}
                    {item.requiredRole && (
                      <Badge variant="secondary" className="ml-2 text-xs">{item.requiredRole}</Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{item.url}</span>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button variant="ghost" size="icon" onClick={() => handleOpenEditMenuItemDialog(item)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteMenuItem(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {renderMenuItems(items, item.id, level + 1)}
          </li>
        ))}
      </ul>
    );
  };
  
  return (
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
              {menus.map((menu: NavigationMenu) => (
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
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEditMenuDialog(menu)}>
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
                              {menuItems.map((item: MenuItem) => (
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
                <Card>
                  <CardContent className="p-4">
                    {renderMenuItems(menuItems)}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <p className="text-muted-foreground mb-4">No menu items found. Add your first menu item.</p>
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
      
      {/* Edit Menu Dialog */}
      <Dialog open={isEditMenuDialogOpen} onOpenChange={setIsEditMenuDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Menu</DialogTitle>
            <DialogDescription>
              Update the menu details.
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
                value={editMenuForm.description || ''}
                onChange={handleEditMenuFormChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-location">Menu Location</Label>
              <Select 
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
                checked={!!editMenuForm.isActive}
                onCheckedChange={(checked) => setEditMenuForm((prev: Partial<NavigationMenu> & { isActive: boolean }) => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="edit-isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditMenuDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateMenu} disabled={updateMenuMutation.isPending}>
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
                  onValueChange={(value) => setEditMenuItemForm((prev: MenuItem) => ({ 
                    ...prev, 
                    parentId: value ? parseInt(value) : null 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="No parent (top level)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No parent (top level)</SelectItem>
                    {menuItems.filter((item: MenuItem) => item.id !== selectedMenuItem.id).map((item: MenuItem) => (
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
                onCheckedChange={(checked) => setEditMenuItemForm((prev: MenuItem) => ({ ...prev, isExternal: checked }))}
              />
              <Label htmlFor="edit-item-isExternal">External Link</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch 
                id="edit-item-isVisible"
                checked={editMenuItemForm.isVisible}
                onCheckedChange={(checked) => setEditMenuItemForm((prev: MenuItem) => ({ ...prev, isVisible: checked }))}
              />
              <Label htmlFor="edit-item-isVisible">Visible</Label>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-item-requiredRole">Required Role (Optional)</Label>
              <Select 
                value={editMenuItemForm.requiredRole || ''}
                onValueChange={(value) => setEditMenuItemForm((prev: MenuItem) => ({ 
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
            <Button onClick={handleSaveMenuItem} disabled={updateMenuItemMutation.isPending}>
              {updateMenuItemMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuManagementPage;