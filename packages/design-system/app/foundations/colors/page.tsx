'use client';

export default function ColorsPage() {
  const ColorSwatch = ({
    name,
    variable,
    description,
  }: {
    name: string;
    variable: string;
    description: string;
  }) => (
    <div className="border border-border rounded-lg p-4 space-y-2">
      <div
        className="h-24 rounded-md border border-border"
        style={{ backgroundColor: `hsl(var(${variable}))` }}
      />
      <div>
        <div className="font-semibold text-foreground">{name}</div>
        <div className="text-sm text-muted-foreground font-mono">{variable}</div>
        <div className="text-sm text-muted-foreground mt-1">{description}</div>
      </div>
    </div>
  );

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Colors</h1>
      <p className="lead">
        The Fidus color system is built on trust, transparency, and brand identity.
        Our color palette reflects our privacy-first approach while maintaining
        accessibility and visual appeal.
      </p>

      <h2>Brand Colors</h2>
      <p>
        Our brand colors establish Fidus's identity and should be used consistently
        across all applications.
      </p>
      <div className="not-prose grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
        <ColorSwatch
          name="Primary (Gold)"
          variable="--color-primary"
          description="Main brand color. Used for primary actions and key UI elements."
        />
        <ColorSwatch
          name="Black"
          variable="--color-black"
          description="Secondary brand color. Used for text and contrast."
        />
      </div>

      <h2>Trust Colors</h2>
      <p>
        Trust colors communicate privacy and data handling to users. They indicate
        where and how data is processed.
      </p>
      <div className="not-prose grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
        <ColorSwatch
          name="Local Processing"
          variable="--color-trust-local"
          description="Green indicates data processed entirely on user's device."
        />
        <ColorSwatch
          name="Cloud Processing"
          variable="--color-trust-cloud"
          description="Orange indicates data sent to Fidus cloud services."
        />
        <ColorSwatch
          name="Encrypted"
          variable="--color-trust-encrypted"
          description="Blue indicates end-to-end encrypted communication."
        />
        <ColorSwatch
          name="Third Party"
          variable="--color-trust-third-party"
          description="Red indicates data shared with third-party services."
        />
      </div>

      <h2>Semantic Colors</h2>
      <p>
        Semantic colors convey meaning and state across the interface.
      </p>
      <div className="not-prose grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
        <ColorSwatch
          name="Success"
          variable="--color-success"
          description="Indicates successful operations or positive states."
        />
        <ColorSwatch
          name="Warning"
          variable="--color-warning"
          description="Indicates caution or potential issues."
        />
        <ColorSwatch
          name="Error"
          variable="--color-error"
          description="Indicates errors or destructive actions."
        />
        <ColorSwatch
          name="Info"
          variable="--color-info"
          description="Indicates informational messages."
        />
      </div>

      <h2>Urgency Colors</h2>
      <p>
        Urgency colors help users prioritize tasks and notifications.
      </p>
      <div className="not-prose grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
        <ColorSwatch
          name="Urgent"
          variable="--color-urgent"
          description="Immediate attention required."
        />
        <ColorSwatch
          name="Important"
          variable="--color-important"
          description="High priority, attention needed soon."
        />
        <ColorSwatch
          name="Normal"
          variable="--color-normal"
          description="Standard priority."
        />
        <ColorSwatch
          name="Low"
          variable="--color-low"
          description="Low priority, can be addressed later."
        />
      </div>

      <h2>Neutral Colors</h2>
      <p>
        Neutral colors form the foundation of the interface, providing backgrounds,
        borders, and text colors.
      </p>
      <div className="not-prose grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
        <ColorSwatch
          name="Background"
          variable="--color-background"
          description="Main background color for pages."
        />
        <ColorSwatch
          name="Foreground"
          variable="--color-foreground"
          description="Primary text color."
        />
        <ColorSwatch
          name="Muted"
          variable="--color-muted"
          description="Secondary backgrounds and borders."
        />
        <ColorSwatch
          name="Muted Foreground"
          variable="--color-muted-foreground"
          description="Secondary text color."
        />
        <ColorSwatch
          name="Border"
          variable="--color-border"
          description="Default border color."
        />
      </div>

      <h2>Usage Guidelines</h2>
      <h3>Accessibility</h3>
      <ul>
        <li>All color combinations meet WCAG 2.1 AA contrast requirements (4.5:1 for text)</li>
        <li>Never use color alone to convey information (add icons or text labels)</li>
        <li>Test color choices with common color vision deficiencies</li>
      </ul>

      <h3>Trust Colors</h3>
      <ul>
        <li>Always show trust indicators when displaying user data</li>
        <li>Use green (local) as the default for privacy-first features</li>
        <li>Clearly explain what each trust color means on first use</li>
        <li>Consider adding a legend or tooltip for trust indicators</li>
      </ul>

      <h3>Dark Mode</h3>
      <ul>
        <li>All colors have dark mode variants defined in globals.css</li>
        <li>Dark mode is automatically applied when user prefers dark color scheme</li>
        <li>Test all UI components in both light and dark modes</li>
      </ul>
    </div>
  );
}
