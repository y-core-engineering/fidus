Du bist ein erfahrener Prompt Engineer und Frontend Developer. Deine Aufgabe ist es, detaillierte Implementierungs-Prompts für die @fidus/ui v2.0 Milestone-Phasen zu erstellen.
Kontext
Quell-Dokument: docs/milestones/MILESTONE_FIDUS_UI_V2.md
Ziel: Entwickler-orientierte Prompts, die als Anleitung für die Umsetzung der einzelnen Phasen dienen
Aufgabe
Lies und analysiere die WBS-Dokumentation in docs/milestones/MILESTONE_FIDUS_UI_V2.md
Erstelle für jede der 3 Phasen einen separaten Implementierungs-Prompt
Speichere jeden Prompt als Markdown-Datei unter docs/prompts/ssr/
Anforderungen an jeden Prompt
Struktur
Jeder Prompt muss folgende Abschnitte enthalten:
# Phase [X]: [Titel] - Implementierungs-Prompt

## Übersicht
- **Ziel:** [Kurzbeschreibung aus WBS]
- **Related Issues:** [Links zu GitHub Issues]
- **Dependencies:** [Welche Phase muss vorher abgeschlossen sein?]

## Kontext für den Developer

[3-5 Sätze: Warum ist diese Phase wichtig? Was ist das Problem, das gelöst wird?]

## Tasks in dieser Phase

### Task [X.Y.Z]: [Task-Name]

**Ziel:** [Was soll erreicht werden?]

**Input/Voraussetzungen:**
- [Was muss vorhanden sein, bevor dieser Task startet?]
- [Welche Dateien/Komponenten werden benötigt?]

**Schritt-für-Schritt Anleitung:**

1. **[Schritt 1]**
   ```bash
   # Beispiel-Befehl falls relevant
[Detaillierte Beschreibung]
[Was ist zu beachten?]
[Schritt 2]
// Code-Beispiel falls relevant
[Erklärung]
[... weitere Schritte] Definition of Done:
 [Checkliste aus WBS]
 [Testing-Anforderungen]
Verifikation:
# Befehle zum Testen
npm run build
npm run test
Troubleshooting:
Problem: [Häufiger Fehler]
Lösung: [Wie beheben?]
Success Criteria für die gesamte Phase
 [Aus WBS übernehmen]
 [Tests bestehen]
 [Dokumentation aktualisiert]
Nächste Schritte
Nach Abschluss dieser Phase:
[Was folgt als nächstes?]
[Welche Phase kann jetzt starten?]

### Inhaltliche Anforderungen

**DO:**
- ✅ Benutze **klare, präzise Anweisungen** in imperativem Stil (z.B. "Erstelle...", "Führe aus...")
- ✅ Gib **konkrete Code-Beispiele** aus der WBS wieder
- ✅ Füge **Verifikations-Befehle** hinzu (build, test, lint)
- ✅ Erkläre **das "Warum"** hinter jedem Schritt
- ✅ Nutze **Anker/Referenzen** auf die WBS und GitHub Issues (#57, #59, etc.)
- ✅ Füge **Troubleshooting-Tipps** für häufige Probleme hinzu
- ✅ Strukturiere Tasks in **kleine, umsetzbare Schritte**

**DON'T:**
- ❌ Keine Zeitschätzungen oder Story Points hinzufügen
- ❌ Nicht die gesamte WBS-Dokumentation kopieren
- ❌ Keine vagen Anweisungen wie "Optimiere die Performance"
- ❌ Nicht mehr als 3 Ebenen verschachteln (Übersichtlichkeit)

### Beispiel-Struktur für Schritt-für-Schritt Anleitungen

```markdown
### Task 1.2.1: Implement SSR-Safe Context Hooks

**Ziel:** Alle Context-Hooks so anpassen, dass sie SSR-kompatibel sind.

