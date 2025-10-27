# Supervisor Architecture

**Version:** 2.0
**Date:** 2025-10-27

> **Navigation:** [← Overview](01-overview.md) | [Next: Orchestrator →](03-orchestrator-architecture.md)

---

## 1. What is a Supervisor?

A **Supervisor** is a hybrid component in the Fidus system:

```
Supervisor =
  ├── LangGraph State Machine (Multi-Step Reasoning)
  ├── MCP Server Interface (Tools, Resources, Prompts)
  ├── MCP Client (calls external MCP servers)
  └── Fidus-Specific Extensions
      ├── Signal Providers (for Proactivity Engine)
      ├── Event Emitters (for Event Bus)
      ├── Background Jobs (Monitoring)
      └── Domain State Management
```

### Supervisor ≠ MCP Server

**Important:** A Supervisor is **more** than an MCP Server:

| Feature | MCP Server (Standard) | Fidus Supervisor |
|---------|----------------------|------------------|
| Tools | ✅ | ✅ |
| Resources | ✅ | ✅ |
| Prompts | ✅ | ✅ |
| **Signal Providers** | ❌ | ✅ (Fidus-specific) |
| **Event Emitters** | ❌ | ✅ (Fidus-specific) |
| **Background Jobs** | ❌ | ✅ (Fidus-specific) |
| **LangGraph State Machine** | ❌ | ✅ (for Multi-Step Reasoning) |
| **MCP Client** | ❌ | ✅ (calls external MCP servers) |

---

## 2. Architecture of a Supervisor

### 2.1 Layer Model

```typescript
class CalendarSupervisor {
  // ┌──────────────────────────────────────┐
  // │  LAYER 1: MCP SERVER INTERFACE       │
  // │  (Standard, exposed outward)         │
  // └──────────────────────────────────────┘

  name = "calendar_supervisor";
  tools = [
    { name: "create_event", description: "Create calendar entry", ... },
    { name: "find_free_slots", description: "Find free time slots", ... }
  ];
  resources = [
    { uri: "calendar://events/today", name: "Today's appointments", ... }
  ];

  // ┌──────────────────────────────────────┐
  // │  LAYER 2: LANGGRAPH STATE MACHINE    │
  // │  (Multi-Step Reasoning)              │
  // └──────────────────────────────────────┘

  private graph: StateGraph;

  async initialize() {
    this.graph = new StateGraph({ channels: { ... } });

    // Nodes: Reasoning Steps
    this.graph.addNode("analyze_request", this.analyzeRequest);
    this.graph.addNode("check_availability", this.checkAvailability);
    this.graph.addNode("resolve_conflicts", this.resolveConflicts);
    this.graph.addNode("call_mcp_tool", this.callMCPTool);
    this.graph.addNode("respond", this.respond);

    // Edges: Workflow
    this.graph.addConditionalEdges("analyze_request", this.routeRequest, {
      "simple_query": "call_mcp_tool",
      "needs_availability": "check_availability",
      "needs_specialist": "delegate_to_specialist"
    });

    this.compiledGraph = this.graph.compile();
  }

  // ┌──────────────────────────────────────┐
  // │  LAYER 3: MCP CLIENT                 │
  // │  (Calls external MCP servers)        │
  // └──────────────────────────────────────┘

  private googleCalendarMCP: MCPClient;

  async connectExternalMCP() {
    this.googleCalendarMCP = await MCPClient.connect({
      serverUrl: 'mcp://google-calendar'
    });
  }

  // ┌──────────────────────────────────────┐
  // │  LAYER 4: FIDUS EXTENSIONS           │
  // │  (Signal Providers, Event Emitters)  │
  // └──────────────────────────────────────┘

  async registerSignals() {
    await signalRegistry.registerProvider('calendar', [
      {
        name: 'free_slots',
        collector: async () => await this.findFreeSlots({ ... })
      },
      {
        name: 'workload',
        collector: async () => await this.calculateWorkload()
      }
    ]);
  }

  async registerEvents() {
    await eventRegistry.registerEventTypes('calendar', [
      {
        type: 'calendar.meeting_cancelled',
        description: 'Meeting was cancelled',
        dataSchema: { meetingId: 'string', timeSlot: 'string' }
      }
    ]);
  }

  // ┌──────────────────────────────────────┐
  // │  LAYER 5: SUB-AGENTS                 │
  // │  (Specialized Agents)                │
  // └──────────────────────────────────────┘

  private subAgents = {
    meetingPreparation: new MeetingPreparationAgent(),
    conflictResolution: new ConflictResolutionAgent(),
    smartScheduling: new SmartSchedulingAgent()
  };

  // ┌──────────────────────────────────────┐
  // │  PUBLIC API                          │
  // │  (Called by Orchestrator)            │
  // └──────────────────────────────────────┘

  async execute(userMessage: string, userContext: UserContext) {
    // Execute LangGraph State Machine
    const finalState = await this.compiledGraph.invoke({
      messages: [{ role: 'user', content: userMessage }],
      userContext,
      currentTask: null,
      subAgentResults: {}
    });

    return finalState.messages[finalState.messages.length - 1].content;
  }
}
```

