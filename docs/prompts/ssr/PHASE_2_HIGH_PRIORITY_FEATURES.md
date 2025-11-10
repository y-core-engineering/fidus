# Phase 2: High Priority Features - Implementierungs-Prompt

## Übersicht

- **Ziel:** Vollständige SSR/SSG-Unterstützung dokumentieren, Setup-Guide erstellen und Developer Experience verbessern
- **Related Issues:** [#59](https://github.com/y-core-engineering/fidus/issues/59) (SSR/SSG Support), [#60](https://github.com/y-core-engineering/fidus/issues/60) (Provider Documentation)
- **Dependencies:** **Blockiert durch Phase 1** - Task 1.2.1 (SSR-Safe Context Hooks) muss abgeschlossen sein
- **Blocks:** Keine Hard-Blocker, aber Phase 3 profitiert von vollständiger Dokumentation

## Kontext für den Developer

Phase 1 hat den kritischen SSR-Bug behoben, aber die Library ist noch nicht produktionsreif für SSR/SSG. Es fehlt:
1. **Klarheit über Provider-Setup** - Ist `FidusUIProvider` optional oder required? Wie wird er konfiguriert?
2. **Setup-Dokumentation** - Entwickler wissen nicht, wie sie die Library in Next.js 14, Vite oder anderen Frameworks einbinden
3. **Error Messages** - Cryptische Fehlermeldungen erschweren Debugging
4. **Test Coverage** - Keine Garantie, dass alle Komponenten SSR-kompatibel sind

Diese Phase liefert die **notwendige Dokumentation und Tests**, damit Entwickler @fidus/ui produktiv und fehlerfrei in SSR-Projekten einsetzen können. Der Fokus liegt auf **Developer Experience** - klare Anleitungen, hilfreiche Error Messages und funktionierende Beispiele.

**Warum ist das wichtig?** Ohne klare Dokumentation werden Nutzer Trial-and-Error betreiben, Support-Anfragen häufen sich und die Library wirkt unausgereift. Phase 2 macht @fidus/ui zu einer "production-ready SSR Library".

## Tasks in dieser Phase

### Task 2.1.1: Document Provider Requirements

**Ziel:** Klarheit schaffen, ob und wie `FidusUIProvider` genutzt werden muss.

**Input/Voraussetzungen:**
- Phase 1 abgeschlossen (Task 1.2.1 - SSR-safe Hooks implementiert)
- Zugriff auf `packages/ui/src/provider/` und `packages/ui/README.md`
- Entscheidung getroffen: Ist Provider required oder optional?

**Schritt-für-Schritt Anleitung:**

1. **Provider-Verhalten definieren**

   **Frage zu klären:** Ist `FidusUIProvider` **required** oder **optional**?

   **Option A: Required** (empfohlen für konsistentes Verhalten)
   - Alle Komponenten werfen Error ohne Provider (auch im Client)
   - Nutzer müssen Provider in Root Layout wrappen
   - **Vorteil:** Klarheit, keine "works sometimes"-Fälle
   - **Nachteil:** Breaking Change für bestehende Nutzer

   **Option B: Optional** (graceful degradation)
   - Komponenten funktionieren ohne Provider mit Default-Werten
   - Provider nur nötig für Customization (Theme, Locale, etc.)
   - **Vorteil:** Backward compatible
   - **Nachteil:** Unklarheit, wann Provider nötig ist

   **Empfehlung für dieses Projekt:** **Option B (Optional)** mit klaren Dokumentation, wann Provider empfohlen ist.

2. **Provider Props dokumentieren**

   Öffne `packages/ui/src/provider/FidusUIProvider.tsx` und definiere TypeScript Types:
   ```typescript
   // packages/ui/src/provider/FidusUIProvider.tsx
   import React from 'react';
   import { ThemeProvider } from '../context/ThemeContext';
   import { ConfigProvider } from '../context/ConfigContext';
   import { ToastProvider } from '../context/ToastContext';
   import type { Theme } from '../theme/types';
   import type { Config } from '../config/types';

   export interface FidusUIProviderProps {
     /**
      * Child components to wrap with providers
      */
     children: React.ReactNode;

     /**
      * Custom theme configuration
      * @default DEFAULT_THEME
      * @example
      * ```tsx
      * <FidusUIProvider theme={{ colors: { primary: '#007bff' } }}>
      * ```
      */
     theme?: Partial<Theme>;

     /**
      * Locale configuration (e.g., 'de', 'en', 'fr')
      * @default 'de'
      */
     locale?: string;

     /**
      * Text direction ('ltr' or 'rtl')
      * @default 'ltr'
      */
     dir?: 'ltr' | 'rtl';

     /**
      * Date format string
      * @default 'DD.MM.YYYY'
      */
     dateFormat?: string;
   }

   /**
    * Root provider for @fidus/ui components.
    *
    * Wraps your app with Theme, Config, and Toast contexts.
    * **Optional** - Components work with default values if no provider is present.
    *
    * @example
    * ```tsx
    * // app/layout.tsx (Next.js 14 App Router)
    * import { FidusUIProvider } from '@fidus/ui';
    *
    * export default function RootLayout({ children }) {
    *   return (
    *     <html lang="de">
    *       <body>
    *         <FidusUIProvider theme={{ colors: { primary: '#007bff' } }}>
    *           {children}
    *         </FidusUIProvider>
    *       </body>
    *     </html>
    *   );
    * }
    * ```
    */
   export function FidusUIProvider({
     children,
     theme,
     locale = 'de',
     dir = 'ltr',
     dateFormat = 'DD.MM.YYYY',
   }: FidusUIProviderProps) {
     const config: Config = { locale, dir, dateFormat };

     return (
       <ThemeProvider theme={theme}>
         <ConfigProvider config={config}>
           <ToastProvider>
             {children}
           </ToastProvider>
         </ConfigProvider>
       </ThemeProvider>
     );
   }
   ```

   **Wichtig:** JSDoc-Kommentare werden von TypeScript IDEs (VS Code) angezeigt und helfen Entwicklern beim Setup.

3. **README.md Setup-Sektion hinzufügen**

   Öffne `packages/ui/README.md` und füge nach der Installation-Sektion hinzu:
   ```markdown
   ## Setup

   ### Quick Start (Optional Provider)

   The simplest way to use @fidus/ui is to import components directly:

   ```tsx
   import { Button, Stack, Alert } from '@fidus/ui';

   function App() {
     return (
       <Stack direction="vertical" spacing={4}>
         <Button variant="primary">Click me</Button>
         <Alert type="info">Hello World</Alert>
       </Stack>
     );
   }
   ```

   All components work out-of-the-box with sensible defaults (no provider required).

   ### With Provider (Recommended for Customization)

   Wrap your app with `FidusUIProvider` to customize theme, locale, and other settings:

   #### Next.js 14 App Router

   ```tsx
   // app/layout.tsx
   import { FidusUIProvider } from '@fidus/ui';
   import type { Metadata } from 'next';

   export const metadata: Metadata = {
     title: 'My App',
   };

   export default function RootLayout({
     children,
   }: {
     children: React.ReactNode;
   }) {
     return (
       <html lang="de">
         <body>
           <FidusUIProvider
             theme={{
               colors: {
                 primary: '#007bff',
                 secondary: '#6c757d',
               },
             }}
             locale="de"
           >
             {children}
           </FidusUIProvider>
         </body>
       </html>
     );
   }
   ```

   #### Next.js Pages Router

   ```tsx
   // pages/_app.tsx
   import { FidusUIProvider } from '@fidus/ui';
   import type { AppProps } from 'next/app';

   export default function App({ Component, pageProps }: AppProps) {
     return (
       <FidusUIProvider>
         <Component {...pageProps} />
       </FidusUIProvider>
     );
   }
   ```

   #### Vite + React

   ```tsx
   // src/main.tsx
   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import { FidusUIProvider } from '@fidus/ui';
   import App from './App';

   ReactDOM.createRoot(document.getElementById('root')!).render(
     <React.StrictMode>
       <FidusUIProvider>
         <App />
       </FidusUIProvider>
     </React.StrictMode>
   );
   ```

   ### Provider Props

   | Prop | Type | Default | Description |
   |------|------|---------|-------------|
   | `theme` | `Partial<Theme>` | `DEFAULT_THEME` | Custom theme configuration (colors, spacing, typography) |
   | `locale` | `string` | `'de'` | Locale for date/number formatting (e.g., 'en', 'fr') |
   | `dir` | `'ltr' \| 'rtl'` | `'ltr'` | Text direction (for RTL languages like Arabic) |
   | `dateFormat` | `string` | `'DD.MM.YYYY'` | Date format string |

   ### When is the Provider Required?

   The provider is **optional** but **recommended** if you need:
   - ✅ Custom theme (colors, fonts, spacing)
   - ✅ Locale/i18n support
   - ✅ Toast notifications
   - ✅ Consistent configuration across components

   Without provider, components use default values and work in both SSR and CSR.

   ### Migration from v1.x

   If you're upgrading from v1.x, no changes are required. Components remain backward compatible.
   ```

4. **TypeScript Types exportieren**

   Stelle sicher, dass `FidusUIProviderProps` exportiert wird:
   ```typescript
   // packages/ui/src/index.ts
   export { FidusUIProvider } from './provider/FidusUIProvider';
   export type { FidusUIProviderProps } from './provider/FidusUIProvider';
   export type { Theme } from './theme/types';
   export type { Config } from './config/types';
   ```

5. **Peer Review**

   Teile README-Änderungen mit Product Team und 2+ Entwicklern:
   ```bash
   git add packages/ui/README.md packages/ui/src/provider/ packages/ui/src/index.ts
   git commit -m "docs: document FidusUIProvider setup and props (#60)"
   git push origin docs/milestone-fidus-ui-v2

   # Review Request
   gh pr comment --body "🔍 **Review Request:** Provider-Dokumentation hinzugefügt. Bitte prüfen:
   - Ist Setup-Anleitung klar verständlich?
   - Fehlen wichtige Informationen?
   - TypeScript Types korrekt?"
   ```

**Definition of Done:**
- [ ] Provider-Verhalten dokumentiert (required vs. optional)
- [ ] `FidusUIProviderProps` TypeScript Interface mit JSDoc
- [ ] README.md hat "Setup"-Sektion mit Beispielen für:
  - Next.js 14 App Router
  - Next.js Pages Router
  - Vite + React
- [ ] Provider Props in Tabelle dokumentiert
- [ ] "When is Provider required?" Sektion erklärt Use Cases
- [ ] Migration Guide für v1.x → v2.x
- [ ] Types exportiert in `src/index.ts`
- [ ] Peer Review von Product Team + 2 Entwicklern

**Verifikation:**
```bash
# 1. README hat Setup-Sektion
grep -q "## Setup" packages/ui/README.md && echo "✅ Setup section exists"

# 2. Alle Frameworks dokumentiert
grep -c "Next.js\|Vite" packages/ui/README.md
# Erwartung: >= 3 Matches

# 3. Types exportiert
grep "export.*FidusUIProviderProps" packages/ui/src/index.ts && echo "✅ Types exported"

# 4. JSDoc vorhanden
grep -c "@param\|@default\|@example" packages/ui/src/provider/FidusUIProvider.tsx
# Erwartung: >= 5 (mindestens 1 pro Prop)
```

**Troubleshooting:**

**Problem:** Unklar, ob Provider required oder optional sein soll
**Lösung:** Diskutiere mit Product Team:
- **Required:** Klarere API, aber Breaking Change
- **Optional:** Backward compatible, aber komplexere Dokumentation
Empfehlung: **Optional** mit klarer Dokumentation, wann empfohlen.

**Problem:** Zu viele Props - unübersichtlich
**Lösung:** Gruppiere Props in Sub-Objekte:
```typescript
interface FidusUIProviderProps {
  theme?: Partial<Theme>;
  config?: Partial<Config>; // Statt locale, dir, dateFormat einzeln
}
```

---

### Task 2.1.2: Create Interactive Setup Examples

**Ziel:** Funktionierende Beispielprojekte erstellen, die Entwickler als Referenz nutzen können.

**Input/Voraussetzungen:**
- Task 2.1.1 abgeschlossen (Provider dokumentiert)
- `test-apps/ssr-repro/` existiert bereits (aus Phase 1)

**Schritt-für-Schritt Anleitung:**

1. **Example-Verzeichnis-Struktur erstellen**
   ```bash
   mkdir -p examples/nextjs-app-router
   mkdir -p examples/nextjs-pages-router
   mkdir -p examples/vite-react
   ```

2. **Next.js App Router Example**

   Nutze `test-apps/ssr-repro/` als Basis und erweitere:
   ```bash
   # Kopiere Basis-Setup
   cp -r test-apps/ssr-repro/* examples/nextjs-app-router/

   # Passe package.json an
   cat > examples/nextjs-app-router/package.json << 'EOF'
   {
     "name": "example-nextjs-app-router",
     "version": "0.1.0",
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
       "@types/react": "^18.3.0"
     }
   }
   EOF
   ```

   **Layout mit Provider** (`app/layout.tsx`):
   ```typescript
   import { FidusUIProvider } from '@fidus/ui';
   import type { Metadata } from 'next';
   import './globals.css';

   export const metadata: Metadata = {
     title: '@fidus/ui - Next.js 14 Example',
     description: 'Example app using @fidus/ui with Next.js 14 App Router',
   };

   export default function RootLayout({
     children,
   }: {
     children: React.ReactNode;
   }) {
     return (
       <html lang="de">
         <body>
           <FidusUIProvider
             theme={{
               colors: {
                 primary: '#007bff',
                 secondary: '#6c757d',
                 success: '#28a745',
                 danger: '#dc3545',
               },
             }}
             locale="de"
           >
             {children}
           </FidusUIProvider>
         </body>
       </html>
     );
   }
   ```

   **Demo Page** (`app/page.tsx`):
   ```typescript
   import {
     Button,
     Stack,
     Alert,
     DetailCard,
     TextInput,
     Modal,
   } from '@fidus/ui';
   import { useState } from 'react';

   export default function HomePage() {
     return (
       <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
         <h1>@fidus/ui Components Demo</h1>

         <Stack direction="vertical" spacing={6}>
           <section>
             <h2>Buttons</h2>
             <Stack direction="horizontal" spacing={2}>
               <Button variant="primary">Primary</Button>
               <Button variant="secondary">Secondary</Button>
               <Button variant="success">Success</Button>
               <Button variant="danger">Danger</Button>
             </Stack>
           </section>

           <section>
             <h2>Alerts</h2>
             <Stack direction="vertical" spacing={2}>
               <Alert type="info">This is an info alert</Alert>
               <Alert type="success">This is a success alert</Alert>
               <Alert type="warning">This is a warning alert</Alert>
               <Alert type="error">This is an error alert</Alert>
             </Stack>
           </section>

           <section>
             <h2>Form</h2>
             <Stack direction="vertical" spacing={3}>
               <TextInput label="Name" placeholder="Enter your name" />
               <TextInput label="Email" type="email" placeholder="name@example.com" />
               <Button variant="primary">Submit</Button>
             </Stack>
           </section>

           <section>
             <h2>Cards</h2>
             <DetailCard
               title="Example Card"
               description="This card demonstrates @fidus/ui styling"
             />
           </section>
         </Stack>
       </main>
     );
   }
   ```

   **README** (`examples/nextjs-app-router/README.md`):
   ```markdown
   # @fidus/ui - Next.js 14 App Router Example

   Example application demonstrating @fidus/ui integration with Next.js 14 App Router.

   ## Features

   - ✅ Full SSR/SSG support
   - ✅ `FidusUIProvider` in root layout
   - ✅ Custom theme configuration
   - ✅ TypeScript support

   ## Setup

   ```bash
   # Install dependencies (from monorepo root)
   pnpm install

   # Run development server
   cd examples/nextjs-app-router
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

   ## Build for Production

   ```bash
   pnpm build
   pnpm start
   ```

   ## Key Files

   - `app/layout.tsx` - Root layout with `FidusUIProvider`
   - `app/page.tsx` - Demo page with all components
   - `next.config.js` - Next.js configuration
   ```

3. **Next.js Pages Router Example**

   Erstelle analog zu App Router, aber mit `pages/` Struktur:
   ```bash
   cd examples/nextjs-pages-router

   # _app.tsx statt layout.tsx
   mkdir -p pages
   cat > pages/_app.tsx << 'EOF'
   import { FidusUIProvider } from '@fidus/ui';
   import type { AppProps } from 'next/app';
   import '../styles/globals.css';

   export default function App({ Component, pageProps }: AppProps) {
     return (
       <FidusUIProvider
         theme={{
           colors: {
             primary: '#007bff',
           },
         }}
       >
         <Component {...pageProps} />
       </FidusUIProvider>
     );
   }
   EOF

   # Index page
   cat > pages/index.tsx << 'EOF'
   import { Button, Alert, Stack } from '@fidus/ui';

   export default function HomePage() {
     return (
       <main style={{ padding: '2rem' }}>
         <h1>Next.js Pages Router Example</h1>
         <Stack direction="vertical" spacing={4}>
           <Button variant="primary">Click me</Button>
           <Alert type="info">Using @fidus/ui with Pages Router</Alert>
         </Stack>
       </main>
     );
   }
   EOF
   ```

4. **Vite + React Example**

   ```bash
   cd examples/vite-react

   # package.json
   cat > package.json << 'EOF'
   {
     "name": "example-vite-react",
     "version": "0.1.0",
     "private": true,
     "scripts": {
       "dev": "vite",
       "build": "vite build",
       "preview": "vite preview"
     },
     "dependencies": {
       "react": "^18.3.0",
       "react-dom": "^18.3.0",
       "@fidus/ui": "workspace:*"
     },
     "devDependencies": {
       "@vitejs/plugin-react": "^4.2.0",
       "typescript": "^5.3.0",
       "vite": "^5.0.0"
     }
   }
   EOF

   # vite.config.ts
   cat > vite.config.ts << 'EOF'
   import { defineConfig } from 'vite';
   import react from '@vitejs/plugin-react';

   export default defineConfig({
     plugins: [react()],
   });
   EOF

   # main.tsx
   cat > src/main.tsx << 'EOF'
   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import { FidusUIProvider } from '@fidus/ui';
   import App from './App';

   ReactDOM.createRoot(document.getElementById('root')!).render(
     <React.StrictMode>
       <FidusUIProvider>
         <App />
       </FidusUIProvider>
     </React.StrictMode>
   );
   EOF

   # App.tsx
   cat > src/App.tsx << 'EOF'
   import { Button, Alert, Stack } from '@fidus/ui';

   function App() {
     return (
       <div style={{ padding: '2rem' }}>
         <h1>Vite + React Example</h1>
         <Stack direction="vertical" spacing={4}>
           <Button variant="primary">Click me</Button>
           <Alert type="success">Using @fidus/ui with Vite</Alert>
         </Stack>
       </div>
     );
   }

   export default App;
   EOF
   ```

5. **Alle Examples testen**
   ```bash
   # From monorepo root
   pnpm install

   # Test Next.js App Router
   cd examples/nextjs-app-router
   pnpm build && pnpm dev &

   # Test Pages Router
   cd ../nextjs-pages-router
   pnpm build && pnpm dev &

   # Test Vite
   cd ../vite-react
   pnpm build && pnpm preview &
   ```

6. **Link Examples in Main README**

   Füge in `packages/ui/README.md` hinzu:
   ```markdown
   ## Examples

   See working examples in the [examples/](../../examples) directory:

   - [Next.js 14 App Router](../../examples/nextjs-app-router) - Full SSR/SSG support
   - [Next.js Pages Router](../../examples/nextjs-pages-router) - Legacy Pages Router
   - [Vite + React](../../examples/vite-react) - Client-side rendering with Vite

   Each example includes:
   - Complete setup with `FidusUIProvider`
   - Component showcase
   - TypeScript configuration
   - Build scripts
   ```

**Definition of Done:**
- [ ] 3 funktionierende Example-Projekte in `examples/`:
  - `nextjs-app-router/`
  - `nextjs-pages-router/`
  - `vite-react/`
- [ ] Jedes Example hat:
  - `README.md` mit Setup/Run Instruktionen
  - Provider-Setup im Root Layout
  - Demo-Page mit 5+ Komponenten
  - Build + Dev Scripts funktionieren
- [ ] Examples in Main README verlinkt
- [ ] Alle Examples bauen erfolgreich (`pnpm build`)
- [ ] Dev Server startet ohne Errors (`pnpm dev`)

**Verifikation:**
```bash
# 1. Examples existieren
test -d examples/nextjs-app-router && echo "✅ App Router example"
test -d examples/nextjs-pages-router && echo "✅ Pages Router example"
test -d examples/vite-react && echo "✅ Vite example"

# 2. Alle haben README
find examples -name "README.md" | wc -l
# Erwartung: 3

# 3. Build Test
for dir in examples/*/; do
  echo "Testing $dir"
  cd "$dir"
  pnpm build || exit 1
  cd -
done
# Erwartung: Alle builds erfolgreich

# 4. Provider in allen Examples
rg "FidusUIProvider" examples/ --count-matches
# Erwartung: >= 3 (1 pro example)
```

**Troubleshooting:**

**Problem:** `pnpm build` schlägt fehl mit "Module not found: @fidus/ui"
**Lösung:** Workspace-Link nicht aufgelöst. Führe aus Root aus:
```bash
pnpm install --frozen-lockfile
```
Stelle sicher, dass `pnpm-workspace.yaml` `examples/*` inkludiert.

**Problem:** Dev Server startet, aber Komponenten nicht styled
**Lösung:** CSS Import fehlt. Füge hinzu:
```typescript
import '@fidus/ui/styles.css'; // Falls separate CSS-Datei existiert
```

**Problem:** TypeScript Errors in Examples
**Lösung:** `tsconfig.json` fehlt oder falsch konfiguriert. Kopiere aus `test-apps/ssr-repro/tsconfig.json`.

---

### Task 2.1.3: Improve Error Messages

**Ziel:** Kryptische `useContext` Errors durch hilfreiche Fehlermeldungen mit Setup-Anleitung ersetzen.

**Input/Voraussetzungen:**
- Task 2.1.1 abgeschlossen (Provider dokumentiert)
- Liste der Context Hooks aus Phase 1 (`docs/milestones/AFFECTED_HOOKS.md`)

**Schritt-für-Schritt Anleitung:**

1. **Error Message Template definieren**

   Erstelle `packages/ui/src/utils/errors.ts`:
   ```typescript
   /**
    * Generates a helpful error message when a component is used without required provider.
    *
    * @param componentName - Name of the component throwing the error
    * @param providerName - Name of the required provider
    * @param docsUrl - Optional URL to setup documentation
    */
   export function createProviderError(
     componentName: string,
     providerName: string,
     docsUrl?: string
   ): string {
     const setupExample = `
   // app/layout.tsx (Next.js 14)
   import { ${providerName} } from '@fidus/ui';

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           <${providerName}>
             {children}
           </${providerName}>
         </body>
       </html>
     );
   }
   `.trim();

     let message = `❌ FidusUI Error: <${componentName}> requires <${providerName}>\n\n`;
     message += `Add the provider to your root layout:\n\n`;
     message += setupExample;

     if (docsUrl) {
       message += `\n\n📚 See docs: ${docsUrl}`;
     } else {
       message += `\n\n📚 See docs: https://github.com/y-core-engineering/fidus/tree/main/packages/ui#setup`;
     }

     return message;
   }
   ```

2. **useTheme Hook Error verbessern**

   Öffne `packages/ui/src/hooks/useTheme.ts`:
   ```typescript
   import { useContext } from 'react';
   import { ThemeContext } from '../context/ThemeContext';
   import { DEFAULT_THEME } from '../theme/default';
   import { createProviderError } from '../utils/errors';

   export function useTheme() {
     const context = useContext(ThemeContext);

     // SSR fallback
     if (context === null && typeof window === 'undefined') {
       return DEFAULT_THEME;
     }

     // Client-side error with helpful message
     if (context === null) {
       throw new Error(
         createProviderError(
           'useTheme',
           'FidusUIProvider',
           'https://github.com/y-core-engineering/fidus/tree/main/packages/ui#setup'
         )
       );
     }

     return context;
   }
   ```

3. **Alle Context Hooks aktualisieren**

   Wende das Pattern auf alle Hooks aus `AFFECTED_HOOKS.md` an:
   ```bash
   # useConfig
   # packages/ui/src/hooks/useConfig.ts
   if (context === null) {
     throw new Error(createProviderError('useConfig', 'FidusUIProvider'));
   }

   # useToastController
   # packages/ui/src/hooks/useToast.ts
   if (context === null) {
     throw new Error(createProviderError('useToastController', 'FidusUIProvider'));
   }
   ```

4. **Component-spezifische Errors**

   Für Komponenten, die direkt Contexts nutzen (nicht über Hook):
   ```typescript
   // packages/ui/src/components/Button/Button.tsx
   import { useTheme } from '../../hooks/useTheme';

   export function Button({ children, variant = 'primary', ...props }) {
     const theme = useTheme(); // Error wird automatisch von Hook geworfen

     return (
       <button
         style={{
           backgroundColor: theme.colors[variant],
           ...
         }}
         {...props}
       >
         {children}
       </button>
     );
   }
   ```

   **Vorteil:** Error Messages sind zentral in Hooks definiert, nicht in jeder Komponente.

5. **Error Messages testen**

   Erstelle Test-Case ohne Provider:
   ```typescript
   // packages/ui/src/__tests__/errors.test.tsx
   import React from 'react';
   import { render } from '@testing-library/react';
   import { Button } from '../components/Button';

   describe('Error Messages', () => {
     // Suppress console.error for cleaner test output
     beforeAll(() => {
       jest.spyOn(console, 'error').mockImplementation(() => {});
     });

     afterAll(() => {
       jest.restoreAllMocks();
     });

     it('Button shows helpful error without Provider', () => {
       expect(() => {
         render(<Button>Click</Button>);
       }).toThrow(/FidusUIProvider/);

       expect(() => {
         render(<Button>Click</Button>);
       }).toThrow(/app\/layout\.tsx/);
     });

     it('Error includes setup code example', () => {
       try {
         render(<Button>Click</Button>);
       } catch (error) {
         expect(error.message).toContain('import { FidusUIProvider }');
         expect(error.message).toContain('<FidusUIProvider>');
       }
     });

     it('Error includes documentation link', () => {
       try {
         render(<Button>Click</Button>);
       } catch (error) {
         expect(error.message).toContain('See docs:');
         expect(error.message).toContain('https://');
       }
     });
   });
   ```

   Run tests:
   ```bash
   cd packages/ui
   pnpm test src/__tests__/errors.test.tsx
   ```

6. **Verify in Browser Console**

   Teste manuell ohne Provider:
   ```typescript
   // Temp test file: test-error.tsx
   import { Button } from '@fidus/ui';

   export default function TestPage() {
     return <Button>Test</Button>; // No Provider!
   }
   ```

   **Erwartete Console Output:**
   ```
   ❌ FidusUI Error: <useTheme> requires <FidusUIProvider>

   Add the provider to your root layout:

   // app/layout.tsx (Next.js 14)
   import { FidusUIProvider } from '@fidus/ui';

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           <FidusUIProvider>
             {children}
           </FidusUIProvider>
         </body>
       </html>
     );
   }

   📚 See docs: https://github.com/y-core-engineering/fidus/tree/main/packages/ui#setup
   ```

**Definition of Done:**
- [ ] `createProviderError()` Utility-Funktion in `src/utils/errors.ts`
- [ ] Alle Context Hooks nutzen `createProviderError()` für Error Messages
- [ ] Error Messages enthalten:
  - ❌ Emoji + klare Fehlerbeschreibung
  - Code-Beispiel mit Setup
  - Component/Hook Name
  - Link zur Dokumentation
- [ ] Tests verifizieren Error Messages
- [ ] Manual Browser Test durchgeführt (Error in Console sichtbar)
- [ ] Error Messages reviewed von 1+ Entwickler

**Verifikation:**
```bash
# 1. Utility existiert
test -f packages/ui/src/utils/errors.ts && echo "✅ Error utility exists"

