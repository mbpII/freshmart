import React from 'react';

export interface Product {
  productId: number;
  productName: string;
  category: string;
  upc: string;
  unitCost?: number;
  retailPrice: number;
  isOnSale: boolean;
  salePrice?: number;
  expirationDate?: string;
  reorderThreshold: number;
  reorderQuantity: number;
  isFood: boolean;
  supplierId?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Inventory {
  inventoryId: number;
  productId: number;
  storeId: number;
  quantityOnHand: number;
  lastUpdated: string;
  isActive: boolean;
}

export interface ProductWithInventory extends Product {
  inventoryId: number;
  storeId: number;
  quantityOnHand: number;
  lastUpdated: string;
  alertStatus?: 'OK' | 'LOW' | 'EXP' | 'SALE';
  daysUntilExpiration?: number;
}

export interface Transaction {
  transactionId: number;
  productId: number;
  storeId: number;
  transactionType: 'RECEIVE' | 'SALE' | 'ADJUSTMENT';
  quantityChange: number;
  transactionDate: string;
  notes?: string;
  createdAt: string;
}

export interface Alert {
  alertId: number;
  productId: number;
  storeId: number;
  productName: string;
  alertType: 'LOW_STOCK' | 'EXPIRING';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  suggestedDiscount?: number;
  isDismissed: boolean;
  createdAt: string;
  dismissedAt?: string;
}

export interface Store {
  storeId: number;
  storeName: string;
  street?: string;
  city: string;
  state: string;
  zipCode?: string;
  phone?: string;
  isActive: boolean;
}

export interface ProductInput {
  productName: string;
  category: string;
  upc: string;
  unitCost?: number;
  retailPrice: number;
  isOnSale?: boolean;
  salePrice?: number;
  expirationDate?: string;
  reorderThreshold: number;
  reorderQuantity?: number;
  isFood: boolean;
  supplierId?: number;
  initialQuantity?: number;
}

export interface ProductUpdate extends Partial<ProductInput> {
  productId: number;
}

export interface StockTransactionInput {
  quantity: number;
  notes?: string;
}

export interface FilterParams {
  search?: string;
  category?: string;
  alertStatus?: 'LOW' | 'EXP' | 'SALE';
  page?: number;
  size?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}
