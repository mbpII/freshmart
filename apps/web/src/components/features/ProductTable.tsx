import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, flexRender, type ColumnDef } from '@tanstack/react-table';
import { useProducts } from '@/hooks/useProducts';
import { AlertBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency, getDaysUntilExpiration } from '@/lib/utils';
import { CATEGORIES } from '@/lib/constants';
import type { ProductWithInventory, FilterParams } from '@/types';

export function ProductTable() {
  const [filters, setFilters] = useState<FilterParams>({
    search: '',
    category: '',
    alertStatus: undefined,
    page: 0,
    size: 20,
  });
  
  const { data: products, isLoading, error } = useProducts(filters);
  
  // Transform products for table with computed fields
  const tableData = useMemo(() => {
    if (!products?.data) return [];
    
    return products.data.map((product) => {
      let alertStatus: ProductWithInventory['alertStatus'] = 'OK';
      
      if (product.isOnSale) {
        alertStatus = 'SALE';
      }
      
      if (product.quantityOnHand <= product.reorderThreshold && product.reorderThreshold > 0) {
        alertStatus = 'LOW';
      }
      
      const daysUntil = getDaysUntilExpiration(product.expirationDate);
      if (daysUntil !== null && daysUntil <= 7 && product.isFood) {
        alertStatus = 'EXP';
      }
      
      return {
        ...product,
        alertStatus,
        daysUntilExpiration: daysUntil ?? undefined,
      };
    });
  }, [products]);
  
  // Define columns
  const columns = useMemo<ColumnDef<ProductWithInventory>[]>(
    () => [
      {
        accessorKey: 'productName',
        header: 'Name',
        cell: ({ row }) => (
          <Link 
            to={`/products/${row.original.productId}`}
            className="text-accent hover:underline font-medium"
          >
            {row.original.productName}
          </Link>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ getValue }) => <span className="text-sm">{getValue() as string}</span>,
      },
      {
        accessorKey: 'quantityOnHand',
        header: 'Qty',
        cell: ({ row }) => {
          const qty = row.original.quantityOnHand;
          const isLow = qty <= row.original.reorderThreshold && row.original.reorderThreshold > 0;
          return (
            <span className={`text-sm ${isLow ? 'text-red-600 font-semibold' : ''}`}>
              {qty}
            </span>
          );
        },
      },
      {
        accessorKey: 'retailPrice',
        header: 'Price',
        cell: ({ row }) => {
          const { isOnSale, salePrice, retailPrice } = row.original;
          if (isOnSale && salePrice) {
            return (
              <div className="text-sm">
                <span className="line-through text-gray-500">{formatCurrency(retailPrice)}</span>
                <br />
                <span className="text-green-600 font-semibold">{formatCurrency(salePrice)}</span>
              </div>
            );
          }
          return <span className="text-sm">{formatCurrency(retailPrice)}</span>;
        },
      },
      {
        accessorKey: 'alertStatus',
        header: 'Alert',
        cell: ({ row }) => <AlertBadge status={row.original.alertStatus} />,
      },
    ],
    []
  );
  
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: filters.size,
        pageIndex: filters.page,
      },
    },
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-secondary">Loading inventory...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3">
        Error loading inventory: {error.message}
      </div>
    );
  }
  
  return (
    <div className="card">
      {/* Filters */}
      <div className="card-header">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="form-label mb-1">Search</label>
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 0 })}
              className="form-input"
            />
          </div>
          
          <div className="w-48">
            <label className="form-label mb-1">Category</label>
            <select
              value={filters.category || ''}
              onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 0 })}
              className="form-select"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="w-40">
            <label className="form-label mb-1">Alert Status</label>
            <select
              value={filters.alertStatus || ''}
              onChange={(e) => setFilters({ ...filters, alertStatus: e.target.value as FilterParams['alertStatus'], page: 0 })}
              className="form-select"
            >
              <option value="">All</option>
              <option value="LOW">Low Stock</option>
              <option value="EXP">Expiring</option>
              <option value="SALE">On Sale</option>
            </select>
          </div>
          
          <div className="ml-auto">
            <Link to="/products/new">
              <Button>+ Add Product</Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="data-table w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="bg-gray-100 border border-gray-300 px-3 py-2 text-left text-xs font-semibold uppercase">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-secondary">
                  No products found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="border border-gray-300 px-3 py-2 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="card-header border-t flex justify-between items-center">
        <span className="text-sm text-secondary">
          Showing {table.getRowModel().rows.length} of {products?.total || 0} products
        </span>
        
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <span className="text-sm py-1">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
