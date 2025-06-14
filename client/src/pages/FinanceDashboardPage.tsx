import { Helmet } from 'react-helmet';
import { useBusinessIdentity } from "@/hooks/use-business-identity";
import FinanceSummary from "@/components/client-dashboard/FinanceSummary";
import DocumentChecklist from "@/components/client-dashboard/DocumentChecklist";
import MessageThread from "@/components/client-dashboard/MessageThread";
import UpcomingDeadlines from "@/components/client-dashboard/UpcomingDeadlines";

export default function FinanceDashboardPage() {
  const { businessIdentity, isLoading } = useBusinessIdentity();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#7B3FE4]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Helmet>
        <title>Client Dashboard - {businessIdentity?.core?.businessName || 'Progress Accountants'}</title>
        <meta name="description" content="Your personal financial dashboard with account summaries, documents, and deadlines." />
      </Helmet>
      
      <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Your Financial Dashboard
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Track your financial progress, manage documents, and stay on top of important deadlines.
            </p>
          </div>
          
          <div className="space-y-12">
            <FinanceSummary />
            <DocumentChecklist />
            <MessageThread />
            <UpcomingDeadlines />
          </div>
        </div>
      </div>
    </div>
  );
}