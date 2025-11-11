#!/usr/bin/env tsx
/**
 * Migrates @fidus/ui barrel imports to subpath imports for tree-shaking optimization.
 *
 * Before: import { Button } from '@fidus/ui/button';
import { Stack } from '@fidus/ui/stack';
import { Alert } from '@fidus/ui/alert';;
 * After:  import { Button } from '@fidus/ui/button';
 *         import { Stack } from '@fidus/ui/stack';
 *         import { Alert } from '@fidus/ui/alert';
 */

import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { globSync } from 'glob';

// Map component names to their subpath (handles multi-word components)
const componentMap: Record<string, string> = {
  // Layout & Structure
  'Stack': 'stack',
  'Container': 'container',
  'Divider': 'divider',

  // Navigation
  'Link': 'link',
  'Breadcrumbs': 'breadcrumbs',
  'Tabs': 'tabs',

  // Buttons & Actions
  'Button': 'button',
  'IconButton': 'icon-button',

  // Form Components
  'TextInput': 'text-input',
  'TextArea': 'text-area',
  'Checkbox': 'checkbox',
  'RadioButton': 'radio-button',
  'ToggleSwitch': 'toggle-switch',
  'Select': 'select',
  'DatePicker': 'date-picker',
  'TimePicker': 'time-picker',
  'FileUpload': 'file-upload',

  // Data Display
  'Table': 'table',
  'TableHeader': 'table',
  'TableBody': 'table',
  'TableRow': 'table',
  'TableHead': 'table',
  'TableCell': 'table',
  'Badge': 'badge',
  'Chip': 'chip',
  'Avatar': 'avatar',
  'ProgressBar': 'progress-bar',
  'Spinner': 'spinner',
  'ConfidenceIndicator': 'confidence-indicator',

  // Feedback
  'Alert': 'alert',
  'Banner': 'banner',
  'Toast': 'toast',
  'ErrorState': 'error-state',
  'EmptyCard': 'empty-card',

  // Overlays
  'Modal': 'modal',
  'Drawer': 'drawer',
  'Tooltip': 'tooltip',
  'Popover': 'popover',
  'Dropdown': 'dropdown',

  // Cards
  'Card': 'card',
  'DetailCard': 'detail-card',
  'OpportunityCard': 'opportunity-card',

  // Complex Components
  'ChatInterface': 'chat-interface',
  'MessageBubble': 'message-bubble',
  'Pagination': 'pagination',
};

function migrateFile(filePath: string): boolean {
  const content = readFileSync(filePath, 'utf-8');

  // Match: import { Component1, Component2, ... } from '@fidus/ui';
  const barrelImportRegex = /import\s+\{([^}]+)\}\s+from\s+['"]@fidus\/ui['"]/g;

  let modified = false;
  let newContent = content;

  const matches = Array.from(content.matchAll(barrelImportRegex));

  for (const match of matches) {
    const [fullMatch, imports] = match;

    // Parse imported components
    const components = imports
      .split(',')
      .map(c => c.trim())
      .filter(c => c.length > 0);

    // Generate subpath imports
    const subpathImports: string[] = [];
    const unmappedComponents: string[] = [];

    for (const component of components) {
      const subpath = componentMap[component];
      if (subpath) {
        // Group components from the same subpath (e.g., Table exports)
        const existing = subpathImports.find(imp => imp.includes(`'@fidus/ui/${subpath}'`));
        if (existing) {
          // Add to existing import
          const updated = existing.replace(
            /import\s+\{([^}]+)\}/,
            (_, existingImports) => `import { ${existingImports}, ${component} }`
          );
          subpathImports[subpathImports.indexOf(existing)] = updated;
        } else {
          subpathImports.push(`import { ${component} } from '@fidus/ui/${subpath}';`);
        }
      } else {
        unmappedComponents.push(component);
      }
    }

    if (unmappedComponents.length > 0) {
      console.warn(`⚠️  ${filePath}: Unmapped components: ${unmappedComponents.join(', ')}`);
    }

    // Replace barrel import with subpath imports
    if (subpathImports.length > 0) {
      newContent = newContent.replace(fullMatch, subpathImports.join('\n'));
      modified = true;
    }
  }

  if (modified) {
    writeFileSync(filePath, newContent, 'utf-8');
    return true;
  }

  return false;
}

// Find all TypeScript/TSX files in design system
const designSystemRoot = join(__dirname, '..');
const files = globSync('**/*.{ts,tsx}', {
  cwd: designSystemRoot,
  absolute: true,
  ignore: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.next/**'],
});

console.log(`Found ${files.length} TypeScript files to process...\n`);

let migratedCount = 0;
for (const file of files) {
  if (migrateFile(file)) {
    console.log(`✅ Migrated: ${file.replace(designSystemRoot, '')}`);
    migratedCount++;
  }
}

console.log(`\n✅ Migration complete! ${migratedCount} files updated.`);
console.log(`\nNext steps:`);
console.log(`1. Review changes: git diff`);
console.log(`2. Test build: pnpm --filter @fidus/design-system build`);
console.log(`3. Commit: git commit -am "refactor(design-system): migrate to subpath imports"`);
