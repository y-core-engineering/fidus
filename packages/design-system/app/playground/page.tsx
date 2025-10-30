'use client';

import * as React from 'react';
import { useState, useMemo } from 'react';
import { Search, Monitor, Tablet, Smartphone, Sun, Moon, Copy, Check, Code2, Download } from 'lucide-react';
import * as FidusUI from '@fidus/ui';
import { z } from 'zod';

// ============================================================================
// COMPONENT REGISTRY
// ============================================================================

interface ComponentMetadata {
  name: string;
  category: 'Actions' | 'Layout' | 'Data Display' | 'Cards' | 'Forms' | 'Feedback' | 'Overlays' | 'Navigation';
  component: React.ComponentType<any>;
  propsSchema: z.ZodObject<z.ZodRawShape>;
  defaultProps: Record<string, unknown>;
  description: string;
}

const componentRegistry: ComponentMetadata[] = [
  // Actions
  {
    name: 'Button',
    category: 'Actions',
    component: FidusUI.Button,
    propsSchema: FidusUI.ButtonPropsSchema,
    defaultProps: {
      variant: 'primary',
      size: 'md',
      children: 'Click me',
    },
    description: 'Primary action button with multiple variants',
  },
  {
    name: 'Link',
    category: 'Actions',
    component: FidusUI.Link,
    propsSchema: FidusUI.LinkPropsSchema,
    defaultProps: {
      href: '#',
      children: 'Link text',
    },
    description: 'Navigation link component',
  },
  {
    name: 'IconButton',
    category: 'Actions',
    component: FidusUI.IconButton,
    propsSchema: FidusUI.IconButtonPropsSchema,
    defaultProps: {
      variant: 'ghost',
      size: 'md',
      'aria-label': 'Icon button',
      children: '❤️',
    },
    description: 'Button with icon only',
  },
  {
    name: 'ButtonGroup',
    category: 'Actions',
    component: FidusUI.ButtonGroup,
    propsSchema: FidusUI.ButtonGroupPropsSchema,
    defaultProps: {
      orientation: 'horizontal',
      children: React.createElement(
        React.Fragment,
        null,
        React.createElement(FidusUI.Button, { key: '1' }, 'First'),
        React.createElement(FidusUI.Button, { key: '2' }, 'Second'),
        React.createElement(FidusUI.Button, { key: '3' }, 'Third')
      ),
    },
    description: 'Group of related buttons',
  },

  // Layout
  {
    name: 'Container',
    category: 'Layout',
    component: FidusUI.Container,
    propsSchema: FidusUI.ContainerPropsSchema,
    defaultProps: {
      size: 'md',
      children: 'Container content',
    },
    description: 'Responsive container with max-width',
  },
  {
    name: 'Stack',
    category: 'Layout',
    component: FidusUI.Stack,
    propsSchema: FidusUI.StackPropsSchema,
    defaultProps: {
      direction: 'vertical',
      spacing: 'md',
      children: React.createElement(
        React.Fragment,
        null,
        React.createElement('div', { key: '1' }, 'Item 1'),
        React.createElement('div', { key: '2' }, 'Item 2'),
        React.createElement('div', { key: '3' }, 'Item 3')
      ),
    },
    description: 'Flexible vertical or horizontal stack',
  },
  {
    name: 'Divider',
    category: 'Layout',
    component: FidusUI.Divider,
    propsSchema: FidusUI.DividerPropsSchema,
    defaultProps: {
      orientation: 'horizontal',
    },
    description: 'Visual separator',
  },

  // Data Display
  {
    name: 'Badge',
    category: 'Data Display',
    component: FidusUI.Badge,
    propsSchema: FidusUI.BadgePropsSchema,
    defaultProps: {
      variant: 'primary',
      size: 'md',
      children: 'Badge',
    },
    description: 'Small status indicator',
  },
  {
    name: 'Chip',
    category: 'Data Display',
    component: FidusUI.Chip,
    propsSchema: FidusUI.ChipPropsSchema,
    defaultProps: {
      label: 'Chip label',
      variant: 'filled',
    },
    description: 'Compact element for tags or filters',
  },
  {
    name: 'Avatar',
    category: 'Data Display',
    component: FidusUI.Avatar,
    propsSchema: FidusUI.AvatarPropsSchema,
    defaultProps: {
      name: 'John Doe',
      size: 'md',
    },
    description: 'User profile image or initials',
  },

  // Cards
  {
    name: 'OpportunityCard',
    category: 'Cards',
    component: FidusUI.OpportunityCard,
    propsSchema: FidusUI.OpportunityCardPropsSchema,
    defaultProps: {
      title: 'Opportunity Title',
      description: 'This is an opportunity that requires your attention.',
      type: 'task',
      priority: 'high',
      timestamp: new Date().toISOString(),
      onDismiss: () => console.log('Dismissed'),
    },
    description: 'AI-driven opportunity card',
  },
  {
    name: 'DetailCard',
    category: 'Cards',
    component: FidusUI.DetailCard,
    propsSchema: FidusUI.DetailCardPropsSchema,
    defaultProps: {
      title: 'Detail Card',
      children: 'Card content goes here',
    },
    description: 'General-purpose content card',
  },
  {
    name: 'EmptyCard',
    category: 'Cards',
    component: FidusUI.EmptyCard,
    propsSchema: FidusUI.EmptyCardPropsSchema,
    defaultProps: {
      title: 'No items found',
      description: 'Try adjusting your filters',
    },
    description: 'Empty state card',
  },

  // Forms
  {
    name: 'TextInput',
    category: 'Forms',
    component: FidusUI.TextInput,
    propsSchema: FidusUI.TextInputPropsSchema,
    defaultProps: {
      label: 'Email Address',
      placeholder: 'Enter your email',
      type: 'email',
    },
    description: 'Text input field',
  },
  {
    name: 'TextArea',
    category: 'Forms',
    component: FidusUI.TextArea,
    propsSchema: FidusUI.TextAreaPropsSchema,
    defaultProps: {
      label: 'Description',
      placeholder: 'Enter description',
      rows: 4,
    },
    description: 'Multi-line text input',
  },
  {
    name: 'Checkbox',
    category: 'Forms',
    component: FidusUI.Checkbox,
    propsSchema: FidusUI.CheckboxPropsSchema,
    defaultProps: {
      label: 'Accept terms',
      checked: false,
    },
    description: 'Checkbox input',
  },
  {
    name: 'RadioButton',
    category: 'Forms',
    component: FidusUI.RadioButton,
    propsSchema: FidusUI.RadioButtonPropsSchema,
    defaultProps: {
      name: 'option',
      value: 'option1',
      label: 'Option 1',
    },
    description: 'Radio button input',
  },
  {
    name: 'ToggleSwitch',
    category: 'Forms',
    component: FidusUI.ToggleSwitch,
    propsSchema: FidusUI.ToggleSwitchPropsSchema,
    defaultProps: {
      label: 'Enable notifications',
      checked: false,
    },
    description: 'Toggle switch input',
  },

  // Feedback
  {
    name: 'Alert',
    category: 'Feedback',
    component: FidusUI.Alert,
    propsSchema: FidusUI.AlertPropsSchema,
    defaultProps: {
      variant: 'info',
      description: 'This is an informational alert',
    },
    description: 'Alert notification',
  },
  {
    name: 'Banner',
    category: 'Feedback',
    component: FidusUI.Banner,
    propsSchema: FidusUI.BannerPropsSchema,
    defaultProps: {
      variant: 'info',
      description: 'This is a banner announcement',
    },
    description: 'Page-level banner',
  },
  {
    name: 'ProgressBar',
    category: 'Feedback',
    component: FidusUI.ProgressBar,
    propsSchema: FidusUI.ProgressBarPropsSchema,
    defaultProps: {
      value: 60,
      max: 100,
    },
    description: 'Progress indicator',
  },

  // Navigation
  {
    name: 'Tabs',
    category: 'Navigation',
    component: FidusUI.Tabs,
    propsSchema: FidusUI.TabsPropsSchema,
    defaultProps: {
      tabs: [
        { id: 'tab1', label: 'Tab 1', content: 'Content for Tab 1' },
        { id: 'tab2', label: 'Tab 2', content: 'Content for Tab 2' },
        { id: 'tab3', label: 'Tab 3', content: 'Content for Tab 3' },
      ],
      defaultTab: 'tab1',
    },
    description: 'Tab navigation',
  },
  {
    name: 'Breadcrumbs',
    category: 'Navigation',
    component: FidusUI.Breadcrumbs,
    propsSchema: FidusUI.BreadcrumbsPropsSchema,
    defaultProps: {
      items: [
        { label: 'Home', href: '/' },
        { label: 'Components', href: '/components' },
        { label: 'Breadcrumbs' },
      ],
    },
    description: 'Breadcrumb navigation',
  },
  {
    name: 'Pagination',
    category: 'Navigation',
    component: FidusUI.Pagination,
    propsSchema: FidusUI.PaginationPropsSchema,
    defaultProps: {
      currentPage: 1,
      totalPages: 10,
      onPageChange: (page: number) => console.log('Page:', page),
    },
    description: 'Pagination controls',
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateReactCode(componentName: string, props: Record<string, unknown>): string {
  const propsString = Object.entries(props)
    .filter(([key]) => key !== 'children')
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return `  ${key}="${value}"`;
      } else if (typeof value === 'boolean') {
        return value ? `  ${key}` : '';
      } else if (typeof value === 'number') {
        return `  ${key}={${value}}`;
      } else if (typeof value === 'function') {
        return `  ${key}={${value.toString()}}`;
      } else if (Array.isArray(value)) {
        return `  ${key}={${JSON.stringify(value, null, 2)}}`;
      } else if (typeof value === 'object' && value !== null && React.isValidElement(value)) {
        return `  ${key}={<>...</>}`;
      } else {
        return `  ${key}={${JSON.stringify(value)}}`;
      }
    })
    .filter(Boolean)
    .join('\n');

  const childrenProp = props.children;
  if (childrenProp && typeof childrenProp === 'string') {
    return `<${componentName}\n${propsString}\n>\n  ${childrenProp}\n</${componentName}>`;
  } else if (childrenProp && React.isValidElement(childrenProp)) {
    return `<${componentName}\n${propsString}\n>\n  {/* Child components */}\n</${componentName}>`;
  } else {
    return `<${componentName}\n${propsString}\n/>`;
  }
}

