'use client';

import { TextInput, Button, Badge, Chip, Link, Stack } from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { useState } from 'react';

// Mock transaction data
const mockTransactions = [
  { id: '1', date: '2024-01-28', merchant: 'Whole Foods', category: 'Food', amount: 87.50, currency: 'EUR' },
  { id: '2', date: '2024-01-27', merchant: 'Shell Gas Station', category: 'Transport', amount: 65.00, currency: 'EUR' },
  { id: '3', date: '2024-01-26', merchant: 'Netflix', category: 'Entertainment', amount: 15.99, currency: 'EUR' },
  { id: '4', date: '2024-01-25', merchant: 'Starbucks', category: 'Food', amount: 8.50, currency: 'EUR' },
  { id: '5', date: '2024-01-24', merchant: 'Amazon', category: 'Shopping', amount: 124.99, currency: 'EUR' },
  { id: '6', date: '2024-01-23', merchant: 'Trader Joe&apos;s', category: 'Food', amount: 45.30, currency: 'EUR' },
];

export default function SearchFilteringPage() {
  const [searchMode, setSearchMode] = useState<'traditional' | 'ai'>('traditional');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const filteredResults = mockTransactions.filter(tx => {
    if (searchQuery && !tx.merchant.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
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
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Search &amp; Filtering Pattern</h1>
      <p className="lead">
        Combining traditional keyword search with AI-powered natural language queries for flexible data exploration.
      </p>

      <h2>Two Search Modes</h2>
      <p className="text-sm text-muted-foreground">
        Fidus provides two complementary search modes to serve different user needs.
      </p>

      <div className="not-prose my-lg space-y-lg">
        <div className="rounded-lg border border-border bg-card p-lg">
          <div className="space-y-md">
            <div>
              <h3 className="text-base font-semibold mb-sm">1. Traditional Search</h3>
              <p className="text-sm text-muted-foreground">
                Keyword search with structured filters (date range, category, amount, status). Best for users who know exactly what they&apos;re looking for.
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold mb-sm">2. AI-Powered Search</h3>
              <p className="text-sm text-muted-foreground">
                Natural language queries interpreted by an LLM. Best for exploratory search and complex queries without remembering exact filter names.
              </p>
            </div>
          </div>
        </div>
      </div>

      <h2>When to Use Each Mode</h2>
      <p className="text-sm text-muted-foreground">
        Understanding the strengths of each search mode helps users choose the right approach.
      </p>

      <div className="not-prose my-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="p-md text-left font-semibold">Aspect</th>
              <th className="p-md text-left font-semibold">Traditional Search</th>
              <th className="p-md text-left font-semibold">AI-Powered Search</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="p-md font-semibold">Best For</td>
              <td className="p-md text-muted-foreground">Precise searches, power users</td>
              <td className="p-md text-muted-foreground">Exploratory search, casual users</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-md font-semibold">Input</td>
              <td className="p-md text-muted-foreground">Keywords + filters</td>
              <td className="p-md text-muted-foreground">Natural language</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-md font-semibold">Speed</td>
              <td className="p-md text-muted-foreground">Instant</td>
              <td className="p-md text-muted-foreground">1-2 seconds (LLM processing)</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-md font-semibold">Precision</td>
              <td className="p-md text-muted-foreground">High (user controls filters)</td>
              <td className="p-md text-muted-foreground">Good (LLM interprets intent)</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-md font-semibold">Learning Curve</td>
              <td className="p-md text-muted-foreground">Requires knowing filter options</td>
              <td className="p-md text-muted-foreground">Minimal (conversational)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Interactive Example</h2>
      <p className="text-sm text-muted-foreground">
        Try both search modes to experience the difference in interaction patterns.
      </p>

      <div className="not-prose my-lg">
        <ComponentPreview code={`const [searchMode, setSearchMode] = useState<'traditional' | 'ai'>('traditional');
const [searchQuery, setSearchQuery] = useState('');
const [activeFilters, setActiveFilters] = useState<string[]>([]);
const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

const toggleFilter = (filter: string) => {
  setActiveFilters(prev =>
    prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
  );
};

<Stack direction="horizontal" spacing="sm" className="mb-md">
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
</Stack>

{searchMode === 'traditional' && (
  <div className="space-y-md rounded-lg border border-border bg-card p-lg">
    <TextInput
      placeholder="Search by merchant name..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />

    <div>
      <label className="block text-sm font-semibold mb-sm">Filter by Category:</label>
      <div className="flex flex-wrap gap-sm">
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

    {/* Results display */}
  </div>
)}`}>
          <Stack direction="horizontal" spacing="sm" className="mb-md">
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
          </Stack>

          {searchMode === 'traditional' && (
            <div className="space-y-md rounded-lg border border-border bg-card p-lg">
              <TextInput
                label="Search"
                placeholder="Search by merchant name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <div>
                <label className="block text-sm font-semibold mb-sm">Filter by Category:</label>
                <div className="flex flex-wrap gap-sm">
                  {['Food', 'Transport', 'Entertainment', 'Shopping'].map(category => (
                    <Chip
                      key={category}
                      variant={activeFilters.includes(category) ? 'filled' : 'outlined'}
                      onClick={() => toggleFilter(category)}
                      className="cursor-pointer"
                    >
                      {category}
                    </Chip>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-sm">Sort By:</label>
                <Stack direction="horizontal" spacing="sm">
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
                </Stack>
              </div>

              <div className="text-sm text-muted-foreground">
                Showing {sortedResults.length} of {mockTransactions.length} transactions
              </div>

              <div className="space-y-sm">
                {sortedResults.length > 0 ? (
                  sortedResults.map(tx => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-background p-md"
                    >
                      <div>
                        <p className="font-semibold text-sm">{tx.merchant}</p>
                        <p className="text-xs text-muted-foreground">
                          {tx.date} • {tx.category}
                        </p>
                      </div>
                      <p className="font-semibold">
                        {tx.amount.toFixed(2)} {tx.currency}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-border bg-background p-lg text-center">
                    <p className="text-sm text-muted-foreground">No results found. Try adjusting your filters.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {searchMode === 'ai' && (
            <div className="space-y-md rounded-lg border border-border bg-card p-lg">
              <TextInput
                label="AI Search"
                placeholder="Ask anything... (e.g., 'Show me food expenses last month')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <div>
                <label className="block text-sm font-semibold mb-sm">Try these queries:</label>
                <div className="space-y-sm">
                  {[
                    'Show me food expenses last month',
                    'What did I spend on groceries this week?',
                    'Do I have any appointments tomorrow?',
                    'Show flights to Berlin in December',
                  ].map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSearchQuery(suggestion)}
                      className="block w-full rounded-lg border border-border bg-background p-md text-left text-sm hover:bg-muted transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {searchQuery && (
                <div className="rounded-lg bg-muted p-md">
                  <p className="text-sm font-semibold mb-sm">AI Interpretation:</p>
                  <div className="space-y-xs text-sm text-muted-foreground">
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
        </ComponentPreview>
      </div>

      <h2>Usage Guidelines</h2>
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Users need to find specific items in large datasets</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Multiple filter dimensions are available (date, category, amount, status)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Users vary from casual (prefer AI) to power users (prefer traditional)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Queries can be complex (&quot;groceries last month under 50 EUR&quot;)</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Provide both traditional and AI search modes</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Show search history and contextual suggestions</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Highlight matched keywords in results</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Debounce search input (300ms) to reduce API calls</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Show active filters as dismissible chips</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Handle typos with fuzzy matching</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Display result count and filter status clearly</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use aria-live=&quot;polite&quot; for result count announcements</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Provide keyboard shortcut (Cmd+K / Ctrl+K) to focus search</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Announce filter changes to screen readers</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Ensure filter chips have clear aria-labels for removal</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Move focus to results after search completes</span>
            </li>
          </ul>
        </div>
      </div>

      <h2 className="mt-2xl">Do&apos;s and Don&apos;ts</h2>
      <div className="not-prose grid md:grid-cols-2 gap-lg my-lg">
        <div className="border-2 border-success rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-success mb-md flex items-center gap-sm">
            <span className="text-2xl">✓</span> Do
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Provide both traditional and AI search options</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Show active filters clearly with remove buttons</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Debounce input to avoid excessive API calls</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Display result count and empty states</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Preserve search state when navigating away</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Suggest queries based on user context</span>
            </li>
          </ul>
        </div>

        <div className="border-2 border-error rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-error mb-md flex items-center gap-sm">
            <span className="text-2xl">✗</span> Don&apos;t
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Force users into one search mode only</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Hide advanced filters from power users</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Show loading spinner immediately (wait 200ms)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Clear input on failed search</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Ignore typos without fuzzy matching</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Make filters hard to discover or use</span>
            </li>
          </ul>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/text-input"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            TextInput
          </h3>
          <p className="text-sm text-muted-foreground">Search input field</p>
        </Link>

        <Link
          href="/components/chip"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Chip
          </h3>
          <p className="text-sm text-muted-foreground">Filter toggles</p>
        </Link>

        <Link
          href="/components/badge"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Badge
          </h3>
          <p className="text-sm text-muted-foreground">Result counts</p>
        </Link>

        <Link
          href="/components/button"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Button
          </h3>
          <p className="text-sm text-muted-foreground">Actions and mode toggle</p>
        </Link>

        <Link
          href="/patterns/empty-states"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Empty States
          </h3>
          <p className="text-sm text-muted-foreground">No results handling</p>
        </Link>

        <Link
          href="/patterns/loading-states"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Loading States
          </h3>
          <p className="text-sm text-muted-foreground">Search in progress</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://www.nngroup.com/articles/search-visible-and-simple/"
              external
              showIcon
            >
              Nielsen Norman Group: Search Visibility
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.nngroup.com/articles/filters-vs-facets/"
              external
              showIcon
            >
              Nielsen Norman Group: Filters vs Facets
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.nngroup.com/articles/ai-search/"
              external
              showIcon
            >
              Nielsen Norman Group: AI-Powered Search
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html"
              external
              showIcon
            >
              WCAG 2.1: Status Messages
            </Link>
          </li>
          <li>
            <Link variant="standalone" href="/getting-started/for-developers">
              Installation guide
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
