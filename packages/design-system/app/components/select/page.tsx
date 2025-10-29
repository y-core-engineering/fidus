'use client';

import { Select, Link, Stack } from '@fidus/ui';
import { useState } from 'react';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';

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

  const skillOptions = [
    { value: 'nodejs', label: 'Node.js' },
    { value: 'react', label: 'React' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
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

  const props = [
    {
      name: 'label',
      type: 'string',
      required: true,
      description: 'Select label text',
    },
    {
      name: 'placeholder',
      type: 'string',
      default: "'Select an option...'",
      description: 'Placeholder text when no value selected',
    },
    {
      name: 'value',
      type: 'string',
      description: 'Controlled value (option value)',
    },
    {
      name: 'defaultValue',
      type: 'string',
      description: 'Uncontrolled default value',
    },
    {
      name: 'options',
      type: 'SelectOption[]',
      default: '[]',
      description: 'Array of options (value, label, disabled?)',
    },
    {
      name: 'groups',
      type: 'SelectGroup[]',
      default: '[]',
      description: 'Array of grouped options (label, options[])',
    },
    {
      name: 'searchable',
      type: 'boolean',
      default: 'false',
      description: 'Enable search/filter functionality',
    },
    {
      name: 'clearable',
      type: 'boolean',
      default: 'false',
      description: 'Show clear button when value selected',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Whether select is disabled',
    },
    {
      name: 'required',
      type: 'boolean',
      default: 'false',
      description: 'Whether select is required (shows * indicator)',
    },
    {
      name: 'error',
      type: 'string',
      description: 'Error message to display',
    },
    {
      name: 'helperText',
      type: 'string',
      description: 'Helper text below select',
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      description: 'Callback when value changes',
    },
    {
      name: 'onBlur',
      type: '() => void',
      description: 'Callback when select loses focus',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Select</h1>
      <p className="lead">
        A dropdown selection component with support for search, grouping, clearing, and validation states.
      </p>

      <h2>Basic Example</h2>
      <ComponentPreview
        code={`<Select
  label="Country"
  placeholder="Select a country"
  options={countryOptions}
/>`}
      >
        <Select
          label="Country"
          placeholder="Select a country"
          options={countryOptions}
        />
      </ComponentPreview>

      <h2>With Placeholder</h2>
      <ComponentPreview
        code={`<Select
  label="Category"
  placeholder="Choose a category..."
  options={categoryOptions}
  value={category}
  onChange={setCategory}
/>`}
      >
        <Select
          label="Category"
          placeholder="Choose a category..."
          options={categoryOptions}
          value={category}
          onChange={setCategory}
        />
      </ComponentPreview>

      <h2>With Helper Text</h2>
      <ComponentPreview
        code={`<Select
  label="Department"
  placeholder="Select department"
  options={categoryOptions}
  helperText="Select the department you work in"
/>`}
      >
        <Select
          label="Department"
          placeholder="Select department"
          options={categoryOptions}
          helperText="Select the department you work in"
        />
      </ComponentPreview>

      <h2>Pre-selected Value</h2>
      <ComponentPreview
        code={`<Select
  label="Primary Skill"
  placeholder="Select skill"
  options={skillOptions}
  value={skill}
  onChange={setSkill}
  helperText="Node.js is pre-selected"
/>`}
      >
        <Select
          label="Primary Skill"
          placeholder="Select skill"
          options={skillOptions}
          value={skill}
          onChange={setSkill}
          helperText="Node.js is pre-selected"
        />
      </ComponentPreview>

      <h2>States</h2>

      <h3>Error State</h3>
      <ComponentPreview
        code={`<Select
  label="Country"
  placeholder="Select a country"
  options={countryOptions}
  error="Please select a country from the list"
/>`}
      >
        <Select
          label="Country"
          placeholder="Select a country"
          options={countryOptions}
          error="Please select a country from the list"
        />
      </ComponentPreview>

      <h3>Disabled State</h3>
      <ComponentPreview
        code={`<Select
  label="Region"
  placeholder="Not available"
  options={countryOptions}
  disabled
  value="us"
/>`}
      >
        <Select
          label="Region"
          placeholder="Not available"
          options={countryOptions}
          disabled
          value="us"
        />
      </ComponentPreview>

      <h3>Required Field</h3>
      <ComponentPreview
        code={`<Select
  label="Country of Residence"
  placeholder="Select country"
  options={countryOptions}
  required
  helperText="This field is required"
/>`}
      >
        <Select
          label="Country of Residence"
          placeholder="Select country"
          options={countryOptions}
          required
          helperText="This field is required"
        />
      </ComponentPreview>

      <h2>Searchable Select</h2>
      <ComponentPreview
        code={`<Select
  label="Country"
  placeholder="Search for a country"
  options={countryOptions}
  searchable
  value={country}
  onChange={setCountry}
  helperText="Type to filter options"
/>`}
      >
        <Select
          label="Country"
          placeholder="Search for a country"
          options={countryOptions}
          searchable
          value={country}
          onChange={setCountry}
          helperText="Type to filter options"
        />
      </ComponentPreview>

      <h2>Clearable Select</h2>
      <ComponentPreview
        code={`<Select
  label="Category"
  placeholder="Select category"
  options={categoryOptions}
  clearable
  defaultValue="tech"
  helperText="Click the X icon to clear selection"
/>`}
      >
        <Select
          label="Category"
          placeholder="Select category"
          options={categoryOptions}
          clearable
          defaultValue="tech"
          helperText="Click the X icon to clear selection"
        />
      </ComponentPreview>

      <h2>Grouped Options</h2>
      <ComponentPreview
        code={`<Select
  label="Favorite Food"
  placeholder="Select a food item"
  groups={foodGroups}
  helperText="Options are organized by category"
/>`}
      >
        <Select
          label="Favorite Food"
          placeholder="Select a food item"
          groups={foodGroups}
          helperText="Options are organized by category"
        />
      </ComponentPreview>

      <h2>Searchable with Groups</h2>
      <ComponentPreview
        code={`<Select
  label="Food Category"
  placeholder="Search foods"
  groups={foodGroups}
  searchable
  helperText="Type to search across all categories"
/>`}
      >
        <Select
          label="Food Category"
          placeholder="Search foods"
          groups={foodGroups}
          searchable
          helperText="Type to search across all categories"
        />
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
              <span>When users need to choose one option from a list of 5+ items</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When you need to save vertical space compared to radio buttons</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For selecting from categorized groups of related options</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When options need to be searchable or filterable</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use clear, descriptive labels that indicate what users are selecting</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Enable search functionality for lists with 10+ options</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use groups to organize related options and improve scannability</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Provide helpful placeholder text that hints at the expected selection</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use helper text to provide additional context or instructions</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Consider making selects clearable when selection is optional</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keyboard accessible (Tab, Arrow keys, Enter, Escape)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>ARIA attributes: aria-invalid, aria-describedby, aria-required</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Error messages announced with aria-live</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Focus indicators visible on trigger and options</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Label properly associated with select</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Required fields indicated with * and aria-required</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Search input accessible when searchable enabled</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Option selection indicated with check icon</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Grouped options properly labeled with group headers</span>
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
              <span>Use selects for 5 or more options to save space</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Enable search for long lists to improve user experience</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Group related options to help users find what they need</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Provide clear error messages when validation fails</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use descriptive labels that clearly indicate what to select</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview
              code={`<Select
  label="Country"
  placeholder="Search countries..."
  options={countryOptions}
  searchable
  helperText="Select your country of residence"
/>`}
            >
              <Select
                label="Country"
                placeholder="Search countries..."
                options={countryOptions}
                searchable
                helperText="Select your country of residence"
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
              <span>Don't use select for 2-4 options - use radio buttons instead</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use vague placeholder text like "Choose..." or "Select..."</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't hide important options deep in long lists without search</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't disable options without explaining why in helper text</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use select for actions - use buttons or menus instead</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview
              code={`<Select
  label="Options"
  placeholder="Choose..."
  options={[
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' }
  ]}
/>`}
            >
              <Select
                label="Options"
                placeholder="Choose..."
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' }
                ]}
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
          <p className="text-sm text-muted-foreground">For free-form text entry</p>
        </Link>
        <Link
          href="/components/radio"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Radio Group</h3>
          <p className="text-sm text-muted-foreground">For selecting from 2-4 visible options</p>
        </Link>
        <Link
          href="/components/checkbox"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Checkbox</h3>
          <p className="text-sm text-muted-foreground">For multiple selections</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/select/select.tsx"
              external
              showIcon
            >
              View source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/"
              external
              showIcon
            >
              ARIA: Combobox Pattern
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/ARIA/apg/patterns/listbox/"
              external
              showIcon
            >
              ARIA: Listbox Pattern
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
