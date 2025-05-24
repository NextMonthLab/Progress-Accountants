// Mock data for development
import { 
  ClientData, 
  ClientDashboardData,
  ActivityLogEntry
} from './types';

// Mock clients for CRM view
export const mockClients: ClientData[] = [
  {
    id: 1,
    businessName: "Harmony Music Productions",
    contactName: "Alex Johnson",
    email: "alex@harmonymusic.com",
    phone: "07700 900123",
    industry: "Music",
    assignedStaff: [
      {
        id: 1,
        name: "Sarah Williams",
        position: "Account Manager",
        email: "sarah@progressaccts.co.uk"
      },
      {
        id: 2,
        name: "James Taylor",
        position: "Tax Specialist",
        email: "james@progressaccts.co.uk"
      }
    ],
    services: ['Accounting', 'Tax', 'Advisory', 'PodcastStudio'],
    progressStage: 'Active',
    alerts: ['message', 'document'],
    lastContact: "2025-04-12T10:30:00",
    onboardingDate: "2024-05-15",
    tasks: [
      {
        id: 1,
        title: "Review Q4 financial reports",
        description: "Complete quarterly financial review and prepare summary for client.",
        dueDate: "2025-04-20",
        status: "pending",
        assignedTo: 1,
        createdAt: "2025-04-01"
      },
      {
        id: 2,
        title: "Chase missing bank statements",
        description: "Need February and March bank statements to complete reconciliation.",
        dueDate: "2025-04-10",
        status: "overdue",
        assignedTo: 1,
        createdAt: "2025-03-25"
      }
    ],
    notes: [
      {
        id: 1,
        content: "Client expressed interest in expanding podcast production services. Potential for increased PodcastStudio bookings.",
        createdBy: 1,
        createdAt: "2025-04-05T11:20:00",
        isPrivate: false
      },
      {
        id: 2,
        content: "Sensitive: Client mentioned cash flow concerns due to delayed payments from major customer. Monitor closely.",
        createdBy: 2,
        createdAt: "2025-03-28T15:45:00",
        isPrivate: true
      }
    ],
    messages: [
      {
        id: 1,
        sender: {
          id: 1,
          name: "Sarah Williams",
          isStaff: true
        },
        content: "I've reviewed your March transactions and everything looks good. The quarterly report will be ready by Friday.",
        timestamp: "2025-04-12T10:30:00",
        read: false
      },
      {
        id: 2,
        sender: {
          id: 101,
          name: "Alex Johnson",
          isStaff: false
        },
        content: "Thanks Sarah. I've also sent through our updated revenue projections for the next quarter.",
        timestamp: "2025-04-11T16:45:00",
        read: true
      }
    ],
    documents: [
      {
        id: 1,
        name: "Q1_2025_Bank_Statements.pdf",
        type: "PDF",
        uploadedBy: 101,
        isStaffUpload: false,
        uploadDate: "2025-04-05",
        size: "2.4 MB",
        url: "#",
        category: "Financial"
      },
      {
        id: 2,
        name: "VAT_Return_Period_3.xlsx",
        type: "XLSX",
        uploadedBy: 1,
        isStaffUpload: true,
        uploadDate: "2025-03-28",
        size: "628 KB",
        url: "#",
        category: "Tax"
      }
    ],
    serviceStatus: [
      {
        serviceType: "Accounting",
        status: "In Progress",
        progress: 75,
        nextDeadline: "2025-05-15",
        notes: "Monthly reconciliation in progress."
      },
      {
        serviceType: "Tax",
        status: "Under Review",
        progress: 90,
        nextDeadline: "2025-04-30",
        notes: "Awaiting final approval before submission."
      },
      {
        serviceType: "Advisory",
        status: "Complete",
        progress: 100,
        notes: "Quarterly advisory session completed on April 5th."
      },
      {
        serviceType: "PodcastStudio",
        status: "Not Started",
        progress: 0,
        nextDeadline: "2025-04-25",
        notes: "Studio session booked for April 25th."
      }
    ]
  },
  {
    id: 2,
    businessName: "Urban Film Collective",
    contactName: "Maya Rodriguez",
    email: "maya@urbanfilmco.com",
    phone: "07700 900456",
    industry: "Film",
    assignedStaff: [
      {
        id: 3,
        name: "David Thompson",
        position: "Senior Accountant",
        email: "david@progressaccts.co.uk"
      }
    ],
    services: ['Accounting', 'Tax', 'Payroll', 'VAT'],
    progressStage: 'TaxReturn',
    alerts: ['overdue', 'important'],
    lastContact: "2025-04-03T14:15:00",
    onboardingDate: "2024-01-10",
    tasks: [
      {
        id: 3,
        title: "Complete Corporation Tax Return",
        description: "Finalize and submit CT600 before deadline.",
        dueDate: "2025-04-30",
        status: "pending",
        assignedTo: 3,
        createdAt: "2025-03-15"
      },
      {
        id: 4,
        title: "Process payroll for freelance staff",
        description: "Process monthly payments for 12 freelance crew members.",
        dueDate: "2025-04-28",
        status: "pending",
        assignedTo: 3,
        createdAt: "2025-04-01"
      }
    ],
    notes: [
      {
        id: 3,
        content: "Production company operates across multiple projects with different funding streams. Complex accounting structure in place.",
        createdBy: 3,
        createdAt: "2025-03-20T09:00:00",
        isPrivate: false
      }
    ],
    messages: [
      {
        id: 3,
        sender: {
          id: 3,
          name: "David Thompson",
          isStaff: true
        },
        content: "Your tax return is in final preparation. Please send the signed director's approval form as soon as possible.",
        timestamp: "2025-04-03T14:15:00",
        read: true
      }
    ],
    documents: [
      {
        id: 3,
        name: "Production_Costs_Q1_2025.xlsx",
        type: "XLSX",
        uploadedBy: 102,
        isStaffUpload: false,
        uploadDate: "2025-03-28",
        size: "1.8 MB",
        url: "#",
        category: "Financial"
      }
    ],
    serviceStatus: [
      {
        serviceType: "Accounting",
        status: "In Progress",
        progress: 65,
        nextDeadline: "2025-05-10",
        notes: "Quarterly management accounts in preparation."
      },
      {
        serviceType: "Tax",
        status: "In Progress",
        progress: 80,
        nextDeadline: "2025-04-30",
        notes: "Corporation tax return nearly complete."
      },
      {
        serviceType: "Payroll",
        status: "In Progress",
        progress: 50,
        nextDeadline: "2025-04-28",
        notes: "Monthly payroll processing underway."
      },
      {
        serviceType: "VAT",
        status: "Complete",
        progress: 100,
        notes: "VAT return submitted on April 1st."
      }
    ]
  },
  {
    id: 3,
    businessName: "Solid Structures Construction",
    contactName: "Tom Wilson",
    email: "tom@solidstructures.com",
    phone: "07700 900789",
    industry: "Construction",
    assignedStaff: [
      {
        id: 4,
        name: "Lisa Carter",
        position: "Construction Specialist",
        email: "lisa@progressaccts.co.uk"
      }
    ],
    services: ['Accounting', 'Tax', 'VAT'],
    progressStage: 'YearEnd',
    alerts: [],
    lastContact: "2025-04-08T09:45:00",
    onboardingDate: "2023-11-01",
    tasks: [
      {
        id: 5,
        title: "Prepare year-end accounts",
        description: "Finalize year-end accounts and prepare for filing.",
        dueDate: "2025-05-15",
        status: "pending",
        assignedTo: 4,
        createdAt: "2025-04-01"
      }
    ],
    notes: [
      {
        id: 4,
        content: "Client operates under Construction Industry Scheme. Special VAT treatment required for certain projects.",
        createdBy: 4,
        createdAt: "2025-02-12T11:30:00",
        isPrivate: false
      }
    ],
    messages: [
      {
        id: 4,
        sender: {
          id: 4,
          name: "Lisa Carter",
          isStaff: true
        },
        content: "Your year-end accounts preparation is underway. We've scheduled a review meeting for April 20th.",
        timestamp: "2025-04-08T09:45:00",
        read: true
      }
    ],
    documents: [
      {
        id: 4,
        name: "Project_Costs_Summary_2024-25.pdf",
        type: "PDF",
        uploadedBy: 4,
        isStaffUpload: true,
        uploadDate: "2025-04-02",
        size: "3.1 MB",
        url: "#",
        category: "Financial"
      }
    ],
    serviceStatus: [
      {
        serviceType: "Accounting",
        status: "In Progress",
        progress: 60,
        nextDeadline: "2025-05-15",
        notes: "Year-end accounts in preparation."
      },
      {
        serviceType: "Tax",
        status: "Not Started",
        progress: 0,
        nextDeadline: "2025-06-30",
        notes: "Pending completion of year-end accounts."
      },
      {
        serviceType: "VAT",
        status: "Under Review",
        progress: 85,
        nextDeadline: "2025-04-30",
        notes: "VAT return for Q1 under review."
      }
    ]
  }
];

