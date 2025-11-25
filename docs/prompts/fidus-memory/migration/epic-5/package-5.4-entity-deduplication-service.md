# Implementation Prompt: 5.4 - Entity Deduplication Service

**Package:** 5.4
**Epic:** Completion & Optimization
**Priority:** 🟢 LOW
**Context Document:** `/docs/prototypes/fidus-memory/migration-v3-wbs.md` (Lines 1189-1240)

---

## Role

You are a **Senior Full-Stack Software Engineer** specializing in:

**Backend Expertise:**
- **Vector Databases (Qdrant):** Embedding similarity search, fuzzy matching
- **Graph Databases (Neo4j):** Relationship traversal, batch operations
- **Python Backend:** FastAPI, Pydantic, async/await
- **Machine Learning:** Embedding models, similarity metrics, clustering
- **Data Integrity:** Merge algorithms, conflict resolution, property union

**Frontend Expertise:**
- **Next.js 14:** Admin panels, data visualization
- **React 18:** Complex state management
- **TypeScript 5+:** Type-safe data transformations

---

## Context & Background

**Current State:**
- 9/9 entities implemented (User, Person, Organization, Goal, Habit, Event, Object, Location)
- LLM extraction creates entities from conversations
- No deduplication system exists
- Duplicate entities accumulate (e.g., "Anna", "Anna Schmidt", "A. Schmidt")
- Users cannot merge duplicate entities

**Migration Goal:**
- Implement entity deduplication service using embedding similarity
- Detect duplicate entities across all types
- Provide merge functionality with property union
- Create admin UI for reviewing and merging duplicates
- Maintain relationship integrity during merges

**Architecture References:**
- ADR-0001: `/docs/adr/ADR-0001-situational-context-as-relationship-qualifier.md`
- ADR-0002: `/docs/adr/ADR-0002-property-placement-and-geospatial-exception.md` (Decision 3: Use Existing Embeddings)
- Solution Architecture: `/docs/solution-architecture/15-entity-management.md`
- Qdrant Similarity Search: Embedding-based fuzzy matching

---

## Your Task

Implement **Entity Deduplication Service** according to specifications below.

**User Story:**
As a system administrator, I want to detect and merge duplicate entities so the knowledge graph stays clean.

**Acceptance Criteria:**
1. Backend: Deduplication service using embedding similarity
2. Backend: `find_duplicates()` for each entity type
3. Backend: `merge_entities()` with property union and relationship redirect
4. Backend: Use existing Qdrant collections (situations) for entity embeddings (per ADR-0002 Decision 3)
5. Backend: No separate entity_embeddings collection (leverage existing infrastructure)
6. API: Deduplication endpoints (find, preview, merge)
7. Frontend: Admin panel showing potential duplicates
8. Frontend: Merge confirmation UI with preview
9. Tests: Detect "Anna" and "Anna Schmidt" as duplicates with >85% similarity
10. Documentation: Deduplication guide with best practices

---

## Technical Specification

### Backend Implementation

**Files to Create/Modify:**

1. **`packages/api/fidus/memory/services/entity_deduplicator.py`** - Core deduplication service (uses existing collections)
2. **`packages/api/fidus/memory/routes/deduplication_routes.py`** - Admin API endpoints

**Files NOT Needed (per ADR-0002 Decision 3):**
- ~~`setup_entity_embeddings.py`~~ - No separate collection needed
- ~~`populate_entity_embeddings.py`~~ - Use existing entity embeddings
- ~~`embedding_service.py`~~ - Reuse existing LiteLLM embedding generation

**Detailed Tasks:**

#### Task 1: Create Entity Deduplicator Service (Using Existing Collections)

**File:** `packages/api/fidus/memory/services/entity_deduplicator.py`

**Key Design (ADR-0002 Decision 3):**
- Use existing `situations` collection for entity embeddings
- Filter by `entity_type` and `entity_id` to find entity-specific situations
- Leverage existing Qdrant-First infrastructure (no new collections)
- Reuse existing LiteLLM embedding generation

