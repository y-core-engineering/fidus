---
"@fidus/ui": minor
---

Add chat UI components for Fidus Memory

This release introduces three new components for building conversational AI interfaces:

- **MessageBubble**: Chat message component with role-based styling, avatars, timestamps, and AI suggestion chips with confidence indicators
- **ChatInterface**: Complete chat layout with scrollable message list, auto-scroll behavior, and textarea input with keyboard shortcuts (Enter to send, Shift+Enter for newline)
- **ConfidenceIndicator**: ML confidence visualization with color-coded badges (green for high confidence, blue for medium, yellow for learning, gray for uncertain)

All components are built with 100% Fidus UI primitives (Stack, Chip, Avatar, Button, etc.), use design tokens for consistent spacing, and include comprehensive TypeScript types with Zod schemas for runtime validation.
