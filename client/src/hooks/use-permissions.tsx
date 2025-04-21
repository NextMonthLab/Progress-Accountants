import { createContext, ReactNode, useContext } from "react";
import { useAuth, User } from "./use-auth";

type PermissionsContextType = {
  can: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  userRole: string;
  isSuperAdmin: boolean;
};

export const PermissionsContext = createContext<PermissionsContextType | null>(null);

// Define available permissions by role
const rolePermissions = {
  super_admin: [
    'tenant:create', 'tenant:read', 'tenant:update', 'tenant:delete',
    'user:create', 'user:read', 'user:update', 'user:delete',
    'system:read', 'system:update', 'system:admin',
    'settings:admin',
    'blueprint:admin',
    'metrics:read', 'metrics:admin',
    'template:create', 'template:read', 'template:update', 'template:delete',
    'page:create', 'page:read', 'page:update', 'page:delete',
    'tool:create', 'tool:read', 'tool:update', 'tool:delete',
    'media:create', 'media:read', 'media:update', 'media:delete'
  ],
  admin: [
    'user:create', 'user:read', 'user:update',
    'settings:read', 'settings:update',
    'page:create', 'page:read', 'page:update', 'page:delete',
    'tool:create', 'tool:read', 'tool:update', 'tool:delete',
    'media:create', 'media:read', 'media:update', 'media:delete',
    'metrics:read'
  ],
  editor: [
    'page:read', 'page:update',
    'tool:read', 'tool:update',
    'media:create', 'media:read', 'media:update'
  ],
  public: [
    'page:read',
    'tool:read',
    'media:read'
  ]
};

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  // Default user role is 'public'
  const userRole = user?.role || 'public';
  const isSuperAdmin = user?.isSuperAdmin || false;
  
  // Check if user has a specific permission
  const can = (permission: string): boolean => {
    if (!user) return false;
    
    // Super admins can do everything
    if (isSuperAdmin) return true;
    
    // Check if the user's role has this permission
    return rolePermissions[userRole]?.includes(permission) || false;
  };
  
  // Check if user has a specific role
  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return userRole === role;
  };
  
  return (
    <PermissionsContext.Provider
      value={{
        can,
        hasRole,
        userRole,
        isSuperAdmin
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
}