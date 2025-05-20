import React, { Suspense } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Loader2 } from 'lucide-react';
import InsightsDashboardContent from '@/components/insights/InsightsDashboardContent';

// Loader component for fallback state
function DashboardLoader() {
  return (
    <div className="flex h-[70vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading insights data...</p>
      </div>
    </div>
  );
}

export default function InsightsDashboardPage() {
  return (
    <AdminLayout>
      <Suspense fallback={<DashboardLoader />}>
        <InsightsDashboardContent />
      </Suspense>
    </AdminLayout>
  );
}