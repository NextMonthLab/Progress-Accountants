import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, CheckCircle, Clock, FileUp, MoreHorizontal, Phone } from "lucide-react";

// Sample data - would be replaced with real data fetched from an API
interface ClientData {
  firstName: string;
  lastName: string;
  businessName: string;
  accountManager: {
    name: string;
    avatar: string;
  };
}

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'overdue' | 'completed';
  type: 'upload' | 'review' | 'action';
}

interface Message {
  id: number;
  sender: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  read: boolean;
}

interface ServiceProgress {
  id: number;
  name: string;
  progress: number;
  nextStep: string;
  dueDate: string;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
}

// Sample client data
const clientData: ClientData = {
  firstName: 'Alex',
  lastName: 'Johnson',
  businessName: 'Harmony Music Productions',
  accountManager: {
    name: 'Sarah Williams',
    avatar: '', // This would be a URL in a real application
  }
};

// Sample tasks
const tasks: Task[] = [
  {
    id: 1,
    title: 'Upload Q4 bank statements',
    description: 'We need your recent bank statements to complete your quarterly reconciliation.',
    dueDate: '2025-04-20',
    status: 'pending',
    type: 'upload'
  },
  {
    id: 2,
    title: 'Review draft VAT return',
    description: 'Your VAT return has been prepared. Please review and approve.',
    dueDate: '2025-04-25',
    status: 'pending',
    type: 'review'
  },
  {
    id: 3,
    title: 'Update business contact details',
    description: 'Please confirm your current business address and phone number.',
    dueDate: '2025-04-15',
    status: 'overdue',
    type: 'action'
  },
  {
    id: 4,
    title: 'Confirm profit projection figures',
    description: 'Review the profit projections for the next quarter.',
    dueDate: '2025-04-30',
    status: 'pending',
    type: 'review'
  }
];

// Sample messages
const messages: Message[] = [
  {
    id: 1,
    sender: {
      name: 'Sarah Williams',
      avatar: '', // This would be a URL in a real application
    },
    content: 'I\'ve reviewed your March transactions and everything looks good. The quarterly report will be ready by Friday.',
    timestamp: '2025-04-12T10:30:00',
    read: false
  },
  {
    id: 2,
    sender: {
      name: 'David Thompson',
      avatar: '', // This would be a URL in a real application
    },
    content: 'Your VAT return has been prepared and is ready for your review. Please check it and let us know if you have any questions.',
    timestamp: '2025-04-10T14:15:00',
    read: true
  },
  {
    id: 3,
    sender: {
      name: 'Lisa Carter',
      avatar: '', // This would be a URL in a real application
    },
    content: 'Just a reminder that we\'ve scheduled your strategy session for next Tuesday at 2 PM. Looking forward to discussing your growth plans!',
    timestamp: '2025-04-08T09:45:00',
    read: true
  }
];

// Sample service progress
const serviceProgress: ServiceProgress[] = [
  {
    id: 1,
    name: 'Corporation Tax Return',
    progress: 85,
    nextStep: 'Final review and submission',
    dueDate: '2025-05-10'
  },
  {
    id: 2,
    name: 'Annual Accounts',
    progress: 60,
    nextStep: 'Draft preparation',
    dueDate: '2025-06-15'
  },
  {
    id: 3,
    name: 'VAT Return',
    progress: 95,
    nextStep: 'Awaiting your approval',
    dueDate: '2025-04-25'
  }
];

// Sample announcements
const announcements: Announcement[] = [
  {
    id: 1,
    title: 'New Tax Legislation',
    content: 'Important changes to business tax rates coming into effect from June 2025. Click to learn how this might affect your business.',
    date: '2025-04-10',
    priority: 'high'
  },
  {
    id: 2,
    title: 'Studio Availability',
    content: 'Our podcast studio has new extended hours. Now available for bookings 7 days a week!',
    date: '2025-04-05',
    priority: 'medium'
  }
];