# 2. Hooks nutzen Utility
rg "createProviderError" packages/ui/src/hooks/ --count-matches
# Erwartung: >= 3 (alle betroffenen Hooks)

# 3. Error Message Tests
pnpm test src/__tests__/errors.test.tsx
# Erwartung: All tests pass

# 4. Error enthält Setup-Anleitung
rg "app/layout.tsx" packages/ui/src/utils/errors.ts && echo "✅ Setup example included"
```

**Troubleshooting:**

**Problem:** Tests schlagen fehl mit "console.error called"
**Lösung:** React wirft Errors in Tests. Mocke `console.error`:
```typescript
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
```

**Problem:** Error Message zu lang (> 500 Zeichen)
**Lösung:** Kürze Setup-Beispiel:
```typescript
const setupExample = `<FidusUIProvider>{children}</FidusUIProvider>`;
```
Voller Beispiel nur in Docs, nicht in Error Message.

**Problem:** Error Message wird nicht angezeigt (silent failure)
**Lösung:** Prüfe, ob React Error Boundary Error abfängt. Teste ohne Error Boundary.

---

### Task 2.2.1: Add SSR Tests for All Components

**Ziel:** SSR-Kompatibilität für alle 20+ Komponenten systematisch testen.

**Input/Voraussetzungen:**
- Task 2.1.2 abgeschlossen (Setup Examples existieren)
- SSR Test Suite aus Phase 1 (Task 1.2.2)
- Liste aller Komponenten in `packages/ui/src/components/`

**Schritt-für-Schritt Anleitung:**

1. **Komponenten-Liste erstellen**
   ```bash
   cd packages/ui
   find src/components -name "index.ts" -o -name "*.tsx" | grep -v ".test.tsx" | sort
   ```

   Erstelle `docs/milestones/SSR_COMPONENT_CHECKLIST.md`:
   ```markdown
   # SSR Component Test Checklist

   **Status:** 🚧 In Progress

   ## Interactive Components
   - [ ] Button
   - [ ] Modal
   - [ ] Dropdown
   - [ ] Tabs
   - [ ] Tooltip
   - [ ] Popover

   ## Form Components
   - [ ] TextInput
   - [ ] Select
   - [ ] Checkbox
   - [ ] Radio
   - [ ] Switch
   - [ ] Textarea

   ## Layout Components
   - [ ] Stack
   - [ ] Grid
   - [ ] Container
   - [ ] Divider

   ## Feedback Components
   - [ ] Alert
   - [ ] Toast
   - [ ] Spinner
   - [ ] ProgressBar

   ## Data Display
   - [ ] DetailCard
   - [ ] Table
   - [ ] Badge
   - [ ] Avatar
   ```

2. **SSR Test Suite erweitern**

   Öffne `packages/ui/src/__tests__/ssr.test.tsx` (aus Phase 1) und füge Tests hinzu:
   ```typescript
   /**
    * @jest-environment node
    */
   import React from 'react';
   import { renderToString } from 'react-dom/server';
   import {
     // Interactive
     Button,
     Modal,
     Dropdown,
     Tabs,
     Tooltip,

     // Forms
     TextInput,
     Select,
     Checkbox,
     Radio,
     Switch,
     Textarea,

     // Layout
     Stack,
     Grid,
     Container,
     Divider,

     // Feedback
     Alert,
     Toast,
     Spinner,
     ProgressBar,

     // Data Display
     DetailCard,
     Table,
     Badge,
     Avatar,
   } from '../index';

   describe('SSR Compatibility - All Components', () => {
     describe('Interactive Components', () => {
       it('Button renders', () => {
         const html = renderToString(<Button>Click</Button>);
         expect(html).toContain('Click');
       });

       it('Modal renders (closed state)', () => {
         const html = renderToString(
           <Modal isOpen={false} onClose={() => {}}>Content</Modal>
         );
         expect(html).toBe(''); // Modal closed, no HTML
       });

       it('Modal renders (open state)', () => {
         const html = renderToString(
           <Modal isOpen={true} onClose={() => {}}>Content</Modal>
         );
         expect(html).toContain('Content');
       });

       it('Dropdown renders', () => {
         const html = renderToString(
           <Dropdown label="Select">
             <Dropdown.Item value="a">Option A</Dropdown.Item>
           </Dropdown>
         );
         expect(html).toContain('Select');
       });

       it('Tabs render', () => {
         const html = renderToString(
           <Tabs defaultValue="tab1">
             <Tabs.Tab value="tab1" label="Tab 1">Content 1</Tabs.Tab>
             <Tabs.Tab value="tab2" label="Tab 2">Content 2</Tabs.Tab>
           </Tabs>
         );
         expect(html).toContain('Tab 1');
         expect(html).toContain('Content 1');
       });
     });

     describe('Form Components', () => {
       it('TextInput renders', () => {
         const html = renderToString(
           <TextInput label="Name" placeholder="Enter name" />
         );
         expect(html).toContain('Name');
         expect(html).toContain('Enter name');
       });

       it('Select renders', () => {
         const html = renderToString(
           <Select label="Country">
             <option value="de">Germany</option>
             <option value="us">USA</option>
           </Select>
         );
         expect(html).toContain('Country');
         expect(html).toContain('Germany');
       });

       it('Checkbox renders', () => {
         const html = renderToString(
           <Checkbox label="Accept terms" />
         );
         expect(html).toContain('Accept terms');
       });

       it('Radio renders', () => {
         const html = renderToString(
           <Radio name="choice" value="a" label="Option A" />
         );
         expect(html).toContain('Option A');
       });

       it('Textarea renders', () => {
         const html = renderToString(
           <Textarea label="Message" placeholder="Enter message" />
         );
         expect(html).toContain('Message');
       });
     });

     describe('Layout Components', () => {
       it('Stack renders', () => {
         const html = renderToString(
           <Stack direction="vertical" spacing={2}>
             <div>Item 1</div>
             <div>Item 2</div>
           </Stack>
         );
         expect(html).toContain('Item 1');
         expect(html).toContain('Item 2');
       });

       it('Grid renders', () => {
         const html = renderToString(
           <Grid columns={2} gap={4}>
             <div>Cell 1</div>
             <div>Cell 2</div>
           </Grid>
         );
         expect(html).toContain('Cell 1');
       });

       it('Container renders', () => {
         const html = renderToString(
           <Container maxWidth="lg">Content</Container>
         );
         expect(html).toContain('Content');
       });
     });

     describe('Feedback Components', () => {
       it('Alert renders', () => {
         const html = renderToString(
           <Alert type="success">Success message</Alert>
         );
         expect(html).toContain('Success message');
       });

       it('Spinner renders', () => {
         const html = renderToString(<Spinner size="md" />);
         expect(html).toBeTruthy(); // Spinner hat HTML, auch wenn nur SVG
       });

       it('ProgressBar renders', () => {
         const html = renderToString(<ProgressBar value={50} />);
         expect(html).toContain('50'); // Value irgendwo im HTML
       });
     });

     describe('Data Display', () => {
       it('DetailCard renders', () => {
         const html = renderToString(
           <DetailCard title="Title" description="Description" />
         );
         expect(html).toContain('Title');
         expect(html).toContain('Description');
       });

       it('Badge renders', () => {
         const html = renderToString(<Badge>New</Badge>);
         expect(html).toContain('New');
       });

       it('Avatar renders', () => {
         const html = renderToString(
           <Avatar name="John Doe" src="/avatar.jpg" />
         );
         expect(html).toContain('John Doe'); // Als alt-text oder aria-label
       });
     });

     describe('Hydration Safety', () => {
       it('All components return deterministic HTML', () => {
         const render1 = renderToString(<Button>Test</Button>);
         const render2 = renderToString(<Button>Test</Button>);
         expect(render1).toBe(render2); // Identisches HTML → keine Hydration Mismatch
       });

       it('No random IDs in SSR output', () => {
         const html = renderToString(<TextInput label="Test" />);
         // Falls IDs generiert werden, müssen sie deterministisch sein
         const ids = html.match(/id="[^"]+"/g) || [];
         expect(ids.length).toBeGreaterThan(0); // ID sollte existieren
         // Re-render
         const html2 = renderToString(<TextInput label="Test" />);
         expect(html).toBe(html2); // Gleiche IDs bei Re-Render
       });
     });
   });
   ```

3. **Tests ausführen**
   ```bash
   cd packages/ui
   pnpm test src/__tests__/ssr.test.tsx --verbose
   ```

   **Erwartung:** Alle Tests laufen durch. Falls Tests fehlschlagen:
   - Prüfe Komponenten-Imports (sind alle exportiert in `src/index.ts`?)
   - Prüfe auf `window`/`document` Zugriffe ohne Guards
   - Prüfe auf nicht-deterministische Logik (random IDs, timestamps)

4. **Coverage Report generieren**
   ```bash
   pnpm test src/__tests__/ssr.test.tsx -- --coverage --coverageDirectory=coverage-ssr
   ```

   **Target:** ≥80% Coverage für SSR-relevante Paths.

5. **Checklist aktualisieren**

   Markiere getestete Komponenten in `SSR_COMPONENT_CHECKLIST.md`:
   ```markdown
   ## Interactive Components
   - [x] Button ✅
   - [x] Modal ✅
   - [x] Dropdown ✅
   ...
   ```

6. **Continuous Monitoring**

   Füge Script zu `packages/ui/package.json`:
   ```json
   {
     "scripts": {
       "test:ssr": "jest src/__tests__/ssr.test.tsx",
       "test:ssr:watch": "jest src/__tests__/ssr.test.tsx --watch",
       "test:ssr:coverage": "jest src/__tests__/ssr.test.tsx --coverage"
     }
   }
   ```

**Definition of Done:**
- [ ] SSR Tests für 20+ Komponenten (siehe Checklist #59)
- [ ] Tests verifizieren:
  - Kein Crash während `renderToString()`
  - Output enthält erwarteten Content
  - Keine Hydration Mismatches (deterministisches HTML)
- [ ] Tests laufen in CI/CD (aus Phase 1 Task 1.2.2)
- [ ] Coverage ≥80% für SSR-Pfade
- [ ] `SSR_COMPONENT_CHECKLIST.md` vollständig abgehakt

**Verifikation:**
```bash
# 1. Alle Tests laufen durch
cd packages/ui
pnpm test:ssr
# Erwartung: 20+ tests pass

