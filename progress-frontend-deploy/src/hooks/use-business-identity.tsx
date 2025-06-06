import { useQuery } from '@tanstack/react-query';
import { useTenant } from './use-tenant';

export function useBusinessIdentity() {
  const { tenant } = useTenant();
  const tenantId = tenant?.id;

  const { data: businessIdentity, isLoading, error } = useQuery({
    queryKey: ['/api/business-identity'],
  });

  return {
    businessIdentity,
    isLoading,
    error
  };
}