import React from 'react';
import type { ProductWithInventory } from '@/types';

interface BadgeProps {
  status: ProductWithInventory['alertStatus'];
}

export function AlertBadge({ status }: BadgeProps) {
  if (!status || status === 'OK') return null;
  
  const badgeClasses = {
    LOW: 'badge-low',
    EXP: 'badge-exp',
    SALE: 'badge-sale',
  };
  
  const labels = {
    LOW: 'LOW',
    EXP: 'EXP',
    SALE: '[S]',
  };
  
  return (
    <span className={badgeClasses[status]}>
      {labels[status]}
    </span>
  );
}

interface AlertProps {
  message: string;
  type?: 'error' | 'warning' | 'success' | 'info';
  onDismiss?: () => void;
}

export function Alert({ message, type = 'info', onDismiss }: AlertProps) {
  const colors = {
    error: 'bg-red-100 border-red-400 text-red-800',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-800',
    success: 'bg-green-100 border-green-400 text-green-800',
    info: 'bg-blue-100 border-blue-400 text-blue-800',
  };
  
  return (
    <div className={`${colors[type]} border px-4 py-3 mb-4`} role="alert">
      <div className="flex justify-between items-center">
        <span className="text-sm">{message}</span>
        {onDismiss && (
          <button 
            onClick={onDismiss}
            className="text-sm font-bold hover:opacity-75"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
