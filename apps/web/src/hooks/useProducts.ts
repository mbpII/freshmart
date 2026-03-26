import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/api/client';
import type { FilterParams, ProductInput, ProductUpdate } from '@/types';
import { DEFAULT_STORE_ID } from '@/lib/constants';

export function useProducts(filters?: FilterParams, storeId: number = DEFAULT_STORE_ID) {
  return useQuery({
    queryKey: ['products', storeId, filters],
    queryFn: async () => {
      const response = await productsApi.getAll(storeId, filters);
      return response.data;
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Auto-refresh every minute
  });
}

export function useProduct(productId: number, storeId: number = DEFAULT_STORE_ID) {
  return useQuery({
    queryKey: ['product', productId, storeId],
    queryFn: async () => {
      const response = await productsApi.getById(productId, storeId);
      return response.data;
    },
    enabled: !!productId,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: ProductInput) => {
      const response = await productsApi.create(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, data }: { productId: number; data: ProductUpdate }) => {
      const response = await productsApi.update(productId, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productId: number) => {
      await productsApi.delete(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
