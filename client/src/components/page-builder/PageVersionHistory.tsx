import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, History, RotateCcw, Eye, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface Version {
  id: number;
  versionNumber: number;
  status: 'draft' | 'published' | 'archived';
  changeType: string;
  changeDescription?: string;
  createdAt: string;
  createdBy: string;
  creatorId: number;
}

interface VersionHistoryProps {
  entityId: number;
  entityType: 'page' | 'template' | 'component' | 'section';
  isOpen: boolean;
  onClose: () => void;
  onVersionRestore?: (versionId: number) => void;
}

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'published':
      return <Badge className="bg-green-500">Published</Badge>;
    case 'draft':
      return <Badge variant="outline">Draft</Badge>;
    case 'archived':
      return <Badge variant="secondary">Archived</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const ChangeTypeBadge = ({ type }: { type: string }) => {
  switch (type) {
    case 'create':
      return <Badge className="bg-blue-500">Created</Badge>;
    case 'update':
      return <Badge className="bg-amber-500">Updated</Badge>;
    case 'layout':
      return <Badge className="bg-purple-500">Layout</Badge>;
    case 'style':
      return <Badge className="bg-pink-500">Style</Badge>;
    case 'seo':
      return <Badge className="bg-emerald-500">SEO</Badge>;
    case 'publish':
      return <Badge className="bg-green-500">Published</Badge>;
    case 'restore':
      return <Badge className="bg-indigo-500">Restored</Badge>;
    default:
      return <Badge>{type}</Badge>;
  }
};

