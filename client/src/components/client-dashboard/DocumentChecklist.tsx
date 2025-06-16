import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Upload, FileText, AlertCircle, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { smartFetchJson } from "@/lib/fetch-wrapper";

interface Document {
  id: number;
  name: string;
  status: 'completed' | 'pending' | 'in-progress' | 'overdue';
  dueDate: string;
  type: string;
}

interface DocumentSummary {
  overdueCount: number;
  dueSoonCount: number;
  totalCount: number;
}

export default function DocumentChecklist() {
  const { data: documents, isLoading: documentsLoading, error: documentsError } = useQuery<Document[]>({
    queryKey: ['/api/finance/:tenantId/documents'],
    queryFn: () => smartFetchJson('/api/finance/:tenantId/documents', { requiresAuth: true }),
  });

  const { data: summary } = useQuery<DocumentSummary>({
    queryKey: ['/api/finance/:tenantId/documents/summary'],
    queryFn: () => smartFetchJson('/api/finance/:tenantId/documents/summary', { requiresAuth: true }),
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="outline" className="text-green-600 border-green-600">Completed</Badge>;
      case "in-progress":
        return <Badge variant="outline" className="text-blue-600 border-blue-600">In Progress</Badge>;
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  if (documentsLoading) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Document Checklist</h2>
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </section>
    );
  }

  if (documentsError) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Document Checklist</h2>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Unable to load document checklist. Please try again later.</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Document Checklist</h2>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Required Documents & Submissions</CardTitle>
          <CardDescription>Track your compliance requirements and deadlines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents?.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(doc.status)}
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Due: {doc.dueDate} • {doc.type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(doc.status)}
                  {doc.status !== "completed" && (
                    <Button variant="outline" size="sm">
                      {doc.status === "pending" ? "Start" : "Continue"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Action Required</p>
                <p className="text-sm text-blue-700 mt-1">
                  You have 1 overdue document and 2 items due within the next 30 days. 
                  Please prioritize these submissions to avoid penalties.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}