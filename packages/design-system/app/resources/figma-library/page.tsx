'use client';

export default function FigmaLibraryPage() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Figma Library</h1>
      <p className="lead">
        Download the Fidus Design System Figma library to design with production-ready components,
        tokens, and patterns.
      </p>

      <div className="not-prose mb-8">
        <div className="p-6 bg-primary/10 border border-primary rounded-lg">
          <h3 className="text-lg font-semibold mb-2">📦 Figma Library</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Complete design system with all components, tokens, and patterns
          </p>
          <a
            href="#"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary-hover transition-colors"
          >
            Download Figma File
          </a>
          <p className="text-xs text-muted-foreground mt-3">
            Requires Figma account (free or paid)
          </p>
        </div>
      </div>

      <h2>What's Included</h2>

      <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-2">🎨 Design Tokens</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Color system (brand, semantic, urgency)</li>
            <li>Typography scale</li>
            <li>Spacing scale</li>
            <li>Shadow system</li>
            <li>Border radius values</li>
          </ul>
        </div>
        <div className="p-6 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-2">🧩 Components</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>All 34+ UI components</li>
            <li>Multiple variants and states</li>
            <li>Auto-layout enabled</li>
            <li>Component properties</li>
            <li>Interactive prototypes</li>
          </ul>
        </div>
        <div className="p-6 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-2">📐 Patterns</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>OpportunityCard layouts</li>
            <li>Form patterns</li>
            <li>Modal compositions</li>
            <li>Empty states</li>
            <li>Error states</li>
          </ul>
        </div>
        <div className="p-6 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-2">📱 Templates</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Dashboard layouts</li>
            <li>Responsive breakpoints</li>
            <li>Mobile, tablet, desktop frames</li>
            <li>Dark mode examples</li>
            <li>Example screens</li>
          </ul>
        </div>
      </div>

      <h2>Setup Guide</h2>

      <h3>1. Import the Figma File</h3>
      <ol>
        <li>Download the Figma file from the link above</li>
        <li>Open Figma and go to your team/drafts</li>
        <li>Drag and drop the <code>.fig</code> file to import</li>
        <li>Or use File → Import and select the downloaded file</li>
      </ol>

      <h3>2. Enable as Team Library</h3>
      <p>
        To use components across your designs:
      </p>
      <ol>
        <li>Open the imported file</li>
        <li>Click the book icon in the toolbar (Assets panel)</li>
        <li>Click "Publish" to make it a team library</li>
        <li>Enable the library in other files via Assets → Libraries</li>
      </ol>

      <h3>3. Link to Local Variables (Optional)</h3>
      <p>
        For advanced token management:
      </p>
      <ol>
        <li>Open the Fidus library file</li>
        <li>Go to the Variables panel (bottom left)</li>
        <li>Review and edit token values if needed</li>
        <li>Changes sync automatically to all instances</li>
      </ol>

      <h2>Using Components</h2>

      <h3>Insert a Component</h3>
      <ol>
        <li>Open your design file</li>
        <li>Open Assets panel (book icon or Shift+I)</li>
        <li>Search for the component (e.g., "Button")</li>
        <li>Drag to canvas or click to insert</li>
      </ol>

      <h3>Customize Properties</h3>
      <p>
        All components use Figma properties for easy customization:
      </p>
      <div className="not-prose mb-6">
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm font-semibold mb-2">Example: Button Component</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li><strong>Variant:</strong> Primary, Secondary, Tertiary</li>
            <li><strong>Size:</strong> Small, Medium, Large</li>
            <li><strong>State:</strong> Default, Hover, Active, Disabled</li>
            <li><strong>Text:</strong> Edit button label</li>
            <li><strong>Icon:</strong> Toggle icon visibility</li>
          </ul>
        </div>
      </div>

      <h3>Auto-Layout</h3>
      <p>
        All components use auto-layout for responsive behavior:
      </p>
      <ul>
        <li>Resize frames to fit content</li>
        <li>Adjust spacing with padding/gap controls</li>
        <li>Components adapt to content changes</li>
        <li>Maintain alignment automatically</li>
      </ul>

      <h2>Dark Mode</h2>
      <p>
        The library includes dark mode variants:
      </p>
      <ol>
        <li>Place component on canvas</li>
        <li>Right-click component frame</li>
        <li>Select "Change to: Dark" (if available)</li>
        <li>Or use layer properties to toggle mode</li>
      </ol>

      <h2>Best Practices</h2>

      <h3>Do's</h3>
      <ul>
        <li>Use components from the library (don't recreate)</li>
        <li>Detach instances only when absolutely necessary</li>
        <li>Create component variants for common customizations</li>
        <li>Document custom patterns in your design file</li>
        <li>Keep library file updated with latest changes</li>
      </ul>

      <h3>Don'ts</h3>
      <ul>
        <li>Don't modify token values without team agreement</li>
        <li>Don't break component structure (maintain auto-layout)</li>
        <li>Don't hardcode colors - use token variables</li>
        <li>Don't create duplicate components with different names</li>
        <li>Don't ignore responsive breakpoints</li>
      </ul>

      <h2>Responsive Design</h2>
      <p>
        The library includes frames for all breakpoints:
      </p>
      <table>
        <thead>
          <tr>
            <th>Device</th>
            <th>Frame Size</th>
            <th>Usage</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Mobile</td>
            <td>375px × 812px</td>
            <td>iPhone 13 Pro</td>
          </tr>
          <tr>
            <td>Tablet</td>
            <td>768px × 1024px</td>
            <td>iPad</td>
          </tr>
          <tr>
            <td>Desktop</td>
            <td>1440px × 900px</td>
            <td>Standard desktop</td>
          </tr>
        </tbody>
      </table>

      <h2>Component Status</h2>
      <p>
        Components in the library are marked with status labels:
      </p>
      <div className="not-prose mb-6 space-y-2">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-success text-white rounded-md text-sm font-medium">
            Ready
          </span>
          <span className="text-sm text-muted-foreground">
            Production-ready, fully tested
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-warning text-white rounded-md text-sm font-medium">
            Beta
          </span>
          <span className="text-sm text-muted-foreground">
            Functional but may change
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-error text-white rounded-md text-sm font-medium">
            Deprecated
          </span>
          <span className="text-sm text-muted-foreground">
            Do not use, will be removed
          </span>
        </div>
      </div>

      <h2>Troubleshooting</h2>

      <h3>Components Not Appearing</h3>
      <ul>
        <li>Ensure library is published (book icon → Publish)</li>
        <li>Enable library in your file (Assets → Libraries → Fidus)</li>
        <li>Refresh libraries (right-click library → Update)</li>
      </ul>

      <h3>Styling Doesn't Match Code</h3>
      <ul>
        <li>Check you're using latest library version</li>
        <li>Compare token values with design system documentation</li>
        <li>Verify component variant matches code implementation</li>
      </ul>

      <h3>Auto-Layout Issues</h3>
      <ul>
        <li>Don't manually position elements inside components</li>
        <li>Use padding/gap controls to adjust spacing</li>
        <li>Check alignment settings (left, center, right)</li>
      </ul>

      <h2>Getting Help</h2>
      <ul>
        <li>
          <strong>Documentation:</strong> Browse this design system site
        </li>
        <li>
          <strong>GitHub:</strong> Report issues on the repository
        </li>
        <li>
          <strong>Discord:</strong> Ask questions in #design channel
        </li>
      </ul>

      <h2>Contributing</h2>
      <p>
        Want to contribute components or improvements? See our{' '}
        <a href="/resources/contributing">Contributing Guide</a>.
      </p>
    </div>
  );
}