function generateTypeScriptInterface(componentName: string, schema: z.ZodObject<z.ZodRawShape>): string {
  const shape = schema.shape;
  const props = Object.entries(shape)
    .map(([key, value]) => {
      let zodType = value as z.ZodTypeAny;
      let tsType = 'unknown';
      let isOptional = false;

      // Check if optional
      if (zodType.isOptional()) {
        isOptional = true;
      }

      // Unwrap ZodOptional and ZodDefault
      if (zodType instanceof z.ZodOptional) {
        zodType = zodType.unwrap();
      }
      if (zodType instanceof z.ZodDefault) {
        zodType = zodType._def.innerType;
        isOptional = true;
      }

      // Determine TypeScript type
      if (zodType instanceof z.ZodString) {
        tsType = 'string';
      } else if (zodType instanceof z.ZodNumber) {
        tsType = 'number';
      } else if (zodType instanceof z.ZodBoolean) {
        tsType = 'boolean';
      } else if (zodType instanceof z.ZodEnum) {
        const values = (zodType as z.ZodEnum<[string, ...string[]]>).options;
        tsType = values.map((v: string) => `'${v}'`).join(' | ');
      } else if (zodType instanceof z.ZodArray) {
        tsType = 'Array<unknown>';
      } else if (zodType instanceof z.ZodFunction) {
        tsType = '() => void';
      } else if (zodType instanceof z.ZodObject) {
        tsType = 'object';
      }

      const optional = isOptional ? '?' : '';
      return `  ${key}${optional}: ${tsType};`;
    })
    .join('\n');

  return `interface ${componentName}Props {\n${props}\n}`;
}

