# Phase 3: Medium Priority Enhancements - Implementierungs-Prompt

## Übersicht

- **Ziel:** Performance optimieren (Tree-Shaking), Accessibility sicherstellen (WCAG 2.1 AA) und Form-Integration verbessern
- **Related Issues:** [#61](https://github.com/y-core-engineering/fidus/issues/61) (Tree-Shaking), [#62](https://github.com/y-core-engineering/fidus/issues/62) (Accessibility), [#63](https://github.com/y-core-engineering/fidus/issues/63) (Form Validation)
- **Dependencies:** Phase 1 abgeschlossen (SSR-Bug behoben), aber **keine Hard-Blocker** für Phase 3
- **Parallel Execution:** Tasks 3.1, 3.2, 3.3 können unabhängig voneinander bearbeitet werden

## Kontext für den Developer

Phase 1 und 2 haben SSR-Kompatibilität und Dokumentation geliefert. Phase 3 fokussiert sich auf **Produktionsreife** in drei Bereichen:

1. **Performance (Tree-Shaking, #61):** Aktuell importiert `import { Button } from '@fidus/ui'` das komplette Bundle (~370KB). Das ist inakzeptabel für produktive Apps. Tree-Shaking reduziert Bundle Size um ≥50%.

2. **Accessibility (#62):** Viele Komponenten erfüllen nicht WCAG 2.1 AA Standards. Fehlende ARIA-Attribute, unzureichende Keyboard-Navigation und schlechte Kontrastverhältnisse machen die Library für Nutzer mit Behinderungen unbrauchbar.

3. **Form Integration (#63):** React Hook Form ist der De-facto-Standard für Forms in React. Ohne `forwardRef` und `error`-Props können Entwickler @fidus/ui nicht mit ihren Form-Workflows integrieren.

Diese Phase liefert **keine Features für End-User**, sondern verbessert **Developer Experience und Produktionsreife**. Zielgruppe sind Entwickler, die @fidus/ui in echten Projekten einsetzen wollen.

## Tasks in dieser Phase

### Task 3.1.1: Configure Subpath Exports

**Ziel:** `package.json` so konfigurieren, dass Bundler (Webpack, Vite) einzelne Komponenten tree-shaken können.

**Input/Voraussetzungen:**
- Zugriff auf `packages/ui/package.json`
- Build-Tool (tsup, Rollup, oder esbuild)
- Liste aller exportierten Komponenten

**Schritt-für-Schritt Anleitung:**

1. **Komponenten-Liste erstellen**
   ```bash
   cd packages/ui
   ls src/components/
   ```

   **Erwartete Ausgabe:**
   ```
   Button/
   Stack/
   Alert/
   DetailCard/
   TextInput/
   ...
   ```

2. **Build-Konfiguration anpassen (tsup)**

   Falls tsup verwendet wird, öffne `packages/ui/tsup.config.ts`:
   ```typescript
   import { defineConfig } from 'tsup';
   import { readdirSync } from 'fs';
   import { join } from 'path';

   // Auto-detect components
   const components = readdirSync(join(__dirname, 'src/components'), { withFileTypes: true })
     .filter((dirent) => dirent.isDirectory())
     .map((dirent) => dirent.name);

   export default defineConfig({
     entry: {
       // Main entry
       index: 'src/index.ts',
       // Per-component entries
       ...Object.fromEntries(
         components.map((comp) => [
           `${comp.toLowerCase()}/index`,
           `src/components/${comp}/index.ts`,
         ])
       ),
     },
     format: ['cjs', 'esm'],
     dts: true,
     sourcemap: true,
     clean: true,
     splitting: false,
     treeshake: true,
   });
   ```

   **Warum splitting: false?** Wir wollen explizite Bundles pro Komponente, nicht automatisches Code-Splitting.

3. **package.json Subpath Exports konfigurieren**

   Öffne `packages/ui/package.json`:
   ```json
   {
     "name": "@fidus/ui",
     "version": "1.4.2",
     "main": "./dist/index.js",
     "module": "./dist/index.mjs",
     "types": "./dist/index.d.ts",
     "exports": {
       ".": {
         "import": "./dist/index.mjs",
         "require": "./dist/index.js",
         "types": "./dist/index.d.ts"
       },
       "./button": {
         "import": "./dist/button/index.mjs",
         "require": "./dist/button/index.js",
         "types": "./dist/button/index.d.ts"
       },
       "./stack": {
         "import": "./dist/stack/index.mjs",
         "require": "./dist/stack/index.js",
         "types": "./dist/stack/index.d.ts"
       },
       "./alert": {
         "import": "./dist/alert/index.mjs",
         "require": "./dist/alert/index.js",
         "types": "./dist/alert/index.d.ts"
       },
       "./textinput": {
         "import": "./dist/textinput/index.mjs",
         "require": "./dist/textinput/index.js",
         "types": "./dist/textinput/index.d.ts"
       },
       "./detailcard": {
         "import": "./dist/detailcard/index.mjs",
         "require": "./dist/detailcard/index.js",
         "types": "./dist/detailcard/index.d.ts"
       }
       // ... für alle Komponenten
     },
     "sideEffects": false,
     "files": [
       "dist"
     ]
   }
   ```

   **Wichtig:** `"sideEffects": false` teilt Bundlern mit, dass **keine** Module Side-Effects haben und sicher entfernt werden können, wenn nicht importiert.

4. **Script zum Generieren der Exports**

   Manuelles Hinzufügen von 20+ Komponenten ist fehleranfällig. Erstelle Script:
   ```typescript
   // scripts/generate-exports.ts
   import { readdirSync, writeFileSync } from 'fs';
   import { join } from 'path';

   const componentsDir = join(__dirname, '../src/components');
   const components = readdirSync(componentsDir, { withFileTypes: true })
     .filter((dirent) => dirent.isDirectory())
     .map((dirent) => dirent.name);

   const exports = {
     '.': {
       import: './dist/index.mjs',
       require: './dist/index.js',
       types: './dist/index.d.ts',
     },
   };

   components.forEach((comp) => {
     const key = `./${comp.toLowerCase()}`;
     exports[key] = {
       import: `./dist/${comp.toLowerCase()}/index.mjs`,
       require: `./dist/${comp.toLowerCase()}/index.js`,
       types: `./dist/${comp.toLowerCase()}/index.d.ts`,
     };
   });

   console.log('Generated exports:');
   console.log(JSON.stringify({ exports }, null, 2));
   console.log('\nCopy to package.json "exports" field.');
   ```

   Run:
   ```bash
   npx tsx scripts/generate-exports.ts
   ```

   Kopiere Output in `package.json`.

5. **Build und Verifikation**
   ```bash
   cd packages/ui
   pnpm build
   ```

   **Erwartete Ordnerstruktur:**
   ```
   dist/
   ├── index.js
   ├── index.mjs
   ├── index.d.ts
   ├── button/
   │   ├── index.js
   │   ├── index.mjs
   │   └── index.d.ts
   ├── stack/
   │   ├── index.js
   │   └── ...
   └── ...
   ```

6. **TypeScript Resolution testen**
   ```typescript
   // Test-File: test-import.ts
   import { Button } from '@fidus/ui/button';
   import { Stack } from '@fidus/ui/stack';

   const x: typeof Button = Button; // Type-Check
   ```

   ```bash
   npx tsc --noEmit test-import.ts
   ```

   **Erwartung:** Keine TypeScript Errors. Falls Errors:
   - Prüfe `"types"` in exports
   - Prüfe `dts: true` in tsup.config

7. **Backward Compatibility sicherstellen**

   Barrel Import muss weiterhin funktionieren:
   ```typescript
   // Old style - should still work
   import { Button, Stack, Alert } from '@fidus/ui';

   // New style - tree-shaking optimized
   import { Button } from '@fidus/ui/button';
   import { Stack } from '@fidus/ui/stack';
   ```

   Beide Stile sollten ohne Breaking Changes funktionieren.

**Definition of Done:**
- [ ] `package.json` hat `exports` für alle Komponenten (20+)
- [ ] `"sideEffects": false` gesetzt
- [ ] Build erzeugt separate Bundles (`dist/button/`, `dist/stack/`, etc.)
- [ ] TypeScript Types funktionieren für Subpath Imports
- [ ] Backward Compatibility: Barrel Imports (`import { Button } from '@fidus/ui'`) funktionieren weiterhin
- [ ] Script `generate-exports.ts` automatisiert Export-Generierung

**Verifikation:**
```bash
# 1. Build erfolgreich
cd packages/ui
pnpm build && echo "✅ Build successful"

# 2. Per-Component Bundles existieren
ls dist/button/index.mjs && echo "✅ Component bundles created"

# 3. Exports definiert
cat package.json | grep '"exports"' && echo "✅ Exports configured"

# 4. sideEffects: false
cat package.json | grep '"sideEffects": false' && echo "✅ sideEffects configured"

# 5. TypeScript Test
echo 'import { Button } from "@fidus/ui/button";' | npx tsc --noEmit --stdin && echo "✅ TS types work"
```

**Troubleshooting:**

**Problem:** Build schlägt fehl mit "Entry not found: src/components/Button/index.ts"
**Lösung:** Nicht alle Komponenten haben `index.ts`. Erstelle für jede Komponente:
```bash
for dir in src/components/*/; do
  comp=$(basename "$dir")
  if [ ! -f "$dir/index.ts" ]; then
    echo "export { $comp } from './$comp';" > "$dir/index.ts"
  fi
done
```

**Problem:** TypeScript kann `@fidus/ui/button` nicht auflösen
**Lösung:** Prüfe `exports` Syntax:
```json
{
  "./button": {
    "types": "./dist/button/index.d.ts", // types MUSS als erstes stehen für TS 5.0+
    "import": "./dist/button/index.mjs",
    "require": "./dist/button/index.js"
  }
}
```

**Problem:** Barrel Import funktioniert nicht mehr
**Lösung:** Prüfe, ob `src/index.ts` alle Komponenten re-exportiert:
```typescript
// src/index.ts
export { Button } from './components/Button';
export { Stack } from './components/Stack';
// ...
```

---

### Task 3.1.2: Verify Tree-Shaking with Bundle Analyzer

**Ziel:** Beweisen, dass Tree-Shaking funktioniert und Bundle Size reduziert ist.

**Input/Voraussetzungen:**
- Task 3.1.1 abgeschlossen (Subpath Exports konfiguriert)
- Next.js Test-App (`test-apps/ssr-repro/` oder `examples/nextjs-app-router/`)
- Bundle Analyzer Tool

**Schritt-für-Schritt Anleitung:**

1. **Bundle Analyzer installieren**
   ```bash
   cd examples/nextjs-app-router
   pnpm add -D @next/bundle-analyzer
   ```

2. **next.config.js anpassen**
   ```javascript
   // next.config.js
   const withBundleAnalyzer = require('@next/bundle-analyzer')({
     enabled: process.env.ANALYZE === 'true',
   });

   /** @type {import('next').NextConfig} */
   const nextConfig = {
     reactStrictMode: true,
   };

   module.exports = withBundleAnalyzer(nextConfig);
   ```

3. **Test Page: Barrel Import (Baseline)**

   Erstelle `app/test-barrel/page.tsx`:
   ```typescript
   // BEFORE: Barrel import (imports entire bundle)
   import { Button } from '@fidus/ui';

   export default function TestBarrelPage() {
     return <Button>Test</Button>;
   }
   ```

4. **Test Page: Subpath Import (Optimized)**

   Erstelle `app/test-subpath/page.tsx`:
   ```typescript
   // AFTER: Subpath import (imports only Button)
   import { Button } from '@fidus/ui/button';

   export default function TestSubpathPage() {
     return <Button>Test</Button>;
   }
   ```

5. **Build und Analyze**
   ```bash
   # Build mit Barrel Import
   ANALYZE=true pnpm build
   ```

   Browser öffnet automatisch Bundle Report. Notiere:
   - Bundle Size für `test-barrel/page`
   - Welche Module sind inkludiert? (prüfe, ob Stack, Alert, etc. trotz nicht-Nutzung inkludiert sind)

6. **Screenshot und Metriken dokumentieren**

   Erstelle `docs/milestones/BUNDLE_SIZE_REPORT.md`:
   ```markdown
   # Bundle Size Analysis - Tree-Shaking Verification

   ## Test Setup
   - Framework: Next.js 14.2
   - Bundle Analyzer: @next/bundle-analyzer v15.0
   - Test Date: 2025-01-10

   ## Results

   ### Before (Barrel Import)
   ```typescript
   import { Button } from '@fidus/ui';
   ```

   **Bundle Size:** ~370KB (gzipped: ~95KB)

   **Included Modules:**
   - Button ✅ (used)
   - Stack ❌ (unused, but included!)
   - Alert ❌ (unused, but included!)
   - All themes, utils, icons ❌

   ### After (Subpath Import)
   ```typescript
   import { Button } from '@fidus/ui/button';
   ```

   **Bundle Size:** ~18KB (gzipped: ~6KB)

   **Included Modules:**
   - Button ✅ (used)
   - Shared utilities (theme types, etc.) ✅
   - **NO** unused components 🎉

   ## Reduction
   - **Absolute:** 370KB → 18KB (**-95%**)
   - **Gzipped:** 95KB → 6KB (**-94%**)

   ## Recommendation
   Encourage subpath imports in documentation for production builds.
   ```

7. **Automated Test erstellen**

   Füge zu `packages/ui/package.json`:
   ```json
   {
     "scripts": {
       "analyze": "cd ../../examples/nextjs-app-router && ANALYZE=true pnpm build"
     }
   }
   ```

8. **CI Integration (optional)**

   Füge zu `.github/workflows/bundle-size.yml`:
   ```yaml
   name: Bundle Size Check

   on:
     pull_request:
       paths:
         - 'packages/ui/src/**'

   jobs:
     check-bundle-size:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: pnpm/action-setup@v2
         - uses: actions/setup-node@v4
           with:
             node-version: 18
             cache: 'pnpm'

         - run: pnpm install --frozen-lockfile
         - run: cd packages/ui && pnpm build
         - run: cd examples/nextjs-app-router && pnpm build

         - name: Check bundle size
           run: |
             SIZE=$(du -sb examples/nextjs-app-router/.next | cut -f1)
             echo "Bundle size: $SIZE bytes"
             if [ $SIZE -gt 500000 ]; then
               echo "❌ Bundle too large: $SIZE > 500KB"
               exit 1
             fi
   ```

**Definition of Done:**
- [ ] Bundle Analyzer konfiguriert in Test-App
- [ ] Baseline gemessen (Barrel Import): ~370KB
- [ ] Optimiert gemessen (Subpath Import): ≤20KB
- [ ] Bundle Size Reduktion ≥50% (Target: 95%)
- [ ] `BUNDLE_SIZE_REPORT.md` dokumentiert Before/After mit Screenshots
- [ ] Keine unerwarteten Dependencies in optimiertem Bundle

**Verifikation:**
```bash
# 1. Bundle Analyzer Build
cd examples/nextjs-app-router
ANALYZE=true pnpm build
# Erwartung: Browser öffnet mit Interactive Bundle Map

# 2. Size Check
du -h .next/static/chunks/pages/*.js | sort -h
# Erwartung: Subpath Import Seite hat kleinere Chunks als Barrel Import

# 3. Report existiert
test -f ../../docs/milestones/BUNDLE_SIZE_REPORT.md && echo "✅ Report documented"
```

**Troubleshooting:**

**Problem:** Bundle Size ist immer noch groß (>50KB) trotz Subpath Import
**Lösung:** Prüfe, ob `sideEffects: false` gesetzt ist. Falls ja, prüfe mit Analyzer, welche Module inkludiert sind:
```bash
# Im Bundle Analyzer: Suche nach "fidus/ui" und prüfe alle importierten Module
```
Mögliche Ursache: Shared Utilities sind zu groß. Extrahiere in separate Bundles.

**Problem:** Next.js Bundle Analyzer zeigt nichts an
**Lösung:** Prüfe Next.js Version (muss ≥14.0 sein). Falls Problem weiterhin:
```bash
# Alternative: webpack-bundle-analyzer direkt nutzen
pnpm add -D webpack-bundle-analyzer
npx webpack-bundle-analyzer .next/server/pages-manifest.json
```

**Problem:** Barrel Import und Subpath Import haben gleiche Bundle Size
**Lösung:** Tree-Shaking funktioniert nicht. Prüfe:
1. `"sideEffects": false` in package.json
2. `exports` Syntax korrekt (siehe Task 3.1.1)
3. Build-Tool unterstützt ESM (`format: ['esm']` in tsup)

---

### Task 3.1.3: Document Tree-Shaking Best Practices

**Ziel:** Entwickler über Bundle-Optimierung informieren.

**Input/Voraussetzungen:**
- Task 3.1.2 abgeschlossen (Bundle Size Report existiert)
- `BUNDLE_SIZE_REPORT.md` mit Before/After Metriken

**Schritt-für-Schritt Anleitung:**

1. **README Sektion hinzufügen**

   Öffne `packages/ui/README.md` und füge nach "Setup" hinzu:
   ```markdown
   ## Optimizing Bundle Size

   @fidus/ui supports **tree-shaking** via subpath imports. This reduces your bundle size significantly.

   ### Bundle Size Comparison

   | Import Style | Bundle Size | Gzipped |
   |--------------|-------------|---------|
   | Barrel import (`import { Button } from '@fidus/ui'`) | ~370KB | ~95KB |
   | Subpath import (`import { Button } from '@fidus/ui/button'`) | ~18KB | ~6KB |
   | **Reduction** | **-95%** | **-94%** |

   ### Recommended: Subpath Imports

   For production builds, use subpath imports to include only the components you need:

   ```typescript
   // ✅ Optimized (tree-shaking)
   import { Button } from '@fidus/ui/button';
   import { Stack } from '@fidus/ui/stack';
   import { Alert } from '@fidus/ui/alert';
   ```

   ### Development: Barrel Imports

   For development and prototyping, barrel imports are more convenient:

   ```typescript
   // 🚀 Fast development (larger bundle)
   import { Button, Stack, Alert } from '@fidus/ui';
   ```

   ### Available Subpath Exports

   All components support subpath imports:

   ```typescript
   import { Button } from '@fidus/ui/button';
   import { Stack } from '@fidus/ui/stack';
   import { Alert } from '@fidus/ui/alert';
   import { TextInput } from '@fidus/ui/textinput';
   import { DetailCard } from '@fidus/ui/detailcard';
   // ... and 15+ more
   ```

   See [full list of exports](./package.json) in `package.json` → `"exports"`.

   ### Bundle Analysis

   To analyze your bundle size, use:
   - Next.js: `@next/bundle-analyzer`
   - Vite: `rollup-plugin-visualizer`
   - Webpack: `webpack-bundle-analyzer`

   See [Bundle Size Report](../../docs/milestones/BUNDLE_SIZE_REPORT.md) for detailed analysis.
   ```

2. **TypeScript Config Tip**

   Füge Hinweis hinzu, wie IDEs Auto-Imports konfiguriert werden:
   ```markdown
   ### IDE Auto-Import Configuration

   Configure your IDE to prefer subpath imports:

   **VS Code** (`settings.json`):
   ```json
   {
     "typescript.preferences.importModuleSpecifier": "non-relative",
     "javascript.preferences.importModuleSpecifier": "non-relative"
   }
   ```

   **WebStorm/IntelliJ:**
   Settings → Editor → Code Style → TypeScript → Imports → Import Style: "Non-relative"
   ```

3. **ESLint Rule (optional)**

   Erstelle ESLint-Plugin, das vor Barrel Imports warnt:
   ```javascript
   // eslint-plugin-fidus-ui.js (optional)
   module.exports = {
     rules: {
       'prefer-subpath-imports': {
         meta: {
           type: 'suggestion',
           docs: {
             description: 'Prefer subpath imports over barrel imports for better tree-shaking',
           },
           fixable: 'code',
         },
         create(context) {
           return {
             ImportDeclaration(node) {
               if (node.source.value === '@fidus/ui') {
                 context.report({
                   node,
                   message: 'Use subpath imports (e.g., @fidus/ui/button) for better tree-shaking',
                   fix(fixer) {
                     // Auto-fix würde Import umschreiben
                   },
                 });
               }
             },
           };
         },
       },
     },
   };
   ```

   **Hinweis:** ESLint-Plugin ist optional und aufwändig. Nur für große Teams sinnvoll.

**Definition of Done:**
- [ ] README hat "Optimizing Bundle Size" Sektion
- [ ] Before/After Vergleichstabelle mit konkreten Zahlen
- [ ] Code-Beispiele für beide Import-Stile
- [ ] Link zu `BUNDLE_SIZE_REPORT.md`
- [ ] IDE-Konfiguration dokumentiert
- [ ] Docs Review von 1+ Entwickler

**Verifikation:**
```bash
# 1. README hat Sektion
grep -q "Optimizing Bundle Size" packages/ui/README.md && echo "✅ Section exists"

# 2. Tabelle mit Zahlen
grep -q "370KB" packages/ui/README.md && echo "✅ Metrics documented"

# 3. Code-Beispiele vorhanden
grep -c "import { Button }" packages/ui/README.md
# Erwartung: >= 2 (Barrel + Subpath Beispiel)
```

---

### Task 3.2.1: Accessibility Audit with axe DevTools

**Ziel:** Alle Accessibility-Verstöße systematisch finden und dokumentieren.

**Input/Voraussetzungen:**
- Browser mit axe DevTools Extension (Chrome/Firefox)
- Storybook oder Demo-App mit allen Komponenten
- Optional: Screen Reader (NVDA, VoiceOver)

**Schritt-für-Schritt Anleitung:**

1. **axe DevTools installieren**
   - Chrome: [axe DevTools Extension](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd)
   - Firefox: [axe DevTools for Firefox](https://addons.mozilla.org/en-US/firefox/addon/axe-devtools/)

2. **Demo-App starten**
   ```bash
   cd examples/nextjs-app-router
   pnpm dev
   ```

   Öffne http://localhost:3000

3. **axe Scan durchführen**

   - Öffne DevTools (F12)
   - Wechsle zum "axe DevTools" Tab
   - Klicke "Scan ALL of my page"

   **Erwartete Ausgabe:**
   ```
   Found 15 issues:
   - 5 Critical
   - 7 Serious
   - 3 Moderate
   ```

4. **Violations dokumentieren**

   Erstelle `docs/milestones/A11Y_AUDIT_REPORT.md`:
   ```markdown
   # Accessibility Audit Report - @fidus/ui

   **Date:** 2025-01-10
   **Tool:** axe DevTools v4.80
   **Scope:** All components in demo app

   ## Summary
   - **Critical:** 5 issues
   - **Serious:** 7 issues
   - **Moderate:** 3 issues
   - **Total:** 15 issues

   ---

   ## Critical Issues (Must Fix)

   ### 1. Button: Missing accessible name
   **Component:** Button
   **WCAG:** 4.1.2 Name, Role, Value (Level A)
   **Description:** Icon-only buttons lack `aria-label`
   **Affected:** `<Button><Icon /></Button>`
   **Fix:**
   ```tsx
   <Button aria-label="Close">
     <Icon name="close" />
   </Button>
   ```

   ### 2. Modal: No focus trap
   **Component:** Modal
   **WCAG:** 2.4.3 Focus Order (Level A)
   **Description:** Focus escapes modal when tabbing
   **Fix:** Implement focus trap with `focus-trap-react`

   ### 3. Dropdown: Missing keyboard navigation
   **Component:** Dropdown
   **WCAG:** 2.1.1 Keyboard (Level A)
   **Description:** Cannot open/navigate dropdown with keyboard
   **Fix:** Add Arrow keys, Enter, Escape support

   ### 4. Form: Error not associated with input
   **Component:** TextInput
   **WCAG:** 3.3.1 Error Identification (Level A)
   **Description:** Error message not linked via `aria-describedby`
   **Fix:**
   ```tsx
   <input aria-describedby="input-error" aria-invalid={!!error} />
   <span id="input-error" role="alert">{error}</span>
   ```

   ### 5. Link: Poor contrast (3.2:1)
   **Component:** Link
   **WCAG:** 1.4.3 Contrast (Minimum) (Level AA)
   **Description:** Link color (#5a9fd4) on white fails 4.5:1 requirement
   **Fix:** Change to #0066cc (6.5:1 contrast)

   ---

   ## Serious Issues (Should Fix)

   ### 6. Alert: No `role="alert"`
   **Component:** Alert
   **WCAG:** 4.1.3 Status Messages (Level AA)
   **Fix:** Add `role="alert"` to container

   ### 7. Tabs: No `aria-selected`
   **Component:** Tabs
   **Fix:** Add `aria-selected="true"` to active tab

   ### 8. Toast: Not announced by screen readers
   **Component:** Toast
   **Fix:** Use `role="status"` or `role="alert"` with `aria-live="polite"`

   ... (weitere 5 Issues)

   ---

   ## Moderate Issues (Nice to Have)

   ### 14. Tooltip: No ESC to close
   **Component:** Tooltip
   **Fix:** Add ESC key handler

   ... (weitere Issues)

   ---

   ## Keyboard Navigation Tests

   ### Button
   - [x] Tab: Focus moves to button
   - [x] Space/Enter: Activates button
   - [ ] Disabled state: Not focusable ❌ (currently focusable)

   ### Modal
   - [ ] Tab: Focus trapped in modal ❌
   - [ ] Escape: Closes modal ❌
   - [ ] Focus returns to trigger element on close ❌

   ### Dropdown
   - [ ] Enter/Space: Opens dropdown ❌
   - [ ] Arrow Down/Up: Navigate options ❌
   - [ ] Escape: Closes dropdown ❌
   - [ ] Type-ahead: Jump to option ❌

   ---

   ## Screen Reader Testing (VoiceOver macOS)

   ### Button
   - ✅ Announces: "Button, [Label]"
   - ❌ Disabled state not announced

   ### TextInput
   - ✅ Announces: "Text field, [Label]"
   - ❌ Error message not read automatically

   ### Alert
   - ❌ Not announced on render (missing `role="alert"`)

   ---

   ## Priority Fix List

   **P0 (Critical - Blocks A11Y Compliance):**
   1. Button: aria-label for icon-only
   2. Modal: Focus trap
   3. Dropdown: Keyboard navigation
   4. Form: aria-describedby for errors
   5. Link: Fix contrast ratio

   **P1 (Serious - Major UX Issues):**
   6. Alert: role="alert"
   7. Tabs: aria-selected
   8. Toast: Screen reader announcement
   ... (weitere)

   **P2 (Moderate - Minor UX Issues):**
   14. Tooltip: ESC to close
   ...
   ```

5. **Keyboard Navigation Test**

   Manuell jede interaktive Komponente mit Tastatur testen:
   ```bash
   # Test-Checkliste
   # Tab: Fokus bewegt sich durch Komponenten
   # Shift+Tab: Fokus rückwärts
   # Enter/Space: Aktiviert Element
   # Escape: Schließt Modal/Dropdown
   # Arrow Keys: Navigation in Listen/Dropdowns
   ```

6. **Screen Reader Test (optional)**

   Für kritische Komponenten mit VoiceOver (macOS) oder NVDA (Windows) testen:
   ```bash
   # macOS VoiceOver starten: Cmd+F5
   # Windows NVDA starten: Ctrl+Alt+N
   ```

   Dokumentiere, was vorgelesen wird und was fehlt.

**Definition of Done:**
- [ ] axe DevTools Scan auf Demo-App durchgeführt
- [ ] Alle Violations dokumentiert in `A11Y_AUDIT_REPORT.md`
- [ ] Kategorisiert nach Severity (Critical, Serious, Moderate)
- [ ] Priorisierte Fix-Liste erstellt (P0, P1, P2)
- [ ] Keyboard Navigation für 10+ Komponenten getestet
- [ ] Screen Reader Test für kritische Komponenten (optional)

**Verifikation:**
```bash
# 1. Report existiert
test -f docs/milestones/A11Y_AUDIT_REPORT.md && echo "✅ Audit report created"

# 2. Violations dokumentiert
grep -c "###" docs/milestones/A11Y_AUDIT_REPORT.md
# Erwartung: >= 15 (1 pro Issue)

# 3. Priority List
grep -q "P0 (Critical" docs/milestones/A11Y_AUDIT_REPORT.md && echo "✅ Priorities defined"
```

**Troubleshooting:**

**Problem:** axe findet 0 Issues, obwohl Komponenten offensichtlich nicht accessible sind
**Lösung:** axe scannt nur gerenderte Elemente. Stelle sicher, dass Demo-App alle Komponenten rendert (inkl. Modal offen, Dropdown expanded, etc.)

**Problem:** Zu viele False Positives (z.B. "Form label missing" für styled inputs)
**Lösung:** Prüfe manuell. Axe erkennt nicht alle Label-Patterns (z.B. `<label><input /></label>` ohne `for`-Attribut).

---

### Task 3.2.2: Implement Accessibility Fixes

**Ziel:** Alle Critical und Serious A11y-Violations beheben.

**Input/Voraussetzungen:**
- Task 3.2.1 abgeschlossen (`A11Y_AUDIT_REPORT.md` existiert)
- Priorisierte Fix-Liste

**Schritt-für-Schritt Anleitung:**

1. **Fix 1: Button aria-label**

   Öffne `packages/ui/src/components/Button/Button.tsx`:
   ```typescript
   export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
     variant?: 'primary' | 'secondary';
     /**
      * Accessible label for icon-only buttons.
      * Required if button has no text content.
      */
     'aria-label'?: string;
   }

   export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
     ({ children, variant = 'primary', ...props }, ref) => {
       // Warn in dev if icon-only button lacks aria-label
       if (process.env.NODE_ENV === 'development') {
         if (!children && !props['aria-label']) {
           console.warn('Button: Icon-only buttons should have aria-label');
         }
       }

       return (
         <button ref={ref} {...props}>
           {children}
         </button>
       );
     }
   );
   ```

2. **Fix 2: Modal Focus Trap**

   Installiere `focus-trap-react`:
   ```bash
   cd packages/ui
   pnpm add focus-trap-react
   ```

   Öffne `packages/ui/src/components/Modal/Modal.tsx`:
   ```typescript
   import FocusTrap from 'focus-trap-react';
   import { useEffect, useRef } from 'react';

   export interface ModalProps {
     isOpen: boolean;
     onClose: () => void;
     children: React.ReactNode;
   }

   export function Modal({ isOpen, onClose, children }: ModalProps) {
     const closeButtonRef = useRef<HTMLButtonElement>(null);

     useEffect(() => {
       if (isOpen) {
         // Focus close button when modal opens
         closeButtonRef.current?.focus();
       }
     }, [isOpen]);

     useEffect(() => {
       // Close on ESC key
       const handleEsc = (e: KeyboardEvent) => {
         if (e.key === 'Escape' && isOpen) {
           onClose();
         }
       };
       window.addEventListener('keydown', handleEsc);
       return () => window.removeEventListener('keydown', handleEsc);
     }, [isOpen, onClose]);

     if (!isOpen) return null;

     return (
       <FocusTrap>
         <div
           role="dialog"
           aria-modal="true"
           style={{
             position: 'fixed',
             inset: 0,
             background: 'rgba(0,0,0,0.5)',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
           }}
           onClick={onClose}
         >
           <div
             style={{ background: 'white', padding: '2rem', borderRadius: '8px' }}
             onClick={(e) => e.stopPropagation()}
           >
             <button
               ref={closeButtonRef}
               onClick={onClose}
               aria-label="Close modal"
               style={{ float: 'right' }}
             >
               ✕
             </button>
             {children}
           </div>
         </div>
       </FocusTrap>
     );
   }
   ```

3. **Fix 3: Dropdown Keyboard Navigation**

   Beispiel für einfaches Dropdown mit Keyboard Support:
   ```typescript
   export function Dropdown({ label, children }: DropdownProps) {
     const [isOpen, setIsOpen] = useState(false);
     const [focusedIndex, setFocusedIndex] = useState(0);
     const itemsRef = useRef<HTMLElement[]>([]);

     const handleKeyDown = (e: React.KeyboardEvent) => {
       if (!isOpen && (e.key === 'Enter' || e.key === ' ')) {
         e.preventDefault();
         setIsOpen(true);
         return;
       }

       if (isOpen) {
         switch (e.key) {
           case 'ArrowDown':
             e.preventDefault();
             setFocusedIndex((prev) => (prev + 1) % itemsRef.current.length);
             break;
           case 'ArrowUp':
             e.preventDefault();
             setFocusedIndex((prev) => (prev - 1 + itemsRef.current.length) % itemsRef.current.length);
             break;
           case 'Enter':
             e.preventDefault();
             itemsRef.current[focusedIndex]?.click();
             setIsOpen(false);
             break;
           case 'Escape':
             e.preventDefault();
             setIsOpen(false);
             break;
         }
       }
     };

     return (
       <div>
         <button
           onClick={() => setIsOpen(!isOpen)}
           onKeyDown={handleKeyDown}
           aria-expanded={isOpen}
           aria-haspopup="listbox"
         >
           {label}
         </button>
         {isOpen && (
           <ul role="listbox">
             {React.Children.map(children, (child, index) => (
               <li
                 role="option"
                 aria-selected={index === focusedIndex}
                 ref={(el) => (itemsRef.current[index] = el!)}
               >
                 {child}
               </li>
             ))}
           </ul>
         )}
       </div>
     );
   }
   ```

4. **Fix 4: Form Error Messages**

   Öffne `packages/ui/src/components/TextInput/TextInput.tsx`:
   ```typescript
   export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
     label: string;
     error?: string;
   }

   export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
     ({ label, error, ...props }, ref) => {
       const inputId = useId();
       const errorId = useId();

       return (
         <div>
           <label htmlFor={inputId}>{label}</label>
           <input
             ref={ref}
             id={inputId}
             aria-invalid={!!error}
             aria-describedby={error ? errorId : undefined}
             {...props}
           />
           {error && (
             <span id={errorId} role="alert" style={{ color: 'red' }}>
               {error}
             </span>
           )}
         </div>
       );
     }
   );
   ```

5. **Fix 5: Kontrast-Verhältnisse**

   Prüfe alle Farben in `packages/ui/src/theme/default.ts`:
   ```typescript
   export const DEFAULT_THEME = {
     colors: {
       // ❌ Before: primary: '#5a9fd4' (3.2:1 contrast)
       // ✅ After: primary: '#0066cc' (6.5:1 contrast - WCAG AA compliant)
       primary: '#0066cc',

       // Check other colors with https://webaim.org/resources/contrastchecker/
       secondary: '#6c757d',
       success: '#28a745',
       danger: '#dc3545',
       warning: '#ffc107', // 2.8:1 - ❌ FAIL
       // Fix: warning: '#d39e00', // 4.5:1 ✅
     },
   };
   ```

6. **Test nach Fixes**
   ```bash
   cd examples/nextjs-app-router
   pnpm dev
   ```

   Führe axe Scan erneut durch:
   - Öffne DevTools → axe DevTools → Scan
   - **Erwartung:** Critical Issues: 0, Serious Issues: 0

**Definition of Done:**
- [ ] Alle Critical Issues (P0) behoben
- [ ] Alle Serious Issues (P1) behoben
- [ ] axe DevTools zeigt 0 Critical/Serious Violations
- [ ] Keyboard Navigation funktioniert für alle interaktiven Komponenten
- [ ] Focus Indicators sichtbar (3:1 Kontrast)
- [ ] Kontrastverhältnisse ≥4.5:1 für Text

**Verifikation:**
```bash
# 1. Unit Tests laufen durch
cd packages/ui
pnpm test

# 2. Manual axe Scan
# Öffne examples/nextjs-app-router, DevTools → axe → Scan
# Erwartung: 0 Critical, 0 Serious

# 3. Keyboard Test
# Tab durch alle Komponenten, Enter/Space aktiviert, Escape schließt Modals

# 4. Contrast Check
# https://webaim.org/resources/contrastchecker/
# Prüfe primary, secondary, etc. Farben
```

**Troubleshooting:**

**Problem:** Focus Trap funktioniert nicht (Focus entweicht aus Modal)
**Lösung:** Prüfe, ob `<FocusTrap>` alle Modal-Inhalte umschließt. Stelle sicher, dass keine Elemente außerhalb des Modals fokusierbar sind (z.B. Background mit `aria-hidden="true"`).

**Problem:** Keyboard Navigation: Arrow Keys scrollen Seite statt Dropdown zu navigieren
**Lösung:** Füge `e.preventDefault()` im KeyDown Handler hinzu.

**Problem:** Screen Reader liest Error Message nicht vor
**Lösung:** Stelle sicher, dass `role="alert"` auf Error-Element gesetzt ist UND `aria-describedby` auf Input zeigt.

---

### Task 3.2.3: Add Accessibility Tests to CI/CD

**Ziel:** A11y-Regressions automatisch in CI erkennen.

**Input/Voraussetzungen:**
- Task 3.2.2 abgeschlossen (A11y-Fixes implementiert)
- `jest-axe` installiert

**Schritt-für-Schritt Anleitung:**

1. **jest-axe installieren**
   ```bash
   cd packages/ui
   pnpm add -D jest-axe
   ```

2. **A11y Test Suite erstellen**

   Erstelle `packages/ui/src/__tests__/accessibility.test.tsx`:
   ```typescript
   import React from 'react';
   import { render } from '@testing-library/react';
   import { axe, toHaveNoViolations } from 'jest-axe';
   import {
     Button,
     Modal,
     TextInput,
     Alert,
     Dropdown,
   } from '../index';

   expect.extend(toHaveNoViolations);

   describe('Accessibility Tests', () => {
     it('Button has no violations', async () => {
       const { container } = render(<Button>Click me</Button>);
       expect(await axe(container)).toHaveNoViolations();
     });

     it('Button with aria-label has no violations', async () => {
       const { container } = render(
         <Button aria-label="Close">✕</Button>
       );
       expect(await axe(container)).toHaveNoViolations();
     });

     it('Modal has no violations', async () => {
       const { container } = render(
         <Modal isOpen={true} onClose={() => {}}>
           <h2>Modal Title</h2>
           <p>Modal content</p>
         </Modal>
       );
       expect(await axe(container)).toHaveNoViolations();
     });

     it('TextInput has no violations', async () => {
       const { container } = render(
         <TextInput label="Name" placeholder="Enter name" />
       );
       expect(await axe(container)).toHaveNoViolations();
     });

     it('TextInput with error has no violations', async () => {
       const { container } = render(
         <TextInput label="Email" error="Invalid email" />
       );
       expect(await axe(container)).toHaveNoViolations();
     });

     it('Alert has no violations', async () => {
       const { container } = render(
         <Alert type="info">Information message</Alert>
       );
       expect(await axe(container)).toHaveNoViolations();
     });

     it('All components together have no violations', async () => {
       const { container } = render(
         <div>
           <Button>Button</Button>
           <TextInput label="Name" />
           <Alert type="success">Success</Alert>
         </div>
       );
       expect(await axe(container)).toHaveNoViolations();
     });
   });
   ```

3. **Tests ausführen**
   ```bash
   cd packages/ui
   pnpm test src/__tests__/accessibility.test.tsx
   ```

   **Erwartung:** Alle Tests laufen durch. Falls Violations:
   ```
   Expected the HTML found at $('button') to have no violations:

   <button>✕</button>

   Received 1 violation:

   - button-name: Buttons must have discernible text (critical)
   ```

4. **CI Integration**

   Tests laufen automatisch in bestehendem CI (`.github/workflows/test.yml`):
   ```yaml
   # Bereits vorhanden aus Phase 1/2
   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - run: pnpm test
         # Inkludiert automatisch accessibility.test.tsx
   ```

5. **Script hinzufügen**

   Füge zu `packages/ui/package.json`:
   ```json
   {
     "scripts": {
       "test:a11y": "jest src/__tests__/accessibility.test.tsx",
       "test:a11y:watch": "jest src/__tests__/accessibility.test.tsx --watch"
     }
   }
   ```

**Definition of Done:**
- [ ] `jest-axe` installiert
- [ ] A11y Tests für 10+ Komponenten
- [ ] Tests laufen in CI/CD
- [ ] Tests schlagen fehl bei A11y-Violations
- [ ] Test Execution Time < 3 Minuten

**Verifikation:**
```bash
# 1. Tests laufen
cd packages/ui
pnpm test:a11y
# Erwartung: 10+ tests pass

# 2. CI Status
gh pr checks
# Erwartung: test job includes accessibility tests

# 3. Execution Time
time pnpm test:a11y
# Erwartung: < 180 Sekunden
```

**Troubleshooting:**

**Problem:** `jest-axe` dauert sehr lange (> 5 Minuten)
**Lösung:** Teste nur gerenderte Komponenten, nicht ganze Pages. Nutze `container` statt `document.body`.

**Problem:** False Positives (z.B. "landmark-one-main" in isolierten Tests)
**Lösung:** Konfiguriere axe, um bestimmte Rules zu deaktivieren:
```typescript
expect(await axe(container, { rules: { 'landmark-one-main': { enabled: false } } })).toHaveNoViolations();
```

---

### Task 3.3.1: Add `forwardRef` to Form Components

**Ziel:** React Hook Form Integration durch `forwardRef` ermöglichen.

**Input/Voraussetzungen:**
- Liste aller Form-Komponenten (`TextInput`, `Select`, `Checkbox`, etc.)

**Schritt-für-Schritt Anleitung:**

1. **TextInput mit forwardRef**

   Öffne `packages/ui/src/components/TextInput/TextInput.tsx`:
   ```typescript
   import { forwardRef, useId } from 'react';

   export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
     label: string;
     error?: string;
   }

   export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
     ({ label, error, className, ...props }, ref) => {
       const inputId = useId();
       const errorId = useId();

       return (
         <div className={className}>
           <label htmlFor={inputId}>{label}</label>
           <input
             ref={ref}
             id={inputId}
             aria-invalid={!!error}
             aria-describedby={error ? errorId : undefined}
             {...props}
           />
           {error && (
             <span id={errorId} role="alert" style={{ color: 'red' }}>
               {error}
             </span>
           )}
         </div>
       );
     }
   );

   TextInput.displayName = 'TextInput';
   ```

   **Wichtig:** `displayName` für bessere DevTools-Experience.

2. **Select mit forwardRef**

   ```typescript
   export const Select = forwardRef<HTMLSelectElement, SelectProps>(
     ({ label, error, children, ...props }, ref) => {
       const selectId = useId();
       const errorId = useId();

       return (
         <div>
           <label htmlFor={selectId}>{label}</label>
           <select
             ref={ref}
             id={selectId}
             aria-invalid={!!error}
             aria-describedby={error ? errorId : undefined}
             {...props}
           >
             {children}
           </select>
           {error && <span id={errorId} role="alert">{error}</span>}
         </div>
       );
     }
   );

   Select.displayName = 'Select';
   ```

3. **Checkbox mit forwardRef**

   ```typescript
   export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
     ({ label, error, ...props }, ref) => {
       const checkboxId = useId();

       return (
         <div>
           <label>
             <input
               ref={ref}
               type="checkbox"
               id={checkboxId}
               aria-invalid={!!error}
               {...props}
             />
             {label}
           </label>
           {error && <span role="alert">{error}</span>}
         </div>
       );
     }
   );

   Checkbox.displayName = 'Checkbox';
   ```

4. **Test mit React Hook Form**

   Erstelle Test `packages/ui/src/__tests__/form-integration.test.tsx`:
   ```typescript
   import React from 'react';
   import { render, screen } from '@testing-library/react';
   import { useForm } from 'react-hook-form';
   import { TextInput, Checkbox, Select } from '../index';

   function TestForm() {
     const { register, handleSubmit } = useForm();

     return (
       <form onSubmit={handleSubmit((data) => console.log(data))}>
         <TextInput label="Name" {...register('name')} />
         <TextInput label="Email" {...register('email')} />
         <Checkbox label="Accept" {...register('accept')} />
         <Select label="Country" {...register('country')}>
           <option value="de">Germany</option>
         </Select>
         <button type="submit">Submit</button>
       </form>
     );
   }

   describe('Form Integration', () => {
     it('Components work with React Hook Form register', () => {
       render(<TestForm />);

       expect(screen.getByLabelText('Name')).toBeInTheDocument();
       expect(screen.getByLabelText('Email')).toBeInTheDocument();
       expect(screen.getByLabelText('Accept')).toBeInTheDocument();
     });
   });
   ```

5. **Wende auf alle Form-Komponenten an**

   Liste der zu aktualisierenden Komponenten:
   - [x] TextInput
   - [x] Select
   - [x] Checkbox
   - [ ] Radio
   - [ ] Textarea
   - [ ] Switch

   Für jede Komponente: Wrap mit `forwardRef`, füge `error` Prop hinzu, setze `displayName`.

**Definition of Done:**
- [ ] Alle Form-Komponenten nutzen `forwardRef`
- [ ] `error` Prop für Validationsfehler vorhanden
- [ ] `displayName` für alle Komponenten gesetzt
- [ ] Kompatibel mit React Hook Form `register()`
- [ ] TypeScript Types aktualisiert
- [ ] Backward Compatibility: Bestehender Code funktioniert weiterhin

**Verifikation:**
```bash
# 1. Test mit React Hook Form
cd packages/ui
pnpm add -D react-hook-form
pnpm test src/__tests__/form-integration.test.tsx
# Erwartung: All tests pass

# 2. Prüfe forwardRef
rg "forwardRef" packages/ui/src/components/ --count-matches
# Erwartung: >= 6 (alle Form-Komponenten)

# 3. displayName gesetzt
rg "displayName" packages/ui/src/components/ --count-matches
# Erwartung: >= 6
```

---

### Task 3.3.2: Document React Hook Form Integration

**Ziel:** Entwickler zeigen, wie React Hook Form + Zod mit @fidus/ui funktioniert.

**Input/Voraussetzungen:**
- Task 3.3.1 abgeschlossen (forwardRef implementiert)

**Schritt-für-Schritt Anleitung:**

1. **README Sektion**

   Füge zu `packages/ui/README.md` hinzu:
   ```markdown
   ## Form Validation

   @fidus/ui components support [React Hook Form](https://react-hook-form.com/) out of the box.

   ### Basic Example

   ```tsx
   import { useForm } from 'react-hook-form';
   import { TextInput, Button } from '@fidus/ui';

   function LoginForm() {
     const { register, handleSubmit, formState: { errors } } = useForm();

     const onSubmit = (data) => {
       console.log(data);
     };

     return (
       <form onSubmit={handleSubmit(onSubmit)}>
         <TextInput
           label="Email"
           type="email"
           error={errors.email?.message}
           {...register('email', { required: 'Email is required' })}
         />

         <TextInput
           label="Password"
           type="password"
           error={errors.password?.message}
           {...register('password', { required: 'Password is required' })}
         />

         <Button type="submit">Login</Button>
       </form>
     );
   }
   ```

   ### With Zod Schema Validation

   ```tsx
   import { useForm } from 'react-hook-form';
   import { zodResolver } from '@hookform/resolvers/zod';
   import { z } from 'zod';
   import { TextInput, Button } from '@fidus/ui';

   const schema = z.object({
     email: z.string().email('Invalid email'),
     password: z.string().min(8, 'Password must be at least 8 characters'),
   });

   type FormData = z.infer<typeof schema>;

   function LoginForm() {
     const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
       resolver: zodResolver(schema),
     });

     return (
       <form onSubmit={handleSubmit((data) => console.log(data))}>
         <TextInput
           label="Email"
           error={errors.email?.message}
           {...register('email')}
         />

         <TextInput
           label="Password"
           type="password"
           error={errors.password?.message}
           {...register('password')}
         />

         <Button type="submit">Login</Button>
       </form>
     );
   }
   ```

   ### TypeScript Support

   All form components are fully typed:

   ```tsx
   import type { TextInputProps } from '@fidus/ui';

   const props: TextInputProps = {
     label: 'Name',
     error: 'Required',
     onChange: (e) => console.log(e.target.value),
   };
   ```
   ```

2. **CodeSandbox Beispiel (optional)**

   Erstelle CodeSandbox mit vollständigem Form-Beispiel und verlinke in README.

**Definition of Done:**
- [ ] README hat "Form Validation" Sektion
- [ ] Basic Example (React Hook Form)
- [ ] Zod Schema Validation Example
- [ ] TypeScript Types dokumentiert

**Verifikation:**
```bash
grep -q "Form Validation" packages/ui/README.md && echo "✅ Section exists"
grep -c "useForm" packages/ui/README.md
# Erwartung: >= 2
```

---

### Task 3.3.3: Create Storybook Form Examples

**Ziel:** Interaktive Beispiele für Forms in Storybook.

**Input/Voraussetzungen:**
- Storybook konfiguriert (falls nicht vorhanden, überspringen)

**Schritt-für-Schritt Anleitung:**

Falls Storybook existiert, erstelle `packages/ui/src/components/Form/Form.stories.tsx`:
```tsx
import { useForm } from 'react-hook-form';
import { TextInput, Button, Checkbox } from '../index';

export default {
  title: 'Forms/Examples',
};

export const BasicForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit((data) => alert(JSON.stringify(data)))}>
      <TextInput
        label="Name"
        error={errors.name?.message}
        {...register('name', { required: 'Name is required' })}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};

export const WithValidation = () => {
  // ... Zod Example
};
```

**Falls kein Storybook:** Task überspringen oder in Dokumentation verweisen.

**Definition of Done:**
- [ ] 4+ Storybook Stories für Forms
- [ ] Interaktive Controls
- [ ] Published zu Storybook Deployment (falls vorhanden)

---

## Success Criteria für Phase 3

### Must Have
- [ ] Tree-Shaking: Bundle Size ≤20KB für single component import
- [ ] Accessibility: 0 Critical/Serious axe violations
- [ ] Form Integration: forwardRef auf allen Form-Komponenten

### Should Have
- [ ] Bundle Size Reduktion ≥50%
- [ ] Keyboard Navigation für alle interaktiven Komponenten
- [ ] React Hook Form + Zod Beispiel dokumentiert

### Nice to Have
- [ ] Storybook Form Examples
- [ ] CodeSandbox Templates
- [ ] ESLint Plugin für Tree-Shaking

---

## Nächste Schritte

Nach Abschluss von Phase 3:

1. **Release v2.0.0** (stable):
   ```bash
   pnpm changeset
   # Summary: "feat: tree-shaking, a11y compliance, form integration (#61, #62, #63)"
   pnpm changeset version
   pnpm build
   pnpm publish
   ```

2. **Close Issues #61, #62, #63**

3. **Announce v2.0.0**:
   - GitHub Release with Changelog
   - Discord/Slack announcement
   - Blog post (optional)

4. **Monitor Feedback**:
   - Bundle size reports from users
   - A11y bug reports
   - Form integration issues

---

**Version:** 1.0
**Letzte Aktualisierung:** 2025-01-10
**Maintainer:** Frontend Team
