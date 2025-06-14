import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, PoundSterling, Users, AlertCircle } from "lucide-react";

export default function FinanceSummary() {
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
            <div className="text-2xl font-bold">£12,431</div>
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
            <div className="text-2xl font-bold text-green-600">£9,850</div>
            <p className="text-xs text-muted-foreground">
              Owed from 6 clients
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payables</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">£6,200</div>
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
            <div className="text-2xl font-bold text-blue-600">£3,650</div>
            <p className="text-xs text-muted-foreground">
              In the black
            </p>
            <Badge variant="outline" className="mt-2 text-green-600 border-green-600">
              Healthy
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
            <li>You have £12,431 across all business accounts.</li>
            <li>You're owed £9,850 from 6 clients.</li>
            <li>You owe £6,200 to suppliers.</li>
            <li>Net position: £3,650 in the black.</li>
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}