---

## 3. LangGraph State Machine

### 3.1 Why Does a Supervisor Need LangGraph?

**Problem:** Simple tool calls are insufficient for complex domain logic.

**Example:** "Find 2h slot next week for team meeting"

This request needs multiple steps:
1. Analyze: Who is on the team? (→ Sub-Agent or User Context)
2. Check availability: Query all calendars (→ External MCP)
3. Detect conflicts: Are there overlaps? (→ Business Logic)
4. Resolve conflicts: Reschedule meetings? (→ LLM Reasoning + User Approval)
5. Book slot: Create event (→ External MCP)
6. Respond: Inform user (→ Response Generation)

**→ This is a workflow, not a single function!**

### 3.2 LangGraph Nodes (Calendar Supervisor Example)

```typescript
class CalendarSupervisor {
  private async analyzeRequest(state: CalendarState) {
    const lastMessage = state.messages[state.messages.length - 1];

    // LLM analyzes request
    const analysis = await llm.complete(`
Analyze user request: "${lastMessage.content}"

Categorize:
- simple_query: Direct query (e.g. "What's tomorrow?")
- needs_availability: Requires availability check
- needs_specialist: Requires sub-agent

JSON: { type: "...", reasoning: "..." }
`);

    return { ...state, currentTask: { type: analysis.type, reasoning: analysis.reasoning } };
  }

  private async checkAvailability(state: CalendarState) {
    // MCP Call to Google Calendar
    const events = await this.googleCalendarMCP.callTool('list_events', {
      calendarId: state.userContext.calendarId,
      timeMin: state.currentTask.timeRange.start,
      timeMax: state.currentTask.timeRange.end
    });

    const freeSlots = this.calculateFreeSlots(events, state.currentTask.duration);

    return { ...state, subAgentResults: { ...state.subAgentResults, freeSlots } };
  }

  private async resolveConflicts(state: CalendarState) {
    const conflicts = state.subAgentResults.conflicts;

    // LLM reasoning: How to resolve conflicts?
    const resolution = await llm.complete(`
There are calendar conflicts:
${conflicts.map(c => `- ${c.title} at ${c.time}`).join('\n')}

User wants: ${state.currentTask.description}

Options:
1. Reschedule meeting
2. Suggest alternative time
3. Ask user

JSON: { strategy: "...", actions: [...] }
`);

    // Execute actions
    for (const action of resolution.actions) {
      if (action.type === 'reschedule') {
        await this.googleCalendarMCP.callTool('update_event', {
          eventId: action.eventId,
          updates: { start: action.newStart }
        });
      }
    }

    return { ...state, subAgentResults: { ...state.subAgentResults, resolution } };
  }
}
```

### 3.3 Conditional Edges (Workflow Routing)

```typescript
this.graph.addConditionalEdges(
  "analyze_request",
  this.routeRequest.bind(this),
  {
    "simple_query": "call_mcp_tool",
    "needs_availability": "check_availability",
    "needs_specialist": "delegate_to_specialist",
    "respond": "respond"
  }
);

this.graph.addConditionalEdges(
  "check_availability",
  this.checkIfConflicts.bind(this),
  {
    "conflicts": "resolve_conflicts",
    "no_conflicts": "call_mcp_tool"
  }
);
```

