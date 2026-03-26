import React from 'react';
import { Link } from 'react-router-dom';
import { STORES } from '@/lib/constants';

export function Header() {
  // For MVP, hardcoded to Downtown (101)
  const currentStore = STORES.find(s => s.storeId === 101);
  
  return (
    <header className="bg-primary text-white border-b border-gray-700">
      <div className="container-tight py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold tracking-tight">
              INVENTORY MANAGEMENT
            </h1>
            <span className="text-sm text-gray-400">
              {currentStore?.storeName} (Store 101)
            </span>
          </div>
          
          <nav className="flex items-center gap-2">
            <Link 
              to="/" 
              className="text-sm px-3 py-2 hover:bg-gray-800 transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              to="/alerts" 
              className="text-sm px-3 py-2 hover:bg-gray-800 transition-colors"
            >
              Alerts
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
