import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { useAlerts, useDismissAlert } from '@/hooks/useAlerts';
import { getDaysUntilExpiration, formatCurrency } from '@/lib/utils';
import type { Alert } from '@/types';

export function AlertsPage() {
  const [filter, setFilter] = useState<'ALL' | 'LOW_STOCK' | 'EXPIRING' | 'DISMISSED'>('ALL');
  
  const { data: alerts, isLoading } = useAlerts(filter === 'ALL' ? undefined : filter);
  const dismissMutation = useDismissAlert();
  
  const handleDismiss = async (alertId: number) => {
    try {
      await dismissMutation.mutateAsync(alertId);
    } catch (err) {
      console.error('Failed to dismiss alert:', err);
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p className="text-secondary">Loading alerts...</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-primary">Alerts & Notifications</h2>
            <p className="text-secondary text-sm mt-1">
              Monitor low stock and expiring products
            </p>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex gap-2">
          {(['ALL', 'LOW_STOCK', 'EXPIRING', 'DISMISSED'] as const).map((type) => (
            <Button
              key={type}
              variant={filter === type ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilter(type)}
            >
              {type === 'ALL' ? 'All' : type.replace('_', ' ')}
            </Button>
          ))}
        </div>
        
        {/* Alerts Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th>Priority</th>
                  <th>Product</th>
                  <th>Issue</th>
                  <th>Details</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {alerts && alerts.length > 0 ? (
                  alerts.map((alert) => (
                    <tr key={alert.alertId}>
                      <td>
                        <span className={`inline-flex px-2 py-0.5 text-xs font-semibold border ${
                          alert.priority === 'HIGH' ? 'bg-red-100 text-red-800 border-red-300' :
                          alert.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                          'bg-blue-100 text-blue-800 border-blue-300'
                        }`}>
                          {alert.priority}
                        </span>
                      </td>
                      <td>
                        <Link 
                          to={`/products/${alert.productId}`}
                          className="text-accent hover:underline font-medium"
                        >
                          {alert.productName}
                        </Link>
                      </td>
                      <td className="text-sm">
                        {alert.alertType === 'LOW_STOCK' ? (
                          <span className="text-yellow-600">Low Stock</span>
                        ) : (
                          <span className="text-red-600">Expiring</span>
                        )}
                      </td>
                      <td className="text-sm text-secondary">
                        {alert.message}
                        {alert.suggestedDiscount && (
                          <div className="mt-1 text-xs">
                            Suggested discount: {alert.suggestedDiscount}%
                          </div>
                        )}
                      </td>
                      <td>
                        {!alert.isDismissed && (
                          <div className="flex gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleDismiss(alert.alertId)}
                              isLoading={dismissMutation.isPending}
                            >
                              Dismiss
                            </Button>
                            <Link to={`/products/${alert.productId}`}>
                              <Button size="sm">View</Button>
                            </Link>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-secondary">
                      {filter === 'DISMISSED' ? 'No dismissed alerts' : 'No active alerts'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Summary */}
        <div className="flex justify-between items-center text-sm text-secondary">
          <span>
            Showing {alerts?.length || 0} alerts
          </span>
        </div>
      </div>
    </Layout>
  );
}
