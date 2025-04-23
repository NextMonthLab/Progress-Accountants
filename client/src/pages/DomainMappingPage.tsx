import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Info, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useTenant } from "@/hooks/use-tenant";
import { z } from "zod";

// Define domain status types to match backend
enum DomainStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  ACTIVE = "active",
  INACTIVE = "inactive",
  FAILED = "failed"
}

// Domain mapping form validation schema
const domainFormSchema = z.object({
  customDomain: z
    .string()
    .trim()
    .min(4, "Domain must be at least 4 characters")
    .regex(/^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/, "Please enter a valid domain format (e.g., example.com)"),
});

// Domain mapping interface
interface DomainMapping {
  id: number;
  tenantId: string;
  customDomain: string;
  status: DomainStatus;
  verificationMethod: string;
  verificationToken: string;
  verificationCompletedAt?: string;
  verificationAttempts?: number;
  lastVerificationCheck?: string;
  createdAt: string;
  updatedAt: string;
}

// DNS instruction interface
interface DnsInstruction {
  type: string;
  host: string;
  pointsTo?: string;
  value?: string;
}

// Main component
export default function DomainMappingPage() {
  const { tenant } = useTenant();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newDomain, setNewDomain] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("manage");
  const [dnsInstructions, setDnsInstructions] = useState<{ dnsRecords: DnsInstruction[], header: string, note: string } | null>(null);

  const tenantId = tenant?.id;

  // Fetch existing domain mappings
  const {
    data: domainMapping,
    isLoading: isLoadingMapping,
    error: mappingError,
  } = useQuery({
    queryKey: ["/api/domain-mapping", tenantId],
    queryFn: async () => {
      if (!tenantId) return null;
      const res = await apiRequest("GET", `/api/domain-mapping/${tenantId}`);
      return res.json();
    },
    enabled: !!tenantId,
  });

  // Create domain mapping mutation
  const createMappingMutation = useMutation({
    mutationFn: async (domain: string) => {
      const res = await apiRequest("POST", "/api/domain-mapping", {
        tenantId,
        customDomain: domain,
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Domain mapping created",
          description: `Setup started for ${data.mapping.customDomain}`,
        });
        setDnsInstructions(data.dns_instructions);
        queryClient.invalidateQueries({ queryKey: ["/api/domain-mapping", tenantId] });
        setActiveTab("setup");
      }
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create domain mapping",
        description: error.message || "An error occurred while setting up domain mapping",
        variant: "destructive",
      });
    },
  });

  // Verification mutation
  const verifyMutation = useMutation({
    mutationFn: async (mappingId: number) => {
      const res = await apiRequest("POST", `/api/domain-mapping/verify/${mappingId}`);
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        if (data.verified) {
          toast({
            title: "Domain verified successfully",
            description: "Your domain has been verified and is now active",
          });
        } else {
          toast({
            title: "Verification still pending",
            description: "DNS records may still be propagating. Please try again in a few minutes.",
            variant: "default", // Using default variant as warning is not defined
          });
        }
        queryClient.invalidateQueries({ queryKey: ["/api/domain-mapping", tenantId] });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Verification failed",
        description: error.message || "An error occurred during verification",
        variant: "destructive",
      });
    },
  });

  const handleDomainSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validate domain format
    const validationResult = domainFormSchema.safeParse({ customDomain: newDomain });
    if (!validationResult.success) {
      setFormError(validationResult.error.errors[0].message);
      return;
    }

    // Create domain mapping
    createMappingMutation.mutate(newDomain);
  };

  const verifyDomain = (id: number) => {
    verifyMutation.mutate(id);
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: DomainStatus }) => {
    switch (status) {
      case DomainStatus.VERIFIED:
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Verified</Badge>;
      case DomainStatus.ACTIVE:
        return <Badge className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" /> Active</Badge>;
      case DomainStatus.PENDING:
        return <Badge className="bg-orange-500"><Info className="w-3 h-3 mr-1" /> Pending Verification</Badge>;
      case DomainStatus.INACTIVE:
        return <Badge className="bg-gray-500"><AlertTriangle className="w-3 h-3 mr-1" /> Inactive</Badge>;
      case DomainStatus.FAILED:
        return <Badge className="bg-red-500"><XCircle className="w-3 h-3 mr-1" /> Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Update DNS instructions when domain mapping changes
  useEffect(() => {
    if (domainMapping?.mapping && domainMapping.mapping.status === DomainStatus.PENDING) {
      // Fetch DNS instructions for the current domain
      const fetchDnsInstructions = async () => {
        try {
          const res = await apiRequest("GET", `/api/domain-mapping/instructions/${domainMapping.mapping.customDomain}`);
          const data = await res.json();
          if (data.success) {
            setDnsInstructions(data.instructions);
          }
        } catch (error) {
          console.error("Failed to fetch DNS instructions:", error);
        }
      };

      fetchDnsInstructions();
    }
  }, [domainMapping]);

  return (
    <AdminLayout>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Domain Mapping Utility</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Connect your custom domain to your Progress website. This utility helps you set up and verify domain ownership.
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="manage">Manage Domains</TabsTrigger>
            <TabsTrigger value="setup">Setup Instructions</TabsTrigger>
          </TabsList>

          <TabsContent value="manage" className="space-y-6">
            {/* Domain status section */}
            <Card>
              <CardHeader>
                <CardTitle>Current Domain Status</CardTitle>
                <CardDescription>View and manage your custom domain settings</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingMapping ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : mappingError ? (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>Failed to load domain mapping information</AlertDescription>
                  </Alert>
                ) : domainMapping?.has_mapping ? (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center justify-between">
                      <div>
                        <h3 className="font-medium text-lg">{domainMapping.mapping.customDomain}</h3>
                        <div className="flex items-center mt-2">
                          <StatusBadge status={domainMapping.mapping.status} />
                          <span className="text-sm text-gray-500 dark:text-gray-400 ml-3">
                            {domainMapping.mapping.verificationCompletedAt 
                              ? `Verified on ${new Date(domainMapping.mapping.verificationCompletedAt).toLocaleDateString()}` 
                              : 'Awaiting verification'}
                          </span>
                        </div>
                      </div>
                      {domainMapping.mapping.status === DomainStatus.PENDING && (
                        <Button 
                          onClick={() => verifyDomain(domainMapping.mapping.id)}
                          disabled={verifyMutation.isPending}
                        >
                          {verifyMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Verify Domain
                        </Button>
                      )}
                    </div>
                    
                    {domainMapping.mapping.status === DomainStatus.PENDING && (
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Domain is pending verification</AlertTitle>
                        <AlertDescription>
                          Please set up the required DNS records and then click "Verify Domain". It may take up to 24 hours for DNS changes to propagate.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <h3 className="font-medium text-lg mb-2">No custom domain mapped</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Register a domain to make your site accessible via your own web address.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Add new domain section */}
            {(!domainMapping?.has_mapping || domainMapping?.mapping?.status === DomainStatus.FAILED) && (
              <Card>
                <CardHeader>
                  <CardTitle>Add Custom Domain</CardTitle>
                  <CardDescription>Connect your website to a domain you own</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleDomainSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="domain">Domain Name</Label>
                      <Input
                        id="domain"
                        placeholder="example.com"
                        value={newDomain}
                        onChange={(e) => setNewDomain(e.target.value)}
                        disabled={createMappingMutation.isPending}
                      />
                      {formError && <p className="text-sm text-red-500">{formError}</p>}
                    </div>

                    <Button 
                      type="submit" 
                      disabled={createMappingMutation.isPending || !newDomain.trim()}>
                      {createMappingMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Add Domain
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col items-start">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <p className="font-medium mb-1">Before adding a domain:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Make sure you own the domain</li>
                      <li>The domain should be registered and active with your domain registrar</li>
                      <li>You should have access to manage DNS records for the domain</li>
                    </ul>
                  </div>
                </CardFooter>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="setup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>DNS Setup Instructions</CardTitle>
                <CardDescription>Follow these steps to connect your domain</CardDescription>
              </CardHeader>
              <CardContent>
                {!dnsInstructions ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      {domainMapping?.has_mapping 
                        ? "Loading DNS instructions..." 
                        : "Add a domain first to see setup instructions"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <p className="text-gray-700 dark:text-gray-300">{dnsInstructions.header}</p>
                    
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium">Record Type</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Host</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {dnsInstructions.dnsRecords.map((record, index) => (
                            <tr key={index} className="bg-white dark:bg-gray-950">
                              <td className="px-4 py-3 text-sm">{record.type}</td>
                              <td className="px-4 py-3 text-sm">{record.host}</td>
                              <td className="px-4 py-3 text-sm font-mono text-xs">
                                {record.pointsTo || record.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Important</AlertTitle>
                      <AlertDescription>
                        {dnsInstructions.note}
                      </AlertDescription>
                    </Alert>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4">
                      <h4 className="font-medium mb-2">What happens next?</h4>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                        <li>Log in to your domain registrar (like GoDaddy, Namecheap, etc.)</li>
                        <li>Find the DNS management section</li>
                        <li>Add the records listed above exactly as shown</li>
                        <li>Wait for DNS propagation (can take up to 24 hours)</li>
                        <li>Return to the "Manage Domains" tab and click "Verify Domain"</li>
                      </ol>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Troubleshooting</CardTitle>
                <CardDescription>Common issues and solutions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Verification Failed</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">If verification fails, check:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 mt-2 space-y-1">
                      <li>DNS records are entered correctly (no typos)</li>
                      <li>You've waited long enough for DNS propagation (up to 24 hours)</li>
                      <li>Your domain registrar supports the required record types</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">DNS Management Help</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Most domain registrars have guides on how to add DNS records. Search your registrar's help center 
                      for instructions specific to adding TXT and CNAME records.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}