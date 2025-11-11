#!/usr/bin/env tsx
/**
 * Generate package.json exports configuration for tree-shaking
 *
 * This script automatically generates the "exports" field in package.json
 * based on all components in src/components/
 *
 * Usage:
 *   npx tsx scripts/generate-exports.ts
 */

import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const PACKAGES_UI_DIR = join(__dirname, '..');
const COMPONENTS_DIR = join(PACKAGES_UI_DIR, 'src/components');
const PACKAGE_JSON_PATH = join(PACKAGES_UI_DIR, 'package.json');

// Get all component directories
const components = readdirSync(COMPONENTS_DIR, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name)
  .sort();

console.log(`Found ${components.length} components:`);
console.log(components.join(', '));
console.log('');

// Generate exports configuration
const exports: Record<string, any> = {
  '.': {
    types: './dist/index.d.ts',
    import: './dist/index.mjs',
    require: './dist/index.js',
  },
  './styles.css': './styles.css',
  './tailwind': {
    types: './dist/tailwind.d.ts',
    import: './dist/tailwind.mjs',
    require: './dist/tailwind.js',
  },
};

// Add per-component exports
components.forEach((comp) => {
  const key = `./${comp}`;
  exports[key] = {
    types: `./dist/${comp}/index.d.ts`,
    import: `./dist/${comp}/index.mjs`,
    require: `./dist/${comp}/index.js`,
  };
});

// Read current package.json
const packageJson = JSON.parse(readFileSync(PACKAGE_JSON_PATH, 'utf-8'));

// Update exports field
packageJson.exports = exports;

// Ensure sideEffects is set to false for tree-shaking
if (!packageJson.hasOwnProperty('sideEffects')) {
  packageJson.sideEffects = false;
  console.log('✅ Added "sideEffects": false to package.json');
} else if (packageJson.sideEffects !== false) {
  console.log(`⚠️  Warning: sideEffects is set to ${JSON.stringify(packageJson.sideEffects)}`);
  console.log('   For optimal tree-shaking, set "sideEffects": false');
}

// Write updated package.json
writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(packageJson, null, 2) + '\n', 'utf-8');

console.log('');
console.log('✅ Successfully generated exports configuration!');
console.log('');
console.log('Generated exports:');
console.log(JSON.stringify({ exports }, null, 2));
console.log('');
console.log('Next steps:');
console.log('1. Update tsup.config.ts with per-component entry points');
console.log('2. Run: pnpm build');
console.log('3. Verify dist/ directory structure');