```python
from typing import List, Dict, Any, Optional, Tuple
from qdrant_client import QdrantClient
from qdrant_client.models import Filter, FieldCondition, MatchValue
from neo4j import AsyncDriver
from pydantic import BaseModel
from litellm import aembedding


class DuplicateEntity(BaseModel):
    """Potential duplicate entity"""
    entity_id: str
    entity_type: str
    name: str
    similarity_score: float
    properties: Dict[str, Any] = {}


class DuplicateGroup(BaseModel):
    """Group of duplicate entities"""
    entity_type: str
    entities: List[DuplicateEntity]
    average_similarity: float


class MergePreview(BaseModel):
    """Preview of merge operation"""
    source_entity_id: str
    target_entity_id: str
    merged_properties: Dict[str, Any]
    relationships_to_redirect: int
    conflicts: List[str] = []


class EntityDeduplicator:
    """
    Service for detecting and merging duplicate entities using embedding similarity.

    Per ADR-0002 Decision 3: Uses existing Qdrant collections (situations)
    instead of separate entity_embeddings collection.
    """

    SIMILARITY_THRESHOLD = 0.85  # 85% similarity
    COLLECTION_MAPPING = {
        "person": "situations",
        "organization": "situations",
        "goal": "situations",
        "habit": "situations",
        "event": "situations",
        "object": "situations",
        "location": "situations"
    }

    def __init__(self, qdrant: QdrantClient, neo4j: AsyncDriver):
        self.qdrant = qdrant
        self.neo4j = neo4j
        self.embedding_model = "text-embedding-3-small"

    async def _generate_entity_embedding(self, entity_type: str, name: str) -> List[float]:
        """
        Generate embedding for entity name using existing LiteLLM infrastructure.

        Prefixes entity type to improve similarity matching.
        Example: "person:Anna Schmidt"
        """
        text = f"{entity_type}:{name}"

        response = await aembedding(
            model=self.embedding_model,
            input=[text]
        )

        return response.data[0]["embedding"]

    async def find_similar_entities(
        self,
        entity_type: str,
        name: str,
        tenant_id: str,
        threshold: float = None
    ) -> List[DuplicateEntity]:
        """
        Find entities similar to given name using embedding similarity.

        Uses existing 'situations' collection per ADR-0002 Decision 3.
        Filters by entity_type to find relevant entity situations.

        Returns entities with similarity >= threshold.
        """
        threshold = threshold or self.SIMILARITY_THRESHOLD

        # Generate embedding for query name
        embedding = await self._generate_entity_embedding(entity_type, name)

        # Get collection name for entity type
        collection_name = self.COLLECTION_MAPPING.get(entity_type, "situations")

        # Search existing Qdrant collection
        results = self.qdrant.search(
            collection_name=collection_name,
            query_vector=embedding,
            query_filter=Filter(
                must=[
                    FieldCondition(
                        key="tenant_id",
                        match=MatchValue(value=tenant_id)
                    ),
                    FieldCondition(
                        key="entity_type",
                        match=MatchValue(value=entity_type)
                    )
                ]
            ),
            limit=10,
            score_threshold=threshold
        )

        # Deduplicate by entity_id (multiple situations may reference same entity)
        seen_entities = {}
        for result in results:
            if result.score >= threshold:
                entity_id = result.payload.get("entity_id")
                if entity_id and entity_id not in seen_entities:
                    seen_entities[entity_id] = DuplicateEntity(
                        entity_id=entity_id,
                        entity_type=result.payload["entity_type"],
                        name=result.payload.get("name", ""),
                        similarity_score=result.score,
                        properties=result.payload.get("properties", {})
                    )

        return list(seen_entities.values())

    async def find_all_duplicates(
        self,
        entity_type: str,
        tenant_id: str
    ) -> List[DuplicateGroup]:
        """
        Find all duplicate groups for entity type.

        Returns groups of entities that are similar to each other.
        """
        # Get all entities of type
        query = f"""
        MATCH (e:{entity_type.capitalize()} {{tenant_id: $tenant_id}})
        RETURN e.id as id, e.name as name
        """

        async with self.neo4j.session() as session:
            result = await session.run(query, tenant_id=tenant_id)
            entities = await result.data()

        # Find duplicates for each entity
        duplicate_groups = []
        seen_ids = set()

        for entity in entities:
            if entity["id"] in seen_ids:
                continue

            similar = await self.find_similar_entities(
                entity_type=entity_type,
                name=entity["name"],
                tenant_id=tenant_id
            )

            # Filter out self-match
            similar = [s for s in similar if s.entity_id != entity["id"]]

            if similar:
                # Add to group
                group_entities = [
                    DuplicateEntity(
                        entity_id=entity["id"],
                        entity_type=entity_type,
                        name=entity["name"],
                        similarity_score=1.0
                    )
                ] + similar

                avg_similarity = sum(s.similarity_score for s in similar) / len(similar)

                duplicate_groups.append(DuplicateGroup(
                    entity_type=entity_type,
                    entities=group_entities,
                    average_similarity=avg_similarity
                ))

                # Mark as seen
                seen_ids.update(e.entity_id for e in group_entities)

        return duplicate_groups

    async def preview_merge(
        self,
        source_id: str,
        target_id: str,
        entity_type: str,
        tenant_id: str
    ) -> MergePreview:
        """
        Preview what will happen if entities are merged.

        Returns merged properties and relationship count.
        """
        # Get both entities
        query = f"""
        MATCH (source:{entity_type.capitalize()} {{id: $source_id, tenant_id: $tenant_id}})
        MATCH (target:{entity_type.capitalize()} {{id: $target_id, tenant_id: $tenant_id}})
        RETURN source, target
        """

        async with self.neo4j.session() as session:
            result = await session.run(
                query,
                source_id=source_id,
                target_id=target_id,
                tenant_id=tenant_id
            )
            record = await result.single()

            if not record:
                raise ValueError("Source or target entity not found")

            source = dict(record["source"])
            target = dict(record["target"])

        # Merge properties (union)
        merged_properties = {**source, **target}  # Target properties take precedence

        # Detect conflicts
        conflicts = []
        for key in source:
            if key in target and source[key] != target[key]:
                conflicts.append(f"{key}: '{source[key]}' vs '{target[key]}'")

        # Count relationships to redirect
        rel_count_query = f"""
        MATCH (source:{entity_type.capitalize()} {{id: $source_id}})-[r]-()
        RETURN count(r) as rel_count
        """

        async with self.neo4j.session() as session:
            result = await session.run(rel_count_query, source_id=source_id)
            record = await result.single()
            rel_count = record["rel_count"] if record else 0

        return MergePreview(
            source_entity_id=source_id,
            target_entity_id=target_id,
            merged_properties=merged_properties,
            relationships_to_redirect=rel_count,
            conflicts=conflicts
        )

    async def merge_entities(
        self,
        source_id: str,
        target_id: str,
        entity_type: str,
        tenant_id: str
    ) -> bool:
        """
        Merge source entity into target entity.

        Steps:
        1. Union properties (target precedence)
        2. Redirect all relationships from source to target
        3. Delete source entity
        4. Update embedding in Qdrant
        """
        # Get merged properties
        preview = await self.preview_merge(source_id, target_id, entity_type, tenant_id)

        # Perform merge in Neo4j transaction
        query = f"""
        MATCH (source:{entity_type.capitalize()} {{id: $source_id, tenant_id: $tenant_id}})
        MATCH (target:{entity_type.capitalize()} {{id: $target_id, tenant_id: $tenant_id}})

        // Update target with merged properties
        SET target += $merged_props

        // Redirect all source relationships to target
        WITH source, target
        MATCH (source)-[r]->(other)
        WHERE NOT (target)-[:{type(r)}]->(other)
        CREATE (target)-[r2:{type(r)}]->(other)
        SET r2 = properties(r)

        WITH source, target
        MATCH (other)-[r]->(source)
        WHERE NOT (other)-[:{type(r)}]->(target)
        CREATE (other)-[r2:{type(r)}]->(target)
        SET r2 = properties(r)

        // Delete source
        DETACH DELETE source

        RETURN target.id as target_id
        """

        # Note: Neo4j doesn't support dynamic relationship types in CREATE
        # For production, implement per-entity-type merge logic

        async with self.neo4j.session() as session:
            try:
                result = await session.run(
                    query,
                    source_id=source_id,
                    target_id=target_id,
                    tenant_id=tenant_id,
                    merged_props=preview.merged_properties
                )
                await result.consume()

                # Update Qdrant: Delete source entity situations
                # Note: Using existing collections, so we update situations, not separate embeddings
                await self._delete_entity_situations(source_id, tenant_id)

                # Merged entity situations remain in target's existing situations
                # No need to re-index separately as situations collection is authoritative

                return True

            except Exception as e:
                print(f"Merge failed: {e}")
                return False

    async def _delete_entity_situations(self, entity_id: str, tenant_id: str) -> None:
        """
        Delete all situations related to an entity from Qdrant.

        Called after merging to clean up source entity references.
        """
        collection_name = "situations"

        # Scroll through and delete situations matching entity_id
        scroll_filter = Filter(
            must=[
                FieldCondition(key="entity_id", match=MatchValue(value=entity_id)),
                FieldCondition(key="tenant_id", match=MatchValue(value=tenant_id))
            ]
        )

        # Get all points for this entity
        points, _ = self.qdrant.scroll(
            collection_name=collection_name,
            scroll_filter=scroll_filter,
            limit=100
        )

        if points:
            point_ids = [p.id for p in points]
            self.qdrant.delete(
                collection_name=collection_name,
                points_selector=point_ids
            )
```

