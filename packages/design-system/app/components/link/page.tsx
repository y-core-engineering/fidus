'use client';

import { Link, Stack } from '@fidus/ui';
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
        code={`<Stack direction="vertical" spacing="sm">
  <Link variant="inline" href="https://example.com" external>
    External link without icon
  </Link>
  <Link variant="inline" href="https://example.com" external showIcon>
    External link with icon
  </Link>
</Stack>`}
      >
        <Stack direction="vertical" spacing="sm">
          <Link variant="inline" href="https://example.com" external>
            External link without icon
          </Link>
          <Link variant="inline" href="https://example.com" external showIcon>
            External link with icon
          </Link>
        </Stack>
      </ComponentPreview>

      <h2>Props</h2>
      <PropsTable props={props} />

      <h2>Usage Guidelines</h2>
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For navigation between pages within the application</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For external references to documentation or resources</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For anchor links to sections within a page</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use inline variant for links within paragraphs or sentences</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use standalone variant for navigation lists or card links</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Always mark external links with external prop for security</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Consider showing icon for external links to set user expectations</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use descriptive link text (avoid "click here" or "read more")</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>All links have proper focus states for keyboard navigation</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>External links automatically get rel="noopener noreferrer" for security</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Link text should be descriptive of the destination</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Links are distinguishable from regular text through color and underline</span>
            </li>
          </ul>
        </div>
      </div>

      <h2 className="mt-2xl">Do's and Don'ts</h2>

      <div className="not-prose grid md:grid-cols-2 gap-lg my-lg">
        {/* Do's */}
        <div className="border-2 border-success rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-success mb-md flex items-center gap-sm">
            <span className="text-2xl">✓</span> Do
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use descriptive link text that indicates the destination</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Mark external links with the external prop for security</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use inline variant for links within body text</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Show icon for external links to set clear expectations</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use standalone variant for navigation and lists</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview
              code={`<p>
  Learn more about our{' '}
  <Link variant="inline" href="/privacy-policy">
    privacy policy
  </Link>{' '}
  and{' '}
  <Link variant="inline" href="/terms" external showIcon>
    terms of service
  </Link>
  .
</p>`}
            >
              <p>
                Learn more about our{' '}
                <Link variant="inline" href="/privacy-policy">
                  privacy policy
                </Link>{' '}
                and{' '}
                <Link variant="inline" href="https://example.com/terms" external showIcon>
                  terms of service
                </Link>
                .
              </p>
            </ComponentPreview>
          </div>
        </div>

        {/* Don'ts */}
        <div className="border-2 border-error bg-error/10 rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-error mb-md flex items-center gap-sm">
            <span className="text-2xl">✗</span> Don't
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use vague text like "click here" or "read more"</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't forget to mark external links with external prop</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use standalone variant in the middle of sentences</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use links for actions that don't navigate (use Button)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't make entire long sentences into links</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview
              code={`<p>
  For more information about our policies and how we handle your data,{' '}
  <Link variant="inline" href="/info">
    click here
  </Link>
  .
</p>`}
            >
              <p>
                For more information about our policies and how we handle your data,{' '}
                <Link variant="inline" href="/info">
                  click here
                </Link>
                .
              </p>
            </ComponentPreview>
          </div>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/button"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Button
          </h3>
          <p className="text-sm text-muted-foreground">For actions and interactions</p>
        </Link>
        <Link
          href="/components/breadcrumb"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Breadcrumb
          </h3>
          <p className="text-sm text-muted-foreground">Navigation trail with links</p>
        </Link>
        <Link
          href="/components/navigation"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">
            Navigation
          </h3>
          <p className="text-sm text-muted-foreground">Primary site navigation</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/link/link.tsx"
              external
              showIcon
            >
              View source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/ARIA/apg/patterns/link/"
              external
              showIcon
            >
              ARIA: Link Pattern
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