// Mock data for client dashboard
export const mockClientDashboard: ClientDashboardData = {
  client: {
    id: 1,
    firstName: "Alex",
    lastName: "Johnson",
    businessName: "Harmony Music Productions",
    accountManager: {
      name: "Sarah Williams",
      avatar: ""
    }
  },
  tasks: [
    {
      id: 101,
      title: "Upload March bank statements",
      description: "Please upload your March bank statements for reconciliation.",
      dueDate: "2025-04-15",
      status: "pending",
      assignedTo: 101, // client ID
      createdAt: "2025-04-01"
    },
    {
      id: 102,
      title: "Review draft tax return",
      description: "Please review the draft tax return we've prepared for you.",
      dueDate: "2025-04-20",
      status: "pending",
      assignedTo: 101,
      createdAt: "2025-04-05"
    },
    {
      id: 103,
      title: "Sign director's approval form",
      description: "Sign and return the director's approval form for filing.",
      dueDate: "2025-04-08",
      status: "overdue",
      assignedTo: 101,
      createdAt: "2025-03-25"
    },
    {
      id: 104,
      title: "Approve quarterly accounts",
      description: "Review and approve the Q1 2025 accounts.",
      dueDate: "2025-04-12",
      status: "completed",
      assignedTo: 101,
      createdAt: "2025-03-30"
    }
  ],
  messages: [
    {
      id: 201,
      sender: {
        id: 1,
        name: "Sarah Williams",
        isStaff: true
      },
      content: "Hi Alex, I've reviewed your March transactions and everything looks good. The quarterly report will be ready by Friday.",
      timestamp: "2025-04-12T10:30:00",
      read: false
    },
    {
      id: 202,
      sender: {
        id: 2,
        name: "James Taylor",
        isStaff: true
      },
      content: "Your tax return is ready for review. Please check it and let me know if you have any questions.",
      timestamp: "2025-04-10T15:20:00",
      read: true
    },
    {
      id: 203,
      sender: {
        id: 101,
        name: "Alex Johnson",
        isStaff: false
      },
      content: "Thanks Sarah. I've also sent through our updated revenue projections for the next quarter.",
      timestamp: "2025-04-11T16:45:00",
      read: true
    }
  ],
  serviceProgress: [
    {
      id: 301,
      name: "Accounting",
      progress: 75,
      nextStep: "Monthly reconciliation",
      dueDate: "2025-05-15"
    },
    {
      id: 302,
      name: "Tax",
      progress: 90,
      nextStep: "Review and approval",
      dueDate: "2025-04-30"
    },
    {
      id: 303,
      name: "Advisory",
      progress: 100,
      nextStep: "Complete for this quarter",
      dueDate: "2025-07-05"
    },
    {
      id: 304,
      name: "PodcastStudio",
      progress: 0,
      nextStep: "Upcoming session",
      dueDate: "2025-04-25"
    }
  ],
  announcements: [
    {
      id: 401,
      title: "Tax Deadline Approaching",
      content: "The deadline for filing your tax return is April 30, 2025. Please ensure all documents are submitted by April 20 to allow time for processing.",
      date: "2025-04-01",
      priority: "high"
    },
    {
      id: 402,
      title: "New Podcast Studio Features",
      content: "We've added new equipment to our podcast studio, including 4K video recording capabilities. Book your session now to take advantage of these new features.",
      date: "2025-03-25",
      priority: "medium"
    },
    {
      id: 403,
      title: "Easter Holiday Hours",
      content: "Our office will be closed on April 18 and 21 for the Easter holiday. For urgent matters, please contact your account manager directly.",
      date: "2025-04-05",
      priority: "low"
    }
  ]
};

