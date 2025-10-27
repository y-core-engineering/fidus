# System Overview & Architecture Principles

**Version:** 2.0
**Date:** 2025-10-27
**Status:** Current

> **Navigation:** [← README](README.md) | [Next: Supervisors →](02-supervisor-architecture.md)

---

## 1. Executive Summary

Fidus is a **Privacy-First Multi-Agent System** for **proactive life orchestration**. The architecture is based on three core innovations:

1. **LLM-orchestrated instead of hard-coded:** Intelligent decisions through LLM, not imperative code
2. **Registry-based instead of static:** Components register dynamically, no compile-time dependencies
3. **Proactive instead of reactive:** >50% interactions without user request through Event-Driven + Opportunity Detection

### Technology Stack

- **Framework:** LangGraph (Graph-based Multi-Agent Orchestration)
- **LLM:** Local-First Hybrid (Ollama + Optional Cloud)
- **Protocol:** Model Context Protocol (MCP) for Agent Integration
- **Language:** TypeScript/Node.js
- **State:** Vector DB (Qdrant) + Graph DB (Neo4j) + Redis (Event Bus)

---

## 2. Architecture Principles

### 2.1 LLM-Orchestrated Architecture

**Problem:** Hard-coded business logic becomes too complex and inflexible when extended.

**Solution:** LLM makes runtime decisions based on dynamically generated context.

#### Example: Orchestrator Routing

```typescript
// ❌ NOT LIKE THIS (Hard-coded)
class Orchestrator {
  async route(request: string) {
    if (request.includes('meeting') || request.includes('termin')) {
      return await calendarSupervisor.execute(request);
    }
    if (request.includes('workout') || request.includes('training')) {
      return await healthSupervisor.execute(request);
    }
    // ... 50 more if-statements
  }
}

// ✅ LIKE THIS (LLM-orchestrated)
class Orchestrator {
  async route(request: string, context: UserContext) {
    const availableTools = this.supervisorRegistry.getToolDescriptions();

    const decision = await llm.complete({
      systemPrompt: this.generateSystemPrompt(availableTools),
      messages: [{ role: 'user', content: request }],
      tools: availableTools,
      toolChoice: 'auto'
    });

    // LLM has chosen Supervisor + Tool
    return await this.executeTool(decision.toolCalls[0]);
  }
}
```

**Advantages:**
- ✅ New Supervisors → no code change required
- ✅ Natural language processing instead of keyword matching
- ✅ Cross-domain reasoning possible
- ✅ User preferences automatically considered

### 2.2 Registry-Based Dynamic System

**Problem:** Static architectures require recompilation for new components.

**Solution:** All components register themselves at runtime in registries.

#### Registries in the System

```typescript
// Signal Registry: Agents register their data providers
class HealthSupervisor {
  async initialize() {
    await signalRegistry.registerProvider('health', [
      {
        name: 'workout_progress',
        description: 'Weekly workout progress',
        collector: async () => await this.getWorkoutProgress()
      }
    ]);
  }
}

// Event Registry: Agents register their event types
class CalendarSupervisor {
  async initialize() {
    await eventRegistry.registerEventTypes('calendar', [
      {
        type: 'calendar.meeting_cancelled',
        description: 'A meeting was cancelled',
        dataSchema: { meetingId: 'string', timeSlot: 'string' }
      }
    ]);
  }
}

// MCP Registry: External MCP Servers are auto-discovered
class MCPDiscoveryService {
  async watchForNewServers() {
    // Consul Service Discovery or File-Based Discovery
    consul.watch('mcp-server', async (service) => {
      await mcpRegistry.registerServer(service);

      // ← Orchestrator prompt is automatically regenerated!
    });
  }
}
```

**Advantages:**
- ✅ Hot-Reload: New agents without system restart
- ✅ Plugin-Architecture: Community can add agents
- ✅ Zero-Downtime Updates
- ✅ A/B-Testing of agent versions

### 2.3 Event-Driven Proactivity

**Problem:** Polling-based systems are inefficient and delayed.

**Solution:** Event-Driven Architecture with LLM-Relevance-Filtering.

#### Event Flow

```
External Event (e.g. Calendar API: meeting_cancelled)
           │
           ▼
┌──────────────────────────────────┐
│ Domain Supervisor                │
│ - Receives Webhook/Poll-Event    │
│ - Emits to Event Bus             │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Event Bus (Redis Pub/Sub)        │
│ - Global Event Routing           │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Proactivity Engine               │
│ - Generic Event Handler          │
│ - LLM decides: Relevant?         │
└──────────┬───────────────────────┘
           │
           ▼ (if relevant)
┌──────────────────────────────────┐
│ Notification Agent               │
│ - Smart Timing (Do Not Disturb)  │
│ - Delivery to User               │
└──────────────────────────────────┘
```

**Example: LLM-based Event Filtering**

```typescript
class ProactivityEngine {
  async handleEvent(event: Event) {
    const eventSpec = eventRegistry.getEventType(event.type);

    const decision = await llm.complete(`
Event: ${event.type}
Description: ${eventSpec.description}
Data: ${JSON.stringify(event.data)}

User-Context:
- Current Activity: ${userContext.currentActivity}
- Location: ${userContext.location}
- Do Not Disturb: ${userContext.doNotDisturb}

Question: Should Fidus react to this event?
If yes, how?

JSON: {
  shouldReact: boolean,
  priority: "urgent" | "high" | "medium" | "low",
  suggestedAction: string,
  reasoning: string
}
`);

    if (decision.shouldReact) {
      await notificationAgent.deliver({
        message: decision.suggestedAction,
        priority: decision.priority
      });
    }
  }
}
```

**Advantages:**
- ✅ Real-time reaction (< 1s)
- ✅ Intelligent filtering (LLM decides relevance)
- ✅ No hard-coded event handlers
- ✅ User context is considered

---

## 3. System Architecture

### 3.1 High-Level Components

