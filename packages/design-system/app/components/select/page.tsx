'use client';

import { Select } from '@fidus/ui';
import { useState } from 'react';

export default function SelectPage() {
  const [country, setCountry] = useState('');
  const [category, setCategory] = useState('');
  const [skill, setSkill] = useState('nodejs');

  const countryOptions = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
  ];

  const categoryOptions = [
    { value: 'tech', label: 'Technology' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'support', label: 'Customer Support' },
  ];

  const foodGroups = [
    {
      label: 'Fruits',
      options: [
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
        { value: 'orange', label: 'Orange' },
        { value: 'grape', label: 'Grape' },
      ],
    },
    {
      label: 'Vegetables',
      options: [
        { value: 'carrot', label: 'Carrot' },
        { value: 'broccoli', label: 'Broccoli' },
        { value: 'spinach', label: 'Spinach' },
        { value: 'tomato', label: 'Tomato' },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">Select</h1>
        <p className="text-lg text-muted-foreground">
          A dropdown selection component with support for search, grouping, clearing, and validation states.
        </p>
      </div>

      {/* Basic Example */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Basic Select</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Select
              label="Country"
              placeholder="Select a country"
              options={countryOptions}
            />
          </div>
        </div>
      </section>

      {/* With Placeholder */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">With Placeholder</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Select
              label="Category"
              placeholder="Choose a category..."
              options={categoryOptions}
              value={category}
              onChange={setCategory}
            />
          </div>
        </div>
      </section>

      {/* With Helper Text */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">With Helper Text</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Select
              label="Department"
              placeholder="Select department"
              options={categoryOptions}
              helperText="Select the department you work in"
            />
          </div>
        </div>
      </section>

      {/* Pre-selected Value */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Pre-selected Value</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Select
              label="Primary Skill"
              placeholder="Select skill"
              options={[
                { value: 'nodejs', label: 'Node.js' },
                { value: 'react', label: 'React' },
                { value: 'python', label: 'Python' },
                { value: 'java', label: 'Java' },
              ]}
              value={skill}
              onChange={setSkill}
              helperText="Node.js is pre-selected"
            />
          </div>
        </div>
      </section>

      {/* Error State */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Error State</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Select
              label="Country"
              placeholder="Select a country"
              options={countryOptions}
              error="Please select a country from the list"
            />
          </div>
        </div>
      </section>

      {/* Disabled State */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Disabled State</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Select
              label="Region"
              placeholder="Not available"
              options={countryOptions}
              disabled
              value="us"
            />
          </div>
        </div>
      </section>

      {/* Searchable Select */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Searchable Select</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Select
              label="Country"
              placeholder="Search for a country"
              options={countryOptions}
              searchable
              value={country}
              onChange={setCountry}
              helperText="Type to filter options"
            />
          </div>
        </div>
      </section>

      {/* Clearable Select */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Clearable Select</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Select
              label="Category"
              placeholder="Select category"
              options={categoryOptions}
              clearable
              defaultValue="tech"
              helperText="Click the X icon to clear selection"
            />
          </div>
        </div>
      </section>

      {/* Grouped Options */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Grouped Options</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Select
              label="Favorite Food"
              placeholder="Select a food item"
              groups={foodGroups}
              helperText="Options are organized by category"
            />
          </div>
        </div>
      </section>

      {/* Searchable with Groups */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Searchable with Groups</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Select
              label="Food Category"
              placeholder="Search foods"
              groups={foodGroups}
              searchable
              helperText="Type to search across all categories"
            />
          </div>
        </div>
      </section>

      {/* Required Field */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Required Field</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <Select
              label="Country of Residence"
              placeholder="Select country"
              options={countryOptions}
              required
              helperText="This field is required"
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
                  <td className="p-2">Select label text (required)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">placeholder</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 font-mono text-xs">&apos;Select an option...&apos;</td>
                  <td className="p-2">Placeholder text when no value selected</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">value</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Controlled value (option value)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">defaultValue</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Uncontrolled default value</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">options</td>
                  <td className="p-2 font-mono text-xs">SelectOption[]</td>
                  <td className="p-2 font-mono text-xs">[]</td>
                  <td className="p-2">Array of options (value, label, disabled?)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">groups</td>
                  <td className="p-2 font-mono text-xs">SelectGroup[]</td>
                  <td className="p-2 font-mono text-xs">[]</td>
                  <td className="p-2">Array of grouped options (label, options[])</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">searchable</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Enable search/filter functionality</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">clearable</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Show clear button when value selected</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">disabled</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Whether select is disabled</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">required</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Whether select is required (shows * indicator)</td>
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
                  <td className="p-2">Helper text below select</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">onChange</td>
                  <td className="p-2 font-mono text-xs">(value: string) =&gt; void</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Callback when value changes</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">onBlur</td>
                  <td className="p-2 font-mono text-xs">() =&gt; void</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Callback when select loses focus</td>
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
            <li>Keyboard accessible (Tab, Arrow keys, Enter, Escape)</li>
            <li>ARIA attributes: aria-invalid, aria-describedby</li>
            <li>Error messages announced with aria-live</li>
            <li>Focus indicators visible on trigger and options</li>
            <li>Label properly associated with select</li>
            <li>Required fields indicated with * and aria-required</li>
            <li>Search input accessible when searchable enabled</li>
            <li>Option selection indicated with check icon</li>
            <li>Grouped options properly labeled with group headers</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
