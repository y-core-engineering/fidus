# Implementation Prompt: 3.5 - Interactive Graph Visualization UI

**Package:** 3.5
**Epic:** Core Relationships & Graph Visualization
**Priority:** 🔴 CRITICAL
**Context Document:** `/docs/prototypes/fidus-memory/migration-v3-wbs.md` (Lines 770-825)

---

## Role

You are a **Senior Frontend Engineer** specializing in data visualization, graph algorithms, interactive UI, and performance optimization for large datasets.

---

## Context & Background

**Current State:**
- ✅ Package 1.1 (Qdrant-First) completed
- ✅ Package 1.2 (User entity) completed
- ✅ Package 2.1, 2.2, 2.3 (Person, Organization, Goal entities) completed
- ✅ Package 3.1, 3.2, 3.3, 3.4 (KNOWS, WORKS_AT, PURSUES, MEMBER_OF relationships) completed
- ❌ No unified graph visualization showing all entities and relationships
- ❌ No interactive exploration tools (search, filter, zoom, export)

**Migration Goal:**
- Build comprehensive graph visualization showing complete knowledge graph
- Support all entity types: User, Person, Organization, Goal
- Support all relationship types: KNOWS, WORKS_AT, PURSUES, MEMBER_OF
- Implement interactive controls: zoom, pan, drag nodes, click for details
- Add filtering by entity type, relationship type, time range
- Add search with node highlighting
- Support export as image (PNG) and data (JSON)
- Optimize performance for graphs with 50-200 nodes

**Architecture References:**
- React Flow Documentation: https://reactflow.dev/
- Graph Layout Algorithms: Force-directed, hierarchical, circular
- Performance: Virtualization, lazy loading, clustering

---

## Your Task

Implement **Interactive Graph Visualization UI** according to the specifications below.

**User Story:**
As a user, I want to explore my entire knowledge graph visually to discover connections and patterns I didn't know existed.

**Acceptance Criteria:**
1. Frontend: Full graph visualization with all entity types and relationships
2. Frontend: Interactive: zoom, pan, drag nodes, click for details
3. Frontend: Filter by entity type, relationship type, time range
4. Frontend: Search highlights matching nodes
5. Frontend: Export graph as image (PNG) or data (JSON)
6. Tests: Render graph with 50+ nodes, interact smoothly (<2s load, 60fps)
7. Documentation: Graph navigation guide with screenshots

---

## Technical Specification

### API Backend (Minimal)

**File: `packages/api/fidus/memory/routes/graph_routes.py`**

```python
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

from fidus.dependencies import get_neo4j_driver, get_current_user

router = APIRouter(prefix="/api/memory/graph", tags=["graph"])


class GraphNode(BaseModel):
    id: str
    type: str  # User, Person, Organization, Goal
    label: str
    properties: dict


class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    type: str  # KNOWS, WORKS_AT, PURSUES, MEMBER_OF
    label: str
    properties: dict


class GraphResponse(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]


@router.get("", response_model=GraphResponse)
async def get_user_graph(
    user_id: str,
    depth: int = 2,
    entity_types: Optional[str] = None,  # Comma-separated
    relationship_types: Optional[str] = None,  # Comma-separated
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    neo4j = Depends(get_neo4j_driver),
    current_user = Depends(get_current_user)
):
    """
    Get user's knowledge graph with configurable filters.

    Args:
        user_id: User entity ID
        depth: Graph traversal depth (1-3, default 2)
        entity_types: Filter entities (e.g., "Person,Organization")
        relationship_types: Filter relationships (e.g., "KNOWS,WORKS_AT")
        date_from: Filter by relationship observed_at >= date
        date_to: Filter by relationship observed_at <= date

    Returns:
        Graph with nodes and edges in React Flow format
    """
    depth = min(max(depth, 1), 3)  # Clamp between 1-3

    # Build Cypher query with filters
    entity_filter = ""
    if entity_types:
        types = entity_types.split(",")
        labels = " OR ".join([f"n:{t}" for t in types])
        entity_filter = f"AND ({labels})"

    rel_filter = ""
    if relationship_types:
        types = relationship_types.split(",")
        rel_types = "|".join(types)
        rel_filter = f"[r:{rel_types}]"
    else:
        rel_filter = "[r]"

    date_filter = ""
    if date_from:
        date_filter += f" AND r.observed_at >= datetime('{date_from.isoformat()}')"
    if date_to:
        date_filter += f" AND r.observed_at <= datetime('{date_to.isoformat()}')"

    query = f"""
    MATCH path = (u:User {{id: $user_id}})-{rel_filter}*1..{depth}-(n)
    WHERE 1=1 {entity_filter} {date_filter}
    WITH u, relationships(path) as rels, nodes(path) as nodes
    UNWIND nodes as node
    WITH COLLECT(DISTINCT node) as all_nodes, COLLECT(DISTINCT rels) as all_rels
    UNWIND all_rels as rel_list
    UNWIND rel_list as rel
    RETURN all_nodes, COLLECT(DISTINCT rel) as all_relationships
    """

    try:
        async with neo4j.session() as session:
            result = await session.run(query, user_id=user_id)
            record = await result.single()

            if not record:
                return GraphResponse(nodes=[], edges=[])

            nodes = []
            for node in record["all_nodes"]:
                node_type = list(node.labels)[0]
                nodes.append(GraphNode(
                    id=node["id"],
                    type=node_type,
                    label=node.get("name") or node.get("description") or node["id"],
                    properties=dict(node)
                ))

            edges = []
            for rel in record["all_relationships"]:
                edges.append(GraphEdge(
                    id=rel.id,
                    source=rel.start_node["id"],
                    target=rel.end_node["id"],
                    type=rel.type,
                    label=rel.get("role") or rel.type.lower().replace("_", " "),
                    properties=dict(rel)
                ))

            return GraphResponse(nodes=nodes, edges=edges)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

---

### Frontend Implementation

**Main Component: `packages/web/src/components/memory/GraphVisualization.tsx`**

```typescript
'use client';

