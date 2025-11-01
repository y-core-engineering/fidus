#!/bin/bash
# Vercel Ignored Build Step
# Exit with 1 to skip build, exit with 0 to build
# Build only if design-system or ui packages have changes

echo "Checking if build is needed..."

# Check if design-system or ui files changed
if git diff HEAD^ HEAD --name-only | grep -qE "^packages/(design-system|ui)/"; then
  echo "✅ Changes detected in design-system or ui packages - building"
  exit 1  # Build
else
  echo "⏭️  No changes in design-system or ui packages - skipping build"
  exit 0  # Skip build
fi
