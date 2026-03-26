import axios from 'axios';
import type { 
  Product, 
  ProductWithInventory, 
  Inventory, 
  Transaction, 
  Alert, 
  Store,
  ProductInput,
  ProductUpdate,
  StockTransactionInput,
  FilterParams,
  PaginatedResponse 
} from '@/types';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productsApi = {
  getAll: (storeId: number, params?: FilterParams) => 
    api.get<PaginatedResponse<ProductWithInventory>>(`/products`, { 
      params: { storeId, ...params } 
    }),
  
  getById: (productId: number, storeId: number) =>
    api.get<ProductWithInventory>(`/products/${productId}`, { 
      params: { storeId } 
    }),
  
  create: (data: ProductInput) =>
    api.post<Product>('/products', data),
  
  update: (productId: number, data: ProductUpdate) =>
    api.put<Product>(`/products/${productId}`, data),
  
  delete: (productId: number) =>
    api.delete(`/products/${productId}`),
};

export const inventoryApi = {
  getByStore: (storeId: number) =>
    api.get<Inventory[]>(`/inventory`, { params: { storeId } }),
  
  stockIn: (inventoryId: number, data: StockTransactionInput) =>
    api.post(`/inventory/${inventoryId}/stock-in`, data),
  
  stockOut: (inventoryId: number, data: StockTransactionInput) =>
    api.post(`/inventory/${inventoryId}/stock-out`, data),
  
  adjust: (inventoryId: number, data: StockTransactionInput) =>
    api.post(`/inventory/${inventoryId}/adjust`, data),
};

export const transactionsApi = {
  getByProduct: (productId: number, storeId: number, limit: number = 10) =>
    api.get<Transaction[]>(`/transactions`, { 
      params: { productId, storeId, limit } 
    }),
  
  getByStore: (storeId: number, params?: { page?: number; size?: number }) =>
    api.get<PaginatedResponse<Transaction>>(`/transactions`, { 
      params: { storeId, ...params } 
    }),
};

export const alertsApi = {
  getAll: (storeId: number, type?: string) =>
    api.get<Alert[]>(`/alerts`, { params: { storeId, type } }),
  
  dismiss: (alertId: number) =>
    api.post(`/alerts/${alertId}/dismiss`),
};

export const storesApi = {
  getAll: () => api.get<Store[]>('/stores'),
  getById: (storeId: number) => api.get<Store>(`/stores/${storeId}`),
};

export default api;
