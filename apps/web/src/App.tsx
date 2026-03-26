import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Dashboard } from '@/pages/Dashboard';
import { ProductDetail } from '@/pages/ProductDetail';
import { ProductForm } from '@/pages/ProductForm';
import { AlertsPage } from '@/pages/Alerts';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products/new" element={<ProductForm />} />
          <Route path="/products/:productId" element={<ProductDetail />} />
          <Route path="/products/:productId/edit" element={<ProductForm />} />
          <Route path="/alerts" element={<AlertsPage />} />
        </Routes>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