```
┌─────────────────────────────────────────────────────────────┐
│                    FIDUS SYSTEM                              │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         USER INTERACTION LAYER                      │    │
│  │  • Chat Interface (Web, Mobile, Desktop)           │    │
│  │  • Voice Interface (Optional)                      │    │
│  │  • Notification System                             │    │
│  └─────────────────┬──────────────────────────────────┘    │
│                    │                                         │
│                    ▼                                         │
│  ┌────────────────────────────────────────────────────┐    │
│  │      ORCHESTRATOR (Central Intelligence)           │    │
│  │  • LLM-based Intent Detection                      │    │
│  │  • Dynamic Supervisor Routing                      │    │
│  │  • Multi-Agent Coordination                        │    │
│  │  • Response Synthesis                              │    │
│  └─────────────────┬──────────────────────────────────┘    │
│                    │                                         │
│        ┌───────────┼───────────┬───────────┐                │
│        ▼           ▼           ▼           ▼                │
│  ┌──────────────────────────────────────────────────┐      │
│  │      DOMAIN SUPERVISORS (LangGraph Agents)        │      │
│  ├──────────┬──────────┬──────────┬──────────┬──────┤      │
│  │Calendar  │ Health   │ Finance  │ Travel   │ Home │      │
│  ├──────────┼──────────┼──────────┼──────────┼──────┤      │
│  │Shopping  │ Comm     │ Learning │ Custom   │ ...  │      │
│  └──────────┴──────────┴──────────┴──────────┴──────┘      │
│        │           │           │           │                │
│        └───────────┼───────────┴───────────┘                │
│                    │                                         │
│  ════════════════════════════════════════════════════       │
│                    │                                         │
│  ┌─────────────────▼─────────────────────────────────┐     │
│  │    PROACTIVITY ENGINE (Background Service)        │     │
│  │  • Opportunity Detection Engine                   │     │
│  │  • Event Bus Listener                             │     │
│  │  • Notification Agent                             │     │
│  │  • Scheduler (Time-Based Triggers)                │     │
│  └───────────────────────────────────────────────────┘     │
│                    │                                         │
│                    ▼                                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │        SHARED INFRASTRUCTURE                         │   │
│  ├─────────────┬────────────┬────────────┬─────────────┤   │
│  │ Registries  │ Memory     │ Profiling  │ External    │   │
│  │ • Signal    │ • Vector   │ • User     │ • MCP       │   │
│  │ • Event     │ • Graph    │   Profile  │   Servers   │   │
│  │ • MCP       │ • Cache    │ • Implicit │ • Privacy   │   │
│  │ • Supervisor│ • Document │   Learning │   Proxy     │   │
│  └─────────────┴────────────┴────────────┴─────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Component Description

#### 3.2.1 Orchestrator
- **Role:** Central Intelligence, delegates to Supervisors
- **Technology:** LangGraph (Tool Calling Pattern)
- **Key Features:**
  - Intent Detection (LLM-based)
  - Dynamic Routing (Registry-based)
  - Multi-Supervisor Coordination
  - Response Synthesis

**See:** [03-orchestrator-architecture.md](03-orchestrator-architecture.md)

#### 3.2.2 Domain Supervisors
- **Role:** Specialized agents for life domains (Calendar, Health, Finance, etc.)
- **Technology:** LangGraph State Machines
- **Key Features:**
  - Multi-Step Reasoning
  - Sub-Agent Management
  - MCP Server Interface (outbound)
  - MCP Client (inbound for External MCP Servers)
  - Signal Providers & Event Emitters (Fidus-specific)

**See:** [02-supervisor-architecture.md](02-supervisor-architecture.md)

#### 3.2.3 Proactivity Engine
- **Role:** Proactive opportunities without user request
- **Technology:** Background Service (separate process)
- **Key Features:**
  - Signal Collection (dynamic via Registry)
  - Opportunity Detection (LLM-based)
  - Event-Driven Triggers
  - Smart Notification Delivery

**See:** [04-proactivity-engine.md](04-proactivity-engine.md)

#### 3.2.4 Registries
- **Role:** Dynamic Component Discovery & Hot-Reload
- **Key Registries:**
  - **Signal Registry:** Agents register data providers
  - **Event Registry:** Agents register event types
  - **MCP Registry:** External MCP Servers + Tools
  - **Supervisor Registry:** Available Supervisors + Capabilities

**See:** [05-registry-system.md](05-registry-system.md)

#### 3.2.5 User Profiling Service
- **Role:** Central management of User Preferences & Implicit Learning
- **Technology:** Graph Database (Primary) + Vector Database (Similarity)
- **Key Features:**
  - Schema-less Preference Storage (no fixed data structures)
  - Explicit + Learned + Inferred Preferences
  - Situational Context Learning (Vector Similarity)
  - Cross-Domain Learning possible
  - Community-Extensible (MCP Servers can define their own preferences)

**Architecture:**
- **Plugin-Architecture:** All components (Supervisors, Services, Databases) are plugins
- **Auto-Discovery:** File-based + NPM Package Discovery (Community-Extensible)
- **Dependency Resolution:** Plugins declare their own dependencies, PluginManager resolves them
- **Hot-Reload:** New plugins without system restart

**Integration:**
```typescript
// ════════════════════════════════════════════════════════
// PLUGIN ARCHITECTURE
// ════════════════════════════════════════════════════════

interface Plugin {
  name: string;
  version: string;
  type: 'supervisor' | 'service' | 'database' | 'integration';

  // Plugin registers its OWN services
  getServices(): ServiceProvider[];

  // Plugin has its OWN dependencies (optional)
  dependencies?: string[];  // Names of other plugins

  // Lifecycle
  initialize(): Promise<void>;
  shutdown?(): Promise<void>;
}

// ════════════════════════════════════════════════════════
// PLUGIN MANAGER (Discovery + Loading)
// ════════════════════════════════════════════════════════

class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private serviceRegistry: ServiceRegistry = new ServiceRegistry();

  async discoverPlugins(): Promise<void> {
    // 1. File-Based Discovery (Core Plugins)
    const pluginFiles = await glob('plugins/**/*.plugin.ts');

    // 2. NPM Package Discovery (Community Plugins)
    const npmPlugins = await this.discoverNpmPlugins();

    // 3. Load Plugins
    for (const file of pluginFiles) {
      const PluginClass = await import(file);
      await this.loadPlugin(new PluginClass.default());
    }
  }

  async loadPlugin(plugin: Plugin): Promise<void> {
    // Check Dependencies, Register Plugin, Register Services, Initialize
    // ...
  }
}

// ════════════════════════════════════════════════════════
// EXAMPLE: UserProfiling as Plugin
// ════════════════════════════════════════════════════════

export default class UserProfilingPlugin implements Plugin {
  name = 'user-profiling';
  version = '1.0.0';
  type = 'service';
  dependencies = ['neo4j', 'qdrant', 'redis'];  // Declares dependencies

  getServices(): ServiceProvider[] {
    return [
      {
        name: 'userProfile',
        dependencies: ['neo4j.graphDB', 'qdrant.vectorDB', 'redis.cache'],
        initialize: async (deps) => new UserProfileService(
          deps['neo4j.graphDB'],
          deps['qdrant.vectorDB'],
          deps['redis.cache']
        )
      }
    ];
  }

  async initialize(): Promise<void> {
    console.log('UserProfilingPlugin initialized');
  }
}

// ════════════════════════════════════════════════════════
// EXAMPLE: Database Plugins (Neo4j, Qdrant, Redis)
// ════════════════════════════════════════════════════════

export default class Neo4jPlugin implements Plugin {
  name = 'neo4j';
  type = 'database';

  getServices(): ServiceProvider[] {
    return [{
      name: 'neo4j.graphDB',
      initialize: async () => new Neo4jGraphDatabase({
        url: process.env.NEO4J_URL || 'bolt://localhost:7687'
      })
    }];
  }

  async initialize(): Promise<void> {
    console.log('Neo4jPlugin initialized');
  }
}

// ════════════════════════════════════════════════════════
// EXAMPLE: Supervisor as Plugin
// ════════════════════════════════════════════════════════

export default class HealthSupervisorPlugin implements Plugin {
  name = 'health-supervisor';
  type = 'supervisor';
  dependencies = ['user-profiling'];

  getServices(): ServiceProvider[] {
    return [{
      name: 'healthSupervisor',
      dependencies: ['userProfile'],
      initialize: async (deps) => new HealthSupervisor(deps['userProfile'])
    }];
  }

  async initialize(): Promise<void> {
    // Register signals & events
    await signalRegistry.registerProvider('health', [...]);
    await eventRegistry.registerEventTypes('health', [...]);
  }
}

// ════════════════════════════════════════════════════════
// BOOTSTRAP
// ════════════════════════════════════════════════════════

const pluginManager = new PluginManager();

// Auto-Discovery
await pluginManager.discoverPlugins();

// Service Access
const userProfile = pluginManager.getService('userProfile');
const healthSupervisor = pluginManager.getService('healthSupervisor');

await userProfile.set(userId, 'health.workout_goal', 4);
```

**Advantages:**
- ✅ **True Modularity:** Each component is self-contained
- ✅ **Community-Extensible:** NPM packages are automatically discovered
- ✅ **Hot-Reload:** New plugins without code restart
- ✅ **Testable:** Plugins can be tested in isolation
- ✅ **Deployment-Flexible:** Plugins can run in-process (Community) or as separate services (Cloud)

---

##### 3.2.5.1 Plugin Dependency Resolution

**Problem:**
Plugins have dependencies (e.g. `UserProfilingPlugin` needs `neo4j`, `qdrant`, `redis`). These must be loaded in correct order.

**Architecture Decisions:**

| Decision | Rationale |
|----------|-----------|
| **Topological Sorting** | Guarantees correct loading order (dependencies before dependents) |
| **Explicit Dependencies** | Plugins declare all dependencies (no implicit ones!) |
| **Fail-Fast** | Missing dependencies → error at startup (not at runtime) |
| **No Cycles** | Circular dependencies are forbidden (would cause deadlock) |
| **Optional Dependencies** | Via `optionalDependencies` array for non-critical dependencies |

**Principles:**

1. **Explicit Declaration:** Every plugin must declare all dependencies in the `dependencies` array
2. **Deterministic Order:** Same plugins → Same order (reproducible)
3. **Fail-Fast:** Errors at startup better than at runtime
4. **Lazy Services:** Plugins are loaded sequentially, but services can be lazily initialized

**Initialization Flow:**

```
1. PluginManager.discoverPlugins()
   └─ Scans file system + NPM packages
   └─ Result: List of plugin instances

