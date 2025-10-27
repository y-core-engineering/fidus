# Registry System & Dynamic Updates

**Version:** 2.0
**Date:** 2025-10-27

> **Navigation:** [← Signals & Events](04-signals-events-proactivity.md) | [Back to README →](README.md)

---

## 0. Plugin Manager (Overarching)

### 0.1 Hierarchy: PluginManager Coordinates All Registries

The **PluginManager** is the central instance that manages and coordinates all registries:

```
┌─────────────────────────────────────────────┐
│           PluginManager                     │
├─────────────────────────────────────────────┤
│ Responsibilities:                           │
│ - Plugin Discovery (File-based, NPM)        │
│ - Dependency Resolution                     │
│ - Plugin Lifecycle (initialize, shutdown)   │
│ - Registry Coordination                     │
└────────────────┬────────────────────────────┘
                 │
                 ├─── SupervisorRegistry
                 │     └─ Manages Supervisors
                 │
                 ├─── SignalRegistry
                 │     └─ Manages Signal Providers
                 │
                 ├─── EventRegistry
                 │     └─ Manages Event Types
                 │
                 └─── ServiceRegistry
                       └─ Manages Services (UserProfile, etc.)
```

### 0.2 PluginManager Responsibilities

**1. Plugin Discovery**
- Discovers plugins via file system or NPM packages
- Example: `plugins/**/*.plugin.ts` or `@fidus-community/*`

**2. Dependency Resolution**
- Creates dependency graph of all plugins
- Determines load order (topological sorting)
- Prevents circular dependencies

**3. Plugin Lifecycle**
- Loads plugins in correct order
- Calls `plugin.initialize()`
- Registers services with ServiceRegistry
- Optional: Hot-reload for new plugins

**4. Registry Coordination**
- Plugins register themselves with different registries:
  - Supervisor plugins → SupervisorRegistry
  - Signal Providers → SignalRegistry
  - Event Types → EventRegistry
  - Services → ServiceRegistry

### 0.3 Flow: Plugin Loading

```
1. PluginManager.discoverPlugins()
   ├─ Scans file system: plugins/**/*.plugin.ts
   ├─ Scans NPM: node_modules/@fidus-community/*
   └─ List of plugin classes

2. Create dependency graph
   ├─ Plugin A depends on []
   ├─ Plugin B depends on ['A']
   └─ Plugin C depends on ['A', 'B']

3. Topological sorting
   └─ Order: A → B → C

4. Load plugins sequentially
   ├─ A.initialize()
   │  └─ Services registered with ServiceRegistry
   ├─ B.initialize() (can now use A services)
   │  └─ Services registered
   └─ C.initialize() (can use A+B services)
      └─ Services registered

5. Registries are filled
   ├─ SupervisorRegistry: [CalendarSupervisor, HealthSupervisor, ...]
   ├─ SignalRegistry: [calendar.free_slots, health.workout_progress, ...]
   ├─ EventRegistry: [calendar.meeting_cancelled, ...]
   └─ ServiceRegistry: [userProfile, calendarSupervisor, ...]
```

### 0.4 Example: PluginManager Concept

```typescript
// Conceptual example (logical level)
class PluginManager {
  // Registries (coordinated)
  private supervisorRegistry: SupervisorRegistry;
  private signalRegistry: SignalRegistry;
  private eventRegistry: EventRegistry;
  private serviceRegistry: ServiceRegistry;

  // Loaded plugins
  private plugins: Map<string, Plugin> = new Map();

  // Discovery: Find all plugins
  async discoverPlugins(): Promise<void> {
    // 1. File-based discovery
    const pluginFiles = /* scan file system */;

    // 2. NPM package discovery
    const npmPlugins = /* scan node_modules */;

    // 3. Load all
    for (const file of pluginFiles) {
      const PluginClass = /* import */;
      await this.loadPlugin(new PluginClass());
    }
  }

  // Loading: Loads a plugin
  async loadPlugin(plugin: Plugin): Promise<void> {
    // 1. Check dependencies
    for (const depName of plugin.dependencies || []) {
      if (!this.plugins.has(depName)) {
        throw new Error(`Missing dependency: ${depName}`);
      }
    }

    // 2. Initialize plugin
    await plugin.initialize();

    // 3. Register services
    for (const serviceProvider of plugin.getServices()) {
      await this.serviceRegistry.register(serviceProvider);
    }

    // 4. Store plugin
    this.plugins.set(plugin.name, plugin);

    console.log(`Plugin loaded: ${plugin.name}`);
  }

  // Access: Get service
  getService(name: string): any {
    return this.serviceRegistry.get(name);
  }
}
```

