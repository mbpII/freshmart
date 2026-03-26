import React from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-bg-secondary">
      <Header />
      <main className="container-tight py-6">
        {children}
      </main>
    </div>
  );
}