2. Create dependency graph
   ┌─────────────────────────────────┐
   │ Nodes = Plugins                 │
   │ Edges = Dependencies            │
   │                                 │
   │ neo4j → (no dependencies)       │
   │ qdrant → (no dependencies)      │
   │ redis → (no dependencies)       │
   │ user-profiling → [neo4j, qdrant, redis]  │
   │ health-supervisor → [user-profiling]     │
   └─────────────────────────────────┘

3. Topological sorting (procedure description)
   a) Find all plugins without dependencies (In-Degree = 0)
      → neo4j, qdrant, redis

   b) Initialize these plugins sequentially
      → neo4j.initialize()
      → qdrant.initialize()
      → redis.initialize()

   c) Remove these plugins from graph
      → Remaining: user-profiling, health-supervisor

   d) Repeat steps a)-c)
      → user-profiling now has In-Degree = 0 (dependencies fulfilled)
      → user-profiling.initialize()

   e) Repeat again
      → health-supervisor now has In-Degree = 0
      → health-supervisor.initialize()

   f) Graph is empty → All plugins loaded

4. Result: Correct loading order
   → neo4j → qdrant → redis → user-profiling → health-supervisor
```

**Algorithm: Topological Sorting (procedure description)**

```
Input: List of plugins with dependencies

Step 1: Create dependency graph
- For each plugin P:
  - Create node for P
  - For each dependency D in P.dependencies:
    - Create edge D → P

Step 2: Calculate In-Degree
- For each node: Count incoming edges
- Example:
  - neo4j: In-Degree = 0 (no dependencies)
  - user-profiling: In-Degree = 3 (neo4j, qdrant, redis)

Step 3: Initialization queue
- Queue = all nodes with In-Degree = 0
- Result-List = empty

Step 4: Iterative processing
- WHILE queue not empty:
  1. Take node N from queue
  2. Add N to result list
  3. For each neighbor M of N:
     - Decrease In-Degree of M by 1
     - IF In-Degree of M now 0:
       - Add M to queue

Step 5: Circularity check
- IF result list smaller than number of plugins:
  - There is circular dependency!
  - Error with path of circularity

Output: Result list = Correct loading order
```

**Edge Cases:**

| Scenario | Behavior | Example |
|----------|----------|---------|
| **Missing Dependency** | Error at startup with list of all missing dependencies | Plugin A needs B, but B not found → Error: "Missing dependencies: [B]" |
| **Circular Dependency** | Error at startup with path of circularity | A → B → C → A → Error: "Circular dependency: A → B → C → A" |
| **Optional Dependency** | Plugin loads even if optional is missing | Plugin A has `optionalDependencies: ['B']` → A loads anyway |
| **Multiple independent plugins** | Order deterministic (e.g. alphabetical) | neo4j, qdrant, redis (no dependencies among each other) → Alphabetical: neo4j, qdrant, redis |

**Example Scenario:**

```typescript
// Plugin Dependencies
const plugins = [
  { name: 'health-supervisor', dependencies: ['user-profiling'] },
  { name: 'user-profiling', dependencies: ['neo4j', 'qdrant', 'redis'] },
  { name: 'neo4j', dependencies: [] },
  { name: 'qdrant', dependencies: [] },
  { name: 'redis', dependencies: [] },
  { name: 'calendar-supervisor', dependencies: ['user-profiling'] }
];

// Dependency Graph
//           ┌─────────────┐
//           │   neo4j     │
//           └──────┬──────┘
//                  │
//           ┌──────▼──────┐       ┌─────────────┐
//           │   qdrant    │       │    redis    │
//           └──────┬──────┘       └──────┬──────┘
//                  │                     │
//                  └──────┬──────────────┘
//                         │
//                  ┌──────▼─────────┐
//                  │ user-profiling │
//                  └──────┬─────────┘
//                         │
//            ┌────────────┴────────────┐
//            │                         │
//     ┌──────▼─────────┐    ┌─────────▼────────┐
//     │ health-        │    │ calendar-        │
//     │ supervisor     │    │ supervisor       │
//     └────────────────┘    └──────────────────┘

// Resulting loading order
1. neo4j          (In-Degree = 0)
2. qdrant         (In-Degree = 0)
3. redis          (In-Degree = 0)
4. user-profiling (In-Degree = 0 after steps 1-3)
5. calendar-supervisor (In-Degree = 0 after step 4)
6. health-supervisor   (In-Degree = 0 after step 4)

// Note: calendar-supervisor and health-supervisor could
// be loaded in any order (both In-Degree = 0)
// → Deterministic choice: Alphabetical
```

**Service-Level Dependencies:**

Plugins have **Plugin-Level Dependencies** (`dependencies`), but services have **Service-Level Dependencies** (in `ServiceProvider.dependencies`):

```typescript
// Plugin-Level: UserProfilingPlugin needs neo4j Plugin
dependencies: ['neo4j', 'qdrant', 'redis']

// Service-Level: userProfile Service needs neo4j.graphDB Service
getServices(): [{
  name: 'userProfile',
  dependencies: ['neo4j.graphDB', 'qdrant.vectorDB', 'redis.cache']
}]
```

**Difference:**
- **Plugin-Level:** Defines loading order of plugins
- **Service-Level:** Defines dependency injection at service initialization

---

**See:** [07-user-profiling.md](07-user-profiling.md)

#### 3.2.6 Memory Layer (Database Layer)

**Architecture Principle:** Polyglot persistence at logical level. Concrete implementations are interchangeable.

| Database-Type | Purpose | Use Cases |
|---------------|---------|-----------|
| **Vector Database** | Semantic Search & RAG | Memory Search, finding similar situations, Embedding Storage |
| **Graph Database** | User-Context & Relations | User Preferences, relations between persons/events/projects, Signal Dependencies |
| **Cache Database** | High-Speed Key-Value Store | Session Management, Rate Limiting, Event Bus (Pub/Sub), Distributed Locks |
| **Document Database** | Flexible JSON documents | User Config, Agent Settings, Audit Logs, LangGraph Checkpoints |

**Requirements:**
- **Local-First:** Community Edition must be able to store all data locally (no cloud dependency)
- **Multi-Tenancy:** Tenant isolation for Family/Team/Company tiers (Cloud/Enterprise)
- **Encryption-at-Rest:** Sensitive data encrypted (Cloud/Enterprise)
- **Backup & Restore:** Snapshot mechanisms for disaster recovery

**Design Decision:** We define WHICH database types are needed, not WHICH concrete products. Concrete recommendations (e.g. Qdrant, Neo4j, Redis, MongoDB) are implementation details that can vary depending on deployment scenario.

```typescript
// Logical interface (implementation-agnostic)
interface VectorDatabase {
  upsert(collection: string, vectors: VectorDocument[]): Promise<void>;
  search(collection: string, query: number[], filter?: Record<string, any>, topK?: number): Promise<VectorDocument[]>;
  delete(collection: string, ids: string[]): Promise<void>;
}

interface GraphDatabase {
  execute(query: string, params?: Record<string, any>): Promise<any[]>;
  createNode(labels: string[], properties: Record<string, any>): Promise<string>;
  findNeighbors(nodeId: string, relationshipType?: string, maxHops?: number): Promise<GraphNode[]>;
}

interface CacheDatabase {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttl?: number): Promise<void>;
  publish(channel: string, message: string): Promise<void>;
  subscribe(channel: string, handler: (message: string) => void): Promise<void>;
}

