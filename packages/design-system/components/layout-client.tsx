'use client';

import { useState } from 'react';
import { Header } from './navigation/header';
import { Sidebar } from './navigation/sidebar';
import { SearchDialog } from './search/search-dialog';

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <Header
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        onSearchClick={() => setIsSearchOpen(true)}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <SearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onOpen={() => setIsSearchOpen(true)}
      />

      {/* Main content area with proper spacing for sidebar */}
      <main className="lg:pl-64 pt-0 md:pt-16">
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
