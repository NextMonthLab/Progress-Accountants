import type { Express, Request, Response } from "express";

export function registerFinanceRoutes(app: Express) {
  
  // Finance Dashboard endpoint
  app.get('/api/finance/:tenantId/dashboard/:clientId', (req: Request, res: Response) => {
    const { tenantId, clientId } = req.params;
    
    const dashboardData = {
      clientId: parseInt(clientId),
      totalRevenue: 147250.50,
      outstandingInvoices: 12450.75,
      overdueAmount: 3200.00,
      cashFlow: 28750.25,
      monthlyGrowth: 8.4,
      recentTransactions: [
        {
          id: 1,
          description: "Invoice Payment - ABC Ltd",
          amount: 5250.00,
          date: "2025-06-14",
          type: "income"
        },
        {
          id: 2,
          description: "Office Rent",
          amount: -2100.00,
          date: "2025-06-13",
          type: "expense"
        },
        {
          id: 3,
          description: "Service Payment - XYZ Corp",
          amount: 3750.50,
          date: "2025-06-12",
          type: "income"
        }
      ],
      monthlyData: [
        { month: "Jan", revenue: 45000, expenses: 32000 },
        { month: "Feb", revenue: 52000, expenses: 34000 },
        { month: "Mar", revenue: 48000, expenses: 31000 },
        { month: "Apr", revenue: 59000, expenses: 38000 },
        { month: "May", revenue: 47000, expenses: 33000 },
        { month: "Jun", revenue: 63500, expenses: 41000 }
      ]
    };
    
    res.json(dashboardData);
  });

  // Finance activity log endpoint
  app.get('/api/finance/:tenantId/activity/:clientId', (req: Request, res: Response) => {
    const { tenantId, clientId } = req.params;
    
    const activityData = [
      {
        id: 1,
        action: "Invoice Generated",
        description: "Invoice #INV-2025-0045 generated for £2,500.00",
        timestamp: "2025-06-16T10:30:00Z",
        category: "billing",
        status: "completed"
      },
      {
        id: 2,
        action: "Payment Received",
        description: "Payment of £1,750.00 received from ABC Limited",
        timestamp: "2025-06-16T09:15:00Z",
        category: "income",
        status: "completed"
      },
      {
        id: 3,
        action: "Expense Recorded",
        description: "Office supplies expense of £150.00 recorded",
        timestamp: "2025-06-15T16:45:00Z",
        category: "expense",
        status: "completed"
      },
      {
        id: 4,
        action: "VAT Return Submitted",
        description: "Q2 2025 VAT return submitted to HMRC",
        timestamp: "2025-06-15T14:20:00Z",
        category: "compliance",
        status: "pending"
      }
    ];
    
    res.json(activityData);
  });

  // Task completion endpoint
  app.post('/api/finance/:tenantId/tasks/:taskId/complete', (req: Request, res: Response) => {
    const { tenantId, taskId } = req.params;
    const { clientId } = req.body;
    
    res.json({
      success: true,
      message: `Task ${taskId} marked as complete`,
      taskId: parseInt(taskId),
      clientId,
      completedAt: new Date().toISOString()
    });
  });

  // Document upload endpoint
  app.post('/api/finance/:tenantId/documents/:clientId', (req: Request, res: Response) => {
    const { tenantId, clientId } = req.params;
    const { file } = req.body;
    
    res.json({
      success: true,
      message: "Document uploaded successfully",
      documentId: Math.floor(Math.random() * 10000),
      fileName: file.name,
      uploadedAt: new Date().toISOString()
    });
  });

  // Document checklist endpoint
  app.get('/api/finance/:tenantId/documents/:clientId', (req: Request, res: Response) => {
    const { tenantId, clientId } = req.params;
    
    const documents = [
      {
        id: 1,
        name: "Annual Accounts 2024",
        status: "completed",
        dueDate: "2025-01-31",
        type: "compliance"
      },
      {
        id: 2,
        name: "Q1 VAT Return",
        status: "completed",
        dueDate: "2025-04-30",
        type: "tax"
      },
      {
        id: 3,
        name: "Q2 Management Accounts",
        status: "in-progress",
        dueDate: "2025-07-15",
        type: "reporting"
      },
      {
        id: 4,
        name: "Corporation Tax Return",
        status: "pending",
        dueDate: "2025-12-31",
        type: "tax"
      },
      {
        id: 5,
        name: "Payroll Submission",
        status: "overdue",
        dueDate: "2025-06-15",
        type: "compliance"
      }
    ];
    
    res.json(documents);
  });
}