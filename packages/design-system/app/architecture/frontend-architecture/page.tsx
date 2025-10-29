export default function FrontendArchitecturePage() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Frontend Architecture</h1>
      <p className="lead">
        Fidus frontend is built with Next.js 14, React 18, and TypeScript, designed for real-time
        interaction, AI-driven UI rendering, and privacy-first data handling.
      </p>

      <h2>Tech Stack</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 not-prose">
        <div className="border border-border rounded-lg p-4 bg-card">
          <h3 className="text-sm font-semibold mb-3">Core Framework</h3>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li><strong>Next.js 14:</strong> App Router, Server Components</li>
            <li><strong>React 18:</strong> Suspense, Server Components, Streaming</li>
            <li><strong>TypeScript:</strong> Strict mode, full type safety</li>
          </ul>
        </div>

        <div className="border border-border rounded-lg p-4 bg-card">
          <h3 className="text-sm font-semibold mb-3">UI & Styling</h3>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li><strong>Tailwind CSS:</strong> Utility-first styling</li>
            <li><strong>Radix UI:</strong> Accessible component primitives</li>
            <li><strong>Design Tokens:</strong> CSS variables for theming</li>
          </ul>
        </div>

        <div className="border border-border rounded-lg p-4 bg-card">
          <h3 className="text-sm font-semibold mb-3">State Management</h3>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li><strong>React Query:</strong> Server state caching</li>
            <li><strong>Zustand:</strong> Client state management</li>
            <li><strong>React Hook Form:</strong> Form state</li>
          </ul>
        </div>

        <div className="border border-border rounded-lg p-4 bg-card">
          <h3 className="text-sm font-semibold mb-3">Real-time & Data</h3>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li><strong>WebSocket:</strong> Real-time opportunities</li>
            <li><strong>Server-Sent Events:</strong> Notifications</li>
            <li><strong>Zod:</strong> Runtime validation</li>
          </ul>
        </div>
      </div>

      <h2>State Management Approaches</h2>

      <h3>Server State (React Query / SWR)</h3>
      <p>
        For data fetched from the backend API, use React Query for caching, revalidation, and
        optimistic updates:
      </p>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetch opportunities
export function useOpportunities() {
  return useQuery({
    queryKey: ['opportunities'],
    queryFn: async () => {
      const response = await fetch('/api/opportunities');
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
    refetchInterval: 30000,  // Refetch every 30s
    staleTime: 10000  // Consider fresh for 10s
  });
}

// Dismiss opportunity with optimistic update
export function useDismissOpportunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const response = await fetch(\`/api/opportunities/\${id}/dismiss\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      if (!response.ok) throw new Error('Failed to dismiss');
      return response.json();
    },
    onMutate: async ({ id }) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: ['opportunities'] });

      // Snapshot previous value
      const previous = queryClient.getQueryData(['opportunities']);

      // Optimistically update
      queryClient.setQueryData(['opportunities'], (old: any) => ({
        ...old,
        opportunities: old.opportunities.filter((o: any) => o.id !== id)
      }));

      return { previous };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(['opportunities'], context.previous);
      }
    },
    onSettled: () => {
      // Refetch to ensure sync
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    }
  });
}`}
      </pre>

      <h3>Client State (Zustand)</h3>
      <p>
        For UI state that doesn't belong to a single component (theme, sidebar open/close, etc.):
      </p>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  // Theme
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;

  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;

  // Opportunity Surface
  opportunitySurfaceOpen: boolean;
  openOpportunitySurface: () => void;
  closeOpportunitySurface: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Theme
      theme: 'system',
      setTheme: (theme) => set({ theme }),

      // Sidebar
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      // Opportunity Surface
      opportunitySurfaceOpen: false,
      openOpportunitySurface: () => set({ opportunitySurfaceOpen: true }),
      closeOpportunitySurface: () => set({ opportunitySurfaceOpen: false })
    }),
    {
      name: 'fidus-ui-state',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen
      })
    }
  )
);

