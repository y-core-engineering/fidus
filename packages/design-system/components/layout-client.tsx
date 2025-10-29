'use client';

import { useState } from 'react';
import { Header } from './navigation/header';
import { Sidebar } from './navigation/sidebar';
import { SearchDialog } from './search/search-dialog';

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} />
      <SearchDialog />

      {/* Main content area with proper spacing for sidebar */}
      <main className="lg:pl-64 pt-16">
        <div className="container mx-auto px-4 py-8">{children}</div>
      </main>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-overlay lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
}
