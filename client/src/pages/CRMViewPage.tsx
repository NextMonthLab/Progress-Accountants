import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  CheckCircle, 
  ChevronDown, 
  Clock, 
  FileText, 
  Filter, 
  MessageSquare, 
  Search, 
  Bell, 
  Calendar, 
  User, 
  FileUp,
  X,
  Clipboard,
  AlertCircle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

// Sample data - would be replaced with data fetched from API
type ServiceType = 'Accounting' | 'Tax' | 'Payroll' | 'VAT' | 'Advisory' | 'PodcastStudio';
type ProgressStage = 'Onboarding' | 'Active' | 'Review' | 'TaxReturn' | 'YearEnd';
type AlertType = 'overdue' | 'message' | 'document' | 'important';

interface AssignedStaff {
  id: number;
  name: string;
  position: string;
  avatar?: string;
  email: string;
}

interface ClientData {
  id: number;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  industry: string;
  assignedStaff: AssignedStaff[];
  services: ServiceType[];
  progressStage: ProgressStage;
  alerts: AlertType[];
  lastContact: string; // ISO date string
  onboardingDate: string; // ISO date string
  tasks: ClientTask[];
  notes: ClientNote[];
  messages: ClientMessage[];
  documents: ClientDocument[];
  serviceStatus: ServiceStatus[];
}

interface ClientTask {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'overdue' | 'completed';
  assignedTo: number; // staff ID
  createdAt: string;
}

interface ClientNote {
  id: number;
  content: string;
  createdBy: number; // staff ID
  createdAt: string;
  isPrivate: boolean;
}

interface ClientMessage {
  id: number;
  sender: {
    id: number;
    name: string;
    isStaff: boolean;
  };
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: {
    name: string;
    url: string;
  }[];
}

interface ClientDocument {
  id: number;
  name: string;
  type: string;
  uploadedBy: number; // staff or client ID
  isStaffUpload: boolean;
  uploadDate: string;
  size: string;
  url: string;
  category: 'Tax' | 'Financial' | 'Legal' | 'Other';
}

interface ServiceStatus {
  serviceType: ServiceType;
  status: 'Not Started' | 'In Progress' | 'Under Review' | 'Complete';
  progress: number;
  nextDeadline?: string;
  notes?: string;
}

