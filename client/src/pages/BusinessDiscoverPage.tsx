import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import AdminLayout from "@/layouts/AdminLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Search,
  Building2,
  ShoppingBag,
  Briefcase,
  Tags,
  Star,
  Filter,
  Clock,
  TrendingUp,
  Users,
  PlusCircle,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

// Define types for the business offerings
type BusinessService = {
  id: number;
  title: string;
  description: string;
  price: string;
  category: string;
  provider: {
    id: number;
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
  };
  createdAt: string;
  featured?: boolean;
};

type BusinessOffer = {
  id: number;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  provider: {
    id: number;
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
  };
  createdAt: string;
  featured?: boolean;
};

type ContractOpportunity = {
  id: number;
  title: string;
  description: string;
  budget: string;
  deadline: string;
  location: string;
  requiredExpertise: string[];
  postedBy: {
    id: number;
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
  };
  createdAt: string;
  featured?: boolean;
};

type AffiliateItem = {
  id: number;
  title: string;
  description: string;
  price: string;
  commission: string;
  image: string;
  provider: {
    id: number;
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
  };
  createdAt: string;
  featured?: boolean;
};

// Define schemas for form validation
const serviceFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.string().min(1, { message: "Price is required" }),
  category: z.string().min(1, { message: "Category is required" })
});

const offerFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  discount: z.string().min(1, { message: "Discount is required" }),
  validUntil: z.string().min(1, { message: "Valid until date is required" })
});

const opportunityFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  budget: z.string().min(1, { message: "Budget is required" }),
  deadline: z.string().min(1, { message: "Deadline is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  requiredExpertise: z.string().min(1, { message: "Required expertise is required" })
});

const affiliateFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.string().min(1, { message: "Price is required" }),
  commission: z.string().min(1, { message: "Commission is required" }),
  image: z.string().optional()
});

// Form components
const ServiceForm = ({ form, onSubmit, isPending }: { form: any, onSubmit: (data: any) => void, isPending: boolean }) => {
  const categories = [
    "Accounting",
    "Tax",
    "Bookkeeping",
    "Payroll",
    "Legal",
    "Financial Planning",
    "Business Consulting",
    "Other"
  ];
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Professional Tax Preparation" {...field} />
              </FormControl>
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
                  placeholder="Comprehensive tax preparation for small businesses with expert consultation included."
                  className="h-24"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="$499" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Submitting..." : "Add Service"}
        </Button>
      </form>
    </Form>
  );
};

const OfferForm = ({ form, onSubmit, isPending }: { form: any, onSubmit: (data: any) => void, isPending: boolean }) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Tax Season Special" {...field} />
              </FormControl>
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
                  placeholder="25% off on all business tax preparation services for new clients."
                  className="h-24"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount</FormLabel>
                <FormControl>
                  <Input placeholder="25% off" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="validUntil"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valid Until</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Submitting..." : "Add Offer"}
        </Button>
      </form>
    </Form>
  );
};

const OpportunityForm = ({ form, onSubmit, isPending }: { form: any, onSubmit: (data: any) => void, isPending: boolean }) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Financial Audit Project" {...field} />
              </FormControl>
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
                  placeholder="Looking for an experienced accountant to conduct a comprehensive financial audit for our manufacturing business."
                  className="h-24"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget</FormLabel>
                <FormControl>
                  <Input placeholder="$3,000-$5,000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deadline</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Remote or Chicago, IL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="requiredExpertise"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Required Expertise</FormLabel>
                <FormControl>
                  <Input placeholder="Audit, Manufacturing, GAAP" {...field} />
                </FormControl>
                <FormDescription>
                  Comma-separated list of skills
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Submitting..." : "Add Opportunity"}
        </Button>
      </form>
    </Form>
  );
};

const AffiliateForm = ({ form, onSubmit, isPending }: { form: any, onSubmit: (data: any) => void, isPending: boolean }) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Cloud Accounting Software" {...field} />
              </FormControl>
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
                  placeholder="Complete accounting solution with invoicing, payroll, and tax management features."
                  className="h-24"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="$499/year" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="commission"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Commission</FormLabel>
                <FormControl>
                  <Input placeholder="20%" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/product-image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Submitting..." : "Add Affiliate Item"}
        </Button>
      </form>
    </Form>
  );
};