# 2. Coverage Check
pnpm test:ssr:coverage
grep -A 5 "All files" coverage-ssr/lcov-report/index.html
# Erwartung: >= 80% Statements

# 3. CI/CD Integration (aus Phase 1)
gh pr checks
# Erwartung: test-ssr job: ✅ pass

# 4. Checklist vollständig
grep -c "\[x\]" docs/milestones/SSR_COMPONENT_CHECKLIST.md
# Erwartung: >= 20
```

**Troubleshooting:**

**Problem:** Test schlägt fehl mit "Cannot read property 'useContext' of null"
**Lösung:** Ein Hook wurde nicht SSR-safe gemacht. Gehe zurück zu Phase 1 Task 1.2.1 und patche fehlenden Hook.

**Problem:** "ReferenceError: document is not defined"
**Lösung:** Komponente greift auf `document` zu. Füge Guard hinzu:
```typescript
if (typeof document !== 'undefined') {
  document.querySelector(...);
}
```

**Problem:** Hydration Mismatch Test schlägt fehl (IDs unterscheiden sich)
**Lösung:** Komponente generiert Random IDs. Nutze deterministischen ID-Generator:
```typescript
// ❌ Falsch
const id = Math.random().toString();

// ✅ Richtig (deterministisch)
import { useId } from 'react'; // React 18+
const id = useId();
```

**Problem:** Coverage < 80%
**Lösung:** Nicht alle Komponenten haben Tests. Prüfe Checklist und füge fehlende Tests hinzu.

---

## Success Criteria für Phase 2

### Must Have (Blocking)
- [ ] Alle Tasks 2.1.1 - 2.2.1 abgeschlossen
- [ ] Provider dokumentiert in README mit Setup-Beispielen für 3 Frameworks
- [ ] 3 funktionierende Example-Projekte (`examples/`)
- [ ] Error Messages verbessert mit Setup-Anleitung und Docs-Link
- [ ] SSR Tests für ≥20 Komponenten (siehe Issue #59 Checklist)
- [ ] Coverage ≥80% für SSR-Pfade
- [ ] Alle Examples bauen erfolgreich (`pnpm build`)

### Should Have
- [ ] TypeScript Types für `FidusUIProvider` exportiert
- [ ] JSDoc für alle Provider Props
- [ ] Peer Review von Product Team + 2 Entwicklern
- [ ] Alle Examples haben README mit Run-Anleitung

### Nice to Have
- [ ] CodeSandbox Templates für Examples (online playground)
- [ ] Video-Tutorial für Setup (5 Minuten)
- [ ] Migration Guide für v1.x → v2.x (falls Breaking Changes)

---

## Nächste Schritte

Nach Abschluss von Phase 2:

1. **Release v2.0.0-beta.1** erstellen:
   ```bash
   cd packages/ui
   pnpm changeset
   # Select: @fidus/ui - minor
   # Summary: "feat: full SSR support + comprehensive documentation (#59, #60)"
   pnpm changeset version
   pnpm build
   pnpm publish --tag beta
   ```

2. **Issues #59 und #60 schließen**:
   ```bash
   gh issue close 59 --comment "✅ Resolved in v2.0.0-beta.1. Full SSR support + docs available."
   gh issue close 60 --comment "✅ Resolved in v2.0.0-beta.1. Setup guide and examples published."
   ```

3. **Phase 3 starten** ([PHASE_3_MEDIUM_PRIORITY_ENHANCEMENTS.md](./PHASE_3_MEDIUM_PRIORITY_ENHANCEMENTS.md)):
   - Task 3.1.1: Tree-Shaking Configuration
   - Task 3.2.1: Accessibility Audit
   - Task 3.3.1: Form Validation Integration
   - **Keine Hard-Dependencies** - kann parallel gestartet werden

4. **User Communication**:
   - Announce beta release in Discord/Slack
   - Ask for feedback on documentation quality
   - Collect bug reports for beta period

---

**Version:** 1.0
**Letzte Aktualisierung:** 2025-01-10
**Maintainer:** Frontend Team
