'use client';

import { Inter } from 'next/font/google';
import { useState } from 'react';
import '../styles/globals.css';
import { Header } from '../components/navigation/header';
import { Sidebar } from '../components/navigation/sidebar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <Sidebar isOpen={isSidebarOpen} />

        {/* Main content area with proper spacing for sidebar */}
        <main className="lg:pl-64 pt-16">
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </main>

        {/* Overlay for mobile when sidebar is open */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-overlay lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </body>
    </html>
  );
}
