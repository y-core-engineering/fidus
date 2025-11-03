#!/bin/bash
# Vercel Ignored Build Step
# Exit with 1 to skip build, exit with 0 to build
# Build only if design-system or ui packages have changes, or if root config changes

echo "Checking if build is needed..."

# Check if design-system, ui files, or root config files changed
if git diff HEAD^ HEAD --name-only | grep -qE "^packages/(design-system|ui)/|^\.npmrc$|^pnpm-lock\.yaml$|^package\.json$"; then
  echo "✅ Changes detected in design-system, ui packages, or root config - building"
  exit 1  # Build
else
  echo "⏭️  No changes in design-system, ui packages, or root config - skipping build"
  exit 0  # Skip build
fi