### 0.5 Relationship to Registries

The PluginManager **uses** the registries but is **overarching**:

- **PluginManager:** "I load plugins and coordinate everything"
- **SupervisorRegistry:** "I manage supervisors (which plugins register)"
- **SignalRegistry:** "I manage signal providers (which supervisors register)"
- **EventRegistry:** "I manage event types (which supervisors register)"
- **ServiceRegistry:** "I manage services (which plugins register)"

**Flow:**
```
Plugin is loaded
  ↓
Plugin.initialize() called
  ↓
Plugin registers itself with registries:
  - Supervisor? → SupervisorRegistry.register()
  - Signals? → SignalRegistry.registerProvider()
  - Events? → EventRegistry.registerEventTypes()
  - Services? → ServiceRegistry.register()
```

---

## 1. Why Registries?

### Problem: Static Architecture

```typescript
// ❌ HARD-CODED (not good!)
class Orchestrator {
  private supervisors = {
    calendar: new CalendarSupervisor(),
    health: new HealthSupervisor(),
    finance: new FinanceSupervisor()
    // New supervisors → code change required!
  };
}

// ❌ HARD-CODED Signal Collection
interface OpportunitySignals {
  health: { workout_progress: WorkoutData };
  calendar: { free_slots: TimeSlot[] };
  weather: { forecast: WeatherData };
  // New signals → interface change required!
}
```

### Solution: Registry-Based Architecture

```typescript
// ✅ DYNAMIC (good!)
class Orchestrator {
  private supervisorRegistry = new SupervisorRegistry();

  async registerSupervisor(supervisor: Supervisor) {
    await this.supervisorRegistry.register(supervisor);

    // Prompt regenerates automatically!
    this.cachedSystemPrompt = null;
  }
}

// ✅ DYNAMIC Signal Collection
class OpportunityDetectionEngine {
  async collectSignals(required: string[]) {
    const signals = {};

    for (const signalPath of required) {
      const provider = signalRegistry.getProvider(signalPath);
      signals[signalPath] = await provider.collector();
    }

    return signals;
  }
}
```

---

## 2. The 4 Core Registries

### 2.1 Supervisor Registry

**Purpose:** Available supervisors + their capabilities.

```typescript
interface SupervisorRegistryEntry {
  supervisor: Supervisor;
  name: string;
  description: string;
  tools: MCPTool[];
  resources?: MCPResource[];
  prompts?: MCPPrompt[];
  useCases: string[];
  version: string;
  enabled: boolean;
}

class SupervisorRegistry {
  private supervisors: Map<string, SupervisorRegistryEntry> = new Map();
  private listeners: ((event: RegistryEvent) => void)[] = [];

  async register(supervisor: Supervisor) {
    // 1. Initialize supervisor
    await supervisor.initialize();

    // 2. Create entry
    const entry: SupervisorRegistryEntry = {
      supervisor,
      name: supervisor.name,
      description: supervisor.description,
      tools: supervisor.tools,
      resources: supervisor.resources,
      prompts: supervisor.prompts,
      useCases: supervisor.useCases || [],
      version: supervisor.version || '1.0.0',
      enabled: true
    };

    // 3. Store in map
    this.supervisors.set(supervisor.name, entry);

    // 4. Emit event
    this.emit({
      type: 'supervisor_registered',
      data: { name: supervisor.name, entry }
    });

    logger.info(`Supervisor registered: ${supervisor.name}`);
  }

  get(name: string): Supervisor | undefined {
    return this.supervisors.get(name)?.supervisor;
  }

  getAll(): SupervisorRegistryEntry[] {
    return Array.from(this.supervisors.values()).filter(e => e.enabled);
  }

  // Event Listeners (for prompt regeneration)
  on(callback: (event: RegistryEvent) => void) {
    this.listeners.push(callback);
  }

  private emit(event: RegistryEvent) {
    this.listeners.forEach(listener => listener(event));
  }
}
```

### 2.2 Signal Registry

**Purpose:** Dynamic signal providers from supervisors.

