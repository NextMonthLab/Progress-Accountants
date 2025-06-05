import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import AdminLayout from "@/layouts/AdminLayout";
import { PlusCircle, CheckCircle, ChevronRight, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useTenant } from "@/hooks/use-tenant";
import { Link, useLocation } from "wouter";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(3, {
    message: "Page name must be at least 3 characters.",
  }),
  slug: z.string().min(3, {
    message: "URL slug must be at least 3 characters.",
  }).regex(/^[a-z0-9-]+$/, {
    message: "URL slug can only contain lowercase letters, numbers, and hyphens.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  pageType: z.enum(["standard", "landing", "specialized"]),
  isPublished: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const pageTemplates = [
  {
    id: "standard",
    name: "Standard Page",
    description: "A regular page with header, body sections, and footer",
    icon: <CheckCircle className="h-8 w-8 text-green-500" />,
  },
  {
    id: "landing",
    name: "Landing Page",
    description: "Focused conversion page with clear call-to-action sections",
    icon: <PlusCircle className="h-8 w-8 text-blue-500" />,
  },
  {
    id: "specialized",
    name: "Specialized Page",
    description: "Custom layout for specific purposes like resources or calculators",
    icon: <AlertCircle className="h-8 w-8 text-amber-500" />,
  },
];

export default function CreateNewPagePage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { tenant } = useTenant();
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      pageType: "standard",
      isPublished: false,
    },
  });

  const handleTemplateSelection = (templateId: string) => {
    setSelectedTemplate(templateId);
    form.setValue("pageType", templateId as "standard" | "landing" | "specialized");
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const response = await apiRequest(
        "POST", 
        "/api/pages", 
        {
          ...data,
          tenantId: tenant?.id,
          createdById: user?.id,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create page");
      }

      const newPage = await response.json();
      
      // Invalidate pages cache
      queryClient.invalidateQueries({ queryKey: ["/api/pages"] });
      
      toast({
        title: "Page created successfully!",
        description: "You'll be redirected to set up your new page.",
        variant: "default",
      });
      
      // Redirect to the setup page for the new page
      setTimeout(() => {
        navigate(`/${data.slug}-setup`);
      }, 1500);

    } catch (error: any) {
      toast({
        title: "Failed to create page",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate slug automatically from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  return (
    <AdminLayout>
      <div className="container px-6 py-8">
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <Link href="/foundation-pages" className="hover:text-gray-700">
              Foundation Pages
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span>Create New Page</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Page</h1>
          <p className="text-muted-foreground mt-2">
            Create a custom page for your website by selecting a template and configuring basic settings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Page Templates</CardTitle>
                <CardDescription>
                  Select a template for your new page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {pageTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedTemplate === template.id
                          ? "border-primary bg-primary/5"
                          : "hover:border-gray-400"
                      }`}
                      onClick={() => handleTemplateSelection(template.id)}
                    >
                      <div className="flex justify-center mb-4">
                        {template.icon}
                      </div>
                      <h3 className="font-medium text-center mb-2">
                        {template.name}
                      </h3>
                      <p className="text-sm text-muted-foreground text-center">
                        {template.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Page Configuration</CardTitle>
                <CardDescription>
                  Enter details for your new page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Page Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. FAQ, Pricing, Events"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                // Auto-generate slug if empty
                                if (!form.getValues("slug")) {
                                  form.setValue(
                                    "slug",
                                    generateSlug(e.target.value)
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Name of your page as it will appear in titles
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL Slug</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. faq, pricing, events"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Will be used in the URL: example.com/{field.value || "page-slug"}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe what this page will contain or be used for..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Brief summary of the page for admin reference (not displayed publicly)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pageType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Page Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a page type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="standard">Standard Page</SelectItem>
                              <SelectItem value="landing">Landing Page</SelectItem>
                              <SelectItem value="specialized">Specialized Page</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Determines the page structure and available components
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isPublished"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Publish Page
                            </FormLabel>
                            <FormDescription>
                              Make this page visible to the public immediately
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create Page"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Page Creation Guide</CardTitle>
                <CardDescription>
                  How the page creation process works
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white text-sm mr-3 shrink-0">
                      1
                    </span>
                    <div>
                      <h3 className="font-medium">Select a template</h3>
                      <p className="text-sm text-muted-foreground">
                        Choose a page template that best fits your needs
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white text-sm mr-3 shrink-0">
                      2
                    </span>
                    <div>
                      <h3 className="font-medium">Configure basic settings</h3>
                      <p className="text-sm text-muted-foreground">
                        Name your page and set the URL slug
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white text-sm mr-3 shrink-0">
                      3
                    </span>
                    <div>
                      <h3 className="font-medium">Create and customize</h3>
                      <p className="text-sm text-muted-foreground">
                        After creation, you'll be redirected to set up the page content
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white text-sm mr-3 shrink-0">
                      4
                    </span>
                    <div>
                      <h3 className="font-medium">Publish when ready</h3>
                      <p className="text-sm text-muted-foreground">
                        Make your page live to visitors when you're satisfied with it
                      </p>
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    After creating the page, you'll need to add content blocks and configure SEO
                    settings in the page setup screen.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}