import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { Loader2, Upload } from 'lucide-react';

interface MediaUploaderProps {
  businessId: string;
  onUploadComplete?: (data: any) => void;
}

export default function MediaUploader({ businessId, onUploadComplete }: MediaUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file) {
        throw new Error('No file selected');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('business_id', businessId);
      if (description) {
        formData.append('description', description);
      }

      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Upload successful',
        description: `File uploaded successfully. Used ${data.data.credits} credits.`,
      });
      setFile(null);
      setDescription('');
      if (onUploadComplete) {
        onUploadComplete(data.data);
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    uploadMutation.mutate();
  };

  const fileSize = file ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' : '';
  const estimatedCredits = file ? Math.ceil(file.size / (2 * 1024 * 1024)) : 0;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Upload Media</CardTitle>
        <CardDescription>Upload files to your business account</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Select File</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              disabled={uploadMutation.isPending}
              className="cursor-pointer"
            />
            {file && (
              <p className="text-sm text-muted-foreground">
                {file.name} ({fileSize}) - Estimated credits: {estimatedCredits}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={uploadMutation.isPending}
              placeholder="Enter a description for this file"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            disabled={!file || uploadMutation.isPending}
            className="w-full"
          >
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}