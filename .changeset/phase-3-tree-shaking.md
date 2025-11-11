---
"@fidus/ui": patch
---

**Phase 3 Tree-Shaking**: Subpath Exports & Bundle Optimization

**Tree-Shaking Configuration:**
- Configured 47 subpath exports (45 components + index + tailwind)
- Added `sideEffects: false` for aggressive tree-shaking
- Created automated export generation script (`scripts/generate-exports.ts`)
- Updated build system for per-component bundles

**Bundle Size Optimization:**
- **95% reduction** for single component imports
- Before: `import { Button } from '@fidus/ui'` → ~370KB
- After: `import { Button } from '@fidus/ui/button'` → ~4KB
- All 45 components available as individual subpath imports

**Documentation:**
- Added comprehensive tree-shaking guide to README
- Bundle size comparison table
- Subpath import examples for all components
- React Hook Form integration examples with Zod validation
- Form component compatibility documentation

**Technical Details:**
- 47 entry points in tsup configuration
- Per-component TypeScript definitions (.d.ts, .d.mts)
- Backward compatible barrel exports maintained
- Increased Node memory limit for DTS generation

**Migration:**
- No breaking changes - existing imports continue to work
- Recommended: Switch to subpath imports for production builds
- Example: `import { Button } from '@fidus/ui/button'`

Related: Phase 3.1.1, 3.1.3, 3.3.2
