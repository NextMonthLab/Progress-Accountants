import { ReactNode } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Lock, LogIn } from 'lucide-react';

interface RequireAuthProps {
  children: ReactNode;
  redirectTo?: string;
}

// Dummy auth hook - will be replaced with real authentication later
const useAuth = () => {
  // For now, always return false to show the auth gate
  // This will be connected to real auth system later
  return {
    isAuthenticated: false,
    user: null,
    loading: false
  };
};

export default function RequireAuth({ children, redirectTo = '/auth' }: RequireAuthProps) {
  const { isAuthenticated, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#7B3FE4]"></div>
      </div>
    );
  }

  // If not authenticated, show access denied page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="mb-8">
            <Lock className="h-16 w-16 text-[#7B3FE4] mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-4">
              Access Denied
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              You need to be logged in to access the Client Dashboard. 
              Please authenticate to view your financial information.
            </p>
          </div>
          
          <div className="space-y-4">
            <Button 
              asChild
              size="lg"
              className="w-full bg-gradient-to-r from-[#7B3FE4] to-[#3FA4E4] hover:from-[#6B2FD4] hover:to-[#2F94D4] text-white font-medium"
            >
              <Link href={redirectTo} className="flex items-center justify-center gap-2 no-underline">
                <LogIn className="h-5 w-5" />
                Login to Continue
              </Link>
            </Button>
            
            <p className="text-gray-400 text-sm">
              Don't have an account? Contact us to get set up with client access.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated, render the protected content
  return <>{children}</>;
}