export default function ClientDashboardPage() {
  // Animation setup for fade-in sections
  const sectionRefs = {
    welcome: useRef<HTMLElement>(null),
    tasks: useRef<HTMLElement>(null),
    messages: useRef<HTMLElement>(null),
    progress: useRef<HTMLElement>(null),
    announcements: useRef<HTMLElement>(null)
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

  // Function to determine if a task is overdue
  const isTaskOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && dueDate !== 'Completed';
  };

  // Function to get the appropriate badge variant based on task status
  const getTaskBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return { variant: "outline" as const, color: 'green' };
      case 'overdue':
        return { variant: "default" as const, color: 'red' };
      default:
        return { variant: "secondary" as const, color: 'orange' };
    }
  };

  return (
    <>
      {/* Welcome Banner Section */}
      <section 
        ref={sectionRefs.welcome}
        className="py-8 md:py-12 fade-in-section" 
        style={{ backgroundColor: 'var(--navy)' }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="text-white">
              <h1 className="font-poppins font-bold text-2xl md:text-4xl mb-2">
                Welcome back, {clientData.firstName}!
              </h1>
              <p className="text-lg text-gray-200">
                {clientData.businessName}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <Button 
                variant="outline" 
                className="mr-2 text-white border-white hover:bg-white hover:text-navy"
              >
                <Phone className="mr-2 h-4 w-4" />
                Request Callback
              </Button>
              <span className="text-white text-sm ml-4">
                Your accountant: <strong>{clientData.accountManager.name}</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Tasks & Messages */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tasks Section */}
            <section ref={sectionRefs.tasks} className="fade-in-section">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-semibold" style={{ color: 'var(--navy)' }}>
                    Your To-Do List
                  </CardTitle>
                  <Badge className="bg-sky-100 text-sky-800">
                    {tasks.filter(task => task.status !== 'completed').length} pending
                  </Badge>
                </CardHeader>
                <CardContent>
                  {tasks.length === 0 ? (
                    <p className="text-center py-6 text-gray-500">
                      You're all caught up! No pending tasks at the moment.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {tasks.map((task) => (
                        <Card key={task.id} className="border-l-4" style={{ borderLeftColor: task.status === 'overdue' ? 'red' : (task.status === 'completed' ? 'green' : 'var(--orange)') }}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium" style={{ color: 'var(--navy)' }}>
                                  {task.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  {task.description}
                                </p>
                                <div className="flex items-center mt-3 text-sm">
                                  <Clock className="h-4 w-4 mr-1 text-gray-500" />
                                  <span className={isTaskOverdue(task.dueDate) && task.status !== 'completed' ? 'text-red-600 font-medium' : 'text-gray-600'}>
                                    Due: {formatDate(task.dueDate)}
                                  </span>
                                  <Badge className="ml-3" 
                                    variant={getTaskBadgeVariant(task.status).variant}
                                    style={{ backgroundColor: task.status === 'overdue' ? 'red' : (task.status === 'completed' ? undefined : 'var(--orange)') }}>
                                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                  </Badge>
                                </div>
                              </div>
                              <div>
                                {task.type === 'upload' ? (
                                  <Button variant="outline" size="sm" className="flex items-center" style={{ color: 'var(--navy)', borderColor: 'var(--navy)' }}>
                                    <FileUp className="h-4 w-4 mr-1" /> Upload
                                  </Button>
                                ) : task.type === 'review' ? (
                                  <Button variant="outline" size="sm" className="flex items-center" style={{ color: 'var(--navy)', borderColor: 'var(--navy)' }}>
                                    Review
                                  </Button>
                                ) : (
                                  <Button variant="outline" size="sm" className="flex items-center" style={{ color: 'var(--navy)', borderColor: 'var(--navy)' }}>
                                    <CheckCircle className="h-4 w-4 mr-1" /> Mark Done
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end border-t px-6 py-4">
                  <Button variant="link" style={{ color: 'var(--navy)' }}>View all tasks</Button>
                </CardFooter>
              </Card>
            </section>
            
            {/* Messages Section */}
            <section ref={sectionRefs.messages} className="fade-in-section">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-semibold" style={{ color: 'var(--navy)' }}>
                    Messages
                  </CardTitle>
                  <Badge className="bg-sky-100 text-sky-800">
                    {messages.filter(msg => !msg.read).length} unread
                  </Badge>
                </CardHeader>
                <CardContent>
                  {messages.length === 0 ? (
                    <p className="text-center py-6 text-gray-500">
                      No messages to display.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`p-4 rounded-lg ${message.read ? 'bg-gray-50' : 'bg-blue-50'} border ${message.read ? 'border-gray-100' : 'border-blue-100'}`}
                        >
                          <div className="flex items-start">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                              <AvatarFallback className="bg-navy text-white">
                                {message.sender.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <h4 className="font-medium" style={{ color: 'var(--navy)' }}>
                                  {message.sender.name}
                                </h4>
                                <span className="text-xs text-gray-500">
                                  {formatTimestamp(message.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">
                                {message.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between border-t px-6 py-4">
                  <Button variant="outline" style={{ borderColor: 'var(--navy)', color: 'var(--navy)' }}>
                    Send Message
                  </Button>
                  <Button variant="link" style={{ color: 'var(--navy)' }}>View all messages</Button>
                </CardFooter>
              </Card>
            </section>
          </div>
          
          {/* Right Column - Service Progress & Announcements */}
          <div className="space-y-6">
            
            {/* Service Progress Section */}
            <section ref={sectionRefs.progress} className="fade-in-section">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold" style={{ color: 'var(--navy)' }}>
                    Service Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {serviceProgress.length === 0 ? (
                    <p className="text-center py-6 text-gray-500">
                      No active services to display.
                    </p>
                  ) : (
                    <div className="space-y-6">
                      {serviceProgress.map((service) => (
                        <div key={service.id} className="space-y-2">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-medium" style={{ color: 'var(--navy)' }}>
                              {service.name}
                            </h4>
                            <span className="text-sm font-medium" style={{ color: 'var(--orange)' }}>
                              {service.progress}%
                            </span>
                          </div>
                          <Progress 
                            value={service.progress} 
                            className="h-2 bg-gray-100" 
                          />
                          <div className="flex justify-between text-xs text-gray-600 mt-1">
                            <span>Next: {service.nextStep}</span>
                            <span>Due: {formatDate(service.dueDate)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button variant="link" style={{ color: 'var(--navy)' }} className="ml-auto">
                    View service details
                  </Button>
                </CardFooter>
              </Card>
            </section>
            
            {/* Announcements Section */}
            <section ref={sectionRefs.announcements} className="fade-in-section">
              <Card>
                <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100">
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-amber-500" />
                    <CardTitle className="text-xl font-semibold" style={{ color: 'var(--navy)' }}>
                      Important Announcements
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {announcements.length === 0 ? (
                    <p className="text-center py-6 text-gray-500">
                      No announcements at this time.
                    </p>
                  ) : (
                    <div className="divide-y">
                      {announcements.map((announcement) => (
                        <div key={announcement.id} className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                          <div className="flex items-start">
                            <div className="flex-1">
                              <div className="flex items-center mb-1">
                                <h4 className="font-medium" style={{ color: 'var(--navy)' }}>
                                  {announcement.title}
                                </h4>
                                {announcement.priority === 'high' && (
                                  <Badge className="ml-2 bg-red-100 text-red-800 border-red-200">
                                    Important
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {announcement.content}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(announcement.date)}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold" style={{ color: 'var(--navy)' }}>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                <Button 
                  className="text-sm h-auto py-3 justify-start"
                  style={{ backgroundColor: 'var(--navy)' }}
                >
                  Book Studio Session
                </Button>
                <Button 
                  className="text-sm h-auto py-3 justify-start"
                  style={{ backgroundColor: 'var(--orange)' }}
                >
                  Schedule Strategy Call
                </Button>
                <Button 
                  variant="outline" 
                  className="text-sm h-auto py-3 justify-start"
                  style={{ borderColor: 'var(--navy)', color: 'var(--navy)' }}
                >
                  Upload Documents
                </Button>
                <Button 
                  variant="outline" 
                  className="text-sm h-auto py-3 justify-start"
                  style={{ borderColor: 'var(--navy)', color: 'var(--navy)' }}
                >
                  Payment Options
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}