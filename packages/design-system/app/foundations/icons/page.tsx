import {
  Calendar,
  DollarSign,
  Plane,
  Home,
  Heart,
  ShoppingCart,
  BookOpen,
  MessageSquare,
  Bell,
  Settings,
  User,
  Search,
  ChevronRight,
  ChevronDown,
  X,
  Check,
  AlertCircle,
  Info,
  Lock,
  Cloud,
  Link as LinkIcon,
} from 'lucide-react';

export default function IconsPage() {
  const domainIcons = [
    { name: 'Calendar', icon: <Calendar />, usage: 'Calendar domain, events, appointments' },
    { name: 'DollarSign', icon: <DollarSign />, usage: 'Finance domain, budgets, transactions' },
    { name: 'Plane', icon: <Plane />, usage: 'Travel domain, trips, flights' },
    { name: 'Home', icon: <Home />, usage: 'Home domain, smart home, maintenance' },
    { name: 'Heart', icon: <Heart />, usage: 'Health domain, wellness, medical' },
    {
      name: 'ShoppingCart',
      icon: <ShoppingCart />,
      usage: 'Shopping domain, lists, purchases',
    },
    { name: 'BookOpen', icon: <BookOpen />, usage: 'Learning domain, courses, study' },
    {
      name: 'MessageSquare',
      icon: <MessageSquare />,
      usage: 'Communication domain, messages, email',
    },
  ];

  const systemIcons = [
    { name: 'Bell', icon: <Bell />, usage: 'Notifications, alerts' },
    { name: 'Settings', icon: <Settings />, usage: 'Settings, configuration' },
    { name: 'User', icon: <User />, usage: 'User profile, avatar fallback' },
    { name: 'Search', icon: <Search />, usage: 'Search functionality' },
  ];

  const navigationIcons = [
    { name: 'ChevronRight', icon: <ChevronRight />, usage: 'Navigate forward, next' },
    { name: 'ChevronDown', icon: <ChevronDown />, usage: 'Expand, dropdown' },
    { name: 'X', icon: <X />, usage: 'Close, dismiss, cancel' },
    { name: 'Check', icon: <Check />, usage: 'Confirm, success, done' },
  ];

  const statusIcons = [
    { name: 'AlertCircle', icon: <AlertCircle />, usage: 'Warning, error, attention needed' },
    { name: 'Info', icon: <Info />, usage: 'Information, help, tooltip' },
    { name: 'Lock', icon: <Lock />, usage: 'Privacy, security, local data' },
    { name: 'Cloud', icon: <Cloud />, usage: 'Cloud sync, remote data' },
    { name: 'Link', icon: <LinkIcon />, usage: 'External service, connection' },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Icons</h1>
      <p className="lead">
        Fidus uses Lucide React icons for a consistent, modern icon system. All icons are
        open-source, accessible, and customizable.
      </p>

      <h2>Icon Library</h2>
      <p>
        We use <strong>Lucide React</strong> - a community-maintained fork of Feather Icons with
        over 1,000+ icons. Benefits:
      </p>
      <ul>
        <li>Consistent design language</li>
        <li>Tree-shakeable (only import icons you use)</li>
        <li>Fully accessible with proper ARIA attributes</li>
        <li>Customizable size, color, and stroke width</li>
        <li>React components (not SVG sprites)</li>
      </ul>

      <h2>Domain Icons</h2>
      <p>Each Fidus domain has a representative icon used in cards, navigation, and badges:</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 not-prose">
        {domainIcons.map((item) => (
          <div key={item.name} className="flex items-start gap-3 p-3 border border-border rounded-lg">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-muted rounded">
              {item.icon}
            </div>
            <div>
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.usage}</p>
            </div>
          </div>
        ))}
      </div>

      <h2>System Icons</h2>
      <p>Common system functionality icons:</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 not-prose">
        {systemIcons.map((item) => (
          <div key={item.name} className="flex items-start gap-3 p-3 border border-border rounded-lg">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-muted rounded">
              {item.icon}
            </div>
            <div>
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.usage}</p>
            </div>
          </div>
        ))}
      </div>

      <h2>Navigation Icons</h2>
      <p>Icons for navigation and user actions:</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 not-prose">
        {navigationIcons.map((item) => (
          <div key={item.name} className="flex items-start gap-3 p-3 border border-border rounded-lg">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-muted rounded">
              {item.icon}
            </div>
            <div>
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.usage}</p>
            </div>
          </div>
        ))}
      </div>

      <h2>Status & Privacy Icons</h2>
      <p>Icons indicating status, privacy level, and data source:</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 not-prose">
        {statusIcons.map((item) => (
          <div key={item.name} className="flex items-start gap-3 p-3 border border-border rounded-lg">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-muted rounded">
              {item.icon}
            </div>
            <div>
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.usage}</p>
            </div>
          </div>
        ))}
      </div>

      <h2>Icon Sizes</h2>
      <p>Consistent sizing scale for different use cases:</p>

      <div className="space-y-4 my-6 not-prose">
        <div className="flex items-center gap-4 p-3 border border-border rounded-lg">
          <div className="flex items-center justify-center w-12 h-12 bg-muted rounded">
            <Calendar className="h-3 w-3" />
          </div>
          <div>
            <p className="text-sm font-medium">Small (12px)</p>
            <p className="text-xs text-muted-foreground">Inline with text, tight spaces</p>
            <code className="text-xs">className="h-3 w-3"</code>
          </div>
        </div>

        <div className="flex items-center gap-4 p-3 border border-border rounded-lg">
          <div className="flex items-center justify-center w-12 h-12 bg-muted rounded">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium">Medium (16px) - Default</p>
            <p className="text-xs text-muted-foreground">Buttons, cards, most UI elements</p>
            <code className="text-xs">className="h-4 w-4"</code>
          </div>
        </div>

        <div className="flex items-center gap-4 p-3 border border-border rounded-lg">
          <div className="flex items-center justify-center w-12 h-12 bg-muted rounded">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium">Large (20px)</p>
            <p className="text-xs text-muted-foreground">Headers, prominent features</p>
            <code className="text-xs">className="h-5 w-5"</code>
          </div>
        </div>

        <div className="flex items-center gap-4 p-3 border border-border rounded-lg">
          <div className="flex items-center justify-center w-12 h-12 bg-muted rounded">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium">Extra Large (24px)</p>
            <p className="text-xs text-muted-foreground">Page headers, hero sections</p>
            <code className="text-xs">className="h-6 w-6"</code>
          </div>
        </div>
      </div>

      <h2>Usage Examples</h2>

      <h3>In Buttons</h3>
      <div className="bg-muted/30 border border-border rounded-lg p-4 my-4">
        <pre className="text-xs">
          {`import { Calendar } from 'lucide-react';

<button className="flex items-center gap-2">
  <Calendar className="h-4 w-4" />
  <span>Add Event</span>
</button>`}
        </pre>
      </div>

      <h3>In Card Headers</h3>
      <div className="bg-muted/30 border border-border rounded-lg p-4 my-4">
        <pre className="text-xs">
          {`import { DollarSign } from 'lucide-react';

<OpportunityCard
  title="Budget Alert"
  icon={<DollarSign className="h-5 w-5" />}
  urgency="important"
>
  Card content...
</OpportunityCard>`}
        </pre>
      </div>

      <h3>As Status Indicators</h3>
      <div className="bg-muted/30 border border-border rounded-lg p-4 my-4">
        <pre className="text-xs">
          {`import { Lock, Cloud, Link } from 'lucide-react';

// Privacy badge with icon
<Badge>
  <Lock className="h-3 w-3" /> Local
</Badge>

// Connection status
<Cloud className="h-4 w-4 text-success" />
<Link className="h-4 w-4 text-muted-foreground" />`}
        </pre>
      </div>

      <h2>Customization</h2>

      <h3>Color</h3>
      <p>Use Tailwind text color utilities:</p>
      <div className="flex items-center gap-3 my-4">
        <Calendar className="h-6 w-6 text-foreground" />
        <Calendar className="h-6 w-6 text-muted-foreground" />
        <Calendar className="h-6 w-6 text-primary" />
        <Calendar className="h-6 w-6 text-success" />
        <Calendar className="h-6 w-6 text-warning" />
        <Calendar className="h-6 w-6 text-destructive" />
      </div>

      <h3>Stroke Width</h3>
      <p>Adjust stroke width for visual weight:</p>
      <div className="flex items-center gap-3 my-4">
        <Calendar className="h-6 w-6" strokeWidth={1} />
        <Calendar className="h-6 w-6" strokeWidth={1.5} />
        <Calendar className="h-6 w-6" strokeWidth={2} />
        <Calendar className="h-6 w-6" strokeWidth={2.5} />
      </div>

      <h2>Best Practices</h2>

      <ul>
        <li>
          <strong>Consistent Sizing:</strong> Use the standard size scale (h-3, h-4, h-5, h-6)
        </li>
        <li>
          <strong>Semantic Usage:</strong> Choose icons that clearly represent their function
        </li>
        <li>
          <strong>Color Contrast:</strong> Ensure icons meet WCAG 2.1 AA contrast ratios
        </li>
        <li>
          <strong>Avoid Icon-Only Buttons:</strong> Include text labels for clarity
        </li>
        <li>
          <strong>Tree-Shaking:</strong> Import only the icons you need
        </li>
        <li>
          <strong>Accessibility:</strong> Add aria-label when icon is the only content
        </li>
      </ul>

      <h2>Accessibility</h2>

      <h3>Decorative Icons</h3>
      <p>Icons that accompany text don't need additional labels:</p>
      <div className="bg-muted/30 border border-border rounded-lg p-4 my-4">
        <pre className="text-xs">
          {`<button>
  <Calendar className="h-4 w-4" />
  <span>Add Event</span>  {/* Text provides context */}
</button>`}
        </pre>
      </div>

      <h3>Standalone Icons</h3>
      <p>Icons without text need aria-label:</p>
      <div className="bg-muted/30 border border-border rounded-lg p-4 my-4">
        <pre className="text-xs">
          {`<button aria-label="Close">
  <X className="h-4 w-4" />
</button>`}
        </pre>
      </div>

      <h2>Resources</h2>

      <ul>
        <li>
          <a href="https://lucide.dev" target="_blank" rel="noopener noreferrer">
            Lucide Icon Library
          </a>
          - Browse all available icons
        </li>
        <li>
          <a
            href="https://lucide.dev/guide/packages/lucide-react"
            target="_blank"
            rel="noopener noreferrer"
          >
            Lucide React Documentation
          </a>
          - Installation and usage
        </li>
      </ul>
    </div>
  );
}
