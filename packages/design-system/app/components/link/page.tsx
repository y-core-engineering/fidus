'use client';

import { Link } from '@fidus/ui';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';

export default function LinkPage() {
  const props = [
    {
      name: 'variant',
      type: "'inline' | 'standalone'",
      default: "'inline'",
      description: 'Visual style variant of the link',
    },
    {
      name: 'showIcon',
      type: 'boolean',
      description: 'Whether to show an external link icon (for external links only)',
    },
    {
      name: 'external',
      type: 'boolean',
      description: 'Whether this is an external link (auto-adds target="_blank" and rel="noopener noreferrer")',
    },
    {
      name: 'href',
      type: 'string',
      required: true,
      description: 'URL the link points to',
    },
    {
      name: 'children',
      type: 'React.ReactNode',
      required: true,
      description: 'Link content',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Link</h1>
      <p className="lead">
        Links navigate users to different pages or sections. They can be inline within text
        or standalone as clickable elements.
      </p>

      <h2>Variants</h2>
      <ComponentPreview
        code={`<p>
  This is a sentence with an{' '}
  <Link variant="inline" href="/example">
    inline link
  </Link>{' '}
  in the middle.
</p>`}
      >
        <p>
          This is a sentence with an{' '}
          <Link variant="inline" href="/example">
            inline link
          </Link>{' '}
          in the middle.
        </p>
      </ComponentPreview>

      <ComponentPreview
        code={`<Link variant="standalone" href="/example">
  Standalone Link
</Link>`}
      >
        <Link variant="standalone" href="/example">
          Standalone Link
        </Link>
      </ComponentPreview>

      <h2>External Links</h2>
      <ComponentPreview
        code={`<div className="space-y-2">
  <Link variant="inline" href="https://example.com" external>
    External link without icon
  </Link>
  <br />
  <Link variant="inline" href="https://example.com" external showIcon>
    External link with icon
  </Link>
</div>`}
      >
        <div className="space-y-2">
          <Link variant="inline" href="https://example.com" external>
            External link without icon
          </Link>
          <br />
          <Link variant="inline" href="https://example.com" external showIcon>
            External link with icon
          </Link>
        </div>
      </ComponentPreview>

      <h2>Props</h2>
      <PropsTable props={props} />

      <h2>Usage Guidelines</h2>
      <h3>When to use</h3>
      <ul>
        <li>For navigation between pages within the application</li>
        <li>For external references to documentation or resources</li>
        <li>For anchor links to sections within a page</li>
      </ul>

      <h3>Best practices</h3>
      <ul>
        <li>Use inline variant for links within paragraphs or sentences</li>
        <li>Use standalone variant for navigation lists or card links</li>
        <li>Always mark external links with external prop for security</li>
        <li>Consider showing icon for external links to set user expectations</li>
        <li>Use descriptive link text (avoid "click here" or "read more")</li>
      </ul>

      <h3>Accessibility</h3>
      <ul>
        <li>All links have proper focus states for keyboard navigation</li>
        <li>External links automatically get rel="noopener noreferrer" for security</li>
        <li>Link text should be descriptive of the destination</li>
        <li>Links are distinguishable from regular text through color and underline</li>
      </ul>
    </div>
  );
}