interface DocumentDatabase {
  insert(collection: string, document: Record<string, any>): Promise<string>;
  find(collection: string, query: Record<string, any>): Promise<Record<string, any>[]>;
  update(collection: string, id: string, updates: Record<string, any>): Promise<void>;
}
```

---

## 4. Data Flow Scenarios

### 4.1 Reactive Interaction (User Request)

```
User: "Find a free 2h slot for team meeting tomorrow"
           │
           ▼
┌──────────────────────────────────┐
│ Orchestrator                     │
│ 1. Intent Detection (LLM)        │
│    → "calendar_scheduling"       │
│                                  │
│ 2. Tool Selection (LLM)          │
│    → calendar_supervisor         │
│      .find_free_slots()         │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Calendar Supervisor (LangGraph)  │
│                                  │
│ Node 1: analyze_request          │
│ → "needs multi-person scheduling"│
│                                  │
│ Node 2: check_availability       │
│ → Calls Google Calendar MCP      │
│                                  │
│ Node 3: find_optimal_slot        │
│ → Sub-Agent: SmartSchedulingAgent│
│                                  │
│ Node 4: respond                  │
│ → "Tomorrow 2-4pm is optimal"    │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Orchestrator                     │
│ 3. Response Synthesis            │
│    → Formulate user-friendly     │
└──────────┬───────────────────────┘
           │
           ▼
User: "Tomorrow 2-4pm is optimal. Should I create the meeting?"
```

### 4.2 Proactive Interaction (Event-Driven)

```
External System: Google Calendar sends webhook
→ "Meeting at 2pm was cancelled"
           │
           ▼
┌──────────────────────────────────┐
│ Calendar Supervisor              │
│ - Webhook handler receives event │
│ - Emits to Event Bus             │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Proactivity Engine               │
│ - Event Handler (Generic)        │
│ - LLM asks: Relevant for user?   │
│   → YES: "2h free, user has      │
│     workout goal 4x/week"        │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Orchestrator                     │
│ - Coordinates Health + Calendar  │
│ - Generates suggestion           │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Notification Agent               │
│ - Smart Timing (not in meeting)  │
│ - Delivery: Push Notification    │
└──────────┬───────────────────────┘
           │
           ▼
User: "You have tomorrow 2-4pm free – perfect for workout!
       (Goal: 4x/week, current: 2x)"
```

### 4.3 Proactive Interaction (Time-Based)

```
Scheduler: Every day at 8:00am
           │
           ▼
┌──────────────────────────────────┐
│ Proactivity Engine               │
│ Opportunity Detection Engine     │
│                                  │
│ 1. Collect Signals (dynamic)     │
│    - calendar.today_events       │
│    - weather.forecast            │
│    - health.workout_progress     │
│    - finance.budget_status       │
│                                  │
│ 2. LLM Analysis (per domain)     │
│    → "Generate morning brief"    │
│                                  │
│ 3. Multi-Domain Opportunities    │
│    → Calendar: 3 meetings        │
│    → Health: 2/4 workouts        │
│    → Finance: Budget alert       │
└──────────┬───────────────────────┘
           │
           ▼
User: "Good morning! Your day:
       • 9am: Team meeting (Agenda prepared ✓)
       • 2pm: 1:1 with Maria
       • 6pm: Package arrives
       • Workout reminder: 2 more this week!
       • Budget alert: Restaurant +30% this month"
```

---

## 5. Deployment Models

### 5.1 Community Edition (Self-Hosted)

```
┌─────────────────────────────────┐
│ User's Device (Local)           │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Fidus Backend (Docker)      │ │
│ │ • Orchestrator              │ │
│ │ • Domain Supervisors        │ │
│ │ • Proactivity Engine        │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Ollama (Local LLM)          │ │
│ │ • Llama 3.1 8B              │ │
│ │ • Mistral 7B                │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Databases (Local)           │ │
│ │ • Qdrant (Vector)           │ │
│ │ • Neo4j (Graph)             │ │
│ │ • Redis (Cache/Events)      │ │
│ │ • SQLite (User Data)        │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

**Characteristics:**
- ✅ Zero-Knowledge: Data never leaves device
- ✅ No cloud costs
- ❌ Hardware requirements (16 GB RAM recommended)
- ❌ No mobile app (desktop/server only)

### 5.2 Cloud Edition (Managed)

```
┌─────────────────────────────────┐
│ Fidus Cloud (EU/US Regions)    │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ API Gateway                 │ │
│ │ • Rate Limiting             │ │
│ │ • Authentication            │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Orchestrator Cluster        │ │
│ │ • Auto-Scaling              │ │
│ │ • Load Balancing            │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Cloud LLM (GPT-4o, Claude)  │ │
│ │ • Via Privacy Proxy         │ │
│ │ • PII Filtering             │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Managed Databases           │ │
│ │ • Encrypted-at-Rest         │ │
│ │ • End-to-End Encryption     │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

**Characteristics:**
- ✅ No hardware requirements
- ✅ Mobile app support
- ✅ Better LLM performance (GPT-4o, Claude Sonnet)
- ❌ 29€/month
- ⚠️ End-to-End Encryption (Fidus cannot read data)

### 5.3 Enterprise Edition (Hybrid)

```
┌─────────────────────────────────┐  ┌─────────────────────────────┐
│ Customer's Private Cloud        │  │ Fidus Managed Services      │
│                                 │  │                             │
│ ┌─────────────────────────────┐ │  │ ┌─────────────────────────┐ │
│ │ Fidus Core (Air-Gapped)     │ │  │ │ Marketplace API         │ │
│ │ • All Components            │ │  │ │ • Agent Discovery       │ │
│ │ • Custom LLM (Fine-Tuned)   │ │  │ │ • Version Management    │ │
│ └─────────────────────────────┘ │  │ └─────────────────────────┘ │
│                                 │  │                             │
│ ┌─────────────────────────────┐ │  │ ┌─────────────────────────┐ │
│ │ Customer Databases          │ │  │ │ Support & Monitoring    │ │
│ │ • Bring-Your-Own            │ │  │ │ • Analytics (Opt-in)    │ │
│ └─────────────────────────────┘ │  │ └─────────────────────────┘ │
└─────────────────────────────────┘  └─────────────────────────────┘
        ↕ VPN/Private Link (optional)
```

**Characteristics:**
- ✅ Full control & customization
- ✅ Air-gapped deployment possible
- ✅ Custom privacy policies
- ✅ Multi-tenant (teams, departments)
- ✅ Dedicated support
- ❌ Custom pricing (from 5,000€/year)

---

## 6. Multi-User & Multi-Tenancy

### 6.1 Business Requirement

**Product Tiers:**
- **Individual:** 1 user (Community/Cloud)
- **Family:** Up to 5 users (Cloud)
- **Team:** Up to 20 users (Cloud)
- **Company:** Up to 100 users (Enterprise)

### 6.2 Tenant Architecture

```typescript
// Tenant = Logical Isolation Unit
interface Tenant {
  tenantId: string;                    // Unique ID
  type: 'individual' | 'family' | 'team' | 'company';
  owner: string;                       // Owner User ID
  members: TenantMember[];             // All members
  sharedResources: SharedResource[];   // Shared Agents/Data
  settings: TenantSettings;
}

interface TenantMember {
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  permissions: Permission[];
  joinedAt: Date;
}

