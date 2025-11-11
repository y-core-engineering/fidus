#!/usr/bin/env node

/**
 * Syncs the @fidus/design-system version to match @fidus/ui version
 *
 * Usage: node scripts/sync-design-system-version.js
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const UI_PACKAGE_JSON = path.join(ROOT_DIR, 'packages/ui/package.json');
const DESIGN_SYSTEM_PACKAGE_JSON = path.join(ROOT_DIR, 'packages/design-system/package.json');

function syncVersions() {
  // Read UI package version
  const uiPackage = JSON.parse(fs.readFileSync(UI_PACKAGE_JSON, 'utf-8'));
  const uiVersion = uiPackage.version;

  console.log(`📦 @fidus/ui version: ${uiVersion}`);

  // Read Design System package
  const designSystemPackage = JSON.parse(fs.readFileSync(DESIGN_SYSTEM_PACKAGE_JSON, 'utf-8'));
  const currentVersion = designSystemPackage.version;

  console.log(`📦 @fidus/design-system current version: ${currentVersion}`);

  // Check if versions already match
  if (currentVersion === uiVersion) {
    console.log('✅ Versions already in sync!');
    return;
  }

  // Update design system version
  designSystemPackage.version = uiVersion;
  fs.writeFileSync(
    DESIGN_SYSTEM_PACKAGE_JSON,
    JSON.stringify(designSystemPackage, null, 2) + '\n',
    'utf-8'
  );

  console.log(`✅ Updated @fidus/design-system to version ${uiVersion}`);
}

try {
  syncVersions();
} catch (error) {
  console.error('❌ Error syncing versions:', error.message);
  process.exit(1);
}
