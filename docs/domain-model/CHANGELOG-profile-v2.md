# Profile Domain Model v2.0 - Changelog

**Date:** 2025-11-03
**Status:** Active

---

## Summary of Changes

Profile Domain Model has been upgraded from v1.0 to v2.0 to support **Situational Context** - enabling context-dependent preferences with dynamically discovered context factors.

---

## Added

### New Entity: `Situation`

**Purpose:** Captures specific situational context where preferences apply

**Key Features:**
- Schema-less `factors` (Record<string, any>)
- Embedding reference for similarity search
- Human-readable description
- Dynamic factor discovery by LLM

**Location in Document:** Section "2. Situation (Entity) [v2.0]"

---

### Updated Entity: `Preference`

**New Attributes:**
- `situations: SituationReference[]` - Links to applicable situations
- `reinforcementCount: number` - Tracking acceptance
- `rejectionCount: number` - Tracking rejection
- `learnedAt: Date` - When first learned
- `lastReinforced: Date` - Last reinforcement

**New Methods:**
- `linkToSituation(situationId)` - Link preference to situation
- `reinforce()` - Increase confidence (+0.1, max 0.95)
- `weaken()` - Decrease confidence (-0.15, min 0.0)
- `isVeryConfident()` - Check if confidence >= 0.8
- `getSituations()` - Get all linked situations

**Changed Behavior:**
- Initial confidence: 1.0 → 0.75 (more realistic for inferred preferences)
- `isConfident()` threshold: 0.7 → 0.5

**Location in Document:** Section "3. Preference (Entity) [v2.0 Updated]"

---

### Updated Aggregate: `UserProfile`

**New Attributes:**
- `situations: Situation[]` - All captured situations

**New Commands:**
- `recordPreferenceInSituation()` - Record preference with context
- `reinforcePreference()` - User accepted suggestion
- `weakenPreference()` - User rejected suggestion
- `getPreferencesForSituation()` - Query context-relevant preferences

**Changed Methods:**
- `recalculateCompleteness()` - Now includes situation count
- `toSemanticText()` - Now includes situational context

**Location in Document:** Section "1. UserProfile (Aggregate Root)"

---

### New Domain Events

**PreferenceRecordedInSituation:**
- Emitted when preference is learned with situational context
- Payload: profileId, domain, key, value, confidence, situationId, situationFactors

**PreferenceReinforced:**
- Emitted when user accepts suggestion
- Payload: profileId, domain, key, situationId, newConfidence

**PreferenceWeakened:**
- Emitted when user rejects suggestion
- Payload: profileId, domain, key, situationId, newConfidence

**SituationCaptured:**
- Emitted when new situation is captured
- Payload: profileId, situationId, factors, embeddingId

**Location in Document:** Section "Domain Events"

---

### New Domain Service

**SituationMatchingService:**

```typescript
interface SituationMatchingService {
  /**
   * Find situations similar to given factors.
   * Uses vector similarity search (delegated to infrastructure/Qdrant).
   */
  findSimilarSituations(
    userId: string,
    currentFactors: Record<string, any>,
    minSimilarity: number,
    limit: number
  ): Promise<string[]>;

  /**
   * Get preferences that apply in similar situations.
   * Combines situation matching with preference confidence filtering.
   */
  getContextRelevantPreferences(
    profile: UserProfile,
    currentFactors: Record<string, any>,
    minConfidence: number
  ): Promise<Array<{preference: Preference, similarity: number}>>;
}
```

**Location in Document:** Section "Domain Services"

---

## Changed

### Domain Language

**Added Terms:**
- **Situation:** Specific set of situational factors at a point in time
- **Situational Factor:** Single aspect of context that may influence preferences
- **Context Similarity:** Semantic similarity between situations (0.0-1.0)
- **Preference Reinforcement:** Increasing confidence when user accepts suggestion
- **Preference Weakening:** Decreasing confidence when user rejects suggestion

**Updated Terms:**
- **Preference:** Now "User's stated choice or setting (v2.0: now context-dependent)"
- **Context:** Now refers to situational factors, not fixed context types
- **Confidence:** Now "Dynamically adjusted based on reinforcement/rejection"

---

## Deprecated

**UserContext (from v1.0):**
- Old: Fixed context types (WORK | HOME | TRAVEL | LEISURE)
- New: Dynamic Situation with schema-less factors
- Migration: Convert UserContext[] to Situations[] with context_type factor

---

## Migration Guide (v1.0 → v2.0)

### Existing Preferences

For preferences without situations:

```typescript
// 1. Create a "general" situation
const generalSituation = Situation.create(
  { general: true, migrated_from_v1: true },
  embeddingId
);

// 2. Link preference to this situation
preference.linkToSituation(generalSituation.situationId);

// 3. Set initial confidence based on source
if (preference.source === PreferenceSource.USER_STATED) {
  preference.confidence = 0.9;
} else {
  preference.confidence = 0.5;
}
```

### UserContext to Situation

```typescript
// For each UserContext:
const factors: Record<string, any> = {
  context_type: userContext.type,  // WORK, HOME, TRAVEL
  ...userContext.data
};

const situation = Situation.create(factors, embeddingId);
```

---

## Breaking Changes

### API Changes

**Before (v1.0):**
```typescript
profile.setPreference("calendar", "meeting_duration", 30, 1.0);
// Returns: PreferenceSet

profile.getPreference("calendar", "meeting_duration");
// Returns: Preference { value: 30, confidence: 1.0 }
```

**After (v2.0):**
```typescript
profile.recordPreferenceInSituation(
  "calendar",
  "meeting_duration",
  30,
  { time_of_day: "morning", with_people: ["colleague"] },
  0.8
);
// Returns: PreferenceRecordedInSituation

profile.getPreferencesForSituation(
  { time_of_day: "morning", with_people: ["colleague"] },
  0.3  // min confidence
);
// Returns: Preference[] with situational context
```

### Event Changes

**New Events (must be handled):**
- `PreferenceRecordedInSituation` - Replaces `PreferenceSet` for context-aware learning
- `PreferenceReinforced` - New event for positive reinforcement
- `PreferenceWeakened` - New event for negative feedback
- `SituationCaptured` - New event for context capture

**Existing Events (unchanged):**
- `PreferenceSet` - Still emitted for v1.0 compatibility
- `BehaviorRecorded` - No changes
- `RelationshipAdded` - No changes

---

## Related Documentation

- **Architecture:** [Situational Context Architecture](../architecture/08-situational-context-architecture.md)
- **Solution:** [Situational Context Solution](../solution-architecture/14-situational-context.md)
- **Implementation:** [Fidus Memory Phase 3](../fidus-memory-phase3-dynamic-context.md)
- **Detailed Update:** [Profile Domain Situational Context Update](11-profile-domain-situational-context-update.md)

---

## Version Control

| Version | File | Status |
|---------|------|--------|
| v1.0 | `11-profile-domain.md` (archived sections) | Legacy |
| v2.0 | `11-profile-domain.md` (current) | **Active** |
| Update Doc | `11-profile-domain-situational-context-update.md` | Reference |

---

**Maintained by:** Domain Modeling Team
**Last Updated:** 2025-11-03

---

**End of Changelog**