// Sample clients data
const clients: ClientData[] = [
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

export default function CRMViewPage() {
  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState<string | null>(null);
  const [serviceFilter, setServiceFilter] = useState<ServiceType | null>(null);
  const [stageFilter, setStageFilter] = useState<ProgressStage | null>(null);
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  const [showClientDetail, setShowClientDetail] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [newNote, setNewNote] = useState('');
  const [newNotePrivate, setNewNotePrivate] = useState(false);

  // Animation setup for fade-in sections
  const sectionRefs = {
    clientList: useRef<HTMLElement>(null),
    filters: useRef<HTMLElement>(null)
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      Object.values(sectionRefs).forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  // Filter clients based on search and filters
  const filteredClients = clients.filter(client => {
    // Search term filter
    const matchesSearch = 
      client.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());

    // Industry filter
    const matchesIndustry = !industryFilter || client.industry === industryFilter;

    // Service filter
    const matchesService = !serviceFilter || client.services.includes(serviceFilter);

    // Stage filter
    const matchesStage = !stageFilter || client.progressStage === stageFilter;

    return matchesSearch && matchesIndustry && matchesService && matchesStage;
  });

  // Create refs to access select components
  const industrySelectRef = useRef<HTMLSelectElement>(null);
  const serviceSelectRef = useRef<HTMLSelectElement>(null);
  const stageSelectRef = useRef<HTMLSelectElement>(null);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setIndustryFilter(null);
    setServiceFilter(null);
    setStageFilter(null);
    
    // Reset selects to default values
    const industrySelect = document.querySelector('[name="industry-select"]') as HTMLSelectElement;
    const serviceSelect = document.querySelector('[name="service-select"]') as HTMLSelectElement;
    const stageSelect = document.querySelector('[name="stage-select"]') as HTMLSelectElement;
    
    // Force rerender of select components
    if (industrySelect) industrySelect.value = "all-industries";
    if (serviceSelect) serviceSelect.value = "all-services";
    if (stageSelect) stageSelect.value = "all-stages";
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Handle opening client detail view
  const handleClientSelect = (client: ClientData) => {
    setSelectedClient(client);
    setShowClientDetail(true);
  };

  // Get service badge color
  const getServiceBadgeColor = (service: ServiceType) => {
    switch(service) {
      case 'Accounting': return { bg: 'bg-blue-100', text: 'text-blue-800' };
      case 'Tax': return { bg: 'bg-purple-100', text: 'text-purple-800' };
      case 'Payroll': return { bg: 'bg-green-100', text: 'text-green-800' };
      case 'VAT': return { bg: 'bg-indigo-100', text: 'text-indigo-800' };
      case 'Advisory': return { bg: 'bg-amber-100', text: 'text-amber-800' };
      case 'PodcastStudio': return { bg: 'bg-red-100', text: 'text-red-800' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800' };
    }
  };

  // Get stage badge color
  const getStageBadgeColor = (stage: ProgressStage) => {
    switch(stage) {
      case 'Onboarding': return { bg: 'bg-sky-100', text: 'text-sky-800', border: 'border-sky-200' };
      case 'Active': return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
      case 'Review': return { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' };
      case 'TaxReturn': return { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' };
      case 'YearEnd': return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    }
  };

  // Get alert icon
  const getAlertIcon = (alertType: AlertType) => {
    switch(alertType) {
      case 'overdue': return <Clock className="h-4 w-4 text-red-500" />;
      case 'message': return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'document': return <FileText className="h-4 w-4 text-green-500" />;
      case 'important': return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default: return null;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Not Started': return 'text-gray-500';
      case 'In Progress': return 'text-blue-500';
      case 'Under Review': return 'text-amber-500';
      case 'Complete': return 'text-green-500';
      case 'overdue': return 'text-red-500';
      case 'pending': return 'text-amber-500';
      case 'completed': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  // Handle adding a new note
  const handleAddNote = () => {
    // This would call an API in a real implementation
    console.log("Adding new note:", { content: newNote, isPrivate: newNotePrivate });
    setNewNote('');
    setNewNotePrivate(false);
  };

  return (
    <>
      {/* Header Section */}
      <section 
        className="py-8 bg-white border-b"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h1 className="font-poppins font-bold text-2xl md:text-3xl mb-2" style={{ color: 'var(--navy)' }}>
                Client Management
              </h1>
              <p className="text-gray-600">
                Manage your client relationships and track service delivery
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button 
                className="mr-2"
                style={{ backgroundColor: 'var(--orange)' }}
              >
                <User className="mr-2 h-4 w-4" />
                Add New Client
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-6">
        {/* Filters and Search */}
        <section ref={sectionRefs.filters} className="mb-6 fade-in-section">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by business, contact, or email..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Select 
                  defaultValue="all-industries"
                  name="industry-select"
                  onValueChange={(value) => setIndustryFilter(value === "all-industries" ? null : value)}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-industries">All Industries</SelectItem>
                    <SelectItem value="Music">Music</SelectItem>
                    <SelectItem value="Film">Film</SelectItem>
                    <SelectItem value="Construction">Construction</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select 
                  defaultValue="all-services"
                  name="service-select"
                  onValueChange={(value) => {
                    if (value === "all-services") {
                      setServiceFilter(null);
                    } else {
                      setServiceFilter(value as ServiceType);
                    }
                  }}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-services">All Services</SelectItem>
                    <SelectItem value="Accounting">Accounting</SelectItem>
                    <SelectItem value="Tax">Tax</SelectItem>
                    <SelectItem value="Payroll">Payroll</SelectItem>
                    <SelectItem value="VAT">VAT</SelectItem>
                    <SelectItem value="Advisory">Advisory</SelectItem>
                    <SelectItem value="PodcastStudio">Podcast Studio</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select 
                  defaultValue="all-stages"
                  name="stage-select"
                  onValueChange={(value) => {
                    if (value === "all-stages") {
                      setStageFilter(null);
                    } else {
                      setStageFilter(value as ProgressStage);
                    }
                  }}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-stages">All Stages</SelectItem>
                    <SelectItem value="Onboarding">Onboarding</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Review">Review</SelectItem>
                    <SelectItem value="TaxReturn">Tax Return</SelectItem>
                    <SelectItem value="YearEnd">Year End</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" onClick={clearFilters} className="flex items-center gap-1">
                  <X className="h-4 w-4" /> Clear
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Client List */}
        <section ref={sectionRefs.clientList} className="fade-in-section">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--navy)' }}>
              Clients ({filteredClients.length})
            </h2>
          </div>

          {filteredClients.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <div className="flex justify-center mb-4">
                <Search className="h-12 w-12 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">No clients found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClients.map((client) => (
                <Card key={client.id} className="hover:shadow-md transition-shadow hover-scale">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg" style={{ color: 'var(--navy)' }}>
                        {client.businessName}
                      </CardTitle>
                      <div className="flex gap-1">
                        {client.alerts.map((alert, index) => (
                          <div key={index} className="tooltip" data-tip={alert.charAt(0).toUpperCase() + alert.slice(1)}>
                            {getAlertIcon(alert)}
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{client.contactName}</p>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="mb-3">
                      <Badge 
                        className={`${getStageBadgeColor(client.progressStage).bg} ${getStageBadgeColor(client.progressStage).text} border ${getStageBadgeColor(client.progressStage).border}`}
                      >
                        {client.progressStage}
                      </Badge>
                    </div>
                    
                    <div className="mb-3 flex flex-wrap gap-1">
                      {client.services.map((service, index) => (
                        <Badge 
                          key={index} 
                          variant="outline"
                          className={`${getServiceBadgeColor(service).bg} ${getServiceBadgeColor(service).text}`}
                        >
                          {service}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <div className="flex -space-x-2 mr-2">
                        {client.assignedStaff.map((staff, index) => (
                          <Avatar key={index} className="h-6 w-6 border-2 border-white">
                            <AvatarFallback className="text-xs" style={{ backgroundColor: 'var(--navy)', color: 'white' }}>
                              {staff.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      {client.assignedStaff.length > 0 && (
                        <span>
                          {client.assignedStaff[0].name}
                          {client.assignedStaff.length > 1 && ` +${client.assignedStaff.length - 1}`}
                        </span>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      <div className="flex justify-between">
                        <span>Last contact:</span>
                        <span>{formatTimestamp(client.lastContact)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      style={{ borderColor: 'var(--navy)', color: 'var(--navy)' }}
                      onClick={() => handleClientSelect(client)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Client Detail Sheet */}
      <Sheet open={showClientDetail} onOpenChange={setShowClientDetail}>
        <SheetContent side="right" className="sm:max-w-xl w-full p-0">
          {selectedClient && (
            <>
              <SheetHeader className="p-6 border-b bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <SheetTitle className="text-xl" style={{ color: 'var(--navy)' }}>
                      {selectedClient.businessName}
                    </SheetTitle>
                    <div className="mt-1">
                      <Badge 
                        className={`${getStageBadgeColor(selectedClient.progressStage).bg} ${getStageBadgeColor(selectedClient.progressStage).text} border ${getStageBadgeColor(selectedClient.progressStage).border}`}
                      >
                        {selectedClient.progressStage}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {selectedClient.alerts.map((alert, index) => (
                      <div key={index}>
                        {getAlertIcon(alert)}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Contact:</span>
                    <span className="ml-2">{selectedClient.contactName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <span className="ml-2">{selectedClient.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Phone:</span>
                    <span className="ml-2">{selectedClient.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Industry:</span>
                    <span className="ml-2">{selectedClient.industry}</span>
                  </div>
                </div>
              </SheetHeader>

              <div className="p-0">
                <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
                  <div className="border-b">
                    <TabsList className="bg-transparent p-0 h-auto flex w-full overflow-auto">
                      <TabsTrigger 
                        value="overview" 
                        className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:shadow-none py-3"
                        style={{ borderColor: 'var(--orange)' }}
                      >
                        Overview
                      </TabsTrigger>
                      <TabsTrigger 
                        value="tasks" 
                        className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:shadow-none py-3"
                        style={{ borderColor: 'var(--orange)' }}
                      >
                        Tasks
                      </TabsTrigger>
                      <TabsTrigger 
                        value="notes" 
                        className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:shadow-none py-3"
                        style={{ borderColor: 'var(--orange)' }}
                      >
                        Notes
                      </TabsTrigger>
                      <TabsTrigger 
                        value="files" 
                        className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:shadow-none py-3"
                        style={{ borderColor: 'var(--orange)' }}
                      >
                        Files
                      </TabsTrigger>
                      <TabsTrigger 
                        value="messages" 
                        className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:shadow-none py-3"
                        style={{ borderColor: 'var(--orange)' }}
                      >
                        Messages
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="p-4 overflow-auto max-h-[calc(100vh-200px)]">
                    {/* Overview Tab */}
                    <TabsContent value="overview" className="px-0 py-2">
                      <div className="space-y-6">
                        {/* Assigned Staff */}
                        <div>
                          <h3 className="text-md font-medium mb-2" style={{ color: 'var(--navy)' }}>
                            Assigned Staff
                          </h3>
                          <div className="space-y-2">
                            {selectedClient.assignedStaff.map((staff) => (
                              <div key={staff.id} className="flex items-center p-2 bg-gray-50 rounded-lg">
                                <Avatar className="h-8 w-8 mr-3">
                                  <AvatarFallback style={{ backgroundColor: 'var(--navy)', color: 'white' }}>
                                    {staff.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{staff.name}</div>
                                  <div className="text-xs text-gray-500">{staff.position}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Service Status */}
                        <div>
                          <h3 className="text-md font-medium mb-2" style={{ color: 'var(--navy)' }}>
                            Service Status
                          </h3>
                          <div className="space-y-3">
                            {selectedClient.serviceStatus.map((service, index) => (
                              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex justify-between mb-1">
                                  <span className="font-medium">{service.serviceType}</span>
                                  <span className={getStatusColor(service.status)}>{service.status}</span>
                                </div>
                                <Progress value={service.progress} className="h-2 mb-2" />
                                <div className="flex justify-between text-xs text-gray-600">
                                  <span>{service.notes}</span>
                                  {service.nextDeadline && (
                                    <span>Due: {formatDate(service.nextDeadline)}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Key Information */}
                        <div>
                          <h3 className="text-md font-medium mb-2" style={{ color: 'var(--navy)' }}>
                            Key Information
                          </h3>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <div className="text-gray-500">Onboarding Date</div>
                                <div>{formatDate(selectedClient.onboardingDate)}</div>
                              </div>
                              <div>
                                <div className="text-gray-500">Last Contact</div>
                                <div>{formatTimestamp(selectedClient.lastContact)}</div>
                              </div>
                              <div className="col-span-2">
                                <div className="text-gray-500">Services</div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {selectedClient.services.map((service, index) => (
                                    <Badge 
                                      key={index} 
                                      variant="outline"
                                      className={`${getServiceBadgeColor(service).bg} ${getServiceBadgeColor(service).text}`}
                                    >
                                      {service}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Recent Activity */}
                        <div>
                          <h3 className="text-md font-medium mb-2" style={{ color: 'var(--navy)' }}>
                            Recent Activity
                          </h3>
                          <div className="space-y-2">
                            {/* Recent Message */}
                            {selectedClient.messages.length > 0 && (
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="text-xs text-gray-500 mb-1">
                                  Latest Message
                                </div>
                                <div className="text-sm">
                                  "{selectedClient.messages[0].content.substring(0, 100)}..."
                                </div>
                                <div className="text-xs text-right mt-1 text-gray-500">
                                  {formatTimestamp(selectedClient.messages[0].timestamp)}
                                </div>
                              </div>
                            )}
                            
                            {/* Recent Task */}
                            {selectedClient.tasks.length > 0 && (
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="text-xs text-gray-500 mb-1">
                                  Latest Task
                                </div>
                                <div className="flex justify-between">
                                  <div className="text-sm font-medium">{selectedClient.tasks[0].title}</div>
                                  <Badge 
                                    variant={selectedClient.tasks[0].status === 'completed' ? 'outline' : 'default'}
                                    className={selectedClient.tasks[0].status === 'overdue' ? 'bg-red-100 text-red-800' : ''}
                                  >
                                    {selectedClient.tasks[0].status.charAt(0).toUpperCase() + selectedClient.tasks[0].status.slice(1)}
                                  </Badge>
                                </div>
                                <div className="text-xs text-right mt-1 text-gray-500">
                                  Due: {formatDate(selectedClient.tasks[0].dueDate)}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Tasks Tab */}
                    <TabsContent value="tasks" className="px-0 py-2">
                      <div className="flex justify-between mb-4">
                        <h3 className="text-lg font-medium" style={{ color: 'var(--navy)' }}>
                          Client Tasks
                        </h3>
                        <Button 
                          size="sm"
                          style={{ backgroundColor: 'var(--navy)' }}
                        >
                          Add Task
                        </Button>
                      </div>
                      
                      {selectedClient.tasks.length === 0 ? (
                        <div className="text-center py-6 bg-gray-50 rounded-lg">
                          <Clipboard className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500">No tasks found for this client</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {selectedClient.tasks.map((task) => (
                            <div key={task.id} className="border p-3 rounded-lg hover:shadow-sm">
                              <div className="flex justify-between mb-1">
                                <h4 className="font-medium">{task.title}</h4>
                                <Badge 
                                  variant={task.status === 'completed' ? 'outline' : 'default'}
                                  className={task.status === 'overdue' ? 'bg-red-100 text-red-800' : ''}
                                >
                                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                              <div className="flex justify-between text-xs">
                                <div className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1 text-gray-400" />
                                  <span className={task.status === 'overdue' ? 'text-red-600' : 'text-gray-500'}>
                                    Due: {formatDate(task.dueDate)}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <span className="text-gray-500">
                                    Assigned to: {selectedClient.assignedStaff.find(staff => staff.id === task.assignedTo)?.name}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    {/* Notes Tab */}
                    <TabsContent value="notes" className="px-0 py-2">
                      <div className="mb-4">
                        <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--navy)' }}>
                          Client Notes
                        </h3>
                        <div className="space-y-2">
                          <Textarea 
                            placeholder="Add a new note about this client..." 
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            className="resize-none"
                          />
                          <div className="flex justify-between">
                            <div className="flex items-center">
                              <input 
                                type="checkbox" 
                                id="privateNote" 
                                checked={newNotePrivate} 
                                onChange={() => setNewNotePrivate(!newNotePrivate)}
                                className="mr-2"
                              />
                              <label htmlFor="privateNote" className="text-sm text-gray-600">
                                Mark as private (staff-only)
                              </label>
                            </div>
                            <Button 
                              onClick={handleAddNote}
                              disabled={!newNote.trim()}
                              style={{ backgroundColor: 'var(--navy)' }}
                            >
                              Add Note
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {selectedClient.notes.length === 0 ? (
                        <div className="text-center py-6 bg-gray-50 rounded-lg">
                          <p className="text-gray-500">No notes found for this client</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {selectedClient.notes.map((note) => (
                            <div key={note.id} className={`p-3 rounded-lg ${note.isPrivate ? 'bg-amber-50 border border-amber-100' : 'bg-gray-50'}`}>
                              <div className="flex justify-between mb-2">
                                <div className="flex items-center">
                                  <Avatar className="h-6 w-6 mr-2">
                                    <AvatarFallback className="text-xs" style={{ backgroundColor: 'var(--navy)', color: 'white' }}>
                                      {selectedClient.assignedStaff.find(staff => staff.id === note.createdBy)?.name.split(' ').map(n => n[0]).join('') || 'UN'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">
                                    {selectedClient.assignedStaff.find(staff => staff.id === note.createdBy)?.name || 'Unknown'}
                                  </span>
                                </div>
                                {note.isPrivate && (
                                  <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                                    Private
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm mb-2">{note.content}</p>
                              <div className="text-xs text-gray-500 text-right">
                                {formatTimestamp(note.createdAt)}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    {/* Files Tab */}
                    <TabsContent value="files" className="px-0 py-2">
                      <div className="flex justify-between mb-4">
                        <h3 className="text-lg font-medium" style={{ color: 'var(--navy)' }}>
                          Client Files
                        </h3>
                        <Button 
                          size="sm"
                          style={{ backgroundColor: 'var(--navy)' }}
                        >
                          <FileUp className="mr-2 h-4 w-4" />
                          Upload File
                        </Button>
                      </div>
                      
                      {selectedClient.documents.length === 0 ? (
                        <div className="text-center py-6 bg-gray-50 rounded-lg">
                          <FileText className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500">No files found for this client</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {selectedClient.documents.map((document) => (
                            <div key={document.id} className="flex justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                              <div className="flex items-center">
                                <div className="mr-3 p-2 bg-blue-100 rounded">
                                  <FileText className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <div className="font-medium">{document.name}</div>
                                  <div className="text-xs text-gray-500">
                                    {document.size} • Uploaded {formatDate(document.uploadDate)}
                                    {document.isStaffUpload ? ' by staff' : ' by client'}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <Badge className="mr-2" variant="outline">
                                  {document.category}
                                </Badge>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    {/* Messages Tab */}
                    <TabsContent value="messages" className="px-0 py-2">
                      <div className="flex justify-between mb-4">
                        <h3 className="text-lg font-medium" style={{ color: 'var(--navy)' }}>
                          Client Messages
                        </h3>
                        <Button 
                          size="sm"
                          style={{ backgroundColor: 'var(--navy)' }}
                        >
                          New Message
                        </Button>
                      </div>
                      
                      {selectedClient.messages.length === 0 ? (
                        <div className="text-center py-6 bg-gray-50 rounded-lg">
                          <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500">No messages found for this client</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {selectedClient.messages.map((message) => (
                            <div 
                              key={message.id} 
                              className={`p-3 rounded-lg ${
                                message.sender.isStaff 
                                  ? 'bg-gray-50 border-l-4 border-l-blue-500' 
                                  : 'bg-blue-50 border-l-4 border-l-orange-500'
                              } ${!message.read && message.sender.isStaff === false ? 'ring-2 ring-blue-200' : ''}`}
                            >
                              <div className="flex justify-between mb-2">
                                <div className="flex items-center">
                                  <Avatar className="h-6 w-6 mr-2">
                                    <AvatarFallback 
                                      className="text-xs" 
                                      style={{ 
                                        backgroundColor: message.sender.isStaff ? 'var(--navy)' : 'var(--orange)', 
                                        color: 'white' 
                                      }}
                                    >
                                      {message.sender.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm font-medium">
                                    {message.sender.name}
                                  </span>
                                </div>
                                {!message.read && message.sender.isStaff === false && (
                                  <Badge className="bg-blue-100 text-blue-800">
                                    Unread
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm mb-2">{message.content}</p>
                              <div className="text-xs text-gray-500 text-right">
                                {formatTimestamp(message.timestamp)}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </div>
                </Tabs>
              </div>

              <SheetFooter className="p-4 border-t bg-gray-50">
                <div className="flex justify-between w-full">
                  <Button 
                    variant="outline"
                    className="flex-1 mr-2"
                    style={{ borderColor: 'var(--navy)', color: 'var(--navy)' }}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule
                  </Button>
                  <Button 
                    className="flex-1"
                    style={{ backgroundColor: 'var(--orange)' }}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact
                  </Button>
                </div>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}