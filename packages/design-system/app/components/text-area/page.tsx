'use client';

import { TextArea } from '@fidus/ui';
import { useState } from 'react';

export default function TextAreaPage() {
  const [description, setDescription] = useState('');
  const [comment, setComment] = useState('');

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Text Area</h1>
        <p className="text-lg text-muted-foreground">
          A multi-line text input component with support for character counting, validation states, and flexible sizing options.
        </p>
      </div>

      {/* Basic Example */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Basic Text Area</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <TextArea label="Description" placeholder="Enter description..." />
          </div>
        </div>
      </section>

      {/* With Helper Text */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">With Helper Text</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <TextArea
              label="Bio"
              placeholder="Tell us about yourself"
              helperText="This will be displayed on your public profile."
            />
          </div>
        </div>
      </section>

      {/* Character Count */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Character Count</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <TextArea
              label="Tweet"
              placeholder="What's happening?"
              maxLength={280}
              showCharCount
              helperText="Maximum 280 characters"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Validation States */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Validation States</h2>
          <div className="space-y-6 rounded-lg border border-border bg-card p-6">
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
          </div>
        </div>
      </section>

      {/* Resize Options */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Resize Options</h2>
          <div className="space-y-6 rounded-lg border border-border bg-card p-6">
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
            <TextArea
              label="Horizontal Resize"
              placeholder="Can resize horizontally only"
              resize="horizontal"
            />
            <TextArea
              label="Both Resize"
              placeholder="Can resize in both directions"
              resize="both"
            />
          </div>
        </div>
      </section>

      {/* Rows Variants */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Rows Variants</h2>
          <div className="space-y-6 rounded-lg border border-border bg-card p-6">
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
            <TextArea
              label="Large (12 rows)"
              placeholder="12 rows height"
              rows={12}
            />
          </div>
        </div>
      </section>

      {/* Required Field */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Required Field</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <TextArea
              label="Feedback"
              placeholder="Please share your thoughts"
              required
              helperText="This field is required"
            />
          </div>
        </div>
      </section>

      {/* Disabled */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Disabled</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <TextArea
              label="Read-only Content"
              disabled
              value="This content cannot be edited. It has been locked by the administrator."
            />
          </div>
        </div>
      </section>

      {/* Props Table */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Props</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-2 text-left font-semibold">Prop</th>
                  <th className="p-2 text-left font-semibold">Type</th>
                  <th className="p-2 text-left font-semibold">Default</th>
                  <th className="p-2 text-left font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">label</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Textarea label text (required)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">placeholder</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Placeholder text</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">value</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Controlled value</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">defaultValue</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Uncontrolled default value</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">disabled</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Whether textarea is disabled</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">required</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Whether textarea is required (shows * indicator)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">error</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Error message to display</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">helperText</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Helper text below textarea</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">showValidIcon</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">true</td>
                  <td className="p-2">Show check icon when valid</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">showErrorIcon</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">true</td>
                  <td className="p-2">Show X icon when error</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">maxLength</td>
                  <td className="p-2 font-mono text-xs">number</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Maximum character length</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">showCharCount</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Show character count (requires maxLength)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">rows</td>
                  <td className="p-2 font-mono text-xs">number</td>
                  <td className="p-2 font-mono text-xs">4</td>
                  <td className="p-2">Number of visible text rows</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">resize</td>
                  <td className="p-2 font-mono text-xs">'none' | 'vertical' | 'horizontal' | 'both'</td>
                  <td className="p-2 font-mono text-xs">'vertical'</td>
                  <td className="p-2">Resize behavior</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">onChange</td>
                  <td className="p-2 font-mono text-xs">(e: ChangeEvent) =&gt; void</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Change event handler</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Accessibility</h2>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            <li>Keyboard accessible (Tab, Shift+Tab for navigation)</li>
            <li>ARIA attributes: aria-invalid, aria-describedby, aria-required</li>
            <li>Error messages announced with aria-live</li>
            <li>Focus indicators visible (2px ring)</li>
            <li>Label properly associated with textarea</li>
            <li>Required fields indicated with * and aria-required</li>
            <li>Character count updates announced to screen readers</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
