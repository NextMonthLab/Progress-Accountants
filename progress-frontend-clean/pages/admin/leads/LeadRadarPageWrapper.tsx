import React from 'react';
import { AdminLayoutV2 } from "@/components/admin-ui/AdminLayout";
import LeadRadarPage from './LeadRadarPage';

/**
 * Wrapper for the LeadRadarPage that applies the AdminLayoutV2
 */
export default function LeadRadarPageWrapper() {
  return (
    <AdminLayoutV2 hideHeader>
      <LeadRadarPage />
    </AdminLayoutV2>
  );
}