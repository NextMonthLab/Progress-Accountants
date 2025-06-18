import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Download, 
  Trash2, 
  Settings, 
  Play, 
  Plus, 
  Info, 
  ArrowRight, 
  Lock, 
  FileSpreadsheet, 
  Calculator, 
  BarChart2, 
  PanelRight
} from 'lucide-react';

interface Tool {
  name: string;
  zone: string;
  tags: string[];
  status: string;
  plugin_zip_url?: string;
  description?: string;
  is_locked?: boolean; // New field to indicate if tool requires installation via Marketplace
}

export default function InstalledToolsPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [zoneFilter, setZoneFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    fetchTools();
  }, []);
  
  async function fetchTools() {
    setIsLoading(true);
    try {
      // In a production environment, we'd fetch from the server
      // For now, using mock data
      const toolsData: Tool[] = [
        {
          name: "Client Intake Form",
          zone: "client_forms",
          tags: ["form", "client", "onboarding"],
          status: "active",
          description: "Standard form for gathering new client information."
        },
        {
          name: "Tax Calculator",
          zone: "calculators",
          tags: ["calculator", "taxes", "estimates"],
          status: "active",
          description: "Interactive calculator for estimating client tax liability."
        },
        {
          name: "Financial Dashboard",
          zone: "dashboards",
          tags: ["dashboard", "financial", "reporting"],
          status: "active",
          description: "Comprehensive dashboard showing financial performance metrics."
        },
        {
          name: "Invoice Generator",
          zone: "forms",
          tags: ["form", "invoicing", "client"],
          status: "inactive",
          description: "Tool for generating professional client invoices."
        },
        {
          name: "Client Survey",
          zone: "client_forms",
          tags: ["form", "feedback", "survey"],
          status: "inactive",
          description: "Satisfaction and feedback survey for clients."
        },
        {
          name: "ROI Calculator",
          zone: "calculators",
          tags: ["calculator", "investment", "planning"],
          status: "active",
          description: "Tool for estimating return on investment scenarios."
        },
        {
          name: "Budget Planning Tool",
          zone: "dashboards",
          tags: ["budget", "planning", "forecasting"],
          status: "active",
          description: "Interactive tool for budget planning and scenario testing."
        },
        {
          name: "Cash Flow Forecast",
          zone: "dashboards",
          tags: ["cash flow", "forecasting", "planning"],
          status: "inactive",
          description: "Visual cash flow forecasting tool with multiple scenarios."
        },
        {
          name: "Enterprise Analytics Dashboard",
          zone: "dashboards",
          tags: ["analytics", "enterprise", "reporting"],
          status: "locked",
          description: "Advanced analytics dashboard for enterprise clients.",
          is_locked: true
        },
        {
          name: "Automated Tax Filing System",
          zone: "automations",
          tags: ["tax", "automation", "filing"],
          status: "locked",
          description: "System for automating routine tax filing processes.",
          is_locked: true
        }
      ];
      
      setTools(toolsData);
    } catch (error) {
      console.error("Error loading tools:", error);
      toast({
        title: "Error",
        description: "Failed to load tools. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  // Filter tools based on search term and dropdowns
  const filteredTools = tools.filter(tool => {
    // Search filter
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      tool.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Zone filter
    const matchesZone = zoneFilter === 'all' || tool.zone === zoneFilter;
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || tool.status === statusFilter;
    
    return matchesSearch && matchesZone && matchesStatus;
  });
  
  // Get unique zones for filter dropdown
  const uniqueZones = Array.from(new Set(tools.map(tool => tool.zone)));
  
  const handleRequestTool = async (tool: Tool) => {
    if (tool.is_locked) {
      toast({
        title: "Tool Locked",
        description: "This tool must be installed from the Marketplace. Redirecting you there now.",
        variant: "default",
      });
      
      // Wait briefly then redirect to marketplace
      setTimeout(() => {
        setLocation('/marketplace');
      }, 1500);
      return;
    }
    
    toast({
      title: "Tool Request Submitted",
      description: `Your request for ${tool.name} has been submitted.`,
      variant: "default",
    });
  };
  
  const renderToolIcon = (zone: string) => {
    switch (zone) {
      case 'client_forms':
      case 'forms':
        return <FileSpreadsheet className="h-5 w-5 text-blue-600" />;
      case 'calculators':
        return <Calculator className="h-5 w-5 text-orange-600" />;
      case 'dashboards':
        return <BarChart2 className="h-5 w-5 text-purple-600" />;
      case 'automations':
        return <PanelRight className="h-5 w-5 text-green-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getToolTypeFromZone = (zone: string): string => {
    switch (zone) {
      case 'client_forms':
      case 'forms':
        return 'Form';
      case 'calculators':
        return 'Calculator';
      case 'dashboards':
        return 'Dashboard';
      case 'automations':
        return 'Automation';
      default:
        return 'Tool';
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Helmet>
        <title>Installed Tools | Progress Accountants</title>
      </Helmet>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--navy)]">Installed Tools</h1>
          <p className="text-gray-600 mt-1">Manage your client-facing and internal tools</p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={() => setLocation('/tools-hub')}
            className="bg-[var(--navy)] hover:bg-[var(--navy)]/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Tool
          </Button>
          <Button 
            onClick={() => setLocation('/marketplace')}
            variant="outline" 
            className="border-[var(--navy)] text-[var(--navy)]"
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            Browse Marketplace
          </Button>
        </div>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Active Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[var(--navy)]">
              {tools.filter(t => t.status === 'active').length}
            </div>
            <p className="text-sm text-gray-500 mt-1">Ready to use</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[var(--navy)]">
              {tools.length}
            </div>
            <p className="text-sm text-gray-500 mt-1">Available on your platform</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Tool Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[var(--navy)]">
              {uniqueZones.length}
            </div>
            <p className="text-sm text-gray-500 mt-1">Different tool types</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Filter controls */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search tools by name, description, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="w-36 md:w-44">
              <Select value={zoneFilter} onValueChange={setZoneFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Zones</SelectItem>
                  {uniqueZones.map(zone => (
                    <SelectItem key={zone} value={zone}>
                      {zone.charAt(0).toUpperCase() + zone.slice(1).replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-36 md:w-44">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="locked">Locked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tools table */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Tool Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTools.length > 0 ? (
                filteredTools.map((tool, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {renderToolIcon(tool.zone)}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {tool.name}
                        {tool.is_locked && (
                          <Lock className="h-3.5 w-3.5 text-purple-500" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500 mt-0.5">{tool.description}</div>
                    </TableCell>
                    <TableCell>
                      {getToolTypeFromZone(tool.zone)}
                    </TableCell>
                    <TableCell>
                      {tool.status === 'active' && (
                        <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
                      )}
                      {tool.status === 'inactive' && (
                        <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">Inactive</Badge>
                      )}
                      {tool.status === 'locked' && (
                        <Badge className="bg-purple-100 text-purple-800 border-purple-200">Locked</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {tool.tags.map((tag, tIndex) => (
                          <Badge key={tIndex} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {tool.status === 'active' ? (
                          <>
                            <Button size="sm" variant="outline">
                              <Play className="h-4 w-4 mr-1" />
                              Launch
                            </Button>
                            <Button size="sm" variant="outline">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </>
                        ) : tool.status === 'locked' ? (
                          <Button 
                            size="sm" 
                            onClick={() => handleRequestTool(tool)}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            Unlock in Marketplace
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            onClick={() => handleRequestTool(tool)}
                            className="bg-[var(--navy)] hover:bg-[var(--navy)]/90"
                          >
                            Activate
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No tools found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}