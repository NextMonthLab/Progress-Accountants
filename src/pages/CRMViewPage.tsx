import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, PlusCircle, Pencil, Trash2, Link } from 'lucide-react';

// Defining the Contact interface based on database schema
interface Contact {
  id: number;
  tenantId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  createdBy?: number;
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
  tags: string[];
}

export default function CRMViewPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State for contact form
  const [contactForm, setContactForm] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: '',
    tags: [],
  });
  
  // State for tag input
  const [tagInput, setTagInput] = useState('');
  
  // State for current contact being edited or deleted
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  
  // Dialog open states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Query for fetching contacts
  const {
    data: contactsResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['/api/crm/contacts'],
    queryFn: async () => {
      const res = await fetch('/api/crm/contacts');
      if (!res.ok) {
        throw new Error('Failed to fetch contacts');
      }
      return res.json();
    },
  });

  // Extract contacts array from response, or use empty array if not available
  const contacts = contactsResponse?.data || [];

  // Mutation for adding a contact
  const addContactMutation = useMutation({
    mutationFn: async (contact: ContactFormData) => {
      const response = await apiRequest('POST', '/api/crm/contacts', contact);
      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/crm/contacts'] });
      toast({
        title: 'Contact Added',
        description: 'The contact has been successfully added.',
      });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error Adding Contact',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Mutation for updating a contact
  const updateContactMutation = useMutation({
    mutationFn: async ({ id, contact }: { id: number; contact: ContactFormData }) => {
      const response = await apiRequest('PUT', `/api/crm/contacts/${id}`, contact);
      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/crm/contacts'] });
      toast({
        title: 'Contact Updated',
        description: 'The contact has been successfully updated.',
      });
      setIsEditDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error Updating Contact',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Mutation for deleting a contact
  const deleteContactMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/crm/contacts/${id}`);
      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/crm/contacts'] });
      toast({
        title: 'Contact Deleted',
        description: 'The contact has been successfully deleted.',
      });
      setIsDeleteDialogOpen(false);
      setCurrentContact(null);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error Deleting Contact',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Reset form fields
  const resetForm = () => {
    setContactForm({
      name: '',
      email: '',
      phone: '',
      company: '',
      notes: '',
      tags: [],
    });
    setTagInput('');
  };

  // Form change handler
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  // Tag input change handler
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  // Add tag to form
  const handleAddTag = () => {
    if (tagInput.trim() !== '' && !contactForm.tags.includes(tagInput.trim())) {
      setContactForm((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  // Remove tag from form
  const handleRemoveTag = (tagToRemove: string) => {
    setContactForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Edit contact handler
  const handleEditClick = (contact: Contact) => {
    setCurrentContact(contact);
    setContactForm({
      name: contact.name,
      email: contact.email,
      phone: contact.phone || '',
      company: contact.company || '',
      notes: contact.notes || '',
      tags: contact.tags || [],
    });
    setIsEditDialogOpen(true);
  };

  // Delete contact handler
  const handleDeleteClick = (contact: Contact) => {
    setCurrentContact(contact);
    setIsDeleteDialogOpen(true);
  };

  // Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isAddDialogOpen) {
      addContactMutation.mutate(contactForm);
    } else if (isEditDialogOpen && currentContact) {
      updateContactMutation.mutate({
        id: currentContact.id,
        contact: contactForm,
      });
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (currentContact) {
      deleteContactMutation.mutate(currentContact.id);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Starter CRM</h1>
          <p className="text-muted-foreground">
            Manage your contacts with this lightweight CRM tool
          </p>
        </div>
        <Button 
          onClick={() => {
            resetForm();
            setIsAddDialogOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add Contact
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Contacts</CardTitle>
          <CardDescription>
            A list of all your contacts. Add, edit, or remove contacts as needed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="text-center py-8 text-red-500">
              Error loading contacts: {error instanceof Error ? error.message : 'Unknown error'}
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No contacts found. Add your first contact to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact: Contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.phone || '—'}</TableCell>
                      <TableCell>{contact.company || '—'}</TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="truncate">
                          {contact.notes || '—'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {contact.tags && contact.tags.length > 0 ? (
                            contact.tags.map((tag: string, index: number) => (
                              <Badge key={index} variant="outline" className="mr-1">
                                {tag}
                              </Badge>
                            ))
                          ) : (
                            '—'
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(contact)}
                            title="Edit contact"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(contact)}
                            title="Delete contact"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
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
        <CardFooter className="flex justify-between bg-muted/50 p-4 text-sm">
          <div>
            Total Contacts: {contacts.length}
          </div>
          <div className="flex items-center">
            <Link className="h-4 w-4 mr-2" />
            <a href="#" className="text-primary hover:underline">
              Looking for more advanced CRM features? Check out our marketplace.
            </a>
          </div>
        </CardFooter>
      </Card>

      {/* Add Contact Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
            <DialogDescription>
              Enter the contact details below to add a new contact to your CRM.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={contactForm.name}
                  onChange={handleFormChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={contactForm.email}
                  onChange={handleFormChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={contactForm.phone}
                  onChange={handleFormChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company" className="text-right">
                  Company
                </Label>
                <Input
                  id="company"
                  name="company"
                  value={contactForm.company}
                  onChange={handleFormChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={contactForm.notes}
                  onChange={handleFormChange}
                  className="col-span-3"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tags" className="text-right">
                  Tags
                </Label>
                <div className="col-span-3">
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      value={tagInput}
                      onChange={handleTagInputChange}
                      placeholder="Add a tag"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleAddTag}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {contactForm.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="mr-1">
                        {tag}
                        <button
                          type="button"
                          className="ml-1 text-xs"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          &times;
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsAddDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={addContactMutation.isPending}>
                {addContactMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Add Contact
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Contact Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
            <DialogDescription>
              Update the contact details below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name *
                </Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={contactForm.name}
                  onChange={handleFormChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email *
                </Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={contactForm.email}
                  onChange={handleFormChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="edit-phone"
                  name="phone"
                  value={contactForm.phone}
                  onChange={handleFormChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-company" className="text-right">
                  Company
                </Label>
                <Input
                  id="edit-company"
                  name="company"
                  value={contactForm.company}
                  onChange={handleFormChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-notes" className="text-right">
                  Notes
                </Label>
                <Textarea
                  id="edit-notes"
                  name="notes"
                  value={contactForm.notes}
                  onChange={handleFormChange}
                  className="col-span-3"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-tags" className="text-right">
                  Tags
                </Label>
                <div className="col-span-3">
                  <div className="flex gap-2">
                    <Input
                      id="edit-tags"
                      value={tagInput}
                      onChange={handleTagInputChange}
                      placeholder="Add a tag"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleAddTag}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {contactForm.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="mr-1">
                        {tag}
                        <button
                          type="button"
                          className="ml-1 text-xs"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          &times;
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsEditDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateContactMutation.isPending}>
                {updateContactMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Contact
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Contact Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Contact</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this contact? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {currentContact && (
              <div className="space-y-2">
                <p>
                  <strong>Name:</strong> {currentContact.name}
                </p>
                <p>
                  <strong>Email:</strong> {currentContact.email}
                </p>
                {currentContact.company && (
                  <p>
                    <strong>Company:</strong> {currentContact.company}
                  </p>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteContactMutation.isPending}
            >
              {deleteContactMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}