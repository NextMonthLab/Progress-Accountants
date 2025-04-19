import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import MediaUploader from '@/components/media/MediaUploader';
import MediaUsage from '@/components/media/MediaUsage';
import MediaFiles from '@/components/media/MediaFiles';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/AdminLayout';

export default function MediaManagementPage() {
  const [businessId, setBusinessId] = useState<string>('progress_main');
  const [inputBusinessId, setInputBusinessId] = useState<string>('progress_main');
  const queryClient = useQueryClient();

  const handleUploadComplete = () => {
    // Invalidate cache to refresh media usage stats and files list
    queryClient.invalidateQueries({ queryKey: [`/api/media/usage/${businessId}`] });
    queryClient.invalidateQueries({ queryKey: [`/api/media/files/${businessId}`] });
  };

  const handleBusinessIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputBusinessId(e.target.value);
  };

  const updateBusinessId = () => {
    setBusinessId(inputBusinessId);
  };

  return (
    <AdminLayout title="Media Management">
      <div className="space-y-8">
        <p className="text-muted-foreground mt-2">
          Upload and manage media assets with Cloudinary integration
        </p>

        <div className="flex items-end gap-4 max-w-md">
          <div className="flex-1">
            <Label htmlFor="business-id" className="mb-2 block">Business ID</Label>
            <Input 
              id="business-id" 
              value={inputBusinessId} 
              onChange={handleBusinessIdChange}
              placeholder="Enter business ID"
            />
          </div>
          <Button onClick={updateBusinessId}>Update</Button>
        </div>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList>
            <TabsTrigger value="upload">Upload Media</TabsTrigger>
            <TabsTrigger value="files">Media Files</TabsTrigger>
            <TabsTrigger value="usage">Media Usage</TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className="pt-4">
            <div className="flex justify-center">
              <MediaUploader 
                businessId={businessId} 
                onUploadComplete={handleUploadComplete}
              />
            </div>
          </TabsContent>
          <TabsContent value="files" className="pt-4">
            <div className="max-w-4xl mx-auto">
              <MediaFiles businessId={businessId} />
            </div>
          </TabsContent>
          <TabsContent value="usage" className="pt-4">
            <div className="max-w-2xl mx-auto">
              <MediaUsage businessId={businessId} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}