**Result:** Dynamic workflow that adapts to situation!

---

## 4. Sub-Agents Management

Supervisors can have **specialized sub-agents** (which are also LangGraph agents):

```typescript
class CalendarSupervisor {
  private subAgents = {
    meetingPreparation: new MeetingPreparationAgent(),
    conflictResolution: new ConflictResolutionAgent(),
    smartScheduling: new SmartSchedulingAgent()
  };

  // LangGraph Node
  private async delegateToSpecialist(state: CalendarState) {
    // Decide which sub-agent
    const specialist = this.selectSubAgent(state.currentTask);

    // Sub-agent also has its own LangGraph!
    const result = await specialist.execute(state);

    return { ...state, subAgentResults: { specialist: result } };
  }

  // Dynamic Sub-Agent Registration
  async registerSubAgent(config: SubAgentConfig) {
    const client = await MCPClient.connect({
      serverUrl: config.serverUrl
    });

    const tools = await client.listTools();

    this.subAgentRegistry.set(config.name, {
      client,
      description: config.description,
      tools
    });

    // ← REGENERATE PROMPT!
    this.cachedLangGraphPrompt = null;
    this.regenerateLangGraphPrompts();

    logger.info(`Sub-agent registered: ${config.name}`);
  }
}
```

### Sub-Agent Hierarchy

```
Orchestrator (LangGraph)
    │
    ├─ Calendar Supervisor (LangGraph)
    │   ├─ Meeting Preparation Agent (LangGraph)
    │   ├─ Conflict Resolution Agent (LangGraph)
    │   └─ Smart Scheduling Agent (LangGraph)
    │
    ├─ Health Supervisor (LangGraph)
    │   ├─ Workout Planning Agent (LangGraph)
    │   └─ Nutrition Tracking Agent (LangGraph)
    │
    └─ Finance Supervisor (LangGraph)
        ├─ Budget Analysis Agent (LangGraph)
        └─ Investment Advisor Agent (LangGraph)
```

**Each agent = its own LangGraph state machine!**

---

## 5. Fidus-Specific Extensions

### 5.1 Signal Providers (for Proactivity)

**Concept:** Supervisors provide data that the Proactivity Engine collects periodically.

```typescript
class CalendarSupervisor {
  async registerSignals() {
    await signalRegistry.registerProvider('calendar', [
      {
        name: 'free_slots',
        description: 'Free time slots today/tomorrow',
        collector: async () => {
          const events = await this.googleCalendarMCP.callTool('list_events', {
            timeMin: new Date(),
            timeMax: addDays(new Date(), 2)
          });

          return this.calculateFreeSlots(events);
        }
      },
      {
        name: 'workload',
        description: 'Meeting load this/next week',
        collector: async () => {
          const thisWeek = await this.getMeetingsThisWeek();
          const nextWeek = await this.getMeetingsNextWeek();

          return {
            thisWeekHours: calculateHours(thisWeek),
            nextWeekHours: calculateHours(nextWeek),
            trend: calculateTrend(thisWeek, nextWeek)
          };
        }
      }
    ]);
  }
}
```

**Usage:**
- Proactivity Engine collects these signals every 5-10 min
- LLM analyzes: "User has tomorrow 2-4pm free + workout goal 4x/week → Suggestion!"

### 5.2 Event Emitters (for Event Bus)

**Concept:** Supervisors publish events that other components can subscribe to.

```typescript
class CalendarSupervisor {
  async registerEvents() {
    await eventRegistry.registerEventTypes('calendar', [
      {
        type: 'calendar.meeting_cancelled',
        description: 'A meeting was cancelled',
        dataSchema: { meetingId: 'string', timeSlot: 'string', attendees: 'string[]' }
      },
      {
        type: 'calendar.meeting_starts_soon',
        description: 'Meeting starts in 10 minutes',
        dataSchema: { meetingId: 'string', title: 'string', location: 'string' }
      }
    ]);
  }

  // Background Job: Checks regularly for upcoming meetings
  private backgroundJobs = {
    checkUpcomingMeetings: {
      interval: '*/10 * * * *',  // Every 10 min
      handler: async () => {
        const upcoming = await this.getUpcomingMeetings(30);

        for (const meeting of upcoming) {
          // Publish event!
          await eventBus.publish({
            type: 'calendar.meeting_starts_soon',
            data: { meeting, minutesUntil: 25 }
          });
        }
      }
    }
  };
}
```