interface SharedResource {
  resourceType: 'calendar' | 'budget' | 'shopping_list' | 'todo' | 'notes';
  resourceId: string;
  accessPolicy: 'read' | 'write' | 'admin';
  sharedWith: string[];  // User IDs
}
```

### 6.3 Multi-User Use Cases

#### 6.3.1 Family Calendar Coordination

```typescript
// User A: "Add meeting tomorrow at 2pm"
class CalendarSupervisor {
  async execute(userMessage: string, userContext: UserContext) {
    // Check: Does user have access to family calendar?
    if (userContext.tenant.type === 'family') {
      const sharedCalendar = userContext.sharedResources.find(
        r => r.resourceType === 'calendar' && r.resourceId === 'family_calendar'
      );

      if (sharedCalendar) {
        // Load family calendar (all members)
        const events = await this.getFamilyCalendar(userContext.tenant.tenantId);

        // Check conflicts with other family members
        const conflicts = this.checkConflicts(events, newEvent);

        if (conflicts.length > 0) {
          return `Conflict: Maria already has an appointment at 2-3pm. Different time?`;
        }
      }
    }

    // Permission check
    if (!userContext.permissions.includes('calendar.write')) {
      throw new PermissionError('User can only read calendar');
    }

    // Create event
    await this.createEvent(newEvent);
  }
}
```

#### 6.3.2 Shared Shopping List

```typescript
// Family Coordinator Agent
class FamilyCoordinator {
  async addToShoppingList(item: string, userId: string, tenantId: string) {
    // Update shared state
    await sharedState.update(`shopping_list:${tenantId}`, (list) => {
      list.items.push({
        item,
        addedBy: userId,
        timestamp: new Date()
      });
    });

    // Notify all family members (except initiator)
    const familyMembers = await this.getFamilyMembers(tenantId);
    for (const member of familyMembers.filter(m => m.userId !== userId)) {
      await notificationAgent.notify(member.userId, {
        message: `${userId} added "${item}" to shopping list`,
        type: 'family_update',
        priority: 'low'
      });
    }
  }
}
```

### 6.4 Tenant Isolation (Database-Level)

**Strategy 1: Collection/Table per Tenant**
```typescript
// Recommended for Vector DB, Graph DB
const collection = `vectors_${tenantId}`;
await vectorDB.upsert(collection, vectors);
```

**Strategy 2: Shared Collection + Filter**
```typescript
// Alternative for Document DB
await documentDB.insert('user_preferences', {
  tenantId: 'family_123',
  userId: 'user_456',
  preferences: { ... }
});

// Queries always with tenantId filter
await documentDB.find('user_preferences', { tenantId: 'family_123' });
```

**Strategy 3: Database per Tenant**
```typescript
// Enterprise: Dedicated database per customer
const db = getDatabaseForTenant(tenantId);
await db.insert('events', { ... });
```

### 6.5 SSO & Authentication (Company Tier)

```typescript
// Enterprise: SAML/OIDC Integration
interface SSOConfig {
  provider: 'okta' | 'azure_ad' | 'google_workspace';
  domain: string;              // company.com
  ssoEndpoint: string;
  certificate: string;
  autoProvisioning: boolean;   // Auto-create users on first login
}

class SSOAuthenticationService {
  async authenticateSAML(samlResponse: string): Promise<UserContext> {
    // Validate SAML Response
    const assertion = await this.validateSAML(samlResponse);

    // Extract user info
    const email = assertion.attributes['email'];
    const tenantId = await this.getTenantByDomain(email.split('@')[1]);

    // Auto-provision user (if enabled)
    let user = await db.users.findByEmail(email);
    if (!user && tenantId.ssoConfig.autoProvisioning) {
      user = await this.createUser({
        email,
        tenantId: tenantId.id,
        role: 'member',
        ssoProvider: 'saml'
      });
    }

    return { userId: user.id, tenantId: tenantId.id, ... };
  }
}
```

### 6.6 Multi-Tenancy Architecture Model

**Architecture Decision for Plugin-based System:**

#### 6.6.1 Basic Principle: Singleton Plugins with Tenant-aware Services

**Problem:**
In a plugin-based system, the question arises: How does multi-tenancy work?

**Variants:**
- **Option A:** One plugin per tenant (separate instances)
- **Option B:** One plugin for all tenants (singleton) + Tenant context in services

**Decision: Option B - Singleton Plugins**

| Aspect | Rationale |
|--------|-----------|
| **Resource Efficiency** | One plugin instance instead of N×Tenants instances |
| **Hot-Reload** | New tenant → No plugin reload needed |
| **Simplicity** | Plugin code is tenant-agnostic |
| **Scaling** | Services scale independently of plugins |

---

#### 6.6.2 Plugin Level (Tenant-agnostic)

**Plugins are singletons and know nothing about tenants:**

```typescript
// Plugin level: NO tenant logic
class UserProfilingPlugin implements Plugin {
  name = 'user-profiling';
  type = 'service';
  dependencies = ['neo4j', 'qdrant', 'redis'];

  // Plugin is initialized ONCE (not per tenant)
  async initialize(): Promise<void> {
    console.log('UserProfilingPlugin initialized (Singleton)');
  }

  // Services are provided (singleton factory)
  getServices(): ServiceProvider[] {
    return [{
      name: 'userProfile',
      dependencies: ['neo4j.graphDB', 'qdrant.vectorDB', 'redis.cache'],
      initialize: async (deps) => {
        // Service instance is also singleton
        // But: Service methods receive tenantId as parameter!
        return new UserProfileService(
          deps['neo4j.graphDB'],
          deps['qdrant.vectorDB'],
          deps['redis.cache']
        );
      }
    }];
  }
}
```

**Principle:**
- ✅ Plugin = Singleton (one instance for entire system)
- ✅ Service = Singleton (one instance per plugin)
- ✅ Tenant isolation at **method level** (tenantId as parameter)

---

#### 6.6.3 Service Level (Tenant-aware)

**Services receive tenant context with each call:**

```typescript
// Service level: Tenant-aware methods
class UserProfileService {
  constructor(
    private graphDB: GraphDatabase,
    private vectorDB: VectorDatabase,
    private cache: CacheDatabase
  ) {}

  // Each method receives tenantId as parameter
  async get(userId: string, key: string, tenantId: string): Promise<any> {
    // Database query with tenantId filter/collection
    return await this.graphDB.execute(
      `
      MATCH (u:User {id: $userId, tenantId: $tenantId})-[:HAS_PREFERENCE]->(p:Preference {key: $key})
      RETURN p.value
      `,
      { userId, tenantId, key }
    );
  }

  async set(userId: string, key: string, value: any, tenantId: string): Promise<void> {
    // Tenant-isolated storage
    await this.graphDB.execute(
      `
      MERGE (u:User {id: $userId, tenantId: $tenantId})
      MERGE (u)-[:HAS_PREFERENCE]->(p:Preference {key: $key, tenantId: $tenantId})
      SET p.value = $value, p.updatedAt = timestamp()
      `,
      { userId, tenantId, key, value }
    );
  }

  // Cross-tenant queries are explicitly forbidden
  async getAll(tenantId: string): Promise<any[]> {
    // Can only retrieve data from ONE tenant
    return await this.graphDB.execute(
      `MATCH (u:User {tenantId: $tenantId})-[:HAS_PREFERENCE]->(p:Preference) RETURN p`,
      { tenantId }
    );
  }
}
```

**Principle:**
- ✅ TenantId is **always** a parameter (never implicit!)
- ✅ Database queries **always** contain tenantId filter
- ✅ Cross-tenant queries are **explicitly prevented**

---

#### 6.6.4 Database-Level Isolation

**Three strategies (depending on database type):**

**Strategy 1: Collection/Table per Tenant** (Recommended for Vector DB, Document DB)

```typescript
// Procedure description:
1. Tenant ID is embedded in collection name
2. Each tenant has its own collection
3. Physical isolation (no filter needed)

// Example: Vector DB
const collection = `vectors_tenant_${tenantId}`;
await vectorDB.upsert(collection, vectors);

// Advantages:
- ✅ Physical isolation (no data leak possible)
- ✅ Performance (no filters, smaller collections)
- ✅ Backup/restore per tenant easy

// Disadvantages:
- ⚠️ Many tenants = Many collections (management overhead)
```

**Strategy 2: Shared Collection + TenantId Filter** (Recommended for Graph DB)

```typescript
// Procedure description:
1. All tenants use same collection/table
2. Each record has tenantId field
3. Queries MUST have tenantId filter (enforced!)

