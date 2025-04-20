import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ProgressBanner } from "@/components/ProgressBanner";
import { CompanionConsole } from "@/components/support/CompanionConsole";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <div className="container mx-auto px-4 mb-6">
        <ProgressBanner />
      </div>
      <Footer />
      <CompanionConsole />
    </div>
  );
}
