# Changeset Workflow für Releases

Fidus verwendet [Changesets](https://github.com/changesets/changesets) für das Versionsmanagement und Publishing von Packages.

## Überblick

**Vorteile:**
- ✅ Automatische Versionierung basierend auf Änderungen
- ✅ Automatisch generierte CHANGELOGs
- ✅ Nur geänderte Packages werden released
- ✅ Klare Git-Historie mit Release-PRs

## Workflow

### 1. Änderungen machen

Arbeite normal an deinem Code in einem Feature-Branch:

```bash
git checkout -b feature/new-button-variant
# Mache Änderungen in packages/ui/...
git commit -m "feat(ui): add outline button variant"
```

### 2. Changeset erstellen

**Vor dem Mergen** des PRs, erstelle ein Changeset:

```bash
pnpm changeset
```

Das Tool fragt dich:
1. **Welche Packages haben sich geändert?** → Wähle `@fidus/ui`
2. **Welche Art von Änderung?** → Wähle:
   - `major` - Breaking Change (1.0.0 → 2.0.0)
   - `minor` - Neues Feature (1.0.0 → 1.1.0)
   - `patch` - Bug Fix (1.0.0 → 1.0.1)
3. **Beschreibung?** → Kurze Zusammenfassung der Änderung

Dies erstellt eine Datei `.changeset/random-name.md`:

```md
---
"@fidus/ui": minor
---

Add outline button variant
```

**Committe das Changeset:**

```bash
git add .changeset/
git commit -m "chore: add changeset for button variant"
git push
```

### 3. PR mergen

Merge deinen PR normal zu `main`. Das Changeset wird mit gemerged.

### 4. Automatischer Release-PR

Nach dem Merge zu `main` passiert automatisch:

1. **GitHub Actions** erkennt das Changeset
2. Ein **Release-PR** wird erstellt mit:
   - Updated `package.json` Versionen
   - Updated `CHANGELOG.md` mit deinen Änderungen
   - Alle Changesets werden konsumiert

**Beispiel Release-PR:**
```
Title: chore: release packages

Changes:
- @fidus/ui@1.1.0
  - Add outline button variant
  - Fix button hover state
```

### 5. Release-PR mergen = Publishing

Wenn du den **Release-PR mergst**:

1. ✅ Packages werden zu npm published
2. ✅ GitHub Release wird erstellt
3. ✅ CHANGELOGs sind aktualisiert

## Befehle

```bash
# Changeset erstellen (nach jeder Änderung)
pnpm changeset

# Changesets anwenden (normalerweise durch GitHub Actions)
pnpm version-packages

# Publishen (normalerweise durch GitHub Actions)
pnpm release
```

## Best Practices

### 1. Ein Changeset pro PR

Erstelle **vor dem Mergen** immer ein Changeset für deinen PR.

### 2. Aussagekräftige Beschreibungen

```bash
# ❌ BAD
"Fixed bug"

# ✅ GOOD
"Fix button hover state in dark mode causing incorrect color"
```

### 3. Richtige Bump-Level wählen

- **Patch** (1.0.0 → 1.0.1): Bug Fixes, Refactorings ohne Behavior-Änderung
- **Minor** (1.0.0 → 1.1.0): Neue Features, neue Components
- **Major** (1.0.0 → 2.0.0): Breaking Changes, API-Änderungen

### 4. Mehrere Changesets in einem PR

Wenn dein PR mehrere unabhängige Änderungen hat:

```bash
pnpm changeset  # Erste Änderung (z.B. new feature)
pnpm changeset  # Zweite Änderung (z.B. bug fix)
```

## Nur @fidus/ui wird published

**Konfiguration:** Nur `@fidus/ui` wird zu npm published.

Andere Packages sind ignored in `.changeset/config.json`:

```json
{
  "ignore": ["@fidus/web", "@fidus/cli", "@fidus/design-system", "@fidus/shared"]
}
```

Falls du später auch andere Packages publishen willst, entferne sie aus der `ignore` Liste.

## Migration vom alten Workflow

**Alter Workflow (Tag-basiert):**
```bash
# Version in package.json ändern
npm version minor
git tag v1.1.0
git push --tags  # Triggert Publishing
```

**Neuer Workflow (Changesets):**
```bash
# Changeset erstellen
pnpm changeset
# → Wähle Package und Bump-Level
# → Beschreibe Änderung

# Commiten und mergen
git add .changeset/
git commit -m "chore: add changeset"
git push

# Release-PR wird automatisch erstellt
# → Merge den Release-PR → Automatisches Publishing!
```

## Troubleshooting

### "No changesets found"

Du hast vergessen, ein Changeset zu erstellen. Führe `pnpm changeset` aus.

### Release-PR wird nicht erstellt

1. Check GitHub Actions: `.github/workflows/release.yml`
2. Stelle sicher, dass Changesets in `.changeset/` existieren
3. Check dass du auf `main` Branch gepusht hast

### Package wird nicht published

1. Check `.changeset/config.json` - ist das Package in `ignore`?
2. Check NPM_TOKEN in GitHub Secrets
3. Check Workflow Logs in GitHub Actions

## Weitere Infos

- [Changesets Documentation](https://github.com/changesets/changesets)
- [Semantic Versioning](https://semver.org/)
