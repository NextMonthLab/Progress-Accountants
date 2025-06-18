import { useEffect, useState } from 'react';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock, Edit, Eye, Plus, RefreshCw, RotateCcw, Trash, Upload } from 'lucide-react';
import { fetchAllBrandVersions, activateBrandVersion, syncBrandVersionWithGuardian, syncBrandVersionWithVault } from '@/lib/api';
import { format, formatDistanceToNow } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

export type BrandVersion = {
  id: number;
  versionNumber: string;
  versionName: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  accentColor: string | null;
  typography: any;
  logoUrl: string | null;
  brandIdentityData: any;
  brandVoiceData: any;
  brandAssets: any;
  isActive: boolean;
  appliedAt: string | null;
  guardianSynced: boolean;
  vaultSynced: boolean;
  createdAt: string;
  updatedAt: string;
};

interface BrandVersionListProps {
  onEdit: (version: BrandVersion) => void;
  onPreview: (version: BrandVersion) => void;
  onAddNew: () => void;
  onRefresh: () => void;
}

export function BrandVersionList({ onEdit, onPreview, onAddNew, onRefresh }: BrandVersionListProps) {
  const [versions, setVersions] = useState<BrandVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [versionToDelete, setVersionToDelete] = useState<number | null>(null);
  const [syncingVersionId, setSyncingVersionId] = useState<number | null>(null);
  const [activatingVersionId, setActivatingVersionId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadVersions();
  }, []);

  const loadVersions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllBrandVersions();
      setVersions(data);
    } catch (err) {
      setError('Failed to load brand versions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadVersions();
    onRefresh();
  };

  const handleActivate = async (id: number) => {
    try {
      setActivatingVersionId(id);
      await activateBrandVersion(id);
      await loadVersions();
      toast({
        title: "Version Activated",
        description: "This brand version is now active across the site",
      });
    } catch (err) {
      toast({
        title: "Activation Failed",
        description: "Unable to activate this brand version",
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setActivatingVersionId(null);
    }
  };

  const handleSyncWithGuardian = async (id: number) => {
    try {
      setSyncingVersionId(id);
      await syncBrandVersionWithGuardian(id);
      await loadVersions();
      toast({
        title: "Guardian Sync Complete",
        description: "Successfully synced with Guardian system",
      });
    } catch (err) {
      toast({
        title: "Guardian Sync Failed",
        description: "Unable to sync with Guardian system",
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setSyncingVersionId(null);
    }
  };

  const handleSyncWithVault = async (id: number) => {
    try {
      setSyncingVersionId(id);
      await syncBrandVersionWithVault(id);
      await loadVersions();
      toast({
        title: "Vault Sync Complete",
        description: "Successfully synced with NextMonth Vault",
      });
    } catch (err) {
      toast({
        title: "Vault Sync Failed",
        description: "Unable to sync with NextMonth Vault",
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setSyncingVersionId(null);
    }
  };

  const confirmDelete = (id: number) => {
    setVersionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!versionToDelete) return;
    
    // Delete code would go here
    // await deleteBrandVersion(versionToDelete);
    
    setDeleteDialogOpen(false);
    await loadVersions();
    toast({
      title: "Version Deleted",
      description: "The brand version has been removed",
    });
  };

  const getBadgeForStatus = (version: BrandVersion) => {
    if (version.isActive) {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-300">
          <CheckCircle className="h-3 w-3 mr-1" /> Active
        </Badge>
      );
    }
    
    return (
      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300">
        <Clock className="h-3 w-3 mr-1" /> Inactive
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Brand Versions</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={onAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            New Version
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/20 p-4 rounded-md text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableCaption>
            A list of all brand versions with their status and creation date
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Version</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Colors</TableHead>
              <TableHead className="w-[120px]">Created</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[100px]">Sync</TableHead>
              <TableHead className="text-right w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex justify-center">
                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading brand versions...</p>
                </TableCell>
              </TableRow>
            ) : versions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-muted-foreground">No brand versions found</p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={onAddNew}>
                    Create your first brand version
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              versions.map((version) => (
                <TableRow key={version.id}>
                  <TableCell className="font-medium">{version.versionNumber}</TableCell>
                  <TableCell>{version.versionName || 'Unnamed'}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {version.primaryColor && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div 
                                className="h-5 w-5 rounded-full border"
                                style={{ backgroundColor: version.primaryColor }}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Primary: {version.primaryColor}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      
                      {version.secondaryColor && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div 
                                className="h-5 w-5 rounded-full border"
                                style={{ backgroundColor: version.secondaryColor }}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Secondary: {version.secondaryColor}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      
                      {version.accentColor && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div 
                                className="h-5 w-5 rounded-full border"
                                style={{ backgroundColor: version.accentColor }}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Accent: {version.accentColor}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    {getBadgeForStatus(version)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-xs">
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${version.guardianSynced ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span>Guardian</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${version.vaultSynced ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span>Vault</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-1">
                      {!version.isActive && (
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => handleActivate(version.id)}
                          disabled={activatingVersionId === version.id}
                        >
                          {activatingVersionId === version.id ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                          <span className="sr-only">Activate</span>
                        </Button>
                      )}
                      
                      <Button size="icon" variant="ghost" onClick={() => onPreview(version)}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Preview</span>
                      </Button>
                      
                      <Button size="icon" variant="ghost" onClick={() => onEdit(version)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      
                      <Button size="icon" variant="ghost" onClick={() => handleSyncWithVault(version.id)} disabled={syncingVersionId === version.id}>
                        {syncingVersionId === version.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                        <span className="sr-only">Sync to Vault</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this brand version.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}