import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
  QueryClient,
} from "@tanstack/react-query";
import { getQueryFn, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

import { UserRole } from "@shared/schema";

export interface User {
  id: number;
  username: string;
  email: string;
  name?: string;
  userType: UserRole;
  tenantId?: string;
  isSuperAdmin: boolean;
  avatarUrl?: string;
  createdAt: string;
}

interface AuthResponse {
  user: User;
  token: string;
  redirectPath: string;
}

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<AuthResponse, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<AuthResponse, Error, RegisterData>;
};

type LoginData = {
  username: string;
  password: string;
};

type RegisterData = {
  username: string;
  email: string;
  password: string;
  name?: string;
};

const defaultQueryClient = new QueryClient();

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ 
  children,
  queryClient = defaultQueryClient
}: { 
  children: ReactNode;
  queryClient?: QueryClient;
}) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | null, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return res.json();
    },
    onSuccess: (response: AuthResponse) => {
      queryClient.setQueryData(["/api/user"], response.user);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${response.user.name || response.user.username}!`,
      });
      
      // Redirect to the appropriate dashboard based on role
      if (response.redirectPath) {
        setLocation(response.redirectPath);
      }
    },
    onError: (error: any) => {
      // Handle structured error responses from the server
      let errorTitle = "Sign In Unsuccessful";
      let errorMessage = "We couldn't sign you in. Please check your credentials and try again.";
      
      try {
        if (error.response) {
          const data = error.response;
          errorTitle = data.title || errorTitle;
          errorMessage = data.error || errorMessage;
        } else if (typeof error === 'object' && error.message) {
          errorMessage = error.message;
        }
      } catch (e) {
        console.error("Error parsing login error:", e);
      }
      
      // Use the friendly variant for authentication errors
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "friendly",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterData) => {
      const res = await apiRequest("POST", "/api/register", userData);
      return res.json();
    },
    onSuccess: (response: AuthResponse) => {
      queryClient.setQueryData(["/api/user"], response.user);
      
      toast({
        title: "Registration successful",
        description: `Welcome to Progress, ${response.user.name || response.user.username}!`,
      });
      
      // Redirect to the appropriate dashboard based on role
      if (response.redirectPath) {
        setLocation(response.redirectPath);
      }
    },
    onError: (error: any) => {
      // Handle structured error responses from the server
      let errorTitle = "Registration Unsuccessful";
      let errorMessage = "We couldn't create your account. Please check your information and try again.";
      
      try {
        if (error.response) {
          const data = error.response;
          errorTitle = data.title || errorTitle;
          errorMessage = data.error || errorMessage;
        } else if (typeof error === 'object' && error.message) {
          errorMessage = error.message;
        }
      } catch (e) {
        console.error("Error parsing registration error:", e);
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "friendly",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      
      // Redirect to home page after logout
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}