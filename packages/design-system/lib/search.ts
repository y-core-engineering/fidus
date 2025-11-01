/**
 * Search functionality for the Fidus Design System
 */
import FlexSearch from 'flexsearch';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  href: string;
  category: 'Component' | 'Pattern' | 'Foundation' | 'Architecture' | 'Token' | 'Guide' | 'Resource';
}

// Search index data - all pages from the design system
const searchData: SearchResult[] = [
  // Getting Started
  { id: 'overview', title: 'Overview', description: 'Introduction to the Fidus Design System', href: '/getting-started/overview', category: 'Guide' },
  { id: 'for-designers', title: 'For Designers', description: 'Design guidelines and resources for designers', href: '/getting-started/for-designers', category: 'Guide' },
  { id: 'for-developers', title: 'For Developers', description: 'Development setup and implementation guides', href: '/getting-started/for-developers', category: 'Guide' },
  { id: 'design-philosophy', title: 'Design Philosophy', description: 'Core principles and design philosophy', href: '/getting-started/design-philosophy', category: 'Guide' },

  // Design Tokens
  { id: 'color-tokens', title: 'Color Tokens', description: 'Design tokens for colors, including primary, secondary, and semantic colors', href: '/tokens/color-tokens', category: 'Token' },
  { id: 'typography-tokens', title: 'Typography Tokens', description: 'Typography design tokens including font families, sizes, and weights', href: '/tokens/typography-tokens', category: 'Token' },
  { id: 'spacing-tokens', title: 'Spacing Tokens', description: 'Spacing design tokens for consistent layout spacing', href: '/tokens/spacing-tokens', category: 'Token' },
  { id: 'shadow-tokens', title: 'Shadow Tokens', description: 'Shadow design tokens for elevation and depth', href: '/tokens/shadow-tokens', category: 'Token' },
  { id: 'motion-tokens', title: 'Motion Tokens', description: 'Motion and animation design tokens for transitions', href: '/tokens/motion-tokens', category: 'Token' },

  // Foundations
  { id: 'ai-driven-ui', title: 'AI-Driven UI', description: 'Context-adaptive UI paradigm powered by LLM decision making', href: '/foundations/ai-driven-ui', category: 'Foundation' },
  { id: 'privacy-ux', title: 'Privacy & UX', description: 'Privacy-first design patterns and user trust', href: '/foundations/privacy-ux', category: 'Foundation' },
  { id: 'icons', title: 'Icons', description: 'Icon system and usage guidelines', href: '/foundations/icons', category: 'Foundation' },
  { id: 'accessibility', title: 'Accessibility', description: 'Accessibility standards and WCAG compliance', href: '/foundations/accessibility', category: 'Foundation' },
  { id: 'responsive-design', title: 'Responsive Design', description: 'Responsive design principles and breakpoints', href: '/foundations/responsive-design', category: 'Foundation' },

  // Layout Components
  { id: 'container', title: 'Container', description: 'Container component for content width constraints', href: '/components/container', category: 'Component' },
  { id: 'grid', title: 'Grid', description: 'Grid layout system for responsive layouts', href: '/components/grid', category: 'Component' },
  { id: 'stack', title: 'Stack', description: 'Stack component for vertical and horizontal layouts', href: '/components/stack', category: 'Component' },
  { id: 'divider', title: 'Divider', description: 'Divider component for visual separation', href: '/components/divider', category: 'Component' },

  // Action Components
  { id: 'button', title: 'Button', description: 'Button component with variants and states', href: '/components/button', category: 'Component' },
  { id: 'link', title: 'Link', description: 'Link component for navigation', href: '/components/link', category: 'Component' },
  { id: 'icon-button', title: 'Icon Button', description: 'Icon button for actions without text labels', href: '/components/icon-button', category: 'Component' },
  { id: 'button-group', title: 'Button Group', description: 'Button group for related actions', href: '/components/button-group', category: 'Component' },

  // Data Display Components
  { id: 'table', title: 'Table', description: 'Table component for structured data display', href: '/components/table', category: 'Component' },
  { id: 'list', title: 'List', description: 'List component for collections of items', href: '/components/list', category: 'Component' },
  { id: 'badge', title: 'Badge', description: 'Badge component for labels and status indicators', href: '/components/badge', category: 'Component' },
  { id: 'chip', title: 'Chip', description: 'Chip component for tags and filters', href: '/components/chip', category: 'Component' },
  { id: 'avatar', title: 'Avatar', description: 'Avatar component for user representation', href: '/components/avatar', category: 'Component' },

  // Card Components
  { id: 'opportunity-card', title: 'Opportunity Card', description: 'Card for displaying AI-driven opportunities on the Opportunity Surface', href: '/components/opportunity-card', category: 'Component' },
  { id: 'detail-card', title: 'Detail Card', description: 'Card for displaying detailed information', href: '/components/detail-card', category: 'Component' },
  { id: 'empty-card', title: 'Empty Card', description: 'Card for empty states with actions', href: '/components/empty-card', category: 'Component' },

  // Form Components
  { id: 'text-input', title: 'Text Input', description: 'Text input field for single-line text entry', href: '/components/text-input', category: 'Component' },
  { id: 'text-area', title: 'Text Area', description: 'Text area for multi-line text input', href: '/components/text-area', category: 'Component' },
  { id: 'checkbox', title: 'Checkbox', description: 'Checkbox for boolean selection', href: '/components/checkbox', category: 'Component' },
  { id: 'radio-button', title: 'Radio Button', description: 'Radio button for single selection from multiple options', href: '/components/radio-button', category: 'Component' },
  { id: 'toggle-switch', title: 'Toggle Switch', description: 'Toggle switch for on/off states', href: '/components/toggle-switch', category: 'Component' },
  { id: 'select', title: 'Select', description: 'Select dropdown for choosing from a list of options', href: '/components/select', category: 'Component' },
  { id: 'date-picker', title: 'Date Picker', description: 'Date picker for selecting dates', href: '/components/date-picker', category: 'Component' },
  { id: 'time-picker', title: 'Time Picker', description: 'Time picker for selecting time', href: '/components/time-picker', category: 'Component' },
  { id: 'file-upload', title: 'File Upload', description: 'File upload component for uploading files', href: '/components/file-upload', category: 'Component' },

  // Feedback Components
  { id: 'toast', title: 'Toast', description: 'Toast notification for temporary messages', href: '/components/toast', category: 'Component' },
  { id: 'modal', title: 'Modal', description: 'Modal dialog for focused interactions', href: '/components/modal', category: 'Component' },
  { id: 'alert', title: 'Alert', description: 'Alert component for important messages', href: '/components/alert', category: 'Component' },
  { id: 'banner', title: 'Banner', description: 'Banner for persistent page-level messages', href: '/components/banner', category: 'Component' },
  { id: 'progress-bar', title: 'Progress Bar', description: 'Progress bar for showing task completion', href: '/components/progress-bar', category: 'Component' },

  // Overlay Components
  { id: 'dropdown', title: 'Dropdown', description: 'Dropdown menu for contextual actions', href: '/components/dropdown', category: 'Component' },
  { id: 'popover', title: 'Popover', description: 'Popover for contextual information', href: '/components/popover', category: 'Component' },
  { id: 'tooltip', title: 'Tooltip', description: 'Tooltip for additional information on hover', href: '/components/tooltip', category: 'Component' },
  { id: 'drawer', title: 'Drawer', description: 'Drawer for side panel navigation', href: '/components/drawer', category: 'Component' },

  // Navigation Components
  { id: 'tabs', title: 'Tabs', description: 'Tabs for organizing content into sections', href: '/components/tabs', category: 'Component' },
  { id: 'breadcrumbs', title: 'Breadcrumbs', description: 'Breadcrumbs for hierarchical navigation', href: '/components/breadcrumbs', category: 'Component' },
  { id: 'pagination', title: 'Pagination', description: 'Pagination for navigating through pages', href: '/components/pagination', category: 'Component' },
  { id: 'header', title: 'Header', description: 'Header component for page navigation', href: '/components/header', category: 'Component' },
  { id: 'sidebar', title: 'Sidebar', description: 'Sidebar for main navigation', href: '/components/sidebar', category: 'Component' },

  // Patterns
  { id: 'form-validation', title: 'Form Validation', description: 'Patterns for form validation and error handling', href: '/patterns/form-validation', category: 'Pattern' },
  { id: 'error-states', title: 'Error States', description: 'Patterns for displaying error states', href: '/patterns/error-states', category: 'Pattern' },
  { id: 'empty-states', title: 'Empty States', description: 'Patterns for empty states with actions', href: '/patterns/empty-states', category: 'Pattern' },
  { id: 'loading-states', title: 'Loading States', description: 'Patterns for loading and skeleton states', href: '/patterns/loading-states', category: 'Pattern' },
  { id: 'success-confirmation', title: 'Success Confirmation', description: 'Patterns for success feedback and confirmation', href: '/patterns/success-confirmation', category: 'Pattern' },
  { id: 'onboarding', title: 'Onboarding', description: 'Patterns for user onboarding flows', href: '/patterns/onboarding', category: 'Pattern' },
  { id: 'multi-tenancy', title: 'Multi-Tenancy', description: 'Patterns for multi-tenant applications', href: '/patterns/multi-tenancy', category: 'Pattern' },
  { id: 'opportunity-surface', title: 'Opportunity Surface', description: 'Pattern for AI-driven opportunity discovery', href: '/patterns/opportunity-surface', category: 'Pattern' },
  { id: 'search-filtering', title: 'Search & Filtering', description: 'Patterns for search and filtering interfaces', href: '/patterns/search-filtering', category: 'Pattern' },
  { id: 'settings', title: 'Settings', description: 'Patterns for settings and preferences', href: '/patterns/settings', category: 'Pattern' },

  // Architecture
  { id: 'ui-decision-layer', title: 'UI Decision Layer', description: 'LLM-powered layer that decides which UI to render', href: '/architecture/ui-decision-layer', category: 'Architecture' },
  { id: 'component-registry', title: 'Component Registry', description: 'Central registry for component discovery', href: '/architecture/component-registry', category: 'Architecture' },
  { id: 'api-response-schema', title: 'API Response Schema', description: 'Structured schema for API responses', href: '/architecture/api-response-schema', category: 'Architecture' },
  { id: 'opportunity-surface-service', title: 'Opportunity Surface Service', description: 'Backend service for opportunity detection', href: '/architecture/opportunity-surface-service', category: 'Architecture' },
  { id: 'frontend-architecture', title: 'Frontend Architecture', description: 'Overview of frontend architecture patterns', href: '/architecture/frontend-architecture', category: 'Architecture' },

  // Content
  { id: 'glossary', title: 'Glossary', description: 'Glossary of design system terminology', href: '/content/glossary', category: 'Guide' },
  { id: 'writing-for-privacy', title: 'Writing for Privacy', description: 'Guidelines for privacy-focused content', href: '/content/writing-for-privacy', category: 'Guide' },

  // Resources
  { id: 'playground', title: 'Playground', description: 'Interactive playground to explore components', href: '/playground', category: 'Resource' },
  { id: 'contributing', title: 'Contributing', description: 'How to contribute to the design system', href: '/resources/contributing', category: 'Resource' },
  { id: 'github', title: 'GitHub', description: 'GitHub repository and issue tracking', href: '/resources/github', category: 'Resource' },
  { id: 'support', title: 'Support', description: 'Get help and support', href: '/resources/support', category: 'Resource' },
];

