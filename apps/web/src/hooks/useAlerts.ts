import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertsApi } from '@/api/client';
import { DEFAULT_STORE_ID } from '@/lib/constants';

export function useAlerts(type?: string, storeId: number = DEFAULT_STORE_ID) {
  return useQuery({
    queryKey: ['alerts', storeId, type],
    queryFn: async () => {
      const response = await alertsApi.getAll(storeId, type);
      return response.data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

export function useDismissAlert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (alertId: number) => {
      const response = await alertsApi.dismiss(alertId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