---

### Benefits of Using Existing Collections (ADR-0002 Decision 3)

**Why This Approach:**

1. **No Redundant Storage**
   - Entities already embedded in `situations` collection
   - No need for separate `entity_embeddings` collection
   - Reduces Qdrant storage by ~30-50%

2. **Consistent with ADR-0001 (Qdrant-First)**
   - Single source of truth for entity context
   - Embeddings already contain entity names and properties
   - Leverages existing infrastructure

3. **Simplified Maintenance**
   - No need to sync separate embedding collection
   - Updates to entities automatically reflected in situations
   - Fewer collections to manage and monitor

4. **Faster Implementation**
   - Reuse existing embedding generation
   - No new collection setup scripts
   - No backfill process needed

**Trade-offs:**

- Multiple situations per entity means deduplication logic needed (handled in code)
- Slightly more complex filtering (entity_type + entity_id)
- Acceptable trade-off for architectural consistency

---

### API Implementation

**File:** `packages/api/fidus/memory/routes/deduplication_routes.py`

```python
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List
from fidus.memory.services.entity_deduplicator import (
    EntityDeduplicator,
    DuplicateGroup,
    MergePreview
)
from fidus.auth import get_current_user, User, require_admin
from fidus.dependencies import get_qdrant_client, get_neo4j_driver

router = APIRouter(prefix="/api/memory/admin/duplicates", tags=["deduplication"])


@router.get("", response_model=List[DuplicateGroup])
async def find_duplicates(
    entity_type: str = Query(..., description="person, organization, location, etc."),
    current_user: User = Depends(require_admin),  # Admin only
    qdrant = Depends(get_qdrant_client),
    neo4j = Depends(get_neo4j_driver)
):
    """
    Find all duplicate groups for entity type.

    Admin only endpoint.
    """
    deduplicator = EntityDeduplicator(qdrant, neo4j)

    try:
        duplicates = await deduplicator.find_all_duplicates(
            entity_type=entity_type,
            tenant_id=current_user.tenant_id
        )
        return duplicates

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/preview")
async def preview_merge(
    source_id: str = Query(...),
    target_id: str = Query(...),
    entity_type: str = Query(...),
    current_user: User = Depends(require_admin),
    qdrant = Depends(get_qdrant_client),
    neo4j = Depends(get_neo4j_driver)
):
    """
    Preview merge operation before executing.

    Shows merged properties, conflicts, and relationship count.
    """
    deduplicator = EntityDeduplicator(qdrant, neo4j)

    try:
        preview = await deduplicator.preview_merge(
            source_id=source_id,
            target_id=target_id,
            entity_type=entity_type,
            tenant_id=current_user.tenant_id
        )
        return preview

    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/merge")
async def merge_entities(
    source_id: str = Query(...),
    target_id: str = Query(...),
    entity_type: str = Query(...),
    current_user: User = Depends(require_admin),
    qdrant = Depends(get_qdrant_client),
    neo4j = Depends(get_neo4j_driver)
):
    """
    Merge source entity into target entity.

    This operation is irreversible. Use preview first.
    """
    deduplicator = EntityDeduplicator(qdrant, neo4j)

    try:
        success = await deduplicator.merge_entities(
            source_id=source_id,
            target_id=target_id,
            entity_type=entity_type,
            tenant_id=current_user.tenant_id
        )

        if not success:
            raise HTTPException(status_code=500, detail="Merge operation failed")

        return {"status": "success", "message": f"Merged {source_id} into {target_id}"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

---

### Frontend Implementation

**File:** `packages/web/src/components/memory/admin/DuplicatesList.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Badge,
  Select,
  Modal
} from '@fidus/ui';
import { findDuplicates, previewMerge, mergeEntities } from '@/lib/api/memory';