function generateZodSchema(componentName: string, schema: z.ZodObject<z.ZodRawShape>): string {
  const shape = schema.shape;
  const schemaLines = Object.entries(shape)
    .map(([key, value]) => {
      let zodType = value as z.ZodTypeAny;
      let zodString = 'z.unknown()';
      let hasOptional = false;
      let hasDefault = false;

      // Check for optional/default
      if (zodType instanceof z.ZodOptional) {
        hasOptional = true;
        zodType = zodType.unwrap();
      }
      if (zodType instanceof z.ZodDefault) {
        hasDefault = true;
        zodType = zodType._def.innerType;
      }

      // Determine Zod type
      if (zodType instanceof z.ZodString) {
        zodString = 'z.string()';
      } else if (zodType instanceof z.ZodNumber) {
        zodString = 'z.number()';
      } else if (zodType instanceof z.ZodBoolean) {
        zodString = 'z.boolean()';
      } else if (zodType instanceof z.ZodEnum) {
        const values = (zodType as z.ZodEnum<[string, ...string[]]>).options;
        zodString = `z.enum([${values.map((v: string) => `'${v}'`).join(', ')}])`;
      } else if (zodType instanceof z.ZodArray) {
        zodString = 'z.array(z.unknown())';
      } else if (zodType instanceof z.ZodFunction) {
        zodString = 'z.function()';
      } else if (zodType instanceof z.ZodObject) {
        zodString = 'z.object({})';
      }

      // Add modifiers
      if (hasDefault) {
        zodString += '.default(...)';
      } else if (hasOptional) {
        zodString += '.optional()';
      }

      return `  ${key}: ${zodString},`;
    })
    .join('\n');

  return `const ${componentName}PropsSchema = z.object({\n${schemaLines}\n});`;
}

