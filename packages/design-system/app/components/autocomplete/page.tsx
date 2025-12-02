'use client';

import { Autocomplete } from '@fidus/ui/autocomplete';
import { Link } from '@fidus/ui/link';
import { useState } from 'react';
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';

export default function AutocompletePage() {
  const [city, setCity] = useState('');
  const [skill, setSkill] = useState('React');
  const [tag, setTag] = useState('');

  const cities = [
    'Berlin',
    'Hamburg',
    'Munich',
    'Cologne',
    'Frankfurt',
    'Stuttgart',
    'Düsseldorf',
    'Leipzig',
    'Dortmund',
    'Essen',
    'Bremen',
    'Dresden',
    'Hanover',
    'Nuremberg',
    'Duisburg',
  ];

  const programmingLanguages = [
    'JavaScript',
    'TypeScript',
    'Python',
    'Java',
    'C++',
    'C#',
    'Go',
    'Rust',
    'Ruby',
    'PHP',
    'Swift',
    'Kotlin',
  ];

  const skills = [
    'React',
    'Vue',
    'Angular',
    'Next.js',
    'Node.js',
    'Express',
    'FastAPI',
    'Django',
    'PostgreSQL',
    'MongoDB',
  ];

  const props = [
    {
      name: 'label',
      type: 'string',
      required: true,
      description: 'Label text for the input',
    },
    {
      name: 'suggestions',
      type: 'string[]',
      required: true,
      description: 'Array of suggestion strings to display',
    },
    {
      name: 'placeholder',
      type: 'string',
      default: "'Type to search...'",
      description: 'Placeholder text when input is empty',
    },
    {
      name: 'value',
      type: 'string',
      description: 'Controlled value of the input',
    },
    {
      name: 'maxSuggestions',
      type: 'number',
      default: '10',
      description: 'Maximum number of suggestions to display',
    },
    {
      name: 'allowCustomValue',
      type: 'boolean',
      default: 'true',
      description: 'Allow entering values not in suggestions list',
    },
    {
      name: 'clearable',
      type: 'boolean',
      default: 'true',
      description: 'Show clear button when input has value',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Whether the input is disabled',
    },
    {
      name: 'error',
      type: 'string',
      description: 'Error message to display',
    },
    {
      name: 'helperText',
      type: 'string',
      description: 'Helper text below input',
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      description: 'Callback when input value changes',
    },
    {
      name: 'onSelect',
      type: '(value: string) => void',
      description: 'Callback when a suggestion is selected',
    },
    {
      name: 'onClear',
      type: '() => void',
      description: 'Callback when input is cleared',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Autocomplete</h1>
      <p className="lead">
        A text input with type-ahead suggestions. Supports keyboard navigation, custom values, and validation states.
      </p>

      <h2>Basic Example</h2>
      <ComponentPreview
        code={`<Autocomplete
  label="City"
  placeholder="Search for a city"
  suggestions={cities}
/>`}
      >
        <Autocomplete
          label="City"
          placeholder="Search for a city"
          suggestions={cities}
        />
      </ComponentPreview>

      <h2>Controlled Value</h2>
      <ComponentPreview
        code={`<Autocomplete
  label="City"
  placeholder="Search cities"
  suggestions={cities}
  value={city}
  onChange={setCity}
  helperText="Type to filter suggestions"
/>`}
      >
        <Autocomplete
          label="City"
          placeholder="Search cities"
          suggestions={cities}
          value={city}
          onChange={setCity}
          helperText="Type to filter suggestions"
        />
      </ComponentPreview>

      <h2>Pre-selected Value</h2>
      <ComponentPreview
        code={`<Autocomplete
  label="Primary Skill"
  placeholder="Select skill"
  suggestions={skills}
  value={skill}
  onChange={setSkill}
  helperText="React is pre-selected"
/>`}
      >
        <Autocomplete
          label="Primary Skill"
          placeholder="Select skill"
          suggestions={skills}
          value={skill}
          onChange={setSkill}
          helperText="React is pre-selected"
        />
      </ComponentPreview>

      <h2>With Helper Text</h2>
      <ComponentPreview
        code={`<Autocomplete
  label="Programming Language"
  placeholder="Type to search"
  suggestions={programmingLanguages}
  helperText="Start typing to see suggestions"
/>`}
      >
        <Autocomplete
          label="Programming Language"
          placeholder="Type to search"
          suggestions={programmingLanguages}
          helperText="Start typing to see suggestions"
        />
      </ComponentPreview>

      <h2>States</h2>

      <h3>Error State</h3>
      <ComponentPreview
        code={`<Autocomplete
  label="City"
  placeholder="Select a city"
  suggestions={cities}
  error="Please select a valid city"
/>`}
      >
        <Autocomplete
          label="City"
          placeholder="Select a city"
          suggestions={cities}
          error="Please select a valid city"
        />
      </ComponentPreview>

      <h3>Disabled State</h3>
      <ComponentPreview
        code={`<Autocomplete
  label="Location"
  placeholder="Not available"
  suggestions={cities}
  disabled
  value="Berlin"
/>`}
      >
        <Autocomplete
          label="Location"
          placeholder="Not available"
          suggestions={cities}
          disabled
          value="Berlin"
        />
      </ComponentPreview>

      <h2>Allow Custom Values</h2>
      <p>
        When <code>allowCustomValue</code> is true (default), users can enter values not in the suggestions list and press Enter to confirm.
      </p>
      <ComponentPreview
        code={`<Autocomplete
  label="Tag"
  placeholder="Enter or select a tag"
  suggestions={['Design', 'Development', 'Marketing', 'Sales']}
  allowCustomValue
  value={tag}
  onChange={setTag}
  helperText="Type a custom tag and press Enter"
/>`}
      >
        <Autocomplete
          label="Tag"
          placeholder="Enter or select a tag"
          suggestions={['Design', 'Development', 'Marketing', 'Sales']}
          allowCustomValue
          value={tag}
          onChange={setTag}
          helperText="Type a custom tag and press Enter"
        />
      </ComponentPreview>

      <h2>Restrict to Suggestions</h2>
      <p>
        Set <code>allowCustomValue=false</code> to only allow selecting from suggestions.
      </p>
      <ComponentPreview
        code={`<Autocomplete
  label="Framework"
  placeholder="Select a framework"
  suggestions={skills}
  allowCustomValue={false}
  helperText="Only values from the list are allowed"
/>`}
      >
        <Autocomplete
          label="Framework"
          placeholder="Select a framework"
          suggestions={skills}
          allowCustomValue={false}
          helperText="Only values from the list are allowed"
        />
      </ComponentPreview>

      <h2>Limit Suggestions</h2>
      <ComponentPreview
        code={`<Autocomplete
  label="City"
  placeholder="Search cities"
  suggestions={cities}
  maxSuggestions={5}
  helperText="Shows max 5 suggestions"
/>`}
      >
        <Autocomplete
          label="City"
          placeholder="Search cities"
          suggestions={cities}
          maxSuggestions={5}
          helperText="Shows max 5 suggestions"
        />
      </ComponentPreview>

      <h2>Non-Clearable</h2>
      <ComponentPreview
        code={`<Autocomplete
  label="Required Field"
  placeholder="Type to search"
  suggestions={cities}
  clearable={false}
  helperText="Clear button is hidden"
/>`}
      >
        <Autocomplete
          label="Required Field"
          placeholder="Type to search"
          suggestions={cities}
          clearable={false}
          helperText="Clear button is hidden"
        />
      </ComponentPreview>

      <h2>Props</h2>
      <PropsTable props={props} />

      <h2>Keyboard Navigation</h2>
      <div className="not-prose my-lg">
        <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Key</th>
              <th className="px-4 py-2 text-left font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-border">
              <td className="px-4 py-2"><kbd className="px-2 py-1 bg-muted rounded text-xs">↓</kbd> Arrow Down</td>
              <td className="px-4 py-2">Open suggestions / Move to next suggestion</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-4 py-2"><kbd className="px-2 py-1 bg-muted rounded text-xs">↑</kbd> Arrow Up</td>
              <td className="px-4 py-2">Move to previous suggestion</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-4 py-2"><kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd></td>
              <td className="px-4 py-2">Select highlighted suggestion / Confirm custom value</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-4 py-2"><kbd className="px-2 py-1 bg-muted rounded text-xs">Escape</kbd></td>
              <td className="px-4 py-2">Close suggestions dropdown</td>
            </tr>
            <tr className="border-t border-border">
              <td className="px-4 py-2"><kbd className="px-2 py-1 bg-muted rounded text-xs">Tab</kbd></td>
              <td className="px-4 py-2">Close dropdown and move to next element</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Usage Guidelines</h2>
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When users need to select from a long list with type-ahead filtering</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When the list of options is dynamic or loaded from an API</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When users might need to enter custom values not in the list</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For tagging or labeling interfaces</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Provide meaningful placeholder text that hints at expected input</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use helper text to explain how the autocomplete works</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Set appropriate maxSuggestions to avoid overwhelming the user</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Consider disabling custom values when input must match specific options</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Full keyboard navigation (Arrow keys, Enter, Escape)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>ARIA combobox pattern with listbox for suggestions</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>aria-expanded indicates dropdown state</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>aria-invalid for error states</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Error messages announced with aria-live</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Clear button has accessible label</span>
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
              <span>Use for searchable lists with many options</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Allow custom values when appropriate</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Provide clear feedback when no results match</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use descriptive labels and placeholders</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview
              code={`<Autocomplete
  label="Search Cities"
  placeholder="Type to find a city..."
  suggestions={cities}
  helperText="Start typing to see suggestions"
/>`}
            >
              <Autocomplete
                label="Search Cities"
                placeholder="Type to find a city..."
                suggestions={cities}
                helperText="Start typing to see suggestions"
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
              <span>Don't use for short lists (use Select instead)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use vague placeholder text</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't show too many suggestions at once</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't require exact matching without clear indication</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview
              code={`<Autocomplete
  label="Options"
  placeholder="..."
  suggestions={['A', 'B', 'C']}
/>`}
            >
              <Autocomplete
                label="Options"
                placeholder="..."
                suggestions={['A', 'B', 'C']}
              />
            </ComponentPreview>
          </div>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/select"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Select</h3>
          <p className="text-sm text-muted-foreground">For choosing from a predefined list</p>
        </Link>
        <Link
          href="/components/text-input"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Text Input</h3>
          <p className="text-sm text-muted-foreground">For free-form text entry</p>
        </Link>
        <Link
          href="/components/chip"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Chip</h3>
          <p className="text-sm text-muted-foreground">For displaying selected tags</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/autocomplete/autocomplete.tsx"
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
            <Link variant="standalone" href="/getting-started/for-developers">
              Installation guide
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
