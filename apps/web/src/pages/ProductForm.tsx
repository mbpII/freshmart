import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useProduct, useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';
import { productInputSchema, type ProductInputSchema } from '@/lib/validation';
import { CATEGORIES, DEFAULT_STORE_ID } from '@/lib/constants';

export function ProductForm() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const isEditMode = !!productId;
  
  const { data: existingProduct } = useProduct(Number(productId), DEFAULT_STORE_ID, {
    enabled: isEditMode,
  });
  
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductInputSchema>({
    resolver: zodResolver(productInputSchema),
    defaultValues: {
      isFood: false,
      isOnSale: false,
      reorderThreshold: 10,
      reorderQuantity: 50,
      initialQuantity: 0,
    },
  });
  
  const isFood = watch('isFood');
  const isOnSale = watch('isOnSale');
  
  // Populate form in edit mode
  useEffect(() => {
    if (isEditMode && existingProduct) {
      reset({
        productName: existingProduct.productName,
        category: existingProduct.category,
        upc: existingProduct.upc,
        unitCost: existingProduct.unitCost,
        retailPrice: existingProduct.retailPrice,
        isOnSale: existingProduct.isOnSale,
        salePrice: existingProduct.salePrice,
        expirationDate: existingProduct.expirationDate,
        reorderThreshold: existingProduct.reorderThreshold,
        reorderQuantity: existingProduct.reorderQuantity,
        isFood: existingProduct.isFood,
        supplierId: existingProduct.supplierId,
      });
    }
  }, [isEditMode, existingProduct, reset]);
  
  const onSubmit = async (data: ProductInputSchema) => {
    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({
          productId: Number(productId),
          data: { productId: Number(productId), ...data },
        });
      } else {
        await createMutation.mutateAsync(data);
      }
      navigate('/');
    } catch (err) {
      console.error('Save failed:', err);
    }
  };
  
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-primary">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h1>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="card">
          <div className="card-body space-y-6">
            {/* Product Type Toggle */}
            <div className="form-section">
              <label className="form-label">Product Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="false"
                    checked={!isFood}
                    onChange={() => setValue('isFood', false)}
                    className="w-4 h-4"
                  />
                  <span>Non-Food</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="true"
                    checked={isFood}
                    onChange={() => setValue('isFood', true)}
                    className="w-4 h-4"
                  />
                  <span>Food</span>
                </label>
              </div>
            </div>
            
            {/* Basic Info */}
            <Input
              label="Product Name *"
              {...register('productName')}
              error={errors.productName?.message}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="UPC *"
                {...register('upc')}
                error={errors.upc?.message}
              />
              
              <div>
                <label className="form-label">Category *</label>
                <select {...register('category')} className="form-select w-full">
                  <option value="">Select category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-600 text-xs mt-1">{errors.category.message}</p>
                )}
              </div>
            </div>
            
            {/* Pricing */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Unit Cost ($)"
                type="number"
                step="0.01"
                min="0"
                {...register('unitCost', { valueAsNumber: true })}
                error={errors.unitCost?.message}
              />
              
              <Input
                label="Retail Price ($) *"
                type="number"
                step="0.01"
                min="0.01"
                {...register('retailPrice', { valueAsNumber: true })}
                error={errors.retailPrice?.message}
              />
            </div>
            
            {/* Food-only fields */}
            {isFood && (
              <Input
                label="Expiration Date *"
                type="date"
                {...register('expirationDate')}
                error={errors.expirationDate?.message}
              />
            )}
            
            {/* Stock Settings */}
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Low Stock Threshold"
                type="number"
                min="0"
                {...register('reorderThreshold', { valueAsNumber: true })}
                error={errors.reorderThreshold?.message}
              />
              
              <Input
                label="Reorder Quantity"
                type="number"
                min="0"
                {...register('reorderQuantity', { valueAsNumber: true })}
                error={errors.reorderQuantity?.message}
              />
              
              {!isEditMode && (
                <Input
                  label="Initial Quantity"
                  type="number"
                  min="0"
                  {...register('initialQuantity', { valueAsNumber: true })}
                  error={errors.initialQuantity?.message}
                />
              )}
            </div>
            
            {/* Sale Configuration */}
            <div className="form-section border-t pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('isOnSale')}
                  className="w-4 h-4"
                />
                <span className="font-medium">Put on Sale</span>
              </label>
              
              {isOnSale && (
                <div className="mt-4">
                  <Input
                    label="Sale Price ($)"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('salePrice', { valueAsNumber: true })}
                    error={errors.salePrice?.message}
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div className="card-header border-t flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting || createMutation.isPending || updateMutation.isPending}
            >
              {isEditMode ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