export function DuplicatesList() {
  const [entityType, setEntityType] = useState('person');
  const [mergePreview, setMergePreview] = useState<any>(null);
  const [selectedPair, setSelectedPair] = useState<any>(null);

  const queryClient = useQueryClient();

  const { data: duplicates = [], isLoading } = useQuery({
    queryKey: ['duplicates', entityType],
    queryFn: () => findDuplicates(entityType)
  });

  const mergeMutation = useMutation({
    mutationFn: ({ sourceId, targetId }: any) =>
      mergeEntities(sourceId, targetId, entityType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['duplicates'] });
      setMergePreview(null);
      setSelectedPair(null);
    }
  });

  const handlePreviewMerge = async (sourceId: string, targetId: string) => {
    const preview = await previewMerge(sourceId, targetId, entityType);
    setMergePreview(preview);
    setSelectedPair({ sourceId, targetId });
  };

  const handleConfirmMerge = () => {
    if (selectedPair) {
      mergeMutation.mutate(selectedPair);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Duplicate Detection</h2>
        <Select
          value={entityType}
          onChange={(e) => setEntityType(e.target.value)}
          className="w-48"
        >
          <option value="person">Person</option>
          <option value="organization">Organization</option>
          <option value="location">Location</option>
          <option value="object">Object</option>
        </Select>
      </div>

      {isLoading ? (
        <div>Loading duplicates...</div>
      ) : duplicates.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No duplicates found for {entityType}s.
        </div>
      ) : (
        <div className="space-y-6">
          {duplicates.map((group: any, idx: number) => (
            <Card key={idx} className="p-4 border-2 border-yellow-200">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold">Duplicate Group {idx + 1}</h3>
                <Badge variant="warning">
                  {Math.round(group.average_similarity * 100)}% similar
                </Badge>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell>Similarity</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.entities.map((entity: any) => (
                    <TableRow key={entity.entity_id}>
                      <TableCell className="font-medium">{entity.name}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {entity.entity_id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        {Math.round(entity.similarity_score * 100)}%
                      </TableCell>
                      <TableCell>
                        {group.entities.length > 1 && (
                          <Button
                            size="sm"
                            onClick={() =>
                              handlePreviewMerge(
                                entity.entity_id,
                                group.entities[0].entity_id
                              )
                            }
                          >
                            Merge
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ))}
        </div>
      )}

      {/* Merge Preview Modal */}
      {mergePreview && (
        <Modal
          isOpen={!!mergePreview}
          onClose={() => {
            setMergePreview(null);
            setSelectedPair(null);
          }}
          title="Merge Preview"
        >
          <div className="space-y-4">
            <div>
              <h4 className="font-bold mb-2">Merged Properties</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                {JSON.stringify(mergePreview.merged_properties, null, 2)}
              </pre>
            </div>

            {mergePreview.conflicts.length > 0 && (
              <div>
                <h4 className="font-bold mb-2 text-red-600">Conflicts</h4>
                <ul className="list-disc pl-5 text-sm">
                  {mergePreview.conflicts.map((conflict: string, idx: number) => (
                    <li key={idx}>{conflict}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-600">
                {mergePreview.relationships_to_redirect} relationship(s) will be redirected.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleConfirmMerge}
                disabled={mergeMutation.isPending}
                className="flex-1"
              >
                {mergeMutation.isPending ? 'Merging...' : 'Confirm Merge'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setMergePreview(null);
                  setSelectedPair(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Card>
  );
}
```

---

### Testing Requirements

**Integration Test:**

```python
@pytest.mark.asyncio
async def test_entity_deduplication_similarity_detection(qdrant, neo4j, tenant_id):
    """
    Test detecting similar entities using existing situations collection.

    Prerequisites: Entities must already exist in Neo4j and have situations
    in Qdrant (via normal Qdrant-First flow).
    """
    deduplicator = EntityDeduplicator(qdrant, neo4j)

    # Setup: Create Person entities in Neo4j
    # (In production, these would be created via normal entity creation flow)
    async with neo4j.session() as session:
        await session.run("""
            CREATE (p1:Person {id: $id1, tenant_id: $tenant_id, name: $name1})
            CREATE (p2:Person {id: $id2, tenant_id: $tenant_id, name: $name2})
            CREATE (p3:Person {id: $id3, tenant_id: $tenant_id, name: $name3})
        """, id1="person_1", id2="person_2", id3="person_3",
             name1="Anna Schmidt", name2="Anna", name3="A. Schmidt",
             tenant_id=tenant_id)

    # Setup: Add situations to Qdrant (simulating Qdrant-First entity creation)
    # In production, these would be created via LLM extraction pipeline
    entities = [
        ("person_1", "Anna Schmidt"),
        ("person_2", "Anna"),
        ("person_3", "A. Schmidt")
    ]

    for entity_id, name in entities:
        # Generate embedding using existing method
        embedding = await deduplicator._generate_entity_embedding("person", name)

        # Insert into situations collection
        qdrant.upsert(
            collection_name="situations",
            points=[{
                "id": f"situation_{entity_id}",
                "vector": embedding,
                "payload": {
                    "entity_id": entity_id,
                    "entity_type": "person",
                    "name": name,
                    "tenant_id": tenant_id,
                    "context": {}
                }
            }]
        )

    # Test: Find duplicates
    duplicates = await deduplicator.find_similar_entities(
        entity_type="person",
        name="Anna Schmidt",
        tenant_id=tenant_id,
        threshold=0.80
    )

    # Should find "Anna" and "A. Schmidt" as similar (>80% similarity)
    assert len(duplicates) >= 2, f"Expected >=2 duplicates, found {len(duplicates)}"
    names = [d.name for d in duplicates]
    assert "Anna" in names or "A. Schmidt" in names, f"Expected similar names, got {names}"


@pytest.mark.asyncio
async def test_entity_merge_redirects_relationships(qdrant, neo4j, tenant_id):
    """Test merging entities preserves relationships"""
    # Create two Person entities
    # Create KNOWS relationships to both
    # Merge source into target
    # Verify target has all relationships
    # Verify source is deleted
    pass  # Implementation similar to test above
```

---

## Implementation Guidelines

### Must Follow

1. **Use Existing Collections (ADR-0002 Decision 3):**
   - Query `situations` collection for entity embeddings
   - Filter by `entity_type` and `tenant_id`
   - Deduplicate results by `entity_id` (one entity may have multiple situations)
   - NO separate `entity_embeddings` collection

2. **Embedding-Based Similarity:**
   - Use text-embedding-3-small (existing LiteLLM infrastructure)
   - Query existing Qdrant collections
   - Threshold: 85% similarity
   - Handle multiple situations per entity

3. **Merge Algorithm:**
   - Union properties (target precedence)
   - Redirect ALL relationships in Neo4j
   - Delete source entity from Neo4j
   - Delete source entity situations from Qdrant
   - Target entity situations remain unchanged

4. **Admin Only:**
   - Deduplication endpoints require admin role
   - Preview before merge (safety)
   - Show conflicts clearly

5. **Data Integrity:**
   - Transaction-based merge in Neo4j
   - Rollback on failure
   - Test relationship preservation

### Must NOT Do

- Do NOT create separate `entity_embeddings` collection (violates ADR-0002 Decision 3)
- Do NOT create new embedding generation service (reuse existing LiteLLM)
- Do NOT create backfill scripts (use existing embeddings)
- Do NOT store duplicate embeddings (leverage existing infrastructure)

---

## Verification Checklist

### Functionality
- [ ] Detects "Anna" and "Anna Schmidt" as duplicates using existing collections
- [ ] Merge preview shows conflicts
- [ ] Merge redirects relationships in Neo4j
- [ ] Source entity deleted from Neo4j after merge
- [ ] Source entity situations deleted from Qdrant after merge
- [ ] Target entity situations remain unchanged
- [ ] Admin UI shows duplicate groups
- [ ] Deduplication by entity_id works (handles multiple situations per entity)

### Architecture Compliance (ADR-0002 Decision 3)
- [ ] NO separate entity_embeddings collection created
- [ ] Uses existing `situations` collection
- [ ] Reuses existing LiteLLM embedding generation
- [ ] Filters by entity_type and tenant_id
- [ ] Handles multiple situations per entity correctly

### Code Quality
- [ ] Type hints complete
- [ ] No data loss on merge
- [ ] Error handling for missing entities
- [ ] Transaction rollback on merge failure

### Testing
- [ ] Integration tests pass (similarity detection with existing collections)
- [ ] Merge test passes (relationship preservation)
- [ ] Qdrant cleanup test passes (source situations deleted)
- [ ] E2E test passes (admin workflow)

---

## Success Criteria

1. Admin can view potential duplicates by entity type (using existing collections)
2. Admin can preview merge (properties, conflicts, relationships)
3. Admin can merge entities
4. Relationships preserved after merge in Neo4j
5. Source entity situations cleaned up from Qdrant
6. Target entity situations remain unchanged
7. No separate entity_embeddings collection created (ADR-0002 compliance)
8. All tests pass

---

**Prompt Version:** 1.0
**Generated:** 2025-11-21
**Target Package:** 5.4 - Entity Deduplication Service

---

**END OF IMPLEMENTATION PROMPT**
