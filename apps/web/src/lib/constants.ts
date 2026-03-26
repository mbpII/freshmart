// Default store for MVP (Downtown - 101)
export const DEFAULT_STORE_ID = 101;

// Store list for reference
export const STORES = [
  { storeId: 101, storeName: 'Downtown' },
  { storeId: 102, storeName: 'Northside' },
  { storeId: 103, storeName: 'Westside' },
  { storeId: 104, storeName: 'Riverside' },
] as const;

// Product categories
export const CATEGORIES = [
  'Dairy',
  'Bakery',
  'Produce',
  'Meat',
  'Frozen',
  'Beverages',
  'Household',
  'Personal Care',
  'Snacks',
  'Canned Goods',
  'Other',
] as const;

// Alert configuration
export const ALERT_CONFIG = {
  LOW_STOCK_THRESHOLD: 7, // Days before expiration
  EXPIRATION_WARNING_DAYS: 7,
  AUTO_REFRESH_INTERVAL: 60000, // 60 seconds
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// Transaction types
export const TRANSACTION_TYPES = {
  RECEIVE: 'RECEIVE' as const,
  SALE: 'SALE' as const,
  ADJUSTMENT: 'ADJUSTMENT' as const,
};