```typescript
interface SignalProvider {
  name: string;
  description: string;
  dataSchema: Record<string, string>;
  collector: () => Promise<any>;  // ← Function that collects data!
  domain: string;
  relevantFor?: string[];
}

class SignalRegistry {
  private providers: Map<string, SignalProvider> = new Map();

  registerProvider(domain: string, signals: Omit<SignalProvider, 'domain'>[]) {
    for (const signal of signals) {
      const path = `${domain}.${signal.name}`;

      this.providers.set(path, {
        ...signal,
        domain
      });

      logger.debug(`Signal registered: ${path}`);
    }
  }

  getProvider(signalPath: string): SignalProvider {
    const provider = this.providers.get(signalPath);
    if (!provider) {
      throw new Error(`Signal provider not found: ${signalPath}`);
    }
    return provider;
  }

  getAllSignals(): SignalProvider[] {
    return Array.from(this.providers.values());
  }

  // Search signals by domain
  getSignalsForDomain(domain: string): SignalProvider[] {
    return Array.from(this.providers.values()).filter(p => p.domain === domain);
  }
}
```

**Usage:**

```typescript
// Supervisor registers signals
class HealthSupervisor {
  async initialize() {
    await signalRegistry.registerProvider('health', [
      {
        name: 'workout_progress',
        description: 'Weekly workout progress',
        dataSchema: { weeklyGoal: 'number', currentWorkouts: 'number', streak: 'number' },
        collector: async () => await this.getWorkoutProgress()  // ← This method will be called!
      }
    ]);
  }
}

// Proactivity Engine collects signals
class OpportunityDetectionEngine {
  async collectSignals(required: string[]) {
    const signals = {};

    for (const signalPath of required) {
      const provider = signalRegistry.getProvider(signalPath);  // ← Registry lookup
      signals[signalPath] = await provider.collector();         // ← Calls supervisor method!
    }

    return signals;
  }
}
```

### 2.3 Event Registry

**Purpose:** Available event types + metadata.

```typescript
interface EventTypeSpec {
  type: string;                 // e.g. "calendar.meeting_cancelled"
  description: string;
  dataSchema: Record<string, string>;
  suggestedHandlers?: string[]; // What to typically do
  domain: string;
}

class EventRegistry {
  private eventTypes: Map<string, EventTypeSpec> = new Map();

  registerEventTypes(domain: string, events: Omit<EventTypeSpec, 'domain'>[]) {
    for (const event of events) {
      const eventType = { ...event, domain };

      this.eventTypes.set(event.type, eventType);

      logger.debug(`Event type registered: ${event.type}`);
    }
  }

  getEventType(type: string): EventTypeSpec | undefined {
    return this.eventTypes.get(type);
  }

  getAllEventTypes(): EventTypeSpec[] {
    return Array.from(this.eventTypes.values());
  }

  // For LLM prompts: All events as descriptive list
  getEventTypesForPrompt(): string {
    return this.getAllEventTypes().map(event => `
### ${event.type}
${event.description}

Data: ${JSON.stringify(event.dataSchema)}
Typical reactions: ${event.suggestedHandlers?.join(', ') || 'N/A'}
`).join('\n---\n');
  }
}
```

**Usage:**

```typescript
// Supervisor registers event types
class CalendarSupervisor {
  async initialize() {
    await eventRegistry.registerEventTypes('calendar', [
      {
        type: 'calendar.meeting_cancelled',
        description: 'A meeting was cancelled',
        dataSchema: { meetingId: 'string', timeSlot: 'string', attendees: 'string[]' },
        suggestedHandlers: ['Inform user', 'Use free time for focus work']
      }
    ]);
  }
}

// Proactivity Engine uses Event Registry for LLM prompt
class ProactivityEngine {
  async handleEvent(event: Event) {
    const eventSpec = eventRegistry.getEventType(event.type);  // ← Registry lookup

    const decision = await llm.complete(`
Event: ${event.type}
Description: ${eventSpec.description}
Typical reactions: ${eventSpec.suggestedHandlers.join(', ')}

User Context: ${userContext}

Question: Should Fidus react? If yes, how?
`);

    if (decision.shouldReact) {
      await notificationAgent.deliver(decision.action);
    }
  }
}
```

### 2.4 MCP Registry

**Purpose:** External MCP servers + their tools.