**Flow:**
1. Background job detects: Meeting starts in 25 min
2. Event is published to Event Bus
3. Proactivity Engine receives event
4. LLM decides: Relevant? → Yes, user is not at meeting location
5. Notification: "Meeting starts in 25 min, 15 min travel time → leave now!"

### 5.3 Background Jobs

**Concept:** Supervisors can run scheduled tasks (monitoring, detection).

```typescript
class HealthSupervisor {
  private backgroundJobs = {
    checkWorkoutStreak: {
      interval: '0 20 * * *',  // Every day at 8pm
      handler: async () => {
        const user = await this.getUserHealthData();

        if (user.workoutsThisWeek < user.weeklyGoal) {
          await eventBus.publish({
            type: 'health.workout_goal_at_risk',
            data: {
              current: user.workoutsThisWeek,
              goal: user.weeklyGoal,
              remaining: user.weeklyGoal - user.workoutsThisWeek
            }
          });
        }
      }
    },

    syncWithAppleHealth: {
      interval: '*/15 * * * *',  // Every 15 min
      handler: async () => {
        await this.syncHealthData();
      }
    }
  };
}
```

---

## 6. Supervisor as Plugin (Deployment Model)

### 6.1 Supervisor = Plugin

In the Fidus system, Supervisors are deployed as **plugins**:

```
┌─────────────────────────────────────────┐
│         Supervisor Plugin               │
├─────────────────────────────────────────┤
│ - Implements Plugin Interface           │
│ - Declares Dependencies                 │
│ - Registers Services                    │
│ - Lifecycle: initialize()               │
└─────────────────────────────────────────┘
         │
         ├─ Registers with SupervisorRegistry
         ├─ Registers Signals with SignalRegistry
         ├─ Registers Events with EventRegistry
         └─ Starts Background Jobs
```

### 6.2 Plugin Interface

Every Supervisor implements the `Plugin` interface:

```typescript
interface Plugin {
  name: string;                    // e.g. "calendar-supervisor"
  version: string;                 // e.g. "1.0.0"
  type: 'supervisor';              // Plugin type

  // Dependencies to other plugins
  dependencies?: string[];         // e.g. ['user-profiling', 'neo4j']

  // Services the supervisor provides
  getServices(): ServiceProvider[];

  // Lifecycle
  initialize(): Promise<void>;
  shutdown?(): Promise<void>;
}
```

### 6.3 Example: Calendar Supervisor as Plugin

```typescript
// Conceptual example (logical level)
class CalendarSupervisorPlugin implements Plugin {
  name = 'calendar-supervisor';
  version = '1.0.0';
  type = 'supervisor';

  // Declare dependencies
  dependencies = ['user-profiling'];  // Needs UserProfile service

  // Register services
  getServices(): ServiceProvider[] {
    return [{
      name: 'calendarSupervisor',
      dependencies: ['userProfile'],  // Service-level dependencies
      initialize: async (deps) => {
        // CalendarSupervisor receives UserProfile injected
        return new CalendarSupervisor(deps['userProfile']);
      }
    }];
  }

  // Lifecycle: Initialization
  async initialize(): Promise<void> {
    const supervisor = /* get from ServiceRegistry */;

    // 1. Compile LangGraph
    await supervisor.compileLangGraph();

    // 2. Connect external MCP servers
    await supervisor.connectExternalMCP();

    // 3. Register signals
    await supervisor.registerSignals();

    // 4. Register events
    await supervisor.registerEvents();

    // 5. Start background jobs
    await supervisor.startBackgroundJobs();

    // 6. Initialize sub-agents
    await supervisor.initializeSubAgents();

    console.log('Calendar Supervisor initialized');
  }

  // Optional: Cleanup
  async shutdown(): Promise<void> {
    const supervisor = /* get from ServiceRegistry */;

    // Stop background jobs
    await supervisor.stopBackgroundJobs();

    // Close MCP connections
    await supervisor.disconnectExternalMCP();

    console.log('Calendar Supervisor shutdown');
  }
}
```

