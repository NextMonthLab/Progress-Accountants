import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, PoundSterling, Users, AlertCircle, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { smartFetch } from "@/utils/smartFetch";

interface FinancialSummary {
  totalBalance: number;
  outstanding: number;
  payables: number;
  netPosition: number;
  clientCount: number;
  healthStatus: 'healthy' | 'warning' | 'critical';
}

export default function FinanceSummary() {
  const { data: summary, isLoading, error } = useQuery<FinancialSummary>({
    queryKey: ['/api/finance/:tenantId/summary'],
    queryFn: () => smartFetch('/api/finance/:tenantId/summary'),
  });

  if (isLoading) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Financial Summary</h2>
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Financial Summary</h2>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Unable to load financial data. Please try again later.</p>
          </CardContent>
        </Card>
      </section>
    );
  }
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Financial Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <PoundSterling className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{summary?.totalBalance.toLocaleString() || '---'}</div>
            <p className="text-xs text-muted-foreground">
              Across all business accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">£{summary?.outstanding.toLocaleString() || '---'}</div>
            <p className="text-xs text-muted-foreground">
              Owed from {summary?.clientCount || 0} clients
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payables</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">£{summary?.payables.toLocaleString() || '---'}</div>
            <p className="text-xs text-muted-foreground">
              Owed to suppliers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Position</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">£{summary?.netPosition.toLocaleString() || '---'}</div>
            <p className="text-xs text-muted-foreground">
              {summary?.netPosition && summary.netPosition > 0 ? 'In the black' : 'Requires attention'}
            </p>
            <Badge 
              variant="outline" 
              className={`mt-2 ${
                summary?.healthStatus === 'healthy' ? 'text-green-600 border-green-600' :
                summary?.healthStatus === 'warning' ? 'text-orange-600 border-orange-600' :
                'text-red-600 border-red-600'
              }`}
            >
              {summary?.healthStatus || 'Unknown'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Overview</CardTitle>
          <CardDescription>Your current financial position at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc ml-6 space-y-2 text-sm">
            <li>You have £{summary?.totalBalance.toLocaleString() || '---'} across all business accounts.</li>
            <li>You're owed £{summary?.outstanding.toLocaleString() || '---'} from {summary?.clientCount || 0} clients.</li>
            <li>You owe £{summary?.payables.toLocaleString() || '---'} to suppliers.</li>
            <li>Net position: £{summary?.netPosition.toLocaleString() || '---'} {summary?.netPosition && summary.netPosition > 0 ? 'in the black' : 'needs attention'}.</li>
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}