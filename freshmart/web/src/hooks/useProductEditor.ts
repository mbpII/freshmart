import type { NavigateFunction } from 'react-router-dom';
import {
  useCreateProduct,
  useMarkOnSale,
  useUpdateProduct,
} from './useProducts';
import {
  buildCreateProductInput,
  buildUpdateProductInput,
} from '../lib/productForm';
import type { ProductFormData } from '../types/product';

type UseProductEditorOptions = {
  productId: number;
  isEditMode: boolean;
  isManager: boolean;
  navigate: NavigateFunction;
};

/**
 * Encapsulates create/update/markOnSale orchestration so that ProductEditorForm
 * only needs to handle rendering and form state.
 */
export function useProductEditor({
  productId,
  isEditMode,
  isManager,
  navigate,
}: UseProductEditorOptions) {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const markOnSale = useMarkOnSale();

  const isPending = createProduct.isPending || updateProduct.isPending;
  const error = (isEditMode ? updateProduct.error : createProduct.error) as Error | null;

  const applyMarkOnSale = async (id: number, values: ProductFormData) => {
    if (!isManager || !values.isOnSale || !values.saleValue) return;
    const raw = parseFloat(values.saleValue);
    if (!Number.isFinite(raw) || raw <= 0) return;
    const mode = values.saleMode === 'price' ? 'flat' : 'percent';
    await markOnSale.mutateAsync({ productId: id, mode, value: raw });
  };

  const submit = (values: ProductFormData): void => {
    if (isEditMode) {
      updateProduct.mutate(
        { id: productId, data: buildUpdateProductInput(values) },
        {
          onSuccess: async () => {
            await applyMarkOnSale(productId, values);
            navigate(`/products/${productId}`);
          },
        },
      );
      return;
    }

    createProduct.mutate(buildCreateProductInput(values), {
      onSuccess: async (created) => {
        await applyMarkOnSale(created.productId, values);
        navigate('/');
      },
    });
  };

  return { submit, isPending, error };
}
