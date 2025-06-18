import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Image as ImageIcon, Upload, Link as LinkIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface MediaSelectorProps {
  currentImageUrl?: string;
  onImageSelected: (url: string) => void;
  businessId: string;
}

export default function MediaSelector({ currentImageUrl, onImageSelected, businessId }: MediaSelectorProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('upload');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [externalUrl, setExternalUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch user's media uploads
  const { data: mediaUploads = [], refetch: refetchMedia } = useQuery({
    queryKey: ['/api/media/uploads', businessId],
    enabled: open && tab === 'library',
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Maximum file size is 5MB',
        variant: 'destructive',
      });
      return;
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('businessId', businessId);
    
    try {
      setUploadProgress(10);
      
      // Upload file
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });
      
      setUploadProgress(90);
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const data = await response.json();
      setUploadProgress(100);
      
      // Notify success
      toast({
        title: 'Upload Successful',
        description: 'Your image has been uploaded',
      });
      
      // Select the uploaded image
      onImageSelected(data.url);
      
      // Refresh media library
      refetchMedia();
      
      // Close dialog
      setOpen(false);
      
      // Reset progress
      setTimeout(() => setUploadProgress(0), 500);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload Failed',
        description: 'There was an error uploading your image',
        variant: 'destructive',
      });
      setUploadProgress(0);
    }
  };

  const handleExternalUrl = () => {
    if (!externalUrl.trim()) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid URL',
        variant: 'destructive',
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(externalUrl);
    } catch (e) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid URL starting with http:// or https://',
        variant: 'destructive',
      });
      return;
    }

    // Select the external URL
    onImageSelected(externalUrl);
    
    // Close dialog
    setOpen(false);
  };

  const selectFromLibrary = (url: string) => {
    onImageSelected(url);
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      {currentImageUrl ? (
        <div className="relative border rounded-md overflow-hidden">
          <img 
            src={currentImageUrl} 
            alt="Selected media" 
            className="w-full max-h-[200px] object-cover"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button variant="outline" onClick={() => setOpen(true)}>
              Change Image
            </Button>
          </div>
        </div>
      ) : (
        <Button onClick={() => setOpen(true)} variant="outline" className="w-full h-32 flex flex-col gap-2">
          <ImageIcon className="h-6 w-6" />
          <span>Select Image</span>
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Select Media</DialogTitle>
            <DialogDescription>
              Choose an image from your library, upload a new one, or use an external URL.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid grid-cols-3 w-full mb-4">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="library">Media Library</TabsTrigger>
              <TabsTrigger value="external">External URL</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-4">
              <div className="grid w-full items-center gap-4">
                <Input 
                  id="file-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleUpload}
                  ref={fileInputRef}
                />
                <Button 
                  variant="outline" 
                  className="h-32 border-dashed w-full flex flex-col gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-6 w-6" />
                  <span>Click to upload an image</span>
                </Button>
                
                {uploadProgress > 0 && (
                  <div className="w-full bg-secondary rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="library" className="space-y-4">
              {mediaUploads.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {mediaUploads.map((item: any) => (
                    <div 
                      key={item.id} 
                      className="border rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => selectFromLibrary(item.url)}
                    >
                      <img 
                        src={item.url} 
                        alt={item.filename} 
                        className="w-full h-20 object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ImageIcon className="mx-auto h-12 w-12 mb-2" />
                  <p>No media uploads yet</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="external" className="space-y-4">
              <div className="grid w-full items-center gap-4">
                <Label htmlFor="external-url">External Image URL</Label>
                <div className="flex gap-2">
                  <Input 
                    id="external-url" 
                    placeholder="https://example.com/image.jpg" 
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                  />
                  <Button onClick={handleExternalUrl}>
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Use
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}