import { useEffect, useState, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  NodeTypes,
  EdgeTypes,
  Panel,
  ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';

import { GraphControls } from './GraphControls';
import { GraphNodeDetail } from './GraphNodeDetail';
import { getGraph } from '@/lib/api/memory';
import { User, Users, Building2, Target } from 'lucide-react';

// Custom node types with different styles
const UserNode = ({ data }: any) => (
  <div className="px-4 py-3 bg-red-500 text-white rounded-full border-2 border-red-700 flex items-center gap-2 shadow-lg">
    <User size={20} />
    <span className="font-semibold">{data.label}</span>
  </div>
);

const PersonNode = ({ data }: any) => (
  <div className="px-4 py-3 bg-teal-400 text-white rounded-full border-2 border-teal-600 flex items-center gap-2 shadow-md">
    <Users size={18} />
    <span className="font-medium">{data.label}</span>
  </div>
);

const OrganizationNode = ({ data }: any) => (
  <div className="px-4 py-3 bg-blue-500 text-white rounded-lg border-2 border-blue-700 flex items-center gap-2 shadow-md">
    <Building2 size={18} />
    <span className="font-medium">{data.label}</span>
  </div>
);

const GoalNode = ({ data }: any) => (
  <div className="px-4 py-3 bg-purple-500 text-white rounded-lg border-2 border-purple-700 flex items-center gap-2 shadow-md transform rotate-45">
    <div className="transform -rotate-45 flex items-center gap-2">
      <Target size={18} />
      <span className="font-medium">{data.label}</span>
    </div>
  </div>
);

const nodeTypes: NodeTypes = {
  User: UserNode,
  Person: PersonNode,
  Organization: OrganizationNode,
  Goal: GoalNode,
};

// Custom edge styles
const getEdgeStyle = (type: string) => {
  switch (type) {
    case 'KNOWS':
      return { stroke: '#888', strokeWidth: 2 };
    case 'WORKS_AT':
      return { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5,5' };
    case 'PURSUES':
      return { stroke: '#a855f7', strokeWidth: 3 };
    case 'MEMBER_OF':
      return { stroke: '#22c55e', strokeWidth: 2, strokeDasharray: '3,3' };
    default:
      return { stroke: '#999', strokeWidth: 1 };
  }
};

interface GraphVisualizationProps {
  userId: string;
}

function GraphVisualizationInner({ userId }: GraphVisualizationProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    depth: 2,
    entityTypes: [] as string[],
    relationshipTypes: [] as string[],
    searchQuery: ''
  });

  useEffect(() => {
    loadGraph();
  }, [userId, filters.depth, filters.entityTypes, filters.relationshipTypes]);

  async function loadGraph() {
    setLoading(true);
    try {
      const data = await getGraph(
        userId,
        filters.depth,
        filters.entityTypes,
        filters.relationshipTypes
      );

      // Transform to React Flow format with layout
      const flowNodes = layoutNodes(data.nodes);
      const flowEdges = data.edges.map((edge: any) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        type: 'smoothstep',
        style: getEdgeStyle(edge.type),
        data: edge.properties,
        animated: edge.type === 'PURSUES' // Animate goal relationships
      }));

      setNodes(flowNodes);
      setEdges(flowEdges);
    } catch (error) {
      console.error('Failed to load graph:', error);
    } finally {
      setLoading(false);
    }
  }

  function layoutNodes(apiNodes: any[]): Node[] {
    // Force-directed layout (simple version)
    // For production, consider using d3-force or elk.js
    const centerX = 500;
    const centerY = 400;
    const radius = 300;

    return apiNodes.map((node, idx) => {
      const angle = (idx * 2 * Math.PI) / apiNodes.length;
      const isUser = node.type === 'User';

      return {
        id: node.id,
        type: node.type,
        position: isUser
          ? { x: centerX, y: centerY }  // Center user
          : {
              x: centerX + radius * Math.cos(angle),
              y: centerY + radius * Math.sin(angle)
            },
        data: {
          label: node.label,
          ...node.properties
        },
        draggable: true
      };
    });
  }

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onSearchChange = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));

    // Highlight matching nodes
    if (query) {
      setNodes(nodes =>
        nodes.map(node => ({
          ...node,
          style: {
            ...node.style,
            boxShadow: node.data.label.toLowerCase().includes(query.toLowerCase())
              ? '0 0 20px 5px rgba(255, 215, 0, 0.8)'
              : undefined
          }
        }))
      );
    } else {
      setNodes(nodes =>
        nodes.map(node => ({
          ...node,
          style: { ...node.style, boxShadow: undefined }
        }))
      );
    }
  }, [setNodes]);

  const onExportPNG = useCallback(() => {
    // Use html-to-image or similar library
    const element = document.querySelector('.react-flow');
    if (!element) return;

    import('html-to-image').then(({ toPng }) => {
      toPng(element as HTMLElement)
        .then(dataUrl => {
          const link = document.createElement('a');
          link.download = `knowledge-graph-${new Date().toISOString()}.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch(err => console.error('Export failed:', err));
    });
  }, []);

  const onExportJSON = useCallback(() => {
    const data = {
      nodes: nodes.map(n => ({ id: n.id, type: n.type, label: n.data.label })),
      edges: edges.map(e => ({ source: e.source, target: e.target, type: e.data?.type }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `knowledge-graph-${new Date().toISOString()}.json`;
    link.href = url;
    link.click();
  }, [nodes, edges]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading graph...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.1}
          maxZoom={4}
        >
          <Background />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              switch (node.type) {
                case 'User': return '#ef4444';
                case 'Person': return '#14b8a6';
                case 'Organization': return '#3b82f6';
                case 'Goal': return '#a855f7';
                default: return '#999';
              }
            }}
          />

          <Panel position="top-left">
            <GraphControls
              filters={filters}
              onFilterChange={setFilters}
              onSearchChange={onSearchChange}
              onExportPNG={onExportPNG}
              onExportJSON={onExportJSON}
            />
          </Panel>
        </ReactFlow>
      </div>

      {selectedNode && (
        <div className="w-96 border-l bg-white overflow-y-auto">
          <GraphNodeDetail
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
          />
        </div>
      )}
    </div>
  );
}

export function GraphVisualization(props: GraphVisualizationProps) {
  return (
    <ReactFlowProvider>
      <GraphVisualizationInner {...props} />
    </ReactFlowProvider>
  );
}
```

**Controls Component: `packages/web/src/components/memory/GraphControls.tsx`**

```typescript
'use client';

import { Card, TextField, Button } from '@fidus/ui';
import { Search, Download, Image } from 'lucide-react';

interface GraphControlsProps {
  filters: {
    depth: number;
    entityTypes: string[];
    relationshipTypes: string[];
    searchQuery: string;
  };
  onFilterChange: (filters: any) => void;
  onSearchChange: (query: string) => void;
  onExportPNG: () => void;
  onExportJSON: () => void;
}

export function GraphControls({
  filters,
  onFilterChange,
  onSearchChange,
  onExportPNG,
  onExportJSON
}: GraphControlsProps) {
  const entityTypes = ['Person', 'Organization', 'Goal'];
  const relationshipTypes = ['KNOWS', 'WORKS_AT', 'PURSUES', 'MEMBER_OF'];

  return (
    <Card className="p-4 space-y-4 w-80">
      <h3 className="font-semibold text-lg">Graph Controls</h3>

      {/* Search */}
      <div>
        <label className="block text-sm font-medium mb-1">Search</label>
        <TextField
          placeholder="Search nodes..."
          value={filters.searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={<Search size={16} />}
        />
      </div>

      {/* Depth */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Depth: {filters.depth}
        </label>
        <input
          type="range"
          min="1"
          max="3"
          value={filters.depth}
          onChange={(e) => onFilterChange({ ...filters, depth: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Entity Type Filters */}
      <div>
        <label className="block text-sm font-medium mb-2">Entity Types</label>
        <div className="space-y-1">
          {entityTypes.map(type => (
            <label key={type} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.entityTypes.length === 0 || filters.entityTypes.includes(type)}
                onChange={(e) => {
                  const newTypes = e.target.checked
                    ? [...filters.entityTypes, type]
                    : filters.entityTypes.filter(t => t !== type);
                  onFilterChange({ ...filters, entityTypes: newTypes });
                }}
              />
              <span className="text-sm">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Relationship Type Filters */}
      <div>
        <label className="block text-sm font-medium mb-2">Relationship Types</label>
        <div className="space-y-1">
          {relationshipTypes.map(type => (
            <label key={type} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.relationshipTypes.length === 0 || filters.relationshipTypes.includes(type)}
                onChange={(e) => {
                  const newTypes = e.target.checked
                    ? [...filters.relationshipTypes, type]
                    : filters.relationshipTypes.filter(t => t !== type);
                  onFilterChange({ ...filters, relationshipTypes: newTypes });
                }}
              />
              <span className="text-sm">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Export */}
      <div className="border-t pt-4 space-y-2">
        <Button onClick={onExportPNG} className="w-full" variant="outline">
          <Image size={16} className="mr-2" />
          Export as PNG
        </Button>
        <Button onClick={onExportJSON} className="w-full" variant="outline">
          <Download size={16} className="mr-2" />
          Export as JSON
        </Button>
      </div>
    </Card>
  );
}
```

**Detail Panel: `packages/web/src/components/memory/GraphNodeDetail.tsx`**

```typescript
'use client';

import { Card, Button, Badge } from '@fidus/ui';
import { X } from 'lucide-react';
import { Node } from 'reactflow';

interface GraphNodeDetailProps {
  node: Node;
  onClose: () => void;
}

export function GraphNodeDetail({ node, onClose }: GraphNodeDetailProps) {
  return (
    <div className="p-4">
      <div className="flex items-start justify-between mb-4">
        <div>
          <Badge>{node.type}</Badge>
          <h3 className="text-lg font-semibold mt-2">{node.data.label}</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={20} />
        </Button>
      </div>

      <Card className="p-4 space-y-3">
        <h4 className="font-medium">Properties</h4>
        {Object.entries(node.data).map(([key, value]) => {
          if (key === 'label' || value === null || value === undefined) return null;
          return (
            <div key={key} className="text-sm">
              <span className="font-medium text-gray-600">{key}:</span>{' '}
              <span className="text-gray-900">
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </span>
            </div>
          );
        })}
      </Card>

      <div className="mt-4 space-y-2">
        <Button
          className="w-full"
          onClick={() => window.location.href = `/memory/${node.type.toLowerCase()}s/${node.id}`}
        >
          View Details
        </Button>
        <Button
          className="w-full"
          variant="outline"
          onClick={() => window.location.href = `/memory/${node.type.toLowerCase()}s/${node.id}/edit`}
        >
          Edit
        </Button>
      </div>
    </div>
  );
}
```

**API Client:**

```typescript
// packages/web/src/lib/api/memory.ts

export async function getGraph(
  userId: string,
  depth: number = 2,
  entityTypes: string[] = [],
  relationshipTypes: string[] = []
) {
  const params = new URLSearchParams({
    user_id: userId,
    depth: depth.toString(),
  });

  if (entityTypes.length > 0) {
    params.append('entity_types', entityTypes.join(','));
  }
  if (relationshipTypes.length > 0) {
    params.append('relationship_types', relationshipTypes.join(','));
  }

  const response = await fetch(
    `${API_BASE}/api/memory/graph?${params.toString()}`,
    { credentials: 'include' }
  );

  if (!response.ok) throw new Error('Failed to load graph');
  return response.json();
}
```

**Route: `packages/web/src/app/memory/graph/page.tsx`**

```typescript
'use client';

import { GraphVisualization } from '@/components/memory/GraphVisualization';
import { useUser } from '@/lib/hooks/useUser';

export default function GraphPage() {
  const { user } = useUser();

  if (!user) return <div>Loading...</div>;

  return (
    <div className="h-screen">
      <GraphVisualization userId={user.id} />
    </div>
  );
}
```

---

### Testing Requirements

**Performance Test:**

```typescript
// packages/web/tests/performance/graph-rendering.spec.ts

import { test, expect } from '@playwright/test';

test('Graph renders 200 nodes in <2 seconds', async ({ page }) => {
  await page.goto('/memory/graph');

  const startTime = Date.now();

  // Wait for graph to render
  await page.waitForSelector('.react-flow__node', { timeout: 5000 });

  const loadTime = Date.now() - startTime;

  console.log(`Graph loaded in ${loadTime}ms`);

  expect(loadTime).toBeLessThan(2000);

  // Count nodes
  const nodeCount = await page.locator('.react-flow__node').count();
  console.log(`Rendered ${nodeCount} nodes`);

  expect(nodeCount).toBeGreaterThan(0);
});


test('Graph interactions are smooth (60fps)', async ({ page }) => {
  await page.goto('/memory/graph');

  // Wait for load
  await page.waitForSelector('.react-flow__node');

  // Test drag performance
  const node = page.locator('.react-flow__node').first();
  const box = await node.boundingBox();
  if (!box) throw new Error('Node not found');

  // Drag node
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + 100, box.y + 100, { steps: 10 });
  await page.mouse.up();

  // Should be smooth (no jank)
  // In production, use Chrome DevTools Performance API to measure actual FPS
});
```

**E2E Test:**

```typescript
test('User can explore full graph workflow', async ({ page }) => {
  await page.goto('/memory/graph');

  // Step 1: Graph loads
  await expect(page.locator('.react-flow')).toBeVisible();

  // Step 2: Search for node
  await page.fill('input[placeholder="Search nodes..."]', 'Anna');

  // Verify highlighted (golden glow)
  const highlightedNode = page.locator('.react-flow__node:has-text("Anna")');
  await expect(highlightedNode).toHaveCSS('box-shadow', /rgba\(255, 215, 0/);

  // Step 3: Click node
  await highlightedNode.click();

  // Step 4: Detail panel opens
  const panel = page.locator('[data-testid="node-detail-panel"]');
  await expect(panel).toBeVisible();
  await expect(panel).toContainText('Person');
  await expect(panel).toContainText('Anna');

  // Step 5: Filter by entity type
  await page.uncheck('input[type="checkbox"]:has-text("Goal")');

  // Goal nodes should disappear
  const goalNodes = page.locator('.react-flow__node[data-type="Goal"]');
  await expect(goalNodes).toHaveCount(0);

  // Step 6: Export as PNG
  const downloadPromise = page.waitForEvent('download');
  await page.click('button:has-text("Export as PNG")');
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/knowledge-graph-.*\.png/);

  // Step 7: Export as JSON
  const downloadPromise2 = page.waitForEvent('download');
  await page.click('button:has-text("Export as JSON")');
  const download2 = await downloadPromise2;
  expect(download2.suggestedFilename()).toMatch(/knowledge-graph-.*\.json/);
});
```

---

## Implementation Guidelines

### Must Follow

1. **Performance:**
   - Lazy load nodes outside viewport (virtualization)
   - Use React Flow's built-in optimization features
   - Debounce search input (300ms)
   - Memoize node/edge transformations

2. **Accessibility:**
   - Keyboard navigation (Tab, Arrow keys)
   - Screen reader support (ARIA labels)
   - High contrast mode support

3. **Mobile Support:**
   - Touch gestures (pinch to zoom, pan)
   - Responsive layout (controls collapse on mobile)

### Must NOT Do

- ❌ Load entire graph at once (use depth limiting)
- ❌ Block main thread during layout calculation
- ❌ Skip error boundaries (graph library can crash)
- ❌ Hard-code colors/positions (use theme system)

---

## Dependencies & Prerequisites

- [x] Packages 3.1, 3.2, 3.3, 3.4: All relationships implemented
- [ ] Install: `npm install reactflow html-to-image`
- [ ] Neo4j: Full graph query endpoint operational

---

## Performance Targets

- Load time (50 nodes): <500ms
- Load time (200 nodes): <2s
- Interaction FPS: 60fps
- Memory usage: <200MB
- Search response: <100ms (debounced)

---

## Success Criteria

1. ✅ User can see entire knowledge graph in one view
2. ✅ All entity types rendered with distinct visuals
3. ✅ All relationship types shown with distinct styles
4. ✅ Search highlights matching nodes
5. ✅ Export works (PNG + JSON)
6. ✅ Performance targets met
7. ✅ Documentation includes navigation guide

---

**Prompt Version:** 1.0
**Generated:** 2025-11-21
**Target Package:** 3.5

---

**END OF IMPLEMENTATION PROMPT**
