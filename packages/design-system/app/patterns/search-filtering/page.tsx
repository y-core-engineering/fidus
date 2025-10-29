'use client';

import { TextInput, Button, Badge, Chip, Tabs, Tab } from '@fidus/ui';
import { useState } from 'react';

// Mock transaction data
const mockTransactions = [
  { id: '1', date: '2024-01-28', merchant: 'Whole Foods', category: 'Food', amount: 87.50, currency: 'EUR' },
  { id: '2', date: '2024-01-27', merchant: 'Shell Gas Station', category: 'Transport', amount: 65.00, currency: 'EUR' },
  { id: '3', date: '2024-01-26', merchant: 'Netflix', category: 'Entertainment', amount: 15.99, currency: 'EUR' },
  { id: '4', date: '2024-01-25', merchant: 'Starbucks', category: 'Food', amount: 8.50, currency: 'EUR' },
  { id: '5', date: '2024-01-24', merchant: 'Amazon', category: 'Shopping', amount: 124.99, currency: 'EUR' },
  { id: '6', date: '2024-01-23', merchant: 'Trader Joe\'s', category: 'Food', amount: 45.30, currency: 'EUR' },
];

export default function SearchFilteringPage() {
  const [searchMode, setSearchMode] = useState<'traditional' | 'ai'>('traditional');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // AI search suggestions
  const aiSuggestions = [
    'Show me food expenses last month',
    'What did I spend on groceries this week?',
    'Do I have any appointments tomorrow?',
    'Show flights to Berlin in December',
  ];

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const filteredResults = mockTransactions.filter(tx => {
    // Text search
    if (searchQuery && !tx.merchant.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Category filter
    if (activeFilters.length > 0 && !activeFilters.includes(tx.category)) {
      return false;
    }
    return true;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return b.amount - a.amount;
  });

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Search & Filtering Patterns</h1>
        <p className="text-lg text-muted-foreground">
          Combining traditional keyword search with AI-powered natural language queries for flexible data exploration.
        </p>
      </div>

      {/* Two Search Modes */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Two Search Modes</h2>
          <div className="space-y-3 rounded-lg border border-border bg-card p-6">
            <p className="text-muted-foreground">
              Fidus provides two complementary search modes to serve different user needs:
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">1. Traditional Search</h3>
                <p className="text-sm text-muted-foreground">
                  Keyword search with structured filters (date range, category, amount, status). Best for users who know exactly what they're looking for.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">2. AI-Powered Search</h3>
                <p className="text-sm text-muted-foreground">
                  Natural language queries interpreted by an LLM. Best for exploratory search and complex queries without remembering exact filter names.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mode Comparison Table */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">When to Use Each Mode</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-3 text-left font-semibold">Aspect</th>
                  <th className="p-3 text-left font-semibold">Traditional Search</th>
                  <th className="p-3 text-left font-semibold">AI-Powered Search</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-3 font-semibold">Best For</td>
                  <td className="p-3 text-muted-foreground">Precise searches, power users</td>
                  <td className="p-3 text-muted-foreground">Exploratory search, casual users</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-semibold">Input</td>
                  <td className="p-3 text-muted-foreground">Keywords + filters</td>
                  <td className="p-3 text-muted-foreground">Natural language</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-semibold">Speed</td>
                  <td className="p-3 text-muted-foreground">Instant</td>
                  <td className="p-3 text-muted-foreground">1-2 seconds (LLM processing)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-semibold">Precision</td>
                  <td className="p-3 text-muted-foreground">High (user controls filters)</td>
                  <td className="p-3 text-muted-foreground">Good (LLM interprets intent)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-semibold">Learning Curve</td>
                  <td className="p-3 text-muted-foreground">Requires knowing filter options</td>
                  <td className="p-3 text-muted-foreground">Minimal (conversational)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Live Example */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Live Example: Transaction Search</h2>

          {/* Mode Toggle */}
          <div className="mb-4 flex gap-2">
            <Button
              variant={searchMode === 'traditional' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSearchMode('traditional')}
            >
              Traditional Search
            </Button>
            <Button
              variant={searchMode === 'ai' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSearchMode('ai')}
            >
              AI-Powered Search
            </Button>
          </div>

          {/* Traditional Search Interface */}
          {searchMode === 'traditional' && (
            <div className="space-y-4 rounded-lg border border-border bg-card p-6">
              <TextInput
                placeholder="Search by merchant name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {/* Filters */}
              <div>
                <label className="mb-2 block text-sm font-semibold">Filter by Category:</label>
                <div className="flex flex-wrap gap-2">
                  {['Food', 'Transport', 'Entertainment', 'Shopping'].map(category => (
                    <Chip
                      key={category}
                      label={category}
                      active={activeFilters.includes(category)}
                      onToggle={() => toggleFilter(category)}
                    />
                  ))}
                </div>
              </div>

              {/* Sort & View Options */}
              <div className="flex items-center gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold">Sort By:</label>
                  <div className="flex gap-2">
                    <Button
                      variant={sortBy === 'date' ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setSortBy('date')}
                    >
                      Date
                    </Button>
                    <Button
                      variant={sortBy === 'amount' ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setSortBy('amount')}
                    >
                      Amount
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">View:</label>
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === 'list' ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      List
                    </Button>
                    <Button
                      variant={viewMode === 'grid' ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      Grid
                    </Button>
                  </div>
                </div>
              </div>

              {/* Results Count */}
              <div className="text-sm text-muted-foreground">
                Showing {sortedResults.length} of {mockTransactions.length} transactions
              </div>

              {/* Results */}
              <div className="space-y-2">
                {sortedResults.length > 0 ? (
                  sortedResults.map(tx => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
                    >
                      <div>
                        <p className="font-semibold">{tx.merchant}</p>
                        <p className="text-sm text-muted-foreground">
                          {tx.date} • {tx.category}
                        </p>
                      </div>
                      <p className="text-lg font-semibold">
                        {tx.amount.toFixed(2)} {tx.currency}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-border bg-background p-8 text-center">
                    <p className="text-muted-foreground">No results found. Try adjusting your filters.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AI-Powered Search Interface */}
          {searchMode === 'ai' && (
            <div className="space-y-4 rounded-lg border border-border bg-card p-6">
              <TextInput
                placeholder="Ask anything... (e.g., 'Show me food expenses last month')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {/* AI Query Suggestions */}
              <div>
                <label className="mb-2 block text-sm font-semibold">Try these queries:</label>
                <div className="space-y-2">
                  {aiSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSearchQuery(suggestion)}
                      className="block w-full rounded-lg border border-border bg-background p-3 text-left text-sm hover:bg-muted"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Processing Indicator */}
              {searchQuery && (
                <div className="rounded-lg bg-muted p-4">
                  <p className="mb-2 text-sm font-semibold">AI Interpretation:</p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Detected intent: <strong>Search transactions</strong></p>
                    <p>• Filters extracted: <strong>Category: Food, Time: Last month</strong></p>
                    <p>• Showing results sorted by: <strong>Date (descending)</strong></p>
                  </div>
                </div>
              )}

              <div className="text-sm text-muted-foreground">
                AI-powered search interprets your natural language query and applies relevant filters automatically.
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Traditional Search Implementation */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Traditional Search Implementation</h2>

          <div className="space-y-4">
            <div>
              <h3 className="mb-3 font-semibold">Debounced Search Input</h3>
              <div className="rounded-lg bg-muted p-4">
                <pre className="overflow-x-auto text-xs">
{`import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/use-debounce';

function TransactionSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300); // 300ms delay

  useEffect(() => {
    if (debouncedQuery) {
      // Perform search
      searchTransactions(debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <TextInput
      placeholder="Search transactions..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  );
}`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-semibold">Filter Management</h3>
              <div className="rounded-lg bg-muted p-4">
                <pre className="overflow-x-auto text-xs">
{`const [filters, setFilters] = useState({
  categories: [],
  dateRange: { start: null, end: null },
  amountRange: { min: 0, max: Infinity },
  status: 'all',
});

const updateFilter = (key: string, value: any) => {
  setFilters(prev => ({ ...prev, [key]: value }));
};

const clearFilters = () => {
  setFilters({
    categories: [],
    dateRange: { start: null, end: null },
    amountRange: { min: 0, max: Infinity },
    status: 'all',
  });
};

// Apply filters
const filteredResults = transactions.filter(tx => {
  if (filters.categories.length > 0 && !filters.categories.includes(tx.category)) {
    return false;
  }
  if (filters.dateRange.start && tx.date < filters.dateRange.start) {
    return false;
  }
  if (tx.amount < filters.amountRange.min || tx.amount > filters.amountRange.max) {
    return false;
  }
  return true;
});`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-semibold">Search with React Query</h3>
              <div className="rounded-lg bg-muted p-4">
                <pre className="overflow-x-auto text-xs">
{`import { useQuery } from '@tanstack/react-query';

function useTransactionSearch(query: string, filters: Filters) {
  return useQuery({
    queryKey: ['transactions', 'search', query, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        q: query,
        categories: filters.categories.join(','),
        sortBy: filters.sortBy,
      });

      const response = await fetch(\`/api/transactions/search?\${params}\`);
      return response.json();
    },
    enabled: query.length >= 3, // Only search when 3+ characters
  });
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI-Powered Search Implementation */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">AI-Powered Search Implementation</h2>

          <div className="space-y-4">
            <div>
              <h3 className="mb-3 font-semibold">LLM Intent Extraction</h3>
              <div className="rounded-lg bg-muted p-4">
                <pre className="overflow-x-auto text-xs">
{`async function aiSearch(query: string) {
  // Send query to LLM for intent extraction
  const response = await fetch('/api/ai/search', {
    method: 'POST',
    body: JSON.stringify({ query }),
  });

  const result = await response.json();
  // Result:
  // {
  //   intent: 'search_transactions',
  //   filters: {
  //     categories: ['Food'],
  //     dateRange: { start: '2024-01-01', end: '2024-01-31' }
  //   },
  //   sortBy: 'date',
  //   confidence: 0.95
  // }

  return result;
}`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-semibold">Streaming Search Results</h3>
              <div className="rounded-lg bg-muted p-4">
                <pre className="overflow-x-auto text-xs">
{`function AISearchResults({ query }: { query: string }) {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    setIsLoading(true);
    const eventSource = new EventSource(
      \`/api/ai/search/stream?q=\${encodeURIComponent(query)}\`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'result') {
        setResults(prev => [...prev, data.result]);
      } else if (data.type === 'done') {
        setIsLoading(false);
        eventSource.close();
      }
    };

    return () => eventSource.close();
  }, [query]);

  return (
    <>
      {results.map(result => (
        <ResultCard key={result.id} {...result} />
      ))}
      {isLoading && <LoadingSpinner />}
    </>
  );
}`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-semibold">Query Suggestions</h3>
              <div className="rounded-lg bg-muted p-4">
                <pre className="overflow-x-auto text-xs">
{`function SearchSuggestions() {
  const { data: suggestions } = useQuery({
    queryKey: ['search', 'suggestions'],
    queryFn: async () => {
      // LLM generates contextual suggestions
      const response = await fetch('/api/ai/search/suggestions', {
        headers: {
          'X-User-Context': JSON.stringify({
            recentQueries: getRecentQueries(),
            currentView: 'transactions',
            userHistory: getUserHistory(),
          }),
        },
      });
      return response.json();
    },
  });

  return (
    <div>
      <p className="text-sm font-semibold">Try these queries:</p>
      {suggestions?.map((suggestion: string) => (
        <Button
          key={suggestion}
          variant="ghost"
          onClick={() => handleSearch(suggestion)}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search UI Components */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Search UI Components</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-3 text-left font-semibold">Component</th>
                  <th className="p-3 text-left font-semibold">Purpose</th>
                  <th className="p-3 text-left font-semibold">Features</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-xs">SearchInput</td>
                  <td className="p-3">Main search field</td>
                  <td className="p-3 text-muted-foreground">Debounced, autocomplete, clear button</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-xs">FilterBar</td>
                  <td className="p-3">Active filters display</td>
                  <td className="p-3 text-muted-foreground">Chips with remove, clear all button</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-xs">ResultsList</td>
                  <td className="p-3">Search results container</td>
                  <td className="p-3 text-muted-foreground">Highlighting, pagination, sorting</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-xs">EmptyState</td>
                  <td className="p-3">No results display</td>
                  <td className="p-3 text-muted-foreground">Suggestions, clear filters button</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Best Practices</h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-3 font-semibold text-success">✅ Do</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Provide both traditional and AI search modes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Show search history and suggestions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Highlight matched keywords in results</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Debounce search input (300ms)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Show active filters as dismissible chips</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Handle typos and fuzzy matching</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-error bg-error/5 p-6">
              <h3 className="mb-3 font-semibold text-error">❌ Don't</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  <span>Hide advanced filters from power users</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  <span>Ignore typos (use fuzzy matching)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  <span>Show loading spinner immediately (wait 200ms)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  <span>Force one search mode (provide both)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">✗</span>
                  <span>Clear input on failed search</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Accessibility</h2>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            <li><strong>ARIA Live Region:</strong> Result count announced with aria-live="polite"</li>
            <li><strong>Keyboard Shortcuts:</strong> Ctrl+K (Windows) / Cmd+K (Mac) to focus search</li>
            <li><strong>Screen Reader Announcements:</strong> "Showing 5 results for 'groceries'"</li>
            <li><strong>Clear Labels:</strong> Filter chips have aria-label for removal</li>
            <li><strong>Focus Management:</strong> Focus moves to results after search</li>
          </ul>
        </div>
      </section>

      {/* Related Components */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Related Components</h2>
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">TextInput</Badge>
            <Badge variant="default">Chip</Badge>
            <Badge variant="default">Badge</Badge>
            <Badge variant="default">Button</Badge>
            <Badge variant="default">EmptyCard</Badge>
          </div>
        </div>
      </section>
    </div>
  );
}