// Example: Graph DB
await graphDB.execute(
  `MATCH (u:User {tenantId: $tenantId}) RETURN u`,
  { tenantId }
);

// Enforcement: Service layer checks tenantId
class ServiceGuard {
  enforceQuery(query: string): void {
    if (!query.includes('tenantId')) {
      throw new Error('Query MUST include tenantId filter!');
    }
  }
}

// Advantages:
- ✅ Simple management (one collection)
- ✅ Cross-tenant analytics possible (with admin permission)

// Disadvantages:
- ⚠️ Data leak with wrong filter (risk!)
- ⚠️ Performance with many tenants (large collections)
```

**Strategy 3: Database per Tenant** (Enterprise tier only)

```typescript
// Procedure description:
1. Each tenant gets dedicated database instance
2. Complete physical isolation
3. Expensive, but maximum security

// Example: Enterprise customer
const db = getDatabaseForTenant(tenantId);
await db.insert('events', { ... });

// Advantages:
- ✅ Maximum isolation (dedicated instance)
- ✅ Compliance (HIPAA, SOC2) easier
- ✅ Performance guarantees per tenant

// Disadvantages:
- ⚠️ Expensive (N databases = N × costs)
- ⚠️ Management overhead (backups, updates)
```

**Our Strategy:**

| Tier | Database Type | Strategy |
|------|---------------|----------|
| **Individual** | All | Single-user (no tenantId needed) |
| **Family (5 users)** | Vector, Document | Collection per tenant |
| **Family (5 users)** | Graph, Cache | Shared + filter |
| **Team (20 users)** | Vector, Document | Collection per tenant |
| **Team (20 users)** | Graph, Cache | Shared + filter |
| **Company (100 users)** | All | Shared + filter |
| **Enterprise (500+ users)** | All | Database per tenant |

---

#### 6.6.5 Shared Resources (Family Calendar, Shared Shopping List)

**Problem:**
Family members want shared calendar. How is this modeled?

**Solution: Shared Resource with Access Control**

```typescript
// Shared resource model
interface SharedResource {
  resourceId: string;        // e.g. "family_calendar_123"
  resourceType: 'calendar' | 'shopping_list' | 'budget' | 'notes';
  tenantId: string;          // Belongs to this tenant
  ownerId: string;           // Creator

  // Access control
  accessPolicy: {
    [userId: string]: 'read' | 'write' | 'admin'
  };

  // Data
  data: any;  // Calendar events, shopping items, etc.
}

// Example: Family calendar
{
  resourceId: 'family_calendar_abc123',
  resourceType: 'calendar',
  tenantId: 'family_schmidt',
  ownerId: 'user_papa',

  accessPolicy: {
    'user_papa': 'admin',      // Can do everything
    'user_mama': 'write',      // Can read + write
    'user_kind1': 'read',      // Can only read
    'user_kind2': 'read'
  },

  data: {
    events: [
      { title: 'Family dinner', start: '2025-10-28T18:00:00Z', addedBy: 'user_mama' },
      { title: 'Daycare', start: '2025-10-29T08:00:00Z', addedBy: 'user_papa' }
    ]
  }
}
```

**Supervisor Access:**

```typescript
// CalendarSupervisor checks shared resources
class CalendarSupervisor {
  async execute(userMessage: string, userContext: UserContext) {
    const { userId, tenantId } = userContext;

    // 1. Personal calendar (always available)
    const personalEvents = await this.getPersonalCalendar(userId, tenantId);

    // 2. Shared calendars (if tenant)
    let sharedEvents = [];
    if (tenantId) {
      const sharedCalendars = await this.getSharedCalendars(tenantId);

      for (const sharedCal of sharedCalendars) {
        // Permission check
        const access = sharedCal.accessPolicy[userId];
        if (access) {
          sharedEvents.push(...sharedCal.data.events);
        }
      }
    }

    // 3. Aggregated view
    const allEvents = [...personalEvents, ...sharedEvents];

    // Conflict check across personal + shared events
    const conflicts = this.checkConflicts(allEvents, newEvent);

    if (conflicts.length > 0) {
      return `Conflict: ${conflicts[0].title} (${conflicts[0].owner}) overlaps.`;
    }

    // Create event (personal or shared?)
    if (userMessage.includes('Family')) {
      // Shared calendar
      await this.addToSharedCalendar(newEvent, 'family_calendar_abc123', userId);
    } else {
      // Personal calendar
      await this.addToPersonalCalendar(newEvent, userId, tenantId);
    }
  }
}
```

**Principle:**
- ✅ Shared resources have explicit access control
- ✅ Services aggregate personal + shared data
- ✅ Permission is checked on every access

---

#### 6.6.6 Supervisor Execution with Tenant Context

**All supervisor calls receive tenant context:**

```typescript
// Orchestrator calls supervisor with tenant context
class Orchestrator {
  async handleUserRequest(message: string, userId: string) {
    // 1. Load user context (incl. tenantId)
    const userContext = await this.getUserContext(userId);
    // userContext = { userId, tenantId: 'family_schmidt', role: 'member', ... }

    // 2. Call supervisor (with tenant context)
    const supervisor = pluginManager.getService('calendarSupervisor');
    const response = await supervisor.execute(message, userContext);

    return response;
  }
}

// Supervisor uses tenant context
class CalendarSupervisor {
  async execute(message: string, userContext: UserContext) {
    const { userId, tenantId } = userContext;

    // All service calls with tenantId
    const events = await userProfileService.get(userId, 'calendar.events', tenantId);

    // ...
  }
}
```

**Principle:**
- ✅ TenantContext is passed from Orchestrator to Supervisor
- ✅ Supervisor passes tenantId to services
- ✅ Services isolate data at database level

---

#### 6.6.7 Summary: Multi-Tenancy Layers

```
┌───────────────────────────────────────────┐
│ USER REQUEST                               │
└────────────────┬──────────────────────────┘
                 │ userId, tenantId
                 ▼
┌───────────────────────────────────────────┐
│ ORCHESTRATOR                               │
│ - Loads UserContext (incl. tenantId)      │
│ - Calls Supervisor with context           │
└────────────────┬──────────────────────────┘
                 │ UserContext
                 ▼
┌───────────────────────────────────────────┐
│ SUPERVISOR (Singleton)                     │
│ - Extracts tenantId from context          │
│ - Passes tenantId to services             │
└────────────────┬──────────────────────────┘
                 │ userId, tenantId
                 ▼
┌───────────────────────────────────────────┐
│ SERVICE (Singleton, Tenant-aware Methods) │
│ - Methods accept tenantId parameter       │
│ - Adds tenantId to DB queries             │
└────────────────┬──────────────────────────┘
                 │ Query with tenantId
                 ▼
