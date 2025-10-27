# Husky Git Hooks

This directory contains Git hooks managed by Husky.

## Available Hooks

### pre-push

Runs before every `git push` to ensure code quality:
- Linting (`pnpm lint`)
- Type checking (`pnpm typecheck`)

**Features:**
- ✅ Interactive prompt: If checks fail, asks if you want to push anyway
- ✅ Escape hatch: Use `git push --no-verify` to skip checks
- ✅ Non-blocking: You can always push, but get warned about issues

## Usage

### Normal push (with checks)
```bash
git push
```

### Skip checks (emergency)
```bash
git push --no-verify
```

### Run checks manually
```bash
pnpm lint
pnpm typecheck
```

## Setup

Husky is automatically initialized when running `pnpm install` (via the `prepare` script).

To manually reinstall hooks:
```bash
pnpm prepare
```
