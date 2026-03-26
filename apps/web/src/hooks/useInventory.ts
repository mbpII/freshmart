import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi, transactionsApi } from '@/api/client';
import type { StockTransactionInput } from '@/types';
import { DEFAULT_STORE_ID } from '@/lib/constants';

export function useInventory(storeId: number = DEFAULT_STORE_ID) {
  return useQuery({
    queryKey: ['inventory', storeId],
    queryFn: async () => {
      const response = await inventoryApi.getByStore(storeId);
      return response.data;
    },
  });
}

export function useStockIn() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ inventoryId, data }: { inventoryId: number; data: StockTransactionInput }) => {
      const response = await inventoryApi.stockIn(inventoryId, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}

export function useStockOut() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ inventoryId, data }: { inventoryId: number; data: StockTransactionInput }) => {
      const response = await inventoryApi.stockOut(inventoryId, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}

export function useAdjustStock() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ inventoryId, data }: { inventoryId: number; data: StockTransactionInput }) => {
      const response = await inventoryApi.adjust(inventoryId, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}

export function useTransactions(productId: number, storeId: number = DEFAULT_STORE_ID, limit: number = 10) {
  return useQuery({
    queryKey: ['transactions', productId, storeId, limit],
    queryFn: async () => {
      const response = await transactionsApi.getByProduct(productId, storeId, limit);
      return response.data;
    },
    enabled: !!productId,
  });
}