// ============================================================================
// PLAYGROUND COMPONENT
// ============================================================================

export default function PlaygroundPage() {
  const [selectedComponent, setSelectedComponent] = useState<ComponentMetadata>(componentRegistry[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [deviceFrame, setDeviceFrame] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [componentProps, setComponentProps] = useState<Record<string, unknown>>(componentRegistry[0].defaultProps);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Filter components based on search and category
  const filteredComponents = useMemo(() => {
    return componentRegistry.filter((comp) => {
      const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || comp.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(componentRegistry.map((c) => c.category)));
    return ['All', ...cats];
  }, []);

  // Handle component selection
  const handleComponentSelect = (component: ComponentMetadata) => {
    setSelectedComponent(component);
    setComponentProps(component.defaultProps);
  };

  // Handle prop change
  const handlePropChange = (key: string, value: unknown) => {
    setComponentProps((prev) => ({ ...prev, [key]: value }));
  };

  // Generate code
  const reactCode = useMemo(() => generateReactCode(selectedComponent.name, componentProps), [selectedComponent, componentProps]);
  const tsInterface = useMemo(() => generateTypeScriptInterface(selectedComponent.name, selectedComponent.propsSchema), [selectedComponent]);
  const zodSchema = useMemo(() => generateZodSchema(selectedComponent.name, selectedComponent.propsSchema), [selectedComponent]);

  // Copy code
  const handleCopyCode = (code: string, codeType: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(codeType);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Device frame styles
  const frameStyles = {
    desktop: 'w-full',
    tablet: 'w-[768px] mx-auto',
    mobile: 'w-[375px] mx-auto',
  };

  return (
    <div className="mx-auto max-w-[1800px] px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">Component Playground</h1>
        <p className="text-lg text-muted-foreground">
          Explore, customize, and preview all Fidus UI components with live code generation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* COMPONENT EXPLORER */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-3">Components</h2>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    categoryFilter === cat
                      ? 'bg-primary text-black'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Component List */}
            <div className="space-y-1 max-h-[600px] overflow-y-auto">
              {filteredComponents.map((comp) => (
                <button
                  key={comp.name}
                  onClick={() => handleComponentSelect(comp)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedComponent.name === comp.name
                      ? 'bg-primary text-black font-semibold'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="font-medium">{comp.name}</div>
                  <div className="text-xs text-muted-foreground">{comp.category}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* LIVE PREVIEW & CODE */}
        <div className="space-y-6">
          {/* Component Info */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-2xl font-bold mb-2">{selectedComponent.name}</h2>
            <p className="text-sm text-muted-foreground mb-3">{selectedComponent.description}</p>
            <div className="flex items-center gap-2">
              <FidusUI.Badge variant="info" size="sm">
                {selectedComponent.category}
              </FidusUI.Badge>
            </div>
          </div>

          {/* Preview Controls */}
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Live Preview</h3>
              <div className="flex items-center gap-2">
                {/* Device Frame Selector */}
                <div className="flex items-center gap-1 rounded-md border border-border p-1">
                  <button
                    onClick={() => setDeviceFrame('desktop')}
                    className={`p-1.5 rounded ${deviceFrame === 'desktop' ? 'bg-primary text-black' : 'text-muted-foreground hover:bg-muted'}`}
                    title="Desktop"
                  >
                    <Monitor className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeviceFrame('tablet')}
                    className={`p-1.5 rounded ${deviceFrame === 'tablet' ? 'bg-primary text-black' : 'text-muted-foreground hover:bg-muted'}`}
                    title="Tablet"
                  >
                    <Tablet className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeviceFrame('mobile')}
                    className={`p-1.5 rounded ${deviceFrame === 'mobile' ? 'bg-primary text-black' : 'text-muted-foreground hover:bg-muted'}`}
                    title="Mobile"
                  >
                    <Smartphone className="h-4 w-4" />
                  </button>
                </div>

                {/* Theme Toggle */}
                <button
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  className="p-2 rounded-md border border-border hover:bg-muted"
                  title="Toggle theme"
                >
                  {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Preview Area */}
            <div className={`rounded-lg border-2 border-dashed border-border p-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
              <div className={frameStyles[deviceFrame]}>
                <div className={theme === 'dark' ? 'dark' : ''}>
                  <selectedComponent.component {...componentProps} />
                </div>
              </div>
            </div>
          </div>

          {/* Props Editor */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-lg font-semibold mb-4">Props Editor</h3>
            <div className="space-y-3">
              {Object.entries(selectedComponent.propsSchema.shape).map(([key, zodType]) => {
                let typeDef = zodType as z.ZodTypeAny;
                const currentValue = componentProps[key];

                // Skip children and complex objects/functions
                if (key === 'children' || key === 'onClick' || key === 'onDismiss' || key === 'onPageChange' || key === 'onChange' || key === 'onCheckedChange' || key === 'onSelect' || key === 'onUpload') {
                  return null;
                }

                // Unwrap ZodOptional and ZodDefault
                if (typeDef instanceof z.ZodOptional) {
                  typeDef = typeDef.unwrap();
                }
                if (typeDef instanceof z.ZodDefault) {
                  typeDef = typeDef._def.innerType;
                }

                // String input
                if (typeDef instanceof z.ZodString) {
                  return (
                    <div key={key}>
                      <label className="block text-sm font-medium mb-1">{key}</label>
                      <input
                        type="text"
                        value={(currentValue as string) || ''}
                        onChange={(e) => handlePropChange(key, e.target.value)}
                        className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
                      />
                    </div>
                  );
                }

                // Number input
                if (typeDef instanceof z.ZodNumber) {
                  return (
                    <div key={key}>
                      <label className="block text-sm font-medium mb-1">{key}</label>
                      <input
                        type="number"
                        value={(currentValue as number) || 0}
                        onChange={(e) => handlePropChange(key, Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
                      />
                    </div>
                  );
                }

                // Boolean input
                if (typeDef instanceof z.ZodBoolean) {
                  return (
                    <div key={key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={(currentValue as boolean) || false}
                        onChange={(e) => handlePropChange(key, e.target.checked)}
                        className="w-4 h-4 rounded border-border"
                      />
                      <label className="text-sm font-medium">{key}</label>
                    </div>
                  );
                }

                // Enum select
                if (typeDef instanceof z.ZodEnum) {
                  const options = typeDef.options;
                  return (
                    <div key={key}>
                      <label className="block text-sm font-medium mb-1">{key}</label>
                      <select
                        value={(currentValue as string) || options[0]}
                        onChange={(e) => handlePropChange(key, e.target.value)}
                        className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
                      >
                        {options.map((opt: string) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>

          {/* Code Generation */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-lg font-semibold mb-4">Generated Code</h3>

            {/* React Code */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">React Component</span>
                <button
                  onClick={() => handleCopyCode(reactCode, 'react')}
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs hover:bg-muted"
                >
                  {copiedCode === 'react' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copiedCode === 'react' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                <code>{reactCode}</code>
              </pre>
            </div>

            {/* TypeScript Interface */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">TypeScript Interface</span>
                <button
                  onClick={() => handleCopyCode(tsInterface, 'ts')}
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs hover:bg-muted"
                >
                  {copiedCode === 'ts' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copiedCode === 'ts' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                <code>{tsInterface}</code>
              </pre>
            </div>

            {/* Zod Schema */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Zod Schema</span>
                <button
                  onClick={() => handleCopyCode(zodSchema, 'zod')}
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs hover:bg-muted"
                >
                  {copiedCode === 'zod' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copiedCode === 'zod' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                <code>{zodSchema}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