// Create FlexSearch index
const index = new FlexSearch.Index({
  tokenize: 'forward',
  cache: true,
});

// Index all search data
searchData.forEach((item) => {
  const searchableText = `${item.title} ${item.description} ${item.category}`;
  index.add(item.id, searchableText);
});

/**
 * Search the index
 * @param query - Search query string
 * @param limit - Maximum number of results to return (default: 10)
 * @returns Array of search results
 */
export function search(query: string, limit: number = 10): SearchResult[] {
  if (!query.trim()) {
    return [];
  }

  const results = index.search(query, limit);

  return results
    .map((id) => searchData.find((item) => item.id === id))
    .filter((item): item is SearchResult => item !== undefined);
}

/**
 * Filter search results by category
 * @param results - Search results to filter
 * @param category - Category to filter by
 * @returns Filtered search results
 */
export function filterByCategory(
  results: SearchResult[],
  category: SearchResult['category'] | 'All'
): SearchResult[] {
  if (category === 'All') {
    return results;
  }
  return results.filter((result) => result.category === category);
}

/**
 * Get all unique categories
 * @returns Array of all categories
 */
export function getCategories(): Array<SearchResult['category'] | 'All'> {
  return ['All', 'Component', 'Pattern', 'Foundation', 'Architecture', 'Token', 'Guide', 'Resource'];
}

/**
 * Save recent searches to localStorage
 * @param query - Search query to save
 */
export function saveRecentSearch(query: string): void {
  if (typeof window === 'undefined') return;

  const recentSearches = getRecentSearches();
  const updatedSearches = [query, ...recentSearches.filter((q) => q !== query)].slice(0, 5);

  localStorage.setItem('fidus-recent-searches', JSON.stringify(updatedSearches));
}

/**
 * Get recent searches from localStorage
 * @returns Array of recent search queries
 */
export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem('fidus-recent-searches');
  return stored ? JSON.parse(stored) : [];
}

/**
 * Clear recent searches from localStorage
 */
export function clearRecentSearches(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('fidus-recent-searches');
}