// Mock activity log
export const mockActivityLog: ActivityLogEntry[] = [
  {
    id: 1,
    userId: 1, // Sarah Williams
    userType: 'staff',
    actionType: 'update',
    entityType: 'task',
    entityId: 1,
    description: 'Updated task "Review Q4 financial reports" status',
    timestamp: '2025-04-13T09:15:00',
    metadata: { status: 'pending', previousStatus: 'pending' }
  },
  {
    id: 2,
    userId: 101, // Alex Johnson
    userType: 'client',
    actionType: 'view',
    entityType: 'document',
    entityId: 2,
    description: 'Viewed document "VAT_Return_Period_3.xlsx"',
    timestamp: '2025-04-12T14:30:00'
  },
  {
    id: 3,
    userId: 2, // James Taylor
    userType: 'staff',
    actionType: 'create',
    entityType: 'note',
    entityId: 2,
    description: 'Created new note for Harmony Music Productions',
    timestamp: '2025-03-28T15:45:00'
  },
  {
    id: 4,
    userId: 101, // Alex Johnson
    userType: 'client',
    actionType: 'upload',
    entityType: 'document',
    entityId: 1,
    description: 'Uploaded document "Q1_2025_Bank_Statements.pdf"',
    timestamp: '2025-04-05T11:05:00'
  },
  {
    id: 5,
    userId: 1, // Sarah Williams
    userType: 'staff',
    actionType: 'message',
    entityType: 'message',
    entityId: 1,
    description: 'Sent message to Alex Johnson',
    timestamp: '2025-04-12T10:30:00'
  },
  {
    id: 6,
    userId: 3, // David Thompson
    userType: 'staff',
    actionType: 'update',
    entityType: 'service',
    entityId: 2,
    description: 'Updated service status for Urban Film Collective Tax Return',
    timestamp: '2025-04-10T16:20:00',
    metadata: { progress: 80, previousProgress: 75 }
  },
  {
    id: 7,
    userId: 102, // Maya Rodriguez
    userType: 'client',
    actionType: 'login',
    entityType: 'system',
    description: 'Logged into client portal',
    timestamp: '2025-04-09T10:05:00'
  },
  {
    id: 8,
    userId: 4, // Lisa Carter
    userType: 'staff',
    actionType: 'create',
    entityType: 'task',
    entityId: 5,
    description: 'Created task "Prepare year-end accounts" for Solid Structures Construction',
    timestamp: '2025-04-01T09:10:00'
  },
  {
    id: 9,
    userId: 101, // Alex Johnson
    userType: 'client',
    actionType: 'complete',
    entityType: 'task',
    entityId: 104,
    description: 'Completed task "Approve quarterly accounts"',
    timestamp: '2025-04-11T13:45:00'
  },
  {
    id: 10,
    userId: 2, // James Taylor
    userType: 'staff',
    actionType: 'download',
    entityType: 'document',
    entityId: 1,
    description: 'Downloaded document "Q1_2025_Bank_Statements.pdf"',
    timestamp: '2025-04-06T14:15:00'
  }
];