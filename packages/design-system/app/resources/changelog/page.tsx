'use client';

export default function ChangelogPage() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Changelog</h1>
      <p className="lead">
        Version history and release notes for the Fidus Design System.
        All notable changes to components, tokens, and patterns are documented here.
      </p>

      <div className="not-prose mb-8 p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Current Version:</strong> v0.9.0 (Beta)
          <br />
          <strong>Last Updated:</strong> October 29, 2025
          <br />
          <strong>Next Release:</strong> v1.0.0 (Stable) - November 2025
        </p>
      </div>

      <h2>v0.9.0 - October 29, 2025</h2>
      <div className="not-prose mb-6">
        <span className="px-3 py-1 bg-warning text-white rounded-md text-sm font-medium">
          Beta
        </span>
      </div>

      <h3>🎉 New Features</h3>
      <ul>
        <li>Added <strong>Slice 9</strong> - Token, Content, and Resource pages</li>
        <li>Complete token documentation (color, spacing, typography, shadow, motion)</li>
        <li>Content guidelines (voice/tone, grammar, glossary, privacy writing)</li>
        <li>Resource hub (Figma library, playground, downloads, changelog, contributing)</li>
      </ul>

      <h3>🔧 Improvements</h3>
      <ul>
        <li>Enhanced ColorSwatch and TokenDisplay components</li>
        <li>Improved navigation structure for better discoverability</li>
        <li>Added interactive examples to token pages</li>
      </ul>

      <h3>📚 Documentation</h3>
      <ul>
        <li>Added comprehensive glossary with 40+ terms</li>
        <li>Privacy-focused writing guidelines</li>
        <li>Grammar and mechanics standards</li>
      </ul>

      <hr />

      <h2>v0.8.0 - October 28, 2025</h2>
      <div className="not-prose mb-6">
        <span className="px-3 py-1 bg-warning text-white rounded-md text-sm font-medium">
          Beta
        </span>
      </div>

      <h3>🎉 New Features</h3>
      <ul>
        <li>Added <strong>Slice 8</strong> - Interactive Playground</li>
        <li>Live component preview with prop editing</li>
        <li>Code generation for React/TypeScript</li>
        <li>Responsive preview (mobile/tablet/desktop)</li>
      </ul>

      <h3>🐛 Bug Fixes</h3>
      <ul>
        <li>Fixed DatePicker timezone handling</li>
        <li>Resolved Modal focus trap issues</li>
        <li>Fixed Select dropdown positioning on mobile</li>
      </ul>

      <hr />

      <h2>v0.7.0 - October 25, 2025</h2>

      <h3>🎉 New Features</h3>
      <ul>
        <li>Added <strong>Slice 7</strong> - Architecture and Advanced Patterns</li>
        <li>UIDecisionLayer documentation</li>
        <li>Component Registry guide</li>
        <li>Opportunity Surface pattern</li>
        <li>Search and filtering patterns</li>
      </ul>

      <h3>🔧 Improvements</h3>
      <ul>
        <li>Enhanced OpportunityCard with better animations</li>
        <li>Improved form validation patterns</li>
        <li>Better error recovery guidance</li>
      </ul>

      <hr />

      <h2>v0.6.0 - October 20, 2025</h2>

      <h3>🎉 New Features</h3>
      <ul>
        <li>Added <strong>Slice 6</strong> - Navigation and Getting Started</li>
        <li>Header component</li>
        <li>Sidebar component with collapsible sections</li>
        <li>Tabs component (horizontal/vertical)</li>
        <li>Breadcrumbs component</li>
        <li>Pagination component</li>
        <li>Complete Getting Started guides</li>
        <li>Onboarding pattern documentation</li>
      </ul>

      <h3>📚 Documentation</h3>
      <ul>
        <li>Added "For Designers" guide</li>
        <li>Added "For Developers" guide</li>
        <li>Design philosophy documentation</li>
      </ul>

      <hr />

      <h2>v0.5.0 - October 15, 2025</h2>

      <h3>🎉 New Features</h3>
      <ul>
        <li>Added <strong>Slice 5</strong> - Feedback and Overlay Components</li>
        <li>Toast component with queue management</li>
        <li>Modal component with focus trap</li>
        <li>Alert component (inline alerts)</li>
        <li>Banner component (page-level)</li>
        <li>Progress Bar (linear/circular)</li>
        <li>Dropdown component</li>
        <li>Popover component</li>
        <li>Tooltip component</li>
        <li>Drawer component (side/bottom)</li>
      </ul>

      <h3>📚 Documentation</h3>
      <ul>
        <li>Error state patterns (6 categories)</li>
        <li>Empty state patterns (5 types)</li>
        <li>Loading state patterns (5 approaches)</li>
        <li>Success confirmation patterns</li>
      </ul>

      <h3>✅ Milestone</h3>
      <ul>
        <li><strong>All 34 core components complete!</strong></li>
      </ul>

      <hr />

      <h2>v0.4.0 - October 10, 2025</h2>

      <h3>🎉 New Features</h3>
      <ul>
        <li>Added <strong>Slice 4</strong> - Complex Form Components</li>
        <li>Select component (single/multi, searchable)</li>
        <li>Date Picker with calendar</li>
        <li>Time Picker (12/24 hour)</li>
        <li>File Upload with drag & drop</li>
      </ul>

      <h3>🔧 Improvements</h3>
      <ul>
        <li>Enhanced form validation with Zod</li>
        <li>Better accessibility for form components</li>
        <li>Improved error messaging patterns</li>
      </ul>

      <hr />

      <h2>v0.3.0 - October 5, 2025</h2>

      <h3>🎉 New Features</h3>
      <ul>
        <li>Added <strong>Slice 3</strong> - Basic Form Components</li>
        <li>Text Input (with variants)</li>
        <li>Text Area</li>
        <li>Checkbox</li>
        <li>Radio Button</li>
        <li>Toggle Switch</li>
      </ul>

      <h3>📚 Documentation</h3>
      <ul>
        <li>Form validation patterns</li>
        <li>Accessibility guidelines for forms</li>
      </ul>

      <hr />

      <h2>v0.2.0 - October 1, 2025</h2>

      <h3>🎉 New Features</h3>
      <ul>
        <li>Added <strong>Slice 2</strong> - Card System and Privacy UX</li>
        <li>OpportunityCard component</li>
        <li>Detail Card component</li>
        <li>Empty Card component</li>
      </ul>

      <h3>📚 Documentation</h3>
      <ul>
        <li>AI-Driven UI Paradigm guide</li>
        <li>Privacy & Trust UX documentation</li>
        <li>Icons foundation page</li>
        <li>Motion foundation page</li>
        <li>Accessibility guidelines</li>
        <li>Responsive design patterns</li>
      </ul>

      <hr />

      <h2>v0.1.0 - September 25, 2025</h2>

      <h3>🎉 New Features</h3>
      <ul>
        <li>Added <strong>Slice 1</strong> - Layout and Data Display</li>
        <li>Container component</li>
        <li>Grid component</li>
        <li>Stack component</li>
        <li>Divider component</li>
        <li>Table component</li>
        <li>List component</li>
        <li>Badge component</li>
        <li>Chip component</li>
        <li>Avatar component</li>
      </ul>

      <h3>📚 Documentation</h3>
      <ul>
        <li>Layout patterns</li>
        <li>Data display best practices</li>
      </ul>

      <hr />

      <h2>v0.0.1 - September 20, 2025</h2>

      <h3>🎉 Initial Release</h3>
      <ul>
        <li>Added <strong>Slice 0</strong> - Foundation and Action Components</li>
        <li>Design tokens system (colors, typography, spacing, shadows)</li>
        <li>Button component</li>
        <li>Link component</li>
        <li>Icon Button component</li>
        <li>Button Group component</li>
        <li>Navigation shell (Header, Sidebar)</li>
        <li>Foundation pages (colors, typography, spacing)</li>
      </ul>

      <h3>🏗️ Infrastructure</h3>
      <ul>
        <li>Next.js 14 App Router setup</li>
        <li>Tailwind CSS configuration</li>
        <li>CSS variables for design tokens</li>
        <li>Component preview system</li>
        <li>Props table helper</li>
      </ul>

      <hr />

      <h2>Version Naming Convention</h2>
      <p>
        Fidus Design System follows <a href="https://semver.org/">Semantic Versioning</a>:
      </p>
      <ul>
        <li>
          <strong>Major (1.0.0):</strong> Breaking changes, large architectural updates
        </li>
        <li>
          <strong>Minor (0.1.0):</strong> New features, new components, non-breaking improvements
        </li>
        <li>
          <strong>Patch (0.0.1):</strong> Bug fixes, documentation updates, small tweaks
        </li>
      </ul>

      <h2>Release Schedule</h2>
      <ul>
        <li>
          <strong>Major releases:</strong> As needed (breaking changes)
        </li>
        <li>
          <strong>Minor releases:</strong> Every 2-4 weeks (new features)
        </li>
        <li>
          <strong>Patch releases:</strong> As needed (bug fixes)
        </li>
      </ul>

      <h2>Upgrade Guides</h2>
      <p>
        For breaking changes and migration instructions, see:
      </p>
      <ul>
        <li>
          <a href="/resources/contributing">Contributing Guide</a> - How to contribute
        </li>
        <li>
          <a href="/resources/github">GitHub Repository</a> - Full release notes
        </li>
      </ul>

      <h2>Roadmap</h2>

      <h3>v1.0.0 (Stable) - November 2025</h3>
      <ul>
        <li>Production-ready status</li>
        <li>Complete test coverage</li>
        <li>Accessibility audit</li>
        <li>Performance optimization</li>
        <li>Final documentation polish</li>
      </ul>

      <h3>v1.1.0 - December 2025</h3>
      <ul>
        <li>Advanced data visualization components</li>
        <li>Animation library</li>
        <li>Additional domain-specific components</li>
      </ul>

      <h3>v1.2.0 - Q1 2026</h3>
      <ul>
        <li>Mobile-specific components</li>
        <li>Gesture library</li>
        <li>PWA patterns</li>
      </ul>

      <h2>Subscribe to Updates</h2>
      <p>Stay informed about new releases:</p>
      <ul>
        <li>
          <strong>GitHub:</strong> Watch the{' '}
          <a href="/resources/github">Fidus repository</a>
        </li>
        <li>
          <strong>Discord:</strong> Join the #announcements channel
        </li>
        <li>
          <strong>RSS:</strong> Subscribe to the changelog feed
        </li>
      </ul>
    </div>
  );
}
