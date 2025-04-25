import React from "react";
import AdminLayout from "@/layouts/AdminLayout";
import PageBuilderContent from "@/components/page-builder/PageBuilderContent";

const PageBuilderPage: React.FC = () => {
  return (
    <AdminLayout>
      <PageBuilderContent />
    </AdminLayout>
  );
};

export default PageBuilderPage;