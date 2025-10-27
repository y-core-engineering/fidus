#!/usr/bin/env sh
# This script installs Husky hooks
# Run this after cloning the repo or after pnpm install

echo "Installing Husky hooks..."
git config core.hooksPath .husky
echo "✅ Husky hooks installed!"
echo "Pre-push hook will now run automatically before git push"
