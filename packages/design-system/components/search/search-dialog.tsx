'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Clock, ArrowRight } from 'lucide-react';
import {
  search,
  filterByCategory,
  getCategories,
  saveRecentSearch,
  getRecentSearches,
  clearRecentSearches,
  type SearchResult,
} from '@/lib/search';

export function SearchDialog({
  isOpen: externalIsOpen,
  onClose: externalOnClose,
  onOpen: externalOnOpen,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
} = {}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<SearchResult['category'] | 'All'>('All');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const isOpen = externalIsOpen ?? false;

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Handle keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen && externalOnClose) {
          externalOnClose();
        } else if (!isOpen && externalOnOpen) {
          externalOnOpen();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, externalOnClose, externalOnOpen]);

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle search
  useEffect(() => {
    if (query.trim()) {
      const searchResults = search(query);
      const filteredResults = filterByCategory(searchResults, selectedCategory);
      setResults(filteredResults);
      setSelectedIndex(0);
    } else {
      setResults([]);
      setSelectedIndex(0);
    }
  }, [query, selectedCategory]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        externalOnClose?.();
        setQuery('');
        setResults([]);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        handleSelect(results[selectedIndex]);
      }
    },
    [results, selectedIndex, externalOnClose]
  );

  // Handle result selection
  const handleSelect = useCallback(
    (result: SearchResult) => {
      saveRecentSearch(query);
      setRecentSearches(getRecentSearches());
      externalOnClose?.();
      setQuery('');
      setResults([]);
      router.push(result.href);
    },
    [query, router, externalOnClose]
  );

  // Handle recent search selection
  const handleRecentSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
  }, []);

  // Clear recent searches
  const handleClearRecent = useCallback(() => {
    clearRecentSearches();
    setRecentSearches([]);
  }, []);

  // Highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-primary/20 text-primary">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
        onClick={() => externalOnClose?.()}
      />

      {/* Dialog */}
      <div className="fixed left-1/2 top-[20%] z-50 w-full max-w-2xl -translate-x-1/2 rounded-lg border border-border bg-background shadow-lg">
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search components, patterns, and documentation..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={() => externalOnClose?.()}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto border-b border-border px-4 py-2">
          {getCategories().map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-2">
          {query.trim() ? (
            results.length > 0 ? (
              results.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex w-full items-start gap-3 rounded-md p-3 text-left transition-colors ${
                    selectedIndex === index
                      ? 'bg-muted'
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{highlightMatch(result.title, query)}</span>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {result.category}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {highlightMatch(result.description, query)}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No results found for "{query}"
              </div>
            )
          ) : (
            // Recent Searches
            recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between px-3 py-2">
                  <h3 className="text-sm font-semibold text-muted-foreground">Recent Searches</h3>
                  <button
                    onClick={handleClearRecent}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </button>
                </div>
                {recentSearches.map((recentQuery, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearch(recentQuery)}
                    className="flex w-full items-center gap-3 rounded-md p-3 text-left transition-colors hover:bg-muted/50"
                  >
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{recentQuery}</span>
                  </button>
                ))}
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5">↑</kbd>
              <kbd className="ml-1 rounded border border-border bg-muted px-1.5 py-0.5">↓</kbd> Navigate
            </span>
            <span>
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5">↵</kbd> Select
            </span>
            <span>
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5">Esc</kbd> Close
            </span>
          </div>
          <span>
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5">⌘</kbd>
            <kbd className="ml-1 rounded border border-border bg-muted px-1.5 py-0.5">K</kbd> to open
          </span>
        </div>
      </div>
    </>
  );
}
