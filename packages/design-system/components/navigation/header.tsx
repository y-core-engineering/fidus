'use client';

import Link from 'next/link';
import { Search, Moon, Sun, Menu } from 'lucide-react';
import { IconButton } from '@fidus/ui';
import { useState } from 'react';

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="sticky top-0 z-sticky border-b border-border bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {onMenuClick && (
            <IconButton
              variant="tertiary"
              size="md"
              aria-label="Toggle menu"
              onClick={onMenuClick}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </IconButton>
          )}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80">
            <div className="h-8 w-8 rounded-md bg-primary" />
            <span className="text-xl font-bold">Fidus Design System</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <IconButton
            variant="tertiary"
            size="md"
            aria-label="Search"
            className="hidden sm:flex"
          >
            <Search className="h-5 w-5" />
          </IconButton>
          <IconButton
            variant="tertiary"
            size="md"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            onClick={toggleTheme}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </IconButton>
        </div>
      </div>
    </header>
  );
}
