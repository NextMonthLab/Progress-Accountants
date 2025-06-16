import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, AlertTriangle, CheckCircle, Plus, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { smartFetchJson } from "@/lib/fetch-wrapper";

interface Deadline {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  daysUntil: number;
  priority: "urgent" | "high" | "medium" | "low";
  category: string;
  status: "pending" | "in-progress" | "completed";
}

interface DeadlineSummary {
  urgentCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  totalCount: number;
}

export default function UpcomingDeadlines() {
  const { data: deadlines, isLoading: deadlinesLoading, error: deadlinesError } = useQuery<Deadline[]>({
    queryKey: ['/api/finance/:tenantId/deadlines'],
    queryFn: () => smartFetchJson('/api/finance/:tenantId/deadlines', { requiresAuth: true }),
  });

  const { data: summary } = useQuery<DeadlineSummary>({
    queryKey: ['/api/finance/:tenantId/deadlines/summary'],
    queryFn: () => smartFetchJson('/api/finance/:tenantId/deadlines/summary', { requiresAuth: true }),
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-600 border-red-600";
      case "high":
        return "text-orange-600 border-orange-600";
      case "medium":
        return "text-blue-600 border-blue-600";
      default:
        return "text-gray-600 border-gray-600";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "high":
        return <Clock className="h-4 w-4 text-orange-600" />;
      default:
        return <Calendar className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    return status === "in-progress" 
      ? <Clock className="h-4 w-4 text-blue-600" />
      : <Calendar className="h-4 w-4 text-gray-600" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (deadlinesLoading) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Upcoming Deadlines</h2>
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </section>
    );
  }

  if (deadlinesError) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Upcoming Deadlines</h2>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Unable to load upcoming deadlines. Please try again later.</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Upcoming Deadlines</h2>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Reminder
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Urgent & High Priority */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Priority Actions
            </CardTitle>
            <CardDescription>Items requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deadlines && deadlines.length > 0 ? (
                deadlines
                  .filter(d => d.priority === "urgent" || d.priority === "high")
                  .map((deadline) => (
                <div key={deadline.id} className="p-3 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{deadline.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{deadline.description}</p>
                    </div>
                    {getPriorityIcon(deadline.priority)}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={getPriorityColor(deadline.priority)}>
                        {deadline.daysUntil} days
                      </Badge>
                      <span className="text-xs text-gray-500">{formatDate(deadline.dueDate)}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* All Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              All Deadlines
            </CardTitle>
            <CardDescription>Complete timeline of upcoming requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {deadlines
                .sort((a, b) => a.daysUntil - b.daysUntil)
                .map((deadline) => (
                <div key={deadline.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(deadline.status)}
                    <div>
                      <p className="font-medium text-sm">{deadline.title}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">{deadline.category}</Badge>
                        <span className="text-xs text-gray-500">{formatDate(deadline.dueDate)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={getPriorityColor(deadline.priority)}>
                      {deadline.daysUntil}d
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">1</p>
              <p className="text-sm text-gray-600">Urgent (≤7 days)</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">1</p>
              <p className="text-sm text-gray-600">High Priority</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">2</p>
              <p className="text-sm text-gray-600">Medium Priority</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">1</p>
              <p className="text-sm text-gray-600">Low Priority</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}