# Orchestrator Architecture

**Version:** 2.0
**Date:** 2025-10-27

> **Navigation:** [← Supervisors](02-supervisor-architecture.md) | [Next: Signals & Events →](04-signals-events-proactivity.md)

---

## 1. Problem: Hard-Coded Orchestrator

### ❌ The Problem

```typescript
// HARD-CODED APPROACH (not good!)
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
```

**Problems:**
- ❌ New Supervisors → Code change required
- ❌ Keyword matching instead of true intent understanding
- ❌ No cross-domain reasoning
- ❌ Static graph (LangGraph nodes hard-coded)

---

## 2. Solution: Tool-Based Dynamic Orchestrator

### ✅ LLM-Orchestrated with Tool Calling

**Concept:** Orchestrator sees Supervisors as **Tools** (not as hard-coded nodes).

```typescript
class Orchestrator {
  private supervisors: Map<string, Supervisor> = new Map();

  async handleUserRequest(message: string, userId: string) {
    const userContext = await this.getUserContext(userId);

    // 1. GENERATE DYNAMIC TOOLS
    const tools = this.generateToolsFromSupervisors();

    // 2. LLM WITH TOOL CALLING
    const response = await llm.complete({
      systemPrompt: this.generateSystemPrompt(),
      messages: [
        { role: 'user', content: message }
      ],
      tools: tools,  // ← Supervisors as Tools!
      toolChoice: 'auto',
      temperature: 0.2
    });

    // 3. EXECUTE TOOL CALLS
    if (response.toolCalls && response.toolCalls.length > 0) {
      const results = await this.executeToolCalls(response.toolCalls, userContext);

      // 4. SYNTHESIS (optional)
      const finalResponse = await llm.complete({
        systemPrompt: "You are Fidus. Formulate a helpful response.",
        messages: [
          { role: 'user', content: message },
          { role: 'assistant', content: response.content, toolCalls: response.toolCalls },
          { role: 'tool', content: JSON.stringify(results) }
        ]
      });

      return finalResponse.content;
    }

    return response.content;
  }
}
```

---

## 3. Dynamic Tool Generation

### 3.1 Supervisors → Tools

```typescript
class Orchestrator {
  private generateToolsFromSupervisors(): Tool[] {
    const tools: Tool[] = [];

    for (const [name, supervisor] of this.supervisors.entries()) {
      // Supervisor exposes MCP Tools
      for (const tool of supervisor.tools) {
        tools.push({
          name: `${name}.${tool.name}`,  // e.g. "calendar.create_event"
          description: `[${name}] ${tool.description}`,
          parameters: tool.inputSchema
        });
      }
    }

    return tools;
  }

  private async executeToolCalls(toolCalls: ToolCall[], userContext: UserContext) {
    const results: Record<string, any> = {};

    for (const toolCall of toolCalls) {
      // Parse: "calendar.create_event" → supervisor="calendar", tool="create_event"
      const [supervisorName, toolName] = toolCall.name.split('.');

      const supervisor = this.supervisors.get(supervisorName);
      if (!supervisor) {
        results[toolCall.id] = { error: `Supervisor not found: ${supervisorName}` };
        continue;
      }

      // Supervisor.execute() triggers its LangGraph!
      const result = await supervisor.callTool(toolName, toolCall.parameters, userContext);

      results[toolCall.id] = result;
    }

    return results;
  }
}
```

### 3.2 Example: Tool Definition

```json
{
  "tools": [
    {
      "name": "calendar.create_event",
      "description": "[calendar] Creates a new calendar entry",
      "parameters": {
        "type": "object",
        "properties": {
          "title": { "type": "string", "description": "Event title" },
          "start": { "type": "string", "format": "date-time" },
          "duration": { "type": "number", "description": "Duration in minutes" },
          "attendees": { "type": "array", "items": { "type": "string" } }
        },
        "required": ["title", "start", "duration"]
      }
    },
    {
      "name": "calendar.find_free_slots",
      "description": "[calendar] Finds free time slots",
      "parameters": {
        "type": "object",
        "properties": {
          "duration": { "type": "number", "description": "Required duration in minutes" },
          "timeRange": {
            "type": "object",
            "properties": {
              "start": { "type": "string", "format": "date-time" },
              "end": { "type": "string", "format": "date-time" }
            }
          }
        },
        "required": ["duration"]
      }
    },
    {
      "name": "health.get_workout_progress",
      "description": "[health] Gets weekly workout progress",
      "parameters": {
        "type": "object",
        "properties": {}
      }
    }
  ]
}
```

---

## 4. Dynamic System Prompt

### 4.1 Prompt Regeneration on Registry Updates

