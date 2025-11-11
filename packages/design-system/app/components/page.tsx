'use client';

import { Link } from '@fidus/ui/link';;

interface ComponentCategory {
  title: string;
  description: string;
  components: Array<{
    name: string;
    slug: string;
    description: string;
  }>;
}

export default function ComponentsOverviewPage() {
  const categories: ComponentCategory[] = [
    {
      title: 'Form Controls',
      description: 'Interactive input components for data collection',
      components: [
        { name: 'Button', slug: 'button', description: 'Trigger actions or events' },
        { name: 'Button Group', slug: 'button-group', description: 'Group related buttons' },
        { name: 'Checkbox', slug: 'checkbox', description: 'Toggle selection on/off' },
        { name: 'Date Picker', slug: 'date-picker', description: 'Select dates' },
        { name: 'Dropdown', slug: 'dropdown', description: 'Select from a list of options' },
        { name: 'File Upload', slug: 'file-upload', description: 'Upload files' },
        { name: 'Radio Button', slug: 'radio-button', description: 'Select one option from a set' },
        { name: 'Select', slug: 'select', description: 'Choose from dropdown options' },
        { name: 'Text Area', slug: 'text-area', description: 'Multi-line text input' },
        { name: 'Text Input', slug: 'text-input', description: 'Single-line text input' },
        { name: 'Time Picker', slug: 'time-picker', description: 'Select time values' },
        { name: 'Toggle Switch', slug: 'toggle-switch', description: 'Binary on/off control' },
      ],
    },
    {
      title: 'Feedback & Messaging',
      description: 'Components for user communication and notifications',
      components: [
        { name: 'Alert', slug: 'alert', description: 'Display important messages' },
        { name: 'Banner', slug: 'banner', description: 'Prominent announcements' },
        { name: 'Chat Interface', slug: 'chat-interface', description: 'Conversational UI' },
        { name: 'Message Bubble', slug: 'message-bubble', description: 'Individual chat messages' },
        { name: 'Toast', slug: 'toast', description: 'Temporary notifications' },
        { name: 'Progress Bar', slug: 'progress-bar', description: 'Show task completion' },
        { name: 'Confidence Indicator', slug: 'confidence-indicator', description: 'Display AI confidence levels' },
      ],
    },
    {
      title: 'Navigation',
      description: 'Components for moving through the application',
      components: [
        { name: 'Breadcrumbs', slug: 'breadcrumbs', description: 'Show navigation hierarchy' },
        { name: 'Header', slug: 'header', description: 'Page header with navigation' },
        { name: 'Link', slug: 'link', description: 'Navigate between pages' },
        { name: 'Pagination', slug: 'pagination', description: 'Navigate through pages of content' },
        { name: 'Sidebar', slug: 'sidebar', description: 'Side navigation panel' },
        { name: 'Tabs', slug: 'tabs', description: 'Switch between views' },
      ],
    },
    {
      title: 'Data Display',
      description: 'Components for presenting information',
      components: [
        { name: 'Avatar', slug: 'avatar', description: 'User profile images' },
        { name: 'Badge', slug: 'badge', description: 'Small status indicators' },
        { name: 'Chip', slug: 'chip', description: 'Compact elements for tags or selections' },
        { name: 'Detail Card', slug: 'detail-card', description: 'Detailed information cards' },
        { name: 'Empty Card', slug: 'empty-card', description: 'Placeholder for empty states' },
        { name: 'List', slug: 'list', description: 'Display lists of items' },
        { name: 'Opportunity Card', slug: 'opportunity-card', description: 'AI-suggested actions' },
        { name: 'Table', slug: 'table', description: 'Tabular data display' },
      ],
    },
    {
      title: 'Layout',
      description: 'Structural components for page organization',
      components: [
        { name: 'Container', slug: 'container', description: 'Content width constraints' },
        { name: 'Divider', slug: 'divider', description: 'Visual content separators' },
        { name: 'Grid', slug: 'grid', description: 'Grid layout system' },
        { name: 'Stack', slug: 'stack', description: 'Vertical or horizontal stacking' },
      ],
    },
    {
      title: 'Overlays',
      description: 'Components that appear above other content',
      components: [
        { name: 'Drawer', slug: 'drawer', description: 'Side panel overlay' },
        { name: 'Modal', slug: 'modal', description: 'Dialog overlays' },
        { name: 'Popover', slug: 'popover', description: 'Contextual popup content' },
        { name: 'Tooltip', slug: 'tooltip', description: 'Helpful hints on hover' },
      ],
    },
    {
      title: 'Utilities',
      description: 'Specialized utility components',
      components: [
        { name: 'Icon Button', slug: 'icon-button', description: 'Button with icon only' },
      ],
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Components</h1>
      <p className="lead">
        A comprehensive collection of reusable UI components built with React and TypeScript.
        All components follow our design principles of privacy-first design, accessibility,
        and AI-driven interactions.
      </p>

      <div className="not-prose space-y-2xl mt-2xl">
        {categories.map((category) => (
          <section key={category.title}>
            <h2 className="text-2xl font-bold mb-sm">{category.title}</h2>
            <p className="text-muted-foreground mb-lg">{category.description}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-md">
              {category.components.map((component) => (
                <Link
                  key={component.slug}
                  href={`/components/${component.slug}`}
                  className="group block p-lg border border-border rounded-lg hover:border-primary hover:shadow-md transition-all duration-normal no-underline"
                >
                  <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
                    {component.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{component.description}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-2xl pt-2xl border-t border-border">
        <h2>Getting Started</h2>
        <p>
          To use these components in your project, install the <code>@fidus/ui</code> package
          and import the components you need.
        </p>
        <div className="not-prose my-lg">
          <Link variant="standalone" href="/getting-started/for-developers">
            View installation guide →
          </Link>
        </div>
      </div>
    </div>
  );
}
