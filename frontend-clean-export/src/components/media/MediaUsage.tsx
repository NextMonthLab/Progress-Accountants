import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Loader2, FileX, BarChart, Database } from 'lucide-react';

interface MediaUsageProps {
  businessId: string;
}

export default function MediaUsage({ businessId }: MediaUsageProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/media/usage/${businessId}`],
    queryFn: async () => {
      const response = await fetch(`/api/media/usage/${businessId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch media usage');
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
          <p className="text-muted-foreground">Failed to load media usage</p>
        </CardContent>
      </Card>
    );
  }

  const usage = data.data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media Library Usage</CardTitle>
        <CardDescription>Storage usage and credit consumption</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
            <Database className="h-8 w-8 text-primary mb-2" />
            <p className="text-2xl font-bold">{usage.totalFiles}</p>
            <p className="text-sm text-muted-foreground">Total Files</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
            <BarChart className="h-8 w-8 text-primary mb-2" />
            <p className="text-2xl font-bold">{usage.totalCredits}</p>
            <p className="text-sm text-muted-foreground">Credits Used</p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Storage Summary</h3>
          <p className="text-sm text-muted-foreground">
            Your media library has used {usage.totalMB}MB (≈{usage.totalCredits} credits)
          </p>
          
          {Object.keys(usage.breakdown).length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">File Type Breakdown</h4>
              <div className="space-y-2">
                {Object.entries(usage.breakdown).map(([type, typeData]: [string, any]) => (
                  <div key={type} className="flex justify-between text-sm">
                    <span className="capitalize">{type}</span>
                    <span>
                      {typeData.files} files, {(typeData.bytes / (1024 * 1024)).toFixed(2)}MB
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}