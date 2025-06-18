import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Lightbulb, 
  FileText, 
  Palette, 
  BarChart3, 
  Bot, 
  Settings, 
  Code, 
  Mail,
  TrendingUp,
  Activity,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

/**
 * Multi-Tenant Admin Panel
 * Implements Master Unified Account & Business Architecture compliance
 * ALL operations scoped to tenantId with no cross-tenant data leakage
 */

// Form schemas with proper validation
const insightUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address")
});

const insightSchema = z.object({
  content: z.string().min(10, "Content must be at least 10 characters"),
  type: z.string().min(1, "Type is required"),
  submittedBy: z.string().min(1, "Submitted by is required")
});

const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  excerpt: z.string().optional(),
  author: z.string().min(1, "Author is required"),
  category: z.string().min(1, "Category is required"),
  tags: z.string().optional()
});

const themeSchema = z.object({
  name: z.string().min(1, "Theme name is required"),
  primaryColor: z.string().min(4, "Valid color code required"),
  secondaryColor: z.string().min(4, "Valid color code required"),
  fontFamily: z.string().min(1, "Font family is required"),
  logoUrl: z.string().optional(),
  customCss: z.string().optional()
});

const innovationIdeaSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Category is required"),
  priority: z.enum(["low", "medium", "high"]),
  submittedBy: z.string().min(1, "Submitted by is required"),
  estimatedImpact: z.string().min(1, "Estimated impact is required")
});

