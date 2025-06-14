import FinanceSummary from "@/components/client-dashboard/FinanceSummary";
import DocumentChecklist from "@/components/client-dashboard/DocumentChecklist";
import MessageThread from "@/components/client-dashboard/MessageThread";
import UpcomingDeadlines from "@/components/client-dashboard/UpcomingDeadlines";

export default function ClientDashboardPage() {
  return (
    <main className="container py-10 space-y-10">
      <h1 className="text-3xl font-bold">Your Business Dashboard</h1>
      <FinanceSummary />
      <DocumentChecklist />
      <MessageThread />
      <UpcomingDeadlines />
    </main>
  );
}