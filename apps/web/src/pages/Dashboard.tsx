import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { ProductTable } from '@/components/features/ProductTable';

export function Dashboard() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-primary">Inventory Dashboard</h2>
            <p className="text-secondary text-sm mt-1">
              Manage products and stock levels for your store
            </p>
          </div>
        </div>
        
        <ProductTable />
      </div>
    </Layout>
  );
}
