import React from 'react';
import { AdminLayoutV2 } from '@/components/admin-ui/AdminLayout';
import { AdminPageList } from '@/components/admin-ui/AdminPageList';

export default function PageManagementPage() {
  return (
    <AdminLayoutV2 hideHeader>
      <AdminPageList />
    </AdminLayoutV2>
  );
}