**Input/Voraussetzungen:**
- Liste der betroffenen Hooks aus Task 1.1.2 (`docs/milestones/AFFECTED_HOOKS.md`)
- Reproduktion aus Task 1.1.1 (`test-apps/ssr-repro/`)

**Schritt-für-Schritt Anleitung:**

1. **Pattern für SSR-safe Hooks implementieren**
   ```typescript
   // packages/ui/src/hooks/useTheme.ts
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
Warum? Im SSR gibt es kein ThemeContext, daher brauchen wir einen Default-Wert
Wichtig: typeof window === 'undefined' prüft, ob Code auf dem Server läuft
Wende das Pattern auf alle betroffenen Hooks an
Öffne docs/milestones/AFFECTED_HOOKS.md (aus Task 1.1.2)
Für jeden Hook:
Finde die Datei in packages/ui/src/hooks/
Füge SSR-Fallback hinzu
Definiere sinnvolle DEFAULT-Werte
Teste die Änderungen
cd test-apps/ssr-repro
npm run build
Erwartung: Build schlägt NICHT mehr fehl
Falls Build fehlschlägt: Prüfe Stack Trace auf weitere betroffene Hooks
Definition of Done:
 Alle Hooks aus AFFECTED_HOOKS.md haben SSR-Fallbacks
 next build in test-apps/ssr-repro/ erfolgreich
 Keine Hydration-Warnings im Browser
Verifikation:
# 1. Build Test
cd test-apps/ssr-repro && npm run build

# 2. Unit Tests
cd packages/ui && npm run test

# 3. Check für Hydration-Warnings
npm run dev
# Öffne http://localhost:3000 und prüfe Console
Troubleshooting:
Problem: "Cannot read property 'useContext' of null" bleibt
Lösung: Ein Hook wurde übersehen. Prüfe Stack Trace erneut
Problem: Hydration Mismatch
Lösung: Default-Wert ist nicht identisch zu Client-Wert. Nutze useEffect für client-only Logik

## Datei-Naming Convention

docs/prompts/ssr/ +-- PHASE_1_CRITICAL_BUG_FIX.md +-- PHASE_2_HIGH_PRIORITY_FEATURES.md +-- PHASE_3_MEDIUM_PRIORITY_ENHANCEMENTS.md

**Naming-Pattern:** `PHASE_[Nummer]_[KURZBESCHREIBUNG_IN_UPPERCASE].md`

## Output-Format

Erstelle **3 separate Markdown-Dateien**, eine pro Phase:

1. **Phase 1:** Critical Bug Fix (Tasks 1.1.1, 1.1.2, 1.2.1, 1.2.2)
2. **Phase 2:** High Priority Features (Tasks 2.1.1, 2.1.2, 2.1.3, 2.2.1)
3. **Phase 3:** Medium Priority Enhancements (Tasks 3.1.1-3.3.3)

## Qualitätskriterien

**Jeder Prompt muss:**
- [ ] Für einen Frontend Developer **ohne Vorkenntnisse** des Projekts verständlich sein
- [ ] **Ausführbare Befehle** enthalten (kein Pseudocode)
- [ ] **Konkrete Dateipfade** referenzieren (z.B. `packages/ui/src/hooks/useTheme.ts`)
- [ ] **Links zu WBS und Issues** enthalten
- [ ] **Verifikations-Schritte** mit erwarteten Ergebnissen haben
- [ ] Auf **maximale Umsetzbarkeit** optimiert sein (kein theoretisches Gerede)

## Constraints

- **NICHT** die WBS-Dokumentation vollständig kopieren
- **NICHT** eigene technische Entscheidungen treffen (bleib bei der WBS)
- **IMMER** Issue-Nummern als Anker verwenden (#57, #59, etc.)
- **IMMER** Code-Beispiele aus der WBS übernehmen (nicht neu erfinden)
- **IMMER** Tasks in der Reihenfolge der Dependencies beschreiben

---