```typescript
class Orchestrator {
  private cachedSystemPrompt: string | null = null;
  private promptVersion: number = 0;

  async registerSupervisor(supervisor: Supervisor) {
    // 1. Initialize supervisor
    await supervisor.initialize();

    // 2. Store in registry
    this.supervisors.set(supervisor.name, supervisor);

    // 3. Invalidate prompt
    this.cachedSystemPrompt = null;
    this.promptVersion++;

    logger.info(`Supervisor registered: ${supervisor.name} (prompt v${this.promptVersion})`);
  }

  private generateSystemPrompt(): string {
    if (this.cachedSystemPrompt) {
      return this.cachedSystemPrompt;
    }

    const supervisors = Array.from(this.supervisors.values());

    this.cachedSystemPrompt = `
You are Fidus, a loyal personal AI agent.

## Available Supervisors (${supervisors.length})

${supervisors.map(s => `
### ${s.name}
${s.description}

**Capabilities:**
${s.tools.map(t => `- ${t.name}: ${t.description}`).join('\n')}

**Use Cases:** ${s.useCases.join(' | ')}
`).join('\n---\n')}

## Your Workflow

1. **Understand intent:** What does the user want?
2. **Identify tools:** Which supervisor tools do I need?
3. **Multi-tool if needed:** Multiple supervisors parallel/sequential
4. **Respond:** Clear, actionable response

## Principles

- **Proactive:** Suggest optimizations
- **Context-Aware:** Use user history and preferences
- **Transparent:** Explain what you're doing
- **Learning:** Consider feedback
`;

    return this.cachedSystemPrompt;
  }
}
```

### 4.2 Example: Prompt Grows Automatically

**Initial (2 Supervisors):**
```
You are Fidus.

## Available Supervisors (2)

### calendar
Manages calendars, appointments, meetings

**Capabilities:**
- create_event: Creates calendar entry
- find_free_slots: Finds free time slots
- get_upcoming_events: Gets upcoming events

### health
Manages fitness, nutrition, health

**Capabilities:**
- get_workout_progress: Gets workout progress
- log_workout: Logs a workout
- get_nutrition_summary: Gets nutrition summary
```

**After `registerSupervisor(financeSupervisor)` (3 Supervisors):**
```
You are Fidus.

## Available Supervisors (3)

### calendar
...

### health
...

### finance  ← NEW!
Manages budget, expenses, financial planning

**Capabilities:**
- get_budget_status: Gets current budget status
- analyze_spending: Analyzes expenses
- detect_anomalies: Detects unusual expenses
```

**→ Automatic prompt update, no code change!**

---

## 5. Multi-Supervisor Coordination

### 5.1 Parallel Tool Calls

LLM can call **multiple tools simultaneously** (when task involves multiple domains):

```typescript
// User Request
"I want to work out tomorrow, find a free slot
 and check if I can still meet my weekly goal"

// LLM Response (Tool Calls)
{
  "toolCalls": [
    {
      "id": "call_1",
      "name": "calendar.find_free_slots",
      "parameters": {
        "duration": 60,
        "timeRange": { "start": "2025-10-28T00:00:00Z", "end": "2025-10-29T00:00:00Z" }
      }
    },
    {
      "id": "call_2",
      "name": "health.get_workout_progress",
      "parameters": {}
    }
  ]
}

// Orchestrator executes IN PARALLEL
const results = await Promise.all([
  calendarSupervisor.callTool('find_free_slots', { ... }),
  healthSupervisor.callTool('get_workout_progress', {})
]);

// Results
{
  "call_1": { "freeSlots": [{ "start": "2025-10-28T14:00:00Z", "end": "2025-10-28T16:00:00Z" }] },
  "call_2": { "weeklyGoal": 4, "currentWorkouts": 2, "remaining": 2 }
}

// LLM Synthesis
"Tomorrow 2-4 PM is free. You've completed 2 of 4 workouts this week –
 tomorrow you could do workout #3!"
```

### 5.2 Sequential Tool Calls

LLM can also make **sequential** tool calls (when output of call 1 is input for call 2):

```typescript
// User Request
"Create meeting tomorrow 2 PM with Maria, prepare agenda"

// LLM Response (Round 1)
{
  "toolCalls": [
    {
      "id": "call_1",
      "name": "calendar.create_event",
      "parameters": {
        "title": "Meeting with Maria",
        "start": "2025-10-28T14:00:00Z",
        "duration": 60,
        "attendees": ["maria@example.com"]
      }
    }
  ]
}

// Orchestrator executes
const result1 = await calendarSupervisor.callTool('create_event', { ... });
// result1 = { eventId: "abc123", ... }

// LLM Response (Round 2)
{
  "toolCalls": [
    {
      "id": "call_2",
      "name": "calendar.prepare_meeting",  // Sub-Agent!
      "parameters": {
        "meetingId": "abc123"
      }
    }
  ]
}

// Orchestrator executes
const result2 = await calendarSupervisor.callTool('prepare_meeting', { meetingId: "abc123" });
// result2 = { agenda: ["...", "..."], documents: [...] }

// LLM Synthesis
"Meeting created ✓ Agenda prepared ✓

 Meeting: Tomorrow 2:00 PM with Maria

 Agenda:
 1. Project status
 2. Next steps
 3. Questions & Feedback"
```

