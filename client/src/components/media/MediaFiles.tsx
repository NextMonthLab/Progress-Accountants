import { useQuery } from '@tanstack/react-query';
import { Loader2, FileX, FileImage, Info } from 'lucide-react';
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

interface MediaFilesProps {
  businessId: string;
}

export default function MediaFiles({ businessId }: MediaFilesProps) {
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
                <TableCell>
                  {file.suggestedLocation ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="inline-flex items-center text-sm">
                          {file.suggestedLocation}
                          <Info className="h-3.5 w-3.5 text-muted-foreground ml-1" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs max-w-xs">
                            This suggestion is based on AI analysis of the image content
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
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