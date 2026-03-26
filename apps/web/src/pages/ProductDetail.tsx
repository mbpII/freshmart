import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { AlertBadge } from '@/components/ui/Badge';
import { useProduct, useDeleteProduct } from '@/hooks/useProducts';
import { useStockIn, useStockOut, useAdjustStock, useTransactions } from '@/hooks/useInventory';
import { formatCurrency, formatDateTime, getDaysUntilExpiration, isExpired } from '@/lib/utils';

export function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockNotes, setStockNotes] = useState('');
  
  const { data: product, isLoading, error } = useProduct(Number(productId));
  const { data: transactions } = useTransactions(Number(productId));
  
  const stockInMutation = useStockIn();
  const stockOutMutation = useStockOut();
  const adjustMutation = useAdjustStock();
  const deleteMutation = useDeleteProduct();
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p className="text-secondary">Loading product...</p>
        </div>
      </Layout>
    );
  }
  
  if (error || !product) {
    return (
      <Layout>
        <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3">
          Error loading product: {error?.message || 'Product not found'}
        </div>
      </Layout>
    );
  }
  
  const daysUntilExp = getDaysUntilExpiration(product.expirationDate);
  const expired = isExpired(product.expirationDate);
  
  const handleStockAction = async (action: 'in' | 'out' | 'adjust') => {
    if (!product.inventoryId) return;
    
    const data = { quantity: stockQuantity, notes: stockNotes };
    
    try {
      if (action === 'in') {
        await stockInMutation.mutateAsync({ inventoryId: product.inventoryId, data });
      } else if (action === 'out') {
        await stockOutMutation.mutateAsync({ inventoryId: product.inventoryId, data });
      } else {
        await adjustMutation.mutateAsync({ inventoryId: product.inventoryId, data });
      }
      setStockNotes('');
    } catch (err) {
      console.error('Stock action failed:', err);
    }
  };
  
  const handleDelete = async () => {
    if (confirm('Are you sure you want to archive this product?')) {
      try {
        await deleteMutation.mutateAsync(product.productId);
        navigate('/');
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        {/* Breadcrumb & Actions */}
        <div className="flex justify-between items-center">
          <Link to="/" className="text-accent hover:underline text-sm">
            ← Back to Inventory
          </Link>
          <div className="flex gap-2">
            <Link to={`/products/${productId}/edit`}>
              <Button variant="secondary">Edit</Button>
            </Link>
            <Button variant="danger" onClick={handleDelete}>Archive</Button>
          </div>
        </div>
        
        {/* Product Header */}
        <div className="border-b border-gray-300 pb-4">
          <h1 className="text-2xl font-semibold text-primary">{product.productName}</h1>
          <div className="flex gap-4 mt-2 text-sm text-secondary">
            <span>UPC: {product.upc}</span>
            <span>Category: {product.category}</span>
            <span>Type: {product.isFood ? 'Food' : 'Non-Food'}</span>
          </div>
          <div className="flex gap-2 mt-2">
            {product.quantityOnHand <= product.reorderThreshold && product.reorderThreshold > 0 && (
              <span className="badge-low">LOW</span>
            )}
            {daysUntilExp !== null && daysUntilExp <= 7 && product.isFood && (
              <span className="badge-exp">EXP</span>
            )}
            {product.isOnSale && (
              <span className="badge-sale">[S]</span>
            )}
          </div>
        </div>
        
        {/* Stock Section */}
        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold">Current Stock</h3>
          </div>
          <div className="card-body space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-primary">{product.quantityOnHand}</span>
              <span className="text-secondary">units in stock</span>
            </div>
            
            <div className="flex gap-4 items-end">
              <div className="w-24">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(Number(e.target.value))}
                  className="form-input"
                />
              </div>
              <div className="flex-1 max-w-md">
                <label className="form-label">Notes (optional)</label>
                <input
                  type="text"
                  value={stockNotes}
                  onChange={(e) => setStockNotes(e.target.value)}
                  placeholder="e.g., Supplier delivery from Dairy Best"
                  className="form-input"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleStockAction('in')}>+ Stock In</Button>
                <Button variant="danger" onClick={() => handleStockAction('out')}>- Stock Out</Button>
                <Button variant="secondary" onClick={() => handleStockAction('adjust')}>Adjust</Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Pricing Section */}
        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold">Pricing</h3>
          </div>
          <div className="card-body space-y-2">
            <div className="flex gap-8">
              <div>
                <span className="text-label block">Regular Price</span>
                <span className="text-lg font-semibold">{formatCurrency(product.retailPrice)}</span>
              </div>
              {product.isOnSale && product.salePrice && (
                <div>
                  <span className="text-label block">Sale Price</span>
                  <span className="text-lg font-semibold text-green-600">{formatCurrency(product.salePrice)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Shelf Life (Food Only) */}
        {product.isFood && (
          <div className="card">
            <div className="card-header">
              <h3 className="font-semibold">Shelf Life</h3>
            </div>
            <div className="card-body">
              <div className="flex gap-8">
                <div>
                  <span className="text-label block">Expiration Date</span>
                  <span className={expired ? 'text-red-600 font-semibold' : ''}>
                    {formatDateTime(product.expirationDate)}
                  </span>
                </div>
                {daysUntilExp !== null && (
                  <div>
                    <span className="text-label block">Days Remaining</span>
                    <span className={daysUntilExp <= 0 ? 'text-red-600 font-semibold' : daysUntilExp <= 7 ? 'text-yellow-600 font-semibold' : ''}>
                      {daysUntilExp > 0 ? `${daysUntilExp} days` : expired ? 'EXPIRED' : `${daysUntilExp} days`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Transaction History */}
        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold">Recent Transactions</h3>
          </div>
          <div className="card-body">
            {transactions && transactions.length > 0 ? (
              <table className="data-table w-full">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.transactionId}>
                      <td className="text-sm">{formatDateTime(tx.transactionDate)}</td>
                      <td className="text-sm">
                        <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-sm ${
                          tx.transactionType === 'RECEIVE' ? 'bg-green-100 text-green-800' :
                          tx.transactionType === 'SALE' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {tx.transactionType}
                        </span>
                      </td>
                      <td className={`text-sm font-semibold ${tx.quantityChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.quantityChange > 0 ? '+' : ''}{tx.quantityChange}
                      </td>
                      <td className="text-sm text-secondary">{tx.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-secondary text-center py-4">No transactions recorded</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