const toolSchema = z.object({
  name: z.string().min(1, "Tool name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  version: z.string().min(1, "Version is required"),
  createdBy: z.string().min(1, "Created by is required")
});

export default function AdminTenantPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [embedCode, setEmbedCode] = useState("");

  // Dashboard summary query
  const { data: dashboardSummary, isLoading: dashboardLoading } = useQuery({
    queryKey: ["/api/tenant-admin/dashboard/summary"],
    enabled: true
  });

  // Data queries for each section
  const { data: insightUsers } = useQuery({
    queryKey: ["/api/tenant-admin/insight-users"],
    enabled: activeTab === "insight-users"
  });

  const { data: insights } = useQuery({
    queryKey: ["/api/tenant-admin/insights"],
    enabled: activeTab === "insights"
  });

  const { data: blogPosts } = useQuery({
    queryKey: ["/api/tenant-admin/blog-posts"],
    enabled: activeTab === "blog-posts"
  });

  const { data: themes } = useQuery({
    queryKey: ["/api/tenant-admin/themes"],
    enabled: activeTab === "themes"
  });

  const { data: innovationIdeas } = useQuery({
    queryKey: ["/api/tenant-admin/innovation-ideas"],
    enabled: activeTab === "innovation-ideas"
  });

  const { data: analyticsEvents } = useQuery({
    queryKey: ["/api/tenant-admin/analytics-events"],
    enabled: activeTab === "analytics"
  });

  const { data: aiEvents } = useQuery({
    queryKey: ["/api/tenant-admin/ai-events"],
    enabled: activeTab === "ai-events"
  });

  const { data: tools } = useQuery({
    queryKey: ["/api/tenant-admin/tools"],
    enabled: activeTab === "tools"
  });

  // Mutation for inviting insight users
  const inviteInsightUserMutation = useMutation({
    mutationFn: async (data: z.infer<typeof insightUserSchema>) => {
      const res = await apiRequest("POST", "/api/tenant-admin/insight-users/invite", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tenant-admin/insight-users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tenant-admin/dashboard/summary"] });
      toast({ title: "Success", description: "Insight user invited successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Mutation for creating insights
  const createInsightMutation = useMutation({
    mutationFn: async (data: z.infer<typeof insightSchema>) => {
      const res = await apiRequest("POST", "/api/tenant-admin/insights", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tenant-admin/insights"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tenant-admin/dashboard/summary"] });
      toast({ title: "Success", description: "Insight created successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Mutation for creating blog posts
  const createBlogPostMutation = useMutation({
    mutationFn: async (data: z.infer<typeof blogPostSchema>) => {
      const payload = {
        ...data,
        tags: data.tags ? data.tags.split(",").map(tag => tag.trim()) : []
      };
      const res = await apiRequest("POST", "/api/tenant-admin/blog-posts", payload);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tenant-admin/blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tenant-admin/dashboard/summary"] });
      toast({ title: "Success", description: "Blog post created successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Mutation for creating themes
  const createThemeMutation = useMutation({
    mutationFn: async (data: z.infer<typeof themeSchema>) => {
      const res = await apiRequest("POST", "/api/tenant-admin/themes", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tenant-admin/themes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tenant-admin/dashboard/summary"] });
      toast({ title: "Success", description: "Theme created successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Mutation for creating innovation ideas
  const createInnovationIdeaMutation = useMutation({
    mutationFn: async (data: z.infer<typeof innovationIdeaSchema>) => {
      const res = await apiRequest("POST", "/api/tenant-admin/innovation-ideas", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tenant-admin/innovation-ideas"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tenant-admin/dashboard/summary"] });
      toast({ title: "Success", description: "Innovation idea created successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Mutation for creating tools
  const createToolMutation = useMutation({
    mutationFn: async (data: z.infer<typeof toolSchema>) => {
      const payload = {
        ...data,
        configuration: {}
      };
      const res = await apiRequest("POST", "/api/tenant-admin/tools", payload);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tenant-admin/tools"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tenant-admin/dashboard/summary"] });
      toast({ title: "Success", description: "Tool created successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  // Generate embed code
  const generateEmbedCode = async () => {
    try {
      const res = await apiRequest("GET", "/api/tenant-admin/embed-code");
      const data = await res.json();
      setEmbedCode(data.embedCode);
      toast({ title: "Success", description: "Embed code generated successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  // Forms
  const insightUserForm = useForm<z.infer<typeof insightUserSchema>>({
    resolver: zodResolver(insightUserSchema),
    defaultValues: { firstName: "", lastName: "", email: "" }
  });

  const insightForm = useForm<z.infer<typeof insightSchema>>({
    resolver: zodResolver(insightSchema),
    defaultValues: { content: "", type: "", submittedBy: "" }
  });

  const blogPostForm = useForm<z.infer<typeof blogPostSchema>>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: { title: "", content: "", excerpt: "", author: "", category: "", tags: "" }
  });

  const themeForm = useForm<z.infer<typeof themeSchema>>({
    resolver: zodResolver(themeSchema),
    defaultValues: { name: "", primaryColor: "#000000", secondaryColor: "#ffffff", fontFamily: "Inter", logoUrl: "", customCss: "" }
  });

  const innovationIdeaForm = useForm<z.infer<typeof innovationIdeaSchema>>({
    resolver: zodResolver(innovationIdeaSchema),
    defaultValues: { title: "", description: "", category: "", priority: "medium", submittedBy: "", estimatedImpact: "" }
  });

  const toolForm = useForm<z.infer<typeof toolSchema>>({
    resolver: zodResolver(toolSchema),
    defaultValues: { name: "", description: "", category: "", version: "1.0.0", createdBy: "" }
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tenant Admin Panel</h1>
          <p className="text-muted-foreground">
            Multi-tenant administration with full data isolation
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          Tenant ID: {dashboardSummary?.tenantId || "Loading..."}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="insight-users">Insight Users</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="blog-posts">Blog Posts</TabsTrigger>
          <TabsTrigger value="themes">Themes</TabsTrigger>
          <TabsTrigger value="innovation-ideas">Ideas</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="embed">Embed Code</TabsTrigger>
        </TabsList>

        {/* Dashboard Summary */}
        <TabsContent value="dashboard" className="space-y-6">
          {dashboardLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Insights</CardTitle>
                  <Lightbulb className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardSummary?.summary?.insights?.total || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardSummary?.summary?.insights?.pending || 0} pending review
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardSummary?.summary?.blogPosts?.total || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardSummary?.summary?.blogPosts?.published || 0} published
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">AI Events</CardTitle>
                  <Bot className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardSummary?.summary?.aiEvents?.total || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((dashboardSummary?.summary?.aiEvents?.successRate || 0) * 100)}% success rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Insight Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardSummary?.summary?.insightUsers?.total || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardSummary?.summary?.insightUsers?.active || 0} active
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Insight Users Management */}
        <TabsContent value="insight-users" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Insight App Users</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Mail className="h-4 w-4 mr-2" />
                  Invite User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Insight App User</DialogTitle>
                  <DialogDescription>
                    Invite a new user to participate in the Insight App for this tenant.
                  </DialogDescription>
                </DialogHeader>
                <Form {...insightUserForm}>
                  <form onSubmit={insightUserForm.handleSubmit((data) => inviteInsightUserMutation.mutate(data))} className="space-y-4">
                    <FormField
                      control={insightUserForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={insightUserForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={insightUserForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={inviteInsightUserMutation.isPending}>
                      {inviteInsightUserMutation.isPending ? "Inviting..." : "Send Invitation"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {insightUsers?.insightUsers?.map((user: any) => (
              <Card key={user.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{user.firstName} {user.lastName}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Invited: {new Date(user.inviteSentAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <p className="text-sm mt-1">{user.insightCount} insights</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Embed Code Generation */}
        <TabsContent value="embed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Embed Code</CardTitle>
              <CardDescription>
                Generate tenant-scoped embed code for your website integration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={generateEmbedCode}>
                <Code className="h-4 w-4 mr-2" />
                Generate Embed Code
              </Button>
              
              {embedCode && (
                <div className="space-y-2">
                  <Label>Your Embed Code:</Label>
                  <Textarea
                    value={embedCode}
                    readOnly
                    className="font-mono text-sm"
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground">
                    Copy and paste this code into your website's HTML to enable SmartSite features.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Additional tabs would be implemented similarly... */}
        
      </Tabs>
    </div>
  );
}