---
"@fidus/ui": minor
---

**Phase 2 SSR Enhancements**: Example Projects, Documentation & Comprehensive Testing

**Example Projects (3 complete implementations):**
- Next.js 14 App Router example (`/examples/nextjs-app-router`)
- Next.js Pages Router example (`/examples/nextjs-pages-router`)
- Vite + React SPA example (`/examples/vite-react`)
- Each example includes 15+ components, Tailwind CSS integration, and README documentation

**Comprehensive SSR Testing:**
- **133 SSR compatibility tests** (up from 55) - 142% increase
- All 40+ components tested with `renderToString()` compatibility
- Verified Portal components (Toast, Modal, Drawer) don't crash during SSR
- Tested client-side components (Tabs, ProgressBar, Chat) for SSR safety
- 100% test pass rate across all component variants and edge cases

**Documentation Improvements:**
- Examples README with quick-start guide and framework-specific notes
- Component API usage patterns verified in real Next.js/Vite apps
- SSR test suite documents expected behavior for all components

**Key Insights:**
- Portal components (Radix UI) correctly return empty HTML in SSR (expected behavior)
- Client-side components with `'use client'` still render structure safely in SSR
- All 16 SSR-optimized components work seamlessly across frameworks

**Migration:**
- No code changes required - this is a documentation and testing release
- Use example projects as reference for integrating @fidus/ui in your app
- All existing features remain fully backward compatible

Related: Phase 2 of SSR optimization project