// Usage in component
function Header() {
  const { theme, setTheme, toggleSidebar } = useUIStore();

  return (
    <header>
      <button onClick={toggleSidebar}>Toggle Sidebar</button>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
    </header>
  );
}`}
      </pre>

      <h3>Form State (React Hook Form)</h3>
      <p>
        For form handling with validation:
      </p>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const budgetFormSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.enum(['EUR', 'USD', 'GBP']),
  period: z.enum(['daily', 'weekly', 'monthly', 'yearly'])
});

type BudgetFormData = z.infer<typeof budgetFormSchema>;

export function BudgetForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      currency: 'EUR',
      period: 'monthly'
    }
  });

  const onSubmit = async (data: BudgetFormData) => {
    await fetch('/api/budgets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Category</label>
        <input {...register('category')} />
        {errors.category && <p>{errors.category.message}</p>}
      </div>

      <div>
        <label>Amount</label>
        <input type="number" {...register('amount', { valueAsNumber: true })} />
        {errors.amount && <p>{errors.amount.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Budget'}
      </button>
    </form>
  );
}`}
      </pre>

      <h3>URL State (Next.js searchParams)</h3>
      <p>
        For shareable state (filters, pagination, etc.):
      </p>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export function TransactionList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const category = searchParams.get('category') || 'all';
  const page = Number(searchParams.get('page')) || 1;

  const updateFilter = (newCategory: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('category', newCategory);
    params.set('page', '1');  // Reset to page 1
    router.push(\`\${pathname}?\${params.toString()}\`);
  };

  return (
    <div>
      <select value={category} onChange={(e) => updateFilter(e.target.value)}>
        <option value="all">All Categories</option>
        <option value="food">Food</option>
        <option value="transport">Transport</option>
      </select>

      {/* Transactions filtered by URL params */}
      <TransactionTable category={category} page={page} />
    </div>
  );
}`}
      </pre>

      <h2>Real-time Communication</h2>

      <h3>WebSocket for Opportunity Updates</h3>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function useOpportunityWebSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const ws = new WebSocket('wss://api.fidus.ai/opportunities/stream');

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case 'OPPORTUNITY_ADDED':
          // Add new opportunity to cache
          queryClient.setQueryData(['opportunities'], (old: any) => ({
            ...old,
            opportunities: [message.opportunity, ...old.opportunities]
          }));
          break;

        case 'OPPORTUNITY_UPDATED':
          // Update existing opportunity
          queryClient.setQueryData(['opportunities'], (old: any) => ({
            ...old,
            opportunities: old.opportunities.map((o: any) =>
              o.id === message.opportunityId
                ? { ...o, ...message.changes }
                : o
            )
          }));
          break;

        case 'OPPORTUNITY_EXPIRED':
          // Remove expired opportunity
          queryClient.setQueryData(['opportunities'], (old: any) => ({
            ...old,
            opportunities: old.opportunities.filter(
              (o: any) => o.id !== message.opportunityId
            )
          }));
          break;
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      // Implement reconnection logic
      setTimeout(() => {
        console.log('Reconnecting...');
        // Recreate WebSocket
      }, 5000);
    };

    return () => {
      ws.close();
    };
  }, [queryClient]);
}