┌───────────────────────────────────────────┐
│ DATABASE (Tenant-isolated)                 │
│ - Strategy 1: Collection per tenant       │
│ - Strategy 2: Shared + filter             │
│ - Strategy 3: Database per tenant         │
└───────────────────────────────────────────┘
```

**Key Principles:**
1. **Plugin Level:** Tenant-agnostic (singleton)
2. **Service Level:** Tenant-aware (tenantId as parameter)
3. **Database Level:** Tenant-isolated (collection/filter/database)
4. **Shared Resources:** Explicit access control
5. **Context Propagation:** tenantId is passed through all layers

---

## 7. Privacy & Security Architecture

### 7.1 Business Requirement

**Cloud Edition Promises:**
- **End-to-End Encryption:** Fidus cannot read user data in clear text
- **Privacy Proxy:** PII filtering before external API calls (e.g. Cloud LLM)
- **EU AI Act Compliance:** Transparency & audit logs

### 7.2 Privacy Proxy (Cloud Edition)

**Problem:** Cloud LLM (GPT-4, Claude) needs user context, but PII should not be shared.

**Solution:** Privacy Proxy filters/pseudonymizes PII before external API calls.

```typescript
class PrivacyProxy {
  async callExternalLLM(
    prompt: string,
    userContext: UserContext
  ): Promise<string> {
    // 1. PII Detection (Named Entity Recognition)
    const piiEntities = await this.detectPII(prompt);

    // 2. Pseudonymization
    let sanitizedPrompt = prompt;
    const pseudonymMap: Record<string, string> = {};

    for (const entity of piiEntities) {
      if (entity.type === 'PERSON' || entity.type === 'EMAIL' || entity.type === 'PHONE') {
        const pseudonym = this.generatePseudonym(entity.type);
        pseudonymMap[pseudonym] = entity.text;
        sanitizedPrompt = sanitizedPrompt.replace(entity.text, pseudonym);
      }
    }

    // 3. Audit log
    await auditLog.record({
      userId: userContext.userId,
      action: 'external_llm_call',
      piiFiltered: Object.keys(pseudonymMap),
      timestamp: new Date()
    });

    // 4. External API call
    const response = await externalLLM.complete(sanitizedPrompt);

    // 5. Re-identification (replace pseudonyms back)
    let finalResponse = response;
    for (const [pseudonym, originalText] of Object.entries(pseudonymMap)) {
      finalResponse = finalResponse.replace(pseudonym, originalText);
    }

    return finalResponse;
  }

  private async detectPII(text: string): Promise<PIIEntity[]> {
    // Use NER service (e.g. spaCy, Presidio, AWS Comprehend)
    return await nerService.detectEntities(text, [
      'PERSON', 'EMAIL', 'PHONE', 'ADDRESS', 'SSN', 'CREDIT_CARD'
    ]);
  }

  private generatePseudonym(type: string): string {
    // Consistent pseudonyms for same PII (session scope)
    return `[${type}_${randomUUID().slice(0, 8)}]`;
  }
}
```

**Example:**

```
User: "Create meeting with maria.mueller@example.com tomorrow at 2pm"

→ Privacy Proxy:
Original: "Create meeting with maria.mueller@example.com tomorrow at 2pm"
Sanitized: "Create meeting with [EMAIL_a3f2] tomorrow at 2pm"

→ External LLM (GPT-4):
Input: "Create meeting with [EMAIL_a3f2] tomorrow at 2pm"
Output: "I'll create a meeting with [EMAIL_a3f2] tomorrow at 2pm."

→ Privacy Proxy:
Re-identified: "I'll create a meeting with maria.mueller@example.com tomorrow at 2pm."
```

### 7.3 Encryption-at-Rest (Cloud Edition)

```typescript
class EncryptionService {
  // User-specific encryption key (derived from user password)
  async encrypt(data: any, userId: string): Promise<string> {
    const userKey = await this.deriveUserKey(userId);
    return await aes256gcm.encrypt(JSON.stringify(data), userKey);
  }

  async decrypt(encryptedData: string, userId: string): Promise<any> {
    const userKey = await this.deriveUserKey(userId);
    const decrypted = await aes256gcm.decrypt(encryptedData, userKey);
    return JSON.parse(decrypted);
  }

  // Key derivation (PBKDF2)
  private async deriveUserKey(userId: string): Promise<Buffer> {
    const masterKey = await this.getMasterKeyFromHSM();  // Hardware Security Module
    const userSalt = await db.users.getSalt(userId);
    return await pbkdf2(userId, userSalt + masterKey, 100000, 32, 'sha256');
  }
}
```

### 7.4 Audit Logs (EU AI Act Compliance)

```typescript
// Transparency layer
class TransparencyService {
  // User asks: "Why did you suggest this?"
  async explainDecision(notificationId: string): Promise<string> {
    const notification = await db.notifications.findById(notificationId);
    const llmPrompt = notification.metadata.llmPrompt;
    const llmResponse = notification.metadata.llmResponse;
    const signalsUsed = notification.metadata.signalsUsed;

    // Generate human-readable explanation
    const explanation = await llm.complete(`
You are Fidus. Explain to the user why you suggested the following action:

Original Prompt: ${llmPrompt}
LLM Response: ${llmResponse}
Signals Used: ${JSON.stringify(signalsUsed)}

Generate a clear, understandable explanation (2-3 sentences) in first-person style.
`);

    return explanation;
  }

  // EU AI Act: Audit log for all AI decisions
  async logAIDecision(decision: AIDecision) {
    await auditLog.record({
      timestamp: new Date(),
      userId: decision.userId,
      decisionType: decision.type,
      input: decision.input,
      output: decision.output,
      llmModel: decision.llmModel,
      reasoning: decision.reasoning,
      signalsUsed: decision.signalsUsed
    });
  }
}
```

---

## 8. Error Handling & Resilience

### 8.1 Resilience Patterns

#### 8.1.1 LLM Fallback Strategy

**Problem:** What happens when LLM is unavailable?

**Solution:** Graceful degradation with rule-based fallback.

```typescript
class ResilientOrchestrator {
  async handleUserRequest(message: string, userId: string): Promise<string> {
    try {
      // Primary: LLM-based routing
      const response = await llm.complete({
        systemPrompt: this.generateSystemPrompt(),
        messages: [{ role: 'user', content: message }],
        tools: this.getAvailableTools()
      });
      return response;
    } catch (error) {
      if (error.code === 'LLM_UNAVAILABLE' || error.code === 'TIMEOUT') {
        // Fallback: Rule-based router
        logger.warn('LLM unavailable, using fallback router');
        return await this.fallbackRouter(message, userId);
      }
      throw error;
    }
  }

  private async fallbackRouter(message: string, userId: string): Promise<string> {
    // Simple keyword-based routing as fallback
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('calendar') || lowerMessage.includes('termin') || lowerMessage.includes('meeting')) {
      return await calendarSupervisor.execute(message, userContext);
    }

    if (lowerMessage.includes('workout') || lowerMessage.includes('training') || lowerMessage.includes('fitness')) {
      return await healthSupervisor.execute(message, userContext);
    }

    // Default: Apologize
    return "System is currently overloaded. Please try again in a few minutes.";
  }
}
```

#### 8.1.2 Circuit Breaker for External MCP Servers

**Problem:** External MCP server is down → system should not hang.

**Solution:** Circuit Breaker Pattern.

```typescript
class MCPClient {
  private circuitBreaker: CircuitBreaker;

  constructor(serverUrl: string) {
    this.circuitBreaker = new CircuitBreaker({
      failureThreshold: 5,      // 5 failures → open
      successThreshold: 2,      // 2 successes → closed
      timeout: 10000,           // 10s timeout
      resetTimeout: 60000       // 1 min until retry
    });
  }

  async callTool(name: string, params: any): Promise<any> {
    return await this.circuitBreaker.execute(async () => {
      const response = await fetch(this.serverUrl, {
        method: 'POST',
        body: JSON.stringify({ tool: name, params }),
        signal: AbortSignal.timeout(10000)  // 10s timeout
      });

      if (!response.ok) {
        throw new Error(`MCP Server returned ${response.status}`);
      }

      return await response.json();
    });
  }
}

// Circuit Breaker State Machine
class CircuitBreaker {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failures = 0;
  private successes = 0;
  private lastFailureTime: Date | null = null;

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      // Check if reset timeout expired
      if (Date.now() - this.lastFailureTime.getTime() > this.config.resetTimeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await fn();

      // Success
      if (this.state === 'HALF_OPEN') {
        this.successes++;
        if (this.successes >= this.config.successThreshold) {
          this.state = 'CLOSED';
          this.failures = 0;
        }
      }

      return result;
    } catch (error) {
      // Failure
      this.failures++;
      this.lastFailureTime = new Date();

      if (this.failures >= this.config.failureThreshold) {
        this.state = 'OPEN';
        logger.error(`Circuit breaker opened after ${this.failures} failures`);
      }

      throw error;
    }
  }
}
```

#### 8.1.3 Retry Logic with Exponential Backoff

```typescript
class RetryableOperation {
  async executeWithRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;  // Last attempt failed
        }

        // Exponential backoff: 1s, 2s, 4s
        const delay = baseDelay * Math.pow(2, attempt);
        logger.warn(`Attempt ${attempt + 1} failed, retrying in ${delay}ms`);
        await sleep(delay);
      }
    }
  }
}
```

### 8.2 Monitoring & Observability

```typescript
// Distributed tracing (OpenTelemetry)
class TracedOrchestrator {
  async handleUserRequest(message: string, userId: string): Promise<string> {
    const span = tracer.startSpan('orchestrator.handle_request', {
      attributes: {
        userId,
        messageLength: message.length
      }
    });

    try {
      const response = await this.route(message, userId);
      span.setStatus({ code: SpanStatusCode.OK });
      return response;
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
      throw error;
    } finally {
      span.end();
    }
  }
}

