import { ReactNode } from "react";
import { PoweredBy } from "@/components/PoweredBy";
import { UpgradeBanner } from "@/components/UpgradeBanner";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <UpgradeBanner />
      
      {title && (
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>
      )}
      
      <div className="mb-6">
        {children}
      </div>
      
      <div className="mt-10 py-6">
        <PoweredBy className="mt-4" />
      </div>
    </div>
  );
}