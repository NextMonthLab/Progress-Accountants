import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SEOConfigList } from '@/components/seo/SEOConfigList';
import { SEOConfigEditor } from '@/components/seo/SEOConfigEditor';
import { SEOPreview } from '@/components/seo/SEOPreview';
import { SEOPriorityManager } from '@/components/seo/SEOPriorityManager';
import { DocumentHead } from '@/components/DocumentHead';
import { Button } from '@/components/ui/button';
import { ListFilter } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

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

export default function SEOConfigManagerPage() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPriorityManagerOpen, setIsPriorityManagerOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<SEOConfig | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Fetch all SEO configurations for the priority manager
  const { data: seoConfigs = [] } = useQuery<SEOConfig[]>({
    queryKey: ['/api/seo/configs', refreshTrigger],
  });

  const handleEdit = (config: SEOConfig) => {
    setSelectedConfig(config);
    setIsEditorOpen(true);
  };

  const handlePreview = (config: SEOConfig) => {
    setSelectedConfig(config);
    setIsPreviewOpen(true);
  };

  const handleAddNew = () => {
    setSelectedConfig(null);
    setIsEditorOpen(true);
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSaved = () => {
    handleRefresh();
  };

  return (
    <>
      <DocumentHead route="/admin/seo" />
      
      <div className="min-h-screen overflow-y-auto">
        <main className="p-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">SEO Configuration Manager</h1>
              <p className="text-muted-foreground">
                Manage your website's SEO settings for each page
              </p>
            </div>
            <Button 
              onClick={() => setIsPriorityManagerOpen(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ListFilter className="h-4 w-4" />
              Manage Page Priorities
            </Button>
          </div>

          <SEOConfigList
            onEdit={handleEdit}
            onPreview={handlePreview}
            onAddNew={handleAddNew}
            onRefresh={handleRefresh}
            key={refreshTrigger} // Force re-render on refresh
          />

          {isEditorOpen && (
            <SEOConfigEditor
              isOpen={isEditorOpen}
              onClose={() => setIsEditorOpen(false)}
              config={selectedConfig}
              onSaved={handleSaved}
            />
          )}

          {isPreviewOpen && selectedConfig && (
            <SEOPreview
              isOpen={isPreviewOpen}
              onClose={() => setIsPreviewOpen(false)}
              config={selectedConfig}
            />
          )}
          
          {isPriorityManagerOpen && (
            <SEOPriorityManager 
              isOpen={isPriorityManagerOpen}
              configs={seoConfigs.map(config => ({
                id: config.id,
                title: config.title,
                routePath: config.routePath,
                priority: config.priority,
                indexable: config.indexable
              }))}
              onClose={() => {
                setIsPriorityManagerOpen(false);
                handleRefresh(); // Refresh the list after managing priorities
              }}
            />
          )}
        </main>
      </div>
    </>
  );
}