```typescript
interface MCPServerEntry {
  name: string;
  description: string;
  transport: 'stdio' | 'http' | 'sse';
  serverUrl?: string;  // For HTTP/SSE
  command?: string;    // For stdio
  client: MCPClient;
  tools: MCPTool[];
  resources?: MCPResource[];
  prompts?: MCPPrompt[];
  version: string;
}

class MCPRegistry {
  private servers: Map<string, MCPServerEntry> = new Map();

  async registerServer(config: MCPServerConfig) {
    // 1. Connect MCP client
    const client = await MCPClient.connect({
      transport: config.transport,
      serverUrl: config.serverUrl,
      command: config.command
    });

    // 2. Query capabilities
    const tools = await client.listTools();
    const resources = await client.listResources();
    const prompts = await client.listPrompts();

    // 3. Create entry
    const entry: MCPServerEntry = {
      name: config.name,
      description: config.description,
      transport: config.transport,
      serverUrl: config.serverUrl,
      command: config.command,
      client,
      tools,
      resources,
      prompts,
      version: config.version || '1.0.0'
    };

    // 4. Store in map
    this.servers.set(config.name, entry);

    logger.info(`MCP server registered: ${config.name} (${tools.length} tools)`);
  }

  get(name: string): MCPServerEntry | undefined {
    return this.servers.get(name);
  }

  getAllServers(): MCPServerEntry[] {
    return Array.from(this.servers.values());
  }

  // All tools from all MCP servers
  getAllTools(): Array<{ server: string; tool: MCPTool }> {
    const allTools: Array<{ server: string; tool: MCPTool }> = [];

    for (const [serverName, entry] of this.servers.entries()) {
      for (const tool of entry.tools) {
        allTools.push({ server: serverName, tool });
      }
    }

    return allTools;
  }
}
```

---

## 3. Prompt Regeneration (Automatic!)

### 3.1 Orchestrator Prompt

**Concept:** When new supervisor is registered → Prompt regenerates itself.

```typescript
class Orchestrator {
  private supervisorRegistry: SupervisorRegistry;
  private cachedSystemPrompt: string | null = null;
  private promptVersion: number = 0;

  constructor() {
    this.supervisorRegistry = new SupervisorRegistry();

    // Event listener: Invalidate prompt on registry update
    this.supervisorRegistry.on((event) => {
      if (event.type === 'supervisor_registered') {
        this.cachedSystemPrompt = null;
        this.promptVersion++;

        logger.info(`System prompt invalidated (v${this.promptVersion})`);
      }
    });
  }

  private generateSystemPrompt(): string {
    if (this.cachedSystemPrompt) {
      return this.cachedSystemPrompt;
    }

    const supervisors = this.supervisorRegistry.getAll();

    this.cachedSystemPrompt = `
You are Fidus, a loyal personal AI agent.

## Available Supervisors (${supervisors.length})

${supervisors.map(s => `
### ${s.name}
${s.description}

**Capabilities:**
${s.tools.map(t => `- ${t.name}: ${t.description}`).join('\n')}
`).join('\n---\n')}

## Your Workflow
...
`;

    logger.debug(`System prompt regenerated (v${this.promptVersion})`);

    return this.cachedSystemPrompt;
  }

  async handleUserRequest(message: string, userId: string) {
    const systemPrompt = this.generateSystemPrompt();  // ← Cache or regenerate

    const response = await llm.complete({
      systemPrompt,
      messages: [{ role: 'user', content: message }],
      tools: this.generateToolsFromSupervisors()
    });

    return response;
  }
}
```

### 3.2 Supervisor Sub-Agent Prompt

**Same principle:** Supervisor prompts regenerate themselves with new sub-agents.

```typescript
class CalendarSupervisor {
  private subAgentRegistry: Map<string, MCPClientConnection> = new Map();
  private cachedLangGraphPrompt: string | null = null;

  async registerSubAgent(config: SubAgentConfig) {
    const client = await MCPClient.connect({ serverUrl: config.serverUrl });
    const tools = await client.listTools();

    this.subAgentRegistry.set(config.name, { client, description: config.description, tools });

    // ← INVALIDATE PROMPT!
    this.cachedLangGraphPrompt = null;

    logger.info(`Sub-agent registered: ${config.name}`);
  }

  private regenerateLangGraphPrompt(): string {
    if (this.cachedLangGraphPrompt) {
      return this.cachedLangGraphPrompt;
    }

    const subAgents = Array.from(this.subAgentRegistry.entries());

    this.cachedLangGraphPrompt = `
You are Calendar Supervisor.

## Available Sub-Agents (${subAgents.length})

${subAgents.map(([name, agent]) => `
### ${name}
${agent.description}

Capabilities:
${agent.tools.map(t => `- ${t.name}: ${t.description}`).join('\n')}
`).join('\n---\n')}