// Usage in layout
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useOpportunityWebSocket();  // Connect to real-time updates

  return <div>{children}</div>;
}`}
      </pre>

      <h3>Server-Sent Events for Notifications</h3>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const eventSource = new EventSource('/api/notifications/stream');

    eventSource.addEventListener('notification', (event) => {
      const notification = JSON.parse(event.data);
      setNotifications((prev) => [notification, ...prev]);

      // Show OS notification if permission granted
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/icon.png'
        });
      }
    });

    eventSource.onerror = () => {
      console.error('SSE error');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return notifications;
}`}
      </pre>

      <h3>Optimistic Updates Pattern</h3>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`// Pattern: Update UI immediately, rollback on error
export function useToggleBudgetAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (budgetId: string) => {
      const response = await fetch(\`/api/budgets/\${budgetId}/toggle-alert\`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed');
      return response.json();
    },

    // 1. Optimistic update BEFORE request completes
    onMutate: async (budgetId) => {
      await queryClient.cancelQueries({ queryKey: ['budgets'] });

      const previous = queryClient.getQueryData(['budgets']);

      queryClient.setQueryData(['budgets'], (old: any) => ({
        ...old,
        budgets: old.budgets.map((b: any) =>
          b.id === budgetId
            ? { ...b, alertEnabled: !b.alertEnabled }
            : b
        )
      }));

      return { previous };
    },

    // 2. Rollback if error
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['budgets'], context.previous);
      }
      toast.error('Failed to toggle alert');
    },

    // 3. Refetch to ensure sync
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    }
  });
}`}
      </pre>

      <h2>Routing Structure</h2>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`app/
├── layout.tsx                    # Root layout
├── page.tsx                      # Homepage (/)
├── (dashboard)/                  # Route group
│   ├── layout.tsx                # Dashboard layout
│   ├── page.tsx                  # Dashboard (/)
│   ├── opportunities/
│   │   └── [id]/
│   │       └── page.tsx          # Opportunity detail
│   ├── calendar/
│   │   ├── page.tsx              # Calendar view
│   │   └── [eventId]/
│   │       └── page.tsx          # Event detail
│   ├── finance/
│   │   ├── page.tsx              # Finance overview
│   │   ├── budgets/
│   │   │   └── page.tsx          # Budgets list
│   │   └── transactions/
│   │       └── page.tsx          # Transactions list
│   └── settings/
│       └── page.tsx              # Settings
├── api/                          # API routes
│   ├── opportunities/
│   │   ├── route.ts              # GET /api/opportunities
│   │   └── [id]/
│   │       ├── dismiss/
│   │       │   └── route.ts      # POST dismiss
│   │       └── engage/
│   │           └── route.ts      # POST engage
│   └── ui-decision/
│       └── route.ts              # POST /api/ui-decision
└── error.tsx                     # Error boundary`}
      </pre>

      <h2>Component Architecture</h2>

      <h3>Server Components (Default)</h3>
      <p>
        Use Server Components for static content and data fetching:
      </p>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`// Server Component (default in App Router)
export default async function BudgetPage() {
  // Fetch data directly in Server Component
  const budgets = await fetch('https://api.fidus.ai/budgets', {
    next: { revalidate: 60 }  // Cache for 60 seconds
  }).then(res => res.json());

  return (
    <div>
      <h1>Budgets</h1>
      {budgets.map((budget: Budget) => (
        <BudgetCard key={budget.id} budget={budget} />
      ))}
    </div>
  );
}`}
      </pre>

      <h3>Client Components ('use client')</h3>
      <p>
        Use Client Components for interactivity:
      </p>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`'use client';

import { useState } from 'react';

export function BudgetCard({ budget }: { budget: Budget }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <button onClick={() => setExpanded(!expanded)}>
        {budget.category}: {budget.spent} / {budget.limit}
      </button>

      {expanded && (
        <div>
          <TransactionList budgetId={budget.id} />
        </div>
      )}
    </div>
  );
}`}
      </pre>

      <h3>Composition Pattern</h3>
      <p>
        Combine Server and Client Components for optimal performance:
      </p>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`// Server Component
export default async function DashboardPage() {
  const opportunities = await fetchOpportunities();

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Client Component for interactivity */}
      <OpportunitySurface initialOpportunities={opportunities} />
    </div>
  );
}

// Client Component
'use client';

export function OpportunitySurface({
  initialOpportunities
}: {
  initialOpportunities: Opportunity[]
}) {
  const { data: opportunities } = useOpportunities({
    initialData: initialOpportunities  // Use server data as initial
  });

  return (
    <div>
      {opportunities.map(opp => (
        <OpportunityCard key={opp.id} opportunity={opp} />
      ))}
    </div>
  );
}`}
      </pre>

      <h2>Data Fetching</h2>

      <h3>Server-Side (Server Components)</h3>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`// Fetch with caching
export default async function CalendarPage() {
  const events = await fetch('https://api.fidus.ai/calendar/events', {
    next: { revalidate: 300 }  // Revalidate every 5 minutes
  }).then(res => res.json());

  return <CalendarView events={events} />;
}

// Fetch without caching (always fresh)
export default async function LiveDashboard() {
  const opportunities = await fetch('https://api.fidus.ai/opportunities', {
    cache: 'no-store'
  }).then(res => res.json());

  return <OpportunitySurface opportunities={opportunities} />;
}

// Streaming with Suspense
export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>

      <Suspense fallback={<LoadingSkeleton />}>
        <OpportunityList />  {/* Streams when ready */}
      </Suspense>

      <Suspense fallback={<LoadingSkeleton />}>
        <UpcomingEvents />  {/* Streams independently */}
      </Suspense>
    </div>
  );
}`}
      </pre>

      <h3>Client-Side (React Query)</h3>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`'use client';

export function TransactionList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await fetch('/api/transactions');
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    }
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {data.transactions.map((tx: Transaction) => (
        <TransactionCard key={tx.id} transaction={tx} />
      ))}
    </div>
  );
}`}
      </pre>

      <h2>Performance Considerations</h2>

      <h3>Code Splitting</h3>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`import dynamic from 'next/dynamic';

// Lazy load heavy components
const BudgetChart = dynamic(() => import('@/components/BudgetChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false  // Don't render on server
});

export function BudgetPage() {
  return (
    <div>
      <h1>Budget Overview</h1>
      <BudgetChart />  {/* Loaded only when needed */}
    </div>
  );
}`}
      </pre>

      <h3>Image Optimization</h3>

      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`import Image from 'next/image';

export function UserAvatar({ user }: { user: User }) {
  return (
    <Image
      src={user.avatarUrl}
      alt={user.name}
      width={40}
      height={40}
      priority={false}  // Lazy load
      placeholder="blur"
      blurDataURL="/placeholder.jpg"
    />
  );
}`}
      </pre>

      <h3>Caching Strategies</h3>

      <div className="bg-muted/30 border border-border rounded-lg p-6 my-6 not-prose">
        <h3 className="text-sm font-semibold mb-3">React Query Cache Configuration</h3>
        <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
{`const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,  // 5 minutes
      cacheTime: 1000 * 60 * 30,  // 30 minutes
      retry: 3,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true
    }
  }
});`}
        </pre>
      </div>

      <h2>Benefits</h2>

      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 my-6">
        <ul className="space-y-2 text-sm">
          <li>✅ <strong>Type-Safe:</strong> Full TypeScript coverage with Zod validation</li>
          <li>✅ <strong>Real-time:</strong> WebSocket and SSE for live updates</li>
          <li>✅ <strong>Optimistic UI:</strong> Instant feedback with rollback on error</li>
          <li>✅ <strong>Performance:</strong> Server Components, code splitting, caching</li>
          <li>✅ <strong>Developer Experience:</strong> Hot reload, TypeScript, React DevTools</li>
          <li>✅ <strong>Scalable:</strong> Modular architecture, composable components</li>
        </ul>
      </div>

      <h2>Related Documentation</h2>
      <ul>
        <li><a href="/architecture/ui-decision-layer">UI Decision Layer</a> - How UI is determined</li>
        <li><a href="/architecture/component-registry">Component Registry</a> - Component resolution</li>
        <li><a href="/architecture/opportunity-surface-service">Opportunity Surface Service</a> - Dashboard backend</li>
      </ul>
    </div>
  );
}
