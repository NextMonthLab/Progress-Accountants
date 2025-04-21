import { useQuery } from '@tanstack/react-query';
import { useAuth } from './use-auth';
import { useTenant } from './use-tenant';

// This hook provides access to client-specific data and business information
export function useClientData() {
  const { user } = useAuth();
  const { tenant } = useTenant();

  const userId = user?.id;
  const tenantId = tenant?.id || user?.tenantId;

  // Optional: Fetch additional client data if needed
  // const { data: clientData } = useQuery({
  //   queryKey: ['/api/client-data', userId],
  //   enabled: !!userId,
  // });

  return {
    userId,
    tenantId,
    isClient: user?.userType === 'client',
    isAdmin: user?.userType === 'admin' || user?.userType === 'super_admin',
    isEditor: user?.userType === 'editor',
    tenantName: tenant?.name,
    userName: user?.name,
  };
}

export default useClientData;