---

## 6. Advantages of Tool-Based Architecture

| Advantage | Description |
|---------|--------------|
| **Dynamic** | New supervisors → no code change, just `registerSupervisor()` |
| **Natural** | LLM understands intent instead of keyword matching |
| **Multi-Domain** | LLM can coordinate multiple supervisors (parallel/sequential) |
| **Flexible** | LLM decides at runtime which tools are needed |
| **Extensible** | Community can add supervisors → automatically available |
| **Hot-Reload** | New supervisors without system restart |

---

## 7. Comparison: Hard-Coded vs. Tool-Based

### Hard-Coded Graph (❌)

```typescript
class Orchestrator {
  async initialize() {
    this.graph.addNode("detect_intent", this.detectIntent);
    this.graph.addNode("route_to_calendar", this.routeToCalendar);
    this.graph.addNode("route_to_health", this.routeToHealth);
    // ... manually for each supervisor

    this.graph.addConditionalEdges("detect_intent", this.routeRequest, {
      "calendar": "route_to_calendar",
      "health": "route_to_health"
      // ... manually for each supervisor
    });
  }
}
```

**Problem:**
- ❌ New supervisor → code change + recompile
- ❌ Hard-coded routing logic
- ❌ Static graph

### Tool-Based (✅)

```typescript
class Orchestrator {
  async handleUserRequest(message: string, userId: string) {
    // Tools dynamically generated
    const tools = this.generateToolsFromSupervisors();

    // LLM decides
    const response = await llm.complete({
      systemPrompt: this.generateSystemPrompt(),
      messages: [{ role: 'user', content: message }],
      tools: tools,
      toolChoice: 'auto'
    });

    // Execute tool calls
    return await this.executeToolCalls(response.toolCalls);
  }
}
```

**Advantages:**
- ✅ New supervisor → just `registerSupervisor()`, no code change
- ✅ LLM decides routing
- ✅ Dynamic

---

## 8. Startup & Runtime

### 8.1 System Startup

```typescript
// main.ts
async function startFidusSystem() {
  // 1. Create orchestrator
  const orchestrator = new Orchestrator();

  // 2. Register supervisors
  await orchestrator.registerSupervisor(new CalendarSupervisor());
  await orchestrator.registerSupervisor(new HealthSupervisor());
  await orchestrator.registerSupervisor(new FinanceSupervisor());
  // ... more supervisors

  // 3. Hot-Reload Watch (optional)
  if (process.env.ENABLE_HOT_RELOAD === 'true') {
    await orchestrator.watchForNewSupervisors();
  }

  // 4. Start API Server
  const app = express();
  app.post('/api/chat', async (req, res) => {
    const { message, userId } = req.body;
    const response = await orchestrator.handleUserRequest(message, userId);
    res.json({ response });
  });

  app.listen(3000);
  logger.info('Fidus System started');
}
```

### 8.2 Runtime Hot-Reload

```typescript
class Orchestrator {
  async watchForNewSupervisors() {
    // Option 1: File-Based Discovery
    const watcher = chokidar.watch('./supervisors/**/*.js');
    watcher.on('add', async (path) => {
      const SupervisorClass = await import(path);
      await this.registerSupervisor(new SupervisorClass.default());
    });

    // Option 2: Consul Service Discovery
    const consul = new Consul();
    consul.watch('fidus-supervisor', async (service) => {
      const supervisor = await this.connectToSupervisor(service.address);
      await this.registerSupervisor(supervisor);
    });
  }
}
```

---

## 9. Summary

### Orchestrator = Tool-Based Dynamic System

```
User Request
     │
     ▼
┌──────────────────────────────────┐
│ Orchestrator                     │
│                                  │
│ 1. Generate Tools (dynamic)      │
│    → All Supervisors → Tools     │
│                                  │
│ 2. LLM + Tool Calling            │
│    → Understand intent           │
│    → Select tools                │
│    → Parallel/Sequential         │
│                                  │
│ 3. Execute Tool Calls            │
│    → Supervisor.callTool()       │
│    → Collect results             │
│                                  │
│ 4. Synthesis (optional)          │
│    → LLM combines results        │
└──────────────────────────────────┘
     │
     ▼
User Response
```

### Key Features

- ✅ **Dynamic:** New supervisors without code change
- ✅ **LLM-orchestrated:** Intelligent decisions
- ✅ **Multi-Domain:** Coordinates multiple supervisors
- ✅ **Hot-Reload:** Updates without restart
- ✅ **Registry-based:** Prompt regenerates automatically

---

**Next Document:** [Signals, Events & Proactivity →](04-signals-events-proactivity.md)

**Version History:**
- v2.0 (2025-10-27): Revised with chat insights (Tool-Based Approach)
- v1.0 (2025-10-26): Initial draft
