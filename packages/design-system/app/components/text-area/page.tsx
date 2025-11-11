'use client';

import { TextArea } from '@fidus/ui/text-area';
import { Link } from '@fidus/ui/link';
import { Stack } from '@fidus/ui/stack';;
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';
import { useState } from 'react';

export default function TextAreaPage() {
  const [description, setDescription] = useState('');
  const [comment, setComment] = useState('');

  const props = [
    {
      name: 'label',
      type: 'string',
      required: true,
      description: 'Textarea label text',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'Placeholder text',
    },
    {
      name: 'value',
      type: 'string',
      description: 'Controlled value',
    },
    {
      name: 'defaultValue',
      type: 'string',
      description: 'Uncontrolled default value',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Whether textarea is disabled',
    },
    {
      name: 'required',
      type: 'boolean',
      default: 'false',
      description: 'Whether textarea is required (shows * indicator)',
    },
    {
      name: 'error',
      type: 'string',
      description: 'Error message to display',
    },
    {
      name: 'helperText',
      type: 'string',
      description: 'Helper text below textarea',
    },
    {
      name: 'showValidIcon',
      type: 'boolean',
      default: 'true',
      description: 'Show check icon when valid',
    },
    {
      name: 'showErrorIcon',
      type: 'boolean',
      default: 'true',
      description: 'Show X icon when error',
    },
    {
      name: 'maxLength',
      type: 'number',
      description: 'Maximum character length',
    },
    {
      name: 'showCharCount',
      type: 'boolean',
      default: 'true',
      description: 'Show character count (requires maxLength)',
    },
    {
      name: 'rows',
      type: 'number',
      default: '4',
      description: 'Number of visible text rows',
    },
    {
      name: 'resize',
      type: "'none' | 'vertical' | 'horizontal' | 'both'",
      default: "'vertical'",
      description: 'Resize behavior',
    },
    {
      name: 'onChange',
      type: '(e: ChangeEvent<HTMLTextAreaElement>) => void',
      description: 'Change event handler',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Text Area</h1>
      <p className="lead">
        A multi-line text input component with support for character counting, validation states, and flexible sizing options.
      </p>

      <h2>Basic Text Area</h2>
      <ComponentPreview code={`<TextArea label="Description" placeholder="Enter description..." />`}>
        <TextArea label="Description" placeholder="Enter description..." />
      </ComponentPreview>

      <h2>With Helper Text</h2>
      <ComponentPreview
        code={`<TextArea
  label="Bio"
  placeholder="Tell us about yourself"
  helperText="This will be displayed on your public profile."
/>`}
      >
        <TextArea
          label="Bio"
          placeholder="Tell us about yourself"
          helperText="This will be displayed on your public profile."
        />
      </ComponentPreview>

      <h2>Character Count</h2>
      <ComponentPreview
        code={`<TextArea
  label="Tweet"
  placeholder="What's happening?"
  maxLength={280}
  showCharCount
  helperText="Maximum 280 characters"
/>`}
      >
        <TextArea
          label="Tweet"
          placeholder="What's happening?"
          maxLength={280}
          showCharCount
          helperText="Maximum 280 characters"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </ComponentPreview>

      <h2>Validation States</h2>
      <ComponentPreview
        code={`<Stack direction="vertical" spacing="lg">
  <TextArea
    label="Valid Feedback"
    value="This looks great! Thank you for the detailed feedback."
    showValidIcon
  />
  <TextArea
    label="Invalid Input"
    value="Too short"
    error="Description must be at least 50 characters"
    showErrorIcon
  />
</Stack>`}
      >
        <Stack direction="vertical" spacing="lg">
          <TextArea
            label="Valid Feedback"
            value="This looks great! Thank you for the detailed feedback."
            showValidIcon
          />
          <TextArea
            label="Invalid Input"
            value="Too short"
            error="Description must be at least 50 characters"
            showErrorIcon
          />
        </Stack>
      </ComponentPreview>

      <h2>Resize Options</h2>
      <ComponentPreview
        code={`<Stack direction="vertical" spacing="lg">
  <TextArea
    label="No Resize"
    placeholder="Cannot resize this textarea"
    resize="none"
  />
  <TextArea
    label="Vertical Resize"
    placeholder="Can resize vertically only"
    resize="vertical"
  />
</Stack>`}
      >
        <Stack direction="vertical" spacing="lg">
          <TextArea
            label="No Resize"
            placeholder="Cannot resize this textarea"
            resize="none"
          />
          <TextArea
            label="Vertical Resize"
            placeholder="Can resize vertically only"
            resize="vertical"
          />
        </Stack>
      </ComponentPreview>

      <h2>Rows Variants</h2>
      <ComponentPreview
        code={`<Stack direction="vertical" spacing="lg">
  <TextArea label="Small (4 rows)" placeholder="4 rows height" rows={4} />
  <TextArea label="Medium (8 rows)" placeholder="8 rows height" rows={8} />
</Stack>`}
      >
        <Stack direction="vertical" spacing="lg">
          <TextArea
            label="Small (4 rows)"
            placeholder="4 rows height"
            rows={4}
          />
          <TextArea
            label="Medium (8 rows)"
            placeholder="8 rows height"
            rows={8}
          />
        </Stack>
      </ComponentPreview>

      <h2>States</h2>
      <ComponentPreview
        code={`<Stack direction="vertical" spacing="lg">
  <TextArea
    label="Required Field"
    placeholder="Please share your thoughts"
    required
    helperText="This field is required"
  />
  <TextArea
    label="Disabled"
    disabled
    value="This content cannot be edited. It has been locked by the administrator."
  />
</Stack>`}
      >
        <Stack direction="vertical" spacing="lg">
          <TextArea
            label="Required Field"
            placeholder="Please share your thoughts"
            required
            helperText="This field is required"
          />
          <TextArea
            label="Disabled"
            disabled
            value="This content cannot be edited. It has been locked by the administrator."
          />
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
              <span>For collecting multi-line text input like comments, descriptions, or feedback</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When users need to enter more than a single line of text</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For form fields that require detailed responses</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When character limits need to be enforced (use maxLength and showCharCount)</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use clear, descriptive labels that indicate what content is expected</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Set appropriate row height based on expected content length</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Show character count when there's a maximum length limit</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use helper text to provide guidance on expected format or content</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Enable vertical resize for flexibility, or disable resize for fixed layouts</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Display validation feedback inline with clear error messages</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keyboard accessible (Tab, Shift+Tab for navigation)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>ARIA attributes: aria-invalid, aria-describedby, aria-required</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Error messages announced with aria-live="polite"</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Focus indicators visible (2px ring)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Label properly associated with textarea</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Required fields indicated with * and aria-required</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Character count updates announced to screen readers</span>
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
              <span>Provide clear labels and helpful placeholder text</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Show character count for fields with length limits</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Set appropriate row height for expected content</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use helper text to guide users on format or requirements</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Show inline validation with clear error messages</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview
              code={`<TextArea
  label="Feedback"
  placeholder="Share your thoughts..."
  maxLength={500}
  showCharCount
  helperText="Help us improve by sharing your experience"
  rows={6}
/>`}
            >
              <TextArea
                label="Feedback"
                placeholder="Share your thoughts..."
                maxLength={500}
                showCharCount
                helperText="Help us improve by sharing your experience"
                rows={6}
              />
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
              <span>Don't use text area for single-line input - use Input instead</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't make the textarea too small for expected content</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't hide character limits - show count when maxLength is set</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use vague labels like "Text" or "Input"</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't disable resize without good reason</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview
              code={`<TextArea
  label="Text"
  rows={2}
  resize="none"
/>`}
            >
              <TextArea
                label="Text"
                rows={2}
                resize="none"
              />
            </ComponentPreview>
          </div>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/input"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Input</h3>
          <p className="text-sm text-muted-foreground">For single-line text input</p>
        </Link>
        <Link
          href="/components/label"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Label</h3>
          <p className="text-sm text-muted-foreground">Accessible form field labels</p>
        </Link>
        <Link
          href="/components/form"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Form</h3>
          <p className="text-sm text-muted-foreground">Complete form with validation</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/text-area/text-area.tsx"
              external
              showIcon
            >
              View source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/ARIA/apg/patterns/textarea/"
              external
              showIcon
            >
              ARIA: Textarea Pattern
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
