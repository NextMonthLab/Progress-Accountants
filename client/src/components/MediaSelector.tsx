import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Image, Upload, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MediaSelectorProps {
  currentImageUrl?: string;
  onImageSelected: (url: string) => void;
  businessId: string;
}

export default function MediaSelector({ currentImageUrl, onImageSelected, businessId }: MediaSelectorProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Fetch existing media assets for the business
  const { data: mediaFiles, isLoading, refetch } = useQuery({
    queryKey: [`/api/media/files/${businessId}`],
    queryFn: async () => {
      const res = await fetch(`/api/media/files/${businessId}`);
      if (!res.ok) throw new Error('Failed to fetch media files');
      return res.json();
    }
  });

  // Handle file selection for upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadingFile(e.target.files[0]);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!uploadingFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', uploadingFile);
    formData.append('business_id', businessId);
    formData.append('description', 'Uploaded from media selector');

    try {
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      toast({
        title: "Upload successful",
        description: "Your file has been uploaded",
      });
      setUploadingFile(null);
      refetch(); // Refresh the media list
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle image selection
  const selectImage = (url: string) => {
    onImageSelected(url);
    setDialogOpen(false);
  };

  // Handle removal of current image
  const removeImage = () => {
    onImageSelected('');
  };

  return (
    <div>
      {currentImageUrl ? (
        <div className="relative mb-2 inline-block">
          <img 
            src={currentImageUrl} 
            alt="Selected media" 
            className="w-32 h-32 object-cover rounded-md border border-border"
          />
          <Button 
            variant="destructive" 
            size="icon" 
            className="absolute -top-2 -right-2 rounded-full w-6 h-6"
            onClick={removeImage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div className="w-32 h-32 border border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50 mb-2">
          <Image className="h-8 w-8 text-gray-400" />
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="mt-2">
            <Image className="h-4 w-4 mr-2" /> 
            {currentImageUrl ? 'Change Image' : 'Select Image'}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Media Library</DialogTitle>
            <DialogDescription>
              Select an existing image or upload a new one
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="browse">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="browse">Browse Library</TabsTrigger>
              <TabsTrigger value="upload">Upload New</TabsTrigger>
            </TabsList>
            
            {/* Browse existing media */}
            <TabsContent value="browse" className="pt-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">Loading media library...</p>
                </div>
              ) : mediaFiles?.data && mediaFiles.data.length > 0 ? (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {mediaFiles.data.map((file: any) => (
                      <div 
                        key={file.id} 
                        className="relative group cursor-pointer border rounded-md overflow-hidden"
                        onClick={() => selectImage(file.publicUrl)}
                      >
                        <img 
                          src={file.publicUrl} 
                          alt={file.fileName}
                          className="w-full h-28 object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="text-white text-xs font-medium px-2 py-1 bg-primary/80 rounded">Select</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">No media files found. Upload one to get started.</p>
                </div>
              )}
            </TabsContent>
            
            {/* Upload new media */}
            <TabsContent value="upload" className="pt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file-upload">Select File</Label>
                  <Input 
                    id="file-upload" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                </div>
                
                {uploadingFile && (
                  <div className="p-4 border rounded-md bg-gray-50">
                    <p className="text-sm font-medium">{uploadingFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(uploadingFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
                
                <Button 
                  className="w-full" 
                  onClick={handleUpload}
                  disabled={!uploadingFile || isUploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? 'Uploading...' : 'Upload File'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}