import { useState } from "react";
import { z } from "zod";
import { useLocation, useParams } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useTenant } from "@/hooks/use-tenant";

// Registration form validation schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: z.string(),
  tenantId: z.string().uuid(),
  userType: z.literal("client"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function ClientRegistrationPage() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { tenantId } = useParams();
  const { tenant } = useTenant();
  const [serverError, setServerError] = useState<string | null>(null);

  // If tenant doesn't exist or client login is disabled, show error
  if (tenant && tenant.customization?.featureFlags && !tenant.customization.featureFlags.enableClientLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Registration Disabled</AlertTitle>
          <AlertDescription>
            Client registration is currently disabled for this organization. Please contact the administrator.
          </AlertDescription>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => navigate("/")}
          >
            Return to Home
          </Button>
        </Alert>
      </div>
    );
  }

  // Register form with validation
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      tenantId: tenantId || "",
      userType: "client",
    },
  });

  // Registration mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: RegisterFormValues) => {
      const { confirmPassword, ...registerData } = values;
      const response = await apiRequest("POST", "/api/client-register", registerData);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Registration successful",
        description: "You can now log in with your credentials.",
      });
      navigate("/auth");
    },
    onError: (error: Error) => {
      setServerError(error.message);
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onRegisterSubmit = (values: RegisterFormValues) => {
    setServerError(null);
    mutate(values);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Registration Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-background">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary">Create Your Account</h1>
            <p className="text-muted-foreground mt-2">
              Register to access your client dashboard with {tenant?.name || "our organization"}
            </p>
          </div>

          {serverError && (
            <Alert variant="destructive">
              <AlertTitle>Registration Error</AlertTitle>
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onRegisterSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john.smith@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              <div className="text-center mt-4">
                <span className="text-muted-foreground">
                  Already have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0"
                    onClick={() => navigate("/auth")}
                  >
                    Log in
                  </Button>
                </span>
              </div>
            </form>
          </Form>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex-1 bg-primary hidden lg:flex flex-col justify-center items-center p-8 text-primary-foreground">
        <div className="max-w-md space-y-6">
          <h2 className="text-3xl font-bold">Welcome to {tenant?.name || "Our Client Portal"}</h2>
          <p className="text-xl">
            Gain access to your financial information, important documents, and
            collaborate with your accountant in real-time.
          </p>
          <div className="space-y-4">
            <div className="flex items-start">
              <svg
                className="h-6 w-6 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Access your financial reports 24/7</span>
            </div>
            <div className="flex items-start">
              <svg
                className="h-6 w-6 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Securely share and store documents</span>
            </div>
            <div className="flex items-start">
              <svg
                className="h-6 w-6 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Message your accountant directly</span>
            </div>
            <div className="flex items-start">
              <svg
                className="h-6 w-6 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Track your financial goals</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}