### 6.4 Discovery & Loading

**Automatic Discovery:**
1. PluginManager discovers all Supervisor plugins (file-based or NPM)
2. Dependency graph is created
3. Plugins are initialized in correct order
4. Supervisor is available to Orchestrator

**Flow:**
```
PluginManager.discoverPlugins()
  ↓
Plugin file found: calendar-supervisor.plugin.ts
  ↓
Dependency check: ['user-profiling'] available?
  ↓
CalendarSupervisorPlugin.initialize()
  ↓
Service 'calendarSupervisor' registered with ServiceRegistry
  ↓
Orchestrator can use Supervisor
```

### 6.5 Advantages of Plugin Model

| Advantage | Description |
|-----------|-------------|
| **Dynamic Loading** | Supervisors don't need to be hard-coded |
| **Dependency Resolution** | Automatic ordering (e.g. UserProfiling before Supervisors) |
| **Hot-Reload** | Add new Supervisors without restart |
| **Community-Extensible** | NPM packages can bring their own Supervisors |
| **Testability** | Supervisors can be tested in isolation |
| **Deployment Flexibility** | Same code for Community/Cloud/Enterprise |

### 6.6 Community Supervisors

**Concept:** Community can develop their own domain Supervisors and publish as NPM packages.

**Example: Crypto Trading Supervisor**
```typescript
// NPM Package: @fidus-community/crypto-trading-supervisor

class CryptoTradingSupervisorPlugin implements Plugin {
  name = 'crypto-trading-supervisor';
  type = 'supervisor';
  dependencies = ['user-profiling'];

  // ... Rest as above
}

// User installs:
// npm install @fidus-community/crypto-trading-supervisor

// PluginManager discovers automatically:
// - Searches for NPM packages with pattern @fidus-community/*
// - Loads plugin
// - Supervisor is available!
```

**Orchestrator recognizes automatically:**
```
User: "Buy 0.1 BTC if price drops below 40k"

Orchestrator asks PluginManager:
  → Which Supervisors are available?
  → Tools: [..., crypto-trading.place_order, ...]

LLM decides:
  → Tool: crypto-trading.place_order

Orchestrator calls:
  → CryptoTradingSupervisor.execute(...)
```

---

## 7. Summary

### Supervisor Capabilities

| Feature | Description | Why? |
|---------|-------------|------|
| **LangGraph State Machine** | Multi-step reasoning workflows | Complex domain logic |
| **MCP Server Interface** | Expose tools/resources/prompts | Standardized API |
| **MCP Client** | Calls external MCP servers | Integration with 3rd party |
| **Signal Providers** | Data for Proactivity Engine | Opportunity detection |
| **Event Emitters** | Publishes events to bus | Real-time proactivity |
| **Background Jobs** | Scheduled monitoring tasks | Proactive event detection |
| **Sub-Agents** | Specialized agents | Modular complexity |
| **Domain State** | In-memory state management | Performance & offline |

### Lifecycle of a Supervisor

```
1. Initialization
   ├─ Compile LangGraph
   ├─ Connect external MCP servers
   ├─ Register signals (→ Signal Registry)
   ├─ Register events (→ Event Registry)
   ├─ Start background jobs
   └─ Initialize sub-agents

2. Runtime
   ├─ execute() called by Orchestrator
   │  └─ LangGraph state machine runs
   │     ├─ Nodes: Reasoning steps
   │     ├─ MCP calls (External + Sub-Agents)
   │     └─ Return result
   │
   ├─ Background jobs run
   │  └─ Publish events when needed
   │
   └─ Signal collectors
      └─ Called by Proactivity Engine

3. Updates
   ├─ Register new sub-agents
   │  └─ Regenerate prompt
   ├─ Connect new external MCP servers
   │  └─ Update tools
   └─ Hot-reload without restart
```

---

**Next Document:** [Orchestrator Architecture →](03-orchestrator-architecture.md)

**Version History:**
- v2.1 (2025-10-27): Added Section 6 "Supervisor as Plugin" (Architecture Completion)
- v2.0 (2025-10-27): Revised with chat insights
- v1.0 (2025-10-26): Initial draft
