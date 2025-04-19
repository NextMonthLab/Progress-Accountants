import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, FileX, FileImage, Info, CheckCircle2, Save } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const PLACEMENT_OPTIONS = [
  "Hero Section",
  "About Section",
  "Services Section",
  "Testimonials Section",
  "Contact Section",
  "Blog Thumbnail",
  "Sidebar",
  "Footer"
];

interface MediaFilesProps {
  businessId: string;
}

interface FileEditState {
  id: number;
  currentLocation: string;
  newLocation: string;
  isEditing: boolean;
}

export default function MediaFiles({ businessId }: MediaFilesProps) {
  const [editStates, setEditStates] = useState<Record<number, FileEditState>>({});
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/media/files/${businessId}`],
    queryFn: async () => {
      const response = await fetch(`/api/media/files/${businessId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch media files');
      }
      return response.json();
    },
  });
  
  const updatePlacementMutation = useMutation({
    mutationFn: async ({ id, location }: { id: number, location: string }) => {
      const response = await fetch(`/api/media/files/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ suggestedLocation: location }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update placement');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate the query to refresh the data
      queryClient.invalidateQueries({ queryKey: [`/api/media/files/${businessId}`] });
      toast({
        title: 'Placement updated',
        description: 'The image placement has been successfully updated',
      });
      // Reset edit states
      setEditStates({});
    },
    onError: (error: Error) => {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  const handleLocationChange = (fileId: number, suggestedLocation: string, newLocation: string) => {
    setEditStates({
      ...editStates,
      [fileId]: {
        id: fileId,
        currentLocation: suggestedLocation || '',
        newLocation: newLocation,
        isEditing: true,
      }
    });
  };
  
  const saveLocationChange = (fileId: number) => {
    const editState = editStates[fileId];
    if (editState && editState.newLocation) {
      updatePlacementMutation.mutate({ id: fileId, location: editState.newLocation });
    }
  };
  
  const cancelEdit = (fileId: number) => {
    const newEditStates = { ...editStates };
    delete newEditStates[fileId];
    setEditStates(newEditStates);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data?.success) {
    return (
      <Card>
        <CardContent className="pt-6 flex flex-col items-center justify-center h-40 text-center">
          <FileX className="h-8 w-8 text-destructive mb-2" />
          <p className="text-muted-foreground">Failed to load media files</p>
        </CardContent>
      </Card>
    );
  }

  const files = data.data;

  if (files.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 flex flex-col items-center justify-center h-40 text-center">
          <FileImage className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No media files found</p>
        </CardContent>
      </Card>
    );
  }

  // Function to truncate long file names
  const truncateFileName = (fileName: string, maxLength: number = 25) => {
    if (fileName.length <= maxLength) return fileName;
    const ext = fileName.split('.').pop() || '';
    const name = fileName.substring(0, fileName.length - ext.length - 1);
    const truncatedName = name.substring(0, maxLength - ext.length - 4) + '...';
    return `${truncatedName}.${ext}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media Files</CardTitle>
        <CardDescription>View and manage uploaded media files</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Suggested Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead>Size</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file: any) => (
              <TableRow key={file.id} className="group">
                <TableCell className="flex items-center">
                  <a 
                    href={file.publicUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center"
                  >
                    <FileImage className="h-4 w-4 mr-2" />
                    {truncateFileName(file.fileName)}
                  </a>
                </TableCell>
                <TableCell className="min-w-[220px]">
                  {editStates[file.id]?.isEditing ? (
                    <div className="flex items-center gap-2">
                      <Select 
                        defaultValue={editStates[file.id].newLocation || file.suggestedLocation || ""}
                        onValueChange={(value) => handleLocationChange(file.id, file.suggestedLocation || "", value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {PLACEMENT_OPTIONS.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="icon" 
                        variant="ghost"
                        onClick={() => saveLocationChange(file.id)}
                        disabled={updatePlacementMutation.isPending}
                      >
                        {updatePlacementMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="icon" 
                        variant="ghost"
                        onClick={() => cancelEdit(file.id)}
                      >
                        <FileX className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        {file.suggestedLocation ? (
                          <>
                            <span className="text-sm">{file.suggestedLocation}</span>
                            <Button
                              size="icon" 
                              variant="ghost"
                              onClick={() => handleLocationChange(file.id, file.suggestedLocation, file.suggestedLocation)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                              </svg>
                            </Button>
                          </>
                        ) : (
                          <>
                            <span className="text-muted-foreground text-sm">No placement</span>
                            <Button
                              size="icon" 
                              variant="ghost"
                              onClick={() => handleLocationChange(file.id, "", PLACEMENT_OPTIONS[0])}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                              </svg>
                            </Button>
                          </>
                        )}
                      </div>
                      {file.suggestedLocation && (
                        <Badge variant={file.manualOverride ? "outline" : "secondary"} className="text-xs self-start">
                          {file.manualOverride ? "User-defined" : "AI-suggested"}
                        </Badge>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-100">
                    {file.contentType.split('/')[1]?.toUpperCase() || file.contentType}
                  </span>
                </TableCell>
                <TableCell className="text-sm">
                  {formatDistanceToNow(new Date(file.uploadedAt), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-sm text-right">
                  {(file.bytes / 1024).toFixed(0)} KB
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          Showing {files.length} files · Total {files.reduce((sum: number, file: any) => sum + file.credits, 0)} credits used
        </div>
      </CardFooter>
    </Card>
  );
}