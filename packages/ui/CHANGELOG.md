# Changelog

## 1.3.1

### Patch Changes

- db30b33: Update design system documentation for v1.2.0 release. Added comprehensive Release Notes page, enhanced OpportunityCard documentation with privacy badges examples and tooltips, and updated homepage to feature latest release.

## 1.3.0

### Minor Changes

- cd64b2c: Add chat UI components for Fidus Memory
  - Added ChatInterface component with message streaming support
  - Added MessageBubble component with privacy badges and tooltips
  - Enhanced OpportunityCard with privacy badges array support
  - Fixed bundling configuration for react-markdown and remark-gfm

## 1.2.0

### Minor Changes

- cd64b2c: Add chat UI components for Fidus Memory
  - Added ChatInterface component with message streaming support
  - Added MessageBubble component with privacy badges and tooltips
  - Enhanced OpportunityCard with privacy badges array support
  - Fixed bundling configuration for react-markdown and remark-gfm

## 1.1.0

### Minor Changes

- cd64b2c: Add chat UI components for Fidus Memory

  This release introduces three new components for building conversational AI interfaces:
  - **MessageBubble**: Chat message component with role-based styling, avatars, timestamps, and AI suggestion chips with confidence indicators
  - **ChatInterface**: Complete chat layout with scrollable message list, auto-scroll behavior, and textarea input with keyboard shortcuts (Enter to send, Shift+Enter for newline)
  - **ConfidenceIndicator**: ML confidence visualization with color-coded badges (green for high confidence, blue for medium, yellow for learning, gray for uncertain)

  All components are built with 100% Fidus UI primitives (Stack, Chip, Avatar, Button, etc.), use design tokens for consistent spacing, and include comprehensive TypeScript types with Zod schemas for runtime validation.

## 1.0.2

### Patch Changes

- 7196ba6: Improve README documentation with component table

  Reorganized component list into structured tables with descriptions for better readability and discoverability. Each component now has a clear description of its purpose and functionality.

All notable changes to `@fidus/ui` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- None

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

## [1.0.1] - 2025-01-01

### Fixed

- Corrected README.md documentation with accurate component list (41 components)
- Removed false information from README.md (non-existent Discord link, CSS imports, documentation links)
- Fixed GitHub Actions workflow permissions for GitHub Release creation

### Changed

- Updated workflow to use `contents: write` permission for automated releases

## [1.0.0] - 2025-01-01

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
- npm package publishing infrastructure
- GitHub Actions workflow for automated publishing
- README with usage examples and documentation
- CHANGELOG with version management guidelines

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
