import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Upload, FileText, AlertCircle } from "lucide-react";

export default function DocumentChecklist() {
  const documents = [
    {
      id: 1,
      name: "VAT Return Q4 2024",
      status: "completed",
      dueDate: "31 Jan 2025",
      type: "VAT"
    },
    {
      id: 2,
      name: "Annual Accounts 2024",
      status: "pending",
      dueDate: "31 Mar 2025",
      type: "Accounts"
    },
    {
      id: 3,
      name: "Corporation Tax Return",
      status: "in-progress",
      dueDate: "31 Dec 2025",
      type: "Tax"
    },
    {
      id: 4,
      name: "Payroll Summary December",
      status: "overdue",
      dueDate: "19 Jan 2025",
      type: "Payroll"
    },
    {
      id: 5,
      name: "Expense Receipts January",
      status: "pending",
      dueDate: "15 Feb 2025",
      type: "Expenses"
    }
  ];

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
            {documents.map((doc) => (
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