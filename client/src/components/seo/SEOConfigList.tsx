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
import { AlertTriangle, CheckCircle, Edit, Eye, Plus, RefreshCw, Trash } from 'lucide-react';
import { fetchAllSeoConfigs } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

type SEOConfig = {
  id: number;
  title: string;
  description: string;
  routePath: string;
  canonical: string | null;
  image: string | null;
  indexable: boolean;
  priority: number | null;
  changeFrequency: string | null;
  createdAt: string;
  updatedAt: string;
  vaultSynced: boolean;
  guardianSynced: boolean;
};

interface SEOConfigListProps {
  onEdit: (config: SEOConfig) => void;
  onPreview: (config: SEOConfig) => void;
  onAddNew: () => void;
  onRefresh: () => void;
}

export function SEOConfigList({ onEdit, onPreview, onAddNew, onRefresh }: SEOConfigListProps) {
  const [configs, setConfigs] = useState<SEOConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllSeoConfigs();
      setConfigs(data);
    } catch (err) {
      setError('Failed to load SEO configurations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadConfigs();
    onRefresh();
  };

  const isConfigStale = (updatedAt: string) => {
    const updatedDate = new Date(updatedAt);
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    return updatedDate < ninetyDaysAgo;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">SEO Configurations</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={onAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add New
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
            A list of all SEO configurations for your website
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Route Path</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[100px]">Updated</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="text-right w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex justify-center">
                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading configurations...</p>
                </TableCell>
              </TableRow>
            ) : configs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-muted-foreground">No SEO configurations found</p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={onAddNew}>
                    Create your first configuration
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              configs.map((config) => (
                <TableRow key={config.id} className={isConfigStale(config.updatedAt) ? "bg-yellow-50 dark:bg-yellow-950/20" : ""}>
                  <TableCell className="font-medium">{config.routePath}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{config.title}</TableCell>
                  <TableCell className="max-w-[300px] truncate">{config.description}</TableCell>
                  <TableCell className="text-sm">
                    {formatDistanceToNow(new Date(config.updatedAt), { addSuffix: true })}
                    {isConfigStale(config.updatedAt) && (
                      <div className="flex items-center gap-1 text-amber-500 mt-1">
                        <AlertTriangle className="h-3 w-3" />
                        <span className="text-xs">Stale</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {config.vaultSynced ? (
                        <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
                          Vault
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-950 dark:text-gray-400 dark:border-gray-800">
                          Local
                        </Badge>
                      )}
                      {config.guardianSynced && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
                          Guardian
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Button size="icon" variant="ghost" onClick={() => onPreview(config)}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Preview</span>
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => onEdit(config)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}