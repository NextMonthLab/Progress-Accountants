import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useAuth } from './use-auth';
import { UserRole } from '@shared/schema';

// Define permission types
export type Permission = 
  | 'view_public_content'
  | 'edit_content'
  | 'view_dashboard'
  | 'manage_media'
  | 'edit_pages'
  | 'manage_users'
  | 'configure_tools'
  | 'manage_billing'
  | 'view_analytics'
  | 'manage_tenants'
  | 'access_all_data'
  | 'system_configuration';

interface PermissionsContextValue {
  userRole: UserRole | null;
  isSuperAdmin: boolean;
  permissions: Permission[];
  can: (permission: Permission) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  isLoading: boolean;
}

const PermissionsContext = createContext<PermissionsContextValue | null>(null);

// Role-based permission mapping
const rolePermissionsMap: Record<UserRole, Permission[]> = {
  'public': ['view_public_content'],
  'editor': [
    'view_public_content',
    'edit_content',
    'view_dashboard',
    'manage_media',
    'edit_pages'
  ],
  'admin': [
    'view_public_content',
    'edit_content',
    'view_dashboard',
    'manage_media',
    'edit_pages',
    'manage_users',
    'configure_tools',
    'manage_billing',
    'view_analytics'
  ],
  'super_admin': [
    'view_public_content',
    'edit_content',
    'view_dashboard',
    'manage_media',
    'edit_pages',
    'manage_users',
    'configure_tools',
    'manage_billing',
    'view_analytics',
    'manage_tenants',
    'access_all_data',
    'system_configuration'
  ]
};

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // When user data changes, update permissions
    if (!authLoading) {
      if (user) {
        const userType = user.userType as UserRole;
        const isSuperAdmin = user.isSuperAdmin === true;
        
        // Super admins get all super_admin permissions regardless of role
        if (isSuperAdmin) {
          setPermissions(rolePermissionsMap['super_admin']);
        } else {
          // Use the role-based permissions
          setPermissions(rolePermissionsMap[userType] || rolePermissionsMap['public']);
        }
      } else {
        // No user, only public permissions
        setPermissions(rolePermissionsMap['public']);
      }
      setIsLoading(false);
    }
  }, [user, authLoading]);
  
  // Check if user has a specific permission
  const can = (permission: Permission) => {
    return permissions.includes(permission);
  };
  
  // Check if user has a specific role or any of the roles
  const hasRole = (role: UserRole | UserRole[]) => {
    if (!user) return false;
    
    const userRole = user.userType as UserRole;
    
    // Super admin can do anything
    if (user.isSuperAdmin === true) return true;
    
    // Check against single or multiple roles
    if (Array.isArray(role)) {
      return role.includes(userRole);
    }
    
    return role === userRole;
  };
  
  const value: PermissionsContextValue = {
    userRole: user ? (user.userType as UserRole) : null,
    isSuperAdmin: user?.isSuperAdmin === true,
    permissions,
    can,
    hasRole,
    isLoading: isLoading || authLoading
  };
  
  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionsContext);
  
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  
  return context;
}