export function PageVersionHistory({
  entityId,
  entityType,
  isOpen,
  onClose,
  onVersionRestore,
}: VersionHistoryProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('history');
  const [compareFromId, setCompareFromId] = useState<number | null>(null);
  const [compareToId, setCompareToId] = useState<number | null>(null);
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(null);

  // Fetch version history
  const {
    data: versions,
    isLoading,
    error,
  } = useQuery({
    queryKey: [`/api/versions/${entityType}/${entityId}`],
    enabled: isOpen,
  });

  // Fetch version details
  const { data: versionDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: [`/api/versions/version/${selectedVersionId}`],
    enabled: !!selectedVersionId && isOpen,
  });

  // Fetch comparison between two versions
  const { data: comparisonData, isLoading: isLoadingComparison } = useQuery({
    queryKey: [`/api/versions/compare/${compareFromId}/${compareToId}`],
    enabled: !!compareFromId && !!compareToId && isOpen,
  });

  // Mutation to restore a version
  const restoreVersionMutation = useMutation({
    mutationFn: async (versionId: number) => {
      const res = await apiRequest('POST', `/api/versions/restore/${versionId}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/versions/${entityType}/${entityId}`],
      });
      toast({
        title: 'Version restored',
        description: 'The version has been successfully restored.',
      });
      onVersionRestore?.(selectedVersionId!);
    },
    onError: (error) => {
      toast({
        title: 'Failed to restore version',
        description: error.message || 'An error occurred while restoring the version.',
        variant: 'destructive',
      });
    },
  });

  // Mutation to update version status
  const updateVersionStatusMutation = useMutation({
    mutationFn: async ({ versionId, status }: { versionId: number; status: string }) => {
      const res = await apiRequest('PATCH', `/api/versions/${versionId}/status`, { status });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/versions/${entityType}/${entityId}`],
      });
      toast({
        title: 'Status updated',
        description: 'The version status has been successfully updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to update status',
        description: error.message || 'An error occurred while updating the version status.',
        variant: 'destructive',
      });
    },
  });

  // Handle version restore
  const handleRestore = (versionId: number) => {
    if (window.confirm('Are you sure you want to restore this version? This will create a new version with the content from the selected version.')) {
      restoreVersionMutation.mutate(versionId);
    }
  };

  // Handle version publish
  const handlePublish = (versionId: number) => {
    if (window.confirm('Are you sure you want to publish this version? This will make it the live version and archive any previously published version.')) {
      updateVersionStatusMutation.mutate({ versionId, status: 'published' });
    }
  };

  // Prepare versions for dropdowns
  const versionOptions = versions?.map((v: Version) => ({
    value: v.id.toString(),
    label: `v${v.versionNumber} (${format(new Date(v.createdAt), 'MMM d, yyyy h:mm a')})`,
  })) || [];

  // Format JSON for display
  const formatJson = (json: any) => {
    try {
      return JSON.stringify(json, null, 2);
    } catch (e) {
      return 'Unable to format JSON';
    }
  };

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Version History</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <AlertCircle className="h-8 w-8 text-destructive mr-2" />
            <div>
              <h3 className="text-lg font-semibold">Error loading version history</h3>
              <p className="text-muted-foreground">
                {error instanceof Error ? error.message : 'An unknown error occurred'}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <History className="mr-2 h-5 w-5" />
            Version History
          </DialogTitle>
          <DialogDescription>
            View, compare and restore previous versions of this content.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="details">Version Details</TabsTrigger>
            <TabsTrigger value="compare">Compare Versions</TabsTrigger>
          </TabsList>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : versions?.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Version</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Change Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {versions.map((version: Version) => (
                    <TableRow key={version.id}>
                      <TableCell>v{version.versionNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                          {format(new Date(version.createdAt), 'MMM d, yyyy h:mm a')}
                        </div>
                      </TableCell>
                      <TableCell>{version.createdBy}</TableCell>
                      <TableCell>
                        <ChangeTypeBadge type={version.changeType} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={version.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedVersionId(version.id)}
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            View
                          </Button>
                          {version.status !== 'published' && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handlePublish(version.id)}
                            >
                              Publish
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRestore(version.id)}
                          >
                            <RotateCcw className="h-3.5 w-3.5 mr-1" />
                            Restore
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No version history found for this content.
              </div>
            )}
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Select Version</label>
                <Select
                  value={selectedVersionId?.toString() || ''}
                  onValueChange={(value) => setSelectedVersionId(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a version" />
                  </SelectTrigger>
                  <SelectContent>
                    {versionOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedVersionId ? (
                isLoadingDetails ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : versionDetails ? (
                  <div className="border rounded-md p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Version</h3>
                        <p>v{versionDetails.versionNumber}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                        <StatusBadge status={versionDetails.status} />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Change Type</h3>
                        <ChangeTypeBadge type={versionDetails.changeType} />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Created At</h3>
                        <p>{format(new Date(versionDetails.createdAt), 'PPpp')}</p>
                      </div>
                    </div>

                    {versionDetails.changeDescription && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                        <p>{versionDetails.changeDescription}</p>
                      </div>
                    )}

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Content Snapshot</h3>
                      <pre className="bg-muted p-4 rounded-md text-xs overflow-auto mt-2 h-64">
                        {formatJson(versionDetails.snapshot)}
                      </pre>
                    </div>

                    <div className="flex justify-end space-x-2">
                      {versionDetails.status !== 'published' && (
                        <Button
                          variant="default"
                          onClick={() => handlePublish(versionDetails.id)}
                        >
                          Publish This Version
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => handleRestore(versionDetails.id)}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Restore This Version
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Version details not found.
                  </div>
                )
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Select a version to view its details.
                </div>
              )}
            </div>
          </TabsContent>

          {/* Compare Tab */}
          <TabsContent value="compare" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">From Version</label>
                  <Select
                    value={compareFromId?.toString() || ''}
                    onValueChange={(value) => setCompareFromId(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select older version" />
                    </SelectTrigger>
                    <SelectContent>
                      {versionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">To Version</label>
                  <Select
                    value={compareToId?.toString() || ''}
                    onValueChange={(value) => setCompareToId(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select newer version" />
                    </SelectTrigger>
                    <SelectContent>
                      {versionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {compareFromId && compareToId ? (
                isLoadingComparison ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : comparisonData ? (
                  <div className="border rounded-md p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">From Version</h3>
                        <p>v{comparisonData.version1.versionNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(comparisonData.version1.createdAt), 'PPpp')}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">To Version</h3>
                        <p>v{comparisonData.version2.versionNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(comparisonData.version2.createdAt), 'PPpp')}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Differences
                      </h3>
                      <pre className="bg-muted p-4 rounded-md text-xs overflow-auto mt-2 h-64">
                        {formatJson(comparisonData.differences)}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Comparison data not available.
                  </div>
                )
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Select two versions to compare the differences between them.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}