## Decision Logic
...
`;

    return this.cachedLangGraphPrompt;
  }

  // LangGraph node uses dynamic prompt
  private async routingNode(state: CalendarState) {
    const prompt = this.regenerateLangGraphPrompt();  // ← Cache or regenerate

    const decision = await llm.complete({
      systemPrompt: prompt,
      messages: [{ role: 'user', content: state.messages[state.messages.length - 1].content }],
      tools: this.generateToolsFromRegistry()
    });

    return { ...state, routingDecision: decision };
  }
}
```

---

## 4. Auto-Discovery & Hot-Reload

### 4.1 File-Based Discovery

```typescript
class Orchestrator {
  async watchForNewSupervisors() {
    const watcher = chokidar.watch('./supervisors/**/*.js');

    watcher.on('add', async (path) => {
      logger.info(`New supervisor file detected: ${path}`);

      const SupervisorClass = await import(path);
      const supervisor = new SupervisorClass.default();

      await this.registerSupervisor(supervisor);  // ← Automatic registration!
    });

    watcher.on('change', async (path) => {
      logger.info(`Supervisor file changed: ${path}`);

      // Hot-reload: Disable old supervisor, load new one
      // ... (Implementation details)
    });
  }
}
```

### 4.2 Service Discovery (Consul)

```typescript
class Orchestrator {
  async watchConsulForSupervisors() {
    const consul = new Consul({ host: 'localhost', port: 8500 });

    const watcher = consul.watch({
      method: consul.health.service,
      options: {
        service: 'fidus-supervisor',
        passing: true
      }
    });

    watcher.on('change', async (services) => {
      for (const service of services) {
        const name = service.Service.Meta.name;

        if (!this.supervisorRegistry.get(name)) {
          logger.info(`New supervisor discovered via Consul: ${name}`);

          await this.registerSupervisor({
            name,
            serverUrl: `http://${service.Service.Address}:${service.Service.Port}`,
            transport: 'http',
            description: service.Service.Meta.description
          });
        }
      }
    });
  }
}
```

### 4.3 WebSocket Event-Driven Updates

```typescript
class CalendarSupervisor {
  async initialize() {
    // WebSocket to registry service
    const ws = new WebSocket('ws://registry-service:8080');

    ws.on('message', async (data) => {
      const event = JSON.parse(data);

      if (event.type === 'sub_agent_registered') {
        logger.info(`New sub-agent discovered: ${event.name}`);

        await this.registerSubAgent({
          name: event.name,
          serverUrl: event.serverUrl,
          description: event.description
        });

        // ← PROMPT AUTOMATICALLY UPDATED!
      }

      if (event.type === 'sub_agent_unregistered') {
        logger.info(`Sub-agent removed: ${event.name}`);

        this.subAgentRegistry.delete(event.name);
        this.cachedLangGraphPrompt = null;  // Invalidate
      }
    });
  }
}
```

---

## 5. Summary

### 5.1 Registry Benefits

| Registry | Purpose | Auto-Update |
|----------|-------|-------------|
| **Supervisor Registry** | Available supervisors + capabilities | ✅ Orchestrator Prompt |
| **Signal Registry** | Dynamic signal providers | ✅ Opportunity Detection Prompt |
| **Event Registry** | Event types + metadata | ✅ Event Handler Prompt |
| **MCP Registry** | External MCP servers + tools | ✅ Supervisor Prompts |

### 5.2 Update Flow

```
New supervisor registered
           │
           ▼
┌──────────────────────────────────┐
│ SupervisorRegistry               │
│ - register(supervisor)           │
│ - emit('supervisor_registered')  │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Orchestrator (Event Listener)    │
│ - cachedSystemPrompt = null      │
│ - promptVersion++                │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Next handleUserRequest()         │
│ - generateSystemPrompt()         │
│   → Query registry               │
│   → New prompt generated         │
│   → Cached                       │
└──────────────────────────────────┘
```

### 5.3 Key Features

- ✅ **Zero Downtime:** New components without system restart
- ✅ **Hot-Reload:** Updates without restart
- ✅ **Auto-Discovery:** File-based, Consul, WebSocket
- ✅ **Prompt Regeneration:** Automatic on registry updates
- ✅ **Plugin Architecture:** Community can add components
- ✅ **Version Management:** Versioning for debugging

---

**Navigation:** [← Signals & Events](04-signals-events-proactivity.md) | [Back to README →](README.md)

**Version History:**
- v2.1 (2025-10-27): Added Section 0 "Plugin Manager" (Architecture Completion)
- v2.0 (2025-10-27): Revised with chat insights (Dynamic Registries, Auto-Updates)
- v1.0 (2025-10-26): Initial draft