export default function BusinessDiscoverPage() {
  const [activeTab, setActiveTab] = useState("services");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [listingType, setListingType] = useState<"service" | "offer" | "opportunity" | "affiliate">("service");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Service form
  const serviceForm = useForm<z.infer<typeof serviceFormSchema>>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      category: ""
    }
  });
  
  // Offer form
  const offerForm = useForm<z.infer<typeof offerFormSchema>>({
    resolver: zodResolver(offerFormSchema),
    defaultValues: {
      title: "",
      description: "",
      discount: "",
      validUntil: ""
    }
  });
  
  // Opportunity form
  const opportunityForm = useForm<z.infer<typeof opportunityFormSchema>>({
    resolver: zodResolver(opportunityFormSchema),
    defaultValues: {
      title: "",
      description: "",
      budget: "",
      deadline: "",
      location: "",
      requiredExpertise: ""
    }
  });
  
  // Affiliate form
  const affiliateForm = useForm<z.infer<typeof affiliateFormSchema>>({
    resolver: zodResolver(affiliateFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      commission: "",
      image: ""
    }
  });
  
  // Create service mutation
  const createServiceMutation = useMutation({
    mutationFn: async (data: z.infer<typeof serviceFormSchema>) => {
      const response = await fetch("/api/business-network/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error("Failed to create service");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Service Created",
        description: "Your service has been successfully registered.",
        variant: "default"
      });
      serviceForm.reset();
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/business-network/services"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "There was an error creating your service.",
        variant: "destructive"
      });
    }
  });
  
  // Create offer mutation
  const createOfferMutation = useMutation({
    mutationFn: async (data: z.infer<typeof offerFormSchema>) => {
      const response = await fetch("/api/business-network/offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error("Failed to create offer");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Offer Created",
        description: "Your offer has been successfully registered.",
        variant: "default"
      });
      offerForm.reset();
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/business-network/offers"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "There was an error creating your offer.",
        variant: "destructive"
      });
    }
  });
  
  // Create opportunity mutation
  const createOpportunityMutation = useMutation({
    mutationFn: async (data: z.infer<typeof opportunityFormSchema>) => {
      // Convert requiredExpertise from string to array
      const formattedData = {
        ...data,
        requiredExpertise: data.requiredExpertise.split(',').map(item => item.trim())
      };
      
      const response = await fetch("/api/business-network/opportunities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formattedData)
      });
      
      if (!response.ok) {
        throw new Error("Failed to create opportunity");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Opportunity Created",
        description: "Your contract opportunity has been successfully registered.",
        variant: "default"
      });
      opportunityForm.reset();
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/business-network/opportunities"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "There was an error creating your opportunity.",
        variant: "destructive"
      });
    }
  });
  
  // Create affiliate item mutation
  const createAffiliateItemMutation = useMutation({
    mutationFn: async (data: z.infer<typeof affiliateFormSchema>) => {
      const response = await fetch("/api/business-network/affiliate-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error("Failed to create affiliate item");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Affiliate Item Created",
        description: "Your affiliate item has been successfully registered.",
        variant: "default"
      });
      affiliateForm.reset();
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/business-network/affiliate-items"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "There was an error creating your affiliate item.",
        variant: "destructive"
      });
    }
  });
  
  // Function to handle form submission based on type
  const handleFormSubmit = (type: string, data: any) => {
    switch (type) {
      case "service":
        createServiceMutation.mutate(data);
        break;
      case "offer":
        createOfferMutation.mutate(data);
        break;
      case "opportunity":
        createOpportunityMutation.mutate(data);
        break;
      case "affiliate":
        createAffiliateItemMutation.mutate(data);
        break;
    }
  };
  
  // Function to open dialog with specific listing type
  const openAddListingDialog = (type: "service" | "offer" | "opportunity" | "affiliate") => {
    setListingType(type);
    setIsDialogOpen(true);
  };

  // Fetch business services
  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/business-network/services"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/business-network/services");
        if (!res.ok) throw new Error("Failed to fetch services");
        return await res.json();
      } catch (error) {
        console.error("Error fetching services:", error);
        return [];
      }
    }
  });

  // Fetch business offers
  const { data: offers, isLoading: offersLoading } = useQuery({
    queryKey: ["/api/business-network/offers"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/business-network/offers");
        if (!res.ok) throw new Error("Failed to fetch offers");
        return await res.json();
      } catch (error) {
        console.error("Error fetching offers:", error);
        return [];
      }
    }
  });

  // Fetch contract opportunities
  const { data: opportunities, isLoading: opportunitiesLoading } = useQuery({
    queryKey: ["/api/business-network/opportunities"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/business-network/opportunities");
        if (!res.ok) throw new Error("Failed to fetch opportunities");
        return await res.json();
      } catch (error) {
        console.error("Error fetching opportunities:", error);
        return [];
      }
    }
  });

  // Fetch affiliate items
  const { data: affiliateItems, isLoading: affiliateItemsLoading } = useQuery({
    queryKey: ["/api/business-network/affiliate-items"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/business-network/affiliate-items");
        if (!res.ok) throw new Error("Failed to fetch affiliate items");
        return await res.json();
      } catch (error) {
        console.error("Error fetching affiliate items:", error);
        return [];
      }
    }
  });

  // Mock data for services (only used if API returns empty)
  const mockServices: BusinessService[] = [
    {
      id: 1,
      title: "Financial Audit & Analysis",
      description: "Comprehensive financial audit with detailed reports and recommendations.",
      price: "$500-$2000",
      category: "Accounting",
      provider: {
        id: 101,
        name: "Financial Experts Ltd",
        avatar: "",
        rating: 4.8,
        reviewCount: 124
      },
      createdAt: "2025-03-15T14:30:00Z",
      featured: true
    },
    {
      id: 2,
      title: "Tax Optimization Consultation",
      description: "Strategic tax planning to minimize liabilities and maximize returns.",
      price: "$300/hour",
      category: "Tax",
      provider: {
        id: 102,
        name: "TaxPro Solutions",
        avatar: "",
        rating: 4.9,
        reviewCount: 89
      },
      createdAt: "2025-04-02T09:15:00Z"
    },
    {
      id: 3,
      title: "Bookkeeping Services",
      description: "Monthly bookkeeping with detailed financial statements and reconciliation.",
      price: "$250/month",
      category: "Bookkeeping",
      provider: {
        id: 103,
        name: "BookSmart Accounting",
        avatar: "",
        rating: 4.7,
        reviewCount: 56
      },
      createdAt: "2025-04-10T11:45:00Z"
    },
    {
      id: 4,
      title: "Payroll Management",
      description: "End-to-end payroll processing, tax filing, and compliance reporting.",
      price: "$350/month",
      category: "Payroll",
      provider: {
        id: 104,
        name: "PayEase Systems",
        avatar: "",
        rating: 4.6,
        reviewCount: 72
      },
      createdAt: "2025-03-28T15:20:00Z"
    },
    {
      id: 5,
      title: "Business Formation Services",
      description: "Complete business registration, legal structure setup, and compliance.",
      price: "$800-$1500",
      category: "Legal",
      provider: {
        id: 105,
        name: "BizStart Partners",
        avatar: "",
        rating: 4.5,
        reviewCount: 43
      },
      createdAt: "2025-04-05T10:30:00Z"
    }
  ];

  // Mock data for offers
  const mockOffers: BusinessOffer[] = [
    {
      id: 1,
      title: "Spring Tax Preparation Special",
      description: "25% off on comprehensive tax preparation services for small businesses.",
      discount: "25% off",
      validUntil: "2025-05-15",
      provider: {
        id: 201,
        name: "TaxMasters Inc",
        avatar: "",
        rating: 4.7,
        reviewCount: 112
      },
      createdAt: "2025-03-10T08:45:00Z",
      featured: true
    },
    {
      id: 2,
      title: "Financial Health Check Package",
      description: "Complete financial analysis plus strategic planning session at discounted rate.",
      discount: "Buy 1 Get 1 Free",
      validUntil: "2025-04-30",
      provider: {
        id: 202,
        name: "FinHealth Advisors",
        avatar: "",
        rating: 4.9,
        reviewCount: 78
      },
      createdAt: "2025-03-25T14:20:00Z"
    },
    {
      id: 3,
      title: "First Month Free Bookkeeping",
      description: "Try our premium bookkeeping services with first month completely free.",
      discount: "First month free",
      validUntil: "2025-05-31",
      provider: {
        id: 203,
        name: "BookPro Services",
        avatar: "",
        rating: 4.6,
        reviewCount: 91
      },
      createdAt: "2025-04-05T11:30:00Z"
    }
  ];

  // Mock data for opportunities
  const mockOpportunities: ContractOpportunity[] = [
    {
      id: 1,
      title: "Annual Audit for Manufacturing Company",
      description: "Looking for a certified accountant to perform comprehensive annual audit for our manufacturing business with 50+ employees.",
      budget: "$5,000-$8,000",
      deadline: "2025-06-30",
      location: "Remote, with 2 on-site visits",
      requiredExpertise: ["Manufacturing", "Audit", "Tax"],
      postedBy: {
        id: 301,
        name: "Precision Manufacturing",
        avatar: "",
        rating: 4.8,
        reviewCount: 23
      },
      createdAt: "2025-04-12T09:15:00Z",
      featured: true
    },
    {
      id: 2,
      title: "Business Valuation Project",
      description: "Need a qualified accountant for business valuation for a potential merger. Confidentiality is crucial.",
      budget: "$3,000-$5,000",
      deadline: "2025-05-20",
      location: "Remote",
      requiredExpertise: ["Valuation", "M&A", "Financial Analysis"],
      postedBy: {
        id: 302,
        name: "Growth Ventures LLC",
        avatar: "",
        rating: 4.7,
        reviewCount: 15
      },
      createdAt: "2025-04-01T15:40:00Z"
    },
    {
      id: 3,
      title: "Tax Strategy for International Expansion",
      description: "Seeking tax expert to develop strategy for our expansion into European markets. Knowledge of EU tax laws required.",
      budget: "$4,000-$7,000",
      deadline: "2025-05-15",
      location: "Remote with flexible hours",
      requiredExpertise: ["International Tax", "EU Regulations", "Business Strategy"],
      postedBy: {
        id: 303,
        name: "GlobalReach Inc",
        avatar: "",
        rating: 4.9,
        reviewCount: 31
      },
      createdAt: "2025-03-28T11:25:00Z"
    }
  ];

  // Mock data for affiliate items
  const mockAffiliateItems: AffiliateItem[] = [
    {
      id: 1,
      title: "QuickBooks Enterprise Solution",
      description: "Complete accounting software package for mid-sized businesses with advanced inventory management.",
      price: "$1,199.99/year",
      commission: "25%",
      image: "",
      provider: {
        id: 401,
        name: "Intuit Solutions",
        avatar: "",
        rating: 4.8,
        reviewCount: 245
      },
      createdAt: "2025-03-05T10:15:00Z",
      featured: true
    },
    {
      id: 2,
      title: "TaxPrep Pro Software",
      description: "Professional tax preparation software with built-in compliance checks and audit defense.",
      price: "$499.99/year",
      commission: "20%",
      image: "",
      provider: {
        id: 402,
        name: "TaxTech Solutions",
        avatar: "",
        rating: 4.6,
        reviewCount: 183
      },
      createdAt: "2025-02-20T14:30:00Z"
    },
    {
      id: 3,
      title: "Financial Document Scanner Plus",
      description: "High-speed document scanner with OCR and direct integration with major accounting software.",
      price: "$349.99",
      commission: "15%",
      image: "",
      provider: {
        id: 403,
        name: "DocuTech International",
        avatar: "",
        rating: 4.5,
        reviewCount: 112
      },
      createdAt: "2025-03-15T09:45:00Z"
    }
  ];

  // Use mock data if API returns empty results
  const displayServices = services?.length > 0 ? services : mockServices;
  const displayOffers = offers?.length > 0 ? offers : mockOffers;
  const displayOpportunities = opportunities?.length > 0 ? opportunities : mockOpportunities;
  const displayAffiliateItems = affiliateItems?.length > 0 ? affiliateItems : mockAffiliateItems;

  // Filter function based on search query and category
  const filterItems = (items: any[], type: string) => {
    return items.filter(item => {
      const matchesSearch = 
        searchQuery === "" || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesCategory = 
        categoryFilter === "all" || 
        (type === "services" && item.category === categoryFilter) ||
        (type === "opportunities" && item.requiredExpertise?.includes(categoryFilter));
        
      return matchesSearch && matchesCategory;
    });
  };

  // Sort function based on selected sort option
  const sortItems = (items: any[]) => {
    return [...items].sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === "rating") {
        return (b.provider?.rating || 0) - (a.provider?.rating || 0);
      }
      return 0;
    });
  };

  // Apply filtering and sorting
  const filteredSortedServices = sortItems(filterItems(displayServices, "services"));
  const filteredSortedOffers = sortItems(filterItems(displayOffers, "offers"));
  const filteredSortedOpportunities = sortItems(filterItems(displayOpportunities, "opportunities"));
  const filteredSortedAffiliateItems = sortItems(filterItems(displayAffiliateItems, "affiliate"));

  // Service categories for filter
  const serviceCategories = [
    "all", "Accounting", "Tax", "Bookkeeping", "Payroll", "Legal", "Consulting", "Audit"
  ];

  // Opportunity categories (expertise areas) for filter
  const opportunityCategories = [
    "all", "Audit", "Tax", "Bookkeeping", "Financial Analysis", "International Tax", 
    "M&A", "Valuation", "Manufacturing", "Business Strategy"
  ];

  // Format date string for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  // Rating stars display component
  const RatingStars = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            size={14}
            className={`${
              star <= rating 
                ? "text-amber-500 fill-amber-500" 
                : star <= rating + 0.5 
                  ? "text-amber-500 fill-amber-500/50" 
                  : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Service card component
  const ServiceCard = ({ service }: { service: BusinessService }) => (
    <Card className={`p-5 h-full flex flex-col ${service.featured ? 'border-orange-300 bg-orange-50/30' : ''}`}>
      {service.featured && (
        <Badge className="mb-2 bg-gradient-to-r from-amber-500 to-orange-500 self-start">
          Featured
        </Badge>
      )}
      <h3 className="text-lg font-semibold">{service.title}</h3>
      <p className="text-gray-600 mt-2 flex-grow">{service.description}</p>
      <div className="flex flex-col mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="font-normal">
            {service.category}
          </Badge>
          <span className="font-semibold text-navy">{service.price}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={service.provider.avatar} />
              <AvatarFallback className="bg-orange-100 text-xs">
                {service.provider.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{service.provider.name}</span>
          </div>
          <div className="flex items-center">
            <RatingStars rating={service.provider.rating} />
            <span className="text-xs text-gray-500 ml-1">({service.provider.reviewCount})</span>
          </div>
        </div>
        <div className="text-xs text-gray-500 flex items-center mt-1">
          <Clock size={12} className="mr-1" /> Posted {formatDate(service.createdAt)}
        </div>
      </div>
    </Card>
  );

  // Offer card component
  const OfferCard = ({ offer }: { offer: BusinessOffer }) => (
    <Card className={`p-5 h-full flex flex-col ${offer.featured ? 'border-orange-300 bg-orange-50/30' : ''}`}>
      {offer.featured && (
        <Badge className="mb-2 bg-gradient-to-r from-amber-500 to-orange-500 self-start">
          Featured
        </Badge>
      )}
      <h3 className="text-lg font-semibold">{offer.title}</h3>
      <p className="text-gray-600 mt-2 flex-grow">{offer.description}</p>
      <div className="flex flex-col mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="font-normal text-emerald-600 border-emerald-200 bg-emerald-50">
            {offer.discount}
          </Badge>
          <span className="text-sm">Valid until: {new Date(offer.validUntil).toLocaleDateString()}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={offer.provider.avatar} />
              <AvatarFallback className="bg-orange-100 text-xs">
                {offer.provider.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{offer.provider.name}</span>
          </div>
          <div className="flex items-center">
            <RatingStars rating={offer.provider.rating} />
            <span className="text-xs text-gray-500 ml-1">({offer.provider.reviewCount})</span>
          </div>
        </div>
        <div className="text-xs text-gray-500 flex items-center mt-1">
          <Clock size={12} className="mr-1" /> Posted {formatDate(offer.createdAt)}
        </div>
      </div>
    </Card>
  );

  // Opportunity card component
  const OpportunityCard = ({ opportunity }: { opportunity: ContractOpportunity }) => (
    <Card className={`p-5 h-full flex flex-col ${opportunity.featured ? 'border-orange-300 bg-orange-50/30' : ''}`}>
      {opportunity.featured && (
        <Badge className="mb-2 bg-gradient-to-r from-amber-500 to-orange-500 self-start">
          Featured
        </Badge>
      )}
      <h3 className="text-lg font-semibold">{opportunity.title}</h3>
      <p className="text-gray-600 mt-2 flex-grow">{opportunity.description}</p>
      <div className="flex flex-col mt-4 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-xs text-gray-500">Budget</span>
            <p className="font-semibold text-navy">{opportunity.budget}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Deadline</span>
            <p className="font-semibold">{new Date(opportunity.deadline).toLocaleDateString()}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Location</span>
            <p>{opportunity.location}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Expertise</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {opportunity.requiredExpertise.map((expertise, index) => (
                <Badge key={index} variant="outline" className="text-xs px-1">
                  {expertise}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <Separator className="my-2" />
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={opportunity.postedBy.avatar} />
              <AvatarFallback className="bg-blue-100 text-xs">
                {opportunity.postedBy.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{opportunity.postedBy.name}</span>
          </div>
          <div className="flex items-center">
            <RatingStars rating={opportunity.postedBy.rating} />
            <span className="text-xs text-gray-500 ml-1">({opportunity.postedBy.reviewCount})</span>
          </div>
        </div>
        <div className="text-xs text-gray-500 flex items-center mt-1">
          <Clock size={12} className="mr-1" /> Posted {formatDate(opportunity.createdAt)}
        </div>
      </div>
    </Card>
  );

  // Affiliate item card component
  const AffiliateItemCard = ({ item }: { item: AffiliateItem }) => (
    <Card className={`p-5 h-full flex flex-col ${item.featured ? 'border-orange-300 bg-orange-50/30' : ''}`}>
      {item.featured && (
        <Badge className="mb-2 bg-gradient-to-r from-amber-500 to-orange-500 self-start">
          Featured
        </Badge>
      )}
      <div className="bg-gray-100 rounded-md h-32 flex items-center justify-center mb-3">
        {item.image ? (
          <img src={item.image} alt={item.title} className="max-h-full max-w-full object-contain" />
        ) : (
          <ShoppingBag className="h-10 w-10 text-gray-400" />
        )}
      </div>
      <h3 className="text-lg font-semibold">{item.title}</h3>
      <p className="text-gray-600 mt-2 flex-grow">{item.description}</p>
      <div className="flex flex-col mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-navy">{item.price}</span>
          <Badge className="bg-green-600">
            {item.commission} Commission
          </Badge>
        </div>
        <Separator className="my-2" />
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={item.provider.avatar} />
              <AvatarFallback className="bg-orange-100 text-xs">
                {item.provider.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">{item.provider.name}</span>
          </div>
          <div className="flex items-center">
            <RatingStars rating={item.provider.rating} />
            <span className="text-xs text-gray-500 ml-1">({item.provider.reviewCount})</span>
          </div>
        </div>
        <div className="text-xs text-gray-500 flex items-center mt-1">
          <Clock size={12} className="mr-1" /> Listed {formatDate(item.createdAt)}
        </div>
      </div>
    </Card>
  );

  return (
    <AdminLayout>
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-navy">Business Discover</h1>
            <p className="text-gray-600 mt-1">
              Find services, offers, contracts, and affiliate opportunities from other businesses
            </p>
          </div>
          <Button className="mt-4 md:mt-0 bg-[var(--orange)]">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Listing
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search for services, offers, opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <div className="flex items-center">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="rating">Highest Rating</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={categoryFilter} 
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger>
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {activeTab === "services" ? (
                  serviceCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))
                ) : activeTab === "opportunities" ? (
                  opportunityCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Expertise" : category}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="all">All Categories</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs
          defaultValue="services"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger 
              value="services" 
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <Building2 className="mr-2 h-4 w-4" />
                Services
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 p-0 h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  openAddListingDialog("service");
                }}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </TabsTrigger>
            <TabsTrigger 
              value="offers" 
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <Tags className="mr-2 h-4 w-4" />
                Offers
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 p-0 h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  openAddListingDialog("offer");
                }}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </TabsTrigger>
            <TabsTrigger 
              value="opportunities" 
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <Briefcase className="mr-2 h-4 w-4" />
                Opportunities
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 p-0 h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  openAddListingDialog("opportunity");
                }}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </TabsTrigger>
            <TabsTrigger 
              value="affiliate" 
              className="flex items-center justify-between"
            >
              <div className="flex items-center">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Affiliate
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 p-0 h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  openAddListingDialog("affiliate");
                }}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="services">
              {servicesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className="bg-gray-100 rounded-md h-64"></div>
                  ))}
                </div>
              ) : filteredSortedServices.length === 0 ? (
                <div className="text-center py-10">
                  <Users className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium">No services found</h3>
                  <p className="mt-2 text-gray-500">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSortedServices.map(service => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="offers">
              {offersLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className="bg-gray-100 rounded-md h-64"></div>
                  ))}
                </div>
              ) : filteredSortedOffers.length === 0 ? (
                <div className="text-center py-10">
                  <Tags className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium">No offers found</h3>
                  <p className="mt-2 text-gray-500">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSortedOffers.map(offer => (
                    <OfferCard key={offer.id} offer={offer} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="opportunities">
              {opportunitiesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className="bg-gray-100 rounded-md h-64"></div>
                  ))}
                </div>
              ) : filteredSortedOpportunities.length === 0 ? (
                <div className="text-center py-10">
                  <Briefcase className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium">No opportunities found</h3>
                  <p className="mt-2 text-gray-500">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSortedOpportunities.map(opportunity => (
                    <OpportunityCard key={opportunity.id} opportunity={opportunity} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="affiliate">
              {affiliateItemsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className="bg-gray-100 rounded-md h-64"></div>
                  ))}
                </div>
              ) : filteredSortedAffiliateItems.length === 0 ? (
                <div className="text-center py-10">
                  <ShoppingBag className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium">No affiliate items found</h3>
                  <p className="mt-2 text-gray-500">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSortedAffiliateItems.map(item => (
                    <AffiliateItemCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>

        {/* Add Listing Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {listingType === "service" && "Add New Service"}
                {listingType === "offer" && "Add New Offer"}
                {listingType === "opportunity" && "Add New Opportunity"}
                {listingType === "affiliate" && "Add New Affiliate Item"}
              </DialogTitle>
              <DialogDescription>
                {listingType === "service" && "Register a professional service that your business offers to clients."}
                {listingType === "offer" && "Create a special promotion or discount to attract new clients."}
                {listingType === "opportunity" && "Post a contract opportunity for qualified professionals."}
                {listingType === "affiliate" && "Add a product or service that you recommend with commission."}
              </DialogDescription>
            </DialogHeader>
            
            {listingType === "service" && (
              <ServiceForm 
                form={serviceForm} 
                onSubmit={(data) => handleFormSubmit("service", data)}
                isPending={createServiceMutation.isPending}
              />
            )}
            
            {listingType === "offer" && (
              <OfferForm 
                form={offerForm} 
                onSubmit={(data) => handleFormSubmit("offer", data)}
                isPending={createOfferMutation.isPending}
              />
            )}
            
            {listingType === "opportunity" && (
              <OpportunityForm 
                form={opportunityForm} 
                onSubmit={(data) => handleFormSubmit("opportunity", data)}
                isPending={createOpportunityMutation.isPending}
              />
            )}
            
            {listingType === "affiliate" && (
              <AffiliateForm 
                form={affiliateForm} 
                onSubmit={(data) => handleFormSubmit("affiliate", data)}
                isPending={createAffiliateItemMutation.isPending}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}