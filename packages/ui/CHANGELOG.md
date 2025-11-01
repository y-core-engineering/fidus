# Changelog

All notable changes to `@fidus/ui` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial component library setup
- Button component with variants (primary, secondary, tertiary, destructive)
- Card component
- Input component
- Select component
- Toast component
- Dialog component
- Dropdown Menu component
- Progress component
- Tabs component
- Tooltip component
- Calendar component with date-fns integration
- Responsive design with mobile-first approach
- Zod validation schemas for component props
- Comprehensive TypeScript types

### Changed
- None

### Deprecated
- None

### Removed
- None

### Fixed
- None

### Security
- None

## [0.1.0] - 2025-01-01

### Added
- Initial release of @fidus/ui component library
- Core components based on Radix UI primitives
- Design tokens and CSS variables
- TypeScript support with strict type checking
- Accessibility features (ARIA attributes, keyboard navigation)
- Tree-shakeable ESM and CJS exports

---

## Version Management

### Semantic Versioning

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version (X.0.0) - Incompatible API changes
- **MINOR** version (0.X.0) - New features, backwards compatible
- **PATCH** version (0.0.X) - Bug fixes, backwards compatible

### Release Process

1. Update version in `packages/ui/package.json`
2. Update this CHANGELOG.md with changes
3. Commit changes: `git commit -am "chore(ui): release v1.2.3"`
4. Create git tag: `git tag v1.2.3`
5. Push tag: `git push origin v1.2.3`
6. GitHub Actions will automatically publish to npm

### Example Release

```bash
# For a minor version bump (new feature)
cd packages/ui
npm version minor  # Updates package.json from 0.1.0 to 0.2.0

# Update CHANGELOG.md with changes
# Then commit and tag
git add .
git commit -m "chore(ui): release v0.2.0"
git tag v0.2.0
git push origin main --tags
```