// Metrics (Prometheus)
class MetricsService {
  private requestDuration = new Histogram({
    name: 'orchestrator_request_duration_seconds',
    help: 'Duration of orchestrator requests',
    labelNames: ['supervisor', 'status']
  });

  private llmTokensUsed = new Counter({
    name: 'llm_tokens_used_total',
    help: 'Total LLM tokens used',
    labelNames: ['model', 'prompt_type']
  });

  recordRequest(supervisor: string, duration: number, status: string) {
    this.requestDuration.labels(supervisor, status).observe(duration);
  }

  recordLLMUsage(model: string, promptType: string, tokens: number) {
    this.llmTokensUsed.labels(model, promptType).inc(tokens);
  }
}
```

---

## 9. User Onboarding & Learning

### 9.1 Onboarding Flow

**Problem:** New user has no data → agent is useless.

**Solution:** Guided onboarding with minimum viable data.

```typescript
class OnboardingService {
  async startOnboarding(userId: string): Promise<OnboardingState> {
    // Phase 1: Essential integrations (MUST)
    const essentialIntegrations = [
      {
        name: 'calendar',
        required: true,
        reason: 'Orchestrate appointments and find free slots',
        providers: ['google_calendar', 'outlook', 'apple_calendar']
      }
    ];

    // Phase 2: Optional integrations (NICE-TO-HAVE)
    const optionalIntegrations = [
      { name: 'email', reason: 'Prioritize and summarize emails' },
      { name: 'banking', reason: 'Budget tracking and savings goals' },
      { name: 'fitness', reason: 'Workout tracking and health insights' }
    ];

    // Phase 3: Initial preferences survey
    const preferencesQuestions = [
      {
        question: 'How often do you want to exercise per week?',
        type: 'number',
        defaultValue: 3,
        domain: 'health'
      },
      {
        question: 'Preferred seat category on flights?',
        type: 'select',
        options: ['Window', 'Aisle', 'No preference'],
        domain: 'travel'
      },
      {
        question: 'Dietary preference?',
        type: 'multi-select',
        options: ['Vegetarian', 'Vegan', 'Low-carb', 'None'],
        domain: 'health'
      }
    ];

    return {
      phase: 'integrations',
      essentialIntegrations,
      optionalIntegrations,
      preferencesQuestions
    };
  }

  // Implicit learning (first 2 weeks)
  async learnFromInteraction(userId: string, interaction: Interaction) {
    // User accepted flight with window seat → learn preference
    if (interaction.type === 'flight_booking' && interaction.accepted) {
      const seatPreference = interaction.data.seatType;

      // Store in graph DB
      await preferenceGraph.addEdge(userId, 'prefers_seat_type', seatPreference, {
        weight: 1,
        learnedAt: new Date(),
        source: 'implicit_learning'
      });
    }

    // User rejected low-carb meal → update preference
    if (interaction.type === 'meal_suggestion' && interaction.rejected) {
      const mealType = interaction.data.mealType;

      await preferenceGraph.addEdge(userId, 'dislikes_meal_type', mealType, {
        weight: 1,
        learnedAt: new Date(),
        source: 'implicit_learning'
      });
    }
  }
}
```

### 9.2 Cold Start Problem

**Strategy:** Generic defaults + progressive enhancement

```typescript
class ColdStartService {
  // Week 1: Generic defaults
  async getDefaultPreferences(userId: string): Promise<UserPreferences> {
    return {
      workoutGoal: 3,            // Industry average
      sleepGoal: 8,
      budgetAlertThreshold: 0.8, // 80% of budget
      notificationStyle: 'balanced',  // Not too aggressive
      proactivityLevel: 'medium'      // Not too pushy
    };
  }

  // Week 2-4: Learn from interactions
  async updatePreferencesFromBehavior(userId: string) {
    const interactions = await db.interactions.find({
      userId,
      timestamp: { $gte: last2Weeks }
    });

    // Analyze acceptance patterns
    const acceptanceByDomain = this.analyzeAcceptanceRate(interactions);

    // Adjust proactivity per domain
    for (const [domain, rate] of Object.entries(acceptanceByDomain)) {
      if (rate < 0.3) {
        // Low acceptance → reduce proactivity
        await opportunityDomains.updateFrequency(domain, 'reduce');
      } else if (rate > 0.8) {
        // High acceptance → increase proactivity
        await opportunityDomains.updateFrequency(domain, 'increase');
      }
    }
  }
}
```

---

## 10. Technology Choices & Rationale

### 10.1 Why LangGraph?

**Alternatives considered:**
- ❌ **CrewAI:** Too opinionated, less flexible
- ❌ **AutoGen:** Microsoft-centric, heavyweight
- ❌ **Langchain Agents:** Too low-level, lots of boilerplate
- ✅ **LangGraph:** Graph-based, state management, checkpoints, human-in-the-loop

**Decision reasons:**
- State management out-of-the-box
- Conditional edges for complex workflows
- Persistent checkpoints (resume after crash)
- Tool calling integration
- TypeScript support

### 10.2 Why MCP as Standard?

**Alternatives considered:**
- ❌ **Custom API:** Vendor lock-in, no ecosystem
- ❌ **Zapier/n8n Nodes:** Too workflow-focused
- ❌ **LangChain Tools:** Python only, less structured
- ✅ **MCP (Anthropic):** Open standard, growing ecosystem

**Decision reasons:**
- Anthropic-backed → long-term stability
- Growing community (GitHub trending)
- Transport-agnostic (stdio, HTTP, SSE)
- TypeScript + Python SDKs
- Resources + prompts (not just tools)

### 10.3 Why Ollama for Local LLM?

**Alternatives considered:**
- ❌ **llama.cpp:** Too low-level
- ❌ **text-generation-webui:** UI-focused
- ❌ **vLLM:** Server-focused, complex
- ✅ **Ollama:** User-friendly, Docker-ready

**Decision reasons:**
- Simple setup (brew install ollama)
- Integrated model management
- GPU support out-of-the-box
- OpenAI-compatible API
- Community models (Llama, Mistral, Phi, etc.)

---

## 11. Next Steps

For details on specific components:

1. [**Supervisor Architecture →**](02-supervisor-architecture.md)
   - How supervisors are built (LangGraph + MCP + Fidus features)
   - Sub-agent management
   - Signal providers & event emitters

2. [**Orchestrator Architecture →**](03-orchestrator-architecture.md)
   - Tool-based dynamic routing
   - Intent detection
   - Multi-supervisor coordination

3. [**Proactivity Engine →**](04-proactivity-engine.md)
   - Signals vs. events
   - Opportunity detection
   - Smart notifications

4. [**Registry System →**](05-registry-system.md)
   - Dynamic component registration
   - Hot-reload & auto-discovery
   - Prompt regeneration

5. [**MCP Integration →**](06-mcp-integration.md)
   - MCP client & server implementation
   - Community marketplace
   - Custom agent development

---

**Version History:**
- v2.1 (2025-10-27): Added sections 6-9 (Multi-User, Privacy & Security, Error Handling, Onboarding) + Database Layer clarified (logical level)
- v2.0 (2025-10-27): Revised with chat insights (LLM-orchestrated, Registry-based)
- v1.0 (2025-10-26): Initial draft
