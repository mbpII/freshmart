type AlertProduct = {
  quantityOnHand: number;
  reorderThreshold?: number;
  isOnSale: boolean;
};

export type ProductAlertState = 'low-stock' | 'discounted' | 'normal';

export function getProductAlertState(product: AlertProduct): ProductAlertState {
  const isLowStock =
    product.reorderThreshold !== undefined &&
    product.quantityOnHand <= product.reorderThreshold;

  if (isLowStock) return 'low-stock';
  if (product.isOnSale) return 'discounted';
  return 'normal';
}

export function getProductAlertLabel(state: ProductAlertState): string {
  switch (state) {
    case 'low-stock':
      return 'LOW STOCK';
    case 'discounted':
      return 'DISCOUNTED';
    default:
      return 'NORMAL';
  }
}

export function getProductAlertBadgeClass(state: ProductAlertState): string {
  switch (state) {
    case 'low-stock':
      return 'rounded-md border-red-300 bg-red-100 text-red-800';
    case 'discounted':
      return 'rounded-md border-orange-300 bg-orange-100 text-orange-800';
    default:
      return 'rounded-md border-emerald-300 bg-emerald-100 text-emerald-800';
  }
}
