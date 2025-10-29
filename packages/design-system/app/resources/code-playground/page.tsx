'use client';

export default function CodePlaygroundPage() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Code Playground</h1>
      <p className="lead">
        Interactive playground for experimenting with Fidus components in real-time.
        Edit props, see live previews, and copy production-ready code.
      </p>

      <div className="not-prose mb-8">
        <a
          href="/playground"
          className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary-hover transition-colors"
        >
          Open Playground →
        </a>
      </div>

      <h2>Features</h2>

      <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-2">🎮 Live Preview</h3>
          <p className="text-sm text-muted-foreground">
            See components render in real-time as you adjust props. Supports light and dark mode.
          </p>
        </div>
        <div className="p-6 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-2">⚙️ Prop Editor</h3>
          <p className="text-sm text-muted-foreground">
            Auto-generated controls for all component props. Change variants, sizes, and states
            instantly.
          </p>
        </div>
        <div className="p-6 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-2">💻 Code Generation</h3>
          <p className="text-sm text-muted-foreground">
            Copy React/TypeScript code for the exact configuration you've built. Ready to paste
            into your project.
          </p>
        </div>
        <div className="p-6 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-2">📱 Responsive Preview</h3>
          <p className="text-sm text-muted-foreground">
            Toggle between mobile, tablet, and desktop views to test responsive behavior.
          </p>
        </div>
      </div>

      <h2>How to Use</h2>

      <h3>1. Select a Component</h3>
      <p>
        Use the component selector to choose from all available components:
      </p>
      <ul>
        <li>Browse by category (Actions, Forms, Feedback, etc.)</li>
        <li>Search by component name</li>
        <li>View recently used components</li>
      </ul>

      <h3>2. Adjust Props</h3>
      <p>
        The prop editor provides controls for all component properties:
      </p>
      <div className="not-prose mb-6">
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm font-semibold mb-3">Example: Button Props</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">variant</span>
              <span className="font-mono">primary</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">size</span>
              <span className="font-mono">md</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">disabled</span>
              <span className="font-mono">false</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">children</span>
              <span className="font-mono">"Click Me"</span>
            </div>
          </div>
        </div>
      </div>

      <h3>3. Preview Component</h3>
      <p>
        The live preview updates instantly as you change props:
      </p>
      <ul>
        <li>Toggle between light and dark mode</li>
        <li>Change device frame (mobile/tablet/desktop)</li>
        <li>Interact with the component</li>
        <li>Test accessibility with keyboard navigation</li>
      </ul>

      <h3>4. Copy Code</h3>
      <p>
        Generate production-ready code in multiple formats:
      </p>
      <ul>
        <li><strong>React/TSX:</strong> Component with all props</li>
        <li><strong>TypeScript Types:</strong> Type definitions</li>
        <li><strong>Zod Schema:</strong> Runtime validation schema</li>
        <li><strong>CSS:</strong> Styling (if custom styles needed)</li>
      </ul>

      <h2>Example Workflows</h2>

      <h3>Exploring a New Component</h3>
      <ol>
        <li>Select component from the library</li>
        <li>Try all variant combinations</li>
        <li>Test different sizes and states</li>
        <li>Check responsive behavior</li>
        <li>Copy code when you find the right configuration</li>
      </ol>

      <h3>Building a Custom OpportunityCard</h3>
      <ol>
        <li>Select OpportunityCard component</li>
        <li>Set urgency level (urgent/medium/low)</li>
        <li>Add title and description text</li>
        <li>Configure action buttons</li>
        <li>Preview on mobile and desktop</li>
        <li>Copy generated code</li>
      </ol>

      <h3>Testing Form Validation</h3>
      <ol>
        <li>Select form component (TextInput, Select, etc.)</li>
        <li>Add validation rules</li>
        <li>Test error states</li>
        <li>Check accessibility (screen reader text)</li>
        <li>Copy complete form code with validation</li>
      </ol>

      <h2>Keyboard Shortcuts</h2>
      <table>
        <thead>
          <tr>
            <th>Shortcut</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>Cmd/Ctrl + K</code>
            </td>
            <td>Open component search</td>
          </tr>
          <tr>
            <td>
              <code>Cmd/Ctrl + D</code>
            </td>
            <td>Toggle dark mode</td>
          </tr>
          <tr>
            <td>
              <code>Cmd/Ctrl + C</code>
            </td>
            <td>Copy code to clipboard</td>
          </tr>
          <tr>
            <td>
              <code>Cmd/Ctrl + R</code>
            </td>
            <td>Reset props to defaults</td>
          </tr>
          <tr>
            <td>
              <code>Cmd/Ctrl + /</code>
            </td>
            <td>Toggle prop editor</td>
          </tr>
        </tbody>
      </table>

      <h2>Component Categories</h2>

      <h3>Actions (4 components)</h3>
      <ul>
        <li>Button</li>
        <li>Link</li>
        <li>Icon Button</li>
        <li>Button Group</li>
      </ul>

      <h3>Forms (9 components)</h3>
      <ul>
        <li>Text Input</li>
        <li>Text Area</li>
        <li>Checkbox</li>
        <li>Radio Button</li>
        <li>Toggle Switch</li>
        <li>Select</li>
        <li>Date Picker</li>
        <li>Time Picker</li>
        <li>File Upload</li>
      </ul>

      <h3>Data Display (5 components)</h3>
      <ul>
        <li>Table</li>
        <li>List</li>
        <li>Badge</li>
        <li>Chip</li>
        <li>Avatar</li>
      </ul>

      <h3>Feedback (5 components)</h3>
      <ul>
        <li>Toast</li>
        <li>Modal</li>
        <li>Alert</li>
        <li>Banner</li>
        <li>Progress Bar</li>
      </ul>

      <h3>Overlay (4 components)</h3>
      <ul>
        <li>Dropdown</li>
        <li>Popover</li>
        <li>Tooltip</li>
        <li>Drawer</li>
      </ul>

      <h3>Layout (4 components)</h3>
      <ul>
        <li>Container</li>
        <li>Grid</li>
        <li>Stack</li>
        <li>Divider</li>
      </ul>

      <h3>Fidus-Specific (3 components)</h3>
      <ul>
        <li>OpportunityCard</li>
        <li>Detail Card</li>
        <li>Empty Card</li>
      </ul>

      <h2>Advanced Features</h2>

      <h3>Custom Themes</h3>
      <p>
        Test components with custom theme tokens:
      </p>
      <ol>
        <li>Open theme editor in playground</li>
        <li>Override color/spacing/typography tokens</li>
        <li>See live updates across all components</li>
        <li>Export custom theme CSS</li>
      </ol>

      <h3>Composition Mode</h3>
      <p>
        Build complex layouts by combining components:
      </p>
      <ol>
        <li>Enable composition mode</li>
        <li>Add multiple components to canvas</li>
        <li>Arrange with drag and drop</li>
        <li>Copy entire composition code</li>
      </ol>

      <h3>State Management Preview</h3>
      <p>
        See how components behave with state changes:
      </p>
      <ul>
        <li>Simulate loading states</li>
        <li>Test error handling</li>
        <li>Preview success confirmations</li>
        <li>Try empty states</li>
      </ul>

      <h2>Sharing Configurations</h2>
      <p>
        Share your playground configurations with others:
      </p>
      <ol>
        <li>Build your component configuration</li>
        <li>Click "Share" button</li>
        <li>Copy the generated URL</li>
        <li>Anyone with the URL sees the same configuration</li>
      </ol>

      <h2>Tips and Tricks</h2>

      <h3>Quick Component Exploration</h3>
      <ul>
        <li>Use keyboard shortcuts to speed up navigation</li>
        <li>Bookmark frequently used components</li>
        <li>Check "Recent" tab for quick access</li>
      </ul>

      <h3>Testing Accessibility</h3>
      <ul>
        <li>Use keyboard-only navigation (Tab, Enter, Space)</li>
        <li>Enable screen reader preview</li>
        <li>Check color contrast in accessibility panel</li>
        <li>Verify focus indicators are visible</li>
      </ul>

      <h3>Responsive Design</h3>
      <ul>
        <li>Test all three breakpoints (mobile, tablet, desktop)</li>
        <li>Verify touch targets are large enough on mobile</li>
        <li>Check text remains readable at all sizes</li>
        <li>Ensure layouts don't break at edge cases</li>
      </ul>

      <h2>Related Resources</h2>
      <ul>
        <li>
          <a href="/components">Component Documentation</a> - Full component specs
        </li>
        <li>
          <a href="/getting-started/for-developers">Developer Guide</a> - Setup and installation
        </li>
        <li>
          <a href="/resources/downloads">Downloads</a> - Assets and icons
        </li>
        <li>
          <a href="/resources/support">Support</a> - Get help
        </li>
      </ul>
    </div>
  );
}
