---
"@fidus/ui": minor
---

feat(ui): add Autocomplete component with keyboard navigation

New Autocomplete component with the following features:
- Type-ahead suggestions with fuzzy filtering
- Full keyboard navigation (Arrow keys, Enter, Escape, Tab)
- Controlled and uncontrolled modes
- Clearable input with X button
- Custom value support with `allowCustomValue` prop
- Suggestion limiting with `maxSuggestions` prop
- Error and helper text states for form validation
- ARIA combobox/listbox pattern for screen readers
- Zod schema for runtime prop validation

Import: `import { Autocomplete } from '@fidus/ui/autocomplete'`

Also includes:
- Design system documentation page at /components/autocomplete
- Updated sidebar navigation and search index
- Release notes for v1.8.0
