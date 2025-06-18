import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiRequest } from '@/lib/queryClient';
import { Plus, UserPlus, Edit, Trash2, Search, RefreshCw } from 'lucide-react';

// Form validation schema
const addUserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  displayName: z.string().min(1, "Display name is required"),
  role: z.string().optional(),
  isActive: z.boolean().default(true),
});

const editUserSchema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  role: z.string().optional(),
  isActive: z.boolean(),
});

type InsightUser = {
  id: number;
  email: string;
  displayName: string;
  role?: string;
  isActive: boolean;
};

export default function InsightUsersPage() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<InsightUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: users, isLoading, refetch } = useQuery<InsightUser[]>({
    queryKey: ['/api/insight-users'],
    queryFn: async () => {
      const res = await fetch('/api/insight-users');
      if (!res.ok) throw new Error('Failed to fetch users');
      return await res.json();
    }
  });
  
  const createUserMutation = useMutation({
    mutationFn: async (data: z.infer<typeof addUserSchema>) => {
      const res = await apiRequest('POST', '/api/insight-users', data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/insight-users'] });
      setIsAddUserOpen(false);
      toast({
        title: 'User created',
        description: 'The user has been created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to create user',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: z.infer<typeof editUserSchema> }) => {
      const res = await apiRequest('PATCH', `/api/insight-users/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/insight-users'] });
      setIsEditUserOpen(false);
      setSelectedUser(null);
      toast({
        title: 'User updated',
        description: 'The user has been updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update user',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/insight-users/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/insight-users'] });
      toast({
        title: 'User deleted',
        description: 'The user has been deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to delete user',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  const filteredUsers = users?.filter(user => 
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.role && user.role.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  return (
    <AdminLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Insights Users</h1>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8 w-[240px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Insights User</DialogTitle>
                </DialogHeader>
                <AddUserForm onSubmit={(data) => createUserMutation.mutate(data)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredUsers?.length ? (
              filteredUsers.map(user => (
                <UserCard 
                  key={user.id} 
                  user={user} 
                  onEdit={() => {
                    setSelectedUser(user);
                    setIsEditUserOpen(true);
                  }}
                  onDelete={() => {
                    if (window.confirm(`Are you sure you want to delete ${user.displayName}?`)) {
                      deleteUserMutation.mutate(user.id);
                    }
                  }}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                {searchQuery ? 'No users match your search' : 'No users have been added yet'}
              </div>
            )}
          </div>
        )}
      </div>
      
      {selectedUser && (
        <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <EditUserForm 
              user={selectedUser} 
              onSubmit={(data) => updateUserMutation.mutate({ id: selectedUser.id, data })} 
            />
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
}

type UserCardProps = {
  user: InsightUser;
  onEdit: () => void;
  onDelete: () => void;
};

function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span className="truncate">{user.displayName}</span>
          <span className={`px-2 py-1 rounded-full text-xs ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {user.isActive ? 'Active' : 'Inactive'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
          {user.role && (
            <p className="text-sm truncate">Role: {user.role}</p>
          )}
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button variant="outline" size="sm" className="text-red-500" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type AddUserFormProps = {
  onSubmit: (data: z.infer<typeof addUserSchema>) => void;
};

function AddUserForm({ onSubmit }: AddUserFormProps) {
  const form = useForm<z.infer<typeof addUserSchema>>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      email: '',
      displayName: '',
      role: '',
      isActive: true
    }
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="user@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Finance Manager" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="!mt-0">Active</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end pt-2">
          <Button type="submit">Add User</Button>
        </div>
      </form>
    </Form>
  );
}

type EditUserFormProps = {
  user: InsightUser;
  onSubmit: (data: z.infer<typeof editUserSchema>) => void;
};

function EditUserForm({ user, onSubmit }: EditUserFormProps) {
  const form = useForm<z.infer<typeof editUserSchema>>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      displayName: user.displayName,
      role: user.role || '',
      isActive: user.isActive
    }
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="text-sm text-muted-foreground mb-4">
          Email: {user.email}
        </div>
        
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role (Optional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="!mt-0">Active</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end pt-2">
          <Button type="submit">Update User</Button>
        </div>
      </form>
    </Form>
  );
}