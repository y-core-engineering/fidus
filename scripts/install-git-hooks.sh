#!/bin/bash

# Install pre-push git hook

HOOK_FILE=".git/hooks/pre-push"

cat > "$HOOK_FILE" << 'EOF'
#!/bin/bash

# Add common pnpm paths to PATH
export PATH="$HOME/.local/share/pnpm:$HOME/Library/pnpm:/usr/local/bin:$PATH"

# Try to find pnpm
if ! command -v pnpm >/dev/null 2>&1; then
    echo "⚠️  pnpm not found in PATH"
    echo "Skipping pre-push checks (install pnpm or use --no-verify)"
    exit 0
fi

echo "🔍 Running pre-push checks..."
echo ""

# Run lint
echo "→ Running lint..."
pnpm lint
LINT_EXIT=$?

# Run typecheck
echo ""
echo "→ Running typecheck..."
pnpm typecheck
TYPECHECK_EXIT=$?

# Run tests
echo ""
echo "→ Running tests..."
pnpm test run
TEST_EXIT=$?

# Check Mermaid diagrams
echo ""
echo "→ Checking Mermaid diagrams..."
node scripts/check-mermaid.js docs/**/*.md
MERMAID_EXIT=$?

echo ""

# Check if there were any errors
if [ $LINT_EXIT -ne 0 ] || [ $TYPECHECK_EXIT -ne 0 ] || [ $TEST_EXIT -ne 0 ] || [ $MERMAID_EXIT -ne 0 ]; then
    echo "⚠️  Some checks failed!"
    echo ""
    echo "You can:"
    echo "  1. Fix the issues and try again"
    echo "  2. Push anyway with: git push --no-verify"
    echo ""

    # Ask user what to do (only in interactive mode)
    if [ -t 1 ]; then
        read -p "Push anyway? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "❌ Push cancelled. Fix issues or use --no-verify"
            exit 1
        fi
        echo "✅ Pushing despite warnings..."
    else
        # Non-interactive mode (CI): fail
        exit 1
    fi
fi

echo "✅ All checks passed!"
exit 0
EOF

chmod +x "$HOOK_FILE"

echo "✅ Pre-push hook installed successfully!"
echo "   Location: $HOOK_FILE"
echo ""
echo "The hook will now run:"
echo "  - Lint"
echo "  - Type check"
echo "  - Tests"
echo "  - Mermaid diagram validation"
echo ""
echo "To skip: git push --no-verify"
