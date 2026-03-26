import { z } from 'zod';

export const productInputSchema = z.object({
  productName: z.string().min(1, 'Product name is required').max(200),
  category: z.string().min(1, 'Category is required'),
  upc: z.string().min(1, 'UPC is required').max(50),
  unitCost: z.number().min(0).optional(),
  retailPrice: z.number().min(0.01, 'Retail price must be greater than 0'),
  isOnSale: z.boolean().default(false),
  salePrice: z.number().min(0).optional(),
  expirationDate: z.string().optional(),
  reorderThreshold: z.number().min(0).default(0),
  reorderQuantity: z.number().min(0).default(0),
  isFood: z.boolean().default(false),
  supplierId: z.number().optional(),
  initialQuantity: z.number().min(0).default(0),
}).refine((data) => {
  if (data.isFood && !data.expirationDate) {
    return false;
  }
  return true;
}, {
  message: 'Expiration date is required for food products',
  path: ['expirationDate'],
}).refine((data) => {
  if (data.isOnSale && data.salePrice !== undefined) {
    return data.salePrice < data.retailPrice;
  }
  return true;
}, {
  message: 'Sale price must be less than retail price',
  path: ['salePrice'],
});

export const stockTransactionSchema = z.object({
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  notes: z.string().max(500).optional(),
});

export const productUpdateSchema = productInputSchema.partial().extend({
  productId: z.number(),
});

export type ProductInputSchema = z.infer<typeof productInputSchema>;
export type StockTransactionSchema = z.infer<typeof stockTransactionSchema>;
export type ProductUpdateSchema = z.infer<typeof productUpdateSchema>;
