import { useState } from 'react';
import { SEOConfigList } from '@/components/seo/SEOConfigList';
import { SEOConfigEditor } from '@/components/seo/SEOConfigEditor';
import { SEOPreview } from '@/components/seo/SEOPreview';
import { DocumentHead } from '@/components/DocumentHead';
import AdminLayout from '@/layouts/AdminLayout';

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
  const [selectedConfig, setSelectedConfig] = useState<SEOConfig | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
      
      <AdminLayout title="SEO Configuration Manager">
        <p className="text-muted-foreground mb-8">
          Manage your website's SEO settings for each page
        </p>

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
      </AdminLayout>
    </>
  );
}