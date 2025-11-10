# Phase 1: Critical Bug Fix - Implementierungs-Prompt

## Übersicht

- **Ziel:** SSR `useContext` Error in Next.js 14 App Router beheben und Produktionsdeployment ermöglichen
- **Related Issues:** [#57](https://github.com/y-core-engineering/fidus/issues/57)
- **Dependencies:** Keine - höchste Priorität, blockiert alle anderen Features
- **Blocks:** Phase 2 (#59, #60), Phase 3 (#61, #62, #63)

## Kontext für den Developer

Die @fidus/ui v1.4.1 ist aktuell **nicht mit Next.js 14 App Router kompatibel**. Alle Komponenten, die Context Hooks verwenden (z.B. `useTheme`, `useConfig`, `useToast`), schlagen während `next build` mit dem Fehler `"Cannot read property 'useContext' of null"` fehl. Dies blockiert Produktionsdeployments und zwingt Nutzer zu `'use client'`-Workarounds, was SEO und Performance negativ beeinflusst.

Das Problem entsteht, weil React Context Hooks während Server-Side Rendering keinen Context-Provider vorfinden. Statt graceful degradation oder klarer Fehlermeldungen wirft die Library kryptische Errors. Diese Phase implementiert SSR-safe Fallbacks für alle betroffenen Hooks und stellt sicher, dass alle Komponenten im SSR-Modus rendern können.

**Warum ist das kritisch?** Ohne diesen Fix können Nutzer @fidus/ui nicht in modernen Next.js-Apps verwenden. Das degradiert die Library von "production-ready" zu "nur client-side nutzbar".

## Tasks in dieser Phase

### Task 1.1.1: Reproduce Bug in Isolated Test Setup

**Ziel:** Fehler in minimal reproduzierbarem Test-Setup isolieren und dokumentieren.

**Input/Voraussetzungen:**
- Node.js 18+ installiert
- Zugriff auf `packages/ui/` Quellcode
- Issue [#57](https://github.com/y-core-engineering/fidus/issues/57) gelesen

**Schritt-für-Schritt Anleitung:**

1. **Test-App Struktur erstellen**
   ```bash
   mkdir -p test-apps/ssr-repro
   cd test-apps/ssr-repro
   ```

   Erstelle ein minimales Next.js 14 App Router Projekt ohne `create-next-app`, um Kontrolle über alle Dependencies zu haben.

2. **package.json erstellen**
   ```bash
   cat > package.json << 'EOF'
   {
     "name": "ssr-repro",
     "version": "0.0.1",
     "private": true,
     "scripts": {
       "dev": "next dev",
       "build": "next build",
       "start": "next start"
     },
     "dependencies": {
       "next": "^14.2.0",
       "react": "^18.3.0",
       "react-dom": "^18.3.0",
       "@fidus/ui": "workspace:*"
     },
     "devDependencies": {
       "typescript": "^5.3.0",
       "@types/node": "^20.0.0",
       "@types/react": "^18.3.0",
       "@types/react-dom": "^18.3.0"
     }
   }
   EOF
   ```

   **Wichtig:** `"@fidus/ui": "workspace:*"` nutzt die lokale Version aus dem Monorepo.

3. **TypeScript Config**
   ```bash
   cat > tsconfig.json << 'EOF'
   {
     "compilerOptions": {
       "target": "ES2017",
       "lib": ["dom", "dom.iterable", "esnext"],
       "allowJs": true,
       "skipLibCheck": true,
       "strict": true,
       "noEmit": true,
       "esModuleInterop": true,
       "module": "esnext",
       "moduleResolution": "bundler",
       "resolveJsonModule": true,
       "isolatedModules": true,
       "jsx": "preserve",
       "incremental": true,
       "plugins": [
         {
           "name": "next"
         }
       ],
       "paths": {
         "@/*": ["./*"]
       }
     },
     "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
     "exclude": ["node_modules"]
   }
   EOF
   ```

4. **Next.js Config**
   ```bash
   cat > next.config.js << 'EOF'
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     reactStrictMode: true,
   }

   module.exports = nextConfig
   EOF
   ```

5. **App Router Layout (Reproduktion)**
   ```bash
   mkdir -p app
   cat > app/layout.tsx << 'EOF'
   import type { Metadata } from 'next'

   export const metadata: Metadata = {
     title: 'SSR Repro - @fidus/ui',
     description: 'Reproduktion des SSR useContext Bugs',
   }

   export default function RootLayout({
     children,
   }: {
     children: React.ReactNode
   }) {
     return (
       <html lang="de">
         <body>{children}</body>
       </html>
     )
   }
   EOF
   ```

6. **Test Page mit betroffenen Komponenten**
   ```bash
   cat > app/page.tsx << 'EOF'
   import { Button, Stack, Alert, DetailCard } from '@fidus/ui';

   export default function HomePage() {
     return (
       <main style={{ padding: '2rem' }}>
         <h1>SSR Test Page</h1>

         <Stack direction="vertical" spacing={4}>
           <Button variant="primary">Test Button</Button>

           <Alert type="info">
             Dies ist eine Test-Alert
           </Alert>

           <DetailCard
             title="Test Card"
             description="Test-Beschreibung"
           />
         </Stack>
       </main>
     )
   }
   EOF
   ```

   **Warum diese Komponenten?** Button, Stack, Alert und DetailCard nutzen intern Context Hooks (z.B. `useTheme`) und sind repräsentativ für die meisten UI-Komponenten.

7. **Dependencies installieren**
   ```bash
   # Im Root des Monorepos ausführen
   cd ../..
   pnpm install
   ```

8. **Build durchführen und Error reproduzieren**
   ```bash
   cd test-apps/ssr-repro
   pnpm build
   ```

   **Erwartung:** Build schlägt fehl mit Error wie:
   ```
   Error: Cannot read property 'useContext' of null
   at useTheme (packages/ui/src/hooks/useTheme.ts:12:5)
   at Button (packages/ui/src/components/Button/Button.tsx:15:10)
   ```

9. **Stack Trace dokumentieren**
   ```bash
   mkdir -p ../../bug-reports
   pnpm build 2>&1 | tee ../../bug-reports/SSR_REPRO_LOG.md
   ```

   Füge manuell folgende Informationen hinzu:
   - Welche Hooks sind betroffen? (aus Stack Trace ablesen)
   - Welche Komponenten nutzen diese Hooks?
   - Zeile und Datei des Fehlers notieren

**Definition of Done:**
- [ ] `test-apps/ssr-repro/` existiert mit vollständiger Next.js 14 App Router Konfiguration
- [ ] `pnpm build` schlägt reproduzierbar fehl (100% Fehlerrate bei 3+ Versuchen)
- [ ] Stack Trace in `bug-reports/SSR_REPRO_LOG.md` dokumentiert mit:
  - Fehlermeldung (exakte Zeile)
  - Betroffene Dateipfade (`packages/ui/src/hooks/...`)
  - Komponentenstack (Button → useTheme → useContext)
- [ ] Error entspricht Issue [#57](https://github.com/y-core-engineering/fidus/issues/57) (useContext null pointer)

**Verifikation:**
```bash
# 1. Build Test (muss fehlschlagen)
cd test-apps/ssr-repro
pnpm build
# Erwartung: Exit Code 1, Error Message enthält "useContext"

# 2. Reproduzierbarkeit prüfen
pnpm build && pnpm build && pnpm build
# Erwartung: Alle 3 Builds schlagen identisch fehl

# 3. Stack Trace validieren
cat ../../bug-reports/SSR_REPRO_LOG.md | grep -E "useContext|useTheme|Button"
# Erwartung: Mindestens 3 Zeilen mit betroffenen Hooks/Komponenten
```

**Troubleshooting:**

**Problem:** `pnpm install` schlägt fehl mit "workspace:* not found"
**Lösung:** Stelle sicher, dass `pnpm-workspace.yaml` im Root existiert und `test-apps/*` inkludiert:
```yaml
packages:
  - 'packages/*'
  - 'test-apps/*'
```

**Problem:** Build läuft durch ohne Fehler
**Lösung:** Prüfe, ob Komponenten wirklich aus `@fidus/ui` importiert werden (nicht aus lokalem `node_modules` Cache). Führe `rm -rf node_modules .next && pnpm install` aus.

**Problem:** Andere Fehler als `useContext` (z.B. TypeScript Errors)
**Lösung:** Ignoriere TypeScript-Fehler zunächst mit `skipLibCheck: true`. Fokus liegt auf Runtime SSR Error.

---

### Task 1.1.2: Identify Faulty Context Hooks

**Ziel:** Alle Context Hooks ohne SSR-safe null checks finden und dokumentieren.

**Input/Voraussetzungen:**
- Task 1.1.1 abgeschlossen (`bug-reports/SSR_REPRO_LOG.md` existiert)
- Zugriff auf `packages/ui/src/` Quellcode
- Stack Trace aus Task 1.1.1

**Schritt-für-Schritt Anleitung:**

1. **Stack Trace analysieren**
   ```bash
   cd /Users/sebastianherden/Documents/GitHub/fidus
   cat bug-reports/SSR_REPRO_LOG.md
   ```

   Identifiziere aus dem Stack Trace:
   - Welche Hooks werden aufgerufen? (z.B. `useTheme`, `useConfig`)
   - In welchen Dateien liegen sie? (z.B. `packages/ui/src/hooks/useTheme.ts`)
   - Welche Zeilen werfen den Error?

2. **Alle useContext Calls finden**
   ```bash
   rg -n "useContext" packages/ui/src/ --type ts --type tsx -A 5
   ```

   **Warum -A 5?** Zeigt 5 Zeilen nach jedem Match, um zu sehen, ob ein null check existiert.

   **Erwartete Ausgabe:**
   ```
   packages/ui/src/hooks/useTheme.ts:12:  const context = useContext(ThemeContext);
   packages/ui/src/hooks/useTheme.ts:13:  if (context === null) {
   packages/ui/src/hooks/useTheme.ts:14:    throw new Error('useTheme must be used within ThemeProvider');
   ```

3. **Betroffene Hooks kategorisieren**

   Erstelle `docs/milestones/AFFECTED_HOOKS.md`:
   ```bash
   cat > docs/milestones/AFFECTED_HOOKS.md << 'EOF'
   # Betroffene Context Hooks - SSR Bug #57

   ## Status: 🔴 Requires Fix

   **Problem:** Alle Hooks werfen Error während SSR, weil kein SSR-safe fallback existiert.

   ## Betroffene Hooks

   ### ❌ useTheme (packages/ui/src/hooks/useTheme.ts)
   - **Zeile:** 12-14
   - **Pattern:** `useContext(ThemeContext)` ohne `typeof window === 'undefined'` check
   - **Genutzt von:** Button, Stack, Card, Alert, Modal (ca. 15+ Komponenten)
   - **Fallback:** `DEFAULT_THEME` (bereits definiert in `src/theme/default.ts`)

   ### ❌ useConfig (packages/ui/src/hooks/useConfig.ts)
   - **Zeile:** 8-10
   - **Pattern:** `useContext(ConfigContext)` ohne SSR guard
   - **Genutzt von:** Toast, Dropdown, Tooltip
   - **Fallback:** `DEFAULT_CONFIG = { locale: 'de', dir: 'ltr' }`

   ### ❌ useToastController (packages/ui/src/hooks/useToast.ts)
   - **Zeile:** 15-17
   - **Pattern:** `useContext(ToastContext)` ohne SSR guard
   - **Genutzt von:** Toast component
   - **Fallback:** Noop-Implementierung (toast.show = () => {}, etc.)

   ### ✅ useBreakpoint (packages/ui/src/hooks/useBreakpoint.ts)
   - **Status:** Bereits SSR-safe (nutzt `window.matchMedia` mit guard)
   - **Keine Änderung nötig**

   ## Fix Pattern

   ```typescript
   export function useTheme() {
     const context = useContext(ThemeContext);

     // SSR-safe fallback
     if (context === null && typeof window === 'undefined') {
       return DEFAULT_THEME;
     }

     // Client-side error
     if (context === null) {
       throw new Error('useTheme must be used within ThemeProvider');
     }

     return context;
   }
   ```

   ## Root Cause

   Die Hooks prüfen zwar auf `context === null`, aber werfen sofort einen Error. Im SSR gibt es keinen Provider, daher ist `context` immer `null` und der Build schlägt fehl.

   **Lösung:** Unterscheide zwischen SSR (typeof window === 'undefined') und Client-Side. Im SSR gebe Default-Werte zurück, im Client wirf Error falls Provider fehlt.
   EOF
   ```

   **Wichtig:** Passe die Liste basierend auf deinen tatsächlichen Findings an. Nutze `rg` Output als Quelle der Wahrheit.

4. **Code Review durchführen**

   Teile `AFFECTED_HOOKS.md` mit 2+ Team-Mitgliedern:
   ```bash
   git add docs/milestones/AFFECTED_HOOKS.md
   git commit -m "docs: document affected hooks for SSR bug #57"
   git push origin docs/milestone-fidus-ui-v2

   # Optional: Als GitHub Gist sharen für schnelles Review
   gh gist create docs/milestones/AFFECTED_HOOKS.md --public
   ```

**Definition of Done:**
- [ ] `docs/milestones/AFFECTED_HOOKS.md` existiert mit Liste aller betroffenen Hooks
- [ ] Jeder Hook hat:
  - Dateipfad + Zeilennummer
  - Beschreibung des Problems
  - Vorgeschlagenen Fallback-Wert
  - Liste der betroffenen Komponenten
- [ ] Root Cause erklärt (max. 3 Sätze)
- [ ] Fix Pattern mit Code-Beispiel dokumentiert
- [ ] Code Review von 2+ Personen abgeschlossen

**Verifikation:**
```bash
# 1. Datei existiert
test -f docs/milestones/AFFECTED_HOOKS.md && echo "✅ File exists"

# 2. Mindestens 3 Hooks dokumentiert
grep -c "^### ❌" docs/milestones/AFFECTED_HOOKS.md
# Erwartung: >= 3

# 3. Alle Hooks haben Zeilennummern
grep -c "**Zeile:**" docs/milestones/AFFECTED_HOOKS.md
# Erwartung: >= 3

# 4. Fix Pattern vorhanden
grep -q "typeof window === 'undefined'" docs/milestones/AFFECTED_HOOKS.md && echo "✅ Fix pattern documented"
```

**Troubleshooting:**

**Problem:** `rg` findet zu viele False Positives (z.B. in node_modules)
**Lösung:** Begrenze Suche auf `src/` und excludiere Tests:
```bash
rg -n "useContext" packages/ui/src/ --type ts --type tsx --glob '!**/*.test.ts' --glob '!**/*.spec.tsx'
```

**Problem:** Unklar, welcher Fallback-Wert sinnvoll ist
**Lösung:** Schaue in die Context-Definition (z.B. `ThemeContext.ts`) und prüfe, ob ein `DEFAULT_THEME` bereits exportiert wird. Falls nicht, definiere einen in diesem Task.

**Problem:** Hook wird von 20+ Komponenten genutzt - Liste ist zu lang
**Lösung:** Nutze `rg` um Nutzung zu zählen:
```bash
rg "import.*useTheme" packages/ui/src/ --count-matches
```
Schreibe nur "ca. X Komponenten" statt alle zu listen.

---

### Task 1.2.1: Implement SSR-Safe Context Hooks

**Ziel:** SSR-safe Pattern auf alle betroffenen Hooks anwenden.

**Input/Voraussetzungen:**
- Task 1.1.2 abgeschlossen (`docs/milestones/AFFECTED_HOOKS.md` existiert)
- Liste der betroffenen Hooks bekannt
- Reproduktion aus Task 1.1.1 (`test-apps/ssr-repro/`)

**Schritt-für-Schritt Anleitung:**

1. **useTheme Hook patchen**

   Öffne `packages/ui/src/hooks/useTheme.ts`:
   ```typescript
   import { useContext } from 'react';
   import { ThemeContext } from '../context/ThemeContext';
   import { DEFAULT_THEME } from '../theme/default';

   /**
    * Hook to access current theme.
    *
    * @returns Theme object with colors, spacing, typography
    *
    * @remarks
    * - **SSR-safe:** Returns DEFAULT_THEME during server-side rendering
    * - **Client-side:** Throws error if used outside ThemeProvider
    *
    * @example
    * ```tsx
    * function MyComponent() {
    *   const theme = useTheme();
    *   return <div style={{ color: theme.colors.primary }}>Hello</div>;
    * }
    * ```
    */
   export function useTheme() {
     const context = useContext(ThemeContext);

     // SSR-safe fallback: During server-side rendering, no Provider exists
     if (context === null && typeof window === 'undefined') {
       return DEFAULT_THEME;
     }

     // Client-side error: Provider is missing
     if (context === null) {
       throw new Error(
         'useTheme must be used within ThemeProvider.\n\n' +
         'Wrap your app with <FidusUIProvider> or <ThemeProvider>:\n\n' +
         '  import { FidusUIProvider } from "@fidus/ui";\n' +
         '  <FidusUIProvider>{children}</FidusUIProvider>'
       );
     }

     return context;
   }
   ```

   **Warum `typeof window === 'undefined'`?** Dies ist die Standard-Methode, um SSR zu erkennen. In Node.js (SSR) existiert `window` nicht, im Browser schon.

   **Wichtig:** Reihenfolge der Checks ist entscheidend:
   1. Erst SSR prüfen → Default zurückgeben
   2. Dann Client prüfen → Error werfen falls Provider fehlt

2. **useConfig Hook patchen**

   Falls `DEFAULT_CONFIG` noch nicht existiert, erstelle ihn in `packages/ui/src/config/default.ts`:
   ```typescript
   // packages/ui/src/config/default.ts
   import { Config } from './types';

   export const DEFAULT_CONFIG: Config = {
     locale: 'de',
     dir: 'ltr',
     dateFormat: 'DD.MM.YYYY',
   };
   ```

   Dann patche `packages/ui/src/hooks/useConfig.ts`:
   ```typescript
   import { useContext } from 'react';
   import { ConfigContext } from '../context/ConfigContext';
   import { DEFAULT_CONFIG } from '../config/default';

   export function useConfig() {
     const context = useContext(ConfigContext);

     // SSR fallback
     if (context === null && typeof window === 'undefined') {
       return DEFAULT_CONFIG;
     }

     if (context === null) {
       throw new Error('useConfig must be used within ConfigProvider');
     }

     return context;
   }
   ```

3. **useToastController Hook patchen**

   Für Toasts brauchen wir eine Noop-Implementierung (Funktionen, die nichts tun):
   ```typescript
   // packages/ui/src/hooks/useToast.ts
   import { useContext } from 'react';
   import { ToastContext } from '../context/ToastContext';
   import type { ToastController } from '../types';

   const NOOP_TOAST_CONTROLLER: ToastController = {
     show: () => {},
     hide: () => {},
     hideAll: () => {},
   };

   export function useToastController() {
     const context = useContext(ToastContext);

     // SSR fallback: Return noop controller
     if (context === null && typeof window === 'undefined') {
       return NOOP_TOAST_CONTROLLER;
     }

     if (context === null) {
       throw new Error('useToastController must be used within ToastProvider');
     }

     return context;
   }
   ```

   **Warum Noop?** Toasts sind UI-Feedback und im SSR nicht sinnvoll. Wir geben Funktionen zurück, die nichts tun, damit Code nicht crasht.

4. **Alle weiteren Hooks aus AFFECTED_HOOKS.md patchen**

   Wiederhole das Pattern für jeden Hook aus `docs/milestones/AFFECTED_HOOKS.md`:
   - Finde Datei (z.B. `packages/ui/src/hooks/useXYZ.ts`)
   - Füge SSR-Fallback hinzu
   - Definiere sinnvollen DEFAULT-Wert
   - Verbessere Error Message

5. **Unit Tests durchführen**
   ```bash
   cd packages/ui
   pnpm test
   ```

   **Erwartung:** Alle bestehenden Tests laufen durch. Falls Tests fehlschlagen, prüfe:
   - Sind Tests auf altes Verhalten (sofortiger Error) angewiesen?
   - Müssen Test-Mocks angepasst werden?

6. **SSR Build Test**
   ```bash
   cd test-apps/ssr-repro
   rm -rf .next
   pnpm build
   ```

   **Erwartung:** Build läuft **erfolgreich** durch ohne `useContext` Errors.

7. **Hydration Check im Browser**
   ```bash
   pnpm dev
   # Öffne http://localhost:3000
   ```

   Öffne Browser Console (F12) und prüfe auf Hydration Warnings:
   ```
   ❌ Warning: Text content did not match. Server: "..." Client: "..."
   ❌ Warning: An error occurred during hydration...
   ```

   **Falls Warnings auftreten:** Der Default-Wert im SSR ist anders als der Wert im Client. Nutze `useEffect` für client-only Logik:
   ```typescript
   const [isClient, setIsClient] = useState(false);
   useEffect(() => setIsClient(true), []);

   if (!isClient) return <div>Loading...</div>;
   ```

**Definition of Done:**
- [ ] Alle Hooks aus `AFFECTED_HOOKS.md` haben SSR-Fallbacks nach dem Pattern:
  ```typescript
  if (context === null && typeof window === 'undefined') {
    return DEFAULT_VALUE;
  }
  ```
- [ ] DEFAULT-Werte sind für jeden Hook sinnvoll definiert
- [ ] Unit Tests laufen durch (`pnpm test` in `packages/ui`)
- [ ] `next build` in `test-apps/ssr-repro/` **erfolgreich**
- [ ] **Keine** Hydration Warnings im Browser Console
- [ ] Code Review von Lead Developer abgeschlossen

**Verifikation:**
```bash
# 1. Build Test
cd test-apps/ssr-repro
pnpm build
# Erwartung: Exit Code 0, "Compiled successfully"

# 2. Unit Tests
cd ../../packages/ui
pnpm test
# Erwartung: All tests pass

# 3. Prüfe ob Pattern angewendet wurde
rg "typeof window === 'undefined'" packages/ui/src/hooks/ --count-matches
# Erwartung: Mindestens 3 Matches (Anzahl betroffener Hooks)

# 4. Dev Server + Browser Test
cd ../../test-apps/ssr-repro
pnpm dev
# Manuell: Öffne http://localhost:3000, öffne Console (F12)
# Erwartung: Keine Warnings mit "hydration" oder "mismatch"
```

**Troubleshooting:**

**Problem:** `next build` schlägt weiterhin fehl mit "Cannot read property 'useContext' of null"
**Lösung:** Ein Hook wurde übersehen. Prüfe Stack Trace erneut:
```bash
pnpm build 2>&1 | grep -A 10 "useContext"
```
Füge den fehlenden Hook zu `AFFECTED_HOOKS.md` hinzu und patche ihn.

**Problem:** Hydration Mismatch - Server/Client HTML unterschiedlich
**Lösung:** Der Default-Wert im SSR unterscheidet sich vom Client-Wert. Beispiel:
```typescript
// ❌ Problem: Server rendert DEFAULT_THEME.colors.primary = '#000'
//              Client nutzt ThemeProvider mit colors.primary = '#007bff'

// ✅ Lösung: Nutze useEffect für client-only Logik
function MyComponent() {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Im SSR und beim ersten Client-Render gleiches HTML
  if (!mounted) {
    return <div style={{ color: DEFAULT_THEME.colors.primary }}>Text</div>;
  }

  // Nach Hydration nutze echten Theme-Wert
  return <div style={{ color: theme.colors.primary }}>Text</div>;
}
```

**Problem:** Unit Tests schlagen fehl mit "ReferenceError: window is not defined"
**Lösung:** Tests laufen in Node.js (wie SSR). Mocke `window` in Tests:
```typescript
// In Test-Setup (setupTests.ts)
global.window = {} as any;
```

---

### Task 1.2.2: Add SSR Tests to CI/CD

**Ziel:** SSR-Kompatibilität automatisiert in CI/CD testen, damit Regressionen erkannt werden.

**Input/Voraussetzungen:**
- Task 1.2.1 abgeschlossen (alle Hooks SSR-safe)
- `test-apps/ssr-repro/` läuft erfolgreich durch
- Zugriff auf `.github/workflows/`

**Schritt-für-Schritt Anleitung:**

1. **SSR Test Suite in packages/ui erstellen**

   Erstelle `packages/ui/src/__tests__/ssr.test.tsx`:
   ```typescript
   /**
    * @jest-environment node
    */
   import React from 'react';
   import { renderToString } from 'react-dom/server';
   import {
     Button,
     Stack,
     Alert,
     DetailCard,
     TextInput,
     Modal,
   } from '../index';

   describe('SSR Compatibility', () => {
     it('Button renders without errors', () => {
       const html = renderToString(<Button>Click me</Button>);
       expect(html).toContain('Click me');
       expect(html).not.toContain('undefined');
     });

     it('Stack renders without errors', () => {
       const html = renderToString(
         <Stack direction="vertical" spacing={2}>
           <div>Item 1</div>
           <div>Item 2</div>
         </Stack>
       );
       expect(html).toContain('Item 1');
       expect(html).toContain('Item 2');
     });

     it('Alert renders without errors', () => {
       const html = renderToString(
         <Alert type="info">Test Alert</Alert>
       );
       expect(html).toContain('Test Alert');
     });

     it('DetailCard renders without errors', () => {
       const html = renderToString(
         <DetailCard
           title="Test Card"
           description="Test Description"
         />
       );
       expect(html).toContain('Test Card');
       expect(html).toContain('Test Description');
     });

     it('TextInput renders without errors', () => {
       const html = renderToString(
         <TextInput label="Name" placeholder="Enter name" />
       );
       expect(html).toContain('Name');
     });

     it('Modal renders without errors (closed state)', () => {
       const html = renderToString(
         <Modal isOpen={false} onClose={() => {}}>
           Modal Content
         </Modal>
       );
       // Modal should not render when closed
       expect(html).toBe('');
     });

     it('All components render in component list', () => {
       const components = [
         <Button key="1">Button</Button>,
         <Stack key="2"><div>Stack</div></Stack>,
         <Alert key="3" type="success">Alert</Alert>,
       ];

       const html = renderToString(<>{components}</>);
       expect(html).toContain('Button');
       expect(html).toContain('Stack');
       expect(html).toContain('Alert');
     });
   });
   ```

   **Wichtig:** `@jest-environment node` sorgt dafür, dass Tests in Node.js (wie SSR) laufen, nicht im jsdom (Browser-Simulation).

2. **Test ausführen lokal**
   ```bash
   cd packages/ui
   pnpm test src/__tests__/ssr.test.tsx
   ```

   **Erwartung:** Alle Tests laufen durch. Falls nicht:
   - Prüfe, ob `renderToString` korrekt importiert ist (`react-dom/server`)
   - Prüfe, ob alle Komponenten exportiert sind in `src/index.ts`

3. **GitHub Actions Workflow erweitern**

   Öffne `.github/workflows/test.yml` und füge SSR Test Job hinzu:
   ```yaml
   name: Test

   on:
     push:
       branches: [main]
     pull_request:
       branches: [main]

   jobs:
     # ... bestehende Jobs (lint, typecheck, etc.)

     test-ssr:
       name: SSR Compatibility Tests
       runs-on: ubuntu-latest

       steps:
         - name: Checkout code
           uses: actions/checkout@v4

         - name: Setup Node.js
           uses: actions/setup-node@v4
           with:
             node-version: '18'
             cache: 'pnpm'

         - name: Install pnpm
           uses: pnpm/action-setup@v2
           with:
             version: 8

         - name: Install dependencies
           run: pnpm install --frozen-lockfile

         - name: Run SSR tests
           run: |
             cd packages/ui
             pnpm test src/__tests__/ssr.test.tsx --ci --coverage

         - name: Build test app
           run: |
             cd test-apps/ssr-repro
             pnpm build

         - name: Check for build artifacts
           run: |
             test -d test-apps/ssr-repro/.next && echo "✅ Build successful"
   ```

   **Warum separater Job?** SSR Tests sind unabhängig von Unit Tests und können parallel laufen (schnellere CI).

4. **CI Failure Message konfigurieren**

   Füge folgendes Script zu `packages/ui/package.json` hinzu:
   ```json
   {
     "scripts": {
       "test:ssr": "jest src/__tests__/ssr.test.tsx",
       "test:ssr:ci": "npm run test:ssr -- --ci --coverage || (echo '❌ SSR tests failed. Components are not server-side rendering compatible.' && exit 1)"
     }
   }
   ```

5. **Workflow testen mit PR**
   ```bash
   git add .github/workflows/test.yml packages/ui/src/__tests__/ssr.test.tsx
   git commit -m "ci: add SSR compatibility tests to CI/CD"
   git push origin docs/milestone-fidus-ui-v2

   # Erstelle Draft PR um CI zu triggern
   gh pr create --draft --title "WIP: SSR Tests" --body "Testing CI workflow"
   ```

   **Erwartung:** GitHub Actions läuft und `test-ssr` Job ist grün.

**Definition of Done:**
- [ ] SSR Test Suite in `packages/ui/src/__tests__/ssr.test.tsx` mit Tests für alle kritischen Komponenten
- [ ] Tests verwenden `renderToString()` aus `react-dom/server`
- [ ] GitHub Actions Job `test-ssr` hinzugefügt zu `.github/workflows/test.yml`
- [ ] CI schlägt fehl mit klarer Fehlermeldung wenn SSR Tests fehlschlagen
- [ ] Test Execution Time < 2 Minuten
- [ ] Tests auf PR erfolgreich durchgelaufen

**Verifikation:**
```bash
# 1. Lokale Tests
cd packages/ui
pnpm test src/__tests__/ssr.test.tsx
# Erwartung: All tests pass in < 10 Sekunden

# 2. Test-App Build
cd ../../test-apps/ssr-repro
pnpm build
# Erwartung: Exit Code 0

# 3. CI Status prüfen (nach Push)
gh pr checks
# Erwartung: test-ssr job: ✅ pass

# 4. Test Coverage
cd ../../packages/ui
pnpm test src/__tests__/ssr.test.tsx -- --coverage
# Erwartung: Coverage report zeigt SSR-relevante Hooks gecovert
```

**Troubleshooting:**

**Problem:** Tests schlagen fehl mit "ReferenceError: window is not defined" in Komponenten
**Lösung:** Eine Komponente nutzt `window` ohne Guard. Finde Stelle mit:
```bash
rg "window\." packages/ui/src/ --type ts --type tsx | grep -v "typeof window"
```
Füge Guard hinzu: `if (typeof window !== 'undefined') { ... }`

**Problem:** `renderToString()` wirft Error "Hooks can only be called inside function components"
**Lösung:** Eine Komponente nutzt Hooks außerhalb des Component Body. Prüfe Hook-Aufrufe:
```typescript
// ❌ Falsch
export function MyComponent() {
  if (condition) {
    const value = useHook(); // Hook in Conditional!
  }
}

// ✅ Richtig
export function MyComponent() {
  const value = useHook();
  if (condition) {
    // Nutze value hier
  }
}
```

**Problem:** CI Job dauert > 5 Minuten
**Lösung:** pnpm install cached nicht korrekt. Prüfe `cache: 'pnpm'` in `setup-node` Action. Alternativ nutze `pnpm/action-setup` mit Cache.

**Problem:** Test-App Build schlägt in CI fehl mit "Module not found: @fidus/ui"
**Lösung:** Workspace-Dependencies werden nicht aufgelöst. Führe `pnpm build` in `packages/ui` **vor** Test-App Build aus:
```yaml
- name: Build @fidus/ui
  run: |
    cd packages/ui
    pnpm build

- name: Build test app
  run: |
    cd test-apps/ssr-repro
    pnpm build
```

---

## Success Criteria für Phase 1

### Must Have (Blocking)
- [ ] Alle Tasks 1.1.1 - 1.2.2 abgeschlossen (alle DoDs erfüllt)
- [ ] `next build` in `test-apps/ssr-repro/` läuft **ohne Errors** durch
- [ ] Alle Context Hooks haben SSR-safe Fallbacks mit `typeof window === 'undefined'` Check
- [ ] Keine Hydration Mismatches im Browser Console
- [ ] SSR Tests in CI/CD grün (≥ 5 Komponenten getestet)
- [ ] Unit Tests laufen durch (`packages/ui`)

### Should Have
- [ ] Error Messages verbessert (klare Anleitung bei fehlendem Provider)
- [ ] `docs/milestones/AFFECTED_HOOKS.md` dokumentiert alle Änderungen
- [ ] Code Review von 2+ Entwicklern abgeschlossen
- [ ] Keine neuen TypeScript Errors

### Nice to Have
- [ ] Performance: SSR Render Time < 100ms für Test Page
- [ ] Dokumentation: JSDoc für alle gepatchten Hooks
- [ ] Backward Compatibility: Keine Breaking Changes für bestehende Nutzer

---

## Nächste Schritte

Nach Abschluss von Phase 1:

1. **Release v2.0.0-alpha.1** erstellen:
   ```bash
   cd packages/ui
   pnpm changeset
   # Select: @fidus/ui - patch
   # Summary: "fix: SSR compatibility for context hooks (#57)"
   pnpm changeset version
   pnpm build
   pnpm publish --tag alpha
   ```

2. **Issue #57 aktualisieren** mit:
   - Link zu Commit/PR
   - Hinweis auf alpha Release
   - Bitte um Testing durch Reporter

3. **Phase 2 starten** ([PHASE_2_HIGH_PRIORITY_FEATURES.md](./PHASE_2_HIGH_PRIORITY_FEATURES.md)):
   - Task 2.1.1: Provider Dokumentation
   - Task 2.1.2: Setup Beispiele
   - Dependencies: Blockiert bis Phase 1 komplett abgeschlossen

4. **Stakeholder Update** (Product Team, Frontend Team):
   - "✅ Phase 1 Complete: SSR Bug fixed"
   - "📦 Alpha release available for testing"
   - "🚀 Phase 2 starts: Documentation & Examples"

---

**Version:** 1.0
**Letzte Aktualisierung:** 2025-01-10
**Maintainer:** Frontend Team
