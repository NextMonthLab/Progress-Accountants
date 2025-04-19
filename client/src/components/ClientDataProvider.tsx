import React, { createContext, useContext, ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Auth context to manage authentication state
interface AuthContextType {
  isAuthenticated: boolean;
  isStaff: boolean;
  userId: number;
  userType: 'client' | 'staff';
  userName: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Demo authentication provider with mock data
// In a real app, this would verify tokens, check permissions, etc.
export function AuthProvider({ children }: { children: ReactNode }) {
  // Mock authentication state - in real app would check tokens, etc.
  const authState: AuthContextType = {
    isAuthenticated: true, // For demo purposes
    isStaff: false, // For demo purposes - setting as client for first-time user experience
    userId: 2,
    userType: 'client',
    userName: 'Jane Smith'
  };

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Root provider that combines all providers needed for the app
export function ClientDataProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}

// Higher-order component to protect routes that require authentication
export function withAuth<T extends object>(
  Component: React.ComponentType<T>,
  requiredRole?: 'client' | 'staff'
) {
  return function WithAuth(props: T) {
    const { toast } = useToast();
    const auth = useAuth();

    if (!auth.isAuthenticated) {
      // Redirect to login in real app
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page",
        variant: "destructive",
      });
      return null;
    }

    if (requiredRole && auth.userType !== requiredRole) {
      // Handle unauthorized access
      toast({
        title: "Unauthorized",
        description: `You need ${requiredRole} permissions to access this page`,
        variant: "destructive",
      });
      return null;
    }

    return <Component